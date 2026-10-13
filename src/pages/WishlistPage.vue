<script setup lang="ts">
import { useBuyNow } from '../composables/useBuyNow'
const { buyNow } = useBuyNow()
import { useRouter } from 'vue-router'
const purchaseRouter = useRouter()
import { productSku, isSoldOut } from '../data/catalog'
import { ArrowRightIcon, HeartIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'

const wishlist = useWishlistStore()
const cart = useCartStore()
const toast = useToast()

const addToCart = (product: any) => {
  if (isSoldOut(product)) return
  if (product.id === 8) return purchaseRouter.push(`/products/${product.id}#purchase`)
  if (!cart.addToCart(product)) return toast.warning('Please check the available quantity.')
  toast.success(`${product.title} added to cart`)
}

const removeItem = (product: any) => {
  wishlist.removeFromWishlist(product.id)
  toast.info(`${product.title} removed from wishlist`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-5 py-14 text-slate-900 sm:px-8 lg:py-16">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p class="section-kicker">Saved for later</p><h1 class="section-title">My wishlist</h1><p class="mt-4 text-slate-600">Keep your favourite products together until you’re ready.</p></div>
        <p v-if="wishlist.items.length" class="text-sm font-semibold text-slate-600">{{ wishlist.totalItems }} saved {{ wishlist.totalItems === 1 ? 'item' : 'items' }}</p>
      </div>

      <div v-if="!wishlist.items.length" class="mt-12 rounded-[2rem] border border-dashed border-slate-200 bg-white/[0.03] px-6 py-24 text-center">
        <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-500/10 text-rose-600"><HeartIcon class="h-9 w-9" /></span>
        <h2 class="mt-7 text-2xl font-black">Your wishlist is empty</h2>
        <p class="mx-auto mt-3 max-w-md leading-7 text-slate-600">Tap the heart on any product to save it here for later.</p>
        <router-link to="/products" class="primary-button mt-8">Explore products <ArrowRightIcon class="h-5 w-5" /></router-link>
      </div>

      <div v-else class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <article v-for="(product, index) in wishlist.items" :key="product.id" class="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30" data-aos="fade-up" :data-aos-delay="index * 70">
          <router-link :to="`/products/${product.id}`" class="relative block aspect-square overflow-hidden bg-white p-3">
            <img :src="product.thumbnail" :alt="product.title" class="h-full w-full rounded-2xl object-contain transition duration-500 group-hover:scale-105" />
            <span v-if="product.badge" class="absolute left-4 top-4 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-slate-950">{{ product.badge }}</span>
          </router-link>
          <div class="p-5">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ product.category?.replace('-', ' ') }}</p>
            <h2 class="mt-2 min-h-12 font-bold text-slate-900">{{ product.title }}</h2><p class="mt-2 break-all text-xs text-slate-500">SKU: {{ productSku(product) }}</p>
            <p class="mt-2 text-xl font-black text-blue-600">Rs. {{ product.price.toLocaleString() }}</p>
            <div class="mt-5 grid grid-cols-[1fr_auto] gap-2">
              <button :disabled="isSoldOut(product)" @click="addToCart(product)" class="inline-flex items-center justify-center gap-2 rounded-full bg-blue-100 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-200"><ShoppingBagIcon class="h-5 w-5" /> Add to cart</button><button :disabled="isSoldOut(product)" @click="buyNow(product)" class="buy-now-button rounded-full bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">Buy it now</button>
              <button @click="removeItem(product)" class="grid h-12 w-12 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-rose-400 hover:bg-rose-500/10 hover:text-rose-600" :aria-label="`Remove ${product.title}`"><TrashIcon class="h-5 w-5" /></button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
