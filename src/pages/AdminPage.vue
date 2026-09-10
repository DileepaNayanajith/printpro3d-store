<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOnRectangleIcon, ArrowTrendingUpIcon, BanknotesIcon, CubeIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, PrinterIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'

type OrderStatus = 'Processing' | 'Confirmed' | 'Delivered'
const search = ref('')
const status = ref('All')
const router = useRouter()
const logout = () => {
  localStorage.removeItem('printpro3d_admin_session')
  router.replace('/admin/login')
}
const orders = [
  { id: 'P3D-1048', customer: 'Kasun Perera', item: 'D99S Defender', total: 18900, payment: 'Cash on delivery', status: 'Processing' as OrderStatus, date: '10 Sep' },
  { id: 'P3D-1047', customer: 'Nimali Silva', item: 'E99 Max Drone', total: 9500, payment: 'Bank deposit', status: 'Confirmed' as OrderStatus, date: '10 Sep' },
  { id: 'P3D-1046', customer: 'Ravindu Fernando', item: 'Custom STL Print', total: 3200, payment: 'Bank deposit', status: 'Delivered' as OrderStatus, date: '09 Sep' },
  { id: 'P3D-1045', customer: 'Tharushi Jay', item: 'MN82T RC Truck', total: 18900, payment: 'Cash on delivery', status: 'Confirmed' as OrderStatus, date: '09 Sep' },
  { id: 'P3D-1044', customer: 'Amal Senanayake', item: 'E88 Drone', total: 6150, payment: 'Cash on delivery', status: 'Delivered' as OrderStatus, date: '08 Sep' },
]
const products = [
  { name: 'E88 Drone', stock: 4 }, { name: 'E99 Max Drone', stock: 7 }, { name: 'K13 Max Drone', stock: 3 }, { name: 'D99S Defender', stock: 2 }, { name: 'MN82T RC Truck', stock: 5 },
]
const quoteRequests = [
  { name: 'Gear Housing V4.STL', customer: 'Dilan', material: 'PETG · 40%', weight: '86 g', time: '12 min ago' },
  { name: 'Robot Arm Joint.STL', customer: 'Isuru', material: 'PLA · 20%', weight: '42 g', time: '1 hr ago' },
  { name: 'Drone Camera Mount.STL', customer: 'Shehan', material: 'TPU · 60%', weight: '28 g', time: 'Yesterday' },
]
const filteredOrders = computed(() => orders.filter(order => {
  const matchesStatus = status.value === 'All' || order.status === status.value
  const query = search.value.trim().toLowerCase()
  return matchesStatus && (!query || `${order.id} ${order.customer} ${order.item}`.toLowerCase().includes(query))
}))
const money = (value: number) => `Rs. ${value.toLocaleString('en-LK')}`
const statusClass = (value: OrderStatus) => ({
  Processing: 'bg-amber-400/10 text-amber-300', Confirmed: 'bg-cyan-400/10 text-cyan-300', Delivered: 'bg-emerald-400/10 text-emerald-300'
}[value])
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-12 text-white sm:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <div><p class="section-kicker">Private staff area</p><h1 class="section-title">Admin Dashboard</h1><p class="mt-3 text-sm text-slate-400">Monitor orders, inventory and custom print requests.</p></div>
        <div class="flex items-center gap-3"><div class="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-bold text-emerald-300"><span class="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400"></span>Store online</div><button @click="logout" class="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-rose-400/50 hover:text-rose-300"><ArrowLeftOnRectangleIcon class="h-4 w-4"/> Log out</button></div>
      </div>

      <section class="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="stat-card"><div class="stat-icon"><BanknotesIcon /></div><div><p class="stat-label">Today’s revenue</p><p class="stat-value">Rs. 53,700</p><p class="stat-change"><ArrowTrendingUpIcon /> 12.5% this week</p></div></div>
        <div class="stat-card"><div class="stat-icon"><ShoppingBagIcon /></div><div><p class="stat-label">New orders</p><p class="stat-value">8</p><p class="stat-note">3 need attention</p></div></div>
        <div class="stat-card"><div class="stat-icon"><PrinterIcon /></div><div><p class="stat-label">Print requests</p><p class="stat-value">5</p><p class="stat-note">2 awaiting quote</p></div></div>
        <div class="stat-card"><div class="stat-icon"><CubeIcon /></div><div><p class="stat-label">Products</p><p class="stat-value">7</p><p class="stat-note">2 low-stock items</p></div></div>
      </section>

      <div class="mt-7 grid items-start gap-7 xl:grid-cols-[1fr_340px]">
        <section class="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
            <div><h2 class="text-xl font-black">Recent orders</h2><p class="mt-1 text-xs text-slate-500">Latest customer purchases</p></div>
            <div class="flex flex-wrap gap-2">
              <label class="relative"><MagnifyingGlassIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/><input v-model="search" class="rounded-full border border-white/10 bg-slate-900 py-2 pl-9 pr-4 text-xs outline-none focus:border-cyan-400" placeholder="Search orders" /></label>
              <select v-model="status" class="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-xs font-bold outline-none"><option>All</option><option>Processing</option><option>Confirmed</option><option>Delivered</option></select>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[760px] text-left text-sm">
              <thead class="bg-white/[0.025] text-[11px] uppercase tracking-wider text-slate-500"><tr><th class="px-6 py-4">Order</th><th class="px-4 py-4">Customer</th><th class="px-4 py-4">Item</th><th class="px-4 py-4">Total</th><th class="px-4 py-4">Status</th><th class="px-6 py-4">Date</th></tr></thead>
              <tbody class="divide-y divide-white/[0.07]"><tr v-for="order in filteredOrders" :key="order.id" class="transition hover:bg-white/[0.025]"><td class="px-6 py-5 font-bold text-cyan-400">{{ order.id }}</td><td class="px-4 py-5"><p class="font-semibold">{{ order.customer }}</p><p class="mt-1 text-[11px] text-slate-500">{{ order.payment }}</p></td><td class="px-4 py-5 text-slate-300">{{ order.item }}</td><td class="px-4 py-5 font-bold">{{ money(order.total) }}</td><td class="px-4 py-5"><span :class="['rounded-full px-3 py-1.5 text-[11px] font-bold', statusClass(order.status)]">{{ order.status }}</span></td><td class="px-6 py-5 text-slate-500">{{ order.date }}</td></tr></tbody>
            </table>
            <p v-if="!filteredOrders.length" class="py-12 text-center text-sm text-slate-500">No matching orders found.</p>
          </div>
        </section>

        <aside class="space-y-7">
          <section class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"><div class="flex items-center justify-between"><h2 class="text-lg font-black">Stock monitor</h2><ExclamationTriangleIcon class="h-5 w-5 text-amber-400"/></div><div class="mt-5 space-y-4"><div v-for="product in products" :key="product.name"><div class="flex justify-between text-xs"><span class="font-semibold text-slate-300">{{ product.name }}</span><span :class="product.stock <= 3 ? 'text-amber-300' : 'text-slate-500'">{{ product.stock }} left</span></div><div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div :class="['h-full rounded-full', product.stock <= 3 ? 'bg-amber-400' : 'bg-cyan-400']" :style="{ width: `${Math.min(product.stock * 10, 100)}%` }"></div></div></div></div></section>
          <section class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"><h2 class="text-lg font-black">Custom print queue</h2><div class="mt-5 space-y-3"><div v-for="quote in quoteRequests" :key="quote.name" class="rounded-2xl bg-slate-900 p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-bold">{{ quote.name }}</p><p class="mt-1 text-xs text-slate-500">{{ quote.customer }} · {{ quote.material }}</p></div><span class="shrink-0 text-[10px] text-slate-600">{{ quote.time }}</span></div><p class="mt-3 text-xs font-bold text-cyan-400">Est. {{ quote.weight }}</p></div></div></section>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card{display:flex;gap:1rem;border:1px solid rgba(255,255,255,.1);border-radius:1.5rem;background:rgba(255,255,255,.04);padding:1.25rem}.stat-icon{display:grid;height:2.75rem;width:2.75rem;flex:none;place-items:center;border-radius:1rem;background:rgba(34,211,238,.1);color:#22d3ee}.stat-icon :deep(svg){height:1.35rem;width:1.35rem}.stat-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b}.stat-value{margin-top:.35rem;font-size:1.5rem;font-weight:900}.stat-change,.stat-note{margin-top:.4rem;display:flex;align-items:center;gap:.3rem;font-size:.7rem;color:#64748b}.stat-change{color:#34d399}.stat-change :deep(svg){height:.85rem;width:.85rem}
</style>
