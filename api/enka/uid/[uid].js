import {handleEnkaRequest} from '../../../server/enka.js'
export default async function handler(req,res){
 return handleEnkaRequest(req,res,()=>{
  res.statusCode=400
  res.setHeader('Content-Type','application/json; charset=utf-8')
  res.end(JSON.stringify({error:'UID 9 ta raqamdan iborat bo‘lishi kerak.'}))
 })
}
