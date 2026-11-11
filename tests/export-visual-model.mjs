import fs from 'node:fs/promises'
import * as T from 'three'
import {loadShippedModel} from './load-shipped-model.mjs'
import {createArmMotion} from '../src/components/three/armMotion.js'
const output=process.argv[2]||'/tmp/genshin-rig-qa';await fs.mkdir(output,{recursive:true})
for(const [label,amount,pose] of [['idle',0,'present'],['e',1,'judge'],['q',1,'burst']]){
 const {root}=await loadShippedModel('public/models/10000087.glb');let box=new T.Box3().setFromObject(root);root.scale.setScalar(2.7/box.getSize(new T.Vector3()).y);box.setFromObject(root);const center=box.getCenter(new T.Vector3());root.position.set(-center.x,-box.min.y,-center.z);root.updateMatrixWorld(true);const rig=createArmMotion(T,root,{rig:'original-pmx'});rig.pose(amount,pose,0,.5);root.updateMatrixWorld(true);const meshes=[]
 root.traverse(mesh=>{if(!mesh.isMesh)return;const geometry=mesh.geometry,p=geometry.attributes.position,uv=geometry.attributes.uv,buffer=new Float32Array(p.count*5),v=new T.Vector3();for(let i=0;i<p.count;i++){mesh.getVertexPosition(i,v).applyMatrix4(mesh.matrixWorld);buffer.set([v.x,v.y,v.z,uv?.getX(i)||0,uv?.getY(i)||0],i*5)}const index=geometry.index?Uint32Array.from(geometry.index.array):Uint32Array.from({length:p.count},(_,i)=>i),mat=mesh.userData.sourceMaterial;meshes.push({buffer,index,mat})})
 const meta=[]
 for(let i=0;i<meshes.length;i++){const m=meshes[i],prefix=label+'-'+i;await fs.writeFile(output+'/'+prefix+'.bin',new Uint8Array(m.buffer.buffer));await fs.writeFile(output+'/'+prefix+'.idx',new Uint8Array(m.index.buffer));const texture=m.mat?.getBaseColorTexture()?.getImage();if(texture)await fs.writeFile(output+'/'+prefix+'.webp',texture);meta.push({prefix,textured:!!texture,color:m.mat?.getBaseColorFactor()||[1,1,1,1],cutoff:m.mat?.getAlphaMode()==='MASK'?m.mat.getAlphaCutoff():0})}
 await fs.writeFile(output+'/'+label+'.json',JSON.stringify(meta));console.log(label,meta.length)
}
