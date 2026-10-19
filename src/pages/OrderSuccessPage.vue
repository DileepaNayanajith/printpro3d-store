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
  <div class="container-store page-pad">
    <div class="mx-auto max-w-2xl text-center">
      <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-fill text-white"><CheckIcon class="h-8 w-8 stroke-[2.5]" aria-hidden="true" /></span>
      <p class="eyebrow mt-6">Order received</p>
      <h1 class="display-title mt-2">Thank you for your order!</h1>
      <p class="lead mx-auto mt-4 max-w-xl">Your order has been received. Our team will contact you shortly to confirm the order and delivery details.</p>

      <div class="panel mx-auto mt-8 max-w-md">
        <p class="eyebrow">Order reference</p>
        <p class="mt-2 text-xl font-extrabold tracking-wider text-accent">{{ orderReference }}</p>
      </div>

      <div v-if="payment === 'bank'" class="mt-6 rounded-[var(--pp-radius)] bg-accent-soft p-5 text-left sm:p-6">
        <h2 class="text-lg font-bold text-[var(--pp-on-accent-soft)]">Send your payment slip</h2>
        <p class="mt-2 leading-7 text-ink">Please send your order ID <strong>{{ orderReference }}</strong> and payment slip to WhatsApp <strong>0721272082</strong>. Cash on delivery is Rs. 0. Your order will be dispatched after we verify payment.</p>
        <a :href="paymentLink" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-4">Send payment slip on WhatsApp</a>
        <p class="mt-3 text-sm text-ink-2">Attach the slip photo in WhatsApp, then press Send.</p>
      </div>
      <router-link to="/account" class="text-link mt-6 inline-block">My orders & tracking</router-link>
      <div class="mt-8 grid gap-3 text-left sm:grid-cols-2">
        <div class="panel flex gap-4">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent"><ClockIcon class="h-5 w-5" aria-hidden="true" /></span>
          <div><h2 class="font-bold text-ink">What happens next?</h2><p class="mt-1.5 text-sm leading-6 text-ink-2">We’ll review your order and contact you to confirm availability and delivery.</p></div>
        </div>
        <div class="panel flex gap-4">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent"><ShoppingBagIcon class="h-5 w-5" aria-hidden="true" /></span>
          <div><h2 class="font-bold text-ink">Keep this reference</h2><p class="mt-1.5 text-sm leading-6 text-ink-2">Use your order reference if you need to ask our team about this order.</p></div>
        </div>
      </div>

      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <router-link to="/products" class="btn btn-primary">Continue shopping <ArrowRightIcon aria-hidden="true" /></router-link>
        <router-link to="/" class="btn btn-secondary"><HomeIcon aria-hidden="true" /> Back to home</router-link>
      </div>
    </div>
  </div>
</template>
