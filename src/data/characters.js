import catalog from './characters-catalog.json'
export const ELEMENTS={
 Pyro:{uz:'Olov',color:'#ff6b3d',sym:'🔥'},Hydro:{uz:'Suv',color:'#39b7ff',sym:'💧'},Electro:{uz:'Chaqmoq',color:'#b879ff',sym:'⚡'},Cryo:{uz:'Muz',color:'#8fdcff',sym:'❄️'},Anemo:{uz:'Shamol',color:'#6fe3c9',sym:'🌪️'},Geo:{uz:'Tosh',color:'#f2c14e',sym:'🪨'},Dendro:{uz:'O‘simlik',color:'#a4d94a',sym:'🌿'},'Bir nechta':{uz:'Bir nechta element',color:'#e4d69c',sym:'✦'}
}
export const WEAPONS={Sword:'Qilich',Claymore:'Katta qilich',Polearm:'Nayza',Bow:'Yoy',Catalyst:'Katalizator'}
const byUz=Object.fromEntries(Object.entries(WEAPONS).map(([k,v])=>[v,k]))
export const CHARACTERS=catalog.characters.map(c=>({...c,img:'/profile-images/'+c.gameId+'.webp',weapon:byUz[c.weapon]||c.weapon}))
export const CHARACTER_CATALOG_SCOPE=catalog.scope
