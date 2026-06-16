<script setup lang="ts">
import { useCartStore } from './stores/cartStore'

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
        <div class="flex justify-between items-center h-16">

          <div
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
          </div>

          <div class="space-x-6">
            <router-link
              to="/"
              class="hover:text-cyan-400 transition"
            >
              Home
            </router-link>

            <router-link
              to="/products"
              class="hover:text-cyan-400 transition"
            >
              Products
            </router-link>
            <router-link
               to="/cart"
              class="hover:text-cyan-400 transition"
>
                Cart ({{ cart.items.length }})
              </router-link>
          </div>

        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>