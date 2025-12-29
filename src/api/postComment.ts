import api from './request'

export interface CommentUser {
  id: number
  userName: string
  userAvatar?: string
}

// 帖子评论
export interface PostComment {
  id: number
  postId: number
  userId: number
  user?: CommentUser
  content: string
  parentId?: number
  rootId?: number
  repliedUser?: CommentUser
  replies?: PostComment[]
  createTime: string
  updateTime?: string
}

// 创建帖子评论请求
export interface PostCommentAddRequest {
  postId: number
  content: string
  parentId?: number
}

// 帖子评论查询
export interface PostCommentQuery {
  current?: number
  pageSize?: number
  postId?: number
}

export const postCommentApi = {
  // 分页获取帖子评论列表
  getList: (params: PostCommentQuery) => api.post('/api/postcomment/page', params),
  
  // 根据帖子ID获取评论列表
  getByPostId: (postId: number) => api.post('/api/postcomment/page', { postId, current: 1, pageSize: 100 }),
  
  // 创建评论
  add: (data: PostCommentAddRequest) => api.post<number>('/api/postcomment/create', data),
  
  // 删除评论
  delete: (id: number) => api.post('/api/postcomment/remove', { id }),
  
  // 获取当前用户的评论
  getMine: (params: PostCommentQuery) => api.post('/api/postcomment/mine', params),
  
  // 编辑评论
  edit: (data: { id: number; content: string }) => api.post('/api/postcomment/edit', data),
}
