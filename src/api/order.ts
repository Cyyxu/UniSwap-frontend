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
}

export interface OrderQuery {
  current?: number
  pageSize?: number
  orderStatus?: number
  payStatus?: number
}

export const orderApi = {
  getMyOrders: (params: OrderQuery) => api.post('/commodityOrder/my/list/page/vo', params),
  getList: (params: OrderQuery) => api.post('/commodityOrder/list/page/vo', params),
  getDetail: (id: number) => api.get(`/commodityOrder/get/vo?id=${id}`),
}

