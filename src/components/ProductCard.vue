<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { HeartIcon, ScaleIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'
import type catalog from '../data/products.json'
import ProductImage from './ProductImage.vue'
import { stockLabel } from '../data/catalog'
import { categoryName } from '../data/categories'
import { formatLkr } from '../lib/format'
import { useBuyNow } from '../composables/useBuyNow'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCompareStore } from '../stores/compareStore'

type Product = typeof catalog[number]
const props = withDefaults(defineProps<{ product: Product; eager?: boolean; heading?: 'h2' | 'h3' }>(), { heading: 'h2' })

const router = useRouter()
const toast = useToast()
const cart = useCartStore()
const wishlist = useWishlistStore()
const compare = useCompareStore()
const { buyNow } = useBuyNow()

const link = computed(() => `/products/${props.product.id}`)
const soldOut = computed(() => props.product.stock === 0)
const saved = computed(() => wishlist.isInWishlist(props.product.id))
const comparing = computed(() => compare.has(props.product.id))

const toggleWishlist = () => saved.value
  ? wishlist.removeFromWishlist(props.product.id)
  : wishlist.addToWishlist(props.product)

const toggleCompare = () => {
  const product = props.product
  if (!compare.has(product.id) && compare.items.length >= 3) return toast.warning('You can compare up to 3 products')
  const added = compare.toggle(product)
  toast.info(added ? `${product.title} added to compare` : `${product.title} removed from compare`)
}

// Rack colours are chosen on the product page before the item can enter the cart.
const addToCart = () => {
  const product = props.product
  if (product.colors) return router.push(`${link.value}#purchase`)
  if (!cart.addToCart(product)) return toast.warning('Please check the available quantity.')
  toast.success(`${product.title} added to cart`)
}
</script>

<template>
  <article class="product-card group">
    <div class="card-media">
      <router-link :to="link" class="card-image" tabindex="-1" aria-hidden="true">
        <ProductImage :src="product.thumbnail" :alt="product.title" :eager="eager" />
      </router-link>
      <span v-if="product.badge" class="card-badge">{{ product.badge }}</span>
      <div class="card-tools">
        <button type="button" class="card-tool is-wish" :aria-pressed="saved" :aria-label="`Wishlist ${product.title}`" @click="toggleWishlist">
          <HeartSolidIcon v-if="saved" /><HeartIcon v-else />
        </button>
        <button type="button" class="card-tool" :aria-pressed="comparing" :aria-label="`Compare ${product.title}`" @click="toggleCompare">
          <ScaleIcon />
        </button>
      </div>
    </div>
    <div class="card-body">
      <p class="card-category">{{ categoryName(product.category) }}</p>
      <component :is="heading" class="card-title"><router-link :to="link">{{ product.title }}</router-link></component>
      <p class="card-sku">SKU: {{ product.sku }}</p>
      <div class="card-price-row">
        <p class="card-price">{{ formatLkr(product.price) }}</p>
        <p :class="['stock', { 'is-out': soldOut }]">{{ stockLabel(product.stock) }}</p>
      </div>
      <p v-if="product.bulkMin && product.bulkPrice" class="card-bulk">{{ product.bulkMin }}+ {{ product.colors ? 'racks' : 'items' }}: {{ formatLkr(product.bulkPrice) }} each</p>
      <div class="card-actions">
        <button type="button" class="btn btn-buy" :disabled="soldOut" :aria-label="soldOut ? `${product.title} is sold out` : `Buy it now: ${product.title}`" @click="buyNow(product)">{{ soldOut ? 'Sold out' : 'Buy it now' }}</button>
        <button type="button" class="btn btn-tonal card-cart" :disabled="soldOut" :aria-label="`Add to cart: ${product.title}`" @click="addToCart">
          <ShoppingBagIcon aria-hidden="true" /><span class="card-cart-label">Add to cart</span>
        </button>
      </div>
    </div>
    <div v-if="$slots.default" class="card-extra"><slot /></div>
  </article>
</template>
