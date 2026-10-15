export const MEASUREMENT_ID='G-7ZX443RS8G'
export type Line={id:number;quantity:number;price:number;color?:string}
export type Product={id:number;sku:string;title:string;category:string;price:number;colors?:string[]|null}
export function ecommerce(lines:Line[],catalog:Product[]) {
  const items=lines.flatMap(line=>{
    const p=catalog.find(p=>p.id===line.id)
    if(!p || !Number.isInteger(line.quantity) || line.quantity<1 || line.quantity>99 || !Number.isFinite(line.price) || line.price<0)return []
    return [{item_id:p.sku,item_name:p.title,item_category:p.category,price:line.price,quantity:line.quantity,...(line.color && p.colors?.includes(line.color)?{item_variant:line.color}:{})}]
  })
  return {currency:'LKR',value:Math.round(items.reduce((n,i)=>n+i.price*i.quantity,0)*100)/100,items}
}
export function safePage(path:string,catalog:Product[]) {
  if(['/','/products','/about','/terms','/warranty','/privacy','/compare','/contact','/custom-print','/cart','/checkout','/wishlist'].includes(path))return path
  return catalog.some(p=>path===`/products/${p.id}`)?path:null
}
export function safeLocation(input:string,path:string) {
  const url=new URL('https://printpro3d.lk'+path), original=new URL(input)
  // Only controlled campaign labels, never arbitrary URL/query/hash values.
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
    const value=original.searchParams.get(key)
    if(value && /^[a-zA-Z0-9 _-]{1,80}$/.test(value) && !/\d{7}/.test(value))url.searchParams.set(key,value)
  }
  return url.href
}
export function safeSearch(input:string,catalog:Product[]) {
  // Free text can contain names or contact details. Report only a matched catalogue SKU.
  const q=input.trim().toLowerCase()
  if(!q || q.includes('@') || /\d{7}/.test(q))return 'other'
  return catalog.find(p=>q===p.sku.toLowerCase() || q===p.title.toLowerCase())?.sku || 'other'
}
export function confirmedOrder(order:{order_reference?:unknown;status?:unknown;payment?:unknown;payment_verified?:unknown}) {
  return typeof order.order_reference==='string' && /^PP3D-\d+$/.test(order.order_reference) && ['awaiting_booking','booked','packed','dispatched','delivered'].includes(String(order.status)) && (order.payment==='cod' || order.payment==='bank' && order.payment_verified===true)
}
export function claimPurchase(storage:Pick<Storage,'getItem'|'setItem'>,transaction:string) {
  if(!/^PP3D-\d+$/.test(transaction))return false
  try {const sent=JSON.parse(storage.getItem('pp3d-ga-purchases')||'[]'); if(!Array.isArray(sent)||sent.includes(transaction))return false;storage.setItem('pp3d-ga-purchases',JSON.stringify([...sent,transaction]));return true}catch{return false}
}
