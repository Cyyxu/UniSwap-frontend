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
  createdAt: string
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

// 兼容 ES/数据库返回的创建时间字段差异
const normalizePost = (post: any): Post => {
  if (!post) return post
  const { createTime, ...rest } = post
  const createdAt = post.createdAt || createTime || ''
  return { ...rest, createdAt }
}

const normalizePostResponse = (res: any) => {
  if (!res) return res
  if (Array.isArray(res)) return res.map(normalizePost)
  if (res.records) {
    return {
      ...res,
      records: res.records.map(normalizePost),
    }
  }
  return normalizePost(res)
}

export const postApi = {
  getList: async (params: PostQuery) => normalizePostResponse(await api.post('/api/post/page', params)),
  // ES 全文检索接口（按关键词/相关度搜索帖子）
  search: async (params: PostQuery) => normalizePostResponse(await api.post('/api/post/search', params)),
  getDetail: async (id: number) => normalizePostResponse(await api.post(`/api/post/detail/${id}`)),
  add: (data: PostAddRequest) => api.post<number>('/api/post/create', data),
  // 后台管理使用manage接口（管理员权限）
  edit: (data: PostEditRequest) => api.post<boolean>('/api/post/manage', data),
  delete: (id: number) => api.post<boolean>('/api/post/remove', { id }),
  // 点赞/取消点赞帖子
  thumb: (postId: number) => api.post<boolean>(`/api/postthumb/toggle/${postId}`),
  // 检查是否已点赞帖子
  checkThumb: (postId: number) => api.get<boolean>(`/api/postthumb/check/${postId}`),
  // 收藏/取消收藏帖子
  favour: (postId: number) => api.post<boolean>(`/api/postfavour/toggle/${postId}`),
  toggleFavour: (postId: number) => api.post<boolean>(`/api/postfavour/toggle/${postId}`),
  // 检查是否已收藏帖子
  checkFavour: (postId: number) => api.get<boolean>(`/api/postfavour/check/${postId}`),
  // 获取我收藏的帖子列表
  getMyFavourList: async (params: PostQuery) => normalizePostResponse(await api.post('/api/postfavour/mine', params)),
}
