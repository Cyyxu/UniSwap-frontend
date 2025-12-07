/**
 * Service Worker 注册工具
 * 用于 PWA 离线支持和资源缓存
 */

interface RegisterSWOptions {
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
  onRegistered?: (registration: ServiceWorkerRegistration) => void
  onRegisterError?: (error: Error) => void
}

export async function registerSW(options: RegisterSWOptions = {}) {
  const { onNeedRefresh, onOfflineReady, onRegistered, onRegisterError } = options

  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker is not supported')
    return
  }

  // 仅在生产环境注册 Service Worker
  if (import.meta.env.DEV) {
    console.log('[SW] Service Worker disabled in development mode')
    return
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('[SW] Service Worker registered successfully')

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 新版本可用
              console.log('[SW] New content available, please refresh')
              onNeedRefresh?.()
            } else {
              // 首次安装完成
              console.log('[SW] Content cached for offline use')
              onOfflineReady?.()
            }
          }
        })
      }
    })

    onRegistered?.(registration)
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error)
    onRegisterError?.(error as Error)
  }
}

/**
 * 检查是否有可用更新
 */
export async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.update()
    }
  }
}

/**
 * 跳过等待，立即激活新版本
 */
export function skipWaiting() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    })
  }
}
