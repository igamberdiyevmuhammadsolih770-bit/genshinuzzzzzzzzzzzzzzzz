import {reviewReceipt} from '../server/donate.mjs'
import {CONTENT_TTL,validateContent} from '../server/content.mjs'
import {handleEnkaRequest} from '../server/enka.js'
const KEY='news/live-content.json'
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}})
async function current(request,env){const saved=await env.BUCKET.get(KEY);if(saved)return saved.json();const url=new URL('/catalog/live-content.json',request.url);const response=await env.ASSETS.fetch(new Request(url));if(!response.ok)throw Error('Saqlangan yangiliklar topilmadi.');return response.json()}
export default {async fetch(request,env){const url=new URL(request.url)
 try{
  if(url.pathname.startsWith('/api/donate/review/'))return reviewReceipt(request,env)
  if(url.pathname==='/api/content'){if(request.method!=='GET')return json({error:'Faqat GET.'},405);const data=await current(request,env),stale=!Number.isFinite(Date.parse(data.updatedAt))||Date.now()-Date.parse(data.updatedAt)>CONTENT_TTL;return json({...data,stale,...(stale?{noticeUz:'Oxirgi kunlik tekshiruv eskirgan. Avvalgi tasdiqlangan xabarlar ko‘rsatilmoqda.'}:{})})}
  // This writer relies on the confirmed owner-private Sites access boundary.
  // Service callers obtain fresh platform access with Sites get_site.
  if(url.pathname==='/api/admin/content'){
   if(request.method!=='POST')return json({error:'Faqat POST.'},405)
   if(Number(request.headers.get('content-length')||0)>100000)return json({error:'So‘rov juda katta.'},413)
   const text=await request.text();if(text.length>100000)return json({error:'So‘rov juda katta.'},413)
   const input=JSON.parse(text),previous=await current(request,env)
   if(input.expectedUpdatedAt!==previous.updatedAt)return json({error:'Ma’lumot yangilangan. Qayta o‘qing.'},409)
   const content=await validateContent(input.content,{now:new Date()})
   // Keep prior verified sections when a daily check finds no replacement.
   if(!content.news.length)content.news=previous.news||[]
   if(!content.codes.length)content.codes=(previous.codes||[]).filter(c=>!c.expiresAt||Date.parse(c.expiresAt)>Date.now())
   content.updateMethod='scheduled-web-search';content.contentLanguage='uz-Latn';content.noteUz='Ochiq manbalardan tekshirilgan yangiliklarni AI o‘zbekcha qisqartirdi. Sana va manba har bir xabarda ko‘rsatilgan.'
   await env.BUCKET.put(KEY,JSON.stringify(content),{httpMetadata:{contentType:'application/json'}})
   return json({updatedAt:content.updatedAt,news:content.news.length,codes:content.codes.length})
  }
  if(url.pathname.startsWith('/api/enka/uid/')){
   let result,status=200,headers={};await handleEnkaRequest({url:request.url,method:request.method,headers:Object.fromEntries(request.headers),socket:{remoteAddress:request.headers.get('cf-connecting-ip')||'unknown'}},{writeHead(s,h){status=s;headers=h},end(body){result=new Response(body,{status,headers})}},()=>{result=json({error:'UID 9 ta raqamdan iborat bo‘lishi kerak.'},400)});return result
  }
  if(url.pathname.startsWith('/api/'))return json({error:'Topilmadi.'},404)
  const response=await env.ASSETS.fetch(request)
  if(response.status===404&&request.method==='GET'&&!url.pathname.split('/').at(-1).includes('.'))return env.ASSETS.fetch(new Request(new URL('/index.html',url)))
  return response
 }catch(error){return json({error:'So‘rov bajarilmadi.',detail:request.method==='POST'?error.message:undefined},request.method==='POST'?400:503)}
}}
