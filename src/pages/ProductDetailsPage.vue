<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BoltIcon, CheckIcon, HeartIcon, InformationCircleIcon, MinusIcon, PlusIcon, ShieldCheckIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import catalog from '../data/products.json'
import { publicProducts, productDescription } from '../lib/seo'
const productsData=publicProducts(catalog)
import { stockLabel } from '../data/catalog'
import { categoryName } from '../data/categories'
import { formatLkr } from '../lib/format'
import ProductImage from '../components/ProductImage.vue'
import ProductCard from '../components/ProductCard.vue'
import { useRecentStore } from '../stores/recentStore'

const route = useRoute()
const router = useRouter()
const selectedColor = ref('')
const selectedImage = ref('')
const quantity = ref(1)
const chooseColor = (color: string) => { selectedColor.value=color; selectedImage.value=product.value?.colorImages?.[color as 'White'|'Black'|'Gray'] || product.value?.thumbnail || '' }
const swatches: Record<string, string> = { White: '#f4f4f2', Black: '#18181b', Gray: '#9ca3af' }
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()
const recent = useRecentStore()
const product = computed(() => productsData.find(item => item.id === Number(route.params.id)))
const relatedProducts = computed(() => productsData.filter(item => item.category === product.value?.category && item.id !== product.value?.id).slice(0, 4))
const recentlyViewed = computed(() => recent.items.filter(item => item.id !== product.value?.id).slice(0, 4))
const soldOut = computed(() => product.value?.stock === 0)
const saved = computed(() => !!product.value && wishlist.isInWishlist(product.value.id))
// Same ceiling the cart enforces: listed stock (or 99) across every colour of this product.
const limit = computed(() => Math.min(product.value?.stock ?? 99, 99))
const inCart = computed(() => cart.items.filter(item => item.id === product.value?.id).reduce((total, item) => total + item.quantity, 0))
const maxQuantity = computed(() => Math.max(1, limit.value - inCart.value))
recent.load()
watch(product, value => { if (value) recent.add(value); selectedColor.value=''; selectedImage.value=value?.thumbnail || ''; quantity.value=1 }, { immediate: true })

watch(maxQuantity, max => { if (quantity.value > max) quantity.value = max })
const setQuantity = (value: number) => { quantity.value = Math.min(maxQuantity.value, Math.max(1, Math.floor(Number(value) || 1))) }

const addToCart = () => {
  if (!product.value || product.value.stock === 0) return
  if (product.value.colors && !selectedColor.value) return toast.warning('Please choose your colour.')
  if (!cart.addToCart({id:product.value.id,color:selectedColor.value},quantity.value)) return toast.warning('Please check the available quantity.')
  toast.success(`${product.value.title} added to cart`)
}

const buyNow = () => {
  if (!product.value || product.value.stock === 0) return
  if (product.value.colors && !selectedColor.value) return toast.warning('Please choose your colour.')
  if (!cart.addToCart({id:product.value.id,color:selectedColor.value},quantity.value)) return toast.warning('Please check the available quantity.')
  router.push('/checkout')
}

const toggleWishlist = () => {
  if (!product.value) return
  wishlist.isInWishlist(product.value.id) ? wishlist.removeFromWishlist(product.value.id) : wishlist.addToWishlist(product.value)
}
</script>

<template>
  <div class="product-detail-page">
    <div v-if="product" class="container-store page-pad">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link :to="{ path: '/products', query: { category: product.category } }">{{ categoryName(product.category) }}</router-link></li>
          <li aria-current="page"><span class="crumb-current">{{ product.title }}</span></li>
        </ol>
      </nav>

      <section class="product-detail-layout">
        <div class="product-gallery">
          <div class="pdp-stage">
            <ProductImage eager :src="selectedImage" :alt="product.title" />
          </div>
          <div v-if="product.images && product.images.length > 1" class="pdp-thumbs" role="group" :aria-label="`${product.title} photos`">
            <button v-for="(image,index) in product.images" :key="image" type="button" @click="selectedImage=image" :aria-label="`View ${product.title} photo ${index+1}`" :aria-pressed="selectedImage===image" class="pdp-thumb"><img :src="image" :alt="`${product.title} photo ${index+1}`" loading="lazy" decoding="async" /></button>
          </div>
          <p v-if="product.photoNote" class="pdp-note"><InformationCircleIcon aria-hidden="true" /><span>{{ product.photoNote }}</span></p>
        </div>

        <div class="pdp-info">
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="product.badge" class="badge badge-accent">{{ product.badge }}</span>
            <span class="badge">{{ categoryName(product.category) }}</span>
          </div>
          <h1 class="page-title mt-3">{{ product.title }}</h1>
          <p class="mt-2 break-all text-xs font-semibold text-ink-3">SKU: {{ product.sku }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
            <p class="text-[clamp(1.5rem,1.3rem+0.8vw,2rem)] font-extrabold tracking-tight text-ink tabular-nums">{{ formatLkr(product.price) }}</p>
            <p :class="['stock !text-sm', { 'is-out': soldOut }]">{{ stockLabel(product.stock) }}</p>
          </div>
          <div v-if="product.colors" class="pdp-offer">
            <p class="font-bold text-ink">3 or more racks: Rs. 1,750 each</p>
            <p class="mt-1 text-sm leading-6 text-ink-2">1–2 racks: Rs. 1,850 each. Mix colours — the discount applies automatically in your cart.</p>
          </div>
          <p class="lead mt-5">{{ productDescription(product) }}</p>
          <ul v-if="product.features?.length" class="mt-4 grid gap-2 text-sm text-ink-2"><li v-for="feature in product.features" :key="feature" class="flex items-start gap-2"><CheckIcon class="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{{ feature }}</li></ul>

          <div id="purchase" class="pdp-purchase">
            <fieldset v-if="product.colors">
              <legend class="text-sm font-bold text-ink">Choose your colour <span v-if="selectedColor" class="font-semibold text-ink-3">· {{ selectedColor }}</span></legend>
              <div class="mt-3 flex flex-wrap gap-2">
                <button v-for="color in product.colors" :key="color" type="button" @click="chooseColor(color)" :aria-pressed="selectedColor===color" class="chip pdp-color"><span class="pdp-swatch" :style="{ background: swatches[color] || color }" aria-hidden="true"></span>{{ color }}</button>
              </div>
            </fieldset>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span id="quantity-label" class="text-sm font-bold text-ink">Quantity</span>
              <div class="stepper" role="group" aria-labelledby="quantity-label">
                <button type="button" :disabled="quantity <= 1 || soldOut" aria-label="Decrease quantity" @click="setQuantity(quantity - 1)"><MinusIcon aria-hidden="true" /></button>
                <input :value="quantity" type="number" inputmode="numeric" min="1" :max="maxQuantity" :disabled="soldOut" aria-labelledby="quantity-label" @change="setQuantity(Number(($event.target as HTMLInputElement).value))" />
                <button type="button" :disabled="quantity >= maxQuantity || soldOut" aria-label="Increase quantity" @click="setQuantity(quantity + 1)"><PlusIcon aria-hidden="true" /></button>
              </div>
              <p v-if="inCart && !soldOut" class="text-xs text-ink-3">{{ inCart }} already in your cart</p>
            </div>
            <template v-if="product.colors">
              <p class="text-sm leading-6 text-ink-2">10 slots per rack · Fits 1:64 cars · Combine more racks as your collection grows</p>
              <p class="-mt-2 text-sm text-ink-2">Rack only. Cars shown in the photos are not included.</p>
            </template>
            <div class="product-detail-actions">
              <button type="button" :disabled="soldOut" @click="buyNow" class="btn btn-buy btn-lg buy-now-button"><BoltIcon aria-hidden="true" /> {{ soldOut ? 'Sold out' : 'Buy it now' }}</button>
              <button type="button" :disabled="soldOut" @click="addToCart" class="btn btn-primary btn-lg"><ShoppingBagIcon aria-hidden="true" /> Add to cart</button>
              <button type="button" @click="toggleWishlist" :aria-pressed="saved" class="btn btn-secondary btn-lg pdp-save">
                <HeartSolidIcon v-if="saved" class="text-rose-600" aria-hidden="true" /><HeartIcon v-else aria-hidden="true" /> {{ saved ? 'Saved' : 'Save' }}
              </button>
            </div>
          </div>

          <ul class="pdp-assurances">
            <li><TruckIcon aria-hidden="true" /><div><p class="font-bold text-ink">Islandwide delivery</p><p class="text-ink-3">Bank deposit: free · COD: Rs. 400</p></div></li>
            <li><ShieldCheckIcon aria-hidden="true" /><div><p class="font-bold text-ink">Quality checked</p><p class="text-ink-3">Local support</p></div></li>
          </ul>
        </div>
      </section>

      <section v-if="relatedProducts.length" class="mt-[clamp(3rem,2rem+4vw,5.5rem)] border-t border-line pt-[clamp(2rem,1.5rem+2vw,3.5rem)]" aria-labelledby="related-heading">
        <p class="eyebrow">Keep exploring</p>
        <h2 id="related-heading" class="section-heading mt-2">You may also like</h2>
        <div class="product-grid related-grid mt-6">
          <ProductCard v-for="item in relatedProducts" :key="item.id" :product="item" heading="h3" />
        </div>
      </section>

      <section v-if="recentlyViewed.length" class="mt-[clamp(2.5rem,2rem+3vw,4rem)] border-t border-line pt-[clamp(2rem,1.5rem+2vw,3rem)]" aria-labelledby="recent-heading">
        <p class="eyebrow">Your history</p><h2 id="recent-heading" class="section-heading mt-2">Recently viewed</h2>
        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <router-link v-for="item in recentlyViewed" :key="`recent-${item.id}`" :to="`/products/${item.id}`" class="group flex items-center gap-3 rounded-[var(--pp-radius)] border border-line bg-surface p-2.5 transition hover:border-line-strong">
            <div class="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--pp-radius-sm)] bg-well"><img :src="item.thumbnail" :alt="item.title" loading="lazy" class="h-full w-full object-contain p-1.5 mix-blend-multiply" /></div>
            <div class="min-w-0"><h3 class="truncate text-sm font-bold text-ink group-hover:text-accent">{{ item.title }}</h3><p class="mt-0.5 text-sm font-extrabold tabular-nums text-ink-2">{{ formatLkr(item.price) }}</p></div>
          </router-link>
        </div>
      </section>
    </div>

    <div v-else class="container-store py-24 text-center"><h1 class="page-title">Product not found</h1><router-link to="/products" class="btn btn-primary mt-8">Browse products</router-link></div>
  </div>
</template>

<style scoped>
.product-detail-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(1.25rem, 0.8rem + 2.5vw, 4rem); margin-top: clamp(0.75rem, 0.5rem + 1vw, 1.5rem); align-items: start; }
@media (min-width: 900px) { .product-detail-layout { grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr); } }
@media (min-width: 900px) { .pdp-info { position: sticky; top: calc(var(--pp-header-h) + 1.5rem); } }
.pdp-stage { display: grid; place-items: center; aspect-ratio: 5 / 4; overflow: hidden; border-radius: var(--pp-radius); background: var(--pp-well); }
@media (min-width: 640px) { .pdp-stage { aspect-ratio: 1; } }
.pdp-stage img { width: 100%; height: 100%; object-fit: contain; padding: clamp(0.75rem, 4%, 2rem); mix-blend-mode: multiply; }
.pdp-thumbs { display: flex; gap: 0.5rem; margin-top: 0.75rem; overflow-x: auto; padding-bottom: 0.25rem; scrollbar-width: thin; }
.pdp-thumb { flex: 0 0 auto; width: clamp(3.5rem, 3rem + 2vw, 4.5rem); aspect-ratio: 1; overflow: hidden; border-radius: var(--pp-radius-sm); background: var(--pp-well); box-shadow: inset 0 0 0 1px var(--pp-line); transition: box-shadow 0.18s, opacity 0.18s; opacity: 0.8; }
.pdp-thumb:hover { opacity: 1; }
.pdp-thumb[aria-pressed="true"] { opacity: 1; box-shadow: inset 0 0 0 2px var(--pp-accent); }
.pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pdp-note { display: flex; gap: 0.5rem; margin-top: 0.75rem; color: var(--pp-ink-3); font-size: 0.75rem; line-height: 1.55; }
.pdp-note svg { width: 1rem; height: 1rem; flex-shrink: 0; margin-top: 0.0625rem; }
.pdp-offer { margin-top: 1rem; padding: 0.875rem 1rem; border-radius: var(--pp-radius-sm); background: var(--pp-accent-soft); }
.pdp-offer .font-bold { color: var(--pp-on-accent-soft); }
.pdp-purchase { display: grid; gap: 1.125rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--pp-line); }
.pdp-color { padding-left: 0.625rem; }
.pdp-swatch { width: 1.25rem; height: 1.25rem; border-radius: 999px; box-shadow: inset 0 0 0 1px rgb(128 128 128 / 0.55); }
.product-detail-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.625rem; }
.product-detail-actions .pdp-save { grid-column: 1 / -1; }
@media (max-width: 379px) { .product-detail-actions { grid-template-columns: 1fr; } }
.pdp-assurances { display: grid; gap: 0.75rem; margin-top: 1.5rem; padding: 1rem; border: 1px solid var(--pp-line); border-radius: var(--pp-radius); font-size: 0.8125rem; }
@media (min-width: 480px) { .pdp-assurances { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.pdp-assurances li { display: flex; gap: 0.75rem; align-items: center; }
.pdp-assurances svg { width: 1.375rem; height: 1.375rem; flex-shrink: 0; color: var(--pp-accent); }
@media (min-width: 1024px) { .related-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
</style>
