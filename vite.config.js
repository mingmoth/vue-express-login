import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-express-login',
  plugins: [vue()],
  build: {
    manifest: true,
    rollupOptions: {
      input: './src/main.js',
    }
  }
})
