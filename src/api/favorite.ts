import api from './request'

export const favoriteApi = {
  // 收藏/取消收藏切换（需要登录）
  toggle: (commodityId: number) => api.post<boolean>(`/api/commodityfavorite/toggle/${commodityId}`),

  // 删除收藏（需要登录）
  remove: (id: number) => api.post('/api/commodityfavorite/remove', { id }),

  // 创建收藏
  add: (data: { commodityId: number }) => api.post<number>('/api/commodityfavorite/create', data),

  // 分页获取收藏列表
  getList: (params: { current?: number; pageSize?: number }) =>
    api.post('/api/commodityfavorite/page', params),

  // 获取当前用户的收藏列表
  getMine: (params: { current?: number; pageSize?: number }) =>
    api.post('/api/commodityfavorite/mine', params),
}

