import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 定义一个代理，所有以 /api 开头的请求都会被转发到你的后端服务器
      '/api': {
        target: 'http://8.134.189.141/engineer/api/v1', // 你的后端API地址
        changeOrigin: true, // 必须设置为true
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去掉/api前缀
      },
    },
  },
})