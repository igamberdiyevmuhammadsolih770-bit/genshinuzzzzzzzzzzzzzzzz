import test from 'node:test'
import assert from 'node:assert/strict'
import * as T from 'three'
import {createArmMotion} from '../src/components/three/armMotion.js'
import {fitAtlasCamera} from '../src/components/three/atlasCamera.js'
import {loadShippedModel} from './load-shipped-model.mjs'
test('Neuvillette uses original skeleton and never rewrites clothing skin weights',async()=>{
 const {root}=await loadShippedModel('public/models/10000087.glb');const original=new Map();root.traverse(m=>{if(m.isSkinnedMesh)original.set(m,m.geometry.attributes.skinWeight.array.slice())});const rig=createArmMotion(T,root,{rig:'original-pmx'});assert.equal(rig.authentic,true);assert.equal(rig.affected,2);rig.pose(0);root.updateMatrixWorld(true);const hand=root.getObjectByName('右手首'),idle=hand.getWorldPosition(new T.Vector3()).clone();rig.pose(1,'judge',0,.5);root.updateMatrixWorld(true);assert(hand.getWorldPosition(new T.Vector3()).distanceTo(idle)>.25);for(const [m,weights] of original)assert.deepEqual(m.geometry.attributes.skinWeight.array,weights);rig.reset()
})
test('unrigged meshes remain byte-for-byte untouched instead of guessed arm deformation',()=>{const root=new T.Group(),g=new T.BoxGeometry(1,2,1),mesh=new T.Mesh(g,new T.MeshBasicMaterial());root.add(mesh);const before=g.attributes.position.array.slice(),r=createArmMotion(T,root);r.pose(1,'burst');assert.equal(r.authentic,false);assert.equal(mesh.geometry,g);assert.deepEqual(g.attributes.position.array,before);assert(!g.attributes.skinWeight)})
test('atlas camera fits every corner on portrait and desktop viewports',()=>{for(const aspect of [.5,1,2]){const fit=fitAtlasCamera(100,85,aspect),camera=new T.PerspectiveCamera(40,aspect,1,800);camera.position.set(fit.x,fit.y,fit.z);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);for(const x of [-50,50])for(const z of [-42.5,42.5]){const v=new T.Vector3(x,0,z).project(camera);assert(Math.abs(v.x)<1&&Math.abs(v.y)<1)}}})
test('Alyosha existing native skeleton remains usable without creating any vertex weights',async()=>{const {root}=await loadShippedModel('public/models/10000148.glb'),rig=createArmMotion(T,root,{rig:'original-native'});assert.equal(rig.authentic,true);assert(rig.affected>=2);rig.pose(1,'bow',0,.5);root.updateMatrixWorld(true);for(const hand of rig.hands())assert(hand.toArray().every(Number.isFinite));rig.reset()})
