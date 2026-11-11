import { useEffect, useRef, useState } from 'react'
import usePointerParallax from './usePointerParallax.js'
import {ENTRY_OPEN_MS} from './entryTiming.js'
const elements=['pyro','hydro','anemo','electro','dendro','cryo','geo']
export default function Intro({onEnter,onBegin}) {
  const [phase,setPhase]=useState('logo')
  const [ready,setReady]=useState(false)
  const [opening,setOpening]=useState(false)
  const parallax=usePointerParallax(phase==='desk'&&!opening)
  const timers=useRef([]),locked=useRef(false),pendant=useRef(null)
  useEffect(()=>{
    const old=document.body.style.overflow
    document.body.style.overflow='hidden'
    let active=true
    const img=new Image()
    img.onload=()=>{if(active)setReady(true)}
    img.onerror=()=>{if(active)setReady(true)}
    img.src='/entry/desk.934fe301.jpg'
    timers.current.push(setTimeout(()=>setPhase(p=>p==='logo'?'elements':p),1200))
    timers.current.push(setTimeout(()=>setPhase('desk'),2900))
    return()=>{active=false;timers.current.forEach(clearTimeout);document.body.style.overflow=old}
  },[])
  useEffect(()=>{if(phase==='desk')pendant.current?.focus({preventScroll:true})},[phase])
  useEffect(()=>{
    if(!opening||!parallax.current)return
    const root=parallax.current
    const options={duration:ENTRY_OPEN_MS,fill:'forwards',easing:'cubic-bezier(.4,0,.2,1)'}
    const effects=[
      root.animate([{opacity:1,offset:0},{opacity:1,offset:.48},{opacity:0,offset:1}],options),
      root.querySelector('.desk-opening-camera').animate([{transform:'scale(1)'},{transform:'scale(1.08)',offset:.45},{transform:'scale(1.75)'}],options),
      root.querySelector('.pendant-release').animate([{opacity:0,transform:'scale(1)'},{opacity:1,transform:'scale(1.13)',offset:.3},{opacity:1,transform:'scale(1.3) rotate(-5deg)',offset:.65},{opacity:0,transform:'scale(3) rotate(-15deg)'}],options),
      root.querySelector('.ritual-flash').animate([{opacity:0},{opacity:0,offset:.35},{opacity:.7,offset:.72},{opacity:0}],options)
    ]
    return()=>effects.forEach(a=>a.cancel())
  },[opening])
  const enter=()=>{
    if(locked.current)return
    locked.current=true;setOpening(true);onBegin?.()
    timers.current.push(setTimeout(onEnter,ENTRY_OPEN_MS))
  }
  return <div ref={parallax} className={'ritual-entry motion-requested '+(opening?'ritual-opening':'')} role="dialog" aria-modal="true" aria-label="Teyvatga kirish">
    {phase!=='desk'?<div className="ritual-loader">
      {phase==='logo'?<img className="ritual-logo" src="/entry/logo-gray-v2.246eaf58.png" alt="Genshin Impact"/>:<div className="ritual-elements" aria-label="Yetti element">{elements.map((e,i)=><img key={e} src={'/entry/element-'+e+'.png'} alt={e} style={{'--order':i}}/>)}</div>}
      <span className="ritual-loader-label">GENSHIN UZ · SAYOHAT BOSHLANMOQDA</span>
      <button className="ritual-skip" onClick={()=>setPhase('desk')}>Tumorga o‘tish →</button>
    </div>:<div className={'ritual-desk '+(ready?'is-ready':'')}>
      <div className="desk-pointer-layer"><div className="desk-opening-camera"><div className="desk-plane">
        <img className="desk-photo" src="/entry/desk.934fe301.jpg" alt="Quyosh nuridagi stol, ochiq kitob va Anemo tumori" fetchPriority="high"/>
        <span className="desk-sunbeam"/><span className="pendant-aura"/>
        <button ref={pendant} className="pendant-target" onClick={enter} disabled={opening} aria-label="Anemo tumorini bosib saytga kirish"><span className="pendant-hover"/><img src="/entry/eye.b1681dc3.png" className="pendant-release" alt=""/><span className="pendant-arrow" aria-hidden="true">⌄</span></button>
      </div>
      </div></div>
      <div className="desk-vignette"/>
      <div className="desk-dust" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{'--i':i,top:((i*17)%90)+'%'}}/>)}</div>
      <div className="desk-heading"><span>GENSHIN <b>UZ</b></span><small>HAR BIR SAYOHATNING O‘Z HIKOYASI BOR</small></div>
      <div className="desk-caption"><span className="desk-caption-line"/><p>Quyosh nurida yaltiragan kichik tumor.<br/>Uning ichida sizni yangi bir olam kutmoqda.</p><span className="desk-tap">{opening?'Teyvatga yo‘l ochilmoqda…':'Tumorni bosib sayohatni boshlang'}</span></div>
    </div>}
    <div className="ritual-flash"/>
  </div>
}
