<script setup lang="ts">
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()

const totalPrice = () => {
  return cart.items.reduce(
    (total, item) => total + item.price,
    0
  )
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-8">
      Shopping Cart
    </h1>

    <!-- Empty Cart State -->
    <div
      v-if="cart.items.length === 0"
      class="text-center mt-10"
    >
      <h2 class="text-2xl font-bold mb-4">
        Your Cart is Empty
      </h2>

      <router-link
        to="/products"
        class="bg-cyan-500 text-white px-6 py-3 rounded-lg"
      >
        Continue Shopping
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else>
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="border p-4 rounded-lg mb-4"
      >
        <h2 class="text-xl font-bold">
          {{ item.title }}
        </h2>

        <p class="mt-2">
          ${{ item.price }}
        </p>

        <button
          @click="cart.removeFromCart(item.id)"
          class="mt-3 bg-red-600 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </div>

      <!-- Total Price -->
      <div class="mt-8 text-right">
        <h2 class="text-3xl font-bold">
          Total: ${{ totalPrice() }}
        </h2>
      </div>
    </div>
  </div>
</template>