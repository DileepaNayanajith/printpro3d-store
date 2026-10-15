import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {ecommerce,safePage,safeLocation,safeSearch,confirmedOrder,claimPurchase,MEASUREMENT_ID} from '../src/lib/ga4-core.ts'
const catalog=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url)))
test('correct GA4 stream and catalogue-only item fields',()=>{
 assert.equal(MEASUREMENT_ID,'G-7ZX443RS8G')
 const p=catalog[0],data=ecommerce([{id:p.id,quantity:2,price:p.price,fullName:'Private Name',phone:'0771234567'}],catalog)
 assert.equal(data.currency,'LKR');assert.equal(data.value,p.price*2);assert.equal(data.items[0].item_id,p.sku)
 assert.ok(!JSON.stringify(data).includes('Private'));assert.ok(!JSON.stringify(data).includes('0771234567'))
 assert.equal(ecommerce([{id:0,quantity:2,price:5},{id:p.id,quantity:-1,price:5}],catalog).items.length,0)
})
test('public page allowlist excludes private, unknown and personal URLs',()=>{
 for(const p of ['/','/products','/products/1021','/cart','/checkout','/privacy'])assert.equal(safePage(p,catalog),p)
 for(const p of ['/admin','/account','/success','/products/999999','/user/private'])assert.equal(safePage(p,catalog),null)
})
test('UTM labels preserved; search, phone, email, tokens and fragments never reach page_location',()=>{
 const url=safeLocation('https://printpro3d.lk/products?q=private@email.com&phone=0771234567&token=secret&utm_source=instagram&utm_medium=organic&utm_campaign=mochi#address','/products')
 assert.equal(url,'https://printpro3d.lk/products?utm_source=instagram&utm_medium=organic&utm_campaign=mochi')
 assert.equal(safeLocation('https://printpro3d.lk/?utm_campaign=0771234567&utm_source=a%40b.com','/'),'https://printpro3d.lk/')
})
test('search never sends raw free text',()=>{
 for(const query of ['private@email.com','0771234567','Jane Private Name','ESP32 Jane'])assert.equal(safeSearch(query,catalog),'other')
 assert.equal(safeSearch(catalog[0].title,catalog),catalog[0].sku)
})
test('purchase requires actual OMS order confirmation; bank payment verified',()=>{
 for(const status of ['received','awaiting_confirmation','cancelled','rejected'])assert.equal(confirmedOrder({order_reference:'PP3D-000123',status,payment:'cod'}),false)
 assert.equal(confirmedOrder({order_reference:'WEB-000123',status:'booked',payment:'cod'}),false)
 assert.equal(confirmedOrder({order_reference:'PP3D-000123',status:'awaiting_booking',payment:'cod'}),true)
 assert.equal(confirmedOrder({order_reference:'PP3D-000123',status:'booked',payment:'bank',payment_verified:false}),false)
 assert.equal(confirmedOrder({order_reference:'PP3D-000123',status:'booked',payment:'bank',payment_verified:true}),true)
})
test('purchase dedupe survives refresh and fails closed if persistence fails',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}
 assert.equal(claimPurchase(storage,'PP3D-000123'),true);assert.equal(claimPurchase(storage,'PP3D-000123'),false)
 assert.equal(claimPurchase({...storage,setItem(){throw Error('blocked')}},'PP3D-000124'),false)
 assert.equal(claimPurchase(storage,'WEB-000123'),false)
})

test('real tracker: opt-in only, one tag and pageview, ecommerce, withdrawal and confirmed purchase',async()=>{
 const ts=await import('typescript')
 const moduleUrl=(file,replacements={})=>{
  let source=readFileSync(new URL(file,import.meta.url),'utf8')
  for(const [from,to]of Object.entries(replacements))source=source.replace(from,to)
  const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
  return 'data:text/javascript;base64,'+Buffer.from(code).toString('base64')
 }
 const vue=import.meta.resolve('vue'),core=moduleUrl('../src/lib/ga4-core.ts'),seo=moduleUrl('../src/lib/seo.ts')
 const consentUrl=moduleUrl('../src/lib/consent.ts',{"from 'vue'":`from '${vue}'`})
 const trackerUrl=moduleUrl('../src/lib/ga4.ts',{"from 'vue'":`from '${vue}'`,"import catalog from '../data/products.json'":`const catalog=${JSON.stringify(catalog)}`,"from './consent'":`from '${consentUrl}'`,"from './ga4-core'":`from '${core}'`,"from './seo'":`from '${seo}'`})
 const originals=new Map(['window','document','navigator','location','localStorage','fetch','setInterval'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]))
 const values=new Map(),scripts=[],listeners={},calls=[],orderResponses=[]
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}
 let reloads=0,hook
 const route={value:{path:'/products/1021'}},lines=[{id:catalog[0].id,quantity:1,price:catalog[0].price}]
 try {
  const mocks={window:{},localStorage:storage,navigator:{doNotTrack:'0',locks:{request:async(_name,fn)=>fn()}},location:{hostname:'printpro3d.lk',href:'https://printpro3d.lk/products/1021?ga_debug=1&q=secret@example.com',search:'?ga_debug=1',reload:()=>reloads++},document:{cookie:'',referrer:'https://www.google.com/search?q=private',hidden:false,head:{append:s=>scripts.push(s)},getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({}),addEventListener:(name,fn)=>listeners[name]=fn},setInterval:()=>0,fetch:async()=>({ok:true,json:async()=>({orders:orderResponses})})}
  for(const [key,value]of Object.entries(mocks))Object.defineProperty(globalThis,key,{value,configurable:true,writable:true})
  const consent=await import(consentUrl),ga=await import(trackerUrl)
  ga.installGa4({currentRoute:route,afterEach:fn=>hook=fn},()=>lines)
  ga.trackCart('add_to_cart',lines);assert.equal(scripts.length,0);assert.equal(window.dataLayer,undefined)
  consent.chooseConsent(true);await new Promise(resolve=>setImmediate(resolve))
  calls.push(...window.dataLayer.map(args=>Array.from(args)))
  const events=()=>window.dataLayer.map(args=>Array.from(args)).filter(args=>args[0]==='event')
  assert.equal(scripts.length,1);assert.ok(scripts[0].src.endsWith(MEASUREMENT_ID));assert.equal(events().filter(e=>e[1]==='page_view').length,1);assert.equal(events().filter(e=>e[1]==='view_item').length,1)
  hook(null,null,null);await new Promise(resolve=>setImmediate(resolve));assert.equal(events().filter(e=>e[1]==='page_view').length,1)
  for(const path of ['/cart','/checkout']){route.value.path=path;hook(null,null,null);await new Promise(resolve=>setImmediate(resolve))}
  ga.trackCart('add_to_cart',lines);ga.trackCart('remove_from_cart',lines);ga.trackShipping(lines);ga.trackShipping(lines);ga.trackSearch('private@email.com');ga.trackWhatsapp('whatsapp_checkout','custom_print')
  ga.recordOrder('WEB-000123',lines,400,'cod');assert.equal(events().filter(e=>e[1]==='purchase').length,0)
  orderResponses.push({reference:'WEB-000123',order_reference:'PP3D-000123',status:'awaiting_booking',payment:'cod',total_cents:(lines[0].price+400)*100})
  hook(null,null,null);await new Promise(resolve=>setImmediate(resolve));hook(null,null,null);await new Promise(resolve=>setImmediate(resolve))
  for(const name of ['view_cart','begin_checkout','add_to_cart','remove_from_cart','add_shipping_info','search','whatsapp_checkout','order_submitted','purchase'])assert.equal(events().filter(e=>e[1]===name).length,1,name)
  assert.ok(!JSON.stringify(events()).includes('secret@example'));assert.ok(!JSON.stringify(events()).includes('private@email'))
  const count=events().length;consent.chooseConsent(false);ga.trackCart('add_to_cart',lines);assert.equal(events().length,count);assert.equal(reloads,1);assert.equal(storage.getItem('pp3d-ga-orders'),null)
 }finally{for(const [key,desc]of originals){if(desc)Object.defineProperty(globalThis,key,desc);else delete globalThis[key]}}
})
