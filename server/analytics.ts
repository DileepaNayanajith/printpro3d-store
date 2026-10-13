import type { Connect } from 'vite'

// Only this server knows the OMS bridge token. Analytics failures never block checkout.
export function analyticsMiddleware(env: Record<string,string>): Connect.NextHandleFunction {
  const limits=new Map<string,{since:number;count:number}>()
  return async(req,res,next)=>{
    if(req.url?.split('?')[0]!=='/api/visit')return next()
    const reply=(status:number)=>{res.statusCode=status;res.setHeader('Cache-Control','no-store');res.end()}
    if(req.method!=='POST')return reply(405)
    if(req.headers.origin!==(env.PUBLIC_URL||`http://${req.headers.host}`))return reply(403)
    if(!env.OMS_URL||!env.OMS_WEBSITE_TOKEN)return reply(204)
    try {
      let raw=''
      for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>2048)return reply(413)}
      const data=JSON.parse(raw)
      if(!data||typeof data.visitor!=='string'||!/^[a-f0-9-]{36}$/.test(data.visitor))return reply(400)
      const now=Date.now()
      if(limits.size>10000)for(const [key,value] of limits){if(now-value.since>=60000)limits.delete(key)}
      let limit=limits.get(data.visitor)
      if(!limit||now-limit.since>=60000){limit={since:now,count:0};if(limits.size>=20000&&!limits.has(data.visitor))return reply(429);limits.set(data.visitor,limit)}
      if(++limit.count>30)return reply(429)
      const response=await fetch(new URL('/api/website/visit',env.OMS_URL),{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(3000),
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.OMS_WEBSITE_TOKEN}`},
        body:JSON.stringify({visitor:data.visitor,event:data.event??null,page:data.page,device:data.device,source:data.source})
      })
      return reply(response.status===400?400:204)
    }catch{return reply(204)}
  }
}
