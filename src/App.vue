<script setup lang="ts">
import { useCartStore } from './stores/cartStore'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const cart = useCartStore()
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
          <div class="flex items-center gap-8 font-medium text-gray-700">

            <router-link
              to="/"
              class="hover:text-cyan-500 transition duration-300"
            >
              Home
            </router-link>

            <router-link
              to="/products"
              class="hover:text-cyan-500 transition duration-300"
            >
              Products
            </router-link>

            <!-- Cart -->
            <div class="relative">
              <router-link
                to="/cart"
                class="hover:text-cyan-500 transition duration-300"
              >
                <ShoppingCartIcon class="w-6 h-6" />
              </router-link>

              <span
                v-if="cart.items.length > 0"
                class="
                  absolute
                  -top-2
                  -right-3
                  bg-cyan-500
                  text-white
                  text-xs
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