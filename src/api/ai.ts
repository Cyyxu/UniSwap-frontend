import api from './request'
import { getAccessToken } from '../utils/auth'

/**
 * Token 格式化辅助函数
 * 确保 Token 带有 Bearer 前缀
 */
const formatAuthToken = (token: string): string => {
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

/**
 * AI对话记录
 */
export interface UserAiMessage {
  id: number
  userId: number
  userMessage: string
  aiResponse: string
  createdAt: string
}

/**
 * AI对话记录（兼容旧版本字段名）
 */
export interface AIMessage {
  id: number
  userId: number
  userInputText: string
  aiGenerateText: string
  createTime: string
}

/**
 * AI对话请求
 */
export interface AiChatRequest {
  userInputText: string
  commodityId?: number
}

/**
 * SSE事件类型
 */
export type SSEEventType = 'token' | 'done' | 'error'

/**
 * SSE事件数据
 */
export interface SSEEvent {
  type: SSEEventType
  content?: string
  messageId?: number
  message?: string
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  records: T[]
  total: number
  current: number
  pageSize: number
}

/**
 * AI对话API
 */
export const aiApi = {
  /**
   * 同步AI对话
   * 限流：2次/分钟
   */
  chat: (data: AiChatRequest): Promise<UserAiMessage> => 
    api.post('/api/llm/chat', data),

  /**
   * 流式AI对话（SSE）
   * 限流：3次/分钟
   * 
   * 修复说明：
   * - 使用 getAccessToken() 统一获取 Token（而非直接读取 localStorage）
   * - 使用 api.defaults.baseURL 保持 URL 配置一致
   * - 添加 Token 存在性验证
   * - 改进错误处理，区分不同的 HTTP 状态码
   * - 添加调试日志便于排查问题
   * - 请求体使用 userInputText 字段匹配后端 UserAiMessageDTO
   * 
   * 已知限制：
   * - 不支持自动 Token 刷新（SSE 长连接场景下实现复杂）
   * - 如果 Token 在对话过程中过期，需要用户重新登录
   * 
   * @param request 用户消息内容（字符串）或完整请求对象（包含 userInputText 和可选的 commodityId）
   * @param onToken 接收文本片段的回调
   * @param onDone 生成完成的回调
   * @param onError 错误处理回调
   */
  stream: async (
    request: string | AiChatRequest,
    onToken: (token: string) => void,
    onDone: (messageId: number) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
      console.log('[AI Stream] ===== 开始流式请求 =====')
      
      // 🔥 关键步骤1：发起流式请求前，先用 axios 发一个轻量级请求
      // 目的：触发 request.ts 的拦截器，如果 Token 过期会自动刷新
      // 这样可以确保后续 fetch 拿到的 Token 一定是新鲜的
      try {
        console.log('[AI Stream] 开始 Token 预检（调用 /api/user/current）...')
        await api.post('/api/user/current', {})
        console.log('[AI Stream] ✓ Token 预检成功')
      } catch (error: any) {
        // 如果这个请求失败（比如用户未登录或Refresh Token过期），直接抛出错误
        console.error('[AI Stream] ❌ Token 预检失败:', error)
        
        // 如果是登录过期错误，不要继续尝试，直接返回错误
        if (error?.message?.includes('登录已过期') || 
            error?.message?.includes('Refresh token expired') ||
            error?.message?.includes('请重新登录')) {
          onError('登录已过期，请重新登录')
          return
        }
        
        onError('请先登录')
        return
      }
      
      // 🔥 关键步骤2：此时内存中的 Token 一定是最新的
      // 因为上面的 axios 请求如果遇到 401/40100，会自动刷新并更新内存中的 Token
      const token = getAccessToken()
      
      console.log('[AI Stream] Token 原始值长度:', token?.length || 0)
      
      // 2. Token 存在性验证
      if (!token || token.trim().length === 0) {
        console.error('[AI Stream] ❌ Token 不存在，用户未登录')
        onError('未登录，请先登录')
        return
      }
      
      const formattedToken = formatAuthToken(token)
      console.log('[AI Stream] ✓ Token 已获取')
      console.log('[AI Stream] Token 前20字符:', token.substring(0, 20) + '...')
      
      // 3. 使用统一的 baseURL 配置
      const url = `${api.defaults.baseURL}/api/llm/stream`
      console.log('[AI Stream] 请求 URL:', url)
      
      // 3.5. 构建请求体 - 支持字符串或对象参数
      const requestBody: AiChatRequest = typeof request === 'string' 
        ? { userInputText: request }
        : request
      
      console.log('[AI Stream] 请求体:', JSON.stringify(requestBody))
      
      // 4. 发起 SSE 请求
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': formattedToken,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // 🔥 确保携带 Cookie（Refresh Token）
      })

      // 5. 改进的错误处理
      if (!response.ok) {
        console.error('[AI Stream] ❌ 请求失败，状态码:', response.status)
        
        // 区分不同的错误类型
        if (response.status === 401 || response.status === 403) {
          console.error('[AI Stream] 认证失败，可能 Token 已过期')
          onError('登录已过期，请重新登录')
          return
        }
        
        if (response.status === 429) {
          onError('请求过于频繁，请稍后再试')
          return
        }
        
        // 尝试解析错误信息
        try {
          const errorData = await response.json()
          const errorMsg = errorData.message || errorData.errorMsg || `请求失败: ${response.status}`
          console.error('[AI Stream] 错误详情:', errorData)
          onError(errorMsg)
        } catch (e) {
          onError(`请求失败: ${response.status}`)
        }
        return
      }

      console.log('[AI Stream] ✓ 连接成功，开始接收数据流')

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = '' // 用于处理跨chunk的数据

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('[AI Stream] 数据流结束')
          // 流结束时，检查buffer中是否有剩余数据
          if (buffer.trim()) {
            console.log('[AI Stream] 流结束，处理剩余buffer:', buffer.substring(0, 100))
            // 检查是否包含结束标记
            if (buffer.includes('{"errorCode"')) {
              const match = buffer.match(/\{"errorCode"[^}]*\}/);
              if (match) {
                try {
                  const endData = JSON.parse(match[0])
                  console.log('[AI Stream] 在buffer中找到结束标记:', endData)
                  onDone(Date.now())
                  return
                } catch (e) {
                  console.error('[AI Stream] 解析buffer中的结束标记失败:', e)
                }
              }
            }
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        
        // 检查buffer中是否包含结束标记（可能在同一行）
        if (buffer.includes('{"errorCode"')) {
          const match = buffer.match(/\{"errorCode"[^}]*\}/);
          if (match) {
            try {
              const endData = JSON.parse(match[0])
              console.log('[AI Stream] 在buffer中找到结束标记:', endData)
              onDone(Date.now())
              return
            } catch (e) {
              // 继续处理
            }
          }
        }
        
        const lines = buffer.split('\n')
        
        // 保留最后一个不完整的行
        buffer = lines.pop() || ''

        for (const line of lines) {
          // 先检查是否是结束标记（不带data:前缀的JSON）
          if (line.trim().startsWith('{') && line.includes('errorCode')) {
            try {
              const endData = JSON.parse(line.trim())
              if (endData && typeof endData === 'object' && 'errorCode' in endData) {
                console.log('[AI Stream] 流结束标记（无data前缀）:', endData)
                onDone(Date.now())
                return
              }
            } catch {
              // 不是有效的JSON，继续处理
            }
          }
          
          // 处理 SSE 格式：data: 或 data:（兼容有无空格）
          if (line.startsWith('data:')) {
            // 提取 data: 或 data: 后面的内容
            const dataContent = line.startsWith('data: ') 
              ? line.substring(6) 
              : line.substring(5)
            
            // 跳过空行
            if (!dataContent.trim()) {
              continue
            }
            
            console.log('[AI Stream] 收到数据:', dataContent.substring(0, 50))
            
            // 尝试解析为 JSON（标准格式）
            try {
              const data: SSEEvent = JSON.parse(dataContent)
              
              if (data.type === 'token' && data.content) {
                onToken(data.content)
              } else if (data.type === 'done' && data.messageId) {
                onDone(data.messageId)
              } else if (data.type === 'error' && data.message) {
                console.error('[AI Stream] 服务端错误:', data.message)
                onError(data.message)
              }
            } catch (e) {
              // JSON 解析失败，说明是纯文本格式（后端直接发送文本）
              // 兼容后端返回纯文本的情况
              console.log('[AI Stream] 纯文本模式，直接显示:', dataContent)
              
              // 检查是否是结束标记（JSON格式的响应体）
              if (dataContent.startsWith('{') && dataContent.includes('errorCode')) {
                try {
                  const endData = JSON.parse(dataContent)
                  console.log('[AI Stream] 流结束标记:', endData)
                  // 流式传输完成，调用 onDone（使用时间戳作为临时messageId）
                  onDone(Date.now())
                } catch (parseError) {
                  // 如果不是有效的JSON，当作普通文本处理
                  onToken(dataContent)
                }
              } else {
                // 纯文本内容，直接作为token传递
                onToken(dataContent)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[AI Stream] 异常:', error)
      onError(error instanceof Error ? error.message : '未知错误')
    }
  },

  /**
   * 删除AI对话记录（仅可删除自己的记录）
   */
  remove: (id: number): Promise<boolean> => 
    api.post('/api/llm/remove', { id }),

  /**
   * 查询对话历史
   */
  history: (params: {
    current: number
    pageSize: number
    sortField?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PageResponse<UserAiMessage>> => 
    api.post('/api/llm/history', params),

  /**
   * 查询对话历史（兼容旧版本方法名）
   */
  getMyList: (params: {
    current: number
    pageSize: number
    sortField?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PageResponse<AIMessage>> => 
    api.post('/api/llm/history', params),
}
