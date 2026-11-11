import { VIDEOS, CREATORS } from '../data/videos.js'

const searchUrl = (v) => `https://www.youtube.com/results?search_query=${encodeURIComponent('genshin ' + v.title)}`

export default function Videos() {
  return (
    <div>
      <h1 className="page-title">🎬 Videolar</h1>
      <p className="page-sub">O'zbek youtuberlarning Genshin Impact videolari. Havolalar YouTube'da ochiladi.</p>

      <div className="grid-3">
        {VIDEOS.map((v, i) => (
          <a key={v.id} href={searchUrl(v)} target="_blank" rel="noreferrer" className="card video" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="video-thumb">
              <img src={v.image} alt="" loading="lazy" />
              <span className="video-title-overlay">{v.title}</span>
              <span className="play">▶</span>
              <div className="video-glow" />
            </div>
            <h3>{v.title}</h3>
            <p className="muted">{v.desc}</p>
            <div className="video-meta">
              <span className="chip ghost">👤 {v.creator}</span>
              <span className="yt">YouTube'da ochish →</span>
            </div>
          </a>
        ))}
      </div>

      <h2 className="sec-title" style={{ marginTop: 40 }}><span>📡</span> O'zbek kanallar</h2>
      <div className="grid-3">
        {CREATORS.map(c => (
          <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="card creator">
            <h3>▶ {c.name}</h3>
            <p>{c.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
