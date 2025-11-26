import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8109',
        changeOrigin: true,
        // 后端 context-path 已经是 /api，所以不需要重写路径
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('代理错误:', err.message)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('代理请求:', req.method, req.url, '->', proxyReq.path)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('代理响应:', req.method, req.url, '->', proxyRes.statusCode)
          })
        },
      }
    }
  }
})

