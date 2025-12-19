import api from './request'

export interface Commodity {
  id: number
  commodityName: string
  commodityDescription: string
  commodityAvatar: string
  price: number
  commodityInventory: number
  viewNum: number
  favourNum: number
  commodityTypeId: number
  commodityTypeName?: string
  degree: string
  isListed: number
  adminId: number
  createTime: string
  createdAt?: string
}

export interface CommodityQuery {
  current?: number
  pageSize?: number
  commodityName?: string
  commodityTypeId?: number
  isListed?: number
  sortField?: string
  sortOrder?: string
}

export interface CommodityAddRequest {
  commodityName: string
  commodityDescription: string
  commodityAvatar: string
  price: number
  commodityInventory: number
  commodityTypeId: number
  degree: string
}

export interface CommodityPurchaseRequest {
  commodityId: number
  buyNumber: number
}

export interface CommodityEditRequest {
  id: number
  commodityName?: string
  commodityDescription?: string
  commodityAvatar?: string
  price?: number
  commodityInventory?: number
  commodityTypeId?: number
  degree?: string
  isListed?: number
}

export const commodityApi = {
  // 分页获取商品列表
  getList: (params: CommodityQuery) => api.post('/api/commodity/page', params),
  // 获取商品详情
  getDetail: (id: number) => api.post(`/api/commodity/detail`, { id }),
  // 创建商品
  add: (data: CommodityAddRequest) => api.post<number>('/api/commodity/create', data),
  // 编辑商品
  edit: (data: CommodityEditRequest) => api.post('/api/commodity/edit', data),
  // 删除商品
  delete: (id: number) => api.post('/api/commodity/remove', { id }),
  // 购买商品
  purchase: (data: CommodityPurchaseRequest) => api.post('/api/commodity/buy', data),
  // 获取当前用户的商品列表
  getMine: (params: CommodityQuery) => api.post('/api/commodity/mine', params),
}
