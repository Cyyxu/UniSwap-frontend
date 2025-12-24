import api from './request'

export interface CartItem {
  id: number
  commodityId: number
  commodityName: string
  commodityAvatar: string
  currentPrice: number
  addPrice: number
  quantity: number
  selected: boolean
  stock: number
  status: number
  limitBuy: number | null
  priceChangeTip: string | null
}

export interface CartVO {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
}

export interface CartAddRequest {
  commodityId: number
  quantity?: number
}

export interface CartUpdateRequest {
  id: number
  quantity?: number
  selected?: boolean
}

export interface CartMergeRequest {
  items: { commodityId: number; quantity: number }[]
}

export const cartApi = {
  getList: () => api.get<CartVO>('/api/cart/list'),
  add: (data: CartAddRequest) => api.post<number>('/api/cart/add', data),
  update: (data: CartUpdateRequest) => api.post<boolean>('/api/cart/update', data),
  remove: (ids: number[]) => api.post<boolean>('/api/cart/remove', ids),
  selectAll: (selected: boolean) => api.post<boolean>(`/api/cart/selectAll?selected=${selected}`),
  getCount: () => api.get<number>('/api/cart/count'),
  merge: (data: CartMergeRequest) => api.post<void>('/api/cart/merge', data),
}
