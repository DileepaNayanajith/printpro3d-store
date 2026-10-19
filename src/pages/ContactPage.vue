<script setup lang="ts">
import { reactive } from 'vue'
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
const toast = useToast()
const form = reactive({ name: '', email: '', subject: '', message: '' })
const openLiveChat = () => document.querySelector<HTMLButtonElement>('[aria-label="Open live chat"]')?.click()
const submit = () => { toast.info('Demo inquiry prepared — connect a backend to send it.'); form.name = ''; form.email = ''; form.subject = ''; form.message = '' }
</script>

<template>
  <div class="px-[var(--pp-gutter)] py-[clamp(1.5rem,1rem+2.5vw,3.5rem)]"><div class="mx-auto max-w-7xl"><div class="max-w-3xl"><p class="section-kicker">We’re here to help</p><h1 class="section-title">Contact & Support</h1><p class="mt-5 text-lg leading-8 text-slate-600">Questions about products, delivery or an order? Start with live chat or prepare an inquiry below.</p></div>
    <div class="mt-10 grid items-start gap-8 lg:grid-cols-[0.7fr_1.3fr]">
      <div class="space-y-4"><button @click="openLiveChat" class="glass-card flex w-full items-start gap-4 text-left"><ChatBubbleLeftRightIcon class="h-7 w-7 shrink-0 text-blue-600" /><div><h2 class="font-black">Live chat</h2><p class="mt-2 text-sm leading-6 text-slate-600">Get quick answers about products, stock and delivery.</p><span class="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-700"><span class="h-2 w-2 rounded-full bg-emerald-500"></span> Online now</span></div></button><div class="glass-card flex items-start gap-4"><ClockIcon class="h-7 w-7 shrink-0 text-blue-600" /><div><h2 class="font-black">Response time</h2><p class="mt-2 text-sm leading-6 text-slate-600">Order requests are reviewed and confirmed by the PRINTPRO3D team.</p></div></div><div class="glass-card flex items-start gap-4"><CheckCircleIcon class="h-7 w-7 shrink-0 text-blue-600" /><div><h2 class="font-black">Warranty support</h2><p class="mt-2 text-sm leading-6 text-slate-600">Keep your receipt, order reference and product packaging.</p><router-link to="/warranty" class="mt-3 inline-block text-sm font-bold text-blue-600">View warranty policy →</router-link></div></div></div>
      <form class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" @submit.prevent="submit"><h2 class="text-2xl font-black">Send an inquiry</h2><p class="mt-2 text-sm text-slate-500">Frontend demonstration form</p><div class="mt-7 grid gap-5 sm:grid-cols-2"><label class="field-label">Your name *<input v-model="form.name" required class="contact-field" placeholder="Full name" /></label><label class="field-label">Email *<input v-model="form.email" required type="email" class="contact-field" placeholder="you@example.com" /></label><label class="field-label sm:col-span-2">Subject *<input v-model="form.subject" required class="contact-field" placeholder="How can we help?" /></label><label class="field-label sm:col-span-2">Message *<textarea v-model="form.message" required rows="6" class="contact-field" placeholder="Tell us more..."></textarea></label></div><button class="primary-button mt-6 w-full" type="submit"><PaperAirplaneIcon class="h-5 w-5" /> Prepare inquiry</button></form>
    </div></div></div>
</template>

