<script setup lang="ts">
import { ref, onMounted,computed} from 'vue'
import productsData from '../data/products.json'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useWishlistStore } from '../stores/wishlistStore'


const products = ref([])
const search = ref('')
const selectedCategory = ref('all')
const sortBy = ref('default')
const wishlist = useWishlistStore()

onMounted(() => {
  products.value = productsData
})
const filteredProducts = computed(() => {
  let result = products.value.filter((p: any) =>
    p.title.toLowerCase().includes(search.value.toLowerCase()) &&
    (
      selectedCategory.value === 'all' ||
      p.category === selectedCategory.value
    )
  )

  if (sortBy.value === 'priceLow') {
    result.sort((a: any, b: any) => a.price - b.price)
  }

  if (sortBy.value === 'priceHigh') {
    result.sort((a: any, b: any) => b.price - a.price)
  }

  if (sortBy.value === 'name') {
    result.sort((a: any, b: any) =>
      a.title.localeCompare(b.title)
    )
  }

  return result
})
const isWishlisted = (id: number) => {
  return wishlist.isInWishlist(id)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

   <div class="text-center mb-12">
  <h1 class="text-5xl font-bold text-gray-900">
    Our Products
  </h1>

  <p class="text-gray-500 mt-4">
    Discover premium products crafted for modern lifestyles.
  </p>
</div>

    <div class="mb-8">
        <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="
            w-full
            p-4
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
"
            />
    </div>
<div class="flex gap-3 mb-8 flex-wrap">

  <button
    @click="selectedCategory = 'all'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'all'
        ? 'bg-black text-white'
        : 'bg-gray-200 text-black'
    ]"
  >
    All
  </button>

  <button
    @click="selectedCategory = 'beauty'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'beauty'
        ? 'bg-black text-white'
        : 'bg-gray-200 text-black'
    ]"
  >
    Beauty
  </button>

  <button
    @click="selectedCategory = 'fragrances'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'fragrances'
        ? 'bg-black text-white'
        : 'bg-gray-200 text-black'
    ]"
  >
    Fragrances
  </button>

  <button
    @click="selectedCategory = 'furniture'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'furniture'
        ? 'bg-black text-white'
        : 'bg-gray-200 text-black'
    ]"
  >
    Furniture
  </button>

  <button
    @click="selectedCategory = 'groceries'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'groceries'
        ? 'bg-black text-white'
        : 'bg-gray-200 text-black'
    ]"
  >
    Groceries
  </button>

</div>
              <div class="mb-8">

  <select
    v-model="sortBy"
    class="
      border
      border-gray-300
      rounded-xl
      px-4
      py-2
      bg-white
    "
  >
    <option value="default">
      Featured
    </option>

    <option value="priceLow">
      Price: Low to High
    </option>

    <option value="priceHigh">
      Price: High to Low
    </option>

    <option value="name">
      Name: A-Z
    </option>

  </select>

</div>
                    <div
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
                  v-for="product in filteredProducts"
                  :key="product.id"
                  data-aos="fade-up"
                  class="
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    shadow-md
                    hover:shadow-2xl
                    hover:-translate-y-2
                    transition-all
                    duration-300
                    group
                  "
                >
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="
            w-full
            h-56
            object-cover
            group-hover:scale-105
            transition
            duration-300
            "
        >

        <div class="p-4">

          <h2 class="font-bold text-lg">
            {{ product.title }}
          </h2>

                <p class="text-2xl font-bold text-black mt-3">
                    Rs. {{ product.price.toLocaleString() }}
                    </p>
            <div class="flex items-center justify-between mt-5">

  <router-link
    :to="`/products/${product.id}`"
    class="
      bg-black
      text-white
      px-5
      py-2.5
      rounded-full
      hover:bg-gray-800
      transition
    "
  >
    View Product
  </router-link>

  <button
    @click="
      isWishlisted(product.id)
        ? wishlist.removeFromWishlist(product.id)
        : wishlist.addToWishlist(product)
    "
    :class="[
      'transition',
      isWishlisted(product.id)
        ? 'text-red-500'
        : 'text-gray-400 hover:text-red-500'
    ]"
  >
    <HeartIcon class="w-7 h-7" />
  </button>

</div>
        </div>

      </div>

    </div>

  </div>
  
</template>