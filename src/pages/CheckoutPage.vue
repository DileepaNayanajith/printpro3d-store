<script setup lang="ts">
import { trackShipping, recordOrder } from '../lib/ga4'
import { metaOrderSubmitted } from '../lib/meta-pixel'
import { productSku } from '../data/catalog'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, BanknotesIcon, CheckCircleIcon, LockClosedIcon, MapPinIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
const router = useRouter()
const details = reactive({ fullName: '', phone: '', email: '', address: '', city: '', district: '', notes: '', payment: 'cod' })
const formatPrice = (value: number) => `Rs. ${value.toLocaleString()}`
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
    metaOrderSubmitted(result.reference,cart.items,deliveryFee.value)
    cart.clearCart()
    localStorage.removeItem('oms-checkout-pending')
    await router.push('/success')
  } catch (e) { error.value = e instanceof Error ? e.message : 'Could not save your order. Your cart is saved.' }
  finally { submitting.value = false }
}
</script>

<template>
  <div class="checkout-page min-h-screen bg-slate-50 px-5 py-12 text-slate-900 sm:px-8 lg:py-16">
    <form class="mx-auto max-w-7xl" @submit.prevent="placeOrder">
      <router-link to="/cart" class="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"><ArrowLeftIcon class="h-4 w-4" /> Back to cart</router-link>
      <div class="mt-7"><p class="section-kicker">Secure checkout</p><h1 class="section-title">Complete your order</h1><p class="mt-4 text-slate-600">Enter your delivery details and review your items.</p></div>

      <p class="mt-5 text-sm text-slate-600"><router-link to="/account" class="text-blue-600 underline">Sign in or create an account</router-link> before ordering to see tracking and request returns. Guest checkout is also available.</p>
      <div class="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        <div class="space-y-6">
          <section class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8">
            <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-100/10 text-blue-600"><MapPinIcon class="h-6 w-6" /></span><div><p class="text-xs font-bold uppercase tracking-widest text-blue-600">Step 1</p><h2 class="text-xl font-black">Delivery details</h2></div></div>
            <div class="mt-7 grid gap-5 sm:grid-cols-2">
              <label class="field-label sm:col-span-2">Full name *<input v-model="details.fullName" required autocomplete="name" class="checkout-field" placeholder="Your full name" /></label>
              <label class="field-label">Phone number *<input v-model="details.phone" required type="tel" autocomplete="tel" class="checkout-field" placeholder="07X XXX XXXX" /></label>
              <label class="field-label">Email address (optional)<input v-model="details.email" type="email" autocomplete="email" class="checkout-field" placeholder="you@example.com" /></label>
              <label class="field-label sm:col-span-2">Delivery address *<textarea v-model="details.address" required autocomplete="street-address" rows="3" class="checkout-field resize-none" placeholder="House number, street and area"></textarea></label>
              <label class="field-label">City *<input v-model="details.city" required autocomplete="address-level2" class="checkout-field" placeholder="Your city" /></label>
              <label class="field-label">District *<select v-model="details.district" required class="checkout-field"><option value="" disabled>Select district</option><option>Colombo</option><option>Gampaha</option><option>Kalutara</option><option>Kandy</option><option>Galle</option><option>Matara</option><option>Kurunegala</option><option>Other</option></select></label>
              <label class="field-label sm:col-span-2">Order notes<textarea v-model="details.notes" rows="2" class="checkout-field resize-none" placeholder="Optional delivery instructions"></textarea></label>
            </div>
          </section>

          <section class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8">
            <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-100/10 text-blue-600"><BanknotesIcon class="h-6 w-6" /></span><div><p class="text-xs font-bold uppercase tracking-widest text-blue-600">Step 2</p><h2 class="text-xl font-black">Payment method</h2></div></div>
            <div class="mt-7 grid gap-3 sm:grid-cols-2">
              <label :class="['flex cursor-pointer items-center gap-3 rounded-2xl border p-5 transition', details.payment === 'cod' ? 'border-cyan-400 bg-blue-100/10' : 'border-slate-200 bg-white']"><input v-model="details.payment" type="radio" value="cod" class="accent-blue-600" /><div><p class="font-bold">Cash on delivery</p><p class="mt-1 text-xs text-slate-500">Pay on arrival · Rs. 400 delivery</p></div></label>
              <label :class="['flex cursor-pointer items-center gap-3 rounded-2xl border p-5 transition', details.payment === 'bank' ? 'border-cyan-400 bg-blue-100/10' : 'border-slate-200 bg-white']"><input v-model="details.payment" type="radio" value="bank" class="accent-blue-600" /><div><p class="font-bold">Bank deposit</p><p class="mt-1 text-xs text-emerald-700">Free delivery</p></div></label>
            </div>
          <p v-if="details.payment === 'bank'" class="mt-5 rounded-xl bg-blue-100/10 p-4 text-sm leading-6">Cash on delivery: Rs. 0. After placing your order, send your order ID and payment slip to WhatsApp <strong>0721272082</strong>. We’ll confirm payment before dispatch.</p>
          </section>
        </div>

        <aside class="rounded-[2rem] border border-slate-200 bg-white p-6 lg:sticky lg:top-40 sm:p-7">
          <h2 class="text-xl font-black">Order summary</h2>
          <div class="mt-6 max-h-72 space-y-4 overflow-auto pr-1">
            <div v-for="item in cart.items" :key="`${item.id}:${item.color}`" class="flex gap-3">
              <div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1"><img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-lg object-contain" /><span class="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-blue-100 px-1 text-[10px] font-black text-slate-950">{{ item.quantity }}</span></div>
              <div class="min-w-0 flex-1"><p class="truncate text-sm font-bold">{{ item.title }}</p><p class="mt-1 text-xs text-slate-500">SKU: {{ productSku(item) }}</p><p v-if="item.color" class="mt-1 text-xs text-blue-700">Colour: {{ item.color }}</p><p class="mt-1 text-xs text-slate-500">{{ formatPrice(item.price) }} each</p></div><p class="text-sm font-bold">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>
          <div class="my-6 border-t border-slate-200"></div>
          <div class="space-y-3 text-sm"><div class="flex justify-between text-slate-600"><span>Subtotal</span><span class="font-semibold text-slate-900">{{ formatPrice(cart.totalPrice) }}</span></div><div class="flex justify-between text-slate-600"><span>Delivery</span><span :class="['font-semibold', deliveryFee === 0 ? 'text-emerald-700' : 'text-slate-900']">{{ deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee) }}</span></div></div>
          <div class="my-6 border-t border-slate-200"></div>
          <div class="flex items-end justify-between"><span class="font-bold">Total</span><span class="text-2xl font-black text-blue-600">{{ formatPrice(orderTotal) }}</span></div>
          <button type="submit" :disabled="!cart.items.length || submitting" class="primary-button mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40"><CheckCircleIcon class="h-5 w-5" /> {{ submitting ? 'Saving order…' : 'Place order' }}</button>
          <p v-if="error" role="alert" class="mt-4 text-sm text-red-600">{{ error }}</p>
          <p class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><LockClosedIcon class="h-4 w-4" /> Your details are handled securely</p>
          <p class="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500"><TruckIcon class="h-4 w-4" /> Islandwide delivery</p>
        </aside>
      </div>
    </form>
  </div>
</template>

<style scoped>
.field-label { display: flex; flex-direction: column; gap: .6rem; color: #334155; font-size: .875rem; font-weight: 700; }
.checkout-field { width: 100%; border: 1px solid #e2e8f0; border-radius: 1rem; background: #fff; padding: .9rem 1rem; color: #0f172a; font-weight: 500; outline: none; transition: border-color .2s, box-shadow .2s; }
.checkout-field::placeholder { color: #475569; }
.checkout-field:focus { border-color: #22d3ee; box-shadow: 0 0 0 3px rgba(34,211,238,.1); }
</style>
