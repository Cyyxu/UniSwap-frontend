import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    // 打包分析（仅在 analyze 模式下启用）
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    // 优化分包策略
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Antd UI 库
          'antd-vendor': ['antd', '@ant-design/icons'],
          // 工具库
          'utils-vendor': ['axios', 'dayjs', 'zustand'],
        },
        // 优化 chunk 文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 压缩选项
    target: 'es2015',
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', '@ant-design/icons', 'axios', 'dayjs', 'zustand'],
  },
  server: {
    port: 3000,
    proxy: {
      '/uniswap': {
        target: 'http://localhost:8109',
        changeOrigin: true,
        // 后端 context-path 已经是 /uniswap，所以不需要重写路径
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
      },
      // 备用代理：支持 VITE_API_BASE_URL 配置为 /api
      '/api': {
        target: 'http://localhost:8109',
        changeOrigin: true,
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
      },
    }
  }
}))
