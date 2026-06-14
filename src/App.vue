<template>
  <div>
    <nav class="bg-gray-900 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">

          <div class="text-2xl font-bold text-cyan-400">
            PRINTPRO3D
          </div>

          <div class="space-x-6">
            <router-link
              to="/"
              class="hover:text-cyan-400 transition"
            >
              Home
            </router-link>

            <router-link
              to="/products"
              class="hover:text-cyan-400 transition"
            >
              Products
            </router-link>
          </div>

        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>