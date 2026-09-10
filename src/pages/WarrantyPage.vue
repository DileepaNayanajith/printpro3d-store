<script setup lang="ts">
import { CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
const covered = ['Manufacturing defects under normal intended use', 'Electrical or electronic faults not caused by misuse', 'Items that do not reasonably match the confirmed product', 'Additional manufacturer coverage stated with the product']
const notCovered = ['Crash, impact, water, heat or accidental damage', 'Incorrect charging, unsafe use or failure to follow the manual', 'Unauthorised repairs, modifications or opened components', 'Normal wear, cosmetic marks or damage after delivery']
const openLiveChat = () => document.querySelector<HTMLButtonElement>('[aria-label="Open live chat"]')?.click()
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="max-w-3xl"><p class="section-kicker">Customer protection</p><h1 class="section-title">Warranty Policy</h1><p class="mt-5 text-lg leading-8 text-slate-400">Our electronic products include a minimum six-month guarantee from the date of sale or receipt, subject to applicable law and the conditions below. A product may include longer manufacturer coverage where stated.</p></div>

      <div class="mt-10 flex gap-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 sm:p-8"><ShieldCheckIcon class="h-9 w-9 shrink-0 text-cyan-400" /><div><h2 class="text-xl font-black">Minimum 6-month guarantee</h2><p class="mt-2 leading-7 text-cyan-100/80">Keep your receipt, order reference, packaging and supplied accessories. These help us assess and resolve a warranty request quickly.</p></div></div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <section class="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 sm:p-8"><h2 class="text-xl font-black text-emerald-400">What is covered</h2><ul class="mt-6 space-y-4"><li v-for="item in covered" :key="item" class="flex gap-3 text-slate-300"><CheckCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><span>{{ item }}</span></li></ul></section>
        <section class="rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-6 sm:p-8"><h2 class="text-xl font-black text-amber-400">What is normally not covered</h2><ul class="mt-6 space-y-4"><li v-for="item in notCovered" :key="item" class="flex gap-3 text-slate-300"><ExclamationTriangleIcon class="mt-0.5 h-5 w-5 shrink-0 text-amber-400" /><span>{{ item }}</span></li></ul></section>
      </div>

      <section class="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><h2 class="text-xl font-black">How to make a warranty request</h2><ol class="mt-6 grid gap-4 sm:grid-cols-3"><li class="rounded-2xl bg-slate-900 p-5"><span class="text-xs font-black text-cyan-400">STEP 01</span><p class="mt-2 text-sm leading-6 text-slate-300">Contact us promptly with the order reference and a description of the issue.</p></li><li class="rounded-2xl bg-slate-900 p-5"><span class="text-xs font-black text-cyan-400">STEP 02</span><p class="mt-2 text-sm leading-6 text-slate-300">Provide clear photos or video and retain all included parts and packaging.</p></li><li class="rounded-2xl bg-slate-900 p-5"><span class="text-xs font-black text-cyan-400">STEP 03</span><p class="mt-2 text-sm leading-6 text-slate-300">Allow the item to be inspected before repair, replacement or another remedy is confirmed.</p></li></ol></section>

      <section class="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><h2 class="text-xl font-black">Assessment and remedy</h2><p class="mt-3 leading-7 text-slate-400">After assessment, an appropriate repair, replacement, refund or other remedy will be offered where the claim is valid and as required by applicable law. This policy does not reduce any mandatory consumer rights.</p></section>
      <div class="mt-10 flex flex-wrap gap-3"><button class="primary-button" @click="openLiveChat">Start warranty chat</button><router-link to="/terms" class="secondary-button">Read terms</router-link></div>
    </div>
  </div>
</template>
