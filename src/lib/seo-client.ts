import type { Router } from 'vue-router'
import catalog from '../data/products.json'
import { seoFor } from './seo'
export function installSeo(router:Router) {
 router.afterEach(to=>{
  const seo=seoFor(to.fullPath,catalog)
  document.title=seo.title
  const meta=(name:string,value:string,property=false)=>{const key=property?'property':'name';let el=document.head.querySelector<HTMLMetaElement>(`meta[${key}="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute(key,name);el.dataset.seo='';document.head.append(el)}el.content=value}
  meta('description',seo.description);meta('robots',seo.robots)
  for(const [key,value] of Object.entries({'og:title':seo.title,'og:description':seo.description,'og:url':seo.canonical,'og:image':seo.image,'og:type':seo.product?'product':'website','og:site_name':'PRINTPRO3D','og:locale':'en_LK'}))meta(key,value,true)
  meta('twitter:card','summary_large_image');meta('twitter:title',seo.title);meta('twitter:description',seo.description);meta('twitter:image',seo.image)
  let link=document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.append(link)}link.href=seo.canonical
  document.getElementById('product-schema')?.remove()
  if(seo.schema){const el=document.createElement('script');el.id='product-schema';el.type='application/ld+json';el.textContent=JSON.stringify(seo.schema);document.head.append(el)}
 })
}
