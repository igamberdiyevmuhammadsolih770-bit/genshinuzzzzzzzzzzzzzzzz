const CACHE_MS = 30_000
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 12
const cache = new Map()
const requestsByAddress = new Map()

function respond(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

export async function handleEnkaRequest(req, res, next = () => {}) {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname
  const match = pathname.match(/^\/api\/enka\/uid\/(\d{9})\/?$/)
  if (!match) return next()
  if (req.method !== 'GET') return respond(res, 405, { error: 'Faqat GET so‘rovi qabul qilinadi.' })

  const uid = match[1]
  if (uid[0] === '0') return respond(res, 400, { error: 'UID noto‘g‘ri formatda.' })

  const now = Date.now()
  const address = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  for(const [key,value] of requestsByAddress) if(now-value.startedAt>=RATE_WINDOW_MS) requestsByAddress.delete(key)
  const rate = requestsByAddress.get(address)
  if (rate && now - rate.startedAt < RATE_WINDOW_MS && rate.count >= RATE_LIMIT) {
    return respond(res, 429, { error: 'So‘rovlar limiti oshdi. Birozdan so‘ng qayta urinib ko‘ring.' })
  }
  if (!rate || now - rate.startedAt >= RATE_WINDOW_MS) {
    requestsByAddress.set(address, { startedAt: now, count: 1 })
  } else {
    rate.count += 1
  }

  const cached = cache.get(uid)
  if (cached && cached.expiresAt > now) return respond(res, 200, cached.data)

  try {
    const upstream = await fetch(`https://enka.network/api/uid/${uid}/`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GenshinUZ/1.0 public profile lookup',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!upstream.ok) {
      if (upstream.status === 404) return respond(res, 404, { error: 'UID topilmadi yoki o‘yin profili ommaga ochiq emas.' })
      if (upstream.status === 429) return respond(res, 429, { error: 'Profil xizmati vaqtinchalik so‘rovlarni chekladi. Keyinroq urinib ko‘ring.' })
      console.error(`Enka profile lookup failed with HTTP ${upstream.status} during public profile lookup`)
      return respond(res, 502, { error: 'Profil xizmati vaqtincha ishlamayapti.' })
    }

    const result = await upstream.json()
    if (!result?.playerInfo?.nickname) {
      return respond(res, 404, { error: 'Bu UID uchun ochiq o‘yin profili topilmadi.' })
    }

    const data = {
      uid: result.uid || uid,
      playerInfo: result.playerInfo,
      avatarInfoList: result.avatarInfoList || [],
    }
    if(cache.size >= 200) cache.delete(cache.keys().next().value)
    cache.set(uid, { data, expiresAt: now + CACHE_MS })
    return respond(res, 200, data)
  } catch (error) {
    console.error(`Enka profile lookup failed during public profile lookup:`, error)
    return respond(res, 502, { error: 'Profil xizmati bilan bog‘lanib bo‘lmadi. Keyinroq qayta urinib ko‘ring.' })
  }
}
