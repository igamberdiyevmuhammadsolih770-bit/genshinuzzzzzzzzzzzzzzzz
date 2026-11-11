import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/enka/uid/[uid].js'
const request=(url='/api/enka/uid/800000001',method='GET')=>({url,method,headers:{'x-forwarded-for':'192.0.2.1'},socket:{remoteAddress:'fixture'}})
function response(){return {statusCode:200,headers:{},writeHead(status,headers){this.statusCode=status;this.headers=headers},setHeader(key,value){this.headers[key]=value},end(body){this.body=JSON.parse(body)}}}
test('Vercel function validates paths and methods without contacting an account',async()=>{
 let r=response();await handler(request('/api/enka/uid/not-a-uid'),r);assert.equal(r.statusCode,400)
 r=response();await handler(request(undefined,'POST'),r);assert.equal(r.statusCode,405)
})
test('Vercel adapter returns public fixture, caches it and preserves upstream failure meaning',async()=>{
 const original=globalThis.fetch;let calls=0
 globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({playerInfo:{nickname:'Sinov',level:1},avatarInfoList:[]}),{headers:{'Content-Type':'application/json'}})}
 try{
  let r=response();await handler(request(),r);assert.equal(r.statusCode,200);assert.equal(r.body.playerInfo.nickname,'Sinov');assert.equal(r.headers['Cache-Control'],'no-store')
  r=response();await handler(request(),r);assert.equal(calls,1)
  globalThis.fetch=async()=>new Response('',{status:404});r=response();await handler(request('/api/enka/uid/800000002/'),r);assert.equal(r.statusCode,404)
  globalThis.fetch=async()=>new Response('',{status:429});r=response();await handler(request('/api/enka/uid/800000003'),r);assert.equal(r.statusCode,429)
 }finally{globalThis.fetch=original}
})
