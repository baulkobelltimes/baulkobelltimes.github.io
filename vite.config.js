import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-icons': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  optimizeDeps: {
    include: ['gsap', 'lucide-react']
  }
})
