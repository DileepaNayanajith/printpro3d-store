<script setup lang="ts">
import { consentOpen, chooseConsent, privacySignal } from '../lib/consent'
</script>
<template>
  <transition name="fade">
    <section v-if="consentOpen" role="region" aria-label="Analytics privacy choices" class="consent">
      <h2 class="text-sm font-bold text-ink">Your privacy choices</h2>
      <p class="mt-1.5 text-sm leading-6 text-ink-2">We use essential storage for shopping and sign-in. With your permission, Google Analytics and our visitor statistics help us understand store usage. Optional analytics stay off until you accept. <router-link to="/privacy" class="text-link">Privacy policy</router-link></p>
      <p v-if="privacySignal()" class="mt-2 text-sm text-ink-2">Your browser’s privacy signal keeps optional analytics off.</p>
      <div class="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end"><button type="button" class="btn btn-secondary btn-sm" @click="chooseConsent(false)">Reject optional</button><button type="button" :disabled="privacySignal()" class="btn btn-secondary btn-sm" @click="chooseConsent(true)">Accept analytics</button></div>
    </section>
  </transition>
</template>

<style scoped>
.consent { position: fixed; left: 0.75rem; right: 0.75rem; bottom: max(0.75rem, env(safe-area-inset-bottom)); z-index: 100; max-width: 44rem; max-height: 65dvh; margin-inline: auto; overflow-y: auto; padding: 1rem 1.125rem; border: 1px solid var(--pp-line-strong); border-radius: var(--pp-radius); background: var(--pp-surface); box-shadow: var(--pp-shadow-pop); }
@media (min-width: 640px) { .consent { bottom: 1.25rem; padding: 1.25rem 1.5rem; } }
</style>
