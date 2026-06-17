<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from './stores/cartStore'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useWishlistStore } from './stores/wishlistStore'

const cart = useCartStore()
const wishlist = useWishlistStore()
const route = useRoute()

onMounted(() => {
  cart.loadCart()
  wishlist.loadWishlist()
})
</script>

<template>
  <div>
    <nav
      class="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur-md
        border-b
        border-gray-200
      "
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-20">

          <!-- Logo -->
          <router-link
            to="/"
            class="
              text-3xl
              font-extrabold
              tracking-tight
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              bg-clip-text
              text-transparent
            "
          >
            PRINTPRO3D
          </router-link>

          <!-- Navigation -->
          <div class="flex items-center gap-8 font-medium">

            <!-- Home -->
            <router-link
              to="/"
              :class="[
                'transition duration-300 hover:text-cyan-500',
                route.path === '/'
                  ? 'text-cyan-500 font-semibold'
                  : 'text-gray-700'
              ]"
            >
              Home
            </router-link>

            <!-- Products -->
            <router-link
              to="/products"
              :class="[
                'transition duration-300 hover:text-cyan-500',
                route.path.startsWith('/products')
                  ? 'text-cyan-500 font-semibold'
                  : 'text-gray-700'
              ]"
            >
              Products
            </router-link>
            <!-- Wishlist -->
<div class="relative">

 <router-link
  to="/wishlist"
  class="hover:text-red-500 transition duration-300"
>
  <HeartIcon class="w-6 h-6" />
</router-link>

  <span
    v-if="wishlist.totalItems > 0"
    class="
      absolute
      -top-2
      -right-3
      bg-red-500
      text-white
      text-xs
      font-bold
      px-2
      py-0.5
      rounded-full
    "
  >
    {{ wishlist.totalItems }}
  </span>

</div>
            <!-- Cart -->
            <div class="relative">
              
              <router-link
                to="/cart"
                :class="[
                  'transition duration-300 hover:text-cyan-500',
                  route.path === '/cart'
                    ? 'text-cyan-500'
                    : 'text-gray-700'
                ]"
              >
                <ShoppingCartIcon class="w-6 h-6" />
              </router-link>

              <span
                v-if="cart.totalItems > 0"
                class="
                  absolute
                  -top-2
                  -right-3
                  bg-cyan-500
                  text-white
                  text-xs
                  font-bold
                  px-2
                  py-0.5
                  rounded-full
                "
              >
                {{ cart.totalItems }}
              </span>
            </div>
            

          </div>

        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>