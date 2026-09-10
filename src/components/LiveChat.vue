<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/vue/24/outline'

type Message = { id: number; from: 'support' | 'customer'; text: string }
const isOpen = ref(false)
const draft = ref('')
const messages = ref<Message[]>([
  { id: 1, from: 'support', text: 'Hi! Welcome to PRINTPRO3D 👋 How can we help you today?' },
])
const messageList = ref<HTMLElement | null>(null)
const quickQuestions = ['Product availability', 'Delivery details', 'Help choosing a product']

const replies = [
  { words: ['stock', 'available', 'availability'], reply: 'Tell us the product name and we’ll help confirm its availability.' },
  { words: ['delivery', 'shipping'], reply: 'We deliver islandwide. COD delivery is Rs. 400 and bank-deposit orders receive free delivery.' },
  { words: ['choose', 'recommend', 'help'], reply: 'Sure! Tell us your budget and whether you prefer a drone or an RC vehicle.' },
  { words: ['price', 'cost'], reply: 'All current prices are shown on the Products page. Select a product to see more details.' },
]

const scrollToLatest = async () => {
  await nextTick()
  messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' })
}

const sendMessage = (text = draft.value) => {
  const cleanText = text.trim()
  if (!cleanText) return
  messages.value.push({ id: Date.now(), from: 'customer', text: cleanText })
  draft.value = ''
  scrollToLatest()
  window.setTimeout(() => {
    const lower = cleanText.toLowerCase()
    const match = replies.find(item => item.words.some(word => lower.includes(word)))
    messages.value.push({ id: Date.now() + 1, from: 'support', text: match?.reply || 'Thanks for your message! Our team will get back to you shortly.' })
    scrollToLatest()
  }, 450)
}
</script>

<template>
  <div class="fixed bottom-5 right-5 z-[70] sm:bottom-7 sm:right-7">
    <transition enter-active-class="transition duration-200" enter-from-class="translate-y-4 opacity-0 scale-95" leave-active-class="transition duration-150" leave-to-class="translate-y-4 opacity-0 scale-95">
      <section v-if="isOpen" class="mb-4 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
        <header class="flex items-center justify-between bg-cyan-400 px-5 py-4 text-slate-950">
          <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-cyan-400"><ChatBubbleLeftRightIcon class="h-5 w-5" /></span><div><h2 class="font-black">PRINTPRO3D Support</h2><p class="flex items-center gap-1.5 text-xs font-semibold"><span class="h-2 w-2 rounded-full bg-emerald-600"></span> Online</p></div></div>
          <button @click="isOpen = false" class="grid h-9 w-9 place-items-center rounded-full transition hover:bg-slate-950/10" aria-label="Close live chat"><XMarkIcon class="h-5 w-5" /></button>
        </header>

        <div ref="messageList" class="flex-1 space-y-3 overflow-y-auto p-4">
          <div v-for="message in messages" :key="message.id" :class="['flex', message.from === 'customer' ? 'justify-end' : 'justify-start']">
            <p :class="['max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6' , message.from === 'customer' ? 'rounded-br-md bg-cyan-400 font-semibold text-slate-950' : 'rounded-bl-md bg-white/10 text-slate-200']">{{ message.text }}</p>
          </div>
          <div class="flex flex-wrap gap-2 pt-2">
            <button v-for="question in quickQuestions" :key="question" @click="sendMessage(question)" class="rounded-full border border-cyan-400/30 px-3 py-2 text-xs font-bold text-cyan-400 transition hover:bg-cyan-400/10">{{ question }}</button>
          </div>
        </div>

        <form class="flex gap-2 border-t border-white/10 bg-slate-950/60 p-3" @submit.prevent="sendMessage()">
          <input v-model="draft" class="min-w-0 flex-1 rounded-full border border-white/10 bg-slate-800 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="Type your message..." aria-label="Chat message" />
          <button type="submit" class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-cyan-300" aria-label="Send message"><PaperAirplaneIcon class="h-5 w-5" /></button>
        </form>
      </section>
    </transition>

    <button @click="isOpen = !isOpen" class="ml-auto grid h-15 w-15 place-items-center rounded-full bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:-translate-y-1 hover:bg-cyan-300" :aria-label="isOpen ? 'Close live chat' : 'Open live chat'">
      <XMarkIcon v-if="isOpen" class="h-7 w-7" /><ChatBubbleLeftRightIcon v-else class="h-7 w-7" />
    </button>
  </div>
</template>
