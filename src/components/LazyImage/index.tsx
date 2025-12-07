import { useState, useRef, useEffect, CSSProperties } from 'react'
import { Skeleton } from 'antd'
import './index.css'

interface LazyImageProps {
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
  fallback?: string
  onClick?: () => void
  /** 骨架屏高度，默认 200px */
  skeletonHeight?: number | string
  /** 是否使用背景图模式 */
  backgroundMode?: boolean
}

/**
 * 懒加载图片组件 + 骨架屏
 * 使用 IntersectionObserver 实现视口内加载
 */
const LazyImage = ({
  src,
  alt = '',
  className = '',
  style,
  fallback = 'https://via.placeholder.com/300x300?text=加载失败',
  onClick,
  skeletonHeight = 200,
  backgroundMode = false,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px', // 提前 100px 开始加载
        threshold: 0.01,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    setIsError(false)
  }

  const handleError = () => {
    setIsError(true)
    setIsLoaded(true)
  }

  const imageSrc = isError ? fallback : src

  // 背景图模式
  if (backgroundMode) {
    return (
      <div
        ref={imgRef}
        className={`lazy-image-container ${className}`}
        style={{ ...style, height: typeof skeletonHeight === 'number' ? skeletonHeight : undefined }}
        onClick={onClick}
      >
        {!isLoaded && (
          <Skeleton.Image
            active
            className="lazy-image-skeleton"
            style={{ width: '100%', height: '100%' }}
          />
        )}
        {isInView && (
          <>
            <div
              className={`lazy-image-bg ${isLoaded ? 'lazy-image-visible' : 'lazy-image-hidden'}`}
              style={{ backgroundImage: `url(${imageSrc})` }}
            />
            <img
              src={imageSrc}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    )
  }

  // 普通 img 模式
  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={style}
      onClick={onClick}
    >
      {!isLoaded && (
        <Skeleton.Image
          active
          className="lazy-image-skeleton"
          style={{ width: '100%', height: skeletonHeight }}
        />
      )}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? 'lazy-image-visible' : 'lazy-image-hidden'}`}
        />
      )}
    </div>
  )
}

export default LazyImage
