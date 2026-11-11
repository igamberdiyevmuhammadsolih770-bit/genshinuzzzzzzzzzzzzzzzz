import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {NodeIO} from '@gltf-transform/core'
import {ALL_EXTENSIONS} from '@gltf-transform/extensions'
import {MeshoptDecoder} from 'meshoptimizer'
test('all authored PMX rigs retain valid joints and normalized original weights after compression',async()=>{
 await MeshoptDecoder.ready;const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder}),catalog=JSON.parse(fs.readFileSync('public/models/catalog.json'));let checked=0
 for(const [id,model] of Object.entries(catalog.models)){if(model.rig!=='original-pmx')continue;const d=await io.read('public/models/'+id+'.glb');assert(d.getRoot().listSkins().length>0,id+' skin');assert(d.getRoot().listNodes().some(n=>n.getName()==='右腕'||n.getName()==='Bip001 R UpperArm'),id+' authored arm');for(const n of d.getRoot().listNodes()){if(!n.getMesh()||!n.getSkin())continue;const count=n.getSkin().listJoints().length;for(const p of n.getMesh().listPrimitives()){const w=p.getAttribute('WEIGHTS_0'),j=p.getAttribute('JOINTS_0');assert(w&&j,id+' weights');for(let i=0;i<w.getCount();i+=Math.max(1,Math.floor(w.getCount()/500))){const weights=w.getElement(i,[]),indices=j.getElement(i,[]);assert(Math.abs(weights.reduce((a,b)=>a+b,0)-1)<.003,id+' normalized');assert(indices.every(v=>v<count),id+' joints')}}}checked++
 }assert(checked>=109)
})
