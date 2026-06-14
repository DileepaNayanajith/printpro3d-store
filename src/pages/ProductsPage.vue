<script setup lang="ts">
import { ref, onMounted } from 'vue'

const products = ref([])

onMounted(async () => {
  const response = await fetch('https://dummyjson.com/products')
  const data = await response.json()
  products.value = data.products
})
</script>

<template>
  <div class="p-8">

    <h1 class="text-4xl font-bold mb-8">
      Our Products
    </h1>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >

      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden"
      >

        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="w-full h-48 object-cover"
        >

        <div class="p-4">

          <h2 class="font-bold text-lg">
            {{ product.title }}
          </h2>

          <p class="text-gray-500 mt-2">
            ${{ product.price }}
          </p>
            <router-link
                :to="`/products/${product.id}`"
                class="inline-block mt-4 bg-cyan-500 text-white px-4 py-2 rounded"
                >
                View Product
            </router-link>

        </div>

      </div>

    </div>

  </div>
</template>