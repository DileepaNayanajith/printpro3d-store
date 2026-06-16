<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'

const route = useRoute()
const cart = useCartStore()
const toast = useToast()

const product = ref<any>(null)

onMounted(async () => {
  const response = await fetch(
    `https://dummyjson.com/products/${route.params.id}`
  )

  product.value = await response.json()
})
const addProductToCart = () => {
  console.log('CLICKED')
  console.log(product.value)

  cart.addToCart(product.value)

  toast.success('Product added to cart!')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

    <div v-if="product">

      <!-- Back Button -->
      <router-link
        to="/products"
        class="
          inline-block
          mb-10
          bg-gray-900
          text-white
          px-5
          py-3
          rounded-full
          hover:bg-gray-800
          transition
        "
      >
        ← Back to Products
      </router-link>

      <!-- Product Layout -->
      <div
        class="
          grid
          md:grid-cols-2
          gap-16
          items-center
        "
      >

        <!-- Product Image -->
        <div
          class="
            bg-gray-100
            rounded-3xl
            p-10
            flex
            justify-center
            
          "
        >
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full max-w-md"
          >
        </div>

        <!-- Product Info -->
        <div>

          <!-- Discount Badge -->
          <div
            class="
              inline-block
              bg-red-500
              text-white
              px-3
              py-1
              rounded-full
              text-sm
              font-semibold
              mb-4
            "
          >
            {{ product.discountPercentage }}% OFF
          </div>

          <!-- Title -->
          <h1
            class="
              text-5xl
              font-bold
              text-gray-900
            "
          >
            {{ product.title }}
          </h1>

          <!-- Rating -->
          <div
            class="
              flex
              items-center
              gap-2
              mt-4
            "
          >
                    <span class="text-yellow-500 text-xl">
                      ⭐
                    </span>

                    <span class="font-medium">
                      {{ product.rating }}
                    </span>
          </div>

          <!-- Price -->
          <p
            class="
              text-4xl
              font-bold
              mt-6
            "
          >
            ${{ product.price }}
          </p>

          <!-- Description -->
          <p
            class="
              mt-6
              text-gray-600
              leading-relaxed
              text-lg
            "
          >
            {{ product.description }}
          </p>

          <!-- Add To Cart -->
          <button
            @click="addProductToCart"
            class="
              mt-8
              bg-black
              text-white
              px-8
              py-4
              rounded-full
              hover:bg-gray-800
              transition
              text-lg
            "
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>

    <!-- Loading State -->
    <div
      v-else
      class="
        flex
        justify-center
        items-center
        h-96
        text-2xl
        font-semibold
        text-gray-500
      "
    >
      Loading Product...
    </div>

  </div>
</template>