<script setup lang="ts">
import { productSku } from '../data/catalog'
import { ArrowLeftIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
const formatPrice = (value: number) => `Rs. ${value.toLocaleString()}`
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-5 py-14 text-slate-900 sm:px-8 lg:py-16">
    <div class="mx-auto max-w-7xl">
      <router-link to="/products" class="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600">
        <ArrowLeftIcon class="h-4 w-4" /> Continue shopping
      </router-link>

      <div class="mt-7 flex items-end justify-between gap-6">
        <div><p class="section-kicker">Your selection</p><h1 class="section-title">Shopping cart</h1></div>
        <p v-if="cart.items.length" class="hidden text-sm text-slate-600 sm:block">{{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}</p>
      </div>

      <div v-if="!cart.items.length" class="mt-12 rounded-[2rem] border border-dashed border-slate-200 bg-white/[0.03] px-6 py-24 text-center">
        <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100/10 text-blue-600"><ShoppingBagIcon class="h-9 w-9" /></span>
        <h2 class="mt-7 text-2xl font-black">Your cart is waiting</h2>
        <p class="mx-auto mt-3 max-w-md leading-7 text-slate-600">Explore our collection and add something exciting to your next build.</p>
        <router-link to="/products" class="primary-button mt-8">Explore products</router-link>
      </div>

      <div v-else class="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <section class="space-y-4"><p v-if="cart.items.some(item => item.id === 8)" class="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">3 or more racks: Rs. 1,750 each, including mixed colours. Bank deposit delivery is free; COD delivery is Rs. 400.</p>
          <article v-for="item in cart.items" :key="`${item.id}:${item.color}`" class="grid gap-5 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[130px_1fr] sm:p-5">
            <router-link :to="`/products/${item.id}`" class="aspect-square overflow-hidden rounded-2xl bg-white p-2">
              <img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-xl object-contain" />
            </router-link>
            <div class="flex min-w-0 flex-col justify-between gap-5">
              <div class="flex items-start justify-between gap-4">
                <div><p class="text-xs font-bold uppercase tracking-widest text-blue-600">{{ item.category?.replace('-', ' ') }}</p><router-link :to="`/products/${item.id}`" class="mt-1 block text-lg font-black text-slate-900 hover:text-blue-600">{{ item.title }}</router-link><p class="mt-1 break-all text-xs text-slate-500">SKU: {{ productSku(item) }}</p><p v-if="item.color" class="mt-1 text-sm text-blue-600">Colour: {{ item.color }}</p><p class="mt-2 text-sm text-slate-600">{{ formatPrice(item.price) }} each</p></div>
                <button @click="cart.removeFromCart(item.id, item.color)" class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-600" :aria-label="`Remove ${item.title}`"><TrashIcon class="h-5 w-5" /></button>
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
                  <button @click="cart.decreaseQuantity(item.id, item.color)" class="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Decrease quantity"><MinusIcon class="h-4 w-4" /></button>
                  <span class="w-10 text-center text-sm font-black">{{ item.quantity }}</span>
                  <button @click="cart.increaseQuantity(item.id, item.color)" class="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Increase quantity"><PlusIcon class="h-4 w-4" /></button>
                </div>
                <p class="text-lg font-black text-slate-900">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </article>
        </section>

        <aside class="rounded-[2rem] border border-slate-200 bg-white p-6 lg:sticky lg:top-28 sm:p-7">
          <h2 class="text-xl font-black">Order summary</h2>
          <div class="mt-6 space-y-4 text-sm">
            <div class="flex justify-between text-slate-600"><span>Items ({{ cart.totalItems }})</span><span class="font-semibold text-slate-900">{{ formatPrice(cart.totalPrice) }}</span></div>
            <div class="flex justify-between text-slate-600"><span>Delivery</span><span class="font-semibold text-emerald-700">Calculated at checkout</span></div>
          </div>
          <div class="my-6 border-t border-slate-200"></div>
          <div class="flex items-end justify-between"><span class="font-bold">Total</span><span class="text-2xl font-black text-blue-600">{{ formatPrice(cart.totalPrice) }}</span></div>
          <router-link to="/checkout" class="primary-button mt-7 w-full">Proceed to checkout</router-link>
          <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><TruckIcon class="h-4 w-4" /> Islandwide delivery available</div>
        </aside>
      </div>
    </div>
  </div>
</template>
