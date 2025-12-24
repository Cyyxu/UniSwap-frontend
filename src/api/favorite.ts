import api from './request'

export const favoriteApi = {
  // 增加浏览量（无需登录）
  view: (commodityId: number) => api.post(`/api/favorite/view/${commodityId}`),

  // 收藏/取消收藏切换（需要登录）
  toggle: (commodityId: number) => api.post<boolean>(`/api/favorite/toggle/${commodityId}`),

  // 查询是否已收藏（需要登录）
  check: (commodityId: number) => api.get<boolean>(`/api/favorite/check/${commodityId}`),
}
