import { useRef, useState, useEffect, useCallback, ReactNode, CSSProperties } from 'react'
import './index.css'

interface VirtualListProps<T> {
  /** 数据源 */
  items: T[]
  /** 每项高度（固定高度模式） */
  itemHeight: number
  /** 渲染单个项的函数 */
  renderItem: (item: T, index: number) => ReactNode
  /** 容器高度 */
  height?: number | string
  /** 容器样式 */
  style?: CSSProperties
  /** 容器类名 */
  className?: string
  /** 缓冲区大小（额外渲染的项数） */
  overscan?: number
  /** 列数（网格模式） */
  columns?: number
  /** 项之间的间距 */
  gap?: number
  /** 滚动到底部时回调 */
  onReachEnd?: () => void
  /** 到底部的阈值 */
  endReachedThreshold?: number
}

/**
 * 虚拟列表组件
 * 用于高效渲染大量数据，只渲染可见区域的内容
 */
function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  height = 400,
  style,
  className = '',
  overscan = 3,
  columns = 1,
  gap = 0,
  onReachEnd,
  endReachedThreshold = 100,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  // 计算每行高度（包含间距）
  const rowHeight = itemHeight + gap
  
  // 计算总行数
  const totalRows = Math.ceil(items.length / columns)
  
  // 计算总高度
  const totalHeight = totalRows * rowHeight - gap

  // 计算可见区域的起始和结束行
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const endRow = Math.min(
    totalRows - 1,
    Math.floor((scrollTop + containerHeight) / rowHeight) + overscan
  )

  // 计算可见区域的起始和结束索引
  const startIndex = startRow * columns
  const endIndex = Math.min(items.length - 1, (endRow + 1) * columns - 1)

  // 可见的项
  const visibleItems = items.slice(startIndex, endIndex + 1)

  // 处理滚动
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setScrollTop(scrollTop)

    // 检查是否到达底部
    if (onReachEnd && scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
      onReachEnd()
    }
  }, [onReachEnd, endReachedThreshold])

  // 监听容器尺寸变化
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateHeight = () => {
      setContainerHeight(container.clientHeight)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`virtual-list-container ${className}`}
      style={{ height, ...style }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-list-content"
        style={{ height: totalHeight }}
      >
        <div
          className="virtual-list-items"
          style={{
            transform: `translateY(${startRow * rowHeight}px)`,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: gap,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              className="virtual-list-item"
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualList
