<template>
  <section
    class="
      relative
      min-h-screen
      flex
      items-center
      justify-center
      overflow-hidden
    "
  >

    <!-- Background Video -->
    <video
      autoplay
      muted
      loop
      playsinline
      class="
        absolute
        inset-0
        w-full
        h-full
        object-cover
      "
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>

    <!-- Dark Overlay -->
    <div
      class="
        absolute
        inset-0
        bg-black/70
      "
    ></div>

    <!-- Hero Content -->
    <div
      class="
        relative
        z-10
        text-center
        px-6
        -mt-20
      "
    >

      <h1
        class="
          text-6xl
          md:text-7xl
          font-extrabold
          mb-6
          text-white
          drop-shadow-2xl
        "
      >
        PRINTPRO3D
      </h1>

      <p
        class="
          text-xl
          text-white/90
          mb-8
          max-w-2xl
          mx-auto
          drop-shadow-lg
        "
      >
        Premium 3D Printing, RC Products &
        Engineering Solutions
      </p>

      <router-link
        to="/products"
        class="
          inline-block
          bg-white
          hover:bg-gray-100
          hover:scale-105
          px-8
          py-4
          rounded-xl
          text-black
          font-bold
          text-lg
          transition-all
          duration-300
          shadow-xl
        "
      >
        Explore Products
      </router-link>

    </div>

    <!-- Scroll Indicator -->
    <div
      class="
        absolute
        bottom-10
        left-1/2
        -translate-x-1/2
        text-white
        animate-bounce
        text-3xl
      "
    >
      ↓
    </div>

  </section>
</template>