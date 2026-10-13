<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
const customer=ref<{name:string}|null>(null)
const orders=ref<any[]>([])
const mode=ref('login'), error=ref(''), busy=ref(false), loading=ref(true), googleReady=ref(false)
const form=reactive({name:'',username:'',password:''})
const reasons=reactive<Record<string,string>>({})
const googleButton=ref<HTMLElement|null>(null)
async function api(path:string,body?:unknown){
 const response=await fetch('/api/account/'+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Please try again.');return data
}
async function load(){try{const data=await api('orders');customer.value=data.customer;orders.value=data.orders}catch{customer.value=null}finally{loading.value=false}}
async function login(credential?:string){busy.value=true;error.value='';try{await api(credential?'google':mode.value,credential?{credential}:form);form.password='';await load()}catch(e){error.value=(e as Error).message}finally{busy.value=false}}
async function logout(){try{await api('logout',{});customer.value=null;orders.value=[];window.location.reload()}catch(e){error.value=(e as Error).message}}
async function requestReturn(reference:string){busy.value=true;error.value='';try{await api('returns',{reference,reason:reasons[reference]});await load()}catch(e){error.value=(e as Error).message}finally{busy.value=false}}
const status=(value:string)=>value?.replaceAll('_',' ')||'Not available yet'
const updated=(value:number)=>new Date(value*1000).toLocaleString()
const slip=(reference:string)=>'https://wa.me/94721272082?text='+encodeURIComponent(`Hello PRINTPRO3D, my order ID is ${reference}. Please find my bank payment slip attached.`)
onMounted(async()=>{
 await load()
 try{
  const config=await api('config');if(!config.google_client_id)return
  const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true
  script.onload=()=>{const google=(window as any).google;google.accounts.id.initialize({client_id:config.google_client_id,callback:(result:any)=>login(result.credential)});if(googleButton.value)google.accounts.id.renderButton(googleButton.value,{theme:'outline',size:'large'});googleReady.value=true}
  script.onerror=()=>{googleReady.value=false};document.head.appendChild(script)
 }catch{}
})
</script>
<template>
 <div class="mx-auto min-h-[70vh] max-w-5xl px-5 py-12 text-slate-900">
  <p class="section-kicker">PRINTPRO3D customer account</p><h1 class="section-title mt-3">My orders</h1>
  <p v-if="loading" class="mt-8">Loading your account…</p>
  <p v-if="error" role="alert" class="my-5 rounded-xl bg-red-500/10 p-4 text-red-600">{{ error }}</p>
  <section v-show="!customer && !loading" class="mt-8 max-w-lg rounded-3xl border border-slate-200 p-7">
   <h2 class="text-2xl font-bold">{{ mode==='register'?'Create an account':'Welcome back' }}</h2>
   <p class="mt-3 text-sm text-slate-600">Email is not required. Sign in before checkout to save orders to your account.</p>
   <form class="mt-6 space-y-4" @submit.prevent="login()">
    <label v-if="mode==='register'" class="block">Your name<input v-model="form.name" required maxlength="150" autocomplete="name" class="account-field" /></label>
    <label class="block">Username<input v-model="form.username" required pattern="[A-Za-z0-9_.-]{3,40}" autocomplete="username" class="account-field" /></label>
    <label class="block">Password<input v-model="form.password" type="password" required minlength="10" maxlength="128" :autocomplete="mode==='register'?'new-password':'current-password'" class="account-field" /></label>
    <p class="text-xs text-slate-600">Use at least 10 characters. Keep your password safe; password reset is not available yet.</p>
    <button :disabled="busy" class="primary-button w-full">{{ busy?'Please wait…':mode==='register'?'Create account':'Sign in' }}</button>
   </form>
   <button class="my-5 text-blue-600 underline" @click="mode=mode==='login'?'register':'login';error=''">{{ mode==='login'?'Create a new account':'Already have an account? Sign in' }}</button>
   <div ref="googleButton"></div><p v-if="!googleReady" class="mt-3 text-sm text-slate-500">Google sign-in will be available once store setup is complete.</p>
  </section>
  <section v-if="customer" class="mt-8">
   <div class="flex items-center justify-between gap-4"><p>Hello, <strong>{{ customer.name }}</strong></p><button @click="logout" class="text-sm text-blue-600">Sign out</button></div>
   <p class="mt-4 text-sm text-slate-600">Only orders placed while signed in appear here. Guest or previous phone orders are not linked automatically.</p>
   <button @click="load" class="mt-4 text-sm text-blue-600 underline">Refresh order status</button>
   <p v-if="!orders.length" class="mt-8 rounded-2xl bg-white/5 p-6">No orders yet. <router-link to="/products" class="text-blue-600">Browse products →</router-link></p>
   <article v-for="order in orders" :key="order.reference" class="mt-6 rounded-3xl border border-slate-200 p-6">
    <div class="flex flex-wrap justify-between gap-4"><h2 class="text-xl font-bold">{{ order.reference }} <span v-if="order.order_reference" class="text-sm text-slate-600">· {{ order.order_reference }}</span></h2><span class="capitalize text-blue-600">{{ status(order.status) }}</span></div>
    <p class="mt-3">{{ order.product }}</p><p class="mt-2 text-slate-600">Total: Rs. {{ (order.total_cents/100).toLocaleString() }}</p>
    <div v-if="order.payment==='bank'" class="mt-4 rounded-xl bg-blue-100/10 p-4"><p>COD: Rs. 0 · {{ order.payment_verified?'Payment verified':'Awaiting payment verification' }}</p><p v-if="!order.payment_verified" class="mt-2 text-sm">Send {{ order.reference }} and your payment slip to 0721272082.</p><a v-if="!order.payment_verified" :href="slip(order.reference)" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-blue-600 underline">Open WhatsApp</a></div>
    <div class="mt-5 border-t border-slate-200 pt-5"><h3 class="font-bold">Parcel tracking</h3><p class="mt-2">{{ order.tracking || 'Tracking number will appear after courier booking.' }}</p><p v-if="order.courier_status" class="mt-2 capitalize">FDE: {{ status(order.courier_status) }}</p><p v-if="order.observed_at" class="mt-1 text-xs text-slate-600">Last courier sync: {{ updated(order.observed_at) }}. This is a saved update, not live tracking.</p><p v-else-if="order.tracking" class="mt-1 text-sm text-slate-600">No courier update synced yet.</p><a v-if="order.tracking" href="https://www.fdedomestic.com/#track" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-blue-600 underline">Latest tracking on FDE — enter the number above ↗</a></div>
    <div class="mt-5 border-t border-slate-200 pt-5"><h3 class="font-bold">Returns & order help</h3><p v-if="order.return_status" class="mt-2 capitalize">Request status: {{ status(order.return_status) }}</p><form v-else class="mt-3" @submit.prevent="requestReturn(order.reference)"><label class="text-sm text-slate-600">Tell us the reason for your return or order issue<textarea v-model="reasons[order.reference]" required minlength="10" maxlength="2000" class="account-field" /></label><button :disabled="busy" class="secondary-button mt-3">Request return / help</button><p class="mt-2 text-xs text-slate-500">Our team will review your request. This does not automatically approve a return or refund.</p></form></div>
   </article>
  </section>
 </div>
</template>
<style scoped>.account-field{display:block;width:100%;margin-top:.5rem;border:1px solid #e2e8f0;border-radius:.75rem;background:#fff;padding:.8rem;color:#0f172a}button:disabled{opacity:.5}</style>
