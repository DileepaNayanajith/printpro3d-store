<script setup lang="ts">
import { ArrowRightIcon, CheckBadgeIcon, CubeTransparentIcon, TruckIcon } from '@heroicons/vue/24/outline'

const benefits = [
  { icon: CubeTransparentIcon, title: 'Maker-grade quality', text: 'Products selected for creators, pilots and engineering enthusiasts.' },
  { icon: CheckBadgeIcon, title: 'Tested & trusted', text: 'Dependable quality and friendly local support.' },
  { icon: TruckIcon, title: 'Islandwide delivery', text: 'Fast, carefully packed delivery across Sri Lanka.' },
]
</script>

<template>
  <div class="bg-slate-950 text-white">
    <section class="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden">
      <video autoplay muted loop playsinline class="absolute inset-0 -z-20 h-full w-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/35"></div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-5 py-20 sm:px-8">
        <div class="max-w-3xl" data-aos="fade-up">
          <p class="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Built for makers</p>
          <h1 class="text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">Ideas made<br><span class="text-cyan-400">real.</span></h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">Premium 3D printing, RC technology and engineering solutions that move your next project forward.</p>
          <div class="mt-10 flex flex-col gap-4 sm:flex-row">
            <router-link to="/products" class="primary-button group">Explore products <ArrowRightIcon class="h-5 w-5 transition-transform group-hover:translate-x-1" /></router-link>
            <a href="#why-us" class="secondary-button">Why PRINTPRO3D?</a>
          </div>
          <div class="mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm text-slate-400">
            <span><b class="text-white">Quality</b> checked</span><span><b class="text-white">Local</b> support</span><span><b class="text-white">Secure</b> delivery</span>
          </div>
        </div>
      </div>
    </section>

    <section id="why-us" class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div class="max-w-2xl" data-aos="fade-up">
        <p class="section-kicker">The PRINTPRO3D difference</p>
        <h2 class="section-title">Everything your next build deserves.</h2>
        <p class="mt-5 text-lg leading-8 text-slate-400">The right products and support, from your first idea to the finished build.</p>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <article v-for="(benefit, index) in benefits" :key="benefit.title" class="glass-card" data-aos="fade-up" :data-aos-delay="index * 100">
          <component :is="benefit.icon" class="h-8 w-8 text-cyan-400" />
          <h3 class="mt-8 text-xl font-bold">{{ benefit.title }}</h3>
          <p class="mt-3 leading-7 text-slate-400">{{ benefit.text }}</p>
        </article>
      </div>
    </section>

    <section class="px-5 pb-24 sm:px-8">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-cyan-400 px-7 py-12 text-slate-950 sm:px-12 md:flex-row md:items-center">
        <div><p class="text-sm font-black uppercase tracking-[0.2em]">Ready to build?</p><h2 class="mt-3 text-3xl font-black sm:text-4xl">Discover your next favourite product.</h2></div>
        <router-link to="/products" class="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-bold text-white">Shop now <ArrowRightIcon class="h-5 w-5" /></router-link>
      </div>
    </section>
  </div>
</template>
