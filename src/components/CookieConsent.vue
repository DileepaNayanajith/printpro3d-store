<script setup lang="ts">
import { consentOpen, chooseConsent, privacySignal } from '../lib/consent'
</script>
<template>
  <section v-if="consentOpen" role="region" aria-label="Analytics privacy choices" class="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-slate-300 bg-white p-5 text-slate-900 shadow-xl sm:bottom-5 sm:p-6">
    <h2 class="font-bold">Your privacy choices</h2>
    <p class="mt-2 text-sm leading-6">We use essential storage for shopping and sign-in. With your permission, Google Analytics and our visitor statistics help us understand store usage. Separately, optional Meta advertising measurement helps us measure ads and find interested shoppers. Both stay off until you choose. <router-link to="/privacy" class="underline">Privacy policy</router-link></p>
    <p v-if="privacySignal()" class="mt-2 text-sm">Your browser’s privacy signal keeps optional analytics off.</p>
    <div class="mt-4 flex flex-wrap gap-3"><button class="rounded-lg border border-slate-400 px-4 py-2 text-sm font-bold" @click="chooseConsent(false)">Reject optional</button><button :disabled="privacySignal()" class="rounded-lg border border-slate-400 px-4 py-2 text-sm font-bold disabled:opacity-40" @click="chooseConsent(true)">Accept analytics</button><button :disabled="privacySignal()" class="rounded-lg border border-slate-400 px-4 py-2 text-sm font-bold disabled:opacity-40" @click="chooseConsent(true,true)">Accept analytics &amp; advertising</button></div>
  </section>
</template>
