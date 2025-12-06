import { useEffect, useState } from 'react'
import { Input, Button, Badge, Avatar, Dropdown, Tooltip, QRCode } from 'antd'
import { 
  SearchOutlined, 
  UserOutlined,
  HeartOutlined,
  RightOutlined,
  FireOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  MessageOutlined,
  RobotOutlined,
  EyeOutlined,
  EditOutlined,
  MobileOutlined,
  CustomerServiceOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { commodityApi, Commodity } from '../../api/commodity'
import { useAuthStore } from '../../store/authStore'
import { userApi } from '../../api/user'
import './index.css'

const Home = () => {
  const navigate = useNavigate()
  const { token, user, logout } = useAuthStore()
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [showBackTop, setShowBackTop] = useState(false)

  useEffect(() => {
    loadCommodities()
    
    // 监听滚动，控制"回到顶部"按钮显示
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadCommodities = async () => {
    try {
      const result: any = await commodityApi.getList({ current: 1, pageSize: 20, isListed: 1 })
      setCommodities(result?.records || [])
    } catch (error) {
      console.error('加载商品失败', error)
    }
  }

  // 分类数据 - 闲鱼风格
  const categories = [
    { id: 1, name: '手机', icon: '📱', sub: ['数码', '电脑'] },
    { id: 2, name: '服饰', icon: '👔', sub: ['箱包', '运动'] },
    { id: 3, name: '图书', icon: '📚', sub: ['教材', '考研'] },
    { id: 5, name: '游戏', icon: '🎮', sub: ['装备', '账号'] },
    { id: 6, name: '美妆', icon: '💄', sub: ['个护', '香水'] },
    { id: 7, name: '家具', icon: '🪑', sub: ['家电', '家装'] },
    { id: 8, name: '乐器', icon: '🎸', sub: ['艺术', '手工'] },
    { id: 9, name: '食品', icon: '🍜', sub: ['零食', '特产'] },
    { id: 4, name: '运动', icon: '⚽', sub: ['户外', '健身'] },
    { id: 10, name: '其他', icon: '📦', sub: ['闲置', '转让'] },
  ]

  // Bento Grid 卡片配置 - 闲鱼风格
  const bentoSections = [
    {
      id: 'main',
      title: '校园抄底好物',
      subtitle: '超绝性价比',
      badge: '省到底',
      bg: 'linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)',
      textColor: '#fff',
      typeId: undefined,
      sortField: 'price',
      sortOrder: 'ascend',
    },
    {
      id: 'clothes',
      title: '衣橱捡漏',
      subtitle: '时尚美衣低价淘',
      bg: '#FFF5F5',
      textColor: '#333',
      tagBg: '#FF6B6B',
      typeId: 2,
      products: [] as Commodity[],
    },
    {
      id: 'digital',
      title: '手机数码',
      subtitle: '热门装备省心入',
      bg: '#F0F7FF',
      textColor: '#333',
      tagBg: '#4DABF7',
      typeId: 1,
      products: [] as Commodity[],
    },
    {
      id: 'acg',
      title: '图书教材',
      subtitle: '知识好物随手得',
      bg: '#F0FFF4',
      textColor: '#333',
      tagBg: '#51CF66',
      typeId: 3,
      products: [] as Commodity[],
    },
    {
      id: 'discount',
      title: '省钱好物',
      subtitle: '超值优惠放心购',
      bg: '#FFF0F6',
      textColor: '#333',
      tagBg: '#F06595',
      typeId: undefined,
      sortField: 'price',
      sortOrder: 'ascend',
      products: [] as Commodity[],
    },
  ]

  // 获取各分类商品预览
  const getProductsForSection = (typeId?: number, sortField?: string) => {
    let filtered = [...commodities]
    if (typeId) {
      filtered = filtered.filter(c => c.commodityTypeId === typeId)
    }
    if (sortField === 'price') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price))
    }
    return filtered.slice(0, 3)
  }

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/commodity?search=${searchValue}`)
    }
  }

  const openCategory = (typeId?: number, options?: { sortField?: string; sortOrder?: string }) => {
    const params = new URLSearchParams()
    if (typeId) params.set('typeId', String(typeId))
    if (options?.sortField) {
      params.set('sortField', options.sortField)
      if (options.sortOrder) params.set('sortOrder', options.sortOrder)
    }
    navigate(`/commodity${params.toString() ? `?${params.toString()}` : ''}`)
  }

  // 用户菜单项
  const userMenuItems = [
    { key: 'user', icon: <UserOutlined />, label: '个人中心' },
    { key: 'favorites', icon: <HeartOutlined />, label: '我的收藏' },
    { key: 'ai-chat', icon: <RobotOutlined />, label: 'AI 助手' },
    { key: 'message', icon: <MessageOutlined />, label: '私信' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    ...(user?.userRole === 'admin' ? [{ type: 'divider' as const }, { key: 'admin', icon: <DashboardOutlined />, label: '后台管理' }] : []),
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      userApi.logout().finally(() => {
        logout()
        navigate('/login')
      })
    } else if (key === 'admin') {
      navigate('/admin')
    } else {
      navigate(`/${key}`)
    }
  }

  return (
    <div className="xianyu-home">
      {/* 顶部导航栏 - 闲鱼黄 */}
      <div className="xy-navbar">
        <div className="xy-navbar-content">
          <div className="xy-navbar-left">
            <div className="xy-logo" onClick={() => navigate('/')}>
              <img src="/logo-icon.svg" alt="UniSwap" className="xy-logo-icon" style={{ width: 36, height: 36 }} />
              <span className="xy-logo-text">UniSwap</span>
            </div>
          </div>
          
          <div className="xy-navbar-center">
            <div className="xy-search-box">
              <Input
                placeholder="搜索你想要的宝贝"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: '#999' }} />}
                className="xy-search-input"
              />
              <Button type="primary" className="xy-search-btn" onClick={handleSearch}>
                搜索
              </Button>
            </div>
          </div>

          <div className="xy-navbar-right">
            {token ? (
              <>
                <div className="xy-nav-item" onClick={() => navigate('/message')}>
                  <Badge count={0} size="small">
                    <MessageOutlined className="xy-nav-icon" style={{ fontSize: 24 }} />
                  </Badge>
                </div>
                <Button 
                  type="primary" 
                  className="xy-publish-btn"
                  onClick={() => navigate('/commodity/publish')}
                >
                  + 发布闲置
                </Button>
                <Dropdown
                  menu={{ items: userMenuItems, onClick: handleMenuClick }}
                  placement="bottomRight"
                >
                  <div className="xy-user-dropdown">
                    <Avatar src={user?.userAvatar} icon={<UserOutlined />} size={32} />
                  </div>
                </Dropdown>
              </>
            ) : (
              <div className="xy-auth-btns">
                <Button onClick={() => navigate('/login')}>登录</Button>
                <Button type="primary" onClick={() => navigate('/register')}>注册</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主体内容区 */}
      <div className="xy-main">
        {/* 左侧分类栏 */}
        <div className="xy-sidebar">
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className="xy-category-item"
              onClick={() => openCategory(cat.id)}
            >
              <span className="xy-cat-icon">{cat.icon}</span>
              <span className="xy-cat-name">{cat.name}</span>
              <span className="xy-cat-divider">/</span>
              {cat.sub.map((s, i) => (
                <span key={i} className="xy-cat-sub">{s}{i < cat.sub.length - 1 ? ' / ' : ''}</span>
              ))}
            </div>
          ))}
        </div>

        {/* 中间 Bento Grid 区域 */}
        <div className="xy-bento-area">
          <div className="xy-bento-grid">
            {/* 主推卡片 - 大 */}
            <div 
              className="xy-bento-main"
              style={{ background: bentoSections[0].bg }}
              onClick={() => openCategory(undefined, { sortField: 'price', sortOrder: 'ascend' })}
            >
              <div className="xy-bento-main-content">
                <h2>{bentoSections[0].title}</h2>
                <p>{bentoSections[0].subtitle}</p>
                <span className="xy-bento-main-badge">{bentoSections[0].badge}</span>
                <div className="xy-bento-main-action">去看看 &gt;</div>
              </div>
              <div className="xy-bento-main-images">
                {commodities.slice(0, 2).map((item, i) => (
                  <img key={i} src={item.commodityAvatar} alt="" />
                ))}
              </div>
            </div>

            {/* 衣橱捡漏 */}
            <div 
              className="xy-bento-card"
              style={{ background: bentoSections[1].bg }}
              onClick={() => openCategory(2)}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[1].tagBg }}>
                  {bentoSections[1].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[1].subtitle}</span>
              </div>
              <div className="xy-bento-products">
                {getProductsForSection(2).map((item, i) => (
                  <div key={i} className="xy-bento-product" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${item.id}`) }}>
                    <img src={item.commodityAvatar} alt="" />
                    <span className="xy-bento-price">¥{Math.floor(Number(item.price))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 手机数码 */}
            <div 
              className="xy-bento-card"
              style={{ background: bentoSections[2].bg }}
              onClick={() => openCategory(1)}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[2].tagBg }}>
                  {bentoSections[2].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[2].subtitle}</span>
              </div>
              <div className="xy-bento-products">
                {getProductsForSection(1).map((item, i) => (
                  <div key={i} className="xy-bento-product" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${item.id}`) }}>
                    <img src={item.commodityAvatar} alt="" />
                    <span className="xy-bento-price">¥{Math.floor(Number(item.price))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 图书教材 */}
            <div 
              className="xy-bento-card"
              style={{ background: bentoSections[3].bg }}
              onClick={() => openCategory(3)}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[3].tagBg }}>
                  {bentoSections[3].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[3].subtitle}</span>
              </div>
              <div className="xy-bento-products">
                {getProductsForSection(3).map((item, i) => (
                  <div key={i} className="xy-bento-product" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${item.id}`) }}>
                    <img src={item.commodityAvatar} alt="" />
                    <span className="xy-bento-price">¥{Math.floor(Number(item.price))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 省钱好物 */}
            <div 
              className="xy-bento-card"
              style={{ background: bentoSections[4].bg }}
              onClick={() => openCategory(undefined, { sortField: 'price', sortOrder: 'ascend' })}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[4].tagBg }}>
                  {bentoSections[4].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[4].subtitle}</span>
              </div>
              <div className="xy-bento-products">
                {getProductsForSection(undefined, 'price').map((item, i) => (
                  <div key={i} className="xy-bento-product" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${item.id}`) }}>
                    <img src={item.commodityAvatar} alt="" />
                    <span className="xy-bento-price">¥{Math.floor(Number(item.price))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 猜你喜欢 - C2C 商品流 */}
      <div className="xy-feed-section">
        <div className="xy-feed-header">
          <h2>
            <FireOutlined style={{ marginRight: 8, color: '#FF6B00' }} />
            猜你喜欢
          </h2>
          <span className="xy-feed-more" onClick={() => navigate('/commodity')}>
            查看更多 <RightOutlined />
          </span>
        </div>
        
        <div className="xy-feed-grid">
          {commodities.map(item => (
            <div 
              key={item.id} 
              className="xy-product-card"
              onClick={() => navigate(`/commodity/${item.id}`)}
            >
              <div className="xy-product-img">
                <img
                  alt={item.commodityName}
                  src={item.commodityAvatar || 'https://via.placeholder.com/300x300?text=商品图片'}
                />
                {item.degree && (
                  <span className="xy-product-degree">{item.degree}</span>
                )}
              </div>
              <div className="xy-product-info">
                <div className="xy-product-title">{item.commodityName}</div>
                <div className="xy-product-bottom">
                  <span className="xy-product-price">
                    <em>¥</em>{Math.floor(Number(item.price))}
                  </span>
                  <div className="xy-product-seller">
                    <Avatar size={20} icon={<UserOutlined />} />
                    <span className="xy-product-views">
                      <EyeOutlined /> {item.viewNum || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧悬浮功能栏 - Floating Action Dock */}
      <div className="floating-dock">
        {/* 发闲置 */}
        <Tooltip title="发布闲置" placement="left">
          <div className="dock-item dock-publish" onClick={() => navigate('/commodity/publish')}>
            <EditOutlined className="dock-icon" />
            <span className="dock-label">发闲置</span>
          </div>
        </Tooltip>

        {/* 分割线 */}
        <div className="dock-divider" />

        {/* APP下载 - 带二维码弹出 */}
        <Tooltip 
          title={
            <div className="dock-qr-popup">
              <QRCode value={window.location.origin} size={120} />
              <p>扫码访问移动端</p>
            </div>
          } 
          placement="left"
          color="#fff"
        >
          <div className="dock-item">
            <MobileOutlined className="dock-icon" />
            <span className="dock-label">APP</span>
          </div>
        </Tooltip>

        {/* 分割线 */}
        <div className="dock-divider" />

        {/* 反馈 */}
        <Tooltip title="意见反馈" placement="left">
          <div className="dock-item" onClick={() => navigate('/feedback')}>
            <CustomerServiceOutlined className="dock-icon" />
            <span className="dock-label">反馈</span>
          </div>
        </Tooltip>

        {/* 回到顶部 - 滚动后显示 */}
        {showBackTop && (
          <>
            <div className="dock-divider" />
            <Tooltip title="回到顶部" placement="left">
              <div 
                className="dock-item dock-backtop" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <VerticalAlignTopOutlined className="dock-icon" />
                <span className="dock-label">顶部</span>
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
