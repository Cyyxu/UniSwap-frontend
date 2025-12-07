import useSWR, { SWRConfiguration, mutate } from 'swr'
import api from '../api/request'

/**
 * SWR 全局配置
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false, // 窗口聚焦时不重新验证
  revalidateOnReconnect: true, // 网络重连时重新验证
  dedupingInterval: 2000, // 2秒内重复请求只发一次
  errorRetryCount: 3, // 错误重试次数
  errorRetryInterval: 3000, // 错误重试间隔
  shouldRetryOnError: true,
}

/**
 * 通用 fetcher - GET 请求
 */
export const getFetcher = <T>(url: string): Promise<T> =>
  api.get(url).then((res) => res as T)

/**
 * 通用 fetcher - POST 请求（用于分页等需要传递参数的场景）
 */
export const postFetcher = <T>(url: string, params: any): Promise<T> =>
  api.post(url, params).then((res) => res as T)

/**
 * 生成 SWR key（带参数）
 */
export const createSwrKey = (url: string, params?: any) => {
  if (!params) return url
  return [url, JSON.stringify(params)]
}

/**
 * 手动触发重新验证
 * @param key - SWR key
 */
export const revalidate = (key: string | any[]) => {
  mutate(key)
}

/**
 * 清除所有缓存
 */
export const clearCache = () => {
  mutate(() => true, undefined, { revalidate: false })
}

export { useSWR, mutate }
