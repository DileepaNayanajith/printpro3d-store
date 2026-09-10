<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowPathIcon, CheckCircleIcon, CloudArrowUpIcon, CubeTransparentIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import StlViewer from '../components/StlViewer.vue'

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const viewer = ref<InstanceType<typeof StlViewer> | null>(null)
const dimensions = ref<{ x: number; y: number; z: number } | null>(null)
const metrics = ref<{ volume: number; surfaceArea: number; triangles: number } | null>(null)
const dragging = ref(false)
const material = ref('PLA')
const color = ref('#22d3ee')
const infill = ref('20%')
const quantity = ref(1)
const toast = useToast()
const whatsappNumber = '94721272082'
const colors = ['#22d3ee', '#f8fafc', '#0f172a', '#ef4444', '#facc15', '#22c55e', '#a855f7']
const fileSize = computed(() => file.value ? `${(file.value.size / 1024 / 1024).toFixed(2)} MB` : '')
const densities: Record<string, number> = { PLA: 1.24, PETG: 1.27, ABS: 1.04, TPU: 1.21 }
const estimatedWeight = computed(() => {
  if (!metrics.value) return 0
  const solidVolumeCm3 = metrics.value.volume / 1000
  const infillRatio = Number.parseInt(infill.value) / 100
  const effectiveVolume = solidVolumeCm3 * (.25 + infillRatio * .75)
  return effectiveVolume * densities[material.value] * quantity.value
})

const selectFile = (selected?: File) => {
  const nextFile = selected || fileInput.value?.files?.[0]
  if (!nextFile) return
  if (!nextFile.name.toLowerCase().endsWith('.stl')) return toast.error('Please select an STL file')
  if (nextFile.size > 50 * 1024 * 1024) return toast.error('Maximum file size is 50 MB')
  file.value = nextFile
}
const drop = (event: DragEvent) => { dragging.value = false; const selected = event.dataTransfer?.files?.[0]; if (selected) selectFile(selected) }
const formatDimension = (value: number) => value.toFixed(1)
const prepareQuote = () => {
  if (!file.value) return toast.warning('Add an STL file first')

  const modelSize = dimensions.value
    ? `${formatDimension(dimensions.value.x)} × ${formatDimension(dimensions.value.y)} × ${formatDimension(dimensions.value.z)} mm`
    : 'Calculating'
  const analysis = metrics.value
    ? `Volume: ${(metrics.value.volume / 1000).toFixed(2)} cm³\nEstimated material: ${estimatedWeight.value.toFixed(1)} g`
    : 'Model analysis: Calculating'
  const message = [
    'Hello PRINTPRO3D! I would like a quote for a custom 3D print.',
    '',
    `STL file: ${file.value.name}`,
    `File size: ${fileSize.value}`,
    `Model size: ${modelSize}`,
    analysis,
    `Material: ${material.value}`,
    `Infill: ${infill.value}`,
    `Colour: ${color.value.toUpperCase()}`,
    `Quantity: ${quantity.value}`,
    '',
    'Please confirm the final price, print time and delivery options. I will send the STL file in this chat.'
  ].join('\n')

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  toast.success('Opening your quote request in WhatsApp')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="max-w-3xl"><p class="section-kicker">Made for you</p><h1 class="section-title">Custom STL Printing</h1><p class="mt-5 text-lg leading-8 text-slate-400">Upload your STL, inspect it in interactive 3D and choose your preferred print options. Your model stays in your browser for this preview.</p></div>

      <div class="mt-10 grid items-start gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <section class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-4"><div><h2 class="font-black">Live 3D preview</h2><p class="mt-1 text-xs text-slate-500">Drag to rotate · Scroll to zoom · Right-drag to move</p></div><button v-if="file" @click="viewer?.resetView()" class="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"><ArrowPathIcon class="h-4 w-4" /> Reset view</button></div>
          <StlViewer ref="viewer" :file="file" :color="color" class="h-[55vh] min-h-[440px]" @dimensions="dimensions = $event" @metrics="metrics = $event" />
        </section>

        <div class="space-y-6">
          <section class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 class="flex items-center gap-3 text-xl font-black"><CloudArrowUpIcon class="h-6 w-6 text-cyan-400" /> Upload model</h2>
            <input ref="fileInput" type="file" accept=".stl,model/stl" class="hidden" @change="selectFile()" />
            <button @click="fileInput?.click()" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="drop" :class="['mt-5 w-full rounded-2xl border-2 border-dashed p-7 text-center transition', dragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/15 bg-slate-900 hover:border-cyan-400/50']">
              <DocumentTextIcon class="mx-auto h-9 w-9 text-cyan-400" /><p class="mt-3 font-bold">{{ file ? 'Choose another STL' : 'Choose or drop an STL file' }}</p><p class="mt-2 text-xs text-slate-500">Maximum file size: 50 MB</p>
            </button>
            <div v-if="file" class="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4"><div class="flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircleIcon class="h-5 w-5" /> {{ file.name }}</div><p class="mt-1 text-xs text-slate-500">{{ fileSize }}</p><p v-if="dimensions" class="mt-2 text-xs text-slate-400">Size: {{ formatDimension(dimensions.x) }} × {{ formatDimension(dimensions.y) }} × {{ formatDimension(dimensions.z) }} model units</p></div>
          </section>

          <section v-if="metrics" class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 class="text-xl font-black">Model analysis</h2>
            <p class="mt-2 text-xs text-slate-500">Calculated locally from the STL geometry</p>
            <div class="mt-5 grid grid-cols-2 gap-3">
              <div class="rounded-2xl bg-slate-900 p-4"><p class="text-xs font-bold text-slate-500">Volume</p><p class="mt-2 font-black text-cyan-400">{{ (metrics.volume / 1000).toFixed(2) }} cm³</p></div>
              <div class="rounded-2xl bg-slate-900 p-4"><p class="text-xs font-bold text-slate-500">Surface area</p><p class="mt-2 font-black text-cyan-400">{{ (metrics.surfaceArea / 100).toFixed(2) }} cm²</p></div>
              <div class="rounded-2xl bg-slate-900 p-4"><p class="text-xs font-bold text-slate-500">Triangles</p><p class="mt-2 font-black text-white">{{ metrics.triangles.toLocaleString() }}</p></div>
              <div class="rounded-2xl bg-slate-900 p-4"><p class="text-xs font-bold text-slate-500">Est. material</p><p class="mt-2 font-black text-white">~{{ estimatedWeight.toFixed(1) }} g</p></div>
            </div>
            <p class="mt-4 text-xs leading-5 text-slate-500">Material weight is a rough estimate based on model volume, selected material, infill and quantity. Slicer settings, walls and supports affect the final result.</p>
          </section>

          <section class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 class="flex items-center gap-3 text-xl font-black"><CubeTransparentIcon class="h-6 w-6 text-cyan-400" /> Print options</h2>
            <div class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <label class="option-label">Material<select v-model="material" class="option-field"><option>PLA</option><option>PETG</option><option>ABS</option><option>TPU</option></select></label>
              <label class="option-label">Infill<select v-model="infill" class="option-field"><option>10%</option><option>20%</option><option>40%</option><option>60%</option><option>100%</option></select></label>
              <label class="option-label">Quantity<input v-model.number="quantity" type="number" min="1" max="100" class="option-field" /></label>
              <div class="option-label">Colour<div class="mt-1 flex flex-wrap gap-2"><button v-for="option in colors" :key="option" @click="color = option" :style="{ backgroundColor: option }" :class="['h-9 w-9 rounded-full border-2 transition', color === option ? 'scale-110 border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/20']" :aria-label="`Select colour ${option}`"></button></div></div>
            </div>
            <button @click="prepareQuote" class="primary-button mt-7 w-full">Request quote on WhatsApp</button>
            <p class="mt-3 text-center text-xs leading-5 text-slate-500">Your print details will be prepared for WhatsApp. Attach the STL file in the chat, review the message and tap Send.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.option-label{display:flex;flex-direction:column;gap:.55rem;color:#cbd5e1;font-size:.8rem;font-weight:700}.option-field{width:100%;border:1px solid rgba(255,255,255,.1);border-radius:1rem;background:#0f172a;padding:.8rem 1rem;color:white;outline:none}.option-field:focus{border-color:#22d3ee}
</style>
