import api from './request'

export interface Favorite {
  id: number
  commodityId: number
  commodityName: string
  commodityAvatar: string
  price: number
  status: number
  remark?: string
  createTime: string
}

export interface FavoriteQuery {
  current?: number
  pageSize?: number
}

export interface FavoriteAddRequest {
  commodityId: number
  remark?: string
}

export const favoritesApi = {
  getMyList: (params: FavoriteQuery) => api.post('/api/commodityfavorite/mine', params),
  add: (data: FavoriteAddRequest) => api.post<number>('/api/commodityfavorite/create', data),
  delete: (id: number) => api.post<boolean>('/api/commodityfavorite/remove', { id }),
}

