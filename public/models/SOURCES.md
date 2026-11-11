# 3D model manbalari

124 ta personajning GLB ko‘rish modeli. O‘yin modeli va teksturalar huquqlari HoYoverse / COGNOSPHERE hamda tegishli huquq egalarida qoladi. Aloy huquqlari Guerrilla Games / Sony va tegishli huquq egalariga tegishli. Ushbu indeks asl manbalarning litsenziyasini o‘zgartirmaydi.

- Games Fashion Archive: https://gamesfashionarchive.net/viewer/Genshin_Impact
- Phoshco Model Viewer aktivlari: https://github.com/Phoshco/model-viewer
- Rasmiy MMD tarqatmalari indeksi: https://mmdfr.fr/genshin-mmd/ — fayllar asl Bilibili/HoYoverse tarqatma manzillaridan olingan.
- Alyosha: https://models.spriters-resource.com/pc_computer/genshinimpact/asset/589792/

Har bir modelning aniq manbasi `catalog.json` ichida saqlangan. Teksturalar 768 pikselgacha kichraytirilib GLB ichiga joylangan; ular EXT_texture_webp talab qiladi. PMX modellarning ko‘rinadigan sirtlari va UVlari saqlangan, chap/o‘ng koordinata tizimi GLBga moslangan. MMDdan o‘girilgan fayllar statik tomosha qilish uchun tayyorlangan; yuz morflari va jang animatsiyalari kiritilmagan. Manekin va Manekina uchun rasmiy Yangi yil libosi ko‘rsatiladi va sahifada alohida belgilanishi kerak.

## Asl skeletlar qayta tiklangan nusxa

121 model rasmiy MMD/PMX skeleti va asl BDEF/SDEF og‘irliklaridan GLBga o‘girilgan; SDEF GLB linear skinning orqali ifodalanadi. Asl PMX va tekstura havolalari har bir modelning `rigSource` maydonida saqlangan. Manbalar: Phoshco tarqatmalari va MMDFr indeksida ko‘rsatilgan HoYoverse/Bilibili (`hdslb.com`) rasmiy ZIP tarqatmalari. Alyosha avvalgi asli skinned GLB faylini saqlaydi. Q/E VFX va gesture harakatlari original o‘yin kliplari emas.

Tartaglia rasmiy tarqatmasida topilmagan `tex/面.png` faqat `目星` ko‘z-yaltirash materialiga tegishli: yetishmayotgan material chiqarilmaydi, yuzi va ko‘zining asosiy teksturasi almashtirilmaydi.
