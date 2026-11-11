# Xarita tasvirlari va koordinatalar

Manba: HoYoLAB ochiq interaktiv xarita API. Tasvirlar va o‘yin ma’lumotlari © HoYoverse / COGNOSPHERE. Norasmiy fan-sayt; huquqlar asl egalarida qoladi.

- `catalog.json`: tasviri mavjud 7 asosiy xarita, rasmiy manba va masshtab/crop metama’lumoti.
- `underground.json`: 334 rasmiy yerosti qatlami, ularning tasviri, chegarasi va tegishli nuqta IDlari.
- `quest-markers.json`: dunyo topshiriqlarining 635 rasmiy xarita belgisi. Ochiq qo‘llanmaning birinchi satri katalog nomiga aniq mos kelganda o‘zbekcha nom berilgan. Bir xil nomli bir necha vazifa bo‘lsa aniq questId tanlanmagan.

Oddiy xarita uchun `x=(worldX+origin[0]-crop.x)/crop.width` va `y=(worldY+origin[1]-crop.y)/crop.height`.

Yerosti qatlami uchun `x=(worldX-bounds.l_x)/(bounds.r_x-bounds.l_x)` va `y=(worldY-bounds.l_y)/(bounds.r_y-bounds.l_y)`. Qatlamga tegishlilik `pointIds` orqali tekshiriladi. Bu bog‘lanish tekshirilmasdan faqat chegaraga qarab nuqta qo‘yilmaydi.

Koordinatalar foydalanuvchining jonli joylashuvi emas. Ochiq profil UID API bunday ma’lumot bermaydi. 3D atlas rasmli qatlamni fazoda ko‘rsatadi; bu ma’lumotlarda haqiqiy relyef balandligi yo‘q.

Ochiq xarita qo‘llanmalarining muallif ismlari, shaxsiy ma’lumotlari va to‘liq matnlari bu fayllarga kiritilmagan.
