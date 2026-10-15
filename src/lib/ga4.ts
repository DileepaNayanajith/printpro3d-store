import { nextTick, watch } from 'vue'
import type { Router } from 'vue-router'
import catalog from '../data/products.json'
import { analyticsConsent, readConsent } from './consent'
import { MEASUREMENT_ID, ecommerce, safePage, safeLocation, safeSearch, confirmedOrder, claimPurchase, type Line } from './ga4-core'
import { seoFor } from './seo'
type GWindow=Window & {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void;[key:`ga-disable-${string}`]:boolean}
const browser=()=>window as unknown as GWindow
let active=false, installed=false, lastPage='', lastSearch='', lastSearchAt=0, lastShipping='', checking=false
let getLines:()=>Line[]=()=>[]
let landingUrl=''
let currentPath=()=>location.pathname
function pageLocation(path:string) {const url=new URL(location.href);const landing=new URL(landingUrl || location.href);for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(!url.searchParams.has(key) && landing.searchParams.has(key))url.searchParams.set(key,landing.searchParams.get(key)!);return safeLocation(url.href,path)}
const ads={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}
export function track(name:string,params:Record<string,unknown>={}) {
  if(!active || !analyticsConsent.value)return
  const path=safePage(currentPath(),catalog) || (name==='whatsapp_checkout' && ['/success','/account'].includes(currentPath()) ? '/checkout' : null)
  // Do not allow Google to infer private account/admin/success URLs from events.
  if(!path)return
  browser().gtag?.('event',name,{...params,send_to:MEASUREMENT_ID,page_location:pageLocation(path),page_title:seoFor(path,catalog).title,page_referrer:referrer(),...(debug()?{debug_mode:true}:{})})
}
function referrer(){try{return new URL(document.referrer).origin+'/'}catch{return ''}}
function debug(){return new URLSearchParams(location.search).get('ga_debug')==='1'}
export function trackCart(name:string,lines:Line[]) {const data=ecommerce(lines,catalog);if(data.items.length)track(name,data)}
export function trackSearch(input:string) {if(!input.trim() || !analyticsConsent.value)return;const term=safeSearch(input,catalog),key=input.trim().toLowerCase();if(key===lastSearch && Date.now()-lastSearchAt<1000)return;lastSearch=key;lastSearchAt=Date.now();track('search',{search_term:term})}
export function trackShipping(lines:Line[]) {const data=ecommerce(lines,catalog),key=JSON.stringify(data);if(key===lastShipping || !analyticsConsent.value)return;lastShipping=key;track('add_shipping_info',{...data,shipping_tier:'islandwide_delivery'})}
export function trackWhatsapp(kind:'whatsapp_checkout'|'whatsapp_contact'|'product_inquiry',context:string) {track(kind,{interaction_context:context})}
export function recordOrder(reference:string,lines:Line[],shipping:number,payment:string) {
  if(!analyticsConsent.value || !/^WEB-\d+$/.test(reference))return
  const data=ecommerce(lines,catalog);lastShipping=''
  try {const pending=JSON.parse(localStorage.getItem('pp3d-ga-orders')||'{}');if(pending[reference])return;pending[reference]={...data,shipping,payment,created:Date.now()};localStorage.setItem('pp3d-ga-orders',JSON.stringify(pending));track('order_submitted',data)}catch{/* never interfere with ordering */}
}
async function reconcileOrders() {
  if(!active || !analyticsConsent.value || checking)return
  let pending:Record<string,ReturnType<typeof ecommerce> & {shipping:number;created:number}>
  try{pending=JSON.parse(localStorage.getItem('pp3d-ga-orders')||'{}');for(const [key,val]of Object.entries(pending))if(Date.now()-val.created>30*86400000)delete pending[key];if(!Object.keys(pending).length)return}catch{return}
  checking=true
  try {
    const response=await fetch('/api/account/orders',{credentials:'same-origin'})
    if(!response.ok)return
    const result=await response.json()
    if(!analyticsConsent.value)return
    for(const order of result.orders || []) {
      const saved=pending[order.reference]
      if(!saved || !confirmedOrder(order) || Math.round((saved.value+saved.shipping)*100)!==order.total_cents)continue
      const send=()=>{
        if(!analyticsConsent.value || !claimPurchase(localStorage,order.order_reference))return
        // Confirmation comes from the authenticated OMS response, never a success-page visit.
        browser().gtag?.('event','purchase',{transaction_id:order.order_reference,currency:'LKR',value:saved.value,shipping:saved.shipping,items:saved.items,send_to:MEASUREMENT_ID,page_location:'https://printpro3d.lk/checkout',page_title:'Order confirmation | PRINTPRO3D',page_referrer:'',...(debug()?{debug_mode:true}:{})})
      }
      if(navigator.locks)await navigator.locks.request('pp3d-ga-purchase',send);else send()
      delete pending[order.reference]
    }
    localStorage.setItem('pp3d-ga-orders',JSON.stringify(pending))
  }catch{/* analytics must never interrupt checkout */}finally{checking=false}
}
async function page() {
  await nextTick()
  if(!active || !analyticsConsent.value)return
  const path=safePage(currentPath(),catalog)
  if(!path){lastPage='';return}
  browser().gtag?.('set',{page_location:pageLocation(path),page_title:seoFor(path,catalog).title,page_referrer:referrer()})
  if(path!==lastPage){lastPage=path;track('page_view');const p=catalog.find(p=>path===`/products/${p.id}`);if(p)trackCart('view_item',[{id:p.id,price:p.price,quantity:1}]);if(path==='/cart')trackCart('view_cart',getLines());if(path==='/checkout')trackCart('begin_checkout',getLines())}
  void reconcileOrders()
}
export function installGa4(router:Router,cart:()=>Line[]) {
  if(installed)return;installed=true;landingUrl=location.href;getLines=cart;currentPath=()=>router.currentRoute.value.path
  readConsent()
  watch(analyticsConsent,accepted=>{
    const w=browser();w[`ga-disable-${MEASUREMENT_ID}`]=!accepted
    if(!accepted){active=false;lastPage='';w.gtag?.('consent','update',{...ads,analytics_storage:'denied'});if(document.getElementById('pp3d-google-tag'))location.reload();return}
    if(location.hostname!=='printpro3d.lk' && location.hostname!=='www.printpro3d.lk')return
    w.dataLayer=w.dataLayer || [];w.gtag=w.gtag || function(){w.dataLayer!.push(arguments)}
    w.gtag('consent','default',{...ads,analytics_storage:'denied'})
    w.gtag('consent','update',{...ads,analytics_storage:'granted'})
    const path=safePage(currentPath(),catalog) || '/'
    w.gtag('set',{page_location:pageLocation(path),page_referrer:referrer(),page_title:seoFor(path,catalog).title})
    w.gtag('js',new Date());w.gtag('config',MEASUREMENT_ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false})
    if(!document.getElementById('pp3d-google-tag')){const script=document.createElement('script');script.id='pp3d-google-tag';script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;document.head.append(script)}
    active=true;void page()
  },{immediate:true,flush:'sync'})
  router.afterEach((_to,_from,failure)=>{if(!failure)void page()})
  document.addEventListener('click',event=>{
    const anchor=(event.target as Element)?.closest?.('a[href]');if(!anchor)return
    try{const url=new URL(anchor.getAttribute('href') || '',location.href);if(!['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname))return
      const path=currentPath();trackWhatsapp(path==='/success'||path==='/account'?'whatsapp_checkout':/^\/products\/\d+$/.test(path)?'product_inquiry':'whatsapp_contact',/^\/products\/\d+$/.test(path)?'product':'store')
    }catch{}
  },true)
  setInterval(()=>{if(!document.hidden)void reconcileOrders()},60000)
}
