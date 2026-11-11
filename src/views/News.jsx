import {useState} from 'react'
import useLiveContent,{localDate} from '../components/useLiveContent.js'
function NewsImage({item}){
 const [failed,setFailed]=useState(false)
 return <div className="news-art"><img src={failed?'/scenery/teyvat.webp':item.image} alt={item.title} loading="lazy" decoding="async" width="900" height="506" onError={()=>setFailed(true)}/><span className="news-image-kind">{failed||item.imageKind==='theme'?'Mavzuli tasvir':'Maqola tasviri'}</span></div>
}
export default function News(){
 const {data,error,loading}=useLiveContent(),[category,setCategory]=useState('Hammasi')
 const news=data?.news||[],categories=['Hammasi',...new Set(news.map(n=>n.category))],items=news.filter(n=>category==='Hammasi'||n.category===category)
 return <div className="archive news-page"><header className="archive-heading news-heading"><span className="catalog-count">TEYVATDAN XABARLAR</span><h1>Yangi kun.<br/><em>Yangi sarguzasht.</em></h1><p>Genshin Impact yangilanishlari, tadbirlar va e’lonlar — manbalari bilan, o‘zbekcha.</p><div className="news-check"><span className="news-live-dot"/><span>Oxirgi tekshiruv: {localDate(data?.updatedAt)}</span></div></header>
 {data?.noticeUz&&<p className="news-notice" role="status">{data.noticeUz}</p>}{error&&<p className="err" role="alert">{error}</p>}
 {loading?<div className="news-skeleton" role="status"><span/><span/><span/><p>So‘nggi xabarlar yuklanmoqda…</p></div>:<><div className="news-tabs" aria-label="Yangilik turi">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="news-grid">{items.map((n,i)=><article className={'news-card '+(i===0?'news-featured':'')} key={n.id}><a href={n.sourceUrl} target="_blank" rel="noreferrer"><NewsImage item={n}/><div className="news-copy"><div className="news-meta"><span>{n.category}</span><time dateTime={n.date}>{localDate(n.date)}</time></div><h2>{n.title}</h2><p>{n.summary}</p><div className="news-card-bottom"><small>{new URL(n.sourceUrl).hostname.replace('www.','')}</small><span>Manbani o‘qish ↗</span></div></div></a></article>)}</div>{!items.length&&<div className="card news-empty"><h2>Yangi xabarlar kutilmoqda</h2><p>Tekshirilgan yangi e’lon topilganda shu yerda paydo bo‘ladi.</p><a className="btn ghost" href="https://genshin.hoyoverse.com/en/news" target="_blank" rel="noreferrer">Rasmiy yangiliklar ↗</a></div>}</>}
 <p className="archive-scope">{data?.noteUz||'Rasmiy va ishonchli ochiq manbalar tekshiriladi. Mish-mishlar yangilik sifatida chiqarilmaydi.'} Yangilanish xizmati ishlamasa, avvalgi ma’lumot saqlanadi.</p>
 </div>
}
