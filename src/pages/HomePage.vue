<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightIcon, CheckBadgeIcon, ChevronDownIcon, CubeTransparentIcon, TruckIcon } from '@heroicons/vue/24/outline'

import ProductsPage from './ProductsPage.vue'


const activeFaq = ref<number | null>(0)
const faqs = [
  { question: 'Do you deliver across Sri Lanka?', answer: 'Yes. Islandwide delivery is available. Cash-on-delivery orders include a Rs. 400 delivery fee.' },
  { question: 'How do I get free delivery?', answer: 'Choose bank deposit at checkout to receive free delivery on your order.' },
  { question: 'How is product availability confirmed?', answer: 'Stock indicators are shown on each product. Our team will confirm final availability after you place the order.' },
  { question: 'Can I get help choosing a drone or RC vehicle?', answer: 'Yes. Open the PRINTPRO3D live chat and tell us your budget and what you plan to use the product for.' },
]

const openLiveChat = () => document.querySelector<HTMLButtonElement>('[aria-label="Open live chat"]')?.click()

const benefits = [
  { icon: CubeTransparentIcon, title: 'Maker-grade quality', text: 'Products selected for creators, pilots and engineering enthusiasts.' },
  { icon: CheckBadgeIcon, title: 'Tested & trusted', text: 'Dependable quality and friendly local support.' },
  { icon: TruckIcon, title: 'Islandwide delivery', text: 'Fast, carefully packed delivery across Sri Lanka.' },
]
</script>

<template>
  <div class="bg-slate-50 text-slate-900">
    <ProductsPage />
    <section id="why-us" class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div class="max-w-2xl" data-aos="fade-up">
        <p class="section-kicker">The PRINTPRO3D difference</p>
        <h2 class="section-title">Everything your next build deserves.</h2>
        <p class="mt-5 text-lg leading-8 text-slate-600">The right products and support, from your first idea to the finished build.</p>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <article v-for="(benefit, index) in benefits" :key="benefit.title" class="glass-card" data-aos="fade-up" :data-aos-delay="index * 100">
          <component :is="benefit.icon" class="h-8 w-8 text-blue-600" />
          <h3 class="mt-8 text-xl font-bold">{{ benefit.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ benefit.text }}</p>
        </article>
      </div>
    </section>

    <section class="border-y border-slate-200 bg-slate-100 py-24">
      <div class="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-aos="fade-up">
          <p class="section-kicker">Need to know</p>
          <h2 class="section-title">Questions, answered.</h2>
          <p class="mt-5 max-w-md text-lg leading-8 text-slate-600">Everything you need for a confident order. Still unsure? Our live chat is always one click away.</p>
          <button class="secondary-button mt-8" @click="openLiveChat">Chat with us</button>
        </div>
        <div class="space-y-3" data-aos="fade-up">
          <article v-for="(faq, index) in faqs" :key="faq.question" class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button @click="activeFaq = activeFaq === index ? null : index" class="flex w-full items-center justify-between gap-5 p-5 text-left font-bold sm:p-6" :aria-expanded="activeFaq === index">
              <span>{{ faq.question }}</span><ChevronDownIcon :class="['h-5 w-5 shrink-0 text-blue-600 transition-transform', activeFaq === index ? 'rotate-180' : '']" />
            </button>
            <div v-if="activeFaq === index" class="border-t border-slate-200 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6">{{ faq.answer }}</div>
          </article>
        </div>
      </div>
    </section>

    <section class="px-5 pb-24 sm:px-8">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-blue-100 px-7 py-12 text-slate-950 sm:px-12 md:flex-row md:items-center">
        <div><p class="text-sm font-black uppercase tracking-[0.2em]">Ready to build?</p><h2 class="mt-3 text-3xl font-black sm:text-4xl">Discover your next favourite product.</h2></div>
        <router-link to="/products" class="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-50 px-6 py-3.5 font-bold text-slate-900">Shop now <ArrowRightIcon class="h-5 w-5" /></router-link>
      </div>
    </section>
  </div>
</template>
