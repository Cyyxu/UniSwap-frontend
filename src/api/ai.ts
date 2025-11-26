import axios from 'axios'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'

// AI请求专用axios实例，Gemini响应很快，超时时间设置为40秒
const aiApiInstance = axios.create({
  baseURL: '/api',
  timeout: 40000, // 40秒超时（Gemini通常在10秒内响应，留有余量）
  withCredentials: true,
})

// 请求拦截器
aiApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 强制设置 Content-Type，确保不包含 charset
    if (config.data && !(config.data instanceof FormData)) {
      const method = config.method?.toLowerCase()
      if (method === 'post' || method === 'put' || method === 'patch') {
        if (typeof config.data === 'object') {
          config.data = JSON.stringify(config.data)
        }
        
        const headers = config.headers as any
        if (headers) {
          if (headers['Content-Type']) delete headers['Content-Type']
          if (headers['content-type']) delete headers['content-type']
          if (headers['Content-type']) delete headers['Content-type']
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
aiApiInstance.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.errorCode !== undefined) {
      if (res.errorCode === 0) {
        return res.data !== undefined ? res.data : res
      } else {
        message.error(res.errorMsg || '请求失败')
        return Promise.reject(new Error(res.errorMsg || '请求失败'))
      }
    }
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
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.error('AI请求超时:', error.config?.url)
        message.error('AI服务响应超时，请稍后再试或检查网络连接')
      } else {
        console.error('网络错误:', error.message, error.config?.url)
        message.error('网络错误，请检查后端服务是否运行 (http://localhost:8109)')
      }
    } else {
      console.error('请求配置错误:', error.message)
      message.error(`请求配置错误: ${error.message}`)
    }
    return Promise.reject(error)
  }
)

export interface AIMessage {
  id: number
  userId: number
  userInputText: string
  aiGenerateText: string
  commodityId?: number
  createTime: string
}

export interface AIMessageAddRequest {
  userInputText: string
  commodityId?: number
}

export interface AIMessageQuery {
  current?: number
  pageSize?: number
}

export const aiApi = {
  add: (data: AIMessageAddRequest) => aiApiInstance.post<AIMessage>('/userAiMessage/add', data),
  getMyList: (params: AIMessageQuery) => aiApiInstance.post('/userAiMessage/my/list/page/vo', params),
  delete: (id: number) => aiApiInstance.post<boolean>('/userAiMessage/delete', { id }),
}

