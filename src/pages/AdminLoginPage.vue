<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const login = () => {
  error.value = ''
  loading.value = true
  window.setTimeout(() => {
    if (username.value.trim().toLowerCase() === 'admin@printpro3d.lk' && password.value === 'P3Dadmin2026') {
      localStorage.setItem('printpro3d_admin_session', 'authenticated')
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
      router.replace(redirect)
    } else {
      error.value = 'Incorrect email or password. Please try again.'
      loading.value = false
    }
  }, 450)
}
</script>

<template>
  <div class="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-12 text-white">
    <div class="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[110px]"></div>
    <div class="relative w-full max-w-md">
      <router-link to="/" class="mx-auto flex w-fit items-center gap-3" aria-label="Back to store"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">P3</span><span class="text-2xl font-black">PRINTPRO<span class="text-cyan-400">3D</span></span></router-link>
      <section class="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-9">
        <div class="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-400"><LockClosedIcon class="h-6 w-6"/></div>
        <h1 class="mt-6 text-3xl font-black">Staff sign in</h1>
        <p class="mt-2 text-sm leading-6 text-slate-400">Authorised PRINTPRO3D staff members only.</p>
        <form class="mt-7 space-y-5" @submit.prevent="login">
          <label class="block"><span class="text-xs font-bold text-slate-300">Admin email</span><input v-model="username" type="email" autocomplete="username" required class="login-field" placeholder="admin@printpro3d.lk"/></label>
          <label class="block"><span class="text-xs font-bold text-slate-300">Password</span><span class="relative mt-2 block"><input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required class="login-field !mt-0 pr-12" placeholder="Enter your password"/><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"><EyeSlashIcon v-if="showPassword" class="h-5 w-5"/><EyeIcon v-else class="h-5 w-5"/></button></span></label>
          <p v-if="error" class="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-xs font-semibold text-rose-300">{{ error }}</p>
          <button type="submit" class="primary-button w-full" :disabled="loading">{{ loading ? 'Signing in…' : 'Sign in to dashboard' }}</button>
        </form>
      </section>
      <p class="mt-5 text-center text-xs text-slate-600">Customer? <router-link to="/" class="font-bold text-slate-400 hover:text-cyan-400">Return to store</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.login-field{margin-top:.5rem;width:100%;border:1px solid rgba(255,255,255,.1);border-radius:1rem;background:#0f172a;padding:.9rem 1rem;color:white;outline:none;transition:.2s}.login-field:focus{border-color:#22d3ee;box-shadow:0 0 0 3px rgba(34,211,238,.08)}
</style>
