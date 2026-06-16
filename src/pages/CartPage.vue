<script setup lang="ts">
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">

    <h1 class="text-4xl font-bold mb-10">
      Shopping Cart
    </h1>

    <!-- Empty Cart -->
    <div
      v-if="cart.items.length === 0"
      class="text-center mt-20"
    >
      <h2 class="text-3xl font-bold mb-6">
        Your Cart is Empty
      </h2>

      <router-link
        to="/products"
        class="
          bg-cyan-500
          text-white
          px-6
          py-3
          rounded-full
        "
      >
        Continue Shopping
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else>

      <div
        v-for="item in cart.items"
        :key="item.id"
        class="
          bg-white
          rounded-2xl
          shadow-md
          p-6
          mb-6
        "
      >

        <div class="flex justify-between items-center">
             <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-24 h-24 object-cover rounded-xl"
              >
          <div>
            <h2 class="text-xl font-bold">
              {{ item.title }}
            </h2>

            <p class="text-gray-500 mt-2">
              ${{ item.price }} each
            </p>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-4">

            <button
              @click="cart.decreaseQuantity(item.id)"
              class="
                w-10
                h-10
                bg-gray-200
                rounded-full
                font-bold
              "
            >
              -
            </button>

            <span class="text-xl font-bold">
              {{ item.quantity }}
            </span>

            <button
              @click="cart.increaseQuantity(item.id)"
              class="
                w-10
                h-10
                bg-gray-200
                rounded-full
                font-bold
              "
            >
              +
            </button>

          </div>

        </div>

        <!-- Subtotal -->
        <div class="mt-4 flex justify-between items-center">

          <p class="font-semibold">
            Subtotal:
            ${{ (item.price * item.quantity).toFixed(2) }}
          </p>

          <button
            @click="cart.removeFromCart(item.id)"
            class="
              bg-red-500
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Remove
          </button>

        </div>

      </div>

      <!-- Total -->
     <div
  class="
    mt-10
    bg-white
    shadow-lg
    rounded-2xl
    p-6
    max-w-md
    ml-auto
  "
>

  <h2 class="text-2xl font-bold mb-6">
    Order Summary
  </h2>

  <div class="flex justify-between mb-3">
    <span>Items</span>
    <span>{{ cart.totalItems }}</span>
  </div>

  <div class="flex justify-between mb-3">
    <span>Shipping</span>
    <span>Free</span>
  </div>

  <hr class="my-4">

  <div
    class="
      flex
      justify-between
      text-xl
      font-bold
    "
  >
    <span>Total</span>

    <span>
      ${{ cart.totalPrice.toFixed(2) }}
    </span>
  </div>

  <button
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
    Checkout
  </button>

</div>

    </div>

  </div>
</template>