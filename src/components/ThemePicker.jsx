import {useEffect,useRef,useState} from 'react'
const palettes=[['anemo','Shamol bog‘i','#82dfc8'],['hydro','Moviy to‘lqin','#80c8ff'],['electro','Binafsha tun','#c4a5ff'],['pyro','Oltin shafaq','#ffba85']]
export default function ThemePicker(){
 const [theme,setTheme]=useState('anemo'),[open,setOpen]=useState(false);const ref=useRef(null)
 useEffect(()=>{try{const saved=localStorage.getItem('gu_palette');if(palettes.some(p=>p[0]===saved))setTheme(saved)}catch{}},[])
 useEffect(()=>{document.documentElement.dataset.palette=theme;try{localStorage.setItem('gu_palette',theme)}catch{}},[theme])
 useEffect(()=>{if(!open)return;const outside=e=>{if(!ref.current?.contains(e.target))setOpen(false)},esc=e=>{if(e.key==='Escape'){setOpen(false);ref.current?.querySelector('button')?.focus()}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',esc);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',esc)}},[open])
 return <div className="theme-picker" ref={ref}><button className="theme-trigger" aria-expanded={open} aria-controls="site-palettes" onClick={()=>setOpen(!open)}><i/>Ranglar</button>{open&&<div className="theme-options" id="site-palettes"><strong>Olamingiz rangini tanlang</strong><p>Tanlov shu qurilmada saqlanadi.</p>{palettes.map(([id,name,color])=><button key={id} aria-pressed={theme===id} onClick={()=>setTheme(id)}><i style={{background:color}}/><span>{name}</span><b>{theme===id?'✓':''}</b></button>)}</div>}</div>
}
