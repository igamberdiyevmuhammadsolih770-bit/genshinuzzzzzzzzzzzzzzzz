import {useEffect,useRef,useState} from 'react'
import usePointerParallax from './usePointerParallax.js'
export default function Scenery({enabled,home}) {
  const video=useRef(null),animations=useRef([])
  const [videoFailed,setVideoFailed]=useState(false)
  const [videoAllowed]=useState(()=>typeof navigator==='undefined'||!(navigator.connection?.saveData||['slow-2g','2g'].includes(navigator.connection?.effectiveType)))
  const scene=usePointerParallax(enabled)
  // This portal explicitly offers motion. Native animations cannot be cancelled
  // by the legacy CSS reduced-motion reset; the site owns this explicitly requested automatic motion.
  useEffect(()=>{
    const root=scene.current;if(!root)return
    const specs=[
      ['.world-pan',[{transform:'scale(1.07) translate3d(-3%,-1%,0)'},{transform:'scale(1.2) translate3d(3%,1.5%,0)'}],16000],
      ['.world-clouds',[{transform:'translate3d(-14%,-5%,0)',opacity:.15},{transform:'translate3d(15%,7%,0)',opacity:.38}],22000],
      ['.world-sunlight',[{transform:'rotate(-5deg)',opacity:.3},{transform:'rotate(10deg)',opacity:.8}],14000]
    ]
    animations.current=specs.map(([selector,frames,duration])=>root.querySelector(selector).animate(frames,{duration,iterations:Infinity,direction:'alternate',easing:'ease-in-out'}))
    return()=>{animations.current.forEach(a=>a.cancel());animations.current=[]}
  },[])
  useEffect(()=>{
    const sync=()=>{
      const run=enabled&&!document.hidden
      animations.current.forEach(a=>run?a.play():a.pause())
      if(video.current){if(run)video.current.play().catch(()=>setVideoFailed(true));else video.current.pause()}
    }
    sync();document.addEventListener('visibilitychange',sync)
    return()=>document.removeEventListener('visibilitychange',sync)
  },[enabled,videoFailed])
  return <>
    <div ref={scene} className="world-background living-world motion-requested" aria-hidden="true">
      <div className="world-camera"><div className="world-pan"><img src="/scenery/teyvat.webp" alt=""/>{enabled&&videoAllowed&&!videoFailed&&<video ref={video} src="/scenery/teyvat.mp4" poster="/scenery/teyvat.webp" muted autoPlay playsInline loop preload="auto" onError={()=>setVideoFailed(true)}/>}</div></div>
      <div className="world-clouds"/><div className="world-sunlight"/>
      <div className={'world-tint '+(home?'home-tint':'')}/>
      <div className="ambient-motes">{Array.from({length:14},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
    </div>

  </>
}
