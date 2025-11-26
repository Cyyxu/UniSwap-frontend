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
  getList: (params: CommodityQuery) => api.post('/commodity/list/page/vo', params),
  getDetail: (id: number) => api.get(`/commodity/get/vo?id=${id}`),
  add: (data: CommodityAddRequest) => api.post<number>('/commodity/add', data),
  edit: (data: CommodityEditRequest) => api.post<boolean>('/commodity/edit', data),
  delete: (id: number) => api.post<boolean>('/commodity/delete', { id }),
  purchase: (data: CommodityPurchaseRequest) => api.post('/commodity/buy', data),
}

