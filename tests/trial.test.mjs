import test from 'node:test'
import assert from 'node:assert/strict'
import * as T from 'three'
import {createTrial} from '../src/components/three/trial.js'
import {getSkillProfile,SKILL_MOTIFS} from '../src/components/three/skillProfiles.js'
import {createSkillEffect} from '../src/components/three/skillEffects.js'
test('Neuvillette E and Q are waterfalls, not a charged-attack beam or identical rings',()=>{const p=getSkillProfile({id:'neuvillette',gameId:10000087});assert.equal(p.e.name,'O Tears, I Shall Repay');assert.equal(p.q.name,'O Tides, I Have Returned');assert.equal(p.e.kind,'waterfall');assert.equal(p.q.kind,'twin-falls');assert.notEqual(p.e.pose,p.q.pose)})
test('Furina and Raiden have distinct character-specific skills',()=>{const f=getSkillProfile({id:'furina',gameId:10000089}),r=getSkillProfile({id:'raiden',gameId:10000052});assert.equal(f.e.kind,'salon');assert.equal(f.q.kind,'fanfare');assert.equal(r.e.kind,'eye');assert.equal(r.q.kind,'lightning-sword')})
test('cooldowns and effect resources are independent and expire cleanly',()=>{const scene=new T.Scene(),root=new T.Group(),t=createTrial(T,scene,root,new T.PerspectiveCamera(),{},'#69caff',[],{id:'neuvillette',gameId:10000087});const n=scene.children.length;assert.equal(t.cast('e'),true);assert.equal(t.cast('e'),false);assert.equal(t.cast('q'),true);assert.equal(scene.children.length,n+2);for(let i=0;i<160;i++)t.update(.05);assert.equal(scene.children.length,n);t.dispose();assert.equal(t.cast('e'),false)})
test('every configured skill motif constructs, animates and disposes without invalid transforms',()=>{const motifs=new Set(Object.values(SKILL_MOTIFS).flatMap(v=>v.slice(0,2)));for(const kind of motifs){const effect=createSkillEffect(T,kind,'#80dbff',true);for(const t of [.1,1,2.5])effect.update(t,4);effect.group.traverse(o=>assert(o.position.toArray().every(Number.isFinite),kind));effect.dispose()}assert(motifs.size>100)})
