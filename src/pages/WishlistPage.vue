<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRightIcon, HeartIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import catalog from '../data/products.json'
import ProductCard from '../components/ProductCard.vue'
import { useWishlistStore } from '../stores/wishlistStore'

const wishlist = useWishlistStore()
const toast = useToast()
type Product = typeof catalog[number]
// Saved items are shown with current catalog price and stock; older saved copies remain the fallback.
const items = computed(() => wishlist.items.map(item => (catalog.find(product => product.id === item.id) || item) as Product))

const removeItem = (product: Product) => {
  wishlist.removeFromWishlist(product.id)
  toast.info(`${product.title} removed from wishlist`)
}
</script>

<template>
  <div class="container-store page-pad">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><p class="eyebrow">Saved for later</p><h1 class="page-title mt-2">My wishlist</h1><p class="mt-2 text-ink-2">Keep your favourite products together until you’re ready.</p></div>
      <p v-if="wishlist.items.length" class="text-sm font-semibold text-ink-2">{{ wishlist.totalItems }} saved {{ wishlist.totalItems === 1 ? 'item' : 'items' }}</p>
    </div>

    <div v-if="!wishlist.items.length" class="mt-8 rounded-[var(--pp-radius)] border border-dashed border-line-strong px-6 py-16 text-center">
      <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent"><HeartIcon class="h-7 w-7" aria-hidden="true" /></span>
      <h2 class="mt-5 text-xl font-bold text-ink">Your wishlist is empty</h2>
      <p class="mx-auto mt-2 max-w-md leading-7 text-ink-2">Tap the heart on any product to save it here for later.</p>
      <router-link to="/products" class="btn btn-primary mt-6">Explore products <ArrowRightIcon aria-hidden="true" /></router-link>
    </div>

    <div v-else class="product-grid mt-6">
      <ProductCard v-for="product in items" :key="product.id" :product="product">
        <button type="button" class="btn btn-ghost btn-sm btn-block" :aria-label="`Remove ${product.title}`" @click="removeItem(product)"><TrashIcon aria-hidden="true" /> Remove</button>
      </ProductCard>
    </div>
  </div>
</template>
