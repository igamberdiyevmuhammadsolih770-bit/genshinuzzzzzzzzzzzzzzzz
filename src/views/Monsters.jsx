import { useState } from 'react'
import Modal from '../components/Modal.jsx'
import { MONSTERS, MONSTER_IMAGES, MOB_TIPS } from '../data/monsters.js'

// Har bir monster uchun element rangi (portret bezagi uchun)
const MOB_COLOR = {
  hilichurl: '#c98a4b', mitachurl: '#c98a4b', lawachurl: '#7fb3d5',
  slime: '#7ee787', ruin_guard: '#9aa7b5', ruin_grader: '#9aa7b5',
  abyss_mage: '#ff7b7b', fatui: '#b879ff', whopperflower: '#ff9dd1',
  regisvine: '#ff6b3d', hypostasis: '#b879ff', boreas: '#8fdcff',
  dvalin: '#6fe3c9', childe: '#39b7ff', azhdaha: '#f2c14e', scaramouche: '#d3a8ff',
  ruin_hunter: '#9aa7b5', geovishap: '#f2c14e', cicin_mage: '#b879ff',
  mirror_maiden: '#39b7ff', eremite: '#c98a4b', oceanid: '#39b7ff',
  maguu_kenki: '#8fdcff', golden_wolflord: '#d3a8ff',
}

export default function Monsters() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('Hammasi')
  const [sel, setSel] = useState(null)

  const query = q.trim().toLowerCase()
  const list = MONSTERS.filter(m => {
    const isBoss = m.hp.toLowerCase().includes('boss')
    return (type === 'Hammasi' || (type === 'Bosslar' ? isBoss : !isBoss)) &&
      [m.name, m.element, m.region].some(value => value.toLowerCase().includes(query))
  })

  return (
    <div>
      <h1 className="page-title">👾 Monsterlar (Mobs)</h1>
      <p className="page-sub">Teyvat dushmanlari va bosslari: hudud, element, tushadigan narsalar va jang bo'yicha maslahatlar.</p>

      <div className="toolbar">
        <input className="input" placeholder="Nomi, hududi yoki elementi bo'yicha qidir..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="chips" aria-label="Monster turini tanlang">
          {['Hammasi', 'Oddiy dushmanlar', 'Bosslar'].map(option => (
            <button key={option} className={type === option ? 'chip-btn on' : 'chip-btn'} onClick={() => setType(option)}>
              {option}
            </button>
          ))}
          <span className="catalog-count">{list.length} ta natija</span>
        </div>
      </div>

      <div className="grid-4">
        {list.map((m, i) => (
          <button key={m.id} className="card mob-portrait" style={{ '--mc': MOB_COLOR[m.id] || '#8fb8ff', animationDelay: `${i * 0.05}s` }} onClick={() => setSel(m)}>
            <div className="mp-art">
              <div className="mp-frame" />
              <div className="mp-glow" />
              {MONSTER_IMAGES[m.id] && (
                <img
                  className="mp-image"
                  src={MONSTER_IMAGES[m.id]}
                  alt={m.name}
                  loading="lazy"
                  onError={event => { event.currentTarget.hidden = true }}
                />
              )}
              <div className="mp-emoji">{m.emoji}</div>
              <span className={`hp ${m.hp.includes('Boss') ? 'boss' : ''}`}>❤️ {m.hp}</span>
            </div>
            <div className="mp-body">
              <h3>{m.name}</h3>
              <div className="char-tags">
                <span className="chip ghost">{m.element}</span>
                <span className="chip ghost">🌍 {m.region}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!list.length && <div className="card center"><p>Topilmadi.</p></div>}

      {sel && (
        <Modal onClose={() => setSel(null)} title={sel.name} style={{ '--mc': MOB_COLOR[sel.id] || '#8fb8ff' }}>
            <div className="mp-art big">
              <div className="mp-frame" /><div className="mp-glow" />
              {MONSTER_IMAGES[sel.id] && (
                <img
                  className="mp-image"
                  src={MONSTER_IMAGES[sel.id]}
                  alt={sel.name}
                  onError={event => { event.currentTarget.hidden = true }}
                />
              )}
              <div className="mp-emoji">{sel.emoji}</div>
            </div>
            <h2>{sel.name}</h2>
            <div className="char-tags" style={{ justifyContent: 'center', margin: '10px 0' }}>
              <span className="chip">{sel.element}</span>
              <span className="chip ghost">🌍 {sel.region}</span>
              <span className="chip ghost">❤️ {sel.hp}</span>
            </div>
            <p>{sel.desc}</p>
            <div className="modal-row"><b>💎 Tushadigan:</b> {sel.drops}</div>
            <div className="modal-tip">💡 {sel.tip}</div>
        </Modal>
      )}

      <h2 className="sec-title" style={{ marginTop: 36 }}><span>💡</span> Jang maslahatlari</h2>
      <div className="card"><ul className="tips big">{MOB_TIPS.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
    </div>
  )
}
