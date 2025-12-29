import api from './request'

export interface CommentUser {
  id: number
  userName: string
  userAvatar?: string
}

// 商品评论
export interface CommodityComment {
  id: number
  commodityId: number
  userId: number
  user?: CommentUser
  content: string
  parentId?: number       // 父评论ID（用于回复）
  rootId?: number         // 根评论ID（用于楼中楼）
  repliedUser?: CommentUser  // 被回复的用户
  replies?: CommodityComment[]  // 子回复列表
  createTime: string
  updateTime?: string
  verified?: boolean      // 是否已购买验证
}

// 创建商品评论请求
export interface CommodityCommentAddRequest {
  commodityId: number
  content: string
  parentId?: number       // 回复某条评论时传入
}

// 商品评论查询
export interface CommodityCommentQuery {
  current?: number
  pageSize?: number
  commodityId?: number
}

export const commentApi = {
  // 分页获取商品评论列表
  getList: (params: CommodityCommentQuery) => api.post('/api/commoditycomment/page', params),
  
  // 根据商品ID获取评论列表（含回复树）
  getByCommodityId: (commodityId: number) => api.post('/api/commoditycomment/commodity', { commodityId }),
  
  // 创建评论（后端会验证是否购买过）
  add: (data: CommodityCommentAddRequest) => api.post<number>('/api/commoditycomment/create', data),
  
  // 回复评论
  reply: (data: { parentId: number; content: string }) => api.post<number>('/api/commoditycomment/reply', data),
  
  // 删除评论
  delete: (id: number) => api.post('/api/commoditycomment/remove', { id }),
  
  // 获取当前用户的评论（分页）
  getMine: (params: CommodityCommentQuery) => api.post('/api/commoditycomment/mine', params),
  
  // 获取当前用户的评论列表（含商品信息）
  getMyDetail: () => api.post('/api/commoditycomment/detail'),
  
  // 编辑评论
  edit: (data: { id: number; content: string }) => api.post('/api/commoditycomment/edit', data),
  
  // 管理员更新评论
  manage: (data: { id: number; content: string }) => api.post('/api/commoditycomment/manage', data),
}
