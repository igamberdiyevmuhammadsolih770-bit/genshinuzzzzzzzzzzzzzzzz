// Animate only authored skeletons and their original skin weights.
// Static display meshes are never deformed or assigned guessed weights.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
export function createArmMotion(T,object,{rig}={}){
 const arms=[],rest=[],box=new T.Box3().setFromObject(object),center=box.getCenter(new T.Vector3())
 const all=[];object.traverse(b=>{if(b.isBone)all.push(b)})
 const isOriginal=rig==='original-pmx'||rig==='original-native'
 if(isOriginal){for(const prefix of ['左','右']){
  const letter=prefix==='左'?'L':'R',native=rig==='original-native'
  const uppers=native?all.filter(b=>new RegExp('^Bip001_'+letter+'_UpperArm(?:_\\d+)?$').test(b.name)):[all.find(b=>b.name===prefix+'腕'||b.name==='Bip001_'+letter+'_UpperArm'||b.name==='Bip001 '+letter+' UpperArm')].filter(Boolean)
  for(const upper of uppers){const descendants=[];upper.traverse(b=>{if(b.isBone)descendants.push(b)})
   const lower=descendants.find(b=>b.name===prefix+'ひじ'||new RegExp('^Bip001[ _]'+letter+'[ _]Forearm(?:_\\d+)?$').test(b.name)),hand=descendants.find(b=>b.name===prefix+'手首'||new RegExp('^Bip001[ _]'+letter+'[ _]Hand(?:_\\d+)?$').test(b.name));if(!lower)continue
   const side=upper.getWorldPosition(new T.Vector3()).x>=center.x?1:-1,vector=lower.getWorldPosition(new T.Vector3()).sub(upper.getWorldPosition(new T.Vector3())),angle=Math.atan2(vector.y,Math.abs(vector.x)),idle=clamp(side*(-1.1-angle),-.9,.9)
   arms.push({upper,lower,hand,side,idle,isRight:prefix==='右',native});for(const bone of [upper,lower,hand].filter(Boolean))rest.push({bone,quaternion:bone.quaternion.clone()})
  }
 }}
 const q=new T.Quaternion(),euler=new T.Euler()
 function rotate(b,x,y,z,native){if(!b)return;const base=rest.find(v=>v.bone===b);euler.set(x,y,z);q.setFromEuler(euler);if(native){b.parent.updateWorldMatrix(true,false);const parent=b.parent.getWorldQuaternion(new T.Quaternion());q.premultiply(parent.clone().invert()).multiply(parent);b.quaternion.copy(q).multiply(base.quaternion)}else b.quaternion.copy(base.quaternion).multiply(q)}
 function pose(amount,kind='present',time=0,progress=0){
  for(const arm of arms){const s=arm.side,right=arm.isRight,both=['summon','conduct','lift','prayer','burst'].includes(kind),active=both||(kind==='shield'?!right:right),a=active?amount:amount*.08;let lift=.65,bend=.35,yaw=.4
   if(kind==='judge'){lift=.55;bend=.15;yaw=.1}
   if(kind==='slash'){lift=.95;bend=.35;yaw=.7*Math.cos(progress*Math.PI*2)}
   if(kind==='bow'){lift=.8;bend=right?.9:.12;yaw=.25}
   if(kind==='conduct'){lift=1.12;bend=.25;yaw=.3}
   if(kind==='prayer'){lift=.4;bend=.8;yaw=.75}
   if(kind==='camera'){lift=.5;bend=.95;yaw=.45}
   rotate(arm.upper,0,-s*yaw*a,arm.idle+s*lift*a+Math.sin(time*1.6+s)*.009,arm.native)
   rotate(arm.lower,0,-s*bend*a,s*.12*a,arm.native);rotate(arm.hand,a*.12,0,s*a*.05,arm.native)
  }
 }
 return{affected:arms.length,authentic:isOriginal&&arms.length>=2,pose,reset(){for(const r of rest)r.bone.quaternion.copy(r.quaternion)},hands(){object.updateWorldMatrix(true,true);return arms.map(a=>(a.hand||a.lower).getWorldPosition(new T.Vector3()))}}
}
