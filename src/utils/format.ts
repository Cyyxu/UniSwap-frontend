/**
 * 日期时间格式化工具
 */

/**
 * 格式化日期时间
 * @param dateStr ISO 8601 格式的日期字符串，如 "2025-11-28T07:20:00.000+00:00"
 * @param format 输出格式：'datetime' | 'date' | 'time' | 'relative'
 * @returns 格式化后的字符串
 */
export function formatDateTime(
  dateStr: string | undefined | null,
  format: 'datetime' | 'date' | 'time' | 'relative' = 'datetime'
): string {
  if (!dateStr) return '-'
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`
    case 'time':
      return `${hours}:${minutes}:${seconds}`
    case 'relative':
      return getRelativeTime(date)
    case 'datetime':
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}`
  }
}

/**
 * 获取相对时间（如：刚刚、5分钟前、3小时前、昨天）
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks}周前`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months}个月前`
  } else {
    const years = Math.floor(days / 365)
    return `${years}年前`
  }
}

/**
 * 格式化为中文日期
 * @returns 如 "11月28日 07:20"
 */
export function formatChineseDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '-'
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${month}月${day}日 ${hours}:${minutes}`
}
