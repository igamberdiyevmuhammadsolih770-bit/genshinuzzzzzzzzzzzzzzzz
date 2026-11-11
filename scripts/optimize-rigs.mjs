import fs from 'node:fs/promises'
import {NodeIO} from '@gltf-transform/core'
import {ALL_EXTENSIONS} from '@gltf-transform/extensions'
import {dedup,weld,meshopt} from '@gltf-transform/functions'
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer'
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready])
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder})
const catalog=JSON.parse(await fs.readFile('public/models/catalog.json','utf8'))
let before=0,after=0,count=0
for(const [id,model] of Object.entries(catalog.models)){
 if(model.rig!=='original-pmx'||model.meshopt)continue
 const path='public/models/'+id+'.glb',bytes=await fs.readFile(path),document=await io.readBinary(bytes)
 await document.transform(dedup(),weld(),meshopt({encoder:MeshoptEncoder,level:'medium',quantizePosition:14,quantizeNormal:10,quantizeTexcoord:12,quantizeWeight:12}))
 const out=await io.writeBinary(document);await fs.writeFile(path,out);model.bytes=out.length;model.meshopt=true;before+=bytes.length;after+=out.length;count++
 if(count%20===0)console.log(JSON.stringify({models:count,before,after}))
}
catalog.metadata.originalRigs=Object.values(catalog.models).filter(m=>m.rig==='original-pmx').length
catalog.metadata.noteUz='Personajlar GLB formatida. Asl skeleti mavjud modellar original skin og‘irliklari bilan saqlangan. Q/E sahna effektlari maxsus yaratilgan, o‘yin animatsiya fayllari emas.'
catalog.metadata.totalBytes=Object.values(catalog.models).reduce((n,m)=>n+m.bytes,0)
await fs.writeFile('public/models/catalog.json',JSON.stringify(catalog))
console.log(JSON.stringify({optimized:count,before,after,totalBytes:catalog.metadata.totalBytes}))
