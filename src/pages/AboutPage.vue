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
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <section class="border-b border-slate-200 px-[var(--pp-gutter)] py-[clamp(2rem,1.5rem+3vw,4.5rem)]">
      <div class="mx-auto max-w-7xl">
        <div class="max-w-4xl">
          <p class="section-kicker">About PRINTPRO3D</p>
          <h1 class="display-title mt-3">Technology for people who love to <span class="text-blue-600">build.</span></h1>
          <p class="lead mt-4 max-w-2xl">PRINTPRO3D brings exciting RC technology, camera drones and engineering-inspired products together in a simple, modern shopping experience.</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-[var(--pp-gutter)] py-[clamp(2.5rem,2rem+3vw,4.5rem)]">
      <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div><p class="section-kicker">Our approach</p><h2 class="section-title">Focused on better choices.</h2><p class="lead mt-4">We keep the store clear and easy to use so customers can spend less time searching and more time creating, flying and exploring.</p></div>
        <div class="grid gap-5 sm:grid-cols-3">
          <article v-for="pillar in pillars" :key="pillar.title" class="glass-card"><component :is="pillar.icon" class="h-8 w-8 text-blue-600" /><h3 class="mt-7 text-lg font-black">{{ pillar.title }}</h3><p class="mt-3 text-sm leading-6 text-slate-600">{{ pillar.text }}</p></article>
        </div>
      </div>
    </section>

    <section class="border-y border-slate-200 bg-white py-[clamp(2.5rem,2rem+3vw,4.5rem)]">
      <div class="mx-auto max-w-7xl px-[var(--pp-gutter)]">
        <div class="text-center"><p class="section-kicker">How it works</p><h2 class="section-title">From discovery to delivery.</h2></div>
        <div class="mt-14 grid gap-5 md:grid-cols-3">
          <article v-for="step in journey" :key="step.number" class="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <span class="absolute right-5 top-2 text-7xl font-black text-slate-900/[0.04]">{{ step.number }}</span><component :is="step.icon" class="h-8 w-8 text-blue-600" /><h3 class="mt-8 text-xl font-black">{{ step.title }}</h3><p class="mt-3 leading-7 text-slate-600">{{ step.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="px-[var(--pp-gutter)] py-[clamp(2.5rem,2rem+3vw,4.5rem)]">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-2xl bg-blue-100 px-6 py-8 text-slate-950 sm:px-10 md:flex-row md:items-center">
        <div><p class="eyebrow">Start exploring</p><h2 class="mt-2 text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] font-extrabold tracking-tight">Find the product for your next adventure.</h2></div>
        <router-link to="/products" class="btn btn-primary shrink-0">Browse products</router-link>
      </div>
    </section>
  </div>
</template>
