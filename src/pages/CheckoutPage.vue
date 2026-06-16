<script setup lang="ts">
import { useCartStore } from '../stores/cartStore'
import { useRouter } from 'vue-router'


const cart = useCartStore()
const router = useRouter()


const placeOrder = () => {
  cart.clearCart()

  router.push('/success')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">

    <h1 class="text-4xl font-bold mb-8">
      Checkout
    </h1>

    <div class="bg-white p-8 rounded-2xl shadow-md">

      <div class="mb-6">
        <label class="block mb-2 font-medium">
          Full Name
        </label>

        <input
          type="text"
          class="w-full border rounded-xl p-3"
        />
      </div>

      <div class="mb-6">
        <label class="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          class="w-full border rounded-xl p-3"
        />
      </div>

      <div class="mb-6">
        <label class="block mb-2 font-medium">
          Address
        </label>

        <textarea
          class="w-full border rounded-xl p-3"
          rows="4"
        />
      </div>

      <div class="border-t pt-6">

        <div class="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>
            ${{ cart.totalPrice.toFixed(2) }}
          </span>
        </div>
<button
  @click="placeOrder"
  class="
    w-full
    mt-6
    bg-black
    text-white
    py-3
    rounded-full
    hover:bg-gray-800
    transition
  "
>
  Place Order
</button>

      </div>

    </div>

  </div>
</template>