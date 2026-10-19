<script setup lang="ts">
import { useBuyNow } from '../composables/useBuyNow'
const { buyNow } = useBuyNow()
import { useRouter } from 'vue-router'
const purchaseRouter = useRouter()
import { productSku, stockLabel, isSoldOut } from '../data/catalog'
import { categoryName } from '../data/categories'
import { formatLkr } from '../lib/format'
import { onMounted } from 'vue'
import { ArrowRightIcon, ScaleIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCompareStore } from '../stores/compareStore'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'

const compare = useCompareStore()
const cart = useCartStore()
const toast = useToast()
onMounted(() => compare.load())
const add = (product: any) => { if (isSoldOut(product)) return; if (product.id === 8) return purchaseRouter.push(`/products/${product.id}#purchase`)
  if (!cart.addToCart(product)) return toast.warning('Please check the available quantity.'); toast.success(`${product.title} added to cart`) }
const rows = [{ label: 'SKU', key: 'sku' }, { label: 'Price', key: 'price' }, { label: 'Category', key: 'category' }, { label: 'Availability', key: 'stock' }, { label: 'Highlight', key: 'badge' }]
</script>

<template>
  <div class="container-store page-pad">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p class="eyebrow">Side by side</p><h1 class="page-title mt-2">Compare products</h1><p class="mt-2 text-ink-2">Compare up to three products before you decide.</p></div>
      <button v-if="compare.items.length" type="button" @click="compare.clear" class="btn btn-ghost btn-sm self-start sm:self-auto"><TrashIcon aria-hidden="true" /> Clear comparison</button>
    </div>

    <div v-if="!compare.items.length" class="mt-8 rounded-[var(--pp-radius)] border border-dashed border-line-strong px-6 py-16 text-center">
      <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent"><ScaleIcon class="h-7 w-7" aria-hidden="true" /></span>
      <h2 class="mt-5 text-xl font-bold text-ink">No products selected</h2>
      <p class="mx-auto mt-2 max-w-md leading-7 text-ink-2">Use the Compare button on product cards to add up to three products.</p>
      <router-link to="/products" class="btn btn-primary mt-6">Choose products <ArrowRightIcon aria-hidden="true" /></router-link>
    </div>

    <div v-else class="mt-6 overflow-x-auto rounded-[var(--pp-radius)] border border-line bg-surface" role="region" aria-label="Product comparison" tabindex="0">
      <div class="compare-grid" :style="{ gridTemplateColumns: `minmax(7rem, 10rem) repeat(${compare.items.length}, minmax(12.5rem, 1fr))` }">
        <div class="compare-cell compare-label"></div>
        <div v-for="product in compare.items" :key="`head-${product.id}`" class="compare-cell relative">
          <button type="button" @click="compare.toggle(product)" class="icon-btn absolute right-2 top-2 !h-9 !w-9 bg-surface" :aria-label="`Remove ${product.title} from comparison`"><XMarkIcon class="!h-5 !w-5" /></button>
          <router-link :to="`/products/${product.id}`" class="block h-32 overflow-hidden rounded-[var(--pp-radius-sm)] bg-well sm:h-44" tabindex="-1" aria-hidden="true"><img :src="product.thumbnail" :alt="product.title" class="h-full w-full object-contain p-3 mix-blend-multiply" /></router-link>
          <h2 class="mt-3 font-bold leading-snug text-ink"><router-link :to="`/products/${product.id}`" class="hover:text-accent">{{ product.title }}</router-link></h2>
        </div>
        <template v-for="row in rows" :key="row.key">
          <div class="compare-cell compare-label">{{ row.label }}</div>
          <div v-for="product in compare.items" :key="`${row.key}-${product.id}`" class="compare-cell text-sm text-ink-2">
            <span v-if="row.key === 'price'" class="font-extrabold text-ink tabular-nums">{{ formatLkr(product.price) }}</span>
            <span v-else-if="row.key === 'stock'" :class="['stock', { 'is-out': isSoldOut(product) }]">{{ isSoldOut(product) ? 'Sold out' : stockLabel(product.stock) }}</span>
            <span v-else-if="row.key === 'sku'" class="break-all">{{ productSku(product) }}</span>
            <span v-else-if="row.key === 'category'">{{ categoryName(product.category) }}</span>
            <span v-else>{{ product[row.key] }}</span>
          </div>
        </template>
        <div class="compare-cell compare-label">Action</div>
        <div v-for="product in compare.items" :key="`action-${product.id}`" class="compare-cell grid content-start gap-2">
          <button type="button" :disabled="isSoldOut(product)" @click="buyNow(product)" class="btn btn-buy btn-sm btn-block buy-now-button">{{ isSoldOut(product) ? 'Sold out' : 'Buy it now' }}</button>
          <button type="button" :disabled="isSoldOut(product)" @click="add(product)" class="btn btn-tonal btn-sm btn-block">Add to cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-grid { display: grid; width: 100%; }
.compare-cell { padding: 1rem; border-bottom: 1px solid var(--pp-line); border-right: 1px solid var(--pp-line); }
.compare-cell:nth-child(n) { min-width: 0; }
.compare-label { position: sticky; left: 0; z-index: 1; background: var(--pp-surface); color: var(--pp-ink); font-size: 0.8125rem; font-weight: 750; }
</style>
