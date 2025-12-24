import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip, QRCode } from 'antd'
import {
  EditOutlined,
  MobileOutlined,
  CustomerServiceOutlined,
  VerticalAlignTopOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import './index.css'

const FloatingDock = () => {
  const navigate = useNavigate()
  const [showBackTop, setShowBackTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="xy-floating-dock">
      {/* 发布按钮 */}
      <div className="xy-dock-publish" onClick={() => navigate('/commodity-manage')}>
        <EditOutlined />
        <span>发布</span>
      </div>

      {/* 功能按钮组 */}
      <div className="xy-dock-buttons">
        <div className="xy-dock-btn" onClick={() => navigate('/')}>
          <HomeOutlined />
          <span>首页</span>
        </div>

        <Tooltip
          title={
            <div style={{ padding: 8, textAlign: 'center' }}>
              <QRCode value="https://example.com/app" size={120} />
              <div style={{ marginTop: 8, fontSize: 12 }}>扫码下载APP</div>
            </div>
          }
          placement="left"
          color="#fff"
        >
          <div className="xy-dock-btn">
            <MobileOutlined />
            <span>APP</span>
          </div>
        </Tooltip>

        <div className="xy-dock-btn" onClick={() => window.open('mailto:feedback@example.com')}>
          <CustomerServiceOutlined />
          <span>反馈</span>
        </div>

        {showBackTop && (
          <div className="xy-dock-btn xy-dock-top" onClick={scrollToTop}>
            <VerticalAlignTopOutlined />
            <span>顶部</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default FloatingDock
