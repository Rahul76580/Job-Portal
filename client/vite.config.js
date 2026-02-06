// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'   // agar React project hai to yeh already hoga
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ← yeh line add kar
  ],
})