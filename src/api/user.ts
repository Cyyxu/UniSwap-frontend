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
  accessToken: string
  user: {
    id: number
    userAccount: string
    userName: string
    userAvatar: string
    userRole: string
    status: string
    createdAt: string
    updatedAt: string
    editTime: string
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
  createdAt?: string
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
  login: (data: LoginRequest) => api.post<LoginResponse>('/api/user/login', data),
  register: (data: RegisterRequest) => api.post<number>('/api/user/register', data),
  logout: () => api.post<boolean>('/api/user/logout'),
  getCurrentUser: () => api.post('/api/user/current'),
  getList: (params: UserQuery) => api.post('/api/user/page', params),
  delete: (id: number) => api.post<boolean>('/api/user/remove', { id }),
  
  // 根据ID获取用户信息
  getUserById: (id: number) => api.post<User>(`/api/user/detail/${id}`, {}),
  
  // 用户更新自己的信息
  updateMyUser: (data: UpdateMyUserRequest) => api.post<boolean>('/api/user/profile', data),
  
  // 修改密码
  updatePassword: (data: UpdatePasswordRequest) => api.post<boolean>('/api/user/password', data),
}
