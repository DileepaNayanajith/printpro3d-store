<script setup lang="ts">
import { trackShipping, recordOrder } from '../lib/ga4'
import { productSku } from '../data/catalog'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, BanknotesIcon, CheckCircleIcon, ChevronDownIcon, LockClosedIcon, MapPinIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { formatLkr } from '../lib/format'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
const router = useRouter()
const details = reactive({ fullName: '', phone: '', email: '', address: '', city: '', district: '', notes: '', payment: 'cod' })
const formatPrice = formatLkr
const summary = ref<HTMLElement | null>(null)
const showSummary = () => summary.value?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
const deliveryFee = computed(() => details.payment === 'cod' ? 400 : 0)
const orderTotal = computed(() => cart.totalPrice + deliveryFee.value)

const submitting = ref(false)
const error = ref('')
const placeOrder = async () => {
  if (submitting.value) return
  if (!cart.items.length) return router.push('/products')
  submitting.value = true; error.value = ''
  try {
    trackShipping(cart.items)
    const payload = { ...details, items: cart.items.map(item => ({id:item.id, quantity:item.quantity, color:item.color})), expected_total_cents: Math.round(orderTotal.value*100) }
    const fingerprint = JSON.stringify(payload)
    let pending: {fingerprint:string, key:string} | null = null
    try { pending = JSON.parse(localStorage.getItem('oms-checkout-pending') || 'null') } catch {}
    if (!pending || pending.fingerprint !== fingerprint) {
      pending = {fingerprint, key:crypto.randomUUID()}
      localStorage.setItem('oms-checkout-pending',JSON.stringify(pending))
    }
    const response = await fetch('/api/checkout', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...payload,request_id:pending.key})})
    const result = await response.json()
    if (!response.ok || !result.reference) throw new Error(result.error || 'Could not save your order. Please try again.')
    sessionStorage.setItem('oms-order-receipt',JSON.stringify({...result,payment:details.payment,total:orderTotal.value}))
    recordOrder(result.reference,cart.items,deliveryFee.value,details.payment)
    cart.clearCart()
    localStorage.removeItem('oms-checkout-pending')
    await router.push('/success')
  } catch (e) { error.value = e instanceof Error ? e.message : 'Could not save your order. Your cart is saved.' }
  finally { submitting.value = false }
}
</script>

<template>
  <div class="checkout-page container-store page-pad">
    <form @submit.prevent="placeOrder">
      <router-link to="/cart" class="back-link"><ArrowLeftIcon aria-hidden="true" /> Back to cart</router-link>
      <div class="mt-3"><h1 class="page-title">Checkout</h1><p class="mt-2 text-ink-2">Enter your delivery details and review your items.</p></div>

      <button v-if="cart.items.length" type="button" class="checkout-total-toggle" @click="showSummary">
        <span>Order total <span class="text-ink-3">· {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}</span></span>
        <span class="flex items-center gap-1.5 font-extrabold text-ink tabular-nums">{{ formatPrice(orderTotal) }}<ChevronDownIcon class="h-4 w-4 text-ink-3" aria-hidden="true" /></span>
      </button>

      <p class="mt-4 rounded-[var(--pp-radius-sm)] border border-line bg-surface px-4 py-3 text-sm leading-6 text-ink-2"><router-link to="/account" class="text-link">Sign in or create an account</router-link> before ordering to see tracking and request returns. Guest checkout is also available.</p>

      <div class="checkout-layout">
        <div class="grid min-w-0 gap-5">
          <section class="panel" aria-labelledby="delivery-heading">
            <div class="checkout-step"><span aria-hidden="true"><MapPinIcon /></span><div><p class="eyebrow">Step 1</p><h2 id="delivery-heading" class="text-lg font-bold text-ink">Delivery details</h2></div></div>
            <div class="checkout-fields">
              <label class="field-label sm:col-span-2">Full name *<input v-model="details.fullName" required autocomplete="name" class="checkout-field" placeholder="Your full name" /></label>
              <label class="field-label">Phone number *<input v-model="details.phone" required type="tel" autocomplete="tel" class="checkout-field" placeholder="07X XXX XXXX" /></label>
              <label class="field-label">Email address (optional)<input v-model="details.email" type="email" autocomplete="email" class="checkout-field" placeholder="you@example.com" /></label>
              <label class="field-label sm:col-span-2">Delivery address *<textarea v-model="details.address" required autocomplete="street-address" rows="3" class="checkout-field" placeholder="House number, street and area"></textarea></label>
              <label class="field-label">City *<input v-model="details.city" required autocomplete="address-level2" class="checkout-field" placeholder="Your city" /></label>
              <label class="field-label">District *<select v-model="details.district" required class="checkout-field"><option value="" disabled>Select district</option><option>Colombo</option><option>Gampaha</option><option>Kalutara</option><option>Kandy</option><option>Galle</option><option>Matara</option><option>Kurunegala</option><option>Other</option></select></label>
              <label class="field-label sm:col-span-2">Order notes<textarea v-model="details.notes" rows="2" class="checkout-field" placeholder="Optional delivery instructions"></textarea></label>
            </div>
          </section>

          <section class="panel" aria-labelledby="payment-heading">
            <div class="checkout-step"><span aria-hidden="true"><BanknotesIcon /></span><div><p class="eyebrow">Step 2</p><h2 id="payment-heading" class="text-lg font-bold text-ink">Payment method</h2></div></div>
            <div class="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="payment-heading">
              <label class="payment-option"><input v-model="details.payment" type="radio" name="payment" value="cod" /><span><span class="block font-bold text-ink">Cash on delivery</span><span class="mt-0.5 block text-xs text-ink-3">Pay on arrival · Rs. 400 delivery</span></span></label>
              <label class="payment-option"><input v-model="details.payment" type="radio" name="payment" value="bank" /><span><span class="block font-bold text-ink">Bank deposit</span><span class="mt-0.5 block text-xs font-semibold text-success">Free delivery</span></span></label>
            </div>
            <transition name="fade"><p v-if="details.payment === 'bank'" class="mt-4 rounded-[var(--pp-radius-sm)] bg-accent-soft p-4 text-sm leading-6 text-[var(--pp-on-accent-soft)]">Cash on delivery: Rs. 0. After placing your order, send your order ID and payment slip to WhatsApp <strong>0721272082</strong>. We’ll confirm payment before dispatch.</p></transition>
          </section>
        </div>

        <aside id="order-summary" ref="summary" class="panel checkout-summary" aria-labelledby="summary-heading">
          <h2 id="summary-heading" class="text-lg font-bold text-ink">Order summary</h2>
          <ul class="mt-2 grid max-h-80 gap-4 overflow-auto pr-2 pt-2">
            <li v-for="item in cart.items" :key="`${item.id}:${item.color}`" class="flex gap-3">
              <div class="relative h-16 w-16 shrink-0 rounded-[var(--pp-radius-sm)] bg-well"><img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-[var(--pp-radius-sm)] object-contain p-1.5 mix-blend-multiply" /><span class="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-extrabold text-canvas" :aria-label="`Quantity ${item.quantity}`">{{ item.quantity }}</span></div>
              <div class="min-w-0 flex-1"><p class="text-sm font-bold leading-snug text-ink">{{ item.title }}</p><p class="mt-1 break-all text-xs text-ink-3">SKU: {{ productSku(item) }}</p><p v-if="item.color" class="mt-0.5 text-xs font-semibold text-ink-2">Colour: {{ item.color }}</p><p class="mt-0.5 text-xs text-ink-3 tabular-nums">{{ formatPrice(item.price) }} each</p></div>
              <p class="text-sm font-bold text-ink tabular-nums">{{ formatPrice(item.price * item.quantity) }}</p>
            </li>
          </ul>
          <p v-if="!cart.items.length" class="mt-4 text-sm text-ink-2">Your cart is empty. <router-link to="/products" class="text-link">Browse products</router-link></p>
          <div class="my-5 border-t border-line"></div>
          <dl class="grid gap-3 text-sm"><div class="flex justify-between gap-4 text-ink-2"><dt>Subtotal</dt><dd class="font-semibold text-ink tabular-nums">{{ formatPrice(cart.totalPrice) }}</dd></div><div class="flex justify-between gap-4 text-ink-2"><dt>Delivery</dt><dd :class="['font-semibold tabular-nums', deliveryFee === 0 ? 'text-success' : 'text-ink']">{{ deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee) }}</dd></div></dl>
          <div class="my-5 border-t border-line"></div>
          <div class="flex items-end justify-between gap-4"><span class="font-bold text-ink">Total</span><span class="text-2xl font-extrabold tracking-tight text-ink tabular-nums">{{ formatPrice(orderTotal) }}</span></div>
          <button type="submit" :disabled="!cart.items.length || submitting" class="btn btn-buy btn-lg btn-block mt-5"><CheckCircleIcon aria-hidden="true" /> {{ submitting ? 'Saving order…' : 'Place order' }}</button>
          <p v-if="error" role="alert" class="mt-4 rounded-[var(--pp-radius-sm)] bg-[color-mix(in_oklab,var(--pp-danger)_10%,transparent)] p-3 text-sm font-semibold text-danger">{{ error }}</p>
          <p class="mt-4 flex items-center justify-center gap-2 text-xs text-ink-3"><LockClosedIcon class="h-4 w-4" aria-hidden="true" /> Your details are handled securely</p>
          <p class="mt-1.5 flex items-center justify-center gap-2 text-xs text-ink-3"><TruckIcon class="h-4 w-4" aria-hidden="true" /> Islandwide delivery</p>
        </aside>
      </div>
    </form>
  </div>
</template>

<style scoped>
.checkout-total-toggle { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1rem; min-height: 3rem; padding: 0.625rem 1rem; border: 1px solid var(--pp-line); border-radius: var(--pp-radius-sm); background: var(--pp-surface); color: var(--pp-ink-2); font-size: 0.875rem; font-weight: 650; text-align: left; }
@media (min-width: 1024px) { .checkout-total-toggle { display: none; } }
.checkout-layout { display: grid; gap: 1.25rem; margin-top: 1.25rem; align-items: start; }
@media (min-width: 1024px) { .checkout-layout { grid-template-columns: minmax(0, 1fr) minmax(21rem, 25rem); gap: 2rem; } .checkout-summary { position: sticky; top: calc(var(--pp-header-h) + 1.5rem); } }
.checkout-step { display: flex; align-items: center; gap: 0.75rem; }
.checkout-step > span { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; flex-shrink: 0; border-radius: 10px; background: var(--pp-accent-soft); color: var(--pp-accent); }
.checkout-step svg { width: 1.25rem; height: 1.25rem; }
.checkout-fields { display: grid; gap: 1rem; margin-top: 1.25rem; }
@media (min-width: 640px) { .checkout-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.125rem 1rem; } }
.payment-option { display: flex; min-height: 4.25rem; cursor: pointer; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; border: 1px solid var(--pp-line-strong); border-radius: 12px; background: var(--pp-field); transition: border-color 0.18s, background-color 0.18s, box-shadow 0.18s; }
.payment-option:hover { border-color: var(--pp-ink-3); }
.payment-option:has(input:checked) { border-color: var(--pp-accent); background: var(--pp-accent-soft); box-shadow: inset 0 0 0 1px var(--pp-accent); }
.payment-option:has(input:focus-visible) { outline: 2px solid var(--pp-focus); outline-offset: 2px; }
.payment-option input { width: 1.125rem; height: 1.125rem; flex-shrink: 0; accent-color: var(--pp-accent-fill); }
.payment-option input:focus-visible { outline: none; }
</style>
