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
  getList: (params: PostQuery) => api.post('/post/list/page/vo', params),
  search: (params: PostQuery) => api.post('/post/search/page/vo', params),
  getDetail: (id: number) => api.get(`/post/get/vo?id=${id}`),
  add: (data: PostAddRequest) => api.post<number>('/post/add', data),
  // 后台管理使用update接口（管理员权限）
  edit: (data: PostEditRequest) => api.post<boolean>('/post/update', data),
  delete: (id: number) => api.post<boolean>('/post/delete', { id }),
  thumb: (postId: number) => api.post<number>('/post_thumb/', { postId }),
  favour: (postId: number) => api.post<number>('/post_favour/', { postId }),
}

