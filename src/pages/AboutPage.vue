<script setup lang="ts">
import { CheckBadgeIcon, CubeTransparentIcon, LightBulbIcon, RocketLaunchIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/vue/24/outline'

const pillars = [
  { icon: CubeTransparentIcon, title: 'Curated products', text: 'A focused selection of camera drones, RC crawlers and maker-friendly technology.' },
  { icon: CheckBadgeIcon, title: 'Clear information', text: 'Straightforward prices, stock indicators and product details to help you choose confidently.' },
  { icon: TruckIcon, title: 'Flexible delivery', text: 'Islandwide delivery with cash-on-delivery and free-delivery bank deposit options.' },
]

const journey = [
  { icon: LightBulbIcon, number: '01', title: 'Discover', text: 'Explore the collection, compare prices and find the right product.' },
  { icon: ShoppingBagIcon, number: '02', title: 'Order', text: 'Add your favourites to the cart and choose a convenient payment option.' },
  { icon: RocketLaunchIcon, number: '03', title: 'Enjoy', text: 'We confirm your order and arrange secure islandwide delivery.' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <section class="relative isolate overflow-hidden border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32">
      <div class="absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>
      <div class="mx-auto max-w-7xl">
        <div class="max-w-4xl" data-aos="fade-up">
          <p class="section-kicker">About PRINTPRO3D</p>
          <h1 class="mt-5 text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">Technology for people who love to <span class="text-cyan-400">build.</span></h1>
          <p class="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">PRINTPRO3D brings exciting RC technology, camera drones and engineering-inspired products together in a simple, modern shopping experience.</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div data-aos="fade-right"><p class="section-kicker">Our approach</p><h2 class="section-title">Focused on better choices.</h2><p class="mt-5 text-lg leading-8 text-slate-400">We keep the store clear and easy to use so customers can spend less time searching and more time creating, flying and exploring.</p></div>
        <div class="grid gap-5 sm:grid-cols-3">
          <article v-for="(pillar, index) in pillars" :key="pillar.title" class="glass-card" data-aos="fade-up" :data-aos-delay="index * 80"><component :is="pillar.icon" class="h-8 w-8 text-cyan-400" /><h3 class="mt-7 text-lg font-black">{{ pillar.title }}</h3><p class="mt-3 text-sm leading-6 text-slate-400">{{ pillar.text }}</p></article>
        </div>
      </div>
    </section>

    <section class="border-y border-white/10 bg-white/[0.025] py-24">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <div class="text-center" data-aos="fade-up"><p class="section-kicker">How it works</p><h2 class="section-title">From discovery to delivery.</h2></div>
        <div class="mt-14 grid gap-5 md:grid-cols-3">
          <article v-for="(step, index) in journey" :key="step.number" class="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-7" data-aos="fade-up" :data-aos-delay="index * 90">
            <span class="absolute right-5 top-2 text-7xl font-black text-white/[0.04]">{{ step.number }}</span><component :is="step.icon" class="h-8 w-8 text-cyan-400" /><h3 class="mt-8 text-xl font-black">{{ step.title }}</h3><p class="mt-3 leading-7 text-slate-400">{{ step.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="px-5 py-24 sm:px-8">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-cyan-400 px-7 py-12 text-slate-950 sm:px-12 md:flex-row md:items-center">
        <div><p class="text-sm font-black uppercase tracking-[0.2em]">Start exploring</p><h2 class="mt-3 text-3xl font-black sm:text-4xl">Find the product for your next adventure.</h2></div>
        <router-link to="/products" class="shrink-0 rounded-full bg-slate-950 px-7 py-4 font-bold text-white transition hover:-translate-y-0.5">Browse products</router-link>
      </div>
    </section>
  </div>
</template>
