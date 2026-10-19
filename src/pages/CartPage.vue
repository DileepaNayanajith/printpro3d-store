<script setup lang="ts">
import { productSku } from '../data/catalog'
import { ArrowLeftIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon, TruckIcon } from '@heroicons/vue/24/outline'
import catalog from '../data/products.json'
import { categoryName } from '../data/categories'
import { formatLkr as formatPrice } from '../lib/format'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
// Mirrors the cart store limit (listed stock or 99, shared across colours) to disable "+" at the ceiling.
const limitFor = (id: number) => Math.min(catalog.find(product => product.id === id)?.stock ?? 99, 99)
const totalFor = (id: number) => cart.items.filter(item => item.id === id).reduce((total, item) => total + item.quantity, 0)
const atLimit = (id: number) => totalFor(id) >= limitFor(id)
</script>

<template>
  <div class="cart-page container-store page-pad">
    <router-link to="/products" class="back-link"><ArrowLeftIcon aria-hidden="true" /> Continue shopping</router-link>

    <div class="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
      <h1 class="page-title">Shopping cart</h1>
      <p v-if="cart.items.length" class="text-sm font-semibold text-ink-2">{{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}</p>
    </div>

    <div v-if="!cart.items.length" class="mt-8 rounded-[var(--pp-radius)] border border-dashed border-line-strong px-6 py-16 text-center">
      <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent"><ShoppingBagIcon class="h-7 w-7" aria-hidden="true" /></span>
      <h2 class="mt-5 text-xl font-bold text-ink">Your cart is waiting</h2>
      <p class="mx-auto mt-2 max-w-md leading-7 text-ink-2">Explore our collection and add something exciting to your next build.</p>
      <router-link to="/products" class="btn btn-primary mt-6">Explore products</router-link>
    </div>

    <div v-else class="cart-layout">
      <section aria-label="Cart items">
        <p v-if="cart.items.some(item => item.id === 8)" class="mb-4 rounded-[var(--pp-radius-sm)] bg-accent-soft p-4 text-sm leading-6 text-[var(--pp-on-accent-soft)]">3 or more racks: Rs. 1,750 each, including mixed colours. Bank deposit delivery is free; COD delivery is Rs. 400.</p>
        <ul class="divide-y divide-line rounded-[var(--pp-radius)] border border-line bg-surface">
          <li v-for="item in cart.items" :key="`${item.id}:${item.color}`" class="cart-line">
            <router-link :to="`/products/${item.id}`" class="cart-thumb" tabindex="-1" aria-hidden="true">
              <img :src="item.thumbnail" :alt="item.title" />
            </router-link>
            <div class="min-w-0">
              <p class="eyebrow !tracking-[0.1em]">{{ categoryName(item.category) }}</p>
              <router-link :to="`/products/${item.id}`" class="mt-1 block font-bold leading-snug text-ink hover:text-accent">{{ item.title }}</router-link>
              <p class="mt-1 break-all text-xs text-ink-3">SKU: {{ productSku(item) }}</p>
              <p v-if="item.color" class="mt-0.5 text-sm font-semibold text-ink-2">Colour: {{ item.color }}</p>
              <p class="mt-0.5 text-sm text-ink-2 tabular-nums">{{ formatPrice(item.price) }} each</p>
            </div>
            <div class="cart-line-controls">
              <div class="stepper" role="group" :aria-label="`Quantity for ${item.title}${item.color ? ` (${item.color})` : ''}`">
                <button type="button" @click="cart.decreaseQuantity(item.id, item.color)" :aria-label="item.quantity === 1 ? `Remove ${item.title}` : 'Decrease quantity'"><MinusIcon aria-hidden="true" /></button>
                <output aria-live="polite">{{ item.quantity }}</output>
                <button type="button" @click="cart.increaseQuantity(item.id, item.color)" :disabled="atLimit(item.id)" aria-label="Increase quantity"><PlusIcon aria-hidden="true" /></button>
              </div>
              <p class="text-base font-extrabold text-ink tabular-nums">{{ formatPrice(item.price * item.quantity) }}</p>
              <button type="button" @click="cart.removeFromCart(item.id, item.color)" class="cart-remove" :aria-label="`Remove ${item.title}`" title="Remove"><TrashIcon aria-hidden="true" /><span class="hidden sm:inline">Remove</span></button>
              <p v-if="atLimit(item.id) && limitFor(item.id) < 99" class="cart-limit">Only {{ limitFor(item.id) }} available</p>
            </div>
          </li>
        </ul>
      </section>

      <aside class="panel cart-summary" aria-labelledby="summary-heading">
        <h2 id="summary-heading" class="text-lg font-bold text-ink">Order summary</h2>
        <dl class="mt-4 grid gap-3 text-sm">
          <div class="flex justify-between gap-4 text-ink-2"><dt>Items ({{ cart.totalItems }})</dt><dd class="font-semibold text-ink tabular-nums">{{ formatPrice(cart.totalPrice) }}</dd></div>
          <div class="flex justify-between gap-4 text-ink-2"><dt>Delivery</dt><dd class="text-right font-semibold text-success">Calculated at checkout</dd></div>
        </dl>
        <p class="mt-2 text-xs leading-5 text-ink-3">Cash on delivery: Rs. 400 · Bank deposit: free delivery</p>
        <div class="my-4 border-t border-line"></div>
        <div class="flex items-end justify-between gap-4"><span class="font-bold text-ink">Total</span><span class="text-2xl font-extrabold tracking-tight text-ink tabular-nums">{{ formatPrice(cart.totalPrice) }}</span></div>
        <router-link to="/checkout" class="btn btn-buy btn-lg btn-block mt-5">Proceed to checkout</router-link>
        <p class="mt-4 flex items-center justify-center gap-2 text-xs text-ink-3"><TruckIcon class="h-4 w-4" aria-hidden="true" /> Islandwide delivery available</p>
      </aside>
    </div>

    <div v-if="cart.items.length" class="cart-mobile-bar">
      <div class="min-w-0"><p class="text-xs text-ink-3">Total ({{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }})</p><p class="text-lg font-extrabold text-ink tabular-nums">{{ formatPrice(cart.totalPrice) }}</p></div>
      <router-link to="/checkout" class="btn btn-buy">Checkout</router-link>
    </div>
  </div>
</template>

<style scoped>
.cart-layout { display: grid; gap: 1.25rem; margin-top: 1.25rem; align-items: start; }
@media (min-width: 1024px) { .cart-layout { grid-template-columns: minmax(0, 1fr) minmax(20rem, 23rem); gap: 2rem; } .cart-summary { position: sticky; top: calc(var(--pp-header-h) + 1.5rem); } }
.cart-line { display: grid; grid-template-columns: 5rem minmax(0, 1fr); gap: 0.875rem 1rem; padding: 1rem; }
.cart-thumb { width: 5rem; height: 5rem; overflow: hidden; border-radius: var(--pp-radius-sm); background: var(--pp-well); }
.cart-thumb img { width: 100%; height: 100%; object-fit: contain; padding: 0.5rem; mix-blend-mode: multiply; }
.cart-line-controls { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 1rem; }
.cart-line-controls > p:first-of-type { order: 3; margin-left: auto; }
.cart-line-controls > .cart-remove { order: 2; }
.cart-line-controls > .cart-limit { order: 4; }
.cart-remove { display: inline-flex; align-items: center; gap: 0.375rem; min-height: 2.75rem; padding: 0 0.75rem; border-radius: 999px; color: var(--pp-ink-3); font-size: 0.8125rem; font-weight: 650; transition: color 0.15s, background-color 0.15s; }
.cart-remove:hover { color: var(--pp-danger); background: color-mix(in oklab, var(--pp-danger) 10%, transparent); }
.cart-remove svg { width: 1.125rem; height: 1.125rem; }
.cart-limit { flex-basis: 100%; color: var(--pp-ink-3); font-size: 0.75rem; }
@media (min-width: 640px) {
  .cart-line { grid-template-columns: 6.5rem minmax(0, 1fr) auto; padding: 1.25rem; }
  .cart-thumb { width: 6.5rem; height: 6.5rem; }
  .cart-line-controls { grid-column: auto; flex-direction: column; align-items: flex-end; justify-content: flex-start; }
  .cart-line-controls > p:first-of-type { order: 0; margin-left: 0; }
  .cart-line-controls > .cart-remove { order: 0; }
  .cart-limit { flex-basis: auto; text-align: right; }
}
.cart-mobile-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem var(--pp-gutter) max(0.75rem, env(safe-area-inset-bottom)); border-top: 1px solid var(--pp-line); background: var(--pp-header-bg); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); }
@media (min-width: 1024px) { .cart-mobile-bar { display: none; } }
</style>

<style>
/* Keep the footer's last links clear of the fixed mobile checkout bar. */
@media (max-width: 1023px) { body:has(.cart-mobile-bar) .site-footer { padding-bottom: 5.5rem; } }
</style>
