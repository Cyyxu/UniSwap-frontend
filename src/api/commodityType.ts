import api from './request'

export interface CommodityType {
  id: number
  typeName: string
  description?: string
}

export const commodityTypeApi = {
  getList: () => api.post<{ records: CommodityType[] }>('/api/category/page', {
    current: 1,
    pageSize: 1000,
  }).then(res => res?.records || []),
}

