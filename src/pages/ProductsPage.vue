<script setup lang="ts">
import { computed, ref } from 'vue'
import { HeartIcon, MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import productsData from '../data/products.json'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'

type Product = { id: number; title: string; price: number; thumbnail: string; category: string; stock: number; badge: string }
const products = ref<Product[]>(productsData)
const search = ref('')
const selectedCategory = ref('all')
const sortBy = ref('featured')
const wishlist = useWishlistStore()
const cart = useCartStore()
const toast = useToast()
const categories = computed(() => ['all', ...new Set(products.value.map(product => product.category))])

const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()
  const result = products.value.filter(product =>
    product.title.toLowerCase().includes(term) &&
    (selectedCategory.value === 'all' || product.category === selectedCategory.value)
  )
  if (sortBy.value === 'priceLow') return [...result].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'priceHigh') return [...result].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name') return [...result].sort((a, b) => a.title.localeCompare(b.title))
  return result
})

const toggleWishlist = (product: Product) => wishlist.isInWishlist(product.id)
  ? wishlist.removeFromWishlist(product.id)
  : wishlist.addToWishlist(product)

const addToCart = (product: Product) => {
  cart.addToCart(product)
  toast.success(`${product.title} added to cart`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="max-w-3xl" data-aos="fade-up">
        <p class="section-kicker">Explore the collection</p>
        <h1 class="section-title">Products made for your next idea.</h1>
        <p class="mt-5 text-lg text-slate-400">Discover our handpicked range of RC technology and maker essentials.</p>
      </div>

      <div class="mt-12 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto]">
        <label class="relative block">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input v-model="search" type="search" placeholder="Search products..." class="h-13 w-full rounded-2xl border border-white/10 bg-slate-900 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60" />
        </label>
        <select v-model="sortBy" class="h-13 rounded-2xl border border-white/10 bg-slate-900 px-5 text-sm font-semibold text-white outline-none focus:border-cyan-400/60">
          <option value="featured">Featured</option><option value="priceLow">Price: Low to high</option><option value="priceHigh">Price: High to low</option><option value="name">Name: A–Z</option>
        </select>
      </div>

      <div class="mt-7 flex flex-wrap gap-3">
        <button v-for="category in categories" :key="category" @click="selectedCategory = category" :class="['rounded-full px-5 py-2.5 text-sm font-bold capitalize transition', selectedCategory === category ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white']">{{ category }}</button>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <article v-for="(product, index) in filteredProducts" :key="product.id" class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30" data-aos="fade-up" :data-aos-delay="index * 70">
          <router-link :to="`/products/${product.id}`" class="relative block aspect-square overflow-hidden bg-slate-900">
            <img :src="product.thumbnail" :alt="product.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span class="absolute left-4 top-4 rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-black text-slate-950">{{ product.badge }}</span>
          </router-link>
          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div><h2 class="font-bold text-white">{{ product.title }}</h2><p class="mt-2 text-xl font-black text-cyan-400">Rs. {{ product.price.toLocaleString() }}</p><p class="mt-1 text-xs font-semibold text-emerald-400">{{ product.stock }} in stock</p></div>
              <button @click="toggleWishlist(product)" :aria-label="`Wishlist ${product.title}`" :class="['grid h-10 w-10 shrink-0 place-items-center rounded-full border transition', wishlist.isInWishlist(product.id) ? 'border-rose-500 bg-rose-500 text-white' : 'border-white/10 text-slate-400 hover:border-rose-400 hover:text-rose-400']"><HeartIcon class="h-5 w-5" /></button>
            </div>
            <div class="mt-5 grid grid-cols-[1fr_auto] gap-2">
              <router-link :to="`/products/${product.id}`" class="rounded-full border border-white/15 px-4 py-3 text-center text-sm font-black text-white transition hover:border-cyan-400 hover:text-cyan-400">View details</router-link>
              <button @click="addToCart(product)" class="grid h-12 w-12 place-items-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-cyan-300" :aria-label="`Add ${product.title} to cart`"><ShoppingBagIcon class="h-5 w-5" /></button>
            </div>
          </div>
        </article>
      </div>

      <div v-if="!filteredProducts.length" class="mt-12 rounded-3xl border border-dashed border-white/15 py-20 text-center"><p class="text-xl font-bold">No products found</p><p class="mt-2 text-slate-500">Try another search or category.</p></div>
    </div>
  </div>
</template>
