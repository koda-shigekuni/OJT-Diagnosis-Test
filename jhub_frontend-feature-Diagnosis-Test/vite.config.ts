import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ← 必須！
    port: 5173,
    watch: {
      usePolling: true, // 下記②と合わせて
    },
    proxy: {
      '/api': {
        target: 'http://host.docker.internal:3000',
        changeOrigin: true,
      },
    },
  },
})
