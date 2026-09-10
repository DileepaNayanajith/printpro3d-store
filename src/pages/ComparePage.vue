<script setup lang="ts">
import { onMounted } from 'vue'
import { ArrowRightIcon, CheckIcon, ScaleIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCompareStore } from '../stores/compareStore'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'

const compare = useCompareStore()
const cart = useCartStore()
const toast = useToast()
onMounted(() => compare.load())
const add = (product: any) => { cart.addToCart(product); toast.success(`${product.title} added to cart`) }
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p class="section-kicker">Side by side</p><h1 class="section-title">Compare products</h1><p class="mt-4 text-slate-400">Compare up to three products before you decide.</p></div><button v-if="compare.items.length" @click="compare.clear" class="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-400"><TrashIcon class="h-4 w-4" /> Clear comparison</button></div>

      <div v-if="!compare.items.length" class="mt-12 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] px-6 py-24 text-center"><span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-cyan-400/10 text-cyan-400"><ScaleIcon class="h-9 w-9" /></span><h2 class="mt-7 text-2xl font-black">No products selected</h2><p class="mx-auto mt-3 max-w-md leading-7 text-slate-400">Use the Compare button on product cards to add up to three products.</p><router-link to="/products" class="primary-button mt-8">Choose products <ArrowRightIcon class="h-5 w-5" /></router-link></div>

      <div v-else class="mt-10 overflow-x-auto rounded-[2rem] border border-white/10">
        <div class="grid min-w-[720px]" :style="{ gridTemplateColumns: `180px repeat(${compare.items.length}, minmax(220px, 1fr))` }">
          <div class="border-b border-r border-white/10 bg-slate-900 p-5"></div>
          <div v-for="product in compare.items" :key="`head-${product.id}`" class="relative border-b border-r border-white/10 bg-slate-900 p-5 last:border-r-0"><button @click="compare.toggle(product)" class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-slate-950/70 text-slate-400 hover:text-rose-400"><XMarkIcon class="h-5 w-5" /></button><div class="aspect-square rounded-2xl bg-white p-2"><img :src="product.thumbnail" :alt="product.title" class="h-full w-full rounded-xl object-contain" /></div><h2 class="mt-4 font-black">{{ product.title }}</h2></div>
          <template v-for="row in [{ label: 'Price', key: 'price' }, { label: 'Category', key: 'category' }, { label: 'Availability', key: 'stock' }, { label: 'Highlight', key: 'badge' }]" :key="row.key">
            <div class="border-b border-r border-white/10 bg-white/[0.04] p-5 text-sm font-black">{{ row.label }}</div>
            <div v-for="product in compare.items" :key="`${row.key}-${product.id}`" class="border-b border-r border-white/10 bg-white/[0.02] p-5 text-sm text-slate-300 last:border-r-0"><span v-if="row.key === 'price'" class="font-black text-cyan-400">Rs. {{ product.price.toLocaleString() }}</span><span v-else-if="row.key === 'stock'" class="inline-flex items-center gap-2 text-emerald-400"><CheckIcon class="h-4 w-4" /> {{ product.stock }} in stock</span><span v-else class="capitalize">{{ product[row.key] }}</span></div>
          </template>
          <div class="border-r border-white/10 bg-slate-900 p-5 font-black">Action</div><div v-for="product in compare.items" :key="`action-${product.id}`" class="border-r border-white/10 bg-slate-900 p-5 last:border-r-0"><button @click="add(product)" class="primary-button w-full">Add to cart</button></div>
        </div>
      </div>
    </div>
  </div>
</template>
