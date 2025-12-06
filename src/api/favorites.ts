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
  getMyList: (params: FavoriteQuery) => api.post('/userCommodityFavorite/my/list/page/vo', params),
  add: (data: FavoriteAddRequest) => api.post<number>('/userCommodityFavorite/add', data),
  delete: (id: number) => api.post<boolean>('/userCommodityFavorite/delete', { id }),
  // 根据商品ID查询当前用户的收藏记录
  getByCommodityId: (commodityId: number) => api.post('/userCommodityFavorite/list/page/vo', {
    current: 1,
    pageSize: 1,
    commodityId,
  }),
}

