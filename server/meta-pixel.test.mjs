import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import ts from 'typescript'
const catalog=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url)))
const moduleUrl=(file,replacements={})=>{
 let source=readFileSync(new URL(file,import.meta.url),'utf8')
 for(const [from,to]of Object.entries(replacements))source=source.replace(from,to)
 return 'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64')
}
test('Meta opt-in, safe URLs, ecommerce, confirmed purchases, dedupe and withdrawal',async()=>{
 const vue=import.meta.resolve('vue'),core=moduleUrl('../src/lib/ga4-core.ts')
 const consentUrl=moduleUrl('../src/lib/consent.ts',{"from 'vue'":`from '${vue}'`})
 const pixelUrl=moduleUrl('../src/lib/meta-pixel.ts',{"from 'vue'":`from '${vue}'`,"import catalog from '../data/products.json'":`const catalog=${JSON.stringify(catalog)}`,"from './consent'":`from '${consentUrl}'`,"from './ga4-core'":`from '${core}'`,"import.meta.env.VITE_META_PIXEL_ID":"'1020017270659994'"})
 const originals=new Map(['window','document','navigator','location','localStorage','fetch','setInterval'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]))
 const values=new Map(),scripts=[],route={value:{path:'/products/8'}},orders=[],lines=[{id:8,quantity:1,price:1850,fullName:'Private Name',phone:'0771234567'}]
 let hook,fetches=0
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}
 const settle=()=>new Promise(resolve=>setImmediate(resolve))
 try{
  const mocks={window:{},localStorage:storage,navigator:{doNotTrack:'0',locks:{request:async(_name,fn)=>fn()}},location:{hostname:'printpro3d.lk',href:'https://printpro3d.lk/products/8'},document:{cookie:'',hidden:false,head:{append:s=>scripts.push(s)},getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({})},fetch:async()=>{fetches++;return {ok:true,json:async()=>({orders})}},setInterval:()=>0}
  for(const [key,value]of Object.entries(mocks))Object.defineProperty(globalThis,key,{value,configurable:true,writable:true})
  const consent=await import(consentUrl),meta=await import(pixelUrl)
  for(const path of ['/account','/admin','/success','/products/999999','/checkout?email=secret@example.com','/products?q=private','/products#address'])assert.equal(meta.metaSafeLocation('https://printpro3d.lk'+path),false,path)
  assert.equal(meta.metaSafeLocation('https://printpro3d.lk/products/8?utm_source=facebook&fbclid=abc123'),true)
  assert.equal(meta.metaSafeLocation('https://printpro3d.lk/?utm_source=0771234567'),false)
  meta.installMetaPixel({currentRoute:route,afterEach:fn=>hook=fn},()=>lines)
  consent.chooseConsent(true);await settle();assert.equal(scripts.length,0,'existing analytics consent does not grant ads consent')
  meta.metaCart('add_to_cart',lines);assert.equal(window.fbq,undefined)
  consent.chooseConsent(true,true);await settle()
  const events=()=>window.fbq.queue.filter(args=>['track','trackCustom'].includes(args[0]))
  assert.equal(scripts.length,1);assert.equal(events().filter(e=>e[1]==='PageView').length,1)
  assert.equal(events().filter(e=>e[1]==='ViewContent').length,1)
  hook(null,null,null);await settle();assert.equal(events().filter(e=>e[1]==='PageView').length,1)
  meta.metaCart('add_to_cart',lines)
  location.href='https://printpro3d.lk/checkout';route.value.path='/checkout';hook(null,null,null);await settle()
  meta.metaOrderSubmitted('WEB-000123',lines,400);meta.metaOrderSubmitted('WEB-000123',lines,400)
  assert.equal(events().filter(e=>e[1]==='OrderSubmitted').length,1)
  assert.equal(events().filter(e=>e[1]==='Purchase').length,0,'submission is not purchase')
  orders.push({reference:'WEB-000123',order_reference:'PP3D-000123',status:'awaiting_confirmation',payment:'cod',total_cents:225000})
  hook(null,null,null);await settle();assert.equal(events().filter(e=>e[1]==='Purchase').length,0)
  orders[0].status='booked';orders[0].payment='bank';orders[0].payment_verified=false
  hook(null,null,null);await settle();assert.equal(events().filter(e=>e[1]==='Purchase').length,0)
  orders[0].payment='cod';orders[0].total_cents=1
  hook(null,null,null);await settle();assert.equal(events().filter(e=>e[1]==='Purchase').length,0)
  orders[0].total_cents=225000
  location.href='https://printpro3d.lk/account?token=secret';route.value.path='/account'
  const count=events().length;hook(null,null,null);await settle();assert.equal(events().length,count,'no private-page calls')
  location.href='https://printpro3d.lk/products';route.value.path='/products';hook(null,null,null);await settle()
  hook(null,null,null);await settle()
  const purchases=events().filter(e=>e[1]==='Purchase');assert.equal(purchases.length,1)
  assert.equal(purchases[0][2].value,1850);assert.equal(purchases[0][2].currency,'LKR');assert.equal(purchases[0][3].eventID,'purchase-PP3D-000123')
  assert.ok(!JSON.stringify(events()).includes('Private'));assert.ok(!JSON.stringify(events()).includes('0771234567'))
  const before=events().length;consent.chooseConsent(false);meta.metaCart('add_to_cart',lines);assert.equal(events().length,before)
  assert.equal(storage.getItem('pp3d-meta-orders'),null);assert.equal(storage.getItem('pp3d-meta-purchases'),null)
  assert.ok(window.fbq.queue.some(args=>args[0]==='consent'&&args[1]==='revoke'));assert.ok(fetches>0)
  navigator.doNotTrack='1';consent.chooseConsent(true,true);assert.equal(consent.advertisingConsent.value,false)
 }finally{for(const [key,desc]of originals){if(desc)Object.defineProperty(globalThis,key,desc);else delete globalThis[key]}}
})
