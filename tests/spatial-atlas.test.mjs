import test from 'node:test'
import assert from 'node:assert/strict'
import {validPoint,readPoint,storePoint,onFloor,nearest} from '../src/data/atlas-position.js'
test('manually saved UID points cannot invent live location or cross-map layers',()=>{
 const cache=new Map();globalThis.localStorage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)}
 assert.equal(readPoint('800000001',[2,7]),null)
 assert(storePoint('800000001',{mapId:2,x:.4,y:.6},[2,7]));const p=readPoint('800000001',[2,7]);assert.equal(p.method,'manual');assert.equal(p.x,.4)
 assert.equal(storePoint('abc',{mapId:2,x:.4,y:.6},[2]),false)
 assert.equal(validPoint({mapId:2,x:1.1,y:.2},[2]),false)
 assert.equal(validPoint({mapId:2,layerId:'fake',x:.5,y:.5},[2],['floor-2-27']),false)
})
test('nearby markers use real map proportions instead of screen pixels',()=>{
 const a=nearest({x:.5,y:.5},[{id:1,x:.6,y:.5},{id:2,x:.5,y:.6}],{crop:{width:100,height:1000}});assert.equal(a[0].id,1);assert(Math.abs(a[0].distance-10)<1e-8)
})
test('official underground bounds project world positions and enforce floor membership',()=>{
 const f={bounds:{l_x:-3396.0196,l_y:1649,r_x:-3033.477,r_y:1958.06},pointIds:[29089]}
 const a=onFloor([{id:29089,worldX:-3184.75,worldY:1748.25},{id:1,worldX:-3184.75,worldY:1748.25}],f);assert.equal(a.length,1);assert(Math.abs(a[0].x-.582744)<1e-5);assert(Math.abs(a[0].y-.321135)<1e-5)
})
