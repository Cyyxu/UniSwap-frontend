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
  getList: (params: CommentQuery) => api.post('/comment/list/page/vo', params),
  getByPostId: (postId: number) => api.get(`/comment/get/questonCommnet?postId=${postId}`),
  add: (data: CommentAddRequest) => api.post<number>('/comment/add', data),
  delete: (id: number) => api.post<boolean>('/comment/delete', { id }),
}

