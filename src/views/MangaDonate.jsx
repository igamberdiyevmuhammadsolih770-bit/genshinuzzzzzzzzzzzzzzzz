import { useEffect, useRef, useState } from 'react'

const groups = [
  ['💎 Kristallar', [['60 + 60', '12 000'], ['300 + 300', '48 000'], ['980 + 980', '145 000'], ['1980 + 1980', '255 000'], ['3240 + 3240', '390 000'], ['6480 + 6480', '780 000']]],
  ['🌙 Luna', [['1 ta Luna', '48 500'], ['2 ta Luna', '97 000'], ['3 ta Luna', '145 500']]],
  ['🔥 Jang dovoni', [['BP', '88 000']]],
]
const adminUrl = 'https://t.me/b_muhammadali'
const proofUrl = 'https://t.me/b_Muhammadali_odzif'

function TelegramIcon() {
  return <img className="donate-telegram-icon" src="/donate/telegram.svg" width="24" height="24" alt="" />
}

export function Donate() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const dialog = useRef(null)

  useEffect(() => {
    if (selectedPackage && !dialog.current.open) dialog.current.showModal()
  }, [selectedPackage])

  return <section className="container teyvat-donate">
    <style>{`
      .teyvat-donate { display: grid; gap: 1.75rem; }
      .donate-banner { padding: 0; overflow: hidden; background: radial-gradient(ellipse at top right,#284b71,transparent 70%),#122b3a; }
      .donate-banner-copy { padding: clamp(1.25rem, 4vw, 2.5rem); }
      .donate-banner h1 { margin-top: 0; }
      .donate-banner p { margin-bottom: 0; }
      .donate-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,225px),1fr)); gap: 1rem; }
      .donate-tile { font: inherit; text-align: start; cursor: pointer; display: flex; flex-direction: column; padding: 0; overflow: hidden; border-radius: 20px; background: #122e3d; color: #f3faff; text-decoration: none; animation: donate-enter .5s both; transition: translate .22s ease-out,scale .16s ease-out,box-shadow .25s,border-color .25s; }
      .donate-tile:nth-child(2n) { animation-delay: .08s; }
      .donate-tile:hover,.donate-tile:focus-visible { border-color: #8cd7f3; box-shadow: 0 8px 28px #54caff33; color: #fff; }
      .donate-tile:active { scale: .96; }
      .donate-art { position: relative; display: grid; place-items: center; height: 150px; overflow: hidden; background: radial-gradient(ellipse at center,#d4f2ff,#6989aa); }
      .donate-art img { width: 112px; height: 112px; object-fit: contain; filter: drop-shadow(0 9px 10px #163c6066); transition: transform .3s ease; }
      .donate-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(110deg,transparent 30%,#ffffff66 50%,transparent 70%); transform: translateX(-110%); pointer-events: none; }
      @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
        .donate-tile:hover { translate: 0 -5px; }
        .donate-tile:hover .donate-art img { transform: scale(1.09); }
        .donate-tile:hover .donate-art::after { animation: donate-shine .65s ease-out; }
      }
      @keyframes donate-shine { to { transform: translateX(110%); } }
      .donate-art .donate-luna { width: 100%; height: 100%; object-fit: cover; }
      .donate-pass { font-size: 4rem; color: #ffe5a2; text-shadow: 0 2px 15px #594327; }
      .donate-details { padding: 1rem; display: grid; gap: .5rem; flex: 1; }
      .donate-details > strong { font-size: 1.1rem; }
      .donate-price { color: #ffe0a4; font-weight: 700; font-size: 1.25rem; }
      .donate-contact { display: flex; align-items: center; gap: .6rem; margin-top: .25rem; padding: .65rem; border-radius: 12px; background: #254d64; color: #edfaff; font-size: .9rem; }
      .donate-telegram-icon { width: 24px; height: 24px; flex: 0 0 24px; }
      .donate-proof { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
      .donate-proof h2,.donate-proof p { margin: 0; }
      .donate-proof a { margin: 0; text-decoration: none; }
      .donate-dialog { width: min(420px,calc(100% - 2rem)); max-height: calc(100dvh - 2rem); margin: auto; padding: clamp(1rem,5vw,1.75rem); box-sizing: border-box; color: #f3faff; background: #122e3d; border: 1px solid #8cd7f388; border-radius: 22px; }
      .donate-dialog[open] { animation: donate-dialog-enter .34s cubic-bezier(.2,.75,.25,1) both; }
      .donate-dialog::backdrop { background: #040e19bf; backdrop-filter: blur(5px); }
      .donate-video { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: contain; background: #07131d; }
      .donate-dialog h2 { margin: 0 0 .75rem; }
      .donate-dialog p { margin: 0 0 1rem; }
      .donate-dialog-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .65rem; }
      .donate-dialog-actions a { text-decoration: none; margin: 0; }
      .donate-dialog-actions a:hover,.donate-dialog-actions a:focus-visible { background: #326782; }
      @keyframes donate-dialog-enter { from { opacity: 0; transform: translateY(22px) scale(.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes donate-enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @media (max-width: 560px) { .donate-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: .65rem; } .donate-art { height: 110px; } .donate-art img { width: 82px; height: 82px; } .donate-details { padding: .7rem; } .donate-contact { font-size: .8rem; padding: .55rem; } }
      @media (prefers-reduced-motion: reduce) { .donate-tile,.donate-art img,.donate-dialog[open] { animation: none; transition: none; } .donate-tile:active { scale: 1; } }
    `}</style>
    <header className="card donate-banner">
      <video className="donate-video" src="/donate/intro.mp4"
        autoPlay muted playsInline controls aria-label="Donat kirish videosi" />
      <div className="donate-banner-copy">
        <h1>✦ Teyvat donati</h1>
        <p>1 580 000 so‘mlik xarid uchun 1 ta Luna sovg‘a.</p>
      </div>
    </header>
    {groups.map(([title, items]) => <section key={title}>
      <h2>{title}</h2>
      <div className="donate-grid">{items.map(([name, price]) =>
        <button type="button" className="card donate-tile" key={name} aria-haspopup="dialog"
          onClick={() => setSelectedPackage({name, price})}>
          <span className="donate-art" aria-hidden="true">
            {title.includes('Kristal') ? <img src="/donate/crystal.webp" alt="" /> :
              title.includes('Luna') ? <img className="donate-luna" src="/donate/luna.jpg" alt="" /> :
              <span className="donate-pass">✦</span>}
          </span>
          <span className="donate-details">
            <strong>{name}</strong>
            <span className="donate-price">{price} so‘m</span>
          </span>
        </button>
      )}</div>
    </section>)}
    <dialog ref={dialog} className="donate-dialog" aria-labelledby="donate-dialog-title"
      onClose={() => setSelectedPackage(null)}>
      <h2 id="donate-dialog-title">Donat qilishni xohlaysizmi?</h2>
      {selectedPackage && <p>{selectedPackage.name} · <strong className="donate-price">{selectedPackage.price} so‘m</strong></p>}
      <div className="donate-dialog-actions">
        <a className="donate-contact" href={adminUrl} target="_blank" rel="noopener noreferrer">
          <TelegramIcon /> Admin bilan bog‘lanish ↗
        </a>
        <form method="dialog"><button className="btn" autoFocus>Yopish</button></form>
      </div>
    </dialog>
    <section className="card donate-proof">
      <div><h2>Xarid isbotlari</h2><p>@b_Muhammadali_odzif</p></div>
      <a className="donate-contact" href={proofUrl} target="_blank" rel="noopener noreferrer"><TelegramIcon /> Isbotlarni ko‘rish ↗</a>
    </section>
  </section>
}
