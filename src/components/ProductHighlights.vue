<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { BoltIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@heroicons/vue/24/outline'
import catalog from '../data/products.json'
import ProductImage from './ProductImage.vue'
import { useBuyNow } from '../composables/useBuyNow'
const { buyNow } = useBuyNow()
const tabs = [{id:'flash',label:'Flash deals'},{id:'offers',label:'Offers'},{id:'picks',label:'Popular picks'}]
const active = ref('picks')
const track = ref<HTMLElement | null>(null)
const paused = ref(false)
const hovered = ref(false)
const focused = ref(false)
const reducedMotion = ref(false)
const selection: Record<string, number[]> = {
  flash:[1001,1008,1018,1007,1014,1019],
  offers:[8,1009,1010,1011,1006,1012],
  picks:[1001,1003,1008,1009,1014,1007,1018,8],
}
const products = computed(() => selection[active.value]!.map(id=>catalog.find(p=>p.id===id)).filter((p):p is (typeof catalog)[number]=>!!p && p.stock!==0))
const caption = computed(()=>active.value==='flash' ? 'Selected products • Flash prices coming soon' : active.value==='offers' ? 'Rack bundle savings + selected products' : 'Handpicked for your next project')
let timer: ReturnType<typeof setInterval> | undefined
let motionQuery: MediaQueryList | undefined
let resumeAt = 0
const motionChanged = () => { reducedMotion.value=motionQuery?.matches || false }
const slide = (direction=1, automatic=false) => {
  const el=track.value
  if(!el || el.scrollWidth<=el.clientWidth+2)return
  if(!automatic)resumeAt=Date.now()+8000
  const step=(el.firstElementChild as HTMLElement)?.offsetWidth || 230
  const end=el.scrollWidth-el.clientWidth
  // Advance the viewport toward the right, then return to the first card.
  const target=direction>0 ? (el.scrollLeft>=end-3 ? 0 : Math.min(end,el.scrollLeft+step+12)) : Math.max(0,el.scrollLeft-step-12)
  el.scrollTo({left:target,behavior:reducedMotion.value?'auto':'smooth'})
}
const chooseTab = (id:string) => { active.value=id; track.value?.scrollTo({left:0,behavior:'auto'});resumeAt=Date.now()+4000 }
const handleFocusOut = (event:FocusEvent) => { if(!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node|null))focused.value=false }
onMounted(()=>{
  motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');motionChanged();motionQuery.addEventListener('change',motionChanged)
  timer=setInterval(()=>{if(!paused.value && !hovered.value && !focused.value && !reducedMotion.value && !document.hidden && Date.now()>resumeAt)slide(1,true)},3500)
})
onUnmounted(()=>{clearInterval(timer);motionQuery?.removeEventListener('change',motionChanged)})
</script>

<template>
  <section class="highlights mt-5 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5" aria-label="Product highlights" aria-roledescription="carousel" @mouseenter="hovered=true" @mouseleave="hovered=false" @focusin="focused=true" @focusout="handleFocusOut">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div><p class="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600"><BoltIcon class="h-4 w-4" /> Discover something new</p><p class="mt-1 text-xs text-slate-500">{{ caption }}</p></div>
      <div class="flex gap-1.5">
        <button @click="slide(-1)" aria-label="Previous highlighted products" class="slider-control"><ChevronLeftIcon class="h-4 w-4" /></button>
        <button @click="paused=!paused" :aria-label="paused?'Play product slider':'Pause product slider'" :aria-pressed="paused" class="slider-control"><PlayIcon v-if="paused" class="h-4 w-4" /><PauseIcon v-else class="h-4 w-4" /></button>
        <button @click="slide(1)" aria-label="Next highlighted products" class="slider-control"><ChevronRightIcon class="h-4 w-4" /></button>
      </div>
    </div>
    <div class="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Highlight collections">
      <button v-for="tab in tabs" :key="tab.id" @click="chooseTab(tab.id)" :aria-pressed="active===tab.id" :class="['shrink-0 rounded-full px-4 py-2 text-xs font-bold transition',active===tab.id?'bg-orange-500 text-white':'bg-slate-100 text-slate-600']">{{ tab.label }}</button>
    </div>
    <div ref="track" class="highlight-track mt-3 flex gap-3 overflow-x-auto pb-2" @pointerdown="resumeAt=Date.now()+10000" @wheel.passive="resumeAt=Date.now()+10000">
      <article v-for="product in products" :key="`${active}:${product.id}`" class="highlight-card flex shrink-0 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <router-link :to="`/products/${product.id}`" class="flex h-24 w-24 shrink-0 items-center rounded-lg bg-white p-2"><ProductImage :src="product.thumbnail" :alt="product.title" class="h-full w-full object-contain" /></router-link>
        <div class="flex min-w-0 flex-1 flex-col items-start">
          <router-link :to="`/products/${product.id}`" class="highlight-title text-xs font-bold leading-5 text-slate-900">{{ product.title }}</router-link>
          <p class="mt-1 text-base font-black text-blue-700">Rs. {{ product.price.toLocaleString() }}</p>
          <p v-if="product.bulkPrice" class="mt-1 text-[10px] font-bold text-emerald-700">{{ product.bulkMin }}+ racks: Rs. {{ product.bulkPrice.toLocaleString() }} each</p>
          <button @click="buyNow(product)" class="buy-now-button mt-auto rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-orange-600">Buy it now</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.highlight-track { scrollbar-width: thin; scrollbar-color:#cbd5e1 transparent; overscroll-behavior-x:contain; }
.highlight-card { width: min(310px, 88vw); }
.highlight-title { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.slider-control { display:grid;place-items:center;width:32px;height:32px;border:1px solid #cbd5e1;border-radius:50%;color:#475569; }
:global(.dark-theme) .slider-control { border-color:#475569;color:#cbd5e1; }
@media(max-width:359px) { .highlight-card {width:255px} .highlight-card > a {width:76px;height:90px} }
</style>
