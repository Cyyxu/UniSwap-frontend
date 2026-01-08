import api from './request'

export const registerApi = {
  // 测试注册接口
  testRegister: () => api.post<string>('/api/register/test'),
}
