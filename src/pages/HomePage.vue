<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightIcon, CheckBadgeIcon, ChevronDownIcon, CubeTransparentIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import products from '../data/products.json'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
const toast = useToast()
const featuredProducts = products.slice(2, 6)
const categories = [
  { title: 'Camera Drones', text: 'Portable aerial technology for beginners and enthusiasts.', image: '/products/e99-max.png', filter: 'drones' },
  { title: 'RC Off-road', text: 'Detailed 4WD crawlers and trucks built for adventure.', image: '/products/d99s-defender.jpg', filter: 'rc-cars' },
]
const activeFaq = ref<number | null>(0)
const faqs = [
  { question: 'Do you deliver across Sri Lanka?', answer: 'Yes. Islandwide delivery is available. Cash-on-delivery orders include a Rs. 400 delivery fee.' },
  { question: 'How do I get free delivery?', answer: 'Choose bank deposit at checkout to receive free delivery on your order.' },
  { question: 'How is product availability confirmed?', answer: 'Stock indicators are shown on each product. Our team will confirm final availability after you place the order.' },
  { question: 'Can I get help choosing a drone or RC vehicle?', answer: 'Yes. Open the PRINTPRO3D live chat and tell us your budget and what you plan to use the product for.' },
]

const addToCart = (product: typeof products[number]) => {
  cart.addToCart(product)
  toast.success(`${product.title} added to cart`)
}

const openLiveChat = () => document.querySelector<HTMLButtonElement>('[aria-label="Open live chat"]')?.click()

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

    <section class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between" data-aos="fade-up">
        <div class="max-w-2xl">
          <p class="section-kicker">Shop by category</p>
          <h2 class="section-title">Find your next adventure.</h2>
        </div>
        <router-link to="/products" class="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300">View all products <ArrowRightIcon class="h-4 w-4" /></router-link>
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <router-link v-for="category in categories" :key="category.title" :to="{ path: '/products', query: { category: category.filter } }" class="group relative isolate min-h-80 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-8">
          <img :src="category.image" :alt="category.title" class="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div class="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <div class="flex h-full max-w-xs flex-col justify-end"><p class="text-sm font-black uppercase tracking-[0.18em] text-cyan-400">Explore collection</p><h3 class="mt-3 text-3xl font-black">{{ category.title }}</h3><p class="mt-3 leading-7 text-slate-300">{{ category.text }}</p><span class="mt-6 inline-flex items-center gap-2 font-bold">Shop now <ArrowRightIcon class="h-5 w-5 transition group-hover:translate-x-1" /></span></div>
        </router-link>
      </div>
    </section>

    <section class="border-y border-white/10 bg-white/[0.025] py-24">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <div class="max-w-2xl" data-aos="fade-up"><p class="section-kicker">Customer favourites</p><h2 class="section-title">Featured products.</h2><p class="mt-5 text-lg text-slate-400">Popular picks selected from our latest collection.</p></div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="(product, index) in featuredProducts" :key="product.id" class="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/30" data-aos="fade-up" :data-aos-delay="index * 70">
            <router-link :to="`/products/${product.id}`" class="relative block aspect-square overflow-hidden bg-white p-3"><img :src="product.thumbnail" :alt="product.title" class="h-full w-full rounded-2xl object-contain transition duration-500 group-hover:scale-105" /><span class="absolute left-4 top-4 rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-black text-slate-950">{{ product.badge }}</span></router-link>
            <div class="p-5"><h3 class="min-h-12 font-bold">{{ product.title }}</h3><p class="mt-2 text-xl font-black text-cyan-400">Rs. {{ product.price.toLocaleString() }}</p><div class="mt-5 grid grid-cols-[1fr_auto] gap-2"><router-link :to="`/products/${product.id}`" class="rounded-full border border-white/15 px-3 py-3 text-center text-sm font-black hover:border-cyan-400 hover:text-cyan-400">Details</router-link><button @click="addToCart(product)" class="grid h-12 w-12 place-items-center rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300" :aria-label="`Add ${product.title} to cart`"><ShoppingBagIcon class="h-5 w-5" /></button></div></div>
          </article>
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

    <section class="border-y border-white/10 bg-white/[0.025] py-24">
      <div class="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-aos="fade-right">
          <p class="section-kicker">Need to know</p>
          <h2 class="section-title">Questions, answered.</h2>
          <p class="mt-5 max-w-md text-lg leading-8 text-slate-400">Everything you need for a confident order. Still unsure? Our live chat is always one click away.</p>
          <button class="secondary-button mt-8" @click="openLiveChat">Chat with us</button>
        </div>
        <div class="space-y-3" data-aos="fade-left">
          <article v-for="(faq, index) in faqs" :key="faq.question" class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            <button @click="activeFaq = activeFaq === index ? null : index" class="flex w-full items-center justify-between gap-5 p-5 text-left font-bold sm:p-6" :aria-expanded="activeFaq === index">
              <span>{{ faq.question }}</span><ChevronDownIcon :class="['h-5 w-5 shrink-0 text-cyan-400 transition-transform', activeFaq === index ? 'rotate-180' : '']" />
            </button>
            <div v-if="activeFaq === index" class="border-t border-white/10 px-5 py-5 text-sm leading-7 text-slate-400 sm:px-6">{{ faq.answer }}</div>
          </article>
        </div>
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
