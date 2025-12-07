import useSWR from 'swr'
import { commodityApi, Commodity, CommodityQuery } from '../api/commodity'
import { swrConfig, createSwrKey, revalidate } from './useSWR'

interface PageResult<T> {
  records: T[]
  total: number
  current: number
  pageSize: number
}

/**
 * 商品列表 Hook（带 SWR 缓存）
 */
export function useCommodityList(query: CommodityQuery) {
  const key = createSwrKey('/api/commodity/page', query)

  const { data, error, isLoading, isValidating, mutate } = useSWR<PageResult<Commodity>>(
    key,
    () => commodityApi.getList(query) as Promise<PageResult<Commodity>>,
    {
      ...swrConfig,
      keepPreviousData: true, // 分页时保持上一页数据
    }
  )

  return {
    commodities: data?.records || [],
    total: data?.total || 0,
    isLoading,
    isValidating,
    error,
    refresh: () => mutate(),
  }
}

/**
 * 商品详情 Hook（带 SWR 缓存）
 */
export function useCommodityDetail(id: number | undefined) {
  const key = id ? createSwrKey('/api/commodity/detail', { id }) : null

  const { data, error, isLoading, mutate } = useSWR<Commodity>(
    key,
    () => (id ? (commodityApi.getDetail(id) as Promise<Commodity>) : Promise.reject('No ID')),
    swrConfig
  )

  return {
    commodity: data,
    isLoading,
    error,
    refresh: () => mutate(),
  }
}

/**
 * 重新验证商品列表缓存
 */
export function revalidateCommodityList() {
  // 通过匹配 key 前缀来重新验证所有商品列表
  revalidate('/api/commodity/page')
}
