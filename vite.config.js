import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Local college demo: browser calls same-origin /sns-webhook to avoid CORS.
// This proxy only runs with Vite (npm run dev / npm run preview).
const snsTarget = 'https://api.agents.snsihub.ai'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { '/sns-webhook': { target: snsTarget, changeOrigin: true, rewrite: () => '/webhook/casual-care-master' } } },
  preview: { proxy: { '/sns-webhook': { target: snsTarget, changeOrigin: true, rewrite: () => '/webhook/casual-care-master' } } }
})
