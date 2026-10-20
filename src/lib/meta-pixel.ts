import { nextTick, watch } from 'vue'
import type { Router } from 'vue-router'
import catalog from '../data/products.json'
import { advertisingConsent, privacySignal } from './consent'
import { ecommerce, safePage, confirmedOrder, type Line } from './ga4-core'

type Pixel = { (...args: unknown[]): void; queue: unknown[][]; callMethod?: (...args: unknown[]) => void; loaded: boolean; version: string; push: Pixel }
type MetaWindow = Window & { fbq?: Pixel; _fbq?: Pixel }
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || ''
let installed = false, active = false, initialized = false, lastPage = '', checking = false
const ORDERS = 'pp3d-meta-orders', PURCHASES = 'pp3d-meta-purchases'
const browser = () => window as MetaWindow
const allowedHost = () => ['printpro3d.lk', 'www.printpro3d.lk'].includes(location.hostname)
// Pixel transmits its page URL: don't load or call it on private routes, arbitrary
// query strings, fragments or free-text search URLs.
export function metaSafeLocation(input: string) {
  try {
    const url = new URL(input)
    return !!safePage(url.pathname, catalog) && !url.hash && [...url.searchParams].every(([key, value]) =>
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].includes(key)
        ? /^[a-zA-Z0-9 _-]{1,80}$/.test(value) && !/\d{7}/.test(value)
        : key === 'fbclid' && /^[a-zA-Z0-9_-]{1,500}$/.test(value))
  } catch { return false }
}
function permitted() { return active && advertisingConsent.value && !privacySignal() && allowedHost() && metaSafeLocation(location.href) }
export function metaEvent(name: string, data: Record<string, unknown> = {}, eventID?: string, custom = false) {
  if (!permitted()) return
  try { browser().fbq?.(custom ? 'trackCustom' : 'track', name, data, ...(eventID ? [{eventID}] : [])) } catch { /* Never interrupt shopping. */ }
}
function productData(lines: Line[]) {
  const data = ecommerce(lines, catalog)
  return {currency: data.currency, value: data.value, content_type: 'product', content_ids: data.items.map(item => item.item_id), contents: data.items.map(item => ({id:item.item_id, quantity:item.quantity, item_price:item.price})), num_items:data.items.reduce((sum,item)=>sum+item.quantity,0)}
}
export function metaCart(name: string, lines: Line[]) {
  if (!lines.length) return
  const events: Record<string,string> = {add_to_cart:'AddToCart'}
  if (events[name]) metaEvent(events[name], productData(lines))
}
export function metaOrderSubmitted(reference: string, lines: Line[], shipping: number) {
  if (!permitted() || !/^WEB-\d+$/.test(reference)) return
  try {
    const pending = JSON.parse(localStorage.getItem(ORDERS) || '{}')
    if (pending[reference]) return
    pending[reference] = {...productData(lines), shipping, created:Date.now()}
    localStorage.setItem(ORDERS, JSON.stringify(pending))
    // A COD request or unpaid bank order is not yet a confirmed purchase.
    metaEvent('OrderSubmitted', productData(lines), `order-${reference}`, true)
  } catch { /* Tracking must never block an order. */ }
}
async function reconcileOrders() {
  if (!permitted() || checking) return
  checking = true
  try {
    const pending = JSON.parse(localStorage.getItem(ORDERS) || '{}')
    for (const [key, value] of Object.entries(pending)) if (Date.now() - (value as {created:number}).created > 30*86400000) delete pending[key]
    if (!Object.keys(pending).length) return
    const response = await fetch('/api/account/orders', {credentials:'same-origin'})
    if (!response.ok || !permitted()) return
    const result = await response.json()
    for (const order of result.orders || []) {
      const saved = pending[order.reference]
      if (!saved || !confirmedOrder(order) || Math.round((saved.value + saved.shipping)*100) !== order.total_cents) continue
      const send = () => {
        if (!permitted()) return
        const sent = JSON.parse(localStorage.getItem(PURCHASES) || '[]')
        if (!Array.isArray(sent) || sent.includes(order.order_reference)) return
        localStorage.setItem(PURCHASES, JSON.stringify([...sent, order.order_reference]))
        const {created: _created, shipping: _shipping, ...data} = saved
        metaEvent('Purchase', data, `purchase-${order.order_reference}`)
      }
      if (navigator.locks) await navigator.locks.request('pp3d-meta-purchase', send); else send()
      delete pending[order.reference]
    }
    if (advertisingConsent.value) localStorage.setItem(ORDERS, JSON.stringify(pending))
  } catch { /* Optional tracking failure cannot affect shopping. */ } finally { checking = false }
}
function enable() {
  if (active || !advertisingConsent.value || privacySignal() || !allowedHost() || !/^\d{5,30}$/.test(META_PIXEL_ID) || !metaSafeLocation(location.href)) return
  const w = browser()
  if (!w.fbq) {
    const fbq = function(...args: unknown[]) { if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue.push(args) } as Pixel
    fbq.queue = []; fbq.loaded = true; fbq.version = '2.0'; fbq.push = fbq
    w.fbq = w._fbq = fbq
  }
  w.fbq('consent','grant')
  if (!initialized) {
    w.fbq('set','autoConfig',false,META_PIXEL_ID)
    w.fbq('init',META_PIXEL_ID)
    initialized = true
  }
  if (!document.getElementById('pp3d-meta-pixel')) {
    const script = document.createElement('script'); script.id = 'pp3d-meta-pixel'; script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.append(script)
  }
  active = true
}
export function installMetaPixel(router: Router, cart: () => Line[]) {
  if (installed) return
  installed = true
  async function page() {
    await nextTick(); enable()
    if (!permitted()) { lastPage = ''; return }
    const path = router.currentRoute.value.path
    if (path !== lastPage) {
      lastPage = path; metaEvent('PageView')
      const product = catalog.find(item => path === `/products/${item.id}`)
      if (product) metaEvent('ViewContent', productData([{id:product.id, quantity:1, price:product.price}]))
      if (path === '/checkout' && cart().length) metaEvent('InitiateCheckout', productData(cart()))
    }
    void reconcileOrders()
  }
  watch(advertisingConsent, accepted => {
    if (!accepted) {
      active = false; lastPage = ''
      const pixel = browser().fbq
      // If the network script has not loaded, discard queued events before revoking.
      if (pixel && !pixel.callMethod) { pixel.queue = []; initialized = false }
      pixel?.('consent','revoke'); return
    }
    void page()
  }, {immediate:true, flush:'sync'})
  router.afterEach((_to,_from,failure) => { if (!failure) void page() })
  setInterval(() => { if (!document.hidden) void reconcileOrders() }, 60000)
}
