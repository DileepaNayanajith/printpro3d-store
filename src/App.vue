<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Bars3Icon, HeartIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from './stores/cartStore'
import { useWishlistStore } from './stores/wishlistStore'

const cart = useCartStore()
const wishlist = useWishlistStore()
const route = useRoute()
const mobileMenuOpen = ref(false)
const year = new Date().getFullYear()
const navLinks = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }]

onMounted(() => { cart.loadCart(); wishlist.loadWishlist() })
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
const isActive = (to: string) => to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <nav class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <router-link to="/" class="flex items-center gap-3" aria-label="PRINTPRO3D home">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 font-black text-slate-950">P3</span>
          <span class="text-xl font-black tracking-tight sm:text-2xl">PRINTPRO<span class="text-cyan-400">3D</span></span>
        </router-link>
        <div class="hidden items-center gap-9 md:flex">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" :class="['text-sm font-semibold transition', isActive(link.to) ? 'text-cyan-400' : 'text-slate-300 hover:text-white']">{{ link.label }}</router-link>
        </div>
        <div class="flex items-center gap-2">
          <router-link to="/wishlist" class="icon-button" aria-label="Wishlist">
            <HeartIcon class="h-5 w-5" /><span v-if="wishlist.totalItems" class="count-badge bg-rose-500">{{ wishlist.totalItems }}</span>
          </router-link>
          <router-link to="/cart" class="icon-button" aria-label="Cart">
            <ShoppingBagIcon class="h-5 w-5" /><span v-if="cart.totalItems" class="count-badge bg-cyan-400 text-slate-950">{{ cart.totalItems }}</span>
          </router-link>
          <button class="icon-button md:hidden" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
            <XMarkIcon v-if="mobileMenuOpen" class="h-6 w-6" /><Bars3Icon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
      <div v-if="mobileMenuOpen" class="border-t border-white/10 px-5 py-4 md:hidden">
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="block rounded-xl px-4 py-3 font-semibold text-slate-200 hover:bg-white/5 hover:text-cyan-400">{{ link.label }}</router-link>
      </div>
    </nav>
    <main><router-view /></main>
    <footer class="border-t border-white/10 bg-slate-950">
      <div class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div><p class="text-xl font-black">PRINTPRO<span class="text-cyan-400">3D</span></p><p class="mt-4 max-w-sm text-sm leading-6 text-slate-400">Premium 3D printing, RC products and engineering solutions built for makers in Sri Lanka.</p></div>
        <div><p class="text-sm font-bold uppercase tracking-widest text-slate-500">Explore</p><div class="mt-4 flex flex-col gap-3 text-sm text-slate-300"><router-link to="/products" class="hover:text-cyan-400">Products</router-link><router-link to="/wishlist" class="hover:text-cyan-400">Wishlist</router-link><router-link to="/cart" class="hover:text-cyan-400">Cart</router-link></div></div>
        <div><p class="text-sm font-bold uppercase tracking-widest text-slate-500">Why us</p><p class="mt-4 text-sm leading-6 text-slate-400">Carefully selected products, local support and secure islandwide delivery.</p></div>
      </div>
      <div class="border-t border-white/10 py-6 text-center text-xs text-slate-500">© {{ year }} PRINTPRO3D. All rights reserved.</div>
    </footer>
  </div>
</template>
