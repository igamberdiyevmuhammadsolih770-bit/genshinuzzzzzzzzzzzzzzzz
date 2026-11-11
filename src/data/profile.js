let metadataPromise
export function loadProfileMetadata(){
 if(!metadataPromise)metadataPromise=fetch('/catalog/profile-meta.json').then(r=>{if(!r.ok)throw Error('Personaj nomlari va rasmlarini yuklab bo‘lmadi. Qayta urinib ko‘ring.');return r.json()}).catch(e=>{metadataPromise=undefined;throw e})
 return metadataPromise
}
export function normalizeProfile(data,uid,metadata){
 const player=data?.playerInfo;if(!player?.nickname)throw Error('Bu UID uchun ochiq o‘yin profili topilmadi.')
 const characters=metadata.characters||{},pictures=metadata.profilePictures||{},showcase=new Map()
 const image=(id,costume)=>characters[String(id)]?.costumes?.[String(costume)]?.image||characters[String(id)]?.image||null
 for(const a of player.showAvatarInfoList||[]){const id=String(a.avatarId);showcase.set(id,{id,level:a.level||null,friendship:a.fetterInfo?.expLevel||null,costumeId:a.costumeId||null})}
 for(const a of data.avatarInfoList||[]){const id=String(a.avatarId),old=showcase.get(id)||{id},level=Number(a.propMap?.['4001']?.val);showcase.set(id,{...old,level:old.level||(Number.isFinite(level)&&level>0?level:null),friendship:old.friendship||a.fetterInfo?.expLevel||null,costumeId:a.costumeId||old.costumeId||null})}
 const p=player.profilePicture||{}
 return {uid:data.uid||uid,name:player.nickname,signature:player.signature||'',ar:player.level,worldLevel:player.worldLevel??null,achievements:player.finishAchievementNum??null,nameCardId:player.nameCardId??null,profileImage:pictures[String(p.id)]?.image||image(p.avatarId,p.costumeId),showcase:[...showcase.values()].map(c=>({...c,name:characters[c.id]?.name||'Noma’lum qahramon',image:image(c.id,c.costumeId),known:!!characters[c.id]}))}
}
export async function profileFromUID(uid,signal){
 const [response,metadata]=await Promise.all([fetch(`/api/enka/uid/${encodeURIComponent(uid)}`,{headers:{Accept:'application/json'},signal}),loadProfileMetadata()])
 const data=await response.json().catch(()=>null)
 if(!data)throw Error('Profil serveri javob bermadi. Vercelga loyiha API funksiyasi bilan birga joylanganini tekshiring.')
 if(!response.ok){if(response.status===404)throw Error('Bu UID topilmadi yoki profil ochiq emas.');if(response.status===429)throw Error('So‘rovlar ko‘payib ketdi. Biroz kutib qayta urinib ko‘ring.');throw Error(data?.error||'Profilni yuklab bo‘lmadi. Keyinroq qayta urinib ko‘ring.')}
 if(signal?.aborted)throw new DOMException('So‘rov bekor qilindi.','AbortError')
 return normalizeProfile(data,uid,metadata)
}
