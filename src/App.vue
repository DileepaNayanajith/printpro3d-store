<script setup lang="ts">
import CookieConsent from './components/CookieConsent.vue'
import { consentOpen } from './lib/consent'
import { trackSearch } from './lib/ga4'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MoonIcon, SunIcon, Bars3Icon, MagnifyingGlassIcon, HeartIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from './stores/cartStore'
import { useWishlistStore } from './stores/wishlistStore'
import LiveChat from './components/LiveChat.vue'
import { useCompareStore } from './stores/compareStore'
import { useThemeStore } from './stores/themeStore'

const theme = useThemeStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const compare = useCompareStore()
const route = useRoute()
const router = useRouter()
const headerSearch = ref('')
const searchProducts = () => { trackSearch(headerSearch.value); return router.push({ path: '/products', query: headerSearch.value.trim() ? { q: headerSearch.value.trim() } : {} }) }
const mobileMenuOpen = ref(false)
const year = new Date().getFullYear()
const navLinks = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: 'Custom Print', to: '/custom-print' }, { label: 'Compare', to: '/compare' }, { label: 'My account', to: '/account' }, { label: 'About', to: '/about' }]
const isAdminArea = computed(() => route.path.startsWith('/admin'))

onMounted(() => { cart.loadCart(); wishlist.loadWishlist(); compare.load() })
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
})
const isActive = (to: string) => to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<template>
  <div :class="['min-h-screen', isAdminArea ? 'bg-slate-950 text-white' : ['storefront bg-slate-50 text-slate-900', { 'dark-theme': theme.theme === 'dark' }]]">
    <div v-if="!isAdminArea" class="bg-blue-600 px-4 py-2 text-center text-[10px] font-semibold text-white sm:text-xs">Islandwide delivery · Cash on delivery · <a href="https://wa.me/94721272082" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2">WhatsApp support: 072 127 2082</a></div>
    <nav v-if="!isAdminArea" class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div class="store-header mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <router-link to="/" class="store-brand flex min-w-0 items-center gap-2" aria-label="PRINTPRO3D home">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 font-black text-slate-950">P3</span>
          <span class="brand-name font-black tracking-tight sm:text-2xl">PRINTPRO<span class="text-blue-600">3D</span></span>
        </router-link>
        <div class="hidden items-center gap-5 xl:flex">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" :class="['text-sm font-semibold transition', isActive(link.to) ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900']">{{ link.label }}</router-link>
        </div>
        <div class="header-actions flex shrink-0 items-center gap-1">
          <button class="icon-button" :aria-label="theme.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'" :title="theme.theme === 'light' ? 'Dark theme' : 'Light theme'" @click="theme.toggle()">
            <MoonIcon v-if="theme.theme === 'light'" class="h-5 w-5" /><SunIcon v-else class="h-5 w-5" />
          </button>
          <router-link to="/wishlist" class="icon-button" aria-label="Wishlist">
            <HeartIcon class="h-5 w-5" /><span v-if="wishlist.totalItems" class="count-badge bg-rose-500">{{ wishlist.totalItems }}</span>
          </router-link>
          <router-link to="/cart" class="icon-button" aria-label="Cart">
            <ShoppingBagIcon class="h-5 w-5" /><span v-if="cart.totalItems" class="count-badge bg-blue-100 text-slate-950">{{ cart.totalItems }}</span>
          </router-link>
          <button class="icon-button xl:hidden" :aria-expanded="mobileMenuOpen" aria-controls="store-menu" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
            <XMarkIcon v-if="mobileMenuOpen" class="h-6 w-6" /><Bars3Icon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
      <form class="mx-auto flex max-w-7xl gap-2 px-5 pb-3 sm:px-8" role="search" @submit.prevent="searchProducts">
        <label class="relative min-w-0 flex-1"><MagnifyingGlassIcon class="absolute left-4 top-3 h-5 w-5 text-slate-500" /><input v-model="headerSearch" type="search" aria-label="Search the store" placeholder="Search products or SKU…" class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm" /></label>
        <button type="submit" class="rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">Search</button>
      </form>
      <div id="store-menu" v-if="mobileMenuOpen" class="border-t border-slate-200 px-5 py-4 xl:hidden">
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600">{{ link.label }}</router-link>
      </div>
    </nav>
    <main><router-view v-slot="{ Component }"><transition name="page" mode="out-in"><component :is="Component" /></transition></router-view></main>
    <LiveChat v-if="!isAdminArea" />
    <CookieConsent v-if="!isAdminArea" />
    <footer v-if="!isAdminArea" class="border-t border-slate-200 bg-slate-50">
      <div class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div><p class="text-xl font-black">PRINTPRO<span class="text-blue-600">3D</span></p><p class="mt-4 max-w-sm text-sm leading-6 text-slate-600">Premium 3D printing, RC products and engineering solutions built for makers in Sri Lanka.</p></div>
        <div><p class="text-sm font-bold uppercase tracking-widest text-slate-500">Explore</p><div class="mt-4 flex flex-col gap-3 text-sm text-slate-600"><router-link to="/products" class="hover:text-blue-600">Products</router-link><router-link to="/custom-print" class="hover:text-blue-600">Custom STL Print</router-link><router-link to="/compare" class="hover:text-blue-600">Compare</router-link><router-link to="/about" class="hover:text-blue-600">About</router-link><router-link to="/contact" class="hover:text-blue-600">Contact</router-link></div></div>
        <div><p class="text-sm font-bold uppercase tracking-widest text-slate-500">Policies</p><div class="mt-4 flex flex-col gap-3 text-sm text-slate-600"><router-link to="/terms" class="hover:text-blue-600">Terms & Conditions</router-link><router-link to="/privacy">Privacy policy</router-link><button class="text-left" @click="consentOpen = true">Privacy settings</button><router-link to="/warranty" class="hover:text-blue-600">Warranty Policy</router-link></div></div>
      </div>
      <div class="border-t border-slate-200 py-6 text-center text-xs text-slate-500">© {{ year }} PRINTPRO3D. All rights reserved.</div>
    </footer>
  </div>
</template>
