import useSWR from 'swr'
import { postApi, Post, PostQuery } from '../api/post'
import { swrConfig, createSwrKey, revalidate } from './useSWR'

interface PageResult<T> {
  records: T[]
  total: number
  current: number
  pageSize: number
}

/**
 * 帖子列表 Hook（带 SWR 缓存）
 */
export function usePostList(query: PostQuery) {
  const key = createSwrKey('/api/post/page', query)

  const { data, error, isLoading, isValidating, mutate } = useSWR<PageResult<Post>>(
    key,
    () => postApi.getList(query) as Promise<PageResult<Post>>,
    {
      ...swrConfig,
      keepPreviousData: true,
    }
  )

  return {
    posts: data?.records || [],
    total: Number(data?.total) || 0,
    isLoading,
    isValidating,
    error,
    refresh: () => mutate(),
  }
}

/**
 * 帖子详情 Hook（带 SWR 缓存）
 */
export function usePostDetail(id: number | undefined) {
  const key = id ? createSwrKey('/api/post/detail', { id }) : null

  const { data, error, isLoading, mutate } = useSWR<Post>(
    key,
    () => (id ? (postApi.getDetail(id) as Promise<Post>) : Promise.reject('No ID')),
    swrConfig
  )

  return {
    post: data,
    isLoading,
    error,
    refresh: () => mutate(),
  }
}

/**
 * 重新验证帖子列表缓存
 */
export function revalidatePostList() {
  revalidate('/api/post/page')
}
