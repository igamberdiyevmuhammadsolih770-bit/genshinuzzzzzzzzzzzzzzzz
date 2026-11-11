import {Link} from 'react-router-dom'
export default function Footer({links,musicPlaying,onMusic,onReplay}){
  return <footer className="footer sanctuary-footer">
    <div className="footer-invitation"><div><span className="footer-eyebrow">SAYOHAT DAVOM ETADI</span><h2>Yangi hikoyangiz<br/><em>Teyvatda boshlanadi.</em></h2></div><Link className="footer-explore" to="/personajlar"><span>Personajlarni kashf etish</span><b>↗</b></Link></div>
    <div className="sanctuary-grid">
      <div className="footer-identity"><Link to="/" className="footer-signature"><img src="/entry/eye.b1681dc3.png" alt=""/><span>GENSHIN<small>O‘ZBEK JAMOASI</small></span></Link><p>Yetti element. Minglab hikoyalar.<br/>O‘zbek sayohatchilari uchun bir olam.</p><button className="footer-replay" onClick={onReplay}>Kirish sahnasini qayta ko‘rish <span>↗</span></button></div>
      <div className="footer-navigation"><span className="footer-eyebrow">TEYVAT BO‘YLAB</span><div>{links.filter(l=>l.to!=='/').map(l=><Link key={l.to} to={l.to}>{l.label}<span>↗</span></Link>)}<Link to="/profil">UID profil<span>↗</span></Link></div></div>
      <aside className="footer-contact"><span className="footer-eyebrow">LOYIHA VA ALOQA</span><h3>Birga yangi<br/>olam yarataylik.</h3><p>Ushbu sayt sotiladi. Loyiha bo‘yicha Telegram orqali bog‘laning.</p><a href="https://t.me/Iego_oI" target="_blank" rel="noreferrer"><span><small>TELEGRAM</small>@Iego_oI</span><b>↗</b></a><button className="footer-sound" onClick={onMusic} aria-pressed={musicPlaying}>{musicPlaying?'Ⅱ Musiqani to‘xtatish':'▷ Genshin musiqasini tinglash'}</button></aside>
    </div>
    <div className="footer-colophon"><span>© 2026 Genshin UZ · Norasmiy fan loyihasi</span><span>O‘yin va tasvirlar © HoYoverse</span><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Yuqoriga qaytish ↑</button></div>
    <div className="footer-watermark" aria-hidden="true">GENSHIN UZ</div>
  </footer>
}
