import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves from /repo-name/ — set GITHUB_PAGES=true in CI.
// Use the ASCII slug for the public repo name: cao-tu-mln.
const base = process.env.GITHUB_PAGES === 'true' ? '/cao-tu-mln/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
})
