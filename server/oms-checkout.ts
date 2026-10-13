import { unitPrice } from '../src/lib/pricing.ts'
import { customerToken } from './customer-account.ts'
import type { Plugin, Connect } from 'vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Runs only on the server. Never expose the OMS token in VITE_* variables.
export function checkoutMiddleware(env: Record<string, string>): Connect.NextHandleFunction {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/checkout') return next()
    const reply = (status: number, data: unknown) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control','no-store'); res.end(JSON.stringify(data)) }
    if (req.method !== 'POST') return reply(405, {error:'Method not allowed'})
    if (req.headers.origin !== (env.PUBLIC_URL || `http://${req.headers.host}`)) return reply(403,{error:'Please order from the website checkout.'})
    if (!env.OMS_URL || !env.OMS_WEBSITE_TOKEN) return reply(503,{error:'Ordering is temporarily unavailable. Your cart is saved; please try again shortly.'})
    let body = ''
    try {
      for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body)>20000) return reply(413,{error:'Order is too large.'}) }
      const input = JSON.parse(body)
      if (!input || !Array.isArray(input.items) || !input.items.length || input.items.length>50 || !['cod','bank'].includes(input.payment)) return reply(400,{error:'Please check your order.'})
      const catalog = JSON.parse(readFileSync(fileURLToPath(new URL('../src/data/products.json',import.meta.url)), 'utf8'))
      const quantities = new Map<number,number>()
      const variants = new Map<string,{id:number;color:string;quantity:number}>()
      for (const item of input.items) {
        if (!item || !Number.isInteger(item.id) || !Number.isInteger(item.quantity) || item.quantity<1 || item.quantity>99) return reply(400,{error:'Invalid item quantity.'})
        const product=catalog.find((p: {id:number})=>p.id===item.id)
        if (!product) return reply(400,{error:'An item is unavailable. Please update your cart.'})
        const color=item.color ?? ''
        if (typeof color!=='string' || (product.colors ? !product.colors.includes(color) : color!=='')) return reply(400,{error:'Please choose a valid colour for your rack.'})
        quantities.set(item.id,(quantities.get(item.id)||0)+item.quantity)
        const key=`${item.id}:${color}`
        variants.set(key,{id:item.id,color,quantity:(variants.get(key)?.quantity||0)+item.quantity})
      }
      for (const [id,qty] of quantities) {
        const product=catalog.find((p: {id:number})=>p.id===id)
        if (qty>99 || (product.stock!==null && qty>product.stock) || !Number.isFinite(product.price) || product.price<0) return reply(400,{error:'An item is unavailable or exceeds available stock. Please update your cart.'})
      }
      let subtotal=0, quantity=0
      const descriptions: string[]=[]
      for (const item of variants.values()) {
        const product=catalog.find((p: {id:number})=>p.id===item.id)
        const price=unitPrice(product,quantities.get(item.id)!)
        subtotal += Math.round(price*100)*item.quantity; quantity += item.quantity
        descriptions.push(`${item.quantity} x ${product.title}${item.color ? ' — '+item.color : ''}`)
      }
      const total=subtotal+(input.payment==='cod'?40000:0)
      if (input.expected_total_cents!==total) return reply(409,{error:'Prices have changed. Please refresh your cart before ordering.'})
      const response=await fetch(new URL('/api/website/orders',env.OMS_URL),{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(12000),
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${env.OMS_WEBSITE_TOKEN}`, 'X-Customer-Session':customerToken(req)},
        body:JSON.stringify({request_id:input.request_id,name:input.fullName,phone:input.phone,address:input.address,city:input.city,
          product:descriptions.join('; '),quantity,total_cents:total,payment:input.payment,
          notes:`District: ${String(input.district||'')}\nEmail: ${String(input.email||'')}\n${String(input.notes||'')}`})
      })
      const result=await response.json()
      if (![200,201,400,401,409].includes(response.status)) throw new Error('OMS unavailable')
      return reply(response.status,result)
    } catch { return reply(503,{error:'We could not confirm your order yet. Your cart is saved. Please retry without changing the order to avoid duplicates.'}) }
  }
  return middleware
}
export function omsCheckout(env: Record<string,string>): Plugin {
  const middleware=checkoutMiddleware(env)
  return {name:'oms-checkout',configureServer(server){server.middlewares.use(middleware)},configurePreviewServer(server){server.middlewares.use(middleware)}}
}
