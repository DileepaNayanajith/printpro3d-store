<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ChevronRightIcon, Squares2X2Icon, XMarkIcon, TruckIcon, CubeTransparentIcon } from '@heroicons/vue/24/outline'
import catalog from '../data/products.json'
import ProductImage from './ProductImage.vue'
defineProps<{ selected: string }>()
const emit=defineEmits<{ select:[category:string] }>()
const departments=[{id:'development-boards',label:'Development boards'},{id:'sensors',label:'Sensors & modules'},{id:'displays',label:'OLED displays'},{id:'robotics',label:'Robotics & kits'},{id:'filament',label:'3D printing filament'},{id:'3d-printed-models',label:'3D printed models'},{id:'display-racks',label:'Display racks'},{id:'rc-cars',label:'RC cars & trucks'},{id:'drones',label:'Camera drones'}]
const count=(id:string)=>catalog.filter(p=>p.category===id).length
const drawer=ref<HTMLDialogElement|null>(null)
const select=(id:string)=>{emit('select',id);drawer.value?.close()}
const slides=[
 {id:1001,kicker:'Build your next idea',title:'Small boards. Big possibilities.',text:'ESP32 boards, sensors and displays for your next project.',category:'development-boards',button:'Shop development boards'},
 {id:1009,kicker:'Made for makers',title:'Give your ideas a new dimension.',text:'eSUN PLA+ in White, Black and Gray. Rs. 4,900 per 1 kg spool.',category:'filament',button:'Shop filament'},
 {id:1014,kicker:'Create something that moves',title:'Your next robot starts here.',text:'Explore chassis kits, motor drivers and sensors.',category:'robotics',button:'Explore robotics'},
]
const active=ref(0),paused=ref(false),hovered=ref(false),focused=ref(false)
let timer:ReturnType<typeof setInterval>|undefined
onMounted(()=>{timer=setInterval(()=>{if(!paused.value && !hovered.value && !focused.value && !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)active.value=(active.value+1)%slides.length},6500)})
onUnmounted(()=>clearInterval(timer))
</script>

<template>
  <div class="department-layout mt-4">
    <aside class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block" aria-label="Shop by department">
      <div class="flex items-center justify-between bg-blue-600 px-4 py-3 text-white"><h2 class="text-sm font-bold">Shop by category</h2><Squares2X2Icon class="h-4 w-4" /></div>
      <button @click="select('all')" :aria-pressed="selected==='all'" class="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-blue-600">All products <span>{{ catalog.length }}</span></button>
      <button v-for="category in departments" :key="category.id" @click="select(category.id)" :aria-pressed="selected===category.id" :class="['flex w-full items-center gap-2 border-t border-slate-200 px-4 py-2.5 text-left text-xs transition hover:bg-slate-100',selected===category.id?'bg-blue-50 font-bold text-blue-600':'text-slate-600']"><span class="flex-1">{{ category.label }}</span><span class="text-[10px] text-slate-500">{{ count(category.id) }}</span><ChevronRightIcon class="h-3 w-3" /></button>
    </aside>
    <div class="min-w-0">
      <button @click="drawer?.showModal()" class="mb-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 lg:hidden" aria-haspopup="dialog"><span class="flex items-center gap-2"><Squares2X2Icon class="h-5 w-5 text-blue-600" /> Shop by category</span><ChevronRightIcon class="h-4 w-4" /></button>
      <section class="promo-banner relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-7" aria-label="Featured collections" @mouseenter="hovered=true" @mouseleave="hovered=false" @focusin="focused=true" @focusout="event=>{if(!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node|null))focused=false}">
        <template v-for="(slide,index) in slides" :key="slide.id"><div v-if="active===index" class="flex min-h-44 items-center gap-3 sm:gap-6">
          <div class="relative z-10 flex-1"><p class="text-[10px] font-black uppercase tracking-widest text-blue-600">{{ slide.kicker }}</p><h2 class="mt-2 max-w-sm text-xl font-black leading-tight text-slate-900 sm:text-3xl">{{ slide.title }}</h2><p class="mt-2 max-w-sm text-xs leading-5 text-slate-600">{{ slide.text }}</p><button @click="select(slide.category)" class="mt-4 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">{{ slide.button }}</button></div>
          <router-link :to="`/products/${slide.id}`" class="promo-image flex h-32 w-28 shrink-0 items-center rounded-2xl bg-white p-3 sm:h-44 sm:w-40"><ProductImage :src="catalog.find(p=>p.id===slide.id)!.thumbnail" :alt="catalog.find(p=>p.id===slide.id)!.title" class="h-full w-full object-contain" /></router-link>
        </div>
        </template><div class="mt-4 flex items-center gap-2"><button v-for="(slide,index) in slides" :key="slide.id" @click="active=index" :aria-label="`Show collection ${index+1}: ${slide.kicker}`" :aria-pressed="active===index" :class="['h-2 rounded-full transition-all',active===index?'w-6 bg-blue-600':'w-2 bg-slate-300']"></button><button @click="paused=!paused" :aria-pressed="paused" class="ml-auto text-[10px] font-bold text-blue-600">{{ paused?'Play banners':'Pause banners' }}</button></div>
      </section>
    </div>
    <div class="grid grid-cols-2 gap-3 xl:grid-cols-1">
      <router-link to="/checkout" class="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-4"><TruckIcon class="h-6 w-6 text-blue-600" /><p class="mt-2 text-sm font-black text-slate-900">Islandwide delivery</p><p class="mt-1 text-xs leading-5 text-slate-600">COD: Rs. 400<br />Bank deposit: free delivery</p></router-link>
      <router-link to="/custom-print" class="flex flex-col justify-center rounded-2xl border border-orange-200 bg-orange-50 p-4"><CubeTransparentIcon class="h-6 w-6 text-orange-600" /><p class="mt-2 text-sm font-black text-slate-900">Your idea, printed.</p><p class="mt-1 text-xs leading-5 text-slate-600">Upload your STL for a custom 3D print quote →</p></router-link>
    </div>
    <dialog ref="drawer" class="department-drawer rounded-r-2xl border border-slate-200 bg-white p-0 text-slate-900" aria-label="Shop by category" @click="event=>{if(event.target===event.currentTarget)drawer?.close()}">
      <div class="flex items-center justify-between border-b border-slate-200 p-5"><h2 class="font-black">Shop by category</h2><button autofocus @click="drawer?.close()" aria-label="Close categories" class="rounded-full p-2"><XMarkIcon class="h-5 w-5" /></button></div>
      <button @click="select('all')" class="flex w-full justify-between px-5 py-4 text-left font-bold text-blue-600">All products <span>{{ catalog.length }}</span></button>
      <button v-for="category in departments" :key="category.id" @click="select(category.id)" :aria-pressed="selected===category.id" class="flex w-full items-center justify-between border-t border-slate-200 px-5 py-4 text-left text-sm"><span>{{ category.label }}</span><span class="text-slate-500">{{ count(category.id) }}</span></button>
    </dialog>
  </div>
</template>

<style scoped>
.department-layout{display:grid;gap:12px}
.department-drawer{position:fixed;inset:0 auto 0 0;margin:0;max-height:100dvh;height:100dvh;width:min(320px,90vw);max-width:90vw;overflow-y:auto}
.department-drawer::backdrop{background:#02061788;backdrop-filter:blur(3px)}
@media(min-width:1024px){.department-layout{grid-template-columns:220px minmax(0,1fr)}.department-layout>div:last-of-type{grid-column:2}}
@media(min-width:1280px){.department-layout{grid-template-columns:220px minmax(0,1fr) 200px}.department-layout>div:last-of-type{grid-column:auto}}
@media(max-width:639px){
.promo-banner{padding:16px}.promo-banner>div:first-child{min-height:118px}.promo-banner h2{font-size:18px}.promo-banner .promo-image{width:84px;height:110px}.promo-banner>div:first-child p:last-of-type{display:none}
.department-layout>div:last-of-type>a{padding:12px}.department-layout>div:last-of-type>a>svg{width:18px;height:18px}.department-layout>div:last-of-type>a>p:first-of-type{font-size:12px;margin-top:6px}.department-layout>div:last-of-type>a>p:last-of-type{font-size:10px;line-height:15px}
}
@media(max-width:359px){.promo-image{width:80px;height:110px}.promo-banner{padding:16px}.promo-banner h2{font-size:18px}}
:global(.dark-theme) .bg-orange-50{background:#431407}
:global(.dark-theme) .border-orange-200{border-color:#7c2d12}
</style>
