// ✅ 复用主请求实例，享受完整的 Token 刷新机制
import api from './request'

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
  // 🔥 使用主 api 实例，但为 AI 请求设置更长的超时时间
  add: (data: AIMessageAddRequest) => 
    api.post<AIMessage>('/api/llm/chat', data, { 
      timeout: 120000 // AI 请求需要 120 秒超时
    }),
  
  getMyList: (params: AIMessageQuery) => 
    api.post('/api/llm/history', params, { 
      timeout: 120000 
    }),
  
  delete: (id: number) => 
    api.post<boolean>('/api/llm/remove', { id }, { 
      timeout: 120000 
    }),
}
