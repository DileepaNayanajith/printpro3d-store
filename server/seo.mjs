import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { seoFor, sitemap, ORIGIN } from '../src/lib/seo.ts'
export const catalogPath=fileURLToPath(new URL('../src/data/products.json',import.meta.url))
export const robotsText=`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /login
# Private pages also carry noindex; robots.txt is not access control.
Sitemap: ${ORIGIN}/sitemap.xml
`
export async function loadCatalog(){return JSON.parse(await readFile(catalogPath,'utf8'))}
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
export function seoHead(seo) {
 const meta=(name,value,property=false)=>`<meta ${property?'property':'name'}="${name}" content="${escape(value)}" data-seo>`
 return `<title>${escape(seo.title)}</title>`+meta('description',seo.description)+meta('robots',seo.robots)+`<link rel="canonical" href="${escape(seo.canonical)}">`+Object.entries({'og:title':seo.title,'og:description':seo.description,'og:url':seo.canonical,'og:image':seo.image,'og:type':seo.product?'product':'website','og:site_name':'PRINTPRO3D','og:locale':'en_LK'}).map(([k,v])=>meta(k,v,true)).join('')+meta('twitter:card','summary_large_image')+meta('twitter:title',seo.title)+meta('twitter:description',seo.description)+meta('twitter:image',seo.image)+(seo.schema?`<script id="product-schema" type="application/ld+json">${JSON.stringify(seo.schema).replace(/</g,'\\u003c')}</script>`:'')
}
export function injectHead(html,seo){return html.replace(/<title>.*?<\/title>/s,'').replace('<!--seo-head-->','').replace('</head>',seoHead(seo)+'</head>')}
export {seoFor,sitemap,ORIGIN}
