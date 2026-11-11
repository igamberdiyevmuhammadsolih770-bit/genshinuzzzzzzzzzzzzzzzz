import {NodeIO} from '@gltf-transform/core'
import {ALL_EXTENSIONS} from '@gltf-transform/extensions'
import {MeshoptDecoder} from 'meshoptimizer'
import * as T from 'three'
await MeshoptDecoder.ready
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder})
const values=accessor=>{const size=accessor.getElementSize(),array=new Float32Array(accessor.getCount()*size),v=[];for(let i=0;i<accessor.getCount();i++){accessor.getElement(i,v);array.set(v,i*size)}return array}
export async function loadShippedModel(path){
 const document=await io.read(path),nodes=document.getRoot().listNodes(),joints=new Set(document.getRoot().listSkins().flatMap(s=>s.listJoints())),refs=new Map(nodes.map(n=>[n,joints.has(n)?new T.Bone():new T.Group()])),root=new T.Group()
 for(const n of nodes){const o=refs.get(n);o.name=n.getName();o.applyMatrix4(new T.Matrix4().fromArray(n.getMatrix()));for(const child of n.listChildren())o.add(refs.get(child))}
 for(const n of document.getRoot().getDefaultScene().listChildren())root.add(refs.get(n));root.updateMatrixWorld(true)
 const skeletons=new Map()
 for(const s of document.getRoot().listSkins()){const inverse=s.getInverseBindMatrices(),array=[];for(let i=0;i<s.listJoints().length;i++)array.push(new T.Matrix4().fromArray(inverse.getElement(i,[])));skeletons.set(s,new T.Skeleton(s.listJoints().map(n=>refs.get(n)),array))}
 for(const n of nodes){if(!n.getMesh())continue;for(const prim of n.getMesh().listPrimitives()){
  const geometry=new T.BufferGeometry();for(const [semantic,name] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv'],['JOINTS_0','skinIndex'],['WEIGHTS_0','skinWeight']]){const a=prim.getAttribute(semantic);if(a)geometry.setAttribute(name,new T.BufferAttribute(semantic==='JOINTS_0'?new Uint16Array(values(a)):values(a),a.getElementSize()))}const indices=prim.getIndices();if(indices)geometry.setIndex(new T.BufferAttribute(indices.getArray(),1))
  const material=new T.MeshBasicMaterial({color:0xffffff}),mesh=n.getSkin()?new T.SkinnedMesh(geometry,material):new T.Mesh(geometry,material);mesh.name=prim.getMaterial()?.getName()||n.getName();mesh.userData.sourceMaterial=prim.getMaterial();refs.get(n).add(mesh);root.updateMatrixWorld(true);if(n.getSkin())mesh.bind(skeletons.get(n.getSkin()),refs.get(n).matrixWorld);mesh.frustumCulled=false
 }}root.updateMatrixWorld(true);return {root,document}
}
