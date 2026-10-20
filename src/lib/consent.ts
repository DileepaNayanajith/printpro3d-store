import { ref } from 'vue'
export const analyticsConsent = ref(false)
export const advertisingConsent = ref(false)
export const consentOpen = ref(false)
const KEY='pp3d-analytics-consent-v1'
const ADS_KEY='pp3d-advertising-consent-v1'
export function privacySignal() { return navigator.doNotTrack==='1' || !!(navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl }
export function readConsent() {
  try { const saved=JSON.parse(localStorage.getItem(KEY)||'null'); analyticsConsent.value=!privacySignal() && saved?.accepted===true && saved.expires>Date.now(); const ads=JSON.parse(localStorage.getItem(ADS_KEY)||'null'); advertisingConsent.value=!privacySignal() && ads?.accepted===true && ads.expires>Date.now(); consentOpen.value=!saved || saved.expires<=Date.now() || !ads || ads.expires<=Date.now() } catch { consentOpen.value=true }
}
export function chooseConsent(accepted:boolean,advertising=false) {
  analyticsConsent.value=accepted && !privacySignal()
  try {localStorage.setItem(KEY,JSON.stringify({accepted:analyticsConsent.value,expires:Date.now()+180*86400000}))}catch{/* choice remains in memory */}
  advertisingConsent.value=advertising && !privacySignal()
  try {localStorage.setItem(ADS_KEY,JSON.stringify({accepted:advertisingConsent.value,expires:Date.now()+180*86400000}))}catch{}
  if(!advertisingConsent.value){
    try{for(const key of ['pp3d-meta-orders','pp3d-meta-purchases'])localStorage.removeItem(key)}catch{}
    for(const name of ['_fbp','_fbc'])for(const domain of ['',`;domain=${location.hostname}`,';domain=.printpro3d.lk'])document.cookie=`${name}=;max-age=0;path=/${domain}`
  }
  consentOpen.value=false
  if(!analyticsConsent.value) {
    try { for(const key of ['pp3d-visitor','pp3d-ga-orders','pp3d-ga-purchases'])localStorage.removeItem(key) }catch{}
    for(const cookie of document.cookie.split(';')) {
      const name=cookie.split('=')[0]?.trim() || ''
      if(/^_ga(?:_|$)/.test(name))for(const domain of ['',`;domain=${location.hostname}`,';domain=.printpro3d.lk'])document.cookie=`${name}=;max-age=0;path=/${domain}`
    }
  }
}
