import api from './request'

export interface LoginRequest {
  userAccount: string
  userPassword: string
}

export interface RegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
  userName?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    userAccount: string
    userName: string
    userAvatar: string
    userRole: string
  }
}

export interface UserQuery {
  current?: number
  pageSize?: number
  userName?: string
  userRole?: string
}

export interface User {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userRole: string
  createTime: string
}

export interface UpdateMyUserRequest {
  userName?: string
  userAvatar?: string
  userProfile?: string
  userPhone?: string
  userEmail?: string
  userSchool?: string
  userMajor?: string
  userAddress?: string
}

export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export const userApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/user/login', data),
  register: (data: RegisterRequest) => api.post<number>('/user/register', data),
  logout: () => api.post<boolean>('/user/logout'),
  getCurrentUser: () => api.get('/user/get/login'),
  getList: (params: UserQuery) => api.post('/user/list/page/vo', params),
  delete: (id: number) => api.post<boolean>('/user/delete', { id }),
  
  // 用户更新自己的信息
  updateMyUser: (data: UpdateMyUserRequest) => api.post<boolean>('/user/update/my', data),
  
  // 修改密码
  updatePassword: (data: UpdatePasswordRequest) => api.post<boolean>('/user/update/password', data),
}

