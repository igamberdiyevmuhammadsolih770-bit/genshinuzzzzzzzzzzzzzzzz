import { useState } from 'react'
import { Link } from 'react-router-dom'
import {useModels} from '../components/ModelGallery.jsx'
import { CHARACTERS, ELEMENTS, WEAPONS, CHARACTER_CATALOG_SCOPE } from '../data/characters.js'

export default function Characters() {
  const {data:models}=useModels()
  const [el, setEl] = useState('Hammasi')
  const [q, setQ] = useState('')

  const list = CHARACTERS.filter(c =>
    (el === 'Hammasi' || c.element === el) &&
    c.name.toLowerCase().includes(q.trim().toLowerCase())
  )

  return (
    <div>
      <h1 className="page-title">⚔️ Personajlar</h1>
      <p className="page-sub">Katalogdagi barcha personajlar: rasmiga bosib, qobiliyatlari, tug‘ilgan kuni va jamoasi bilan tanishing.</p>
      <p className="catalog-count">{list.length} / {CHARACTERS.length} ta personaj · to‘liq katalog{models&&' · '+Object.values(models.models||{}).filter(m=>m.url).length+' ta 3D model'}</p>

      <div className="toolbar">
        <input className="input" placeholder="Personaj qidir..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="chips">
          <button className={el === 'Hammasi' ? 'chip-btn on' : 'chip-btn'} onClick={() => setEl('Hammasi')}>Hammasi</button>
          {Object.entries(ELEMENTS).map(([k, v]) => (
            <button key={k} className={el === k ? 'chip-btn on' : 'chip-btn'} style={el === k ? { background: v.color + '33', borderColor: v.color } : {}} onClick={() => setEl(k)}>
              {v.sym} {v.uz}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-4 chars">
        {list.map((c, i) => {
          const e = ELEMENTS[c.element] || ELEMENTS['Bir nechta']
          return (
            <article key={c.id} className="char-card" style={{ '--ec': e.color, animationDelay: `${(i % 12) * 0.05}s` }}><Link className="char-main-link" to={`/personajlar/${c.id}`}>
              <div className="char-art">
                {c.img && <img className="char-img" src={c.img} alt={c.name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} />}
                <div className="char-glow" />
                <div className="char-sym">{e.sym}</div>
                <div className="char-name-ghost">{c.name[0]}</div>
                <div className="rarity">{'★'.repeat(c.rarity)}</div>
              </div>
              <div className="char-body">
                <h3>{c.name}</h3>
                <div className="char-tags">
                  <span className="chip" style={{ background: e.color + '22', color: e.color }}>{e.uz}</span>
                  <span className="chip ghost">{WEAPONS[c.weapon]}</span>
                </div>
                <p className="char-region">{c.region}</p>
              </div>
            </Link>{models?.models?.[String(c.gameId)]?.url?<Link className="char-3d-link" to={`/personajlar/${c.id}?korinish=3d`}>3D modelni ko‘rish ↗</Link>:<span className="char-3d-missing">{models?'3D model hali yo‘q':'Model tekshirilmoqda…'}</span>}</article>
          )
        })}
      </div>

      <p className="archive-scope">7.1 ma’lumotlar to‘plami. {CHARACTER_CATALOG_SCOPE}</p>
      {!list.length && <div className="card center"><p>Hech narsa topilmadi.</p><button className="btn" onClick={()=>{setEl('Hammasi');setQ('')}}>Filtrlarni tozalash</button></div>}
    </div>
  )
}
