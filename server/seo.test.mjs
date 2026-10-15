import test from 'node:test'
import assert from 'node:assert/strict'
import { createStore } from './index.mjs'
import { loadCatalog, seoFor, sitemap, ORIGIN } from './seo.mjs'
import { readFile } from 'node:fs/promises'
import { once } from 'node:events'
import { request } from 'node:http'
async function fixture(t) {
 const server=createStore({PUBLIC_URL:ORIGIN}).listen(0,'127.0.0.1');await once(server,'listening')
 t.after(()=>{server.closeAllConnections();return new Promise(r=>server.close(r))})
 return `http://127.0.0.1:${server.address().port}`
}
test('sitemap includes exactly accessible catalog, category and public routes; no fabricated modification dates',async t=>{
 const base=await fixture(t), response=await fetch(base+'/sitemap.xml'),xml=await response.text(),catalog=await loadCatalog()
 assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/application\/xml/)
 assert.match(xml,/<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/)
 for(const p of catalog)assert.ok(xml.includes(`<loc>${ORIGIN}/products/${p.id}</loc>`))
 assert.match(xml,/products\?category=sensors/);assert.match(xml,/\/custom-print<\/loc>/)
 assert.doesNotMatch(xml,/<lastmod>|\/cart<|\/checkout<|\/account<|\/admin<|railway\.app/)
 assert.equal((xml.match(/<loc>/g)||[]).length,new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])).size)
 const updated=sitemap([...catalog,{...catalog[0],id:99991,updatedAt:'2026-10-14T10:00:00Z'}, {...catalog[0],id:99992,published:false},{...catalog[0],id:99993,deleted:true}])
 assert.match(updated,/products\/99991/);assert.match(updated,/<lastmod>2026-10-14T10:00:00.000Z<\/lastmod>/);assert.doesNotMatch(updated,/products\/99992|products\/99993/)
})
test('robots allows products and lists canonical sitemap without treating robots as authentication',async t=>{
 const base=await fixture(t),response=await fetch(base+'/robots.txt'),body=await response.text()
 assert.equal(response.status,200);assert.match(body,/Allow: \//);assert.match(body,/Disallow: \/admin/);assert.match(body,/Sitemap: https:\/\/printpro3d.lk\/sitemap.xml/);assert.doesNotMatch(body,/Disallow: \/products/)
})
test('all public pages contain unique metadata, canonical, real product JSON-LD and visible pre-rendered content',async t=>{
 const base=await fixture(t),catalog=await loadCatalog(),titles=new Set()
 for(const p of catalog){
  const response=await fetch(base+'/products/'+p.id),html=await response.text();assert.equal(response.status,200)
  const title=/<title>(.*?)<\/title>/.exec(html)?.[1];assert.ok(title);assert.ok(!titles.has(title));titles.add(title)
  assert.ok(html.includes(`href="${ORIGIN}/products/${p.id}"`));assert.match(html,/<h1[^>]*>/);assert.ok(html.includes(p.sku))
  assert.match(html,/<meta property="og:image"/);assert.match(html,/<meta name="description"/);assert.equal((html.match(/rel="canonical"/g)||[]).length,1)
  const data=JSON.parse(/<script id="product-schema" type="application\/ld\+json">(.*?)<\/script>/.exec(html)[1])
  assert.equal(data.name,p.title);assert.equal(data.offers.price,p.price);assert.equal(data.offers.priceCurrency,'LKR');assert.equal(data.offers.availability,`https://schema.org/${p.stock===0?'OutOfStock':'InStock'}`);assert.equal(data.aggregateRating,undefined)
 }
 const home=await (await fetch(base+'/')).text();assert.match(home,/<title>PRINTPRO3D \| 3D Printing, Electronics &amp; RC Products Sri Lanka<\/title>/)
 assert.match(home,/href="\/products\/1021"/);assert.match(home,/href="\/products\?category=sensors"/)
})
test('category URLs are prerendered and canonical; private/search URLs are noindex; invalid pages return 404',async t=>{
 const base=await fixture(t)
 const category=await fetch(base+'/products?category=sensors');const html=await category.text();assert.equal(category.status,200);assert.match(html,/Sensors Sri Lanka/);assert.match(html,/rel="canonical" href="https:\/\/printpro3d.lk\/products\?category=sensors"/)
 assert.equal((html.match(/class="product-card /g)||[]).length,7)
 for(const path of ['/cart','/checkout','/account','/admin','/wishlist','/compare','/success','/products?q=esp32']){
  const r=await fetch(base+path);assert.equal(r.status,200);assert.equal(r.headers.get('x-robots-tag'),'noindex, follow');assert.match(await r.text(),/content="noindex, follow"/)
 }
 for(const path of ['/products/999999','/products/01021','/products?category=missing','/not-a-page','/prerender/routes.json'])assert.equal((await fetch(base+path)).status,404)
 const head=await fetch(base+'/products/1021',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'')
})
test('old Railway public URLs redirect to the canonical domain; API and private flows do not redirect',async t=>{
 const base=await fixture(t),headers={host:'printpro3d-store-production.up.railway.app'}
 const r=await new Promise((resolve,reject)=>{const req=request(base+'/products/1021',{headers},res=>{res.resume();res.on('end',()=>resolve(res))});req.on('error',reject);req.end()});assert.equal(r.statusCode,301);assert.equal(r.headers.location,ORIGIN+'/products/1021')
 const api=await fetch(base+'/healthz',{headers,redirect:'manual'});assert.equal(api.status,200)
 const cart=await fetch(base+'/cart',{headers,redirect:'manual'});assert.equal(cart.status,200)
})
test('structured data serialization is safe and user-specific state is absent from prerendered pages',async()=>{
 const catalog=await loadCatalog(),metadata=seoFor('/products/1021',catalog);assert.equal(metadata.canonical,ORIGIN+'/products/1021')
 const manifest=JSON.parse(await readFile('dist/prerender/routes.json','utf8'));const html=await readFile('dist/prerender/'+manifest['/products/1021'],'utf8')
 assert.doesNotMatch(html,/WEB-TEST|fixture-order|Bearer |oms-order-receipt/)
 const descriptions=catalog.map(p=>seoFor('/products/'+p.id,catalog).description);assert.equal(new Set(descriptions).size,catalog.length)
})

test('custom-domain origin works with existing production PUBLIC_URL without accepting arbitrary origins',async()=>{
 const {allowedOrigin}=await import('./origins.ts')
 const env={PUBLIC_URL:'https://printpro3d-store-production.up.railway.app'}
 assert.equal(allowedOrigin({headers:{origin:ORIGIN}},env),true)
 assert.equal(allowedOrigin({headers:{origin:env.PUBLIC_URL}},env),true)
 for(const origin of ['https://attacker.test','https://printpro3d.lk.attacker.test','http://printpro3d.lk',undefined])assert.equal(allowedOrigin({headers:{origin}},env),false)
 assert.equal(allowedOrigin({headers:{origin:ORIGIN}},{PUBLIC_URL:'https://unrelated.test'}),false)
})
