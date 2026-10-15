import type { IncomingMessage } from 'node:http'
// Keep existing deployment configuration; accept only the two owner-controlled production origins.
const productionOrigins=new Set(['https://printpro3d.lk','https://printpro3d-store-production.up.railway.app'])
export function allowedOrigin(req:IncomingMessage, env:Record<string,string>) {
 const configured=env.PUBLIC_URL || `http://${req.headers.host}`
 return req.headers.origin===configured || (productionOrigins.has(configured) && req.headers.origin==='https://printpro3d.lk')
}
