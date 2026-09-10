<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRightIcon, CheckIcon, ClockIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'

const orderReference = computed(() => `PP3D-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`)
</script>

<template>
  <div class="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8">
    <div class="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>
    <div class="mx-auto max-w-3xl text-center" data-aos="zoom-in">
      <div class="mx-auto grid h-24 w-24 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 shadow-2xl shadow-cyan-400/10">
        <div class="grid h-16 w-16 place-items-center rounded-full bg-cyan-400 text-slate-950"><CheckIcon class="h-9 w-9 stroke-[3]" /></div>
      </div>
      <p class="section-kicker mt-9">Order received</p>
      <h1 class="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Thank you for your order!</h1>
      <p class="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-400">Your order has been received. Our team will contact you shortly to confirm the order and delivery details.</p>

      <div class="mx-auto mt-9 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Order reference</p>
        <p class="mt-2 text-xl font-black tracking-wider text-cyan-400">{{ orderReference }}</p>
      </div>

      <div class="mt-10 grid gap-4 text-left sm:grid-cols-2">
        <div class="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-400"><ClockIcon class="h-6 w-6" /></span>
          <div><h2 class="font-bold">What happens next?</h2><p class="mt-2 text-sm leading-6 text-slate-400">We’ll review your order and contact you to confirm availability and delivery.</p></div>
        </div>
        <div class="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-400"><ShoppingBagIcon class="h-6 w-6" /></span>
          <div><h2 class="font-bold">Keep this reference</h2><p class="mt-2 text-sm leading-6 text-slate-400">Use your order reference if you need to ask our team about this order.</p></div>
        </div>
      </div>

      <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <router-link to="/products" class="primary-button">Continue shopping <ArrowRightIcon class="h-5 w-5" /></router-link>
        <router-link to="/" class="secondary-button"><HomeIcon class="h-5 w-5" /> Back to home</router-link>
      </div>
    </div>
  </div>
</template>
