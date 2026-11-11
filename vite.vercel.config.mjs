import {defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {handleEnkaRequest} from './server/enka.js'
import contentHandler from './api/content.js'
export default defineConfig(({mode})=>{const values=loadEnv(mode,process.cwd(),'');for(const name of ['GEMINI_API_KEY','GEMINI_MODEL'])if(!process.env[name]&&values[name])process.env[name]=values[name];return {server:{allowedHosts:['terminal.local']},plugins:[react(),{name:'local-api',configureServer(server){server.middlewares.use((req,res,next)=>{if(new URL(req.url,'http://localhost').pathname==='/api/content')return contentHandler(req,res).catch(next);handleEnkaRequest(req,res,next).catch(next)})}}],build:{outDir:'vercel-dist',emptyOutDir:true}}})
