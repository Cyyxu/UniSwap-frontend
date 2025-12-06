import request from './request'

export interface CommodityScore {
  id: number
  commodityId: number
  userId: number
  score: number
  comment?: string
  createTime: string
  updateTime: string
}

export interface CommodityScoreAddRequest {
  commodityId: number
  score: number
  comment?: string
}

export interface CommodityScoreEditRequest {
  id: number
  score: number
  comment?: string
}

export interface CommodityScoreQueryRequest {
  current?: number
  pageSize?: number
  commodityId?: number
  userId?: number
}

export const scoreApi = {
  // 添加评分
  add: (data: CommodityScoreAddRequest) => 
    request.post<number>('/api/score/create', data),
  
  // 编辑评分
  edit: (data: CommodityScoreEditRequest) => 
    request.post<boolean>('/api/score/edit', data),
  
  // 删除评分
  delete: (id: number) => 
    request.post<boolean>('/api/score/remove', { id }),
  
  // 管理员更新评分
  manage: (data: CommodityScoreEditRequest) => 
    request.post<boolean>('/api/score/manage', data),
  
  // 获取我的评分列表
  getMyList: (params: CommodityScoreQueryRequest) => 
    request.post('/api/score/mine', params),
  
  // 获取商品评分列表
  getList: (params: CommodityScoreQueryRequest) => 
    request.post('/api/score/page', params),
  
  // 获取商品平均评分
  getAverage: (commodityId: number) => 
    request.post<number>('/api/score/average', { commodityId }),
}
