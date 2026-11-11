# Vercelga joylash

Loyiha ildizini Vercelga ulang. `vercel.json` avtomatik ravishda `npm run build:vercel` buyrug‘ini va `vercel-dist` papkasini tanlaydi. Node.js 22 versiyasini ishlating.

UID qidiruvi `api/enka/uid/[uid].js` server funksiyasi orqali ishlaydi. Faqat `dist` yoki `vercel-dist` papkasini yuklash yetarli emas: API uchun loyiha manbasi ham joylanishi kerak. Muhit o‘zgaruvchisi yoki maxfiy kalit kerak emas.

Enka xizmati cheklovi, tarmoq muammosi yoki yopiq profil bo‘lsa, sayt tushunarli xabar beradi. Bu ommaviy ko‘rgazma, to‘liq inventar emas.

WebP rasmlar sahifaga kerak bo‘lganda yuklanadi; Vercel chekka keshi va fayl nomi xeshlangan dastur fayllari uchun uzoq kesh qo‘llanadi.

## Yangiliklar va AI

Vercel → loyiha sozlamalari → Environment Variables bo‘limida `GEMINI_API_KEY` va `GEMINI_MODEL=gemini-3.5-flash-lite` ni kiriting, so‘ng qayta joylang. Kalitni `VITE_` bilan boshlamang; u faqat serverda ishlaydi. Kalit ZIP ichiga kiritilmaydi.

`api/content.js` Google qidiruvi bilan manbali yangilik va promo kod izlaydi. Qidiruv limiti bo‘lsa, nashrlarning ochiq xabar oqimi va kodlar sahifasini o‘qib AI bilan tarjima qiladi. Manbada yo‘q kod chiqarilmaydi; ishlashi foydalanuvchi hisobida tekshirilmaydi. Xato bo‘lsa, avvalgi tekshirilgan ma’lumot ko‘rsatiladi.

Vercel jadvali kuniga bir marta UTC 03:00 (Toshkent 08:00) da `/api/content` ni chaqiradi. Ochiq o‘qish javobi 6 soat chekka keshda saqlanadi. Vercel nusxasida alohida doimiy ma’lumotlar bazasi yo‘q; joylashga qo‘shilgan tekshirilgan nusxa zaxira sifatida ishlatiladi. Hosting rejangiz jadval va funksiya davomiyligini qo‘llashi kerak.

Jonli ChatGPT sayti esa serverdagi doimiy saqlash va unga bog‘langan alohida jadvaldan foydalanadi. Kalit yoki maxfiy qiymatni brauzerga uzatmang.
