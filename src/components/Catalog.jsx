import {useEffect,useMemo,useState} from 'react'
import Modal from './Modal.jsx'
import categoryArt from '../data/resource-category-art.json'
const catalogCache=new Map()
const TYPES={Sword:'Qilich',Claymore:'Katta qilich',Polearm:'Nayza',Bow:'Yoy',Catalyst:'Katalizator'}
export function useCatalog(path,key='items') {
  const [data,setData]=useState([]),[meta,setMeta]=useState({}),[error,setError]=useState(''),[loading,setLoading]=useState(true),[retry,setRetry]=useState(0)
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setError('')
    const cached=catalogCache.get(path);if(cached&&retry===0){setData(cached[key]);setMeta(cached.metadata||{});setLoading(false);return()=>controller.abort()}
    fetch(path,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(!Array.isArray(d[key]))throw Error();catalogCache.set(path,d);setData(d[key]);setMeta(d.metadata||{})}).catch(e=>{if(e.name!=='AbortError')setError('Katalogni yuklab bo‘lmadi. Qayta urinib ko‘ring.')}).finally(()=>{if(!controller.signal.aborted)setLoading(false)})
    return()=>controller.abort()
  },[path,key,retry])
  return {data,meta,error,loading,reload:()=>setRetry(v=>v+1)}
}
export function Pagination({page,pages,setPage}) { return pages>1&&<div className="archive-pagination"><button className="btn ghost" disabled={page<=1} onClick={()=>setPage(page-1)}>← Oldingi</button><span>{page} / {pages}</span><button className="btn ghost" disabled={page>=pages} onClick={()=>setPage(page+1)}>Keyingi →</button></div> }
export function CatalogState({loading,error,reload}) {return loading?<div className="archive-state" role="status">✦ Katalog yuklanmoqda…</div>:error?<div className="archive-state" role="alert"><p>{error}</p><button className="btn" onClick={reload}>Qayta yuklash</button></div>:null}
function Artwork({item}) {
 const [failed,setFailed]=useState(false)
 useEffect(()=>setFailed(false),[item.id,item.image])
 const illustrative=!item.image||failed,src=illustrative?categoryArt[item.category]:item.image
 return <div className="archive-art">{!src&&<span className="art-fallback" aria-hidden="true">◇</span>}{src?<img src={src} alt={illustrative?'Turkum tasviri: '+item.category:item.name} loading="lazy" decoding="async" onError={e=>{if(illustrative)e.currentTarget.hidden=true;else setFailed(true)}}/>:<small className="art-unavailable">Tasvir mavjud emas</small>}{illustrative&&src&&<small className="category-art-label">Turkum tasviri</small>}</div>
}
export default function Catalog({kind}) {
  const weapon=kind==='weapons'
  const {data,meta,error,loading,reload}=useCatalog('/catalog/'+kind+'.json'+(weapon?'':'?lang=uz-1'))
  const [query,setQuery]=useState(''),[category,setCategory]=useState('Hammasi'),[rarity,setRarity]=useState('Hammasi'),[page,setPage]=useState(1),[selected,setSelected]=useState(null),[refinement,setRefinement]=useState(1)
  const categories=useMemo(()=>Array.from(new Set(data.map(i=>i.category))).sort(),[data])
  const filtered=useMemo(()=>data.filter(i=>(category==='Hammasi'||i.category===category)&&(rarity==='Hammasi'||Number(i.rarity)===Number(rarity))&&[i.name,i.originalName,i.category,TYPES[i.category],i.summary,i.originalType].filter(Boolean).join(' ').toLowerCase().replace(/[‘’ʻʼ']/g,'').includes(query.trim().toLowerCase().replace(/[‘’ʻʼ']/g,''))),[data,query,category,rarity])
  useEffect(()=>setPage(1),[query,category,rarity])
  const pages=Math.ceil(filtered.length/24),current=Math.min(page,Math.max(1,pages))
  return <div className="archive">
    <header className="archive-heading"><span className="catalog-count">SAYOHATCHI KUTUBXONASI / {weapon?'QUROLLAR':'RESURSLAR'}</span><h1>{weapon?'Har bir jangning o‘z quroli bor.':'Sayohat uchun kerak bo‘lgan hamma narsa.'}</h1><p>{weapon?'Qilichdan yoygacha — qurol turlari, boshlang‘ich ko‘rsatkichlar, doimiy qobiliyatlar va rivojlantirish materiallari.':'Materiallar, taomlar va artefakt to‘plamlari. Kerakli buyumni toping va tafsilotlarini oching.'}</p><div className="archive-stats"><span><b>{data.length||'—'}</b> yozuv</span><span><b>{categories.length||'—'}</b> turkum</span><small>Ma’lumotlar to‘plami · 7.1</small></div></header>
    <div className="archive-filters"><label>Qidirish<input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder={weapon?'Qurol nomi yoki turi…':'Buyum yoki turkum…'}/></label><label>Turkum<select value={category} onChange={e=>setCategory(e.target.value)}><option>Hammasi</option>{categories.map(c=><option key={c} value={c}>{TYPES[c]||c}</option>)}</select></label><label>Noyoblik<select value={rarity} onChange={e=>setRarity(e.target.value)}><option>Hammasi</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} yulduz</option>)}</select></label></div>
    <CatalogState {...{loading,error,reload}}/>
    {!loading&&!error&&<><div className="archive-results"><span>{filtered.length} ta natija</span><small>{weapon?'Barcha qurol ma’lumotlari o‘zbekchalashtirilgan.':'Barcha resurslar o‘zbekcha · Asl nomi bilan ham qidirish mumkin.'}</small></div><div className="archive-grid">{filtered.slice((current-1)*24,current*24).map(i=><button key={i.id} className="archive-card" onClick={()=>{setSelected(i);setRefinement(1)}} style={{'--item-color':i.rarity>=5?'#e7c47c':i.rarity===4?'#baa2ed':'#88c9c4'}}><Artwork item={i}/><div className="archive-card-text"><span className="archive-type">{TYPES[i.category]||i.category}</span><h3>{i.name}</h3><span className="archive-stars">{Number(i.rarity)>0?'★'.repeat(Math.min(5,i.rarity)):'◇'}</span><span className="archive-open">Tafsilotlar ↗</span></div></button>)}</div>{!filtered.length&&<p className="archive-state">Topilmadi. Qidiruv yoki filtrlarni o‘zgartiring.</p>}<Pagination page={current} pages={pages} setPage={setPage}/></>}
    {selected&&<Modal title={selected.name} onClose={()=>setSelected(null)}><Artwork item={selected}/><span className="archive-type">{TYPES[selected.category]||selected.category}</span><h2>{selected.name}</h2><span className="archive-stars">{'★'.repeat(Math.min(5,Number(selected.rarity)||0))}</span>{selected.summary&&<p>{selected.summary}</p>}
      {selected.stats&&<div className="item-stat-grid"><div><small>1-darajadagi hujum kuchi</small><b>{Number(selected.stats.baseATK).toFixed(1)}</b></div><div><small>{selected.stats.substat||'Qo‘shimcha stat yo‘q'}</small><b>{selected.stats.baseSubstat||'—'}</b></div></div>}
      {weapon&&selected.effects?.length>0&&<section className="item-detail-section"><h3>{selected.effectName||'Doimiy qobiliyat'}</h3><div className="refinement-tabs">{selected.effects.map(e=><button key={e.refinement} className={e.refinement===refinement?'on':''} onClick={()=>setRefinement(e.refinement)}>{e.refinement}-sayqal</button>)}</div><p>{selected.effects.find(e=>e.refinement===refinement)?.description}</p></section>}
      {!weapon&&selected.type&&<p className="muted">{selected.type}</p>}
      {selected.effect&&<section className="item-detail-section"><h3>Taom ta’siri</h3><p>{typeof selected.effect==='string'?selected.effect:JSON.stringify(selected.effect)}</p></section>}
      {!weapon&&selected.effects&&<section className="item-detail-section"><h3>To‘plam bonuslari</h3>{Object.entries(selected.effects).filter(([,t])=>Boolean(t)).map(([n,t])=><p key={n}><b>{n} dona:</b> {t}</p>)}</section>}
      {selected.sources?.length>0&&<section className="item-detail-section"><h3>Olish joylari</h3><ul>{selected.sources.filter(s=>!s.includes('Placeholder')).map(s=><li key={s}>{s}</li>)}</ul></section>}
      {selected.ingredients?.length>0&&<section className="item-detail-section"><h3>Masalliqlar</h3><ul>{selected.ingredients.map((v,n)=><li key={n}>{v.name} × {v.count}</li>)}</ul></section>}
      {weapon&&selected.ascension&&<details className="item-detail-section"><summary>Rivojlantirish materiallari</summary>{Object.entries(selected.ascension).map(([n,items],index)=><div key={n}><h4>{index+1}-bosqich</h4><ul>{items.map((v,j)=><li key={j}>{v.name} × {v.count}</li>)}</ul></div>)}</details>}
      {selected.pieces?.length>0&&<section className="item-detail-section"><h3>To‘plam qismlari</h3><ul>{selected.pieces.map((v,n)=><li key={n}>{typeof v==='string'?v:v.name}</li>)}</ul></section>}
      <details className="item-detail-section"><summary>{weapon?'Qurol tavsifi':'Buyum tavsifi'}</summary><p>{selected.description||'Tavsif mavjud emas.'}</p></details><a className="item-source" href={selected.source||meta.source} target="_blank" rel="noreferrer">Ma’lumot manbasi ↗</a>
    </Modal>}
    <p className="archive-scope">{weapon?'O‘yin ma’lumotlari 7.1 · O‘zbekcha qurollar katalogi':meta.snapshot}. {meta.scope} O‘yin tasvirlari © HoYoverse.</p>
  </div>
}
