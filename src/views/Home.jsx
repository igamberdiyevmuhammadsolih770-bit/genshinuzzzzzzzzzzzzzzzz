import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CHARACTERS } from '../data/characters.js'
import { REGIONS } from '../data/map.js'
import catalogStats from '../data/catalog-stats.json'

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t) }, [])

  return (
    <div className="home">
      {/* ——— KIRISH ANIMATION (splash) ——— */}
      <section className={`hero ${loaded ? 'in' : ''}`}>
        <div className="hero-badge">✦ Teyvatga xush kelibsiz ✦</div>
        <h1 className="hero-title">
          <span className="w1">GENSHIN</span>
          <span className="w2">UZ</span>
        </h1>
        <p className="hero-sub">Shamol ortidan yangi hikoyalar sari.<br />Personajlar, xaritalar va jang sirlari — o‘zbek tilida.</p>

        <div className="hero-btns">
          <Link className="btn big glow" to="/personajlar">Personajlarni ko'rish</Link>
          <Link className="btn big ghost" to="/profil">UID bilan profilni ko'rish</Link>
        </div>

        <div className="hero-stats">
          <div className="stat"><b>{REGIONS.length}</b><span>Hudud</span></div>
          <div className="stat"><b>{CHARACTERS.length}</b><span>Personaj</span></div>
          <div className="stat"><b>{catalogStats.quests}</b><span>Missiya</span></div>
          <div className="stat"><b>2020</b><span>Chiqqan yil</span></div>
        </div>
      </section>

      {/* ——— KIYOSI KARTALAR ——— */}
      <section className="catalog-quicklinks"><Link to="/qurollar"><span>01 / ARSENAL</span><b>{catalogStats.weapons}</b><p>Qurol · besh turkum ↗</p></Link><Link to="/resurslar"><span>02 / XAZINA</span><b>{catalogStats.resources}</b><p>Material, taom va artefakt ↗</p></Link><Link to="/missiyalar"><span>03 / HIKOYALAR</span><b>{catalogStats.quests}</b><p>Arxivdagi missiyalar ↗</p></Link></section>
      <section className="section">
        <h2 className="sec-title">Teyvatni kashf eting</h2>
        <div className="feature-grid">
          {[
            { to: '/personajlar', image: '/chars/Furina.png', art: 'portrait', t: 'Personajlar', d: 'Personaj qobiliyatlari, tug‘ilgan kuni va tavsiya etiladigan jamoalar.' },
            { to: '/xarita', image: '/maps/teyvat.webp', art: 'landscape map-art', t: 'Teyvat xaritasi', d: 'Teyvat atlasi, hududlar va rasmiy interaktiv xaritaga yo‘l.' },
            { to: '/mobs', image: '/mobs/dvalin.webp', art: 'creature', t: 'Monsterlar', d: 'Boss va dushmanlar, tushadigan narsalar va yengish usullari.' },
            { to: '/promo', image: '/catalog-images/resources/material-223.webp', art: 'item', t: 'Promo kodlar', d: 'Promo kodlar, mukofotlar va ularni faollashtirish yo‘li.' },
            { to: '/missiyalar', image: '/entry/desk.934fe301.jpg', art: 'landscape', t: 'Missiyalar', d: 'Arxont, hikoya va jahon missiyalari — qanday o\'tash bo\'yicha maslahatlar.' },
            { to: '/resurslar', image: '/catalog-images/resources/material-201.webp', art: 'item', t: 'Resurslar', d: 'Ibtido toshi, Mora, artefaktlar va barcha resurslar haqida ma’lumot.' },
            { to: '/videolar', image: '/scenery/teyvat.webp', art: 'landscape', t: 'Videolar', d: 'O\'zbek youtuberlarning Genshin videolari bir joyda.' },
            { to: '/profil', image: '/chars/Zhongli.png', art: 'portrait', t: 'ID bilan profil', d: 'UID yozing — AR darajang, profil rasmi va personajlaringiz.' },
          ].map((c, i) => (
            <Link to={c.to} key={c.t} className="card feat picture-feature" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={"feature-art "+c.art}><img src={c.image} alt="" loading="lazy"/><span className="feature-index">0{i+1}</span></div>
              <div className="feature-copy"><h3>{c.t}</h3><p>{c.d}</p><span className="feature-bottom">Kashf etish <b>↗</b></span></div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— XARITADA HUDUDLAR ——— */}
      <section className="section">
        <h2 className="sec-title"><span>🗺️</span> Teyvat hududlari</h2>
        <div className="region-grid">
          {[
            { n: 'Mondstadt', e: 'Anemo', c: '#6fe3c9', d: 'Erkinlik shahri — boshlanish nuqtasi.' },
            { n: 'Liyue', e: 'Geo', c: '#f2c14e', d: 'Savdo, tog‘lar va qadimiy shartnomalar yurti.' },
            { n: 'Inazuma', e: 'Electro', c: '#b879ff', d: 'Beklik orollari — Raiden Shogun.' },
            { n: 'Sumeru', e: 'Dendro', c: '#a4d94a', d: 'Ilmlar akademiyasi va o\'simliklar.' },
            { n: 'Fontaine', e: 'Hydro', c: '#39b7ff', d: 'Sud va suv osti dunyosi.' },
            { n: 'Natlan', e: 'Pyro', c: '#ff6b3d', d: 'Olov va ajdodlar vatani.' },
          ].map((r,i) => (
            <Link to={'/xarita?hudud='+['mondstadt','liyue','inazuma','sumeru','fontaine','natlan'][i]} className="region card" key={r.n} style={{ '--rc': r.c }}>
              <div className="region-top"><span className="region-number">0{i+1} / TEYVAT</span><span className="region-sigil">◇</span></div>
              <h3>{r.n}</h3>
              <span className="chip" style={{ background: r.c + '22', color: r.c }}>{r.e}</span>
              <p>{r.d}</p><span className="region-explore">Hududni kashf etish ↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— CALL TO ACTION ——— */}
      <section className="cta-banner card">
        <div>
          <h2>Sayohatchingiz bilan tanishing</h2>
          <p>UID orqali ochiq profil, namoyishdagi personajlar va jihozlarni ko‘ring.</p>
        </div>
        <Link className="btn big glow" to="/profil">UID profilingni ko'rish</Link>
      </section>
    </div>
  )
}
