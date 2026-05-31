import api from './request'
import { getAccessToken } from '../utils/auth'

/**
 * Token 格式化辅助函数
 */
const formatAuthToken = (token: string): string => {
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

/**
 * RAG 对话消息
 */
export interface RagMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: DocumentSource[]
}

/**
 * 文档来源
 */
export interface DocumentSource {
  type: 'product' | 'wiki'
  title: string
  snippet: string
  url?: string
  productId?: number
}

/**
 * 商品信息
 */
export interface Product {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  category?: string
  condition?: string
}

/**
 * RAG 聊天响应
 */
export interface RagChatResponse {
  answer: string
  sources?: DocumentSource[]
  messageId?: number
}

/**
 * 商品推荐响应
 */
export interface RecommendResponse {
  recommendation: string
  products?: Product[]
}

/**
 * 语义搜索结果
 */
export interface SearchResult {
  productId: number
  productName: string
  price: number
  snippet: string
  similarity: number
}

/**
 * 语义搜索响应
 */
export interface SearchResponse {
  results: SearchResult[]
  total: number
}

/**
 * RAG API
 */
export const ragApi = {
  /**
   * 同步 RAG 问答
   * 返回 JSON 字符串，需要手动解析
   */
  chat: async (query: string): Promise<RagChatResponse> => {
    const response = await api.post('/api/llm/rag/chat', null, { params: { query } })
    // 后端返回的是 JSON 字符串，需要解析
    if (typeof response === 'string') {
      return JSON.parse(response)
    }
    return response
  },

  /**
   * 流式 RAG 问答（SSE）
   * 
   * @param query 用户问题
   * @param onToken 接收文本片段的回调
   * @param onDone 生成完成的回调
   * @param onError 错误处理回调
   */
  stream: async (
    query: string,
    onToken: (token: string) => void,
    onDone: (messageId: number) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
      console.log('[RAG Stream] ===== 开始流式请求 =====')
      
      // Token 预检
      try {
        console.log('[RAG Stream] 开始 Token 预检...')
        await api.post('/api/user/current', {})
        console.log('[RAG Stream] ✓ Token 预检成功')
      } catch (error: any) {
        console.error('[RAG Stream] ❌ Token 预检失败:', error)
        if (error?.message?.includes('登录已过期') || 
            error?.message?.includes('Refresh token expired') ||
            error?.message?.includes('请重新登录')) {
          onError('登录已过期，请重新登录')
          return
        }
        onError('请先登录')
        return
      }
      
      const token = getAccessToken()
      
      if (!token || token.trim().length === 0) {
        console.error('[RAG Stream] ❌ Token 不存在')
        onError('未登录，请先登录')
        return
      }
      
      const formattedToken = formatAuthToken(token)
      console.log('[RAG Stream] ✓ Token 已获取')
      
      // 注意：后端使用 POST 方法
      const url = `${api.defaults.baseURL}/api/llm/rag/stream?query=${encodeURIComponent(query)}`
      console.log('[RAG Stream] 请求 URL:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': formattedToken,
          'Accept': 'text/event-stream',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('[RAG Stream] ❌ 请求失败，状态码:', response.status)
        
        if (response.status === 401 || response.status === 403) {
          onError('登录已过期，请重新登录')
          return
        }
        
        if (response.status === 429) {
          onError('请求过于频繁，请稍后再试')
          return
        }
        
        try {
          const errorData = await response.json()
          const errorMsg = errorData.message || errorData.errorMsg || `请求失败: ${response.status}`
          onError(errorMsg)
        } catch (e) {
          onError(`请求失败: ${response.status}`)
        }
        return
      }

      console.log('[RAG Stream] ✓ 连接成功，开始接收数据流')

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('[RAG Stream] 数据流结束')
          if (buffer.trim()) {
            if (buffer.includes('{"errorCode"')) {
              const match = buffer.match(/\{"errorCode"[^}]*\}/)
              if (match) {
                try {
                  const endData = JSON.parse(match[0])
                  console.log('[RAG Stream] 在buffer中找到结束标记:', endData)
                  onDone(Date.now())
                  return
                } catch (e) {
                  console.error('[RAG Stream] 解析buffer中的结束标记失败:', e)
                }
              }
            }
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        
        if (buffer.includes('{"errorCode"')) {
          const match = buffer.match(/\{"errorCode"[^}]*\}/)
          if (match) {
            try {
              const endData = JSON.parse(match[0])
              console.log('[RAG Stream] 在buffer中找到结束标记:', endData)
              onDone(Date.now())
              return
            } catch (e) {
              // 继续处理
            }
          }
        }
        
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim().startsWith('{') && line.includes('errorCode')) {
            try {
              const endData = JSON.parse(line.trim())
              if (endData && typeof endData === 'object' && 'errorCode' in endData) {
                console.log('[RAG Stream] 流结束标记（无data前缀）:', endData)
                onDone(Date.now())
                return
              }
            } catch {
              // 继续处理
            }
          }
          
          if (line.startsWith('data:')) {
            const dataContent = line.startsWith('data: ') 
              ? line.substring(6) 
              : line.substring(5)
            
            if (!dataContent.trim()) {
              continue
            }
            
            console.log('[RAG Stream] 收到数据:', dataContent.substring(0, 50))
            
            try {
              const data = JSON.parse(dataContent)
              
              if (data.type === 'token' && data.content) {
                onToken(data.content)
              } else if (data.type === 'done' && data.messageId) {
                onDone(data.messageId)
              } else if (data.type === 'error' && data.message) {
                console.error('[RAG Stream] 服务端错误:', data.message)
                onError(data.message)
              } else {
                // JSON.parse 成功但不是预期的对象格式（如纯数字、字符串）
                // 后端逐字流式输出时，纯数字会被解析为数字类型而非对象
                onToken(String(dataContent))
              }
            } catch (e) {
              console.log('[RAG Stream] 纯文本模式，直接显示:', dataContent)
              
              if (dataContent.startsWith('{') && dataContent.includes('errorCode')) {
                try {
                  const endData = JSON.parse(dataContent)
                  console.log('[RAG Stream] 流结束标记:', endData)
                  onDone(Date.now())
                } catch (parseError) {
                  onToken(dataContent)
                }
              } else {
                onToken(dataContent)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[RAG Stream] 异常:', error)
      onError(error instanceof Error ? error.message : '未知错误')
    }
  },

  /**
   * 商品推荐
   * 返回 JSON 字符串，需要手动解析
   */
  recommend: async (userRequest: string): Promise<RecommendResponse> => {
    const response = await api.post('/api/llm/rag/recommend', null, { params: { userRequest } })
    // 后端返回的是 JSON 字符串，需要解析
    if (typeof response === 'string') {
      return JSON.parse(response)
    }
    return response
  },

  /**
   * 语义搜索
   * 返回 JSON 字符串，需要手动解析
   */
  search: async (query: string, topK: number = 10): Promise<SearchResponse> => {
    const response = await api.get('/api/llm/rag/search', { params: { query, topK } })
    // 后端返回的是 JSON 字符串，需要解析
    if (typeof response === 'string') {
      return JSON.parse(response)
    }
    return response
  },
}
