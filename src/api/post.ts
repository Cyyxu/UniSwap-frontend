import api from './request'

export interface PostUser {
  id: number
  userName: string
  userAvatar: string
  userProfile?: string
  userRole?: string
}

export interface Post {
  id: number
  title: string
  content: string
  tagList?: string[]
  tags?: string[]
  thumbNum: number
  favourNum: number
  userId: number
  userName?: string
  userAvatar?: string
  user?: PostUser
  createTime: string
  hasThumb?: boolean
  hasFavour?: boolean
}

export interface PostQuery {
  current?: number
  pageSize?: number
  searchText?: string
  tags?: string[]
  sortField?: string
  sortOrder?: string
}

export interface PostAddRequest {
  title: string
  content: string
  tags?: string[]
}

export interface PostEditRequest {
  id: number
  title: string
  content: string
  tags?: string[]
}

export const postApi = {
  getList: (params: PostQuery) => api.post('/api/post/page', params),
  search: (params: PostQuery) => api.post('/api/post/search', params),
  getDetail: (id: number) => api.post('/api/post/detail', { id }),
  add: (data: PostAddRequest) => api.post<number>('/api/post/create', data),
  // 后台管理使用manage接口（管理员权限）
  edit: (data: PostEditRequest) => api.post<boolean>('/api/post/manage', data),
  delete: (id: number) => api.post<boolean>('/api/post/remove', { id }),
  thumb: (postId: number) => api.post<number>('/api/thumb/toggle', { postId }),
  favour: (postId: number) => api.post<number>('/api/favour/toggle', { postId }),
}

