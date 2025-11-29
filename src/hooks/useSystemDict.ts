import { useState, useEffect } from 'react'
import { systemApi } from '../api/system'
import { DictTypeEnum, SystemDict } from '../types/enums'

/**
 * 系统字典 Hook
 * @param type 字典类型
 * @returns 字典列表和加载状态
 */
export const useSystemDict = (type: DictTypeEnum) => {
  const [dictList, setDictList] = useState<SystemDict[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDict = async () => {
      setLoading(true)
      try {
        const data = await systemApi.getDictByType(type)
        setDictList(data)
      } catch (error) {
        console.error('获取字典失败:', error)
        setDictList([])
      } finally {
        setLoading(false)
      }
    }

    fetchDict()
  }, [type])

  return { dictList, loading }
}

/**
 * 字典工具类
 */
export class DictUtils {
  /**
   * 根据 code 获取 name
   */
  static getNameByCode(dictList: SystemDict[], code: string): string {
    return dictList.find(item => item.code === code)?.name || code
  }

  /**
   * 根据 name 获取 code
   */
  static getCodeByName(dictList: SystemDict[], name: string): string {
    return dictList.find(item => item.name === name)?.code || name
  }

  /**
   * 检查 code 是否有效
   */
  static isValidCode(dictList: SystemDict[], code: string): boolean {
    return dictList.some(item => item.code === code)
  }
}
