import {useEffect,useState} from 'react'
export default function QuestArtwork({quest,detail=false}){
 const [failed,setFailed]=useState(false)
 useEffect(()=>setFailed(false),[quest.id,quest.image])
 const image=!failed&&quest.image?quest.image:'/scenery/teyvat.webp'
 const label=failed?'Sayohat mavzusidagi tasvir':quest.imageLabel||'Sayohat mavzusidagi tasvir'
 return <div className={'quest-art '+(detail?'quest-art-detail ':'')+(quest.imageKind==='character'?'quest-art-character':'')}><img className="quest-scene-image" src={image} alt={label+(quest.imageContext?' · '+quest.imageContext:'')} loading={detail?'eager':'lazy'} decoding="async" width="800" height="450" onError={()=>setFailed(true)}/><span className="quest-art-shade"/>{quest.chapterImage&&<img className="quest-chapter-mark" src={quest.chapterImage} alt="" loading="lazy" decoding="async" onError={e=>e.currentTarget.hidden=true}/>}<span className="quest-art-caption"><small>{label}</small>{quest.imageContext&&<b>{quest.imageContext}</b>}</span></div>
}
