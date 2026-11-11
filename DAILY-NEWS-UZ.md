# Kunlik Google AI yangiliklari
Kod tayyor, lekin hosting va API kalitisiz jadval faol emas.

1. ZIP ichidagi genshin-uz papkasining ICHIDAGI fayllarni GitHub repozitoriy ildiziga joylang, .github papkasini ham qo‘shing.
2. GitHub Settings → Secrets and variables → Actions → New repository secret: GEMINI_API_KEY. Kalitni kodga yoki chatga yozmang.
3. Kerak bo‘lsa GEMINI_MODEL repository variable orqali hisobingizda mavjud Google Search qo‘llaydigan model nomini belgilang.
4. Actions → Verify Genshin news daily → Run workflow orqali ilk tekshiruvni ishga tushiring. Workflow har kuni 03:00 UTC (Toshkent 08:00) uchun sozlangan; GitHub bajarilishi kechikishi mumkin.
5. Shu repozitoriyni Vercel loyihasiga ulang va Git pushlardan avtomatik deployment yoqilganini tekshiring. Bot yangilagan live-content.json yangi deployment bilan saytda ko‘rinadi. Maxsus deploy-hooklar bu ZIPda sozlanmagan.

AI Google orqali qidiradi, manba sahifalarini tekshiradi va o‘zbekcha xulosa qiladi. Google Search ishlamasa, ruxsat berilgan nashr RSS manbalariga o‘tadi. Natija atomik saqlanadi; xatoda oldingi xabarlar saqlanadi. 24 soatdan eski ma’lumot sayt orqali eskirgan deb belgilanadi. O‘quvchi sahifani ochishi pulli AI chaqiruvini boshlamaydi.

Bu suhbatda API kaliti, GitHub Actions va hosting ulanishi berilmagan: kunlik jarayon ishga tushirilmagan.
