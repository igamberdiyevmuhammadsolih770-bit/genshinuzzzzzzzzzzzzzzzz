import {useEffect,useState} from 'react'
let saved=null,pending=null,loadedAt=0
async function load(){
 if(saved&&Date.now()-loadedAt<60000)return saved
 if(!pending)pending=fetch('/api/content',{headers:{Accept:'application/json'}}).then(async r=>{if(!r.ok)throw Error();const d=await r.json();if(!Array.isArray(d.news)||!Array.isArray(d.codes))throw Error();saved=d;loadedAt=Date.now();return d}).catch(async()=>{const r=await fetch('/catalog/live-content.json');if(!r.ok)throw Error();const d=await r.json();return {...d,stale:true,noticeUz:'Oxirgi saqlangan ma’lumot ko‘rsatilmoqda.'}}).finally(()=>{pending=null})
 return pending
}
export default function useLiveContent(){
 const [data,setData]=useState(saved),[error,setError]=useState(''),[loading,setLoading]=useState(!saved)
 useEffect(()=>{let active=true;const refresh=()=>load().then(d=>{if(active){setData(d);setError('')}}).catch(()=>{if(active)setError('Ma’lumot yuklanmadi. Birozdan keyin qayta oching.')}).finally(()=>{if(active)setLoading(false)});refresh();const timer=setInterval(refresh,15*60*1000);return()=>{active=false;clearInterval(timer)}},[])
 return {data,error,loading}
}
export const localDate=value=>value?new Intl.DateTimeFormat('uz-UZ',{dateStyle:'medium',timeZone:'Asia/Tashkent'}).format(new Date(value)):'Hali tekshirilmagan'
