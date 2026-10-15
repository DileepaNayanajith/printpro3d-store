import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { render } from '../.prerender/entry-prerender.js'
import { loadCatalog, injectHead, seoFor, sitemap } from '../server/seo.mjs'
import { publicPages, publicProducts } from '../src/lib/seo.ts'
const catalog=await loadCatalog(),template=await readFile('dist/index.html','utf8')
const routes=[...Object.keys(publicPages),...publicProducts(catalog).map(p=>'/products/'+p.id),...[...new Set(publicProducts(catalog).map(p=>p.category))].map(c=>'/products?category='+encodeURIComponent(c))]
await mkdir('dist/prerender',{recursive:true})
const manifest={}
for(const [index,url] of [...routes,'/__404'].entries()){
 const body=await render(url)
 const page=injectHead(template.replace('<div id="app"></div>',`<div id="app">${body}</div>`),seoFor(url,catalog))
 const name=`page-${index}.html`;await writeFile('dist/prerender/'+name,page);manifest[url]=name
}
await writeFile('dist/prerender/routes.json',JSON.stringify(manifest,null,2))
await writeFile('dist/sitemap.xml',sitemap(catalog))
console.log(`Pre-rendered ${routes.length} public URLs and the 404 page using the existing Vue components.`)
