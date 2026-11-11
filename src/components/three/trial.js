import {createArmMotion} from './armMotion.js'
import {getSkillProfile} from './skillProfiles.js'
import {createSkillEffect} from './skillEffects.js'
export function createTrial(T,scene,object,camera,controls,color,clips=[],character={},model={}){
 const actor=new T.Group();scene.remove(object);actor.add(object);scene.add(actor)
 const keys=new Set(),effects=[],cooldowns={e:0,q:0},skills=getSkillProfile(character),arms=createArmMotion(T,object,{rig:model.rig})
 let elapsed=0,gesture=null,disposed=false
 const mixer=clips.length?new T.AnimationMixer(object):null
 const idle=clips.find(c=>/idle|stand/i.test(c.name));if(idle)mixer.clipAction(idle).play()
 const floor=new T.Mesh(new T.CircleGeometry(5.5,96),new T.MeshStandardMaterial({color:0x122d33,transparent:true,opacity:.65,roughness:.85}));floor.rotation.x=-Math.PI/2;floor.position.y=-.09;scene.add(floor);
 const halo=new T.Mesh(new T.RingGeometry(5.2,5.26,96),new T.MeshBasicMaterial({color,side:T.DoubleSide,transparent:true,opacity:.5}));halo.rotation.x=-Math.PI/2;halo.position.y=-.07;scene.add(halo);
 // Three-dimensional scenic arena; the scenery video remains behind the WebGL canvas.
 const stone=new T.MeshStandardMaterial({color:0x22444e,roughness:.9,metalness:.15}),inlay=new T.MeshBasicMaterial({color,transparent:true,opacity:.55})
 for(let i=0;i<8;i++){const angle=i*Math.PI/4,plinth=new T.Group(),column=new T.Mesh(new T.CylinderGeometry(.14,.2,1.6,6),stone),cap=new T.Mesh(new T.OctahedronGeometry(.2),inlay);column.position.y=.65;cap.position.y=1.65;plinth.add(column,cap);plinth.position.set(Math.sin(angle)*4.8,0,Math.cos(angle)*4.8);if(plinth.position.z<1.5)scene.add(plinth)}
 for(let i=0;i<3;i++){const ring=new T.Mesh(new T.RingGeometry(1.5+i*.8,1.515+i*.8,96),new T.MeshBasicMaterial({color,side:T.DoubleSide,transparent:true,opacity:.14}));ring.rotation.x=-Math.PI/2;ring.position.y=-.075;scene.add(ring)}
 const count=90,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*20;positions[i*3+1]=Math.random()*7;positions[i*3+2]=(Math.random()-.5)*16}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));const dust=new T.Points(geometry,new T.PointsMaterial({color,size:.035,transparent:true,opacity:.7,depthWrite:false}));scene.add(dust);

 function cast(key){
  const skill=skills?.[key];if(disposed||!skill||cooldowns[key]>0)return false
  cooldowns[key]=skill.cooldown;gesture={age:0,life:Math.min(skill.duration,2),pose:skill.pose,name:skill.name}
  const effect=createSkillEffect(T,skill.kind,color,key==='q');scene.add(effect.group);effects.push({effect,age:0,life:skill.duration});return true
 }
 return{keys,cast,cooldowns,skills,rigged:arms.affected,authenticRig:arms.authentic,get active(){return gesture?.name||''},
 reset(){keys.clear();actor.position.set(0,0,0);gesture=null;arms.reset()},
 update(dt){elapsed+=dt;mixer?.update(dt);for(const key of ['e','q'])cooldowns[key]=Math.max(0,cooldowns[key]-dt)
  let amount=0,progress=0;if(gesture){gesture.age+=dt;progress=Math.min(1,gesture.age/gesture.life);amount=Math.sin(progress*Math.PI);if(progress===1)gesture=null}
  arms.pose(amount,gesture?.pose||'present',elapsed,progress);actor.position.y=Math.sin(elapsed*1.6)*.005
  if(gesture?.pose==='lift')actor.position.y+=Math.sin(progress*Math.PI)*.35
  dust.rotation.y=elapsed*.025
  for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.age+=dt;if(f.age>=f.life){scene.remove(f.effect.group);f.effect.dispose();effects.splice(i,1)}else f.effect.update(f.age,f.life)}
 },dispose(){disposed=true;arms.reset();keys.clear();for(const f of effects){scene.remove(f.effect.group);f.effect.dispose()}effects.length=0;mixer?.stopAllAction();if(mixer)mixer.uncacheRoot(object)}}
}
