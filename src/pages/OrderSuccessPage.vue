<template>
  <div
    class="
      min-h-[70vh]
      flex
      flex-col
      items-center
      justify-center
      text-center
      px-6
    "
  >
    <div class="text-6xl mb-6">
      🎉
    </div>

    <h1 class="text-5xl font-bold mb-4">
      Order Placed Successfully!
    </h1>

    <p class="text-gray-500 text-lg mb-8">
      Thank you for shopping with PRINTPRO3D.
    </p>

    <router-link
      to="/products"
      class="
        bg-black
        text-white
        px-8
        py-3
        rounded-full
        hover:bg-gray-800
        transition
      "
    >
      Continue Shopping
    </router-link>
  </div>
</template>