<script setup lang="ts">
import { ArrowLeftIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
const formatPrice = (value: number) => `Rs. ${value.toLocaleString()}`
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-14 text-white sm:px-8 lg:py-16">
    <div class="mx-auto max-w-7xl">
      <router-link to="/products" class="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-cyan-400">
        <ArrowLeftIcon class="h-4 w-4" /> Continue shopping
      </router-link>

      <div class="mt-7 flex items-end justify-between gap-6">
        <div><p class="section-kicker">Your selection</p><h1 class="section-title">Shopping cart</h1></div>
        <p v-if="cart.items.length" class="hidden text-sm text-slate-400 sm:block">{{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}</p>
      </div>

      <div v-if="!cart.items.length" class="mt-12 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] px-6 py-24 text-center">
        <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-cyan-400/10 text-cyan-400"><ShoppingBagIcon class="h-9 w-9" /></span>
        <h2 class="mt-7 text-2xl font-black">Your cart is waiting</h2>
        <p class="mx-auto mt-3 max-w-md leading-7 text-slate-400">Explore our collection and add something exciting to your next build.</p>
        <router-link to="/products" class="primary-button mt-8">Explore products</router-link>
      </div>

      <div v-else class="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <section class="space-y-4">
          <article v-for="item in cart.items" :key="item.id" class="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[130px_1fr] sm:p-5">
            <router-link :to="`/products/${item.id}`" class="aspect-square overflow-hidden rounded-2xl bg-white p-2">
              <img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-xl object-contain" />
            </router-link>
            <div class="flex min-w-0 flex-col justify-between gap-5">
              <div class="flex items-start justify-between gap-4">
                <div><p class="text-xs font-bold uppercase tracking-widest text-cyan-400">{{ item.category?.replace('-', ' ') }}</p><router-link :to="`/products/${item.id}`" class="mt-1 block text-lg font-black text-white hover:text-cyan-400">{{ item.title }}</router-link><p class="mt-2 text-sm text-slate-400">{{ formatPrice(item.price) }} each</p></div>
                <button @click="cart.removeFromCart(item.id)" class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400" :aria-label="`Remove ${item.title}`"><TrashIcon class="h-5 w-5" /></button>
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="inline-flex items-center rounded-full border border-white/10 bg-slate-900 p-1">
                  <button @click="cart.decreaseQuantity(item.id)" class="grid h-9 w-9 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Decrease quantity"><MinusIcon class="h-4 w-4" /></button>
                  <span class="w-10 text-center text-sm font-black">{{ item.quantity }}</span>
                  <button @click="cart.increaseQuantity(item.id)" class="grid h-9 w-9 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Increase quantity"><PlusIcon class="h-4 w-4" /></button>
                </div>
                <p class="text-lg font-black text-white">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </article>
        </section>

        <aside class="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 lg:sticky lg:top-28 sm:p-7">
          <h2 class="text-xl font-black">Order summary</h2>
          <div class="mt-6 space-y-4 text-sm">
            <div class="flex justify-between text-slate-400"><span>Items ({{ cart.totalItems }})</span><span class="font-semibold text-white">{{ formatPrice(cart.totalPrice) }}</span></div>
            <div class="flex justify-between text-slate-400"><span>Delivery</span><span class="font-semibold text-emerald-400">Calculated at checkout</span></div>
          </div>
          <div class="my-6 border-t border-white/10"></div>
          <div class="flex items-end justify-between"><span class="font-bold">Total</span><span class="text-2xl font-black text-cyan-400">{{ formatPrice(cart.totalPrice) }}</span></div>
          <router-link to="/checkout" class="primary-button mt-7 w-full">Proceed to checkout</router-link>
          <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><TruckIcon class="h-4 w-4" /> Islandwide delivery available</div>
        </aside>
      </div>
    </div>
  </div>
</template>
