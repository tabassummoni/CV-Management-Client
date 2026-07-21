import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ফ্রন্টএন্ডে /api দিয়ে শুরু হওয়া সব রিকোয়েস্ট পোর্ট ৫০০০-এ ফরওয়ার্ড হবে
      '/api': {
        target: '${API_BASE_URL}',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})