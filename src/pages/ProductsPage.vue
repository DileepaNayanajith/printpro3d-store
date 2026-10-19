<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CubeTransparentIcon, MagnifyingGlassIcon, TruckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import productsData from '../data/products.json'
import { publicProducts } from '../lib/seo'
import { trackSearch } from '../lib/ga4'
import { categoryGroups, categoryName } from '../data/categories'
import ProductCard from '../components/ProductCard.vue'

defineProps<{ showHighlights?: boolean }>()

type Product = typeof productsData[number]
const products = ref<Product[]>(publicProducts(productsData))
const route = useRoute()
const router = useRouter()
const search = ref('')
const selectedCategory = computed(() => typeof route.query.category === 'string' ? route.query.category : 'all')
watch(() => route.query.q, q => { search.value = typeof q === 'string' ? q : '' }, { immediate: true })
let searchTimer: ReturnType<typeof setTimeout> | undefined
function recordSearch() { clearTimeout(searchTimer); searchTimer = setTimeout(() => trackSearch(search.value), 500) }
onBeforeUnmount(() => clearTimeout(searchTimer))
const sortBy = ref('featured')

// Older short labels stay searchable alongside the navigation names.
const searchLabels: Record<string, string> = { 'development-boards': 'Development boards', sensors: 'Sensors', displays: 'Displays', robotics: 'Robotics & kits', filament: '3D filament', drones: 'Camera drones', 'drone-spare-parts': 'Drone spare parts', 'rc-cars': 'RC cars & trucks', 'display-racks': 'Display racks', '3d-printed-models': '3D printed models' }

const counts = computed(() => products.value.reduce<Record<string, number>>((total, product) => {
  total[product.category] = (total[product.category] || 0) + 1
  return total
}, {}))
const navGroups = computed(() => {
  const present = new Set(products.value.map(product => product.category))
  const grouped = categoryGroups.map(group => ({ label: group.label, ids: group.ids.filter(id => present.has(id)) })).filter(group => group.ids.length)
  const known = new Set(categoryGroups.flatMap(group => group.ids))
  const other = [...present].filter(id => !known.has(id))
  return other.length ? [...grouped, { label: 'More', ids: other }] : grouped
})
const categoryLink = (id: string) => id === 'all' ? '/products' : { path: '/products', query: { category: id } }
// The homepage previews the full catalog, so only the catalog page marks a category link as current.
const isCurrent = (id: string) => route.path === '/products' && selectedCategory.value === id

const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()
  const result = products.value.filter(product =>
    `${product.title} ${product.sku} ${product.description || ''} ${searchLabels[product.category] || ''} ${categoryName(product.category)}`.toLowerCase().includes(term) &&
    (selectedCategory.value === 'all' || product.category === selectedCategory.value)
  )
  if (sortBy.value === 'priceLow') return [...result].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'priceHigh') return [...result].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name') return [...result].sort((a, b) => a.title.localeCompare(b.title))
  return result
})
const heading = computed(() => categoryName(selectedCategory.value))
const clearSearch = () => {
  search.value = ''
  if (route.query.q !== undefined) router.replace({ path: route.path, query: { ...route.query, q: undefined } })
}
</script>

<template>
  <div class="catalog-page">
    <section v-if="showHighlights" class="home-intro container-store">
      <h1 class="home-heading"><span class="eyebrow">PRINTPRO3D</span><span class="sr-only"> — </span><span class="display-title block">3D printing, electronics and RC products in Sri Lanka</span></h1>
      <ul class="home-services" aria-label="Store services">
        <li><TruckIcon aria-hidden="true" /><p><strong>Islandwide delivery</strong><span>COD Rs. 400 · Bank deposit: free</span></p></li>
        <li><router-link to="/custom-print"><CubeTransparentIcon aria-hidden="true" /><p><strong>Custom 3D printing</strong><span>Upload an STL for a quote →</span></p></router-link></li>
      </ul>
    </section>
    <header v-else class="container-store catalog-head">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><router-link to="/">Home</router-link></li><li><router-link to="/products" :aria-current="selectedCategory === 'all' ? 'page' : undefined">Products</router-link></li><li v-if="selectedCategory !== 'all'" aria-current="page"><span class="crumb-current">{{ heading }}</span></li></ol></nav>
      <h1 class="page-title mt-2">{{ heading }}</h1>
      <p class="lead mt-2 hidden max-w-2xl sm:block">Electronics, sensors, robotics kits, 3D printing filament, display racks and RC products. Prices in LKR with islandwide delivery.</p>
    </header>

    <div class="container-store catalog-layout">
      <nav class="catalog-nav" aria-label="Product categories">
        <p class="catalog-nav-title eyebrow">Shop by category</p>
        <ul class="catalog-nav-list">
          <li><router-link :to="categoryLink('all')" class="chip catalog-link" :aria-current="isCurrent('all') ? 'page' : undefined">All products <span class="count">{{ products.length }}</span></router-link></li>
          <li v-for="group in navGroups" :key="group.label" class="catalog-nav-group">
            <span>{{ group.label }}</span>
            <ul>
              <li v-for="id in group.ids" :key="id"><router-link :to="categoryLink(id)" class="chip catalog-link" :aria-current="isCurrent(id) ? 'page' : undefined">{{ categoryName(id) }} <span class="count">{{ counts[id] }}</span></router-link></li>
            </ul>
          </li>
        </ul>
      </nav>

      <section class="min-w-0" :aria-labelledby="showHighlights ? 'featured-heading' : undefined" :aria-label="showHighlights ? undefined : 'Products'">
        <h2 v-if="showHighlights" id="featured-heading" class="section-heading mb-1">Featured products</h2>
        <div class="catalog-toolbar">
          <div class="min-w-0">
            <p class="text-sm text-ink-2" role="status" aria-live="polite">
              <strong class="font-bold text-ink">{{ filteredProducts.length }}</strong> {{ filteredProducts.length === 1 ? 'product' : 'products' }}<template v-if="search.trim()"> for “{{ search.trim() }}”</template>
              <button v-if="search.trim()" type="button" class="ml-1 inline-flex min-h-8 items-center gap-1 rounded-full px-2 font-semibold text-accent hover:bg-accent-soft" @click="clearSearch"><XMarkIcon class="h-4 w-4" aria-hidden="true" />Clear search</button>
            </p>
          </div>
          <div class="flex min-w-0 flex-1 items-center justify-end gap-2">
            <label class="relative hidden min-w-0 max-w-64 flex-1 sm:block">
              <span class="sr-only">Search products</span>
              <MagnifyingGlassIcon class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
              <input v-model="search" @input="recordSearch" type="search" placeholder="Filter products" class="field field-sm rounded-full pl-10" />
            </label>
            <select v-model="sortBy" aria-label="Sort products" class="field field-sm w-auto shrink-0 rounded-full font-semibold">
              <option value="featured">Featured</option><option value="priceLow">Price: Low to high</option><option value="priceHigh">Price: High to low</option><option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>

        <div v-if="filteredProducts.length" class="product-grid mt-4">
          <ProductCard v-for="(product, index) in filteredProducts" :key="product.id" :product="product" :eager="index < 4" />
        </div>
        <div v-else class="mt-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p class="text-lg font-bold text-ink">No products found</p>
          <p class="mt-2 text-ink-2">Try another search or category.</p>
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            <button v-if="search.trim()" type="button" class="btn btn-secondary btn-sm" @click="clearSearch">Clear search</button>
            <router-link to="/products" class="btn btn-primary btn-sm">View all products</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.catalog-page { padding-bottom: clamp(2.5rem, 2rem + 3vw, 4.5rem); }
.catalog-head { padding-block: clamp(1rem, 0.6rem + 1.6vw, 2.25rem) clamp(0.75rem, 0.5rem + 1vw, 1.5rem); }
.catalog-layout { padding-top: 0.25rem; }
.home-intro { display: grid; gap: 1rem; padding-block: clamp(1rem, 0.6rem + 1.8vw, 2.5rem) clamp(1rem, 0.6rem + 1.4vw, 2rem); }
.home-heading { display: grid; gap: 0.375rem; max-width: 40rem; }
.home-services { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
.home-services li { display: flex; min-width: 0; gap: 0.625rem; align-items: flex-start; padding: 0.75rem; border: 1px solid var(--pp-line); border-radius: var(--pp-radius-sm); background: var(--pp-surface); }
.home-services li:has(> a) { padding: 0; }
.home-services a { display: flex; flex: 1; min-width: 0; gap: 0.625rem; align-items: flex-start; padding: 0.75rem; border-radius: inherit; transition: background-color 0.18s; }
.home-services a:hover { background: var(--pp-surface-2); }
.home-services svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; color: var(--pp-accent); }
.home-services p { display: grid; gap: 0.125rem; min-width: 0; font-size: 0.75rem; line-height: 1.35; color: var(--pp-ink-2); }
.home-services strong { color: var(--pp-ink); font-size: 0.8125rem; font-weight: 750; }
@media (max-width: 639px) {
  .home-intro { gap: 0.75rem; }
  .home-services svg { display: none; }
  .home-services li, .home-services a { padding: 0.625rem 0.75rem; }
  .home-services p { font-size: 0.71875rem; }
  .home-services strong { font-size: 0.78125rem; }
}
@media (min-width: 640px) {
  .home-services { grid-template-columns: repeat(2, minmax(0, 18rem)); }
  .home-services li, .home-services a { padding: 0.875rem 1rem; }
}
@media (min-width: 1024px) {
  .home-intro { grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 2rem; }
  .home-services { grid-template-columns: repeat(2, minmax(13rem, 17rem)); }
}
</style>
