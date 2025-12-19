import api from './request'

export interface Order {
  id: number
  commodityId: number
  commodityName: string
  commodityAvatar?: string
  buyNumber: number
  paymentAmount: number
  payStatus: number
  createTime: string
  createdAt?: string
}

export interface OrderQuery {
  current?: number
  pageSize?: number
  orderStatus?: number
  payStatus?: number
}

export const orderApi = {
  // 分页获取当前用户的订单列表
  getMyOrders: (params: OrderQuery) => api.post('/api/order/mine', params),
  // 分页获取订单列表
  getList: (params: OrderQuery) => api.post('/api/order/page', params),
  // 获取订单详情
  getDetail: (id: number) => api.post('/api/order/detail', { id }),
  // 创建订单
  create: (data: any) => api.post<number>('/api/order/create', data),
  // 删除订单
  delete: (id: number) => api.post('/api/order/remove', { id }),
  // 编辑订单
  edit: (data: any) => api.post('/api/order/edit', data),
  // 管理员获取订单列表
  adminList: (params: OrderQuery) => api.post('/api/order/admin', params),
  // 管理员更新订单
  manage: (data: any) => api.post('/api/order/manage', data),
  // 获取订单热力图数据
  getHeatmap: (params: { userId?: number; payStatus?: number }) => api.post('/api/order/heatmap', params),
}
