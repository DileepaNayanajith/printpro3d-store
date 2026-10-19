<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BoltIcon, ArrowLeftIcon, CheckCircleIcon, HeartIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import catalog from '../data/products.json'
import { publicProducts, productDescription } from '../lib/seo'
const productsData=publicProducts(catalog)
import { stockLabel } from '../data/catalog'
import ProductImage from '../components/ProductImage.vue'
import { useRecentStore } from '../stores/recentStore'

const route = useRoute()
const router = useRouter()
const selectedColor = ref('')
const selectedImage = ref('')
const quantity = ref(1)
const chooseColor = (color: string) => { selectedColor.value=color; selectedImage.value=product.value?.colorImages?.[color as 'White'|'Black'|'Gray'] || product.value?.thumbnail || '' }
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()
const recent = useRecentStore()
const product = computed(() => productsData.find(item => item.id === Number(route.params.id)))
const relatedProducts = computed(() => productsData.filter(item => item.category === product.value?.category && item.id !== product.value?.id).slice(0, 4))
const recentlyViewed = computed(() => recent.items.filter(item => item.id !== product.value?.id).slice(0, 4))
recent.load()
watch(product, value => { if (value) recent.add(value); selectedColor.value=''; selectedImage.value=value?.thumbnail || ''; quantity.value=1 }, { immediate: true })


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
  <div class="product-detail-page min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-16">
    <div v-if="product" class="mx-auto max-w-7xl">
      <router-link to="/products" class="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600">
        <ArrowLeftIcon class="h-4 w-4" /> Back to products
      </router-link>

      <section class="product-detail-layout mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="product-gallery overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-9">
          <ProductImage eager :src="selectedImage" :alt="product.title" class="aspect-square h-full w-full rounded-2xl object-contain" />
          <div v-if="product.images" class="mt-4 grid grid-cols-5 gap-2">
            <button v-for="(image,index) in product.images" :key="image" @click="selectedImage=image" :aria-label="`View ${product.title} photo ${index+1}`" :aria-pressed="selectedImage===image" :class="['overflow-hidden rounded-lg border-2',selectedImage===image?'border-cyan-500':'border-slate-200']"><img :src="image" :alt="`${product.title} photo ${index+1}`" loading="lazy" class="aspect-square w-full object-cover" /></button>
          </div>
        </div>

        <div class="lg:sticky lg:top-40">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-slate-950">{{ product.badge }}</span>
            <span class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-slate-600">{{ product.category.replace('-', ' ') }}</span>
          </div>
          <h1 class="mt-6 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">{{ product.title }}</h1>
          <p class="mt-3 break-all text-xs font-semibold text-slate-500">SKU: {{ product.sku }}</p>
          <p class="mt-5 text-3xl font-black text-blue-600">Rs. {{ product.price.toLocaleString() }}</p>
          <p class="mt-6 max-w-xl text-lg leading-8 text-slate-600">{{ productDescription(product) }}</p>

          <ul v-if="product.features?.length" class="mt-5 space-y-2 text-sm text-slate-600"><li v-for="feature in product.features" :key="feature" class="flex items-center gap-2"><CheckCircleIcon class="h-4 w-4 shrink-0 text-blue-600" />{{ feature }}</li></ul>
          <p v-if="product.photoNote" class="mt-4 text-xs leading-5 text-slate-500">{{ product.photoNote }}</p>
          <div class="mt-7 flex items-center gap-2 text-sm font-bold text-emerald-700">
            <CheckCircleIcon class="h-5 w-5" /> {{ stockLabel(product.stock) }}
          </div>

          <div id="purchase" v-if="product.colors" class="mt-7 space-y-5 scroll-mt-28">
            <div class="rounded-2xl border border-cyan-400/30 bg-blue-100/10 p-4"><p class="font-bold text-blue-700">3 or more racks: Rs. 1,750 each</p><p class="mt-1 text-sm text-slate-600">1–2 racks: Rs. 1,850 each. Mix colours — the discount applies automatically in your cart.</p></div>
            <fieldset><legend class="mb-3 font-bold">Choose your colour</legend><div class="flex flex-wrap gap-3"><button v-for="color in product.colors" :key="color" type="button" @click="chooseColor(color)" :aria-pressed="selectedColor===color" :class="['rounded-full border px-5 py-3 font-bold',selectedColor===color?'border-cyan-400 bg-blue-100 text-slate-950':'border-slate-200 text-slate-900']">{{ color }}</button></div></fieldset>
            <label class="flex items-center gap-4 font-bold">Quantity<input v-model.number="quantity" type="number" min="1" max="99" class="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2" /></label>
            <p class="text-sm leading-6 text-slate-600">10 slots per rack · Fits 1:64 cars · Combine more racks as your collection grows</p>
            <p class="text-sm text-slate-600">Rack only. Cars shown in the photos are not included.</p>
          </div>
          <div class="product-detail-actions mt-9 grid gap-3 sm:grid-cols-2">
            <button :disabled="product.stock === 0" @click="buyNow" class="buy-now-button inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"><BoltIcon class="h-5 w-5" /> Buy it now</button>
            <button :disabled="product.stock === 0" @click="addToCart" class="primary-button flex-1"><ShoppingBagIcon class="h-5 w-5" /> Add to cart</button>
            <button @click="toggleWishlist" :class="['sm:col-span-2 inline-flex h-14 items-center justify-center gap-2 rounded-full border px-7 font-bold transition', wishlist.isInWishlist(product.id) ? 'border-rose-500 bg-rose-500 text-slate-900' : 'border-slate-200 text-slate-900 hover:border-rose-400 hover:text-rose-600']">
              <HeartIcon class="h-5 w-5" /> {{ wishlist.isInWishlist(product.id) ? 'Saved' : 'Save' }}
            </button>
          </div>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><TruckIcon class="h-6 w-6 text-blue-600" /><div><p class="text-sm font-bold">Islandwide delivery</p><p class="text-xs text-slate-500">Bank deposit: free · COD: Rs. 400</p></div></div>
            <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><CheckCircleIcon class="h-6 w-6 text-blue-600" /><div><p class="text-sm font-bold">Quality checked</p><p class="text-xs text-slate-500">Local support</p></div></div>
          </div>
        </div>
      </section>

      <section v-if="relatedProducts.length" class="mt-24 border-t border-slate-200 pt-16">
        <p class="section-kicker">Keep exploring</p>
        <h2 class="mt-3 text-3xl font-black">You may also like</h2>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <router-link v-for="item in relatedProducts" :key="item.id" :to="`/products/${item.id}`" class="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-cyan-400/30">
            <div class="aspect-square bg-white p-3"><img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-2xl object-contain transition duration-300 group-hover:scale-105" /></div>
            <div class="p-5"><h3 class="font-bold text-slate-900">{{ item.title }}</h3><p class="mt-2 font-black text-blue-600">Rs. {{ item.price.toLocaleString() }}</p></div>
          </router-link>
        </div>
      </section>

      <section v-if="recentlyViewed.length" class="mt-20 border-t border-slate-200 pt-14">
        <p class="section-kicker">Your history</p><h2 class="mt-3 text-3xl font-black">Recently viewed</h2>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <router-link v-for="item in recentlyViewed" :key="`recent-${item.id}`" :to="`/products/${item.id}`" class="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-cyan-400/30"><div class="h-20 w-20 shrink-0 rounded-xl bg-white p-1"><img :src="item.thumbnail" :alt="item.title" class="h-full w-full rounded-lg object-contain" /></div><div class="min-w-0"><h3 class="truncate text-sm font-bold">{{ item.title }}</h3><p class="mt-1 text-sm font-black text-blue-600">Rs. {{ item.price.toLocaleString() }}</p></div></router-link>
        </div>
      </section>
    </div>

    <div v-else class="mx-auto max-w-2xl py-32 text-center"><h1 class="text-3xl font-black">Product not found</h1><router-link to="/products" class="primary-button mt-8">Browse products</router-link></div>
  </div>
</template>
