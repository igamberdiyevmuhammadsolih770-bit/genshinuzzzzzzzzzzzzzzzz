// Genshin UZ — resurslar va ularning ishlatilishi

export const RESOURCES = [
  {
    id: 'r1', name: 'Primogem', icon: '💎', color: '#f5d76e', rarity: 'Maxsus',
    image: 'https://enka.network/ui/UI_ItemIcon_201.png',
    desc: 'Eng muhim valyuta. Intertwined Fate va Acquaint Fate sotib olish uchun ishlatiladi (160 Primogem = 1 Fate).',
    how: 'Missiyalar, jahon qidiruvlari, daily commission, wanderer\'s trove.',
  },
  {
    id: 'r2', name: 'Mora', icon: '💰', color: '#e6c74c', rarity: 'Oddiy',
    image: 'https://enka.network/ui/UI_ItemIcon_202.png',
    desc: 'Asosiy o\'yin puli. Personajlar, qurollar va talantlarni yangilash uchun zarur.',
    how: 'Jahon vazifalari, Ley Line, sotish.',
  },
  {
    id: 'r3', name: 'Original Resin', icon: '⚡', color: '#5fd4f5', rarity: 'Maxsus',
    image: 'https://enka.network/ui/UI_ItemIcon_106.png',
    desc: 'Bosslar va domenlarda mukofot yig\'ish uchun kerak. 8 daqiqada 1 tasiga to\'ladi (to\'liq 160).',
    how: 'Primogem bilan to\'ldirish mumkin, lekin oqilona sarflang.',
  },
  {
    id: 'r4', name: 'Hero\'s Wit', icon: '📘', color: '#b68cff', rarity: 'Yuqori',
    image: 'https://enka.network/ui/UI_ItemIcon_104003.png',
    desc: 'Personaj tajribasini oshirish uchun (20,000 EXP).',
    how: 'Ley Line, jahon bosslari.',
  },
  {
    id: 'r5', name: 'Mystic Enhancement Ore', icon: '⛏️', color: '#7ee787', rarity: 'Yuqori',
    image: 'https://enka.network/ui/UI_ItemIcon_104013.png',
    desc: 'Qurollarni yangilash uchun (10,000 EXP).',
    how: 'Domenlar, jahon vazifalari.',
  },
  {
    id: 'r6', name: 'Talent Books', icon: '📜', color: '#f0a868', rarity: 'Yuqori',
    image: 'https://enka.network/ui/UI_ItemIcon_104301.png',
    desc: 'Talant darajalarini oshirish. Har bir hududning o\'z kitob turlari bor.',
    how: 'Talent domainlari (Har kuni ochiq turadi).',
  },
  {
    id: 'r7', name: 'Boss Materials', icon: '👹', color: '#ff7b7b', rarity: 'Yuqori',
    image: 'https://enka.network/ui/UI_ItemIcon_104101.png',
    desc: '5★ personajlarni ascension qilish uchun kerak (Har bir hududning o\'z bossi).',
    how: 'World bosslar (Resin kerak).',
  },
  {
    id: 'r8', name: 'Artifacts', icon: '🏺', color: '#ffc857', rarity: 'O\'zgaruvchan',
    image: 'https://enka.network/ui/UI_RelicIcon_15001_1.png',
    desc: 'Personaj kuchini oshiruvchi asosiy jihoz. 4-set bonuslari juda muhim.',
    how: 'Artifact domainlari (AR 45 dan so\'ng 5★ chiqadi).',
  },
  {
    id: 'r9', name: 'Intertwined Fate', icon: '🔮', color: '#d3a8ff', rarity: 'Maxsus',
    image: 'https://enka.network/ui/UI_ItemIcon_223.png',
    desc: 'Limited banner uchun pull (1 pull = 1 Fate).',
    how: 'Primogem bilan almashadi, Stardust/Starglitter do\'konida ham bor.',
  },
  {
    id: 'r10', name: 'Acquaint Fate', icon: '🌀', color: '#a8d8ff', rarity: 'Maxsus',
    image: 'https://enka.network/ui/UI_ItemIcon_224.png',
    desc: 'Standard banner uchun pull.',
    how: 'Adventure Rank yangilashda beriladi, Stardust do\'konida ham bor.',
  },
]

export const ARTIFACT_SETS = [
  { name: 'Crimson Witch of Flames', bonus: 'Olovli zarar +15%, reaction zarari +40%', for: 'Diluc, Hu Tao, Yanfei' },
  { name: 'Heart of Depth', bonus: 'Suv zarari +15%, normal/charged attack +30%', for: 'Childe, Ayato, Xingqiu' },
  { name: 'Emblem of Severed Fate', bonus: 'Energy Recharge +20%, burst zarari', for: 'Raiden, Xiangling, Xingqiu' },
  { name: 'Viridescent Venerer', bonus: 'Anemo zarari +15%, swirl +60%', for: 'Kazuha, Sucrose, Venti' },
  { name: 'Noblesse Oblige', bonus: 'Burst zarari +20%', for: 'Bennett, Zhongli' },
  { name: 'Tenacity of the Millelith', bonus: 'HP +20%, team atk +30%', for: 'Zhongli, Kokomi' },
  { name: 'Gilded Dreams', bonus: 'Elemental Mastery +80', for: 'Nahida, Alhaitham' },
]
