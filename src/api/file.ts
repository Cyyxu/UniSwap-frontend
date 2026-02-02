import api from './request'

export interface UploadResponse {
  url: string
  fileName: string
}

export const fileApi = {
  /**
   * 上传文件到 MinIO
   * @param file 文件对象
   * @returns 返回文件 URL
   */
  upload: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post<UploadResponse>('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    // 根据后端返回结构提取 URL
    // 如果后端直接返回字符串 URL，则直接返回
    // 如果返回对象 { url: '...' }，则提取 url 字段
    if (typeof response === 'string') {
      return response
    }
    return (response as UploadResponse).url || (response as any)
  },
}
