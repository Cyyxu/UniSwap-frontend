import api from './request'

export interface PrivateMessage {
  id: number
  senderId: number  // 发送者ID
  recipientId: number  // 接收者ID
  content: string
  alreadyRead: number  // 0-未阅读 1-已阅读
  type?: string  // 消息发送类型（user Or admin）
  isRecalled?: number  // 是否撤回 0-未撤回 1-已撤回
  createTime: string
  updateTime?: string
}

export interface MessageQuery {
  current?: number
  pageSize?: number
}

export interface MessageAddRequest {
  recipientId: number  // 接收者ID，后端字段名是recipientId，不是toUserId
  content: string
}

export const messageApi = {
  getMyList: (params: MessageQuery) => api.post('/api/message/mine', params),
  add: (data: MessageAddRequest) => api.post<number>('/api/message/send', data),
  delete: (id: number) => api.post<boolean>('/api/message/remove', { id }),
  getConversations: () => api.post('/api/message/conversation'),
  getChatHistory: (otherUserId: number) => api.post('/api/message/history', { id: otherUserId }),
  markAsRead: (otherUserId: number) => api.post<boolean>('/api/message/read', { id: otherUserId }),
  deleteConversation: (otherUserId: number) => api.post<boolean>('/api/message/clear', { id: otherUserId }),
  checkUserOnline: (userId: number) => api.post('/api/chat/status', { userId }),
  // 初始化聊天室，与商家建立联系
  startChat: (sellerId: number, commodityId?: number) => api.post('/api/message/start', { sellerId, commodityId }),
  // 获取在线用户统计（需要管理员权限）
  getOnlineStats: () => api.post<{
    wsOnlineCount: number        // WebSocket 在线用户数
    wsOnlineUserIds: number[]    // WebSocket 在线用户ID列表
    activeCount: number          // 活跃用户数（5分钟内有请求）
    activeUserIds: number[]      // 活跃用户ID列表
  }>('/api/stats/online'),
}

