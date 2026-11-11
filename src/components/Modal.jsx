import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
export default function Modal({ children, onClose, title, style }) {
  const ref = useRef(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    const animation=dialog.animate?.([{opacity:0,transform:'translateY(26px) scale(.94)'},{opacity:1,transform:'translateY(-3px) scale(1.008)',offset:.8},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:460,easing:'cubic-bezier(.2,.75,.25,1)'})
    return () => { animation?.cancel(); dialog.close(); document.body.style.overflow = overflow; previous?.focus?.() }
  }, [])
  return createPortal(<dialog ref={ref} className="creature-dialog" style={style} aria-label={title} onCancel={e=>{e.preventDefault();close.current()}} onClick={e=>{if(e.target===e.currentTarget)close.current()}}>
    <div className="creature-dialog-content"><button className="modal-x" aria-label="Oynani yopish" onClick={onClose}>✕</button>{children}</div>
  </dialog>, document.body)
}
