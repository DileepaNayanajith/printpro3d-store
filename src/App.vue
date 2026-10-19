<script setup lang="ts">
import CookieConsent from './components/CookieConsent.vue'
import { consentOpen } from './lib/consent'
import { trackSearch } from './lib/ga4'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRightIcon, ChatBubbleLeftRightIcon, MoonIcon, SunIcon, Bars3Icon, MagnifyingGlassIcon, HeartIcon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from './stores/cartStore'
import { useWishlistStore } from './stores/wishlistStore'
import LiveChat from './components/LiveChat.vue'
import SideDrawer from './components/SideDrawer.vue'
import { useCompareStore } from './stores/compareStore'
import { applyTheme, useThemeStore } from './stores/themeStore'
import { categoryGroups, categoryName } from './data/categories'
import catalog from './data/products.json'

const liveChat = ref<InstanceType<typeof LiveChat> | null>(null)
const menu = ref<InstanceType<typeof SideDrawer> | null>(null)
const theme = useThemeStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const compare = useCompareStore()
const route = useRoute()
const router = useRouter()
const headerSearch = ref('')
const searchProducts = () => { trackSearch(headerSearch.value); return router.push({ path: '/products', query: headerSearch.value.trim() ? { q: headerSearch.value.trim() } : {} }) }
const year = new Date().getFullYear()
const navLinks = [{ label: 'Products', to: '/products' }, { label: 'Custom Print', to: '/custom-print' }, { label: 'Compare', to: '/compare' }, { label: 'About', to: '/about' }]
const menuLinks = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: 'Custom Print', to: '/custom-print' }, { label: 'Compare', to: '/compare' }, { label: 'My account', to: '/account' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }]
const menuCategories = categoryGroups.flatMap(group => group.ids).filter(id => catalog.some(product => product.category === id))
const isAdminArea = computed(() => route.path.startsWith('/admin'))
// Cart and checkout keep the bottom-right corner clear; support chat moves into the header there.
const checkoutFlow = computed(() => route.path === '/cart' || route.path === '/checkout')
const themeLabel = computed(() => theme.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme')

onMounted(() => { cart.loadCart(); wishlist.loadWishlist(); compare.load(); applyTheme(theme.theme) })
watch(() => route.fullPath, () => menu.value?.close())
watch(() => route.query.q, q => { if (route.path === '/products') headerSearch.value = typeof q === 'string' ? q : '' })
const isActive = (to: string) => to === '/' ? route.path === '/' : route.path.startsWith(to)
const openChat = () => { menu.value?.close(); liveChat.value?.open() }
const leaveNow = (_el: Element, done: () => void) => done()
</script>

<template>
  <div :class="['min-h-screen', isAdminArea ? 'bg-slate-950 text-white' : ['storefront', { 'dark-theme': theme.theme === 'dark' }]]">
    <template v-if="!isAdminArea">
      <a href="#main-content" class="skip-link">Skip to content</a>
      <div class="store-announcement announcement">Islandwide delivery · Cash on delivery · <a href="https://wa.me/94721272082" target="_blank" rel="noopener noreferrer">WhatsApp support: 072 127 2082</a></div>
      <header class="site-header">
        <div class="container-store header-row">
          <div class="header-brand">
            <router-link to="/" class="brand" aria-label="PRINTPRO3D home">
              <img src="/favicon.svg?v=printpro3d-1" alt="" width="36" height="36" class="brand-mark" />
              <span class="brand-name" aria-hidden="true">PRINTPRO<span>3D</span></span>
            </router-link>
          </div>
          <nav class="main-nav" aria-label="Main">
            <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="nav-link" :aria-current="isActive(link.to) ? 'page' : undefined">
              {{ link.label }}<span v-if="link.to === '/compare' && compare.items.length" class="nav-count" :aria-label="`${compare.items.length} selected`">{{ compare.items.length }}</span>
            </router-link>
          </nav>
          <form class="store-search header-search" role="search" @submit.prevent="searchProducts">
            <MagnifyingGlassIcon aria-hidden="true" />
            <input v-model="headerSearch" type="search" enterkeyhint="search" aria-label="Search the store" placeholder="Search products or SKU…" />
            <button type="submit" aria-label="Search"><ArrowRightIcon aria-hidden="true" /></button>
          </form>
          <div class="header-actions">
            <button type="button" class="icon-btn hidden sm:inline-grid" :aria-label="themeLabel" :title="themeLabel" @click="theme.toggle()">
              <MoonIcon v-if="theme.theme === 'light'" /><SunIcon v-else />
            </button>
            <router-link to="/account" class="icon-btn hidden sm:inline-grid" aria-label="My account" title="My account"><UserIcon /></router-link>
            <router-link to="/wishlist" class="icon-btn hidden sm:inline-grid" aria-label="Wishlist" title="Wishlist">
              <HeartIcon /><span v-if="wishlist.totalItems" class="count-badge">{{ wishlist.totalItems }}</span>
            </router-link>
            <button type="button" :class="['icon-btn', { 'sm:hidden': !checkoutFlow }]" aria-label="Open support chat" title="Support chat" @click="openChat"><ChatBubbleLeftRightIcon /></button>
            <router-link to="/cart" class="icon-btn" :aria-label="cart.totalItems ? `Cart, ${cart.totalItems} items` : 'Cart'" title="Cart">
              <ShoppingBagIcon /><span v-if="cart.totalItems" class="count-badge" aria-hidden="true">{{ cart.totalItems }}</span>
            </router-link>
            <button type="button" class="icon-btn lg:hidden" aria-haspopup="dialog" aria-controls="store-menu" aria-label="Open menu" @click="menu?.open()"><Bars3Icon /></button>
          </div>
        </div>
      </header>

      <SideDrawer id="store-menu" ref="menu" label="Store menu">
        <template #default="{ close }">
          <div class="drawer-head">
            <p class="text-sm font-bold text-ink">Menu</p>
            <button type="button" class="icon-btn" aria-label="Close menu" @click="close"><XMarkIcon /></button>
          </div>
          <nav aria-label="Store" class="py-2">
            <router-link v-for="link in menuLinks" :key="link.to" :to="link.to" class="drawer-link" :aria-current="isActive(link.to) ? 'page' : undefined">{{ link.label }}</router-link>
            <router-link to="/wishlist" class="drawer-link" :aria-current="isActive('/wishlist') ? 'page' : undefined">Wishlist <span v-if="wishlist.totalItems" class="count">{{ wishlist.totalItems }}</span></router-link>
          </nav>
          <nav aria-label="Shop by category" class="border-t border-line py-2">
            <p class="eyebrow px-5 pb-1 pt-3">Shop by category</p>
            <router-link v-for="id in menuCategories" :key="id" :to="{ path: '/products', query: { category: id } }" class="drawer-link !font-medium">{{ categoryName(id) }}</router-link>
          </nav>
          <div class="mt-auto grid gap-2 border-t border-line p-4">
            <button type="button" class="btn btn-secondary btn-block" @click="theme.toggle()"><MoonIcon v-if="theme.theme === 'light'" aria-hidden="true" /><SunIcon v-else aria-hidden="true" /> {{ theme.theme === 'light' ? 'Dark mode' : 'Light mode' }}</button>
            <button type="button" class="btn btn-ghost btn-block" @click="openChat"><ChatBubbleLeftRightIcon aria-hidden="true" /> Support chat</button>
          </div>
        </template>
      </SideDrawer>
    </template>

    <!-- The outgoing page is removed at once (explicit done) so scroll restoration measures only the new page. -->
    <main id="main-content" tabindex="-1" class="outline-none"><router-view v-slot="{ Component }"><transition name="page" @leave="leaveNow"><component :is="Component" /></transition></router-view></main>
    <LiveChat ref="liveChat" v-if="!isAdminArea" :hide-launcher="checkoutFlow" />
    <CookieConsent v-if="!isAdminArea" />
    <footer v-if="!isAdminArea" class="site-footer">
      <div class="container-store footer-grid">
        <div class="max-w-sm">
          <router-link to="/" class="brand" aria-label="PRINTPRO3D home"><img src="/favicon.svg?v=printpro3d-1" alt="" width="36" height="36" class="brand-mark" /><span class="brand-name" aria-hidden="true">PRINTPRO<span>3D</span></span></router-link>
          <p class="mt-4 text-sm leading-6 text-ink-2">Premium 3D printing, RC products and engineering solutions built for makers in Sri Lanka.</p>
          <p class="mt-3 text-sm text-ink-2">Islandwide delivery · Cash on delivery · Bank deposit</p>
        </div>
        <nav aria-label="Explore"><p class="footer-heading">Explore</p><div class="footer-links"><router-link to="/products">Products</router-link><router-link to="/custom-print">Custom STL Print</router-link><router-link to="/compare">Compare</router-link><router-link to="/account">My account</router-link><router-link to="/wishlist">Wishlist</router-link></div></nav>
        <nav aria-label="Company"><p class="footer-heading">Company</p><div class="footer-links"><router-link to="/about">About</router-link><router-link to="/contact">Contact</router-link><a href="https://wa.me/94721272082" target="_blank" rel="noopener noreferrer">WhatsApp 072 127 2082</a></div></nav>
        <nav aria-label="Policies"><p class="footer-heading">Policies</p><div class="footer-links"><router-link to="/terms">Terms & Conditions</router-link><router-link to="/privacy">Privacy policy</router-link><button type="button" @click="consentOpen = true">Privacy settings</button><router-link to="/warranty">Warranty Policy</router-link></div></nav>
      </div>
      <div class="border-t border-line py-5 text-center text-xs text-ink-3">© {{ year }} PRINTPRO3D. All rights reserved.</div>
    </footer>
  </div>
</template>
