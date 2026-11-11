import {useEffect,useRef} from 'react'
// Ease toward the pointer; one animation frame chain per active interaction.
export default function usePointerParallax(active=true) {
  const ref=useRef(null)
  useEffect(()=>{
    const el=ref.current
    if(!active||!el)return
    let frame=0,current={x:0,y:0},target={x:0,y:0}
    const draw=()=>{
      current.x+=(target.x-current.x)*.075;current.y+=(target.y-current.y)*.075
      el.style.setProperty('--mouse-x',current.x.toFixed(3)+'px')
      el.style.setProperty('--mouse-y',current.y.toFixed(3)+'px')
      el.style.setProperty('--mouse-rx',(-current.y*.055).toFixed(3)+'deg')
      el.style.setProperty('--mouse-ry',(current.x*.055).toFixed(3)+'deg')
      if(Math.abs(target.x-current.x)+Math.abs(target.y-current.y)>.03)frame=requestAnimationFrame(draw)
      else frame=0
    }
    const move=e=>{
      if(e.pointerType==='touch')return
      target={x:(e.clientX/innerWidth-.5)*48,y:(e.clientY/innerHeight-.5)*32}
      if(!frame)frame=requestAnimationFrame(draw)
    }
    const reset=()=>{target={x:0,y:0};if(!frame)frame=requestAnimationFrame(draw)}
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',reset);document.documentElement.addEventListener('pointerleave',reset)
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset);document.documentElement.removeEventListener('pointerleave',reset)}
  },[active])
  return ref
}
