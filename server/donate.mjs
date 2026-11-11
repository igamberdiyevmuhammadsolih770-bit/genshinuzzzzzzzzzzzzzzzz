const reply = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})

export async function reviewReceipt(request, env) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').at(-1)
  if (!/^[a-f0-9-]{36}$/.test(id)) return reply({error:'Topilmadi.'},404)
  const stored = await env.BUCKET.get('donate/orders/' + id)
  if (!stored) return reply({error:'Buyurtma topilmadi.'},404)
  const order = await stored.json()
  if (url.searchParams.get('key') !== order.key) return reply({error:'Ruxsat yo‘q.'},403)
  const action = url.searchParams.get('action')
  if (!['approved','rejected'].includes(action)) return reply({error:'Noto‘g‘ri amal.'},400)
  const label = action === 'approved' ? '✅ Tasdiqlash' : '❌ Rad etish'
  if (request.method === 'GET') {
    return new Response('<!doctype html><html lang="uz"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Buyurtmani tekshirish</title><style>body{background:#102635;color:#eef8ff;font:18px system-ui;padding:30px}main{max-width:500px;margin:auto}pre{white-space:pre-wrap;font:inherit;line-height:1.8}button{padding:18px 30px;border:0;border-radius:14px;background:#edd69c;font:inherit;cursor:pointer}</style><main><h1>Buyurtmani tekshirish</h1><pre>'+order.caption+'</pre><p>Qaroringizni tasdiqlang.</p><form method="post"><button>'+label+'</button></form></main></html>', {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'"}})
  }
  if (request.method !== 'POST') return reply({error:'Faqat GET yoki POST.'},405)
  if (request.headers.get('origin') !== url.origin) return reply({error:'So‘rov manbasi mos emas.'},403)
  if (order.status !== 'pending' && order.status !== action) return reply({error:'Bu buyurtma bo‘yicha qaror allaqachon qabul qilingan.'},409)
  const status = action === 'approved' ? '✅ Tasdiqlandi' : '❌ Rad etildi'
  if (order.status === 'pending') {
    const saved = await env.BUCKET.put('donate/orders/'+id,JSON.stringify({...order,status:action}),{onlyIf:{etagMatches:stored.etag}})
    if (!saved) return reply({error:'Holat yangilangan. Sahifani qayta oching.'},409)
  }
  const response = await fetch('https://api.telegram.org/bot'+env.TELEGRAM_BOT_TOKEN+'/editMessageCaption',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:env.TELEGRAM_ADMIN_CHAT_ID,message_id:order.messageId,caption:order.caption.replace('tekshiruv kutilmoqda',status),reply_markup:{inline_keyboard:[]}}),
    signal:AbortSignal.timeout(15000)
  })
  const result = await response.json()
  if (!result.ok && !String(result.description).includes('message is not modified')) return reply({error:'Qaror saqlandi. Bot xabarini yangilash uchun qayta bosing.'},502)
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="background:#102635;color:#eef8ff;font:20px system-ui;padding:40px;text-align:center"><h1>'+status+'</h1><p>Telegramdagi xabar yangilandi. Bu oynani yopishingiz mumkin.</p>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}})
}
