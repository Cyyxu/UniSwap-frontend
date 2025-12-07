/**
 * UniSwap Service Worker
 * 提供离线访问和资源缓存能力
 */

const CACHE_NAME = 'uniswap-cache-v1'
const STATIC_CACHE = 'uniswap-static-v1'

// 需要预缓存的静态资源
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo-icon.svg',
]

// 需要缓存的 API 路径模式
const API_CACHE_PATTERNS = [
  /\/api\/commodity\/page/,
  /\/api\/post\/page/,
]

// 安装事件 - 预缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching static assets')
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  // 跳过等待，立即激活
  self.skipWaiting()
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  // 立即控制所有客户端
  self.clients.claim()
})

// 请求拦截 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return
  }

  // 跳过 chrome-extension 等非 http(s) 请求
  if (!url.protocol.startsWith('http')) {
    return
  }

  // API 请求 - 网络优先，失败时使用缓存
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // 静态资源 - 缓存优先
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(cacheFirst(request))
    return
  }

  // HTML 页面 - 网络优先
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  // 默认 - 网络优先
  event.respondWith(networkFirst(request))
})

/**
 * 缓存优先策略
 */
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network request failed:', request.url)
    return new Response('Offline', { status: 503 })
  }
}

/**
 * 网络优先策略
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      // 缓存成功的响应
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    // 返回离线页面（对于导航请求）
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/')
      if (offlinePage) {
        return offlinePage
      }
    }
    return new Response('Offline', { status: 503 })
  }
}

// 监听来自客户端的消息
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
