# Genshin UZ kunlik yangilanishi

Sayt faqat egasiga ochiq. Kundalik vazifa rasmiy Genshin/HoYoLAB sahifalarini va zarur bo‘lsa ishonchli nashrlarni web orqali qidiradi; sanalarni tekshiradi, o‘zbekcha qisqa mazmun tayyorlaydi. Mish-mish va tasdiqlanmagan kodlar kiritilmaydi.

## Saqlash yo‘li

1. Sites `get_site` orqali shu saytning manzili, egaga yopiq kirishi va joriy xizmat kirishini oling. Manba repozitoriysiga kirish alohida Sites credential orqali olinadi; sirlarni saqlamang.
2. Xizmat kirishi mavjud bo‘lsa, faqat shu Site manziliga `OAI-Sites-Authorization: Bearer <session token>` sarlavhasi bilan so‘rov yuboring. Bu qiymat kodda, faylda va vazifa matnida yozilmaydi.
3. `GET /api/content` joriy `updatedAt`, `news`, `codes` qiymatlarini qaytaradi.
4. `POST /api/admin/content` tanasi: `{expectedUpdatedAt: joriy.updatedAt, content: {news: [{title, summary, date: 'YYYY-MM-DD', category, sourceUrl}], codes: [{code, rewards, expiresAt: null, sourceUrl}]}}`.
5. Server manba sahifalarini tekshiradi; kod manbada aynan uchrashini tekshiradi; natijani BUCKET ichidagi `news/live-content.json`ga saqlaydi. `409` qaytsa, avval joriy ma’lumotni qayta o‘qing.
6. `GET /api/content` orqali natijani qayta o‘qib tekshiring. Bu jarayonda saytni qayta deploy qilish talab etilmaydi. Yangi maqola bo‘lmasa hali dolzarb avvalgi tekshirilgan maqolalarni qayta tekshirib yuborish mumkin; asl nashr sanalari saqlanadi. Tasdiqlangan ma’lumot bo‘lmasa eski xabarlarni o‘zgartirmang.

Bu yozuvchi yo‘l faqat owner-private Sites kirish chegarasiga tayanadi. Sayt ommaga ochilishidan oldin yozuvchi endpointga alohida egani tekshiruvchi avtorizatsiya qo‘shilishi shart.

Vercelga alohida o‘rnatiladigan nusxada eski `.github/workflows` va `GEMINI_API_KEY` usuli saqlangan; u Sites jadvalidan mustaqil.
