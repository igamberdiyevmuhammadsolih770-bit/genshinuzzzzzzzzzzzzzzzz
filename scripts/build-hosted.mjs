import {spawnSync} from 'node:child_process'
import fs from 'node:fs/promises'
const run=args=>{const r=spawnSync(process.execPath,['node_modules/vite/bin/vite.js',...args],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1)}
run(['build','--config','vite.vercel.config.mjs'])
await fs.rm('dist',{recursive:true,force:true});await fs.mkdir('dist/server',{recursive:true});await fs.cp('vercel-dist','dist/client',{recursive:true})
// Optimize only the deployed scenery video; full-quality source stays in public/.
const video='dist/client/scenery/teyvat.mp4',small='dist/client/scenery/teyvat-small.mp4'
const compressed=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',video,'-vf','scale=960:-2','-r','24','-an','-c:v','libx264','-preset','fast','-crf','30','-movflags','+faststart',small],{stdio:'inherit'})
if(compressed.status!==0)throw Error('Hosted build requires ffmpeg for scenery optimization. Vercel uses build:vercel instead.')
await fs.rename(small,video)
run(['build','--config','vite.worker.config.mjs'])
await fs.mkdir('dist/.openai',{recursive:true});await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json')
