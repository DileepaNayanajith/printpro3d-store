<script setup lang="ts">
import { useBuyNow } from '../composables/useBuyNow'
const { buyNow } = useBuyNow()
import { useRouter } from 'vue-router'
const purchaseRouter = useRouter()
import { computed, ref, watch } from 'vue'
import StoreDepartments from '../components/StoreDepartments.vue'
defineProps<{ showHighlights?: boolean }>()
import { HeartIcon, MagnifyingGlassIcon, ScaleIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import productsData from '../data/products.json'
import { publicProducts } from '../lib/seo'
import { stockLabel } from '../data/catalog'
import ProductImage from '../components/ProductImage.vue'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'
import { useCompareStore } from '../stores/compareStore'

type Product = typeof productsData[number]
const products = ref<Product[]>(publicProducts(productsData))
const search = ref('')
const route = useRoute()
const selectedCategory = ref(typeof route.query.category === 'string' ? route.query.category : 'all')
watch(() => route.query, query => {
  search.value = typeof query.q === 'string' ? query.q : ''
  selectedCategory.value = typeof query.category === 'string' ? query.category : 'all'
}, { immediate: true })
const sortBy = ref('featured')
const categoryLabels: Record<string, string> = { all: 'All products', 'development-boards': 'Development boards', sensors: 'Sensors', displays: 'Displays', robotics: 'Robotics & kits', filament: '3D filament', drones: 'Camera drones', 'rc-cars': 'RC cars & trucks', 'display-racks': 'Display racks', '3d-printed-models': '3D printed models' }
const categoryLabel = (category: string) => categoryLabels[category] || category.replace(/-/g, ' ')

const wishlist = useWishlistStore()
const cart = useCartStore()
const toast = useToast()
const compare = useCompareStore()
const categories = computed(() => ['all', ...new Set(products.value.map(product => product.category))])

const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()
  const result = products.value.filter(product =>
    `${product.title} ${product.sku} ${product.description || ''} ${categoryLabel(product.category)}`.toLowerCase().includes(term) &&
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
  if (product.id === 8) return purchaseRouter.push(`/products/${product.id}#purchase`)
  if (!cart.addToCart(product)) return toast.warning('Please check the available quantity.')
  toast.success(`${product.title} added to cart`)
}

const toggleCompare = (product: Product) => {
  if (!compare.has(product.id) && compare.items.length >= 3) return toast.warning('You can compare up to 3 products')
  const added = compare.toggle(product)
  toast.info(added ? `${product.title} added to compare` : `${product.title} removed from compare`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-5 py-6 text-slate-900 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <h1 v-if="showHighlights" class="sr-only">PRINTPRO3D — 3D Printing, Electronics and RC Products in Sri Lanka</h1>
      <div v-if="!showHighlights" class="max-w-3xl">
        <p class="section-kicker">Discover • Build • Play</p>
        <h1 class="section-title shop-title">Your next favourite find.</h1>
        <p class="mt-2 hidden text-sm text-slate-600 sm:block">Shop electronics, sensors, 3D filament, drones and RC vehicles. Local support, islandwide delivery.</p>
      </div>

      <StoreDepartments v-if="showHighlights" :selected="selectedCategory" @select="selectedCategory=$event" />
      <div v-if="!showHighlights" class="mt-3 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-800"><span>Islandwide delivery</span><span class="hidden sm:inline">Cash on delivery available</span><span class="hidden sm:inline">Free delivery with bank deposit</span><router-link to="/custom-print" class="underline underline-offset-4">Custom 3D printing →</router-link></div>
      <div class="catalog-controls mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-2 grid-cols-[1fr_auto]">
        <label class="relative block min-w-0">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input v-model="search" aria-label="Search products" type="search" placeholder="Search products..." class="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60" />
        </label>
        <select aria-label="Sort products" v-model="sortBy" class="h-11 rounded-2xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-900 outline-none focus:border-cyan-400/60">
          <option value="featured">Featured</option><option value="priceLow">Price: Low to high</option><option value="priceHigh">Price: High to low</option><option value="name">Name: A–Z</option>
        </select>
      </div>

      <div class="category-navigation mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Product categories">
        <router-link v-for="category in categories" :to="category === 'all' ? '/products' : { path: '/products', query: { category } }" :key="category" @click="selectedCategory = category" :aria-pressed="selectedCategory === category" :class="['shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold capitalize transition', selectedCategory === category ? 'bg-blue-100 text-slate-950' : 'border border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:text-slate-900']">{{ categoryLabel(category) }}</router-link>
      </div>

      <p class="mt-2 text-xs text-slate-500" role="status" aria-live="polite">{{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }}</p>
      <div class="catalog-grid mt-4 grid gap-3 md:gap-5">
        <article v-for="product in filteredProducts" :key="product.id" class="product-card flex min-w-0 flex-col group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
          <router-link :to="`/products/${product.id}`" class="relative block aspect-square overflow-hidden bg-white">
            <ProductImage :src="product.thumbnail" :alt="product.title" class="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
            <span class="absolute left-4 top-4 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-slate-950">{{ product.badge }}</span>
          </router-link>
          <div class="flex flex-1 flex-col p-3 sm:p-5">
            <div class="flex flex-col gap-3">
              <div><h2 class="product-title min-h-12 text-sm font-bold text-slate-900 sm:text-base">{{ product.title }}</h2><p class="mt-2 break-all text-[10px] font-medium text-slate-500">SKU: {{ product.sku }}</p><p class="mt-2 text-lg font-black text-blue-700 sm:text-xl">Rs. {{ product.price.toLocaleString() }}</p><p class="mt-1 text-xs font-semibold text-emerald-700">{{ stockLabel(product.stock) }}</p></div>
              <div class="flex gap-2"><button @click="toggleCompare(product)" :aria-label="`Compare ${product.title}`" :class="['grid h-10 w-10 shrink-0 place-items-center rounded-full border transition', compare.has(product.id) ? 'border-cyan-400 bg-blue-100 text-slate-950' : 'border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-blue-600']"><ScaleIcon class="h-5 w-5" /></button><button @click="toggleWishlist(product)" :aria-label="`Wishlist ${product.title}`" :class="['grid h-10 w-10 shrink-0 place-items-center rounded-full border transition', wishlist.isInWishlist(product.id) ? 'border-rose-500 bg-rose-500 text-slate-900' : 'border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-600']"><HeartIcon class="h-5 w-5" /></button></div>
            </div>
            <button :disabled="product.stock === 0" @click="buyNow(product)" class="buy-now-button mt-4 rounded-full bg-orange-500 px-2 py-3 text-xs font-bold text-white hover:bg-orange-600">Buy it now</button>
            <div class="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
              <router-link :to="`/products/${product.id}`" class="rounded-full border border-slate-200 px-2 py-3 text-center text-xs font-black text-slate-900 transition hover:border-cyan-400 hover:text-blue-600">View details</router-link>
              <button :disabled="product.stock === 0" @click="addToCart(product)" class="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-slate-950 transition hover:bg-blue-200" :aria-label="`Add ${product.title} to cart`"><ShoppingBagIcon class="h-5 w-5" /></button>
            </div>
          </div>
        </article>
      </div>

      <div v-if="!filteredProducts.length" class="mt-12 rounded-3xl border border-dashed border-slate-200 py-20 text-center"><p class="text-xl font-bold">No products found</p><p class="mt-2 text-slate-500">Try another search or category.</p></div>
    </div>
  </div>
</template>
