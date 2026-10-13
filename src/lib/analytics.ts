import type { Router } from 'vue-router'

export function startAnalytics(router: Router) {
  if(navigator.doNotTrack==='1'||(navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl)return
  let visitor=''
  let day=''
  let page='/other'
  let event: string|null=null
  let source='direct'
  try {const ref=new URL(document.referrer);if(ref.origin!==location.origin)source=ref.hostname.toLowerCase().slice(0,100)}catch{/* no referral */}
  const device=/ipad|tablet/i.test(navigator.userAgent)?'tablet':/mobile|android/i.test(navigator.userAgent)?'mobile':'desktop'
  function identity() {
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo'}).format(new Date())
    if(visitor&&day===today)return visitor
    day=today
    try {
      const saved=JSON.parse(localStorage.getItem('pp3d-visitor')||'null')
      visitor=saved?.day===day&&/^[a-f0-9-]{36}$/.test(saved.id)?saved.id:crypto.randomUUID()
      localStorage.setItem('pp3d-visitor',JSON.stringify({id:visitor,day}))
    }catch{visitor=crypto.randomUUID()}
    return visitor
  }
  function ping() {
    if(document.hidden)return
    const payload={visitor:identity(),event,page,device,source}
    event=null
    void fetch('/api/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{})
  }
  router.afterEach((to,_from,failure)=>{
    if(failure)return
    const allowed=['/','/products','/about','/terms','/warranty','/compare','/contact','/custom-print','/cart','/checkout','/success','/wishlist','/account']
    page=allowed.includes(to.path)||/^\/products\/\d{1,8}$/.test(to.path)?to.path:'/other'
    event=crypto.randomUUID()
    ping()
  })
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)ping()})
  setInterval(ping,30000)
}
