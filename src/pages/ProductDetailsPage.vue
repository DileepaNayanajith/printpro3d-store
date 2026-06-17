<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useWishlistStore } from '../stores/wishlistStore'

const route = useRoute()
const cart = useCartStore()
const toast = useToast()

const product = ref<any>(null)
const selectedImage = ref('')
const relatedProducts = ref<any[]>([])
const wishlist = useWishlistStore()

const isWishlisted = (id: number) => {
  return wishlist.isInWishlist(id)
}

onMounted(async () => {
  const response = await fetch(
    `https://dummyjson.com/products/${route.params.id}`
  )

  const data = await response.json()

  product.value = data

  selectedImage.value = data.thumbnail

  const relatedResponse = await fetch(
    `https://dummyjson.com/products/category/${data.category}`
  )

  const relatedData = await relatedResponse.json()

  relatedProducts.value = relatedData.products.filter(
    (item: any) => item.id !== data.id
  )
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
<!-- Product Image + Gallery -->
<div>

  <!-- Main Image -->
  <div
    class="
      bg-gray-100
      rounded-3xl
      p-6 md:p-10
      flex
      justify-center
    "
  >
    <img
      :src="selectedImage"
      :alt="product.title"
      class="
        w-full
        max-w-md
        rounded-2xl
      "
    />
  </div>

  <!-- Thumbnail Gallery -->
  <div
    class="
      flex
      gap-3
      mt-6
      flex-wrap
      justify-center
    "
  >
    <img
      v-for="image in product.images"
      :key="image"
      :src="image"
      @click="selectedImage = image"
      :class="[
        'w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all',
        selectedImage === image
          ? 'border-cyan-500'
          : 'border-transparent hover:border-cyan-500'
      ]"
    />
  </div>

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
              text-3xl md:text-5xl
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
              text-2xl md:text-4xl
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
<div class="mt-8 flex items-center gap-3">

  <button
    @click="addProductToCart"
    class="
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

  <button
    @click="
      isWishlisted(product.id)
        ? wishlist.removeFromWishlist(product.id)
        : wishlist.addToWishlist(product)
    "
    :class="[
      'p-4 rounded-full border transition',
      isWishlisted(product.id)
        ? 'bg-red-500 text-white border-red-500'
        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
    ]"
  >
    <HeartIcon class="w-6 h-6" />
  </button>

</div>
          <div class="mt-20">

  <h2 class="text-3xl font-bold mb-8">
    You May Also Like
  </h2>

  <div
    class="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-4
      gap-6
    "
  >

    <div
      v-for="item in relatedProducts.slice(0, 4)"
      :key="item.id"
      class="
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
      "
    >
      <img
        :src="item.thumbnail"
        :alt="item.title"
        class="w-full h-48 object-cover"
      >

      <div class="p-4">

        <h3 class="font-bold">
          {{ item.title }}
        </h3>

        <p class="mt-2 font-semibold">
          ${{ item.price }}
        </p>

        <router-link
          :to="`/products/${item.id}`"
          class="
            inline-block
            mt-4
            bg-black
            text-white
            px-4
            py-2
            rounded-full
          "
        >
          View
        </router-link>

      </div>

    </div>

  </div>

</div>

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