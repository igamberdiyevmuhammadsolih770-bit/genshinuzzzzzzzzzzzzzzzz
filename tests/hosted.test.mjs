import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../worker/index.js'
test('hosted reader reports stale data and writer rejects conflicting updates',async()=>{
 const data={updatedAt:'2020-01-01T00:00:00Z',news:[],codes:[]},env={BUCKET:{get:async()=>({json:async()=>data})}}
 const response=await worker.fetch(new Request('https://site.test/api/content'),env);assert.equal(response.status,200);assert.equal((await response.json()).stale,true)
 const write=await worker.fetch(new Request('https://site.test/api/admin/content',{method:'POST',body:JSON.stringify({expectedUpdatedAt:'wrong'})}),env);assert.equal(write.status,409)
 const method=await worker.fetch(new Request('https://site.test/api/admin/content'),env);assert.equal(method.status,405)
})
