<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref<any>(null)

onMounted(async () => {
  const response = await fetch(
    `https://dummyjson.com/products/${route.params.id}`
  )

  product.value = await response.json()
})
</script>

<template>
  <div class="p-8">

    <div v-if="product">
      <router-link
  to="/products"
  class="inline-block mb-6 bg-gray-800 text-white px-4 py-2 rounded"
>
  ← Back to Products
</router-link>
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-80 rounded-xl mb-6"
      >

      <h1 class="text-4xl font-bold">
        {{ product.title }}
      </h1>

      <p class="text-2xl mt-4">
        ${{ product.price }}
      </p>

      <p class="mt-4 text-gray-600">
        {{ product.description }}
      </p>

    </div>

    <div v-else>
      Loading...
    </div>

  </div>
</template>