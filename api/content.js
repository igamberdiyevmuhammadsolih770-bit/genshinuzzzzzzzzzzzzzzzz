import fs from 'node:fs/promises'
import {CONTENT_TTL} from '../server/content.mjs'
// Scheduled workflow persists data; page visits never trigger billable AI calls.
export default async function handler(req,res){
 if(req.method!=='GET'){res.statusCode=405;return res.end()}
 res.setHeader('Content-Type','application/json; charset=utf-8')
 res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=600')
 try{
  const data=JSON.parse(await fs.readFile(new URL('../public/catalog/live-content.json',import.meta.url),'utf8'))
  const stale=!Number.isFinite(Date.parse(data.updatedAt))||Date.now()-Date.parse(data.updatedAt)>CONTENT_TTL
  res.end(JSON.stringify({...data,stale,...(stale?{noticeUz:'Kunlik tekshiruvdan yangi natija kelmadi. Oxirgi saqlangan xabarlar ko‘rsatilmoqda.'}:{})}))
 }catch{res.statusCode=503;res.end(JSON.stringify({error:'Yangiliklar hozir mavjud emas.'}))}
}
