<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowRightIcon, CheckIcon, ClockIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
let orderReference = ''
let payment = ''
try { const receipt=JSON.parse(sessionStorage.getItem('oms-order-receipt') || 'null'); orderReference=receipt?.reference || ''; payment=receipt?.payment || '' } catch {}
const paymentLink='https://wa.me/94721272082?text='+encodeURIComponent(`Hello PRINTPRO3D, my order ID is ${orderReference}. I selected bank deposit. I am sending my payment slip for verification.`)
if (!orderReference) router.replace('/cart')
</script>

<template>
  <div class="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-50 px-5 py-16 text-slate-900 sm:px-8">
    <div class="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/10 blur-3xl"></div>
    <div class="mx-auto max-w-3xl text-center" data-aos="zoom-in">
      <div class="mx-auto grid h-24 w-24 place-items-center rounded-full border border-cyan-400/30 bg-blue-100/10 shadow-2xl shadow-cyan-400/10">
        <div class="grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-slate-950"><CheckIcon class="h-9 w-9 stroke-[3]" /></div>
      </div>
      <p class="section-kicker mt-9">Order received</p>
      <h1 class="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Thank you for your order!</h1>
      <p class="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">Your order has been received. Our team will contact you shortly to confirm the order and delivery details.</p>

      <div class="mx-auto mt-9 max-w-md rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Order reference</p>
        <p class="mt-2 text-xl font-black tracking-wider text-blue-600">{{ orderReference }}</p>
      </div>

      <div v-if="payment === 'bank'" class="mt-8 rounded-2xl border border-cyan-400/30 bg-blue-100/10 p-6 text-left">
        <h2 class="text-xl font-bold">Send your payment slip</h2>
        <p class="mt-3 leading-7">Please send your order ID <strong>{{ orderReference }}</strong> and payment slip to WhatsApp <strong>0721272082</strong>. Cash on delivery is Rs. 0. Your order will be dispatched after we verify payment.</p>
        <a :href="paymentLink" target="_blank" rel="noopener noreferrer" class="primary-button mt-5">Send payment slip on WhatsApp</a>
        <p class="mt-3 text-sm text-slate-600">Attach the slip photo in WhatsApp, then press Send.</p>
      </div>
      <router-link to="/account" class="mt-6 inline-block text-blue-600 underline">My orders & tracking</router-link>
      <div class="mt-10 grid gap-4 text-left sm:grid-cols-2">
        <div class="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100/10 text-blue-600"><ClockIcon class="h-6 w-6" /></span>
          <div><h2 class="font-bold">What happens next?</h2><p class="mt-2 text-sm leading-6 text-slate-600">We’ll review your order and contact you to confirm availability and delivery.</p></div>
        </div>
        <div class="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100/10 text-blue-600"><ShoppingBagIcon class="h-6 w-6" /></span>
          <div><h2 class="font-bold">Keep this reference</h2><p class="mt-2 text-sm leading-6 text-slate-600">Use your order reference if you need to ask our team about this order.</p></div>
        </div>
      </div>

      <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <router-link to="/products" class="primary-button">Continue shopping <ArrowRightIcon class="h-5 w-5" /></router-link>
        <router-link to="/" class="secondary-button"><HomeIcon class="h-5 w-5" /> Back to home</router-link>
      </div>
    </div>
  </div>
</template>
