import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/auth'

// 优先读取环境变量，其次根据环境选择默认值
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'http://120.26.104.183:8109/uniswap'
    : '/uniswap')

console.log('[API] baseURL:', baseURL)

const api = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true, // 关键：必须开启，用于发送和接收 Cookie
})

const formatAuthToken = (token: string) => (token.startsWith('Bearer ') ? token : `Bearer ${token}`)

// ================= 静默刷新相关变量 =================
let isRefreshing = false // 刷新锁：防止多个接口同时触发刷新
let requestsQueue: Array<(token: string) => void> = [] // 请求队列：存储刷新期间挂起的请求

// ================= 请求拦截器 =================
api.interceptors.request.use(
  (config) => {
    // 🔍 调试日志：验证拦截器是否被触发
    console.log('>>> request.ts 拦截到了请求:', config.url)
    console.log('[API Request]', config.method?.toUpperCase(), config.url)
    
    // 从内存获取 Token（而非 localStorage）
    const token = getAccessToken()
    
    // 🔍 只有当 token 存在且不为空字符串时才添加
    if (token && token.trim().length > 0) {
      config.headers.Authorization = formatAuthToken(token)
      console.log('[API Request] 已添加 Token:', token.substring(0, 20) + '...')
    } else {
      console.log('[API Request] 无 Token，跳过 Authorization 头')
    }
    
    // 强制设置 Content-Type，确保不包含 charset
    // 对于 POST/PUT/PATCH 请求，如果有请求体且不是 FormData
    if (config.data && !(config.data instanceof FormData)) {
      const method = config.method?.toLowerCase()
      if (method === 'post' || method === 'put' || method === 'patch') {
        // 手动序列化 JSON（如果还没有序列化）
        if (typeof config.data === 'object') {
          config.data = JSON.stringify(config.data)
        }
        
        // 强制设置 Content-Type（不包含 charset）
        // 先删除所有可能的 Content-Type 变体
        const headers = config.headers as any
        if (headers) {
          // 删除所有可能的 Content-Type 变体
          if (headers['Content-Type']) delete headers['Content-Type']
          if (headers['content-type']) delete headers['content-type']
          if (headers['Content-type']) delete headers['Content-type']
          
          // 直接设置 Content-Type 为 application/json（可写）
          headers['Content-Type'] = 'application/json'
        }
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ================= 响应拦截器（核心：静默刷新） =================
api.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 🔍 调试日志：查看所有响应
    console.log('[Response Debug]', {
      url: response.config.url,
      errorCode: res.errorCode,
      code: res.code,
      errorMsg: res.errorMsg,
    })
    
    // 🔥 优先处理后端自定义的 Token 过期错误码（40100）
    // 必须放在最前面，避免被其他逻辑拦截
    if (res.code === 40100 || res.code === '40100' || res.errorCode === 40100) {
      console.log('[Token] 检测到 Token 过期（code: 40100），触发刷新')
      return handleTokenExpired(response.config)
    }
    
    // 后端统一使用 Result 格式：{ errorCode, errorMsg, data, ... }
    if (res.errorCode !== undefined) {
      // errorCode 为 0 表示成功
      if (res.errorCode === 0) {
        return res.data !== undefined ? res.data : res
      } else {
        // 其他错误码（非 40100）才显示错误
        message.error(res.errorMsg || '请求失败')
        const error = new Error(res.errorMsg || '请求失败') as any
        error.handled = true
        return Promise.reject(error)
      }
    }
    
    // 兼容 code 字段（部分接口可能用 code 而非 errorCode）
    if (res.code !== undefined) {
      if (res.code === 200 || res.code === '200' || res.code === 0) {
        return res.data !== undefined ? res.data : res
      } else {
        // 其他错误码（非 40100）才显示错误
        message.error(res.message || res.errorMsg || '请求失败')
        const error = new Error(res.message || res.errorMsg || '请求失败') as any
        error.handled = true
        return Promise.reject(error)
      }
    }
    
    // 兼容其他格式（如直接返回数据）
    return res
  },
  async (error: AxiosError) => {
    // 如果已经处理过，不再重复提示
    if ((error as any).handled) {
      return Promise.reject(error)
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    if (error.response) {
      const { status, data } = error.response
      
      // ========== 核心：401 自动刷新 Token ==========
      if (status === 401 && originalRequest && !originalRequest._retry) {
        return handleTokenExpired(originalRequest)
      }
      
      // ========== 其他错误处理 ==========
      const errorMsg = (data as any)?.errorMsg || (data as any)?.message || `请求失败: ${status}`
      message.error(errorMsg)
      console.error('请求错误:', { status, data, url: error.config?.url })
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误:', error.message, error.config?.url)
      message.error('网络错误，请检查后端服务是否运行')
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
      message.error(`请求配置错误: ${error.message}`)
    }
    
    // 标记错误已处理
    ;(error as any).handled = true
    return Promise.reject(error)
  }
)

// 🔥🔥🔥 核心处理函数：无感刷新 + 自动重试
async function handleTokenExpired(originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }) {
  // 防止刷新接口本身报 401 导致死循环
  if (originalRequest.url?.includes('/refresh')) {
    console.log('[Token Refresh] 刷新接口本身失败，跳转登录')
    clearAccessToken()
    useAuthStore.getState().logout()
    message.error('登录已过期，请重新登录')
    window.location.href = '/login'
    return Promise.reject(new Error('Refresh token expired'))
  }
  
  // A. 如果已经有其他请求在刷新了，本请求进入队列等待
  if (isRefreshing) {
    console.log('[Token Refresh] 请求进入等待队列:', originalRequest.url)
    return new Promise((resolve) => {
      requestsQueue.push((newToken: string) => {
        originalRequest.headers.Authorization = formatAuthToken(newToken)
        resolve(api(originalRequest))
      })
    })
  }
  
  // B. 标记为正在刷新，防止并发
  originalRequest._retry = true
  isRefreshing = true
  
  try {
    console.log('[Token Refresh] 开始刷新 Token...')
    
    // 🔥 调用后端刷新接口（Cookie 会自动带上 Refresh Token）
    const refreshResponse = await axios.post(
      `${baseURL}/api/user/refresh`,
      {},
      { withCredentials: true }
    )
    
    console.log('[Token Refresh] 刷新接口响应:', refreshResponse.data)
    
    // 🔥 根据后端返回结构提取新 Token
    // 支持多种返回格式：
    // 1. { errorCode: 0, data: { accessToken: 'xxx' } }
    // 2. { code: 200, data: { accessToken: 'xxx' } }
    // 3. { accessToken: 'xxx' }
    let newAccessToken: string | null = null
    const resData = refreshResponse.data
    
    if (resData?.errorCode === 0 || resData?.code === 200 || resData?.code === '200') {
      newAccessToken = resData.data?.accessToken || resData.data
    } else if (resData?.accessToken) {
      newAccessToken = resData.accessToken
    }
    
    if (!newAccessToken || typeof newAccessToken !== 'string') {
      throw new Error('刷新 Token 失败：未返回有效 Token')
    }
    
    console.log('[Token Refresh] ✅ 刷新成功，新 Token:', newAccessToken.substring(0, 20) + '...')
    
    // 1. 更新内存中的 Token
    setAccessToken(newAccessToken)
    useAuthStore.getState().setToken(newAccessToken)
    
    // 2. 🔥 执行队列中等待的请求（关键！）
    console.log(`[Token Refresh] 执行队列中的 ${requestsQueue.length} 个请求`)
    requestsQueue.forEach(callback => callback(newAccessToken))
    requestsQueue = []
    
    // 3. 🔥 重试当前请求（关键！这就是"自动重试"的核心）
    originalRequest.headers.Authorization = formatAuthToken(newAccessToken)
    console.log('[Token Refresh] 🔄 重试原始请求:', originalRequest.url)
    return api(originalRequest)
    
  } catch (refreshError) {
    // C. 刷新失败（Refresh Token 过期或无效）-> 跳转登录
    console.error('[Token Refresh] ❌ 刷新失败:', refreshError)
    requestsQueue = []
    clearAccessToken()
    useAuthStore.getState().logout()
    message.error('登录已过期，请重新登录')
    window.location.href = '/login'
    return Promise.reject(refreshError)
    
  } finally {
    // D. 释放刷新锁
    isRefreshing = false
  }
}

export default api
