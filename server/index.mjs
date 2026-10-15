import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkoutMiddleware } from './oms-checkout.ts'
import { analyticsMiddleware } from './analytics.ts'
import { accountMiddleware } from './customer-account.ts'

import { loadCatalog, seoFor, sitemap, robotsText, ORIGIN, injectHead } from './seo.mjs'

const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.ico':'image/x-icon','.woff2':'font/woff2'}
export function createStore(env, directory=resolve('dist')) {
  const checkout=checkoutMiddleware(env), account=accountMiddleware(env), analytics=analyticsMiddleware(env)
  const root=resolve(directory)
  return createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff')
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin')
    res.setHeader('X-Frame-Options','DENY')
    if(env.PUBLIC_URL?.startsWith('https:'))res.setHeader('Strict-Transport-Security','max-age=31536000')
    const reply=(code,data)=>{res.statusCode=code;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
    try {
      const pathname=new URL(req.url,'http://localhost').pathname
      if(pathname==='/healthz')return reply(200,{status:'ok'})
      if(pathname.startsWith('/api/')) {
        const next=()=>account(req,res,()=>reply(404,{error:'Not found.'}))
        return await analytics(req,res,()=>checkout(req,res,next))
      }
      if(!['GET','HEAD'].includes(req.method))return reply(405,{error:'Method not allowed.'})
      if(pathname==='/robots.txt' || pathname==='/sitemap.xml') {
        const body=pathname==='/robots.txt'?robotsText:sitemap(await loadCatalog())
        res.setHeader('Content-Type',pathname==='/robots.txt'?'text/plain; charset=utf-8':'application/xml; charset=utf-8')
        res.setHeader('Cache-Control','no-cache');res.setHeader('Content-Length',Buffer.byteLength(body))
        return res.end(req.method==='HEAD'?undefined:body)
      }
      const decoded=decodeURIComponent(pathname)
      if(decoded.includes('\0') || decoded.includes('\\') || decoded.split('/').some(p=>p.startsWith('.')))return reply(404,{error:'Not found.'})
      if(decoded.startsWith('/prerender/'))return reply(404,{error:'Not found.'})
      if(decoded==='/index.html'){res.statusCode=301;res.setHeader('Location','/');return res.end()}
      let path=resolve(root,'.'+decoded)
      if(!path.startsWith(root+sep)&&path!==root)return reply(404,{error:'Not found.'})
      let info=await stat(path).catch(()=>null)
      if(!info?.isFile()) {
        if(extname(path))return reply(404,{error:'Not found.'})
        const url=new URL(req.url,'http://localhost'),catalog=await loadCatalog(),seo=seoFor(req.url,catalog)
        const host=String(req.headers.host || '').split(':')[0].toLowerCase()
        if(host==='printpro3d-store-production.up.railway.app' && !seo.privatePage) {
          res.statusCode=301;res.setHeader('Location',ORIGIN+url.pathname+url.search);return res.end()
        }
        let key=url.pathname.replace(/\/$/,'') || '/'
        if(key==='/products' && url.searchParams.has('category') && url.searchParams.get('category')!=='all')key+='?category='+encodeURIComponent(url.searchParams.get('category'))
        const manifest=JSON.parse(await readFile(resolve(root,'prerender/routes.json'),'utf8').catch(()=> '{}'))
        const rendered=manifest[seo.status===404?'/__404':key]
        let html=await readFile(resolve(root,rendered?'prerender/'+rendered:'index.html'),'utf8')
        // Recalculate the head for queries and the current catalog; keep the prerendered visible Vue markup.
        html=injectHead(html.replace(/<meta[^>]+data-seo[^>]*>/g,'').replace(/<link rel="canonical"[^>]*>/g,'').replace(/<script id="product-schema".*?<\/script>/s,''),seo)
        res.statusCode=seo.status;res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-cache')
        if(seo.robots.startsWith('noindex'))res.setHeader('X-Robots-Tag','noindex, follow')
        res.setHeader('Content-Length',Buffer.byteLength(html));return res.end(req.method==='HEAD'?undefined:html)
      }
      res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream')
      res.setHeader('Cache-Control',path.includes(`${sep}assets${sep}`)?'public, max-age=31536000, immutable':'no-cache')
      res.setHeader('Accept-Ranges','bytes')
      let start=0,end=info.size-1
      if(req.headers.range) {
        const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range)
        if(!match || (!match[1]&&!match[2]))return reply(416,{error:'Invalid range.'})
        if(match[1]){start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end}
        else start=Math.max(0,info.size-Number(match[2]))
        if(start>end||start>=info.size){res.setHeader('Content-Range',`bytes */${info.size}`);return reply(416,{error:'Invalid range.'})}
        res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${info.size}`)
      }
      res.setHeader('Content-Length',Math.max(0,end-start+1))
      if(req.method==='HEAD'||info.size===0)return res.end()
      const stream=createReadStream(path,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res)
    }catch{if(!res.headersSent)reply(500,{error:'Please try again shortly.'});else res.destroy()}
  })
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const env=process.env
  if(!env.OMS_URL||!env.OMS_WEBSITE_TOKEN||!env.PUBLIC_URL)throw new Error('Configure OMS_URL, OMS_WEBSITE_TOKEN and PUBLIC_URL before starting.')
  if(!env.OMS_URL.startsWith('https://')||!env.PUBLIC_URL.startsWith('https://'))throw new Error('Production services require HTTPS.')
  env.PUBLIC_URL=new URL(env.PUBLIC_URL).origin
  env.OMS_PUBLIC_HTTPS='1'
  const server=createStore(env)
  server.requestTimeout=30000;server.headersTimeout=15000
  server.listen(Number(env.PORT||8080),'0.0.0.0',()=>console.log('PRINTPRO3D storefront is ready.'))
  process.on('SIGTERM',()=>server.close(()=>process.exit(0)))
}
