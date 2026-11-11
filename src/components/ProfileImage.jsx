import {useEffect,useState} from 'react'
export default function ProfileImage({src,alt,className='',fallback='◇'}){
 const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src])
 return <div className={'profile-picture '+className}><span aria-hidden="true">{fallback}</span>{src&&!failed&&<img src={src} alt={alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}</div>
}
