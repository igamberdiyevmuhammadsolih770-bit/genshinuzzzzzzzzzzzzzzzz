# Asl rig, alohida Q/E va xarita chuqurligi

## Personajlar

- 121 personajning rasmiy PMX manbalaridan haqiqiy suyaklar va original skin og‘irliklari GLBga saqlandi; Alyosha o‘zidagi asl native skeletni saqlaydi. Manekin va Manekina uchun oddiy Genshin personajiga tegishli bo‘lmagan E/Q o‘ylab topilmaydi.
- Avtomatik koordinata asosida qo‘l/yengga taxminiy og‘irlik berish butunlay olib tashlandi. Asl modeldagi tana, yeng va qo‘l bog‘lanishlari saqlanadi.
- 122 personajga qobiliyat nomi va alohida E/Q vizual motivlari biriktirilgan. Sayohatchilar uchun Anemo ko‘rsatiladi. Neuvillette E — sharshara, Q — to‘lqin va ikki sharshara; uning kuchli suv nuri Charged Attack bo‘lgani uchun E sifatida noto‘g‘ri ishlatilmaydi. Furina Salon hamrohlarini, Raiden ko‘z va qilich effektlarini ko‘rsatadi.
- Bu original o‘yindan olingan jang animatsiya kliplari emas. Sahna VFX’i va gesture harakatlari sayt uchun yaratilgan 3D namunalardir; individual original E/Q animatsiya fayllari manbalarda mavjud emas.
- Geometry va original riglar meshopt orqali kichraytirilgan. Yuklagich decoder va fayl versiyasi bilan ishlaydi; eski buzilgan GLB keshdan qayta ko‘rsatilmaydi.

## Xarita

- Xarita yuzasi va taglik orasidagi masofa oshirildi; kamera near/far chegaralari qayta sozlandi va xarita materialida chuqurlik ustuvorligi berildi. Bu skrinshotdagi chiziqli z-fighting’ni bartaraf etadi.
- Kamera xarita ostiga aylanib ketmaydi. Ekran nisbatiga mos sig‘dirish, yaqinlashtirish, markazga qaytarish va marker tanlash saqlanadi.
- WebGL xatosidan keyingi qayta urinishda canvas hosti yo‘qolib qolmaydi. Zarur holatda 2D zaxira xarita ochiq belgilanadi.
- Bu rasmiy atlas tasvirining fazoviy ko‘rinishi; asl Teyvat relyefining mesh/balandlik ma’lumotlari emas. Mavjud bo‘lmagan relyef aniqligi da’vo qilinmaydi.

## Tekshiruv

Asl GLB riglari, skin og‘irliklari, Neuvillette qo‘l harakati, native skelet, barcha sozlangan VFX motivlari, cooldownlar va kamera chegaralari test qilindi. Neuvillette idle/E/Q hamda xarita mustaqil OpenGL/EGL renderida ko‘z bilan tekshirildi. Ushbu bulut brauzerida WebGL bloklanganligi sababli yakuniy browser 3D kadri tasdiqlanmagan.
