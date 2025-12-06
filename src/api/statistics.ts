import api from './request'

export interface Statistics {
  totalUsers: number
  totalCommodities: number
  totalOrders: number
  totalPosts: number
  todayUsers: number
  todayOrders: number
  todayPosts: number
  // 后端计算的增长率
  userGrowthRate: number
  orderGrowthRate: number
  postGrowthRate: number
}

export interface TrendData {
  date: string
  users: number
  orders: number
  posts: number
}

export const statisticsApi = {
  // 获取总体统计数据
  getOverall: () => api.get<Statistics>('/statistic/overall'),
  
  // 获取趋势数据
  getTrend: (days: number = 7) => api.get<TrendData[]>(`/statistic/trend?days=${days}`),
}
