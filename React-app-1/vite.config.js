import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // Όταν τρέχεις npm run dev, ο Vite στέλνει τα /api requests στο Node αυτόματα!
    }
  }
})
