import api from './request'
import { DictTypeEnum, SystemDict } from '../types/enums'

/**
 * 系统字典 API
 */
export const systemApi = {
  /**
   * 根据类型获取字典列表
   * @param type 字典类型枚举
   * @returns 字典列表
   */
  getDictByType: (type: DictTypeEnum): Promise<SystemDict[]> => {
    return api.post('/api/system/dict', { type })
  },
}
