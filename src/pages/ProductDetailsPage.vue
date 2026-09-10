<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, CheckCircleIcon, HeartIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import productsData from '../data/products.json'
import { useRecentStore } from '../stores/recentStore'

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()
const recent = useRecentStore()
const product = computed(() => productsData.find(item => item.id === Number(route.params.id)))
const relatedProducts = computed(() => productsData.filter(item => item.category === product.value?.category && item.id !== product.value?.id).slice(0, 4))
const recentlyViewed = computed(() => recent.items.filter(item => item.id !== product.value?.id).slice(0, 4))
recent.load()
watch(product, value => { if (value) recent.add(value) }, { immediate: true })

const descriptions: Record<number, string> = {
  1: 'A feature-packed camera drone built for smooth flights, stable hovering and exciting aerial views.',
  2: 'A compact camera drone paired with a display remote for a more convenient flying experience.',
  3: 'A lightweight foldable drone that makes aerial fun accessible for beginners and casual pilots.',
  4: 'A portable dual-camera drone with a complete kit, ideal for learning, travel and everyday flying.',
  5: 'A versatile foldable camera drone offering stable control and a travel-friendly design.',
  6: 'A detailed 1:12 scale 4WD Defender-style crawler made for realistic off-road RC adventures.',
  7: 'A rugged Toyota LC79-style RC pickup with off-road character and realistic scale detailing.',
}

const addToCart = () => {
  if (!product.value) return
  cart.addToCart(product.value)
  toast.success(`${product.value.title} added to cart`)
}

const toggleWishlist = () => {
  if (!product.value) return
  wishlist.isInWishlist(product.value.id) ? wishlist.removeFromWishlist(product.value.id) : wishlist.addToWishlist(product.value)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-10 text-white sm:px-8 lg:py-16">
    <div v-if="product" class="mx-auto max-w-7xl">
      <router-link to="/products" class="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-cyan-400">
        <ArrowLeftIcon class="h-4 w-4" /> Back to products
      </router-link>

      <section class="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-white p-5 sm:p-9" data-aos="fade-right">
          <img :src="product.thumbnail" :alt="product.title" class="aspect-square h-full w-full rounded-2xl object-contain" />
        </div>

        <div class="lg:sticky lg:top-28" data-aos="fade-left">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-black text-slate-950">{{ product.badge }}</span>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold capitalize text-slate-300">{{ product.category.replace('-', ' ') }}</span>
          </div>
          <h1 class="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">{{ product.title }}</h1>
          <p class="mt-5 text-3xl font-black text-cyan-400">Rs. {{ product.price.toLocaleString() }}</p>
          <p class="mt-6 max-w-xl text-lg leading-8 text-slate-400">{{ descriptions[product.id] }}</p>

          <div class="mt-7 flex items-center gap-2 text-sm font-bold text-emerald-400">
            <CheckCircleIcon class="h-5 w-5" /> In stock — {{ product.stock }} available
          </div>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <button @click="addToCart" class="primary-button flex-1"><ShoppingBagIcon class="h-5 w-5" /> Add to cart</button>
            <button @click="toggleWishlist" :class="['inline-flex h-14 items-center justify-center gap-2 rounded-full border px-7 font-bold transition', wishlist.isInWishlist(product.id) ? 'border-rose-500 bg-rose-500 text-white' : 'border-white/15 text-white hover:border-rose-400 hover:text-rose-400']">
              <HeartIcon class="h-5 w-5" /> {{ wishlist.isInWishlist(product.id) ? 'Saved' : 'Save' }}
            </button>
          </div>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><TruckIcon class="h-6 w-6 text-cyan-400" /><div><p class="text-sm font-bold">Islandwide delivery</p><p class="text-xs text-slate-500">Securely packed</p></div></div>
            <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><CheckCircleIcon class="h-6 w-6 text-cyan-400" /><div><p class="text-sm font-bold">Quality checked</p><p class="text-xs text-slate-500">Local support</p></div></div>
          </div>
        </div>
      </section>

      <section v-if="relatedProducts.length" class="mt-24 border-t border-white/10 pt-16">
        <p class="section-kicker">Keep exploring</p>
        <h2 class="mt-3 text-3xl font-black">You may also like</h2>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <router-link v-for="item in relatedProducts" :key="item.id" :to="`/products/${item.id}`" class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-400/30">
            <div class="aspect-square bg-white p-3"><img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-2xl object-contain transition duration-300 group-hover:scale-105" /></div>
            <div class="p-5"><h3 class="font-bold text-white">{{ item.title }}</h3><p class="mt-2 font-black text-cyan-400">Rs. {{ item.price.toLocaleString() }}</p></div>
          </router-link>
        </div>
      </section>

      <section v-if="recentlyViewed.length" class="mt-20 border-t border-white/10 pt-14">
        <p class="section-kicker">Your history</p><h2 class="mt-3 text-3xl font-black">Recently viewed</h2>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <router-link v-for="item in recentlyViewed" :key="`recent-${item.id}`" :to="`/products/${item.id}`" class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-400/30"><div class="h-20 w-20 shrink-0 rounded-xl bg-white p-1"><img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-lg object-contain" /></div><div class="min-w-0"><h3 class="truncate text-sm font-bold">{{ item.title }}</h3><p class="mt-1 text-sm font-black text-cyan-400">Rs. {{ item.price.toLocaleString() }}</p></div></router-link>
        </div>
      </section>
    </div>

    <div v-else class="mx-auto max-w-2xl py-32 text-center"><h1 class="text-3xl font-black">Product not found</h1><router-link to="/products" class="primary-button mt-8">Browse products</router-link></div>
  </div>
</template>
