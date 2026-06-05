import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api.php': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/express': {         
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
       '/apirest.php': {                         
        target: 'http://localhost',
        changeOrigin: true,
    },
    },
  },
})
