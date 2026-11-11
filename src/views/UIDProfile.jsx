import { useEffect, useRef, useState } from 'react'
import { profileFromUID } from '../data/profile.js'
import ProfileImage from '../components/ProfileImage.jsx'

export default function UIDProfile() {
  const [uid, setUid] = useState('')
  const [prof, setProf] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const request = useRef(null)

  useEffect(()=>()=>request.current?.abort(),[])
  const search = async (value = uid) => {
    const accountId = value.trim()
    if (!/^[1-9]\d{8}$/.test(accountId)) {
      setErr('UID 9 ta raqamdan iborat bo‘lishi kerak.')
      setProf(null)
      return
    }

    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setErr('')
    setProf(null)
    setLoading(true)

    try {
      const result=await profileFromUID(accountId, controller.signal)
      if(request.current===controller)setProf(result)
    } catch (error) {
      if (error.name !== 'AbortError') setErr(error.message)
    } finally {
      if (request.current === controller) {
        request.current = null
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <h1 className="page-title">🆔 Genshin profili</h1>
      <p className="page-sub">O‘yin profilingiz hammaga ochiq bo‘lsa, UID orqali haqiqiy nom, sarguzasht darajasi va ommaviy ma’lumotlarni ko‘ring.</p>

      <div className="uid-search card glass">
        <form className="uid-row" onSubmit={event => { event.preventDefault(); search() }}>
          <input
            className="input uid-input"
            inputMode="numeric"
            autoComplete="off"
            maxLength={9}
            placeholder="9 xonali UID (masalan, 800000001)"
            value={uid}
            onChange={event => {
              setUid(event.target.value.replace(/\D/g, '').slice(0, 9))
              setErr('')
            }}
          />
          <button className="btn glow" type="submit" disabled={loading}>
            {loading ? 'Qidirilmoqda…' : '🔍 Profilni qidirish'}
          </button>
        </form>
        {err && <div className="err" role="alert">{err}</div>}
        <p className="profile-privacy">
          Profil ma’lumoti Enka.Network ochiq API orqali tekshiriladi. Faqat ommaga ko‘rinadigan o‘yin ma’lumotlari olinadi; parol so‘ralmaydi.
        </p>
      </div>

      {loading && <div className="card center loading"><div className="spin">✦</div><p>Ochiq o‘yin profili tekshirilmoqda…</p></div>}

      {prof && !loading && (
        <div className="anim-in">
          <div className="card profile-head glass">
            <ProfileImage src={prof.profileImage} alt={prof.name+" profil rasmi"} className="profile-avatar-photo" fallback={prof.name.slice(0,1).toUpperCase()}/>
            <div className="profile-identity">
              <h1>{prof.name}</h1>
              <div className="profile-meta">
                <span className="chip">UID: {prof.uid}</span>
                <span className="chip ghost">Sarguzasht darajasi {prof.ar}</span>
                <span className="chip ghost">Jahon darajasi {prof.worldLevel ?? '—'}</span>
              </div>
              {prof.signature && <p className="profile-signature">{prof.signature}</p>}
            </div>
          </div>

          <div className="grid-3 stats4">
            <div className="card stat-box"><b>{prof.ar}</b><span>Sarguzasht darajasi</span></div>
            <div className="card stat-box"><b>{prof.achievements ?? '—'}</b><span>Yutuqlar</span></div>
            <div className="card stat-box"><b>{prof.showcase.length}</b><span>Ochiq personajlar</span></div>
          </div>

          {prof.showcase.length > 0 ? (
            <section className="profile-showcase">
              <h2 className="sec-title"><span>⚔️</span> O‘yin ichida ko‘rsatilgan personajlar</h2>
              <div className="profile-character-grid">
                {prof.showcase.map(character => (
                  <article className="card profile-character-card" key={character.id}>
                    <ProfileImage src={character.image} alt={character.name} className="profile-character-art"/>
                    <div className="profile-character-caption"><h3>{character.name}</h3>
                      {!character.known&&<small>Ma’lumotlar bazasida topilmadi · {character.id}</small>}
                      <span className="showcase-meta">
                        {character.level ? `Daraja ${character.level}` : 'Daraja ko‘rsatilmagan'}
                        {character.friendship ? ` · Do‘stlik ${character.friendship}` : ''}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <div className="card profile-showcase-empty">
              <h3>Ochiq personajlar ko‘rsatilmagan</h3>
              <p>O‘yin ichida profil sozlamalaridan personajlar ko‘rgazmasini yoqing. UID bo‘yicha faqat ochiq profil ma’lumotlarini olish mumkin.</p>
            </div>
          )}

          {prof.nameCardId && <p className="profile-source">Profil kartasi ID: {prof.nameCardId} · Ma’lumot Enka.Network’dan olindi.</p>}
        </div>
      )}

      {!prof && !loading && !err && (
        <div className="card center profile-empty">
          <div style={{ fontSize: '3rem' }}>🧭</div>
          <h3>UID orqali profilingizni toping</h3>
          <p>Ommaga ochiq profil nomi, darajasi va mavjud ko‘rgazma ma’lumotlari bilan chiqadi.</p>
        </div>
      )}
    </div>
  )
}
