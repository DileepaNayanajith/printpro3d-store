import { allowedOrigin } from './origins.ts'
import type { Plugin, Connect } from 'vite'
import { createHash } from 'node:crypto'
import type { IncomingMessage } from 'node:http'
export function customerToken(req: IncomingMessage) {
  const value=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('pp3d_customer='))?.slice(14)||''
  return /^[A-Za-z0-9_-]{40,80}$/.test(value)?value:''
}
export function accountMiddleware(env:Record<string,string>):Connect.NextHandleFunction {
  const middleware:Connect.NextHandleFunction=async(req,res,next)=>{
    const path=req.url?.split('?')[0]||''
    if(!path.startsWith('/api/account/'))return next()
    const action=path.slice('/api/account/'.length)
    const reply=(code:number,body:unknown)=>{res.statusCode=code;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))}
    const method=['config','orders'].includes(action)?'GET':'POST'
    if(!['config','orders','register','login','logout','google','returns'].includes(action))return reply(404,{error:'Not found.'})
    if(req.method!==method)return reply(405,{error:'Method not allowed.'})
    if(method==='POST' && !allowedOrigin(req,env))return reply(403,{error:'Reload this page and try again.'})
    if(!env.OMS_URL||!env.OMS_WEBSITE_TOKEN)return reply(503,{error:'Accounts are temporarily unavailable.'})
    try {
      let body=''
      for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>20000)return reply(413,{error:'Request too large.'})}
      const response=await fetch(new URL(`/api/website/account/${action}`,env.OMS_URL),{method,redirect:'error',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.OMS_WEBSITE_TOKEN}`,'X-Customer-Session':customerToken(req),'X-Store-Client':createHash('sha256').update(req.socket.remoteAddress||'local').digest('hex')},...(method==='POST'?{body:body||'{}'}:{})})
      const data=await response.json() as {token?:string; [key:string]:unknown}
      const secure=env.OMS_PUBLIC_HTTPS==='1'?'; Secure':''
      if(response.ok&&data.token){res.setHeader('Set-Cookie',`pp3d_customer=${data.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${secure}`);delete data.token}
      if(response.ok&&action==='logout')res.setHeader('Set-Cookie',`pp3d_customer=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`)
      return reply(response.status,data)
    }catch{return reply(503,{error:'Could not connect. Please try again shortly.'})}
  }
  return middleware
}
export function customerAccount(env:Record<string,string>):Plugin {
  const middleware=accountMiddleware(env)
  return {name:'customer-account',configureServer(s){s.middlewares.use(middleware)},configurePreviewServer(s){s.middlewares.use(middleware)}}
}
