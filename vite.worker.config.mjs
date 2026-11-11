import {defineConfig} from 'vite'
export default defineConfig({publicDir:false,build:{ssr:'worker/index.js',outDir:'dist/server',emptyOutDir:false,rolldownOptions:{output:{entryFileNames:'index.js'}}}})
