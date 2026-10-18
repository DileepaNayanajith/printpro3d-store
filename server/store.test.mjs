import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp,writeFile,rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { createStore } from './index.mjs'

async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'pp3d-store-'))
  await writeFile(join(root,'index.html'),'<html>PRINTPRO3D fixture</html>')
  await writeFile(join(root,'movie.mp4'),'0123456789')
  const received=[]
  const backend=createServer(async(req,res)=>{
    let raw='';for await(const chunk of req)raw+=chunk
    received.push({path:req.url,headers:req.headers,body:raw?JSON.parse(raw):null})
    res.setHeader('Content-Type','application/json')
    if(req.url.endsWith('/login'))return res.end(JSON.stringify({token:'a'.repeat(43),name:'Fixture'}))
    if(req.url.endsWith('/config'))return res.end(JSON.stringify({google_enabled:false}))
    res.statusCode=201;res.end(JSON.stringify({reference:'WEB-TEST',status:'received'}))
  }).listen(0,'127.0.0.1');await once(backend,'listening')
  const env={OMS_URL:`http://127.0.0.1:${backend.address().port}`,OMS_WEBSITE_TOKEN:'test-only-key',PUBLIC_URL:'https://store.test',OMS_PUBLIC_HTTPS:'1'}
  const server=createStore(env,root).listen(0,'127.0.0.1');await once(server,'listening')
  const base=`http://127.0.0.1:${server.address().port}`
  t.after(async()=>{server.closeAllConnections();backend.closeAllConnections();await Promise.all([new Promise(r=>server.close(r)),new Promise(r=>backend.close(r))]);await rm(root,{recursive:true,force:true})})
  const post=(body,origin=env.PUBLIC_URL,path='/api/checkout')=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)})
  return {base,post,received}
}
const order={request_id:'fixture-order-1234567890',fullName:'Test Customer',phone:'0770000000',address:'Test address',city:'Colombo',payment:'cod',items:[{id:6,quantity:1}],expected_total_cents:1890000}

test('checkout calculates price on server and forwards once to OMS',async t=>{
 const {post,received}=await fixture(t)
 const response=await post(order);assert.equal(response.status,201)
 assert.equal((await response.json()).reference,'WEB-TEST')
 assert.equal(received.length,1);assert.equal(received[0].body.total_cents,1890000)
 assert.equal(received[0].headers.authorization,'Bearer test-only-key')
 assert.equal(received[0].body.request_id,order.request_id)
})
test('bank payment preserves total for review and marks bank method',async t=>{
 const {post,received}=await fixture(t)
 assert.equal((await post({...order,payment:'bank',expected_total_cents:1850000})).status,201)
 assert.equal(received[0].body.payment,'bank');assert.equal(received[0].body.total_cents,1850000)
})
test('price tampering, unavailable products and cross-origin requests never reach OMS',async t=>{
 const {post,received}=await fixture(t)
 assert.equal((await post({...order,expected_total_cents:1})).status,409)
 assert.equal((await post({...order,items:[{id:999,quantity:1}]})).status,400)
 assert.equal((await post(order,'https://attacker.test')).status,403)
 assert.equal((await post({...order,items:[{id:1,quantity:99}]})).status,400)
 assert.equal(received.length,0)
})
test('account sessions are HttpOnly, Secure and removed from JSON',async t=>{
 const {post}=await fixture(t)
 const response=await post({username:'fixture',password:'fixture'},'https://store.test','/api/account/login')
 assert.equal(response.status,200)
 const cookie=response.headers.get('set-cookie');assert.match(cookie,/HttpOnly/);assert.match(cookie,/Secure/);assert.match(cookie,/SameSite=Strict/)
 assert.equal((await response.json()).token,undefined)
})
test('SPA routes, video ranges, HEAD, private files and unknown APIs',async t=>{
 const {base}=await fixture(t)
 assert.match(await (await fetch(base+'/checkout')).text(),/PRINTPRO3D/)
 const range=await fetch(base+'/movie.mp4',{headers:{Range:'bytes=2-5'}});assert.equal(range.status,206);assert.equal(await range.text(),'2345')
 const head=await fetch(base+'/movie.mp4',{method:'HEAD'});assert.equal(head.headers.get('content-length'),'10');assert.equal(await head.text(),'')
 assert.equal((await fetch(base+'/.env')).status,404)
 assert.equal((await fetch(base+'/api/nope')).status,404)
 assert.deepEqual(await (await fetch(base+'/healthz')).json(),{status:'ok'})
})

test('rack price changes only at three racks and combines different colours',async t=>{
 const {post,received}=await fixture(t)
 for (const [quantity,unit] of [[1,1850],[2,1850],[3,1750]]) {
   assert.equal((await post({...order,items:[{id:8,color:'Black',quantity}],expected_total_cents:(quantity*unit+400)*100})).status,201)
 }
 const mixed=[{id:8,color:'White',quantity:1},{id:8,color:'Black',quantity:1},{id:8,color:'Gray',quantity:1}]
 assert.equal((await post({...order,items:mixed,expected_total_cents:565000})).status,201)
 assert.equal(received.at(-1).body.quantity,3)
 for(const color of ['White','Black','Gray'])assert.ok(received.at(-1).body.product.includes('— '+color))
 assert.equal((await post({...order,payment:'bank',items:mixed,expected_total_cents:525000})).status,201)
 assert.equal(received.at(-1).body.total_cents,525000)
})
test('rack colour, combined stock limits and discount tampering are validated server-side',async t=>{
 const {post,received}=await fixture(t)
 assert.equal((await post({...order,items:[{id:8,quantity:1}],expected_total_cents:225000})).status,400)
 assert.equal((await post({...order,items:[{id:8,color:'Red',quantity:1}],expected_total_cents:225000})).status,400)
 assert.equal((await post({...order,items:[{id:8,color:'Black',quantity:2}],expected_total_cents:390000})).status,409)
 assert.equal((await post({...order,items:[{id:8,color:'Black',quantity:99},{id:8,color:'White',quantity:1}],expected_total_cents:17540000})).status,400)
 assert.equal(received.length,0)
})

test('all sold-out drones are refused before any OMS submission',async t=>{
 const {post,received}=await fixture(t)
 for (const id of [1,2,3,4,5])assert.equal((await post({...order,items:[{id,quantity:1}]})).status,400)
 assert.equal(received.length,0)
})

test('anonymous analytics bridge keeps token private and strips additional fields',async t=>{
 const {post,received}=await fixture(t)
 const event={visitor:'12345678-1234-1234-1234-123456789012',event:null,page:'/products',device:'mobile',source:'direct',phone:'must-not-forward'}
 assert.equal((await post(event,'https://other.test','/api/visit')).status,403)
 assert.equal(received.length,0)
 assert.equal((await post(event,'https://store.test','/api/visit')).status,204)
 assert.equal(received[0].path,'/api/website/visit')
 assert.equal(received[0].headers.authorization,'Bearer test-only-key')
 assert.equal(received[0].body.phone,undefined)
})

// New catalog items use the same private OMS checkout bridge as existing stock.
test('electronics, filament and mixed rack order keep authoritative totals', async t => {
 const {post,received}=await fixture(t)
 const items=[{id:1001,quantity:2},{id:1009,quantity:1},{id:8,color:'Black',quantity:3}]
 assert.equal((await post({...order,items,expected_total_cents:1365000})).status,201)
 assert.equal(received[0].body.total_cents,1365000)
 assert.match(received[0].body.product,/ESP32 Development Board/)
 assert.match(received[0].body.product,/eSUN PLA/)
 assert.match(received[0].body.product,/Black/)
 assert.equal((await post({...order,items,expected_total_cents:1})).status,409)
 assert.equal(received.length,1)
})

test('new Mochi, skeleton and model rack products keep confirmed prices through checkout', async t => {
 const {post,received}=await fixture(t)
 const items=[1021,1022,1023,1024].map(id=>({id,quantity:1}))
 assert.equal((await post({...order,items,expected_total_cents:945000})).status,201)
 assert.equal(received[0].body.total_cents,945000)
 assert.match(received[0].body.product,/Mochi Companion Robot/)
 assert.match(received[0].body.product,/Skeleton Figure Pack/)
 assert.match(received[0].body.product,/1:32 Model Car Display Rack/)
 assert.equal((await post({...order,items,expected_total_cents:1})).status,409)
 assert.equal(received.length,1)
})

test('new crawler prices remain authoritative through checkout',async t=>{
 const {post,received}=await fixture(t)
 const response=await post({...order,items:[{id:1025,quantity:1},{id:1026,quantity:1}],expected_total_cents:1470000})
 assert.equal(response.status,201)
 assert.equal(received[0].body.total_cents,1470000)
})
