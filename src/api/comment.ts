import api from './request'
import { PostUser } from './post'

export interface Comment {
  id: number
  postId: number
  userId: number
  user?: PostUser
  repliedUser?: PostUser
  content: string
  parentId?: number
  ancestorId?: number
  createTime: string
  updateTime?: string
  replies?: Comment[]
}

export interface CommentAddRequest {
  postId: number
  content: string
  parentId?: number
}

export interface CommentQuery {
  current?: number
  pageSize?: number
  postId?: number
}

export const commentApi = {
  // 分页获取评论列表
  getList: (params: CommentQuery) => api.post('/api/comment/page', params),
  // 根据帖子ID获取评论列表
  getByPostId: (postId: number) => api.post('/api/comment/post', { postId }),
  // 创建评论
  add: (data: CommentAddRequest) => api.post<number>('/api/comment/create', data),
  // 删除评论
  delete: (id: number) => api.post('/api/comment/remove', { id }),
  // 获取当前用户的评论（分页）
  getMine: (params: CommentQuery) => api.post('/api/comment/mine', params),
  // 获取当前用户的评论列表（含帖子信息）
  getMyDetail: () => api.post('/api/comment/detail'),
  // 编辑评论
  edit: (data: { id: number; content: string }) => api.post('/api/comment/edit', data),
  // 管理员更新评论
  manage: (data: { id: number; content: string }) => api.post('/api/comment/manage', data),
}

