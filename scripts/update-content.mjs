import fs from 'node:fs/promises'
import {generateContent} from '../server/content.mjs'
const key=process.env.GEMINI_API_KEY
if(!key)throw new Error('GEMINI_API_KEY secret is required; existing news has not been changed.')
const data=await generateContent({key,model:process.env.GEMINI_MODEL||'gemini-3.5-flash-lite'})
if(!data.news?.length)throw new Error('No verified news returned; preserving previous content.')
const file=new URL('../public/catalog/live-content.json',import.meta.url),temp=new URL('../public/catalog/live-content.pending.json',import.meta.url)
await fs.writeFile(temp,JSON.stringify({...data,checkIntervalHours:24},null,2)+'\n')
await fs.rename(temp,file)
console.log(`Saved ${data.news.length} verified news items at ${data.updatedAt}.`)
