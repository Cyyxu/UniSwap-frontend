import api from './request'

export interface Notice {
  id: number
  noticeTitle: string
  noticeContent: string
  noticeAdminId?: number
  createTime: string
  updateTime?: string
  user?: any
}

export interface NoticeQuery {
  current?: number
  pageSize?: number
}

export const noticeApi = {
  getList: (params: NoticeQuery) => api.post('/api/notice/page', params),
  getDetail: (id: number) => api.post('/api/notice/detail', { id }),
}

