<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, ChevronDownIcon, CubeTransparentIcon, TruckIcon } from '@heroicons/vue/24/outline'

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
  <div>
    <ProductsPage show-highlights />

    <section id="why-us" class="border-t border-line bg-surface">
      <div class="container-store py-[clamp(2.5rem,2rem+3vw,4.5rem)]">
        <div class="max-w-2xl">
          <p class="eyebrow">The PRINTPRO3D difference</p>
          <h2 class="section-heading mt-2">Everything your next build deserves.</h2>
          <p class="lead mt-3">The right products and support, from your first idea to the finished build.</p>
        </div>
        <div class="mt-8 grid gap-px overflow-hidden rounded-[var(--pp-radius)] border border-line bg-line md:grid-cols-3">
          <article v-for="benefit in benefits" :key="benefit.title" class="bg-surface p-5 sm:p-6">
            <component :is="benefit.icon" class="h-6 w-6 text-accent" aria-hidden="true" />
            <h3 class="mt-4 text-base font-bold text-ink">{{ benefit.title }}</h3>
            <p class="mt-1.5 text-sm leading-6 text-ink-2">{{ benefit.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="border-t border-line">
      <div class="container-store grid gap-8 py-[clamp(2.5rem,2rem+3vw,4.5rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p class="eyebrow">Need to know</p>
          <h2 class="section-heading mt-2">Questions, answered.</h2>
          <p class="lead mt-3 max-w-md">Everything you need for a confident order. Still unsure? Our live chat is always one click away.</p>
          <button type="button" class="btn btn-secondary mt-6" @click="openLiveChat"><ChatBubbleLeftRightIcon aria-hidden="true" /> Chat with us</button>
        </div>
        <div class="divide-y divide-line border-y border-line">
          <article v-for="(faq, index) in faqs" :key="faq.question">
            <h3>
              <button type="button" :id="`faq-q-${index}`" @click="activeFaq = activeFaq === index ? null : index" class="flex min-h-14 w-full items-center justify-between gap-5 py-4 text-left text-[0.9375rem] font-bold text-ink" :aria-expanded="activeFaq === index" :aria-controls="`faq-a-${index}`">
                <span>{{ faq.question }}</span><ChevronDownIcon :class="['h-5 w-5 shrink-0 text-ink-3 transition-transform duration-300', activeFaq === index ? 'rotate-180' : '']" aria-hidden="true" />
              </button>
            </h3>
            <transition name="fade"><div v-if="activeFaq === index" :id="`faq-a-${index}`" role="region" :aria-labelledby="`faq-q-${index}`" class="pb-5 pr-10 text-sm leading-7 text-ink-2">{{ faq.answer }}</div></transition>
          </article>
        </div>
      </div>
    </section>

    <section class="container-store pb-[clamp(2.5rem,2rem+3vw,4.5rem)]">
      <div class="flex flex-col items-start justify-between gap-5 rounded-[var(--pp-radius)] bg-accent-soft px-6 py-8 sm:px-10 md:flex-row md:items-center">
        <div><p class="eyebrow !text-[var(--pp-on-accent-soft)]">Ready to build?</p><h2 class="mt-2 text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] font-extrabold tracking-tight text-[var(--pp-on-accent-soft)]">Discover your next favourite product.</h2></div>
        <router-link to="/products" class="btn btn-primary shrink-0">Shop now <ArrowRightIcon aria-hidden="true" /></router-link>
      </div>
    </section>
  </div>
</template>
