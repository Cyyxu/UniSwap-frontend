import axios from 'axios'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端统一使用 Result 格式：{ errorCode, errorMsg, data, ... }
    if (res.errorCode !== undefined) {
      // errorCode 为 0 表示成功
      if (res.errorCode === 0) {
        return res.data !== undefined ? res.data : res
      } else {
        message.error(res.errorMsg || '请求失败')
        return Promise.reject(new Error(res.errorMsg || '请求失败'))
      }
    }
    // 兼容其他格式（如直接返回数据）
    return res
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        message.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        useAuthStore.getState().logout()
        window.location.href = '/login'
      } else {
        const errorMsg = data?.errorMsg || data?.message || `请求失败: ${status}`
        message.error(errorMsg)
        console.error('请求错误:', { status, data, url: error.config?.url })
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误:', error.message, error.config?.url)
      message.error('网络错误，请检查后端服务是否运行 (http://localhost:8109)')
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
      message.error(`请求配置错误: ${error.message}`)
    }
    return Promise.reject(error)
  }
)

export default api

