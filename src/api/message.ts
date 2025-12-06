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
  getMyList: (params: MessageQuery) => api.post('/privateMessage/my/list/page/vo', params),
  add: (data: MessageAddRequest) => api.post<number>('/privateMessage/add', data),
  delete: (id: number) => api.post<boolean>('/privateMessage/delete', { id }),
  getConversations: () => api.get('/privateMessage/conversation'),
  getChatHistory: (otherUserId: number) => api.get(`/privateMessage/chat/${otherUserId}`),
  markAsRead: (otherUserId: number) => api.post<boolean>(`/privateMessage/markAsRead/${otherUserId}`),
  deleteConversation: (otherUserId: number) => api.post<boolean>(`/privateMessage/delete/${otherUserId}`),
  checkUserOnline: (userId: number) => api.get(`/chat/online/${userId}`),
  getOnlineUsers: () => api.get<number[]>('/chat/online/list'),
  getOnlineCount: () => api.get<{ count: number }>('/chat/online/count'),
}

