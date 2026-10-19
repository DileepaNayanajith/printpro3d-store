<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{ hideLauncher?: boolean }>()
type Message = { id: number; from: 'support' | 'customer'; text: string }
const isOpen = ref(false)
const draft = ref('')
const input = ref<HTMLInputElement | null>(null)
let returnFocus: HTMLElement | null = null
const open = async () => {
  if (!isOpen.value) returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  isOpen.value = true
  await nextTick()
  input.value?.focus({ preventScroll: true })
}
const close = () => {
  isOpen.value = false
  returnFocus?.focus({ preventScroll: true })
  returnFocus = null
}
defineExpose({ open })
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
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
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
  <div @keydown.esc="close" class="store-live-chat">
    <transition name="chat">
      <section v-if="isOpen" role="dialog" aria-labelledby="chat-title" class="chat-panel">
        <header class="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div class="flex min-w-0 items-center gap-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"><ChatBubbleLeftRightIcon class="h-5 w-5" aria-hidden="true" /></span>
            <div class="min-w-0"><h2 id="chat-title" class="text-sm font-bold text-ink">PRINTPRO3D Support</h2><p class="flex items-center gap-1.5 text-xs font-semibold text-ink-3"><span class="h-2 w-2 rounded-full bg-success" aria-hidden="true"></span> Online</p></div>
          </div>
          <button type="button" @click="close" class="icon-btn" aria-label="Close live chat"><XMarkIcon /></button>
        </header>

        <div ref="messageList" class="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          <div v-for="message in messages" :key="message.id" :class="['flex', message.from === 'customer' ? 'justify-end' : 'justify-start']">
            <p :class="['max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6', message.from === 'customer' ? 'rounded-br-md bg-accent-fill font-semibold text-white' : 'rounded-bl-md bg-surface-2 text-ink']">{{ message.text }}</p>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <button v-for="question in quickQuestions" :key="question" type="button" @click="sendMessage(question)" class="chip !min-h-9 !px-3 !text-xs">{{ question }}</button>
          </div>
        </div>

        <form class="flex gap-2 border-t border-line p-3" @submit.prevent="sendMessage()">
          <input ref="input" v-model="draft" class="field field-sm min-w-0 flex-1 rounded-full" placeholder="Type your message..." aria-label="Chat message" />
          <button type="submit" class="btn btn-primary !h-11 !w-11 shrink-0 !p-0" aria-label="Send message"><PaperAirplaneIcon aria-hidden="true" /></button>
        </form>
      </section>
    </transition>

    <button v-show="!hideLauncher" type="button" @click="isOpen ? close() : open()" class="live-chat-launcher" :aria-label="isOpen ? 'Close live chat' : 'Open live chat'" :aria-expanded="isOpen">
      <XMarkIcon v-if="isOpen" class="h-6 w-6" aria-hidden="true" /><ChatBubbleLeftRightIcon v-else class="h-6 w-6" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.store-live-chat { position: fixed; right: clamp(1rem, 2vw, 1.75rem); bottom: max(1rem, env(safe-area-inset-bottom)); z-index: 70; display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; pointer-events: none; }
.store-live-chat > * { pointer-events: auto; }
.chat-panel { display: flex; width: min(380px, calc(100vw - 2rem)); height: min(560px, calc(100dvh - 6.5rem)); flex-direction: column; overflow: hidden; border: 1px solid var(--pp-line); border-radius: 18px; background: var(--pp-surface); color: var(--pp-ink); box-shadow: var(--pp-shadow-pop); transform-origin: bottom right; }
.live-chat-launcher { display: grid; place-items: center; width: 3.25rem; height: 3.25rem; border-radius: 999px; background: var(--pp-ink); color: var(--pp-bg); box-shadow: var(--pp-shadow-pop); transition: transform 0.2s var(--pp-ease), background-color 0.2s; }
.live-chat-launcher:hover { transform: translateY(-2px); }
.chat-enter-active, .chat-leave-active { transition: opacity 0.2s var(--pp-ease), transform 0.25s var(--pp-ease); }
.chat-enter-from, .chat-leave-to { opacity: 0; transform: translateY(8px) scale(0.97); }
@media (max-width: 639px) {
  .store-live-chat { left: 0.75rem; right: 0.75rem; bottom: max(0.75rem, env(safe-area-inset-bottom)); }
  .live-chat-launcher { display: none; }
  .chat-panel { width: 100%; height: min(620px, calc(100dvh - 1.5rem)); }
}
</style>
