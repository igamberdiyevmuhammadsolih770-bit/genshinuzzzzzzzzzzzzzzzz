import { GAME_INFO, FAQ, TIMELINE } from '../data/info.js'

export default function About() {
  return (
    <div>
      <h1 className="page-title">🎮 O'yin haqida</h1>
      <p className="page-sub">Genshin Impact qachon chiqdi, nima va kim tomonidan qilingan — barcha ma'lumot.</p>

      <div className="card">
        <h3>📋 Asosiy ma'lumotlar</h3>
        <div className="info-rows">
          {GAME_INFO.map(g => (
            <div className="row" key={g.label}><span>{g.label}</span><b>{g.value}</b></div>
          ))}
        </div>
      </div>

      <h2 className="sec-title" style={{ marginTop: 36 }}><span>⏳</span> Tarixiy yo'nalish</h2>
      <div className="timeline">
        {TIMELINE.map((t, i) => (
          <div className="tl-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="tl-year">{t.year}</div>
            <div className="tl-dot" />
            <div className="tl-text card">{t.text}</div>
          </div>
        ))}
      </div>

      <h2 className="sec-title" style={{ marginTop: 36 }}><span>❓</span> Ko'p beriladigan savollar</h2>
      <div className="list">
        {FAQ.map((f, i) => (
          <details key={i} className="card faq" style={{ animationDelay: `${i * 0.06}s` }}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
