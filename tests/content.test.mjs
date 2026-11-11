import test from 'node:test'
import assert from 'node:assert/strict'
import {validateContent,parseFeed,parseInteraction,ogImage,trustedSource} from '../server/content.mjs'
test('updater only accepts public allowlisted sources and an actual search result',()=>{
 assert.equal(trustedSource('http://www.pcgamesn.com/a'),null)
 assert.equal(trustedSource('https://127.0.0.1/private'),null)
 assert.equal(trustedSource('https://www.pcgamesn.com.evil.test/a'),null)
 assert.throws(()=>parseInteraction({steps:[{type:'model_output',content:[{type:'text',text:'{}'}]}]}))
 assert.equal(ogImage('<meta content="https://www.pcgamesn.com/wp-content/a.jpg" property="og:image">'),'https://www.pcgamesn.com/wp-content/a.jpg')
})
test('source verification removes fabricated codes, expired codes and future news',async()=>{
 const raw={news:[{title:'Yangi tadbir',summary:'Tadbir tafsilotlari.',date:'2026-10-29',sourceUrl:'https://www.pcgamesn.com/genshin-impact/a'},{title:'Kelajak',summary:'Yo‘q.',date:'2027-01-01',sourceUrl:'https://www.pcgamesn.com/genshin-impact/b'}],codes:[{code:'VALIDCODE',rewards:'50 tosh',sourceUrl:'https://www.pcgamesn.com/genshin-impact/a'},{code:'NOTINSOURCE',sourceUrl:'https://www.pcgamesn.com/genshin-impact/a'},{code:'EXPIREDCODE',expiresAt:'2026-01-01',sourceUrl:'https://www.pcgamesn.com/genshin-impact/a'}]}
 const fetcher=async()=>new Response('<html>VALIDCODE EXPIREDCODE</html>',{headers:{'content-type':'text/html'}})
 const d=await validateContent(raw,{fetcher,now:new Date('2026-10-30T12:00:00Z')});assert.equal(d.news.length,1);assert.equal(d.codes.length,1);assert.equal(d.codes[0].code,'VALIDCODE');assert.equal(d.news[0].imageKind,'theme')
})
test('publisher feed retains actual source link and publication date',()=>{
 const d=parseFeed('<rss><item><title><![CDATA[Genshin Impact update]]></title><link>https://www.pcgamesn.com/genshin-impact/update</link><pubDate>Fri, 30 Oct 2026 11:00:32 +0000</pubDate><description><![CDATA[<b>New</b> update]]></description></item></rss>')
 assert.equal(d.length,1);assert.equal(d[0].date,'2026-10-30');assert.equal(d[0].description,'New update')
})
