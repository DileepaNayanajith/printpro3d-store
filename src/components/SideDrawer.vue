<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

// Native modal dialog: the browser traps focus and makes the page inert; this adds the slide/fade and focus return.
withDefaults(defineProps<{ label: string; side?: 'left' | 'right' }>(), { side: 'right' })
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const visible = ref(false)
let returnFocus: HTMLElement | null = null
let timer: ReturnType<typeof setTimeout> | undefined

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function open() {
  const el = dialog.value
  if (!el || el.open) return
  clearTimeout(timer)
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  el.showModal()
  requestAnimationFrame(() => { visible.value = true })
}
function close() {
  const el = dialog.value
  if (!el?.open) return
  visible.value = false
  clearTimeout(timer)
  timer = setTimeout(() => el.close(), reducedMotion() ? 0 : 280)
}
function closed() {
  visible.value = false
  emit('close')
  returnFocus?.focus({ preventScroll: true })
  returnFocus = null
}
function cancel(event: Event) { event.preventDefault(); close() }
function backdrop(event: MouseEvent) { if (event.target === event.currentTarget) close() }
onBeforeUnmount(() => { clearTimeout(timer); dialog.value?.open && dialog.value.close() })
defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog" :aria-label="label" :class="['drawer', `drawer-${side}`, { 'is-visible': visible }]" @cancel="cancel" @close="closed" @click="backdrop">
    <div class="drawer-panel">
      <slot :close="close" />
    </div>
  </dialog>
</template>
