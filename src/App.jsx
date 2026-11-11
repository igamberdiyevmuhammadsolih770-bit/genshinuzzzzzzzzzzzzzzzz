import { Routes, Route, NavLink, Link, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import ThemePicker from './components/ThemePicker.jsx'
import Intro from './components/Intro.jsx'
import Scenery from './components/Scenery.jsx'
import Footer from './components/Footer.jsx'
import Home from './views/Home.jsx'
import Characters from './views/Characters.jsx'
import CharacterDetail from './views/CharacterDetail.jsx'
import News from './views/News.jsx'
import Missions from './views/Missions.jsx'
import Resources from './views/Resources.jsx'
import Videos from './views/Videos.jsx'
import About from './views/About.jsx'
import UIDProfile from './views/UIDProfile.jsx'
import MapPage from './views/MapPage.jsx'
import Promo from './views/Promo.jsx'
import Monsters from './views/Monsters.jsx'
import Weapons from './views/Weapons.jsx'

import { Donate } from './views/MangaDonate.jsx'

const NAV = [
  { to: '/', label: 'Bosh sahifa', end: true },
  { to: '/yangiliklar', label: 'Yangiliklar' },
  { to: '/personajlar', label: 'Personajlar' },
  { to: '/qurollar', label: 'Qurollar' },
  { to: '/xarita', label: 'Xarita' },
  { to: '/missiyalar', label: 'Missiyalar' },
  { to: '/mobs', label: 'Monsterlar' },
  { to: '/resurslar', label: 'Resurslar' },
  { to: '/donat', label: '✦ Donat' },
  { to: '/promo', label: 'Promo' },
  { to: '/videolar', label: 'Videolar' },
  { to: '/malumot', label: 'O\'yin haqida' },
]

export default function App() {
  const { pathname } = useLocation()
  const music=useRef(null)
  const [entering,setEntering]=useState(false),[musicPlaying,setMusicPlaying]=useState(false),[musicError,setMusicError]=useState('')
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(() => { try { return sessionStorage.getItem('gu_entry_v6') === '1' } catch { return false } })

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setOpen(false) }, [pathname])

  const playMusic=()=>{const a=music.current;if(!a)return;a.volume=.28;setMusicError('');a.play().catch(()=>setMusicError('Musiqani yana bosib yoqing.'))}
  const beginEnter=()=>{setEntering(true);let allowed=true;try{allowed=localStorage.getItem('gu_music_enabled')!=='0'}catch{}if(allowed)playMusic()}
  const toggleMusic=()=>{if(!music.current)return;if(musicPlaying){music.current.pause();try{localStorage.setItem('gu_music_enabled','0')}catch{}}else{try{localStorage.setItem('gu_music_enabled','1')}catch{}playMusic()}}
  const doEnter = () => { try { sessionStorage.setItem('gu_entry_v6', '1') } catch {} setEntered(true);setEntering(false) }
  useEffect(() => { const esc = e => { if(e.key === 'Escape') setOpen(false) }; document.addEventListener('keydown',esc); return () => document.removeEventListener('keydown',esc) }, [])

  return (
    <div className="app">
      <audio ref={music} src="/audio/genshin-theme.mp3" loop preload="none" onPlay={()=>setMusicPlaying(true)} onPause={()=>setMusicPlaying(false)} onError={()=>{setMusicPlaying(false);setMusicError("Musiqa yuklanmadi. Qayta urinib ko‘ring.")}}/>
      {!entered && <Intro onEnter={doEnter} onBegin={beginEnter} />}

      <Scenery enabled={entered||entering} home={pathname === '/'} />
      <a href="#main-content" className="skip-link">Asosiy mazmunga o‘tish</a>
      <div className={'site-shell '+(entered?'site-arrived':entering?'site-entering':'site-waiting')} inert={!entered} aria-hidden={!entered ? true : undefined}>
      <header className="nav glass">
        <Link to="/" className="brand">
          <img className="brand-vision" src="/entry/eye.b1681dc3.png" alt=""/>
          <span className="brand-text">Genshin <b>UZ</b></span>
        </Link>

        <div className="nav-actions"><ThemePicker/><button className={"music-control "+(musicPlaying?"is-playing":"")} onClick={toggleMusic} aria-pressed={musicPlaying}><span className="music-bars" aria-hidden="true"><i/><i/><i/><i/></span>{musicPlaying?"Musiqani o‘chirish":"Musiqani yoqish"}</button></div>
        <button className="burger" onClick={() => setOpen(o => !o)} aria-label={open ? "Menyuni yopish" : "Menyuni ochish"} aria-expanded={open} aria-controls="main-navigation">{open ? "✕" : "☰"}</button>

        <nav id="main-navigation" aria-label="Asosiy menyu" className={open ? 'links open' : 'links'}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => isActive ? 'link active' : 'link'}>
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/profil" className={({ isActive }) => isActive ? 'link active cta' : 'link cta'}>ID bilan profil</NavLink>
        </nav>
      </header>

      {musicError&&<div className="music-message" role="status">{musicError}<button aria-label="Yopish" onClick={()=>setMusicError('')}>×</button></div>}
      <main id="main-content" className="page" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personajlar" element={<Characters />} />
          <Route path="/personajlar/:id" element={<CharacterDetail />} />
          <Route path="/qurollar" element={<Weapons />} />
          <Route path="/xarita" element={<MapPage />} />
          <Route path="/yangiliklar" element={<News />} />
          <Route path="/news" element={<Navigate to="/yangiliklar" replace />} />
          <Route path="/missiyalar" element={<Missions />} />
          <Route path="/mobs" element={<Monsters />} />
          <Route path="/resurslar" element={<Resources />} />
          <Route path="/donat" element={<Donate />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/videolar" element={<Videos />} />
          <Route path="/malumot" element={<About />} />
          <Route path="/profil" element={<UIDProfile />} />
          <Route path="/kirish" element={<Navigate to="/profil" replace />} />
          <Route path="*" element={<div className="container"><div className="card center"><h2>404</h2><p>Bu sahifa topilmadi.</p><Link className="btn" to="/">Bosh sahifaga</Link></div></div>} />
        </Routes>
      </main>

      <Footer links={NAV} musicPlaying={musicPlaying} onMusic={toggleMusic} onReplay={()=>{setEntered(false);setEntering(false);setOpen(false)}}/>
      </div>
    </div>
  )
}
