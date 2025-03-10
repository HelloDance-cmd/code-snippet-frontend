import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from "vite-plugin-vue-devtools"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevtools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
