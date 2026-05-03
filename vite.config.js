import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/marco090408.github.io/',  // ← HIER deinen Repository-Namen eintragen!
})
