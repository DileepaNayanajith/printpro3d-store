export const ORIGIN = 'https://printpro3d.lk'
export type SeoProduct = { id:number;title:string;sku?:string;price:number;thumbnail:string;category:string;description?:string;features?:string[];images?:string[]|null;stock?:number|null;published?:boolean;deleted?:boolean;updatedAt?:string;lastModified?:string }
export const publicProducts = <T extends SeoProduct>(products:T[]) => products.filter(p=>p.published!==false && !p.deleted && Number.isInteger(p.id) && Number.isFinite(p.price) && !!p.title && !!p.thumbnail)
export const categoryName = (name:string) => ({'development-boards':'Development Boards',sensors:'Sensors',displays:'OLED Displays',robotics:'Robotics & DIY Kits',filament:'3D Printing Filament','display-racks':'Model Car Display Racks','rc-cars':'RC Cars & Trucks',drones:'Camera Drones','3d-printed-models':'3D Printed Models'}[name] || name.replace(/-/g,' '))
const descriptions:Record<number,string> = {
  1: 'A feature-packed camera drone built for smooth flights, stable hovering and exciting aerial views.',
  2: 'A compact camera drone paired with a display remote for a more convenient flying experience.',
  3: 'A lightweight foldable drone that makes aerial fun accessible for beginners and casual pilots.',
  4: 'A portable dual-camera drone with a complete kit, ideal for learning, travel and everyday flying.',
  5: 'A versatile foldable camera drone offering stable control and a travel-friendly design.',
  6: 'A detailed 1:12 scale 4WD Defender-style crawler made for realistic off-road RC adventures.',
  7: 'A rugged Toyota LC79-style RC pickup with off-road character and realistic scale detailing.',
}
export const productDescription = (p:SeoProduct) => p.description || descriptions[p.id] || `${p.title} from PRINTPRO3D Sri Lanka. ${p.features?.join('. ') || 'View product details and current availability.'} Islandwide delivery available.`
export const publicPages:Record<string,{title:string;description:string}> = {
 '/':{title:'PRINTPRO3D | 3D Printing, Electronics & RC Products Sri Lanka',description:'Shop 3D printed products, ESP32, Arduino components, DIY electronics kits, RC cars and drones in Sri Lanka. Custom 3D printing services and islandwide delivery.'},
 '/products':{title:'Shop Electronics, 3D Prints & RC Products | PRINTPRO3D Sri Lanka',description:'Browse ESP32 and Arduino boards, sensors, OLED displays, DIY kits, filament, 3D printed models and RC products. View prices in LKR and order islandwide.'},
 '/custom-print':{title:'Custom 3D Printing Sri Lanka | STL Print Quotes | PRINTPRO3D',description:'Request a custom 3D printing quote in Sri Lanka. Preview your STL model, choose print options and contact PRINTPRO3D through WhatsApp.'},
 '/about':{title:'About PRINTPRO3D | Sri Lankan Electronics & 3D Printing Store',description:'Learn about PRINTPRO3D, a Sri Lankan online store for makers, electronics projects, 3D printing and RC enthusiasts.'},
 '/contact':{title:'Contact PRINTPRO3D | Product & 3D Printing Support Sri Lanka',description:'Contact PRINTPRO3D for product questions, custom 3D printing enquiries and delivery support in Sri Lanka.'},
 '/terms':{title:'Terms & Conditions | PRINTPRO3D Sri Lanka',description:'Read the PRINTPRO3D terms and conditions for product orders, payments and delivery in Sri Lanka.'},
 '/privacy':{title:'Privacy & Cookie Policy | PRINTPRO3D',description:'How PRINTPRO3D handles orders, optional analytics and your cookie choices. Change analytics consent at any time in Privacy settings.'},
 '/warranty':{title:'Warranty & Returns Policy | PRINTPRO3D Sri Lanka',description:'Read PRINTPRO3D warranty and return information before ordering electronics, RC products and 3D printed items.'},
}
export function seoFor(input:string, catalog:SeoProduct[]) {
 const url=new URL(input,ORIGIN), path=url.pathname.replace(/\/$/,'') || '/'
 const products=publicProducts(catalog), categories=[...new Set(products.map(p=>p.category))]
 const productMatch=/^\/products\/(\d+)$/.exec(path)
 const product=productMatch ? products.find(p=>String(p.id)===productMatch[1]) : undefined
 const category=url.searchParams.get('category')
 const privatePage=/^\/(admin|account|login|cart|checkout|success|wishlist|compare)(\/|$)/.test(path)
 const invalidCategory=path==='/products' && category && category!=='all' && !categories.includes(category)
 const status=(!publicPages[path] && !product && !privatePage) || (productMatch && !product) || invalidCategory ? 404 : 200
 let title=publicPages[path]?.title || (privatePage ? `${path.split('/')[1]} | PRINTPRO3D` : 'Page Not Found | PRINTPRO3D')
 let description=publicPages[path]?.description || 'Manage your PRINTPRO3D shopping experience.'
 let canonical=ORIGIN+path, image=ORIGIN+'/products/mochi-box.webp'
 let schema:Record<string,unknown>|null=null
 if(product){
  title=`${product.title} | PRINTPRO3D Sri Lanka`;description=productDescription(product).length>170 ? productDescription(product).slice(0,167).replace(/\s+\S*$/,'')+'…' : productDescription(product);image=new URL(product.thumbnail,ORIGIN).href
  schema={'@context':'https://schema.org','@type':'Product',name:product.title,description:productDescription(product),sku:product.sku,image:[...new Set([product.thumbnail,...(product.images || [])])].map(p=>new URL(p,ORIGIN).href),brand:{'@type':'Brand',name:'PRINTPRO3D'},url:canonical,offers:{'@type':'Offer',url:canonical,priceCurrency:'LKR',price:product.price,availability:`https://schema.org/${product.stock===0?'OutOfStock':'InStock'}`,seller:{'@type':'Organization',name:'PRINTPRO3D'}}}
 }else if(path==='/products' && category && categories.includes(category)){
  title=`${categoryName(category)} Sri Lanka | PRINTPRO3D`;description=`Shop ${categoryName(category).toLowerCase()} at PRINTPRO3D Sri Lanka. Compare current LKR prices, view availability and order with islandwide delivery.`;canonical+=`?category=${encodeURIComponent(category)}`
 }else if(path==='/')schema={'@context':'https://schema.org','@type':'Organization',name:'PRINTPRO3D',url:ORIGIN}
 const search=path==='/products' && [...url.searchParams.keys()].some(k=>k!=='category' && !k.startsWith('utm_'))
 const robots=privatePage || status===404 || search ? 'noindex, follow' : 'index, follow, max-image-preview:large'
 return {title,description,canonical,image,schema,robots,status,product,privatePage}
}
export function sitemap(catalog:SeoProduct[]) {
 const products=publicProducts(catalog)
 const entries=[...Object.keys(publicPages).map(path=>({url:ORIGIN+path,date:undefined as string|undefined})),...[...new Set(products.map(p=>p.category))].map(c=>({url:ORIGIN+'/products?category='+encodeURIComponent(c),date:undefined})),...products.map(p=>({url:ORIGIN+'/products/'+p.id,date:p.lastModified || p.updatedAt}))]
 const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
 return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+entries.map(e=>'<url><loc>'+escape(e.url)+'</loc>'+(e.date && !Number.isNaN(Date.parse(e.date))?'<lastmod>'+new Date(e.date).toISOString()+'</lastmod>':'')+'</url>').join('')+'</urlset>\n'
}
