import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves from /repo-name/ — set GITHUB_PAGES=true in CI
const base = process.env.GITHUB_PAGES === 'true' ? '/capaccumulate/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
})
