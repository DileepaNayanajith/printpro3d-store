<script setup lang="ts">
import { useWishlistStore } from '../stores/wishlistStore'

const wishlist = useWishlistStore()
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

    <h1 class="text-4xl font-bold mb-8">
      My Wishlist ❤️
    </h1>

    <div
      v-if="wishlist.items.length === 0"
      class="text-center py-20"
    >
      <h2 class="text-2xl font-semibold">
        Your wishlist is empty
      </h2>
    </div>

    <div
      v-else
      class="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-8
      "
    >
      <div
        v-for="product in wishlist.items"
        :key="product.id"
        class="
          bg-white
          rounded-3xl
          overflow-hidden
          shadow-md
        "
      >
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="w-full h-56 object-cover"
        >

        <div class="p-4">

          <h2 class="font-bold text-lg">
            {{ product.title }}
          </h2>

          <p class="text-2xl font-bold mt-3">
            ${{ product.price }}
          </p>

          <router-link
            :to="`/products/${product.id}`"
            class="
              inline-block
              mt-4
              bg-black
              text-white
              px-5
              py-2
              rounded-full
            "
          >
            View Product
          </router-link>

        </div>

      </div>
    </div>

  </div>
</template>