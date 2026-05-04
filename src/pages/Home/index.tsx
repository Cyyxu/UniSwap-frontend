import { useEffect, useState, useRef } from 'react'
import { Input, Button, Badge, Avatar, Dropdown, Tooltip, QRCode, message } from 'antd'
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
  VerticalAlignTopOutlined,
  SendOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  ExperimentOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { commodityApi, Commodity, CommodityStatus } from '../../api/commodity'
import { commodityTypeApi, CommodityType } from '../../api/commodityType'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { userApi } from '../../api/user'
import { getAccessToken } from '../../utils/auth'
import api from '../../api/request'
// SSE流式聊天函数
const streamChat = async (
  userInputText: string,
  onMessage: (text: string) => void,
  onDone: (messageId?: string) => void,
  onError: (error: string) => void
) => {
  const baseURL = import.meta.env.PROD 
    ? '/uniswap'  // 生产环境使用相对路径，通过 Nginx 代理
    : '/uniswap'
  
  try {
    // 🔥 关键步骤1：发起流式请求前，先用 axios 发一个轻量级请求
    // 目的：触发 request.ts 的拦截器，如果 Token 过期会自动刷新
    try {
      await api.post('/api/user/current', {})
    } catch (error) {
      console.error('[Stream] Token 预检失败:', error)
      throw new Error('请先登录')
    }
    
    // 🔥 关键步骤2：此时内存中的 Token 一定是最新的
    const token = getAccessToken()
    
    if (!token) {
      throw new Error('未获取到有效 Token，请重新登录')
    }
    
    // 🔥 关键步骤3：使用新鲜的 Token 发起流式请求
    const response = await fetch(`${baseURL}/api/llm/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userInputText }),
      credentials: 'include', // 确保携带 Cookie（Refresh Token）
    })

    // 🔥 如果还是 401，说明 Refresh Token 也过期了
    if (response.status === 401) {
      throw new Error('登录已过期，请重新登录')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No reader available')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        // 流结束时，检查buffer中是否有剩余数据
        if (buffer.trim()) {
          console.log('[Stream] 流结束，处理剩余buffer:', buffer.substring(0, 100))
          // 检查是否包含结束标记
          if (buffer.includes('{"errorCode"')) {
            const match = buffer.match(/\{"errorCode"[^}]*\}/);
            if (match) {
              try {
                const endData = JSON.parse(match[0])
                console.log('[Stream] 在buffer中找到结束标记:', endData)
                onDone()
                return
              } catch (e) {
                console.error('[Stream] 解析buffer中的结束标记失败:', e)
              }
            }
          }
        }
        break
      }

      buffer += decoder.decode(value, { stream: true })
      
      // 检查buffer中是否包含结束标记（可能在同一行）
      if (buffer.includes('{"errorCode"')) {
        const match = buffer.match(/\{"errorCode"[^}]*\}/);
        if (match) {
          try {
            const endData = JSON.parse(match[0])
            console.log('[Stream] 在buffer中找到结束标记:', endData)
            onDone()
            return
          } catch (e) {
            // 继续处理
          }
        }
      }
      
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        // 先检查是否是结束标记（不带data:前缀的JSON）
        if (line.trim().startsWith('{') && line.includes('errorCode')) {
          try {
            const parsed = JSON.parse(line.trim())
            if (parsed && typeof parsed === 'object' && 'errorCode' in parsed) {
              console.log('[Stream] 收到结束标记（无data前缀）:', parsed)
              onDone()
              return
            }
          } catch {
            // 不是有效的JSON，继续处理
          }
        }
        
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (!data) continue
          
          try {
            const parsed = JSON.parse(data)
            
            // 检查是否是后端的结束标记 {"errorCode":0,...}
            if (parsed && typeof parsed === 'object' && 'errorCode' in parsed) {
              console.log('[Stream] 收到结束标记:', parsed)
              onDone()
              return
            }
            
            if (parsed && typeof parsed === 'object' && parsed.type === 'MESSAGE') {
              onMessage(parsed.content || '')
            } else if (parsed && typeof parsed === 'object' && parsed.type === 'token') {
              // 兼容标准SSE格式
              onMessage(parsed.content || '')
            } else if (parsed && typeof parsed === 'object' && parsed.type === 'DONE') {
              onDone(parsed.messageId)
              return
            } else if (parsed && typeof parsed === 'object' && parsed.type === 'done') {
              // 兼容小写
              onDone(parsed.messageId)
              return
            } else if (parsed && typeof parsed === 'object' && parsed.type === 'ERROR') {
              onError(parsed.content || '请求失败')
              return
            } else if (parsed && typeof parsed === 'object' && parsed.type === 'error') {
              // 兼容小写
              onError(parsed.message || parsed.content || '请求失败')
              return
            } else {
              // JSON.parse 成功但不是预期的对象格式（如纯数字、字符串）
              onMessage(String(data))
            }
          } catch {
            // JSON解析失败，说明是纯文本消息
            if (data !== '[DONE]') {
              onMessage(data)
            }
          }
        }
      }
    }
    onDone()
  } catch (error: any) {
    onError(error.message || '请求失败')
  }
}
import './index.css'

// 分类图标映射（驼峰命名）
const categoryIcons: Record<string, string> = {
  '手机通讯': '📱', '电脑办公': '💻', '数码配件': '🎧', '图书教材': '📚',
  '文学小说': '📖', '运动户外': '🏃', '健身器材': '💪', '乐器爱好': '🎸',
  '校园代步': '🚲', '家用电器': '🏠', '宿舍日用': '🛋️', '男装女装': '👔',
  '鞋靴箱包': '👜', '美妆护肤': '💄', '零食饮品': '🍪', '票务转让': '🎫',
  '生活服务': '🔧', '游戏设备': '🎮', '考研考证': '📝', '其他闲置': '📦',
}

const Home = () => {
  const navigate = useNavigate()
  const { token, user, logout } = useAuthStore()
  const { totalCount, fetchCart } = useCartStore()
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [categories, setCategories] = useState<CommodityType[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [showBackTop, setShowBackTop] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', content: string, streaming?: boolean}[]>([
    { role: 'ai', content: '你好！我是UniSwap AI助手，有什么可以帮你的吗？' }
  ])
  const aiMessagesRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (aiMessagesRef.current) {
      aiMessagesRef.current.scrollTop = aiMessagesRef.current.scrollHeight
    }
  }

  // 当消息变化时自动滚动
  useEffect(() => {
    scrollToBottom()
  }, [aiMessages])

  useEffect(() => {
    loadCommodities()
    loadCategories()
    
    // 登录后加载购物车
    if (token) {
      fetchCart()
    }
    
    // 监听滚动，控制"回到顶部"按钮显示
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadCategories = async () => {
    try {
      const result = await commodityTypeApi.page({ current: 1, pageSize: 100 })
      console.log('[Home] 加载分类结果:', result)
      setCategories(result?.records || [])
    } catch (error) {
      console.error('加载分类失败', error)
    }
  }

  const loadCommodities = async () => {
    try {
      const result = await commodityApi.page({ 
        current: 1, 
        pageSize: 20
      })
      console.log('[Home] 加载商品结果:', result)
      setCommodities(result?.records || [])
    } catch (error) {
      console.error('加载商品失败', error)
      setCommodities([])
    }
  }

  // 根据分类名称获取typeId
  const getTypeIdByName = (name: string) => {
    const cat = categories.find(c => c.typeName === name)
    return cat?.id
  }

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
      title: '鞋靴箱包',
      subtitle: '时尚好物低价淘',
      bg: '#FFF5F5',
      textColor: '#333',
      tagBg: '#FF6B6B',
      typeName: '鞋靴箱包',
      products: [] as Commodity[],
    },
    {
      id: 'digital',
      title: '数码配件',
      subtitle: '热门装备省心入',
      bg: '#F0F7FF',
      textColor: '#333',
      tagBg: '#4DABF7',
      typeName: '数码配件',
      products: [] as Commodity[],
    },
    {
      id: 'acg',
      title: '图书教材',
      subtitle: '知识好物随手得',
      bg: '#F0FFF4',
      textColor: '#333',
      tagBg: '#51CF66',
      typeName: '图书教材',
      products: [] as Commodity[],
    },
  ]

  // 获取各分类商品预览
  const getProductsForSection = (typeName?: string, sortField?: string) => {
    let filtered = [...commodities]
    if (typeName) {
      const typeId = getTypeIdByName(typeName)
      if (typeId) {
        filtered = filtered.filter(c => c.commodityTypeId === typeId)
      }
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
    { key: 'order', icon: <OrderedListOutlined />, label: '我的订单' },
    { key: 'ai-chat', icon: <RobotOutlined />, label: 'AI 助手' },
    { key: 'message', icon: <MessageOutlined />, label: '私信' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    { key: 'register-test', icon: <ExperimentOutlined />, label: '注册测试' },
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
            <div
              className="xy-nav-item"
              onClick={() => navigate(token ? '/cart' : '/login')}
            >
              <Badge count={totalCount} size="small" overflowCount={99}>
                <ShoppingCartOutlined className="xy-nav-icon" style={{ fontSize: 24 }} />
              </Badge>
            </div>
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
                  onClick={() => navigate('/commodity-manage')}
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
          {/* 将分类两两分组显示 */}
          {Array.from({ length: Math.ceil(categories.length / 2) }, (_, i) => {
            const cat1 = categories[i * 2]
            const cat2 = categories[i * 2 + 1]
            return (
              <div 
                key={cat1?.id || i} 
                className="xy-category-item"
                onClick={() => openCategory(cat1?.id)}
              >
                <span className="xy-cat-icon">{categoryIcons[cat1?.typeName] || '📦'}</span>
                <span className="xy-cat-name">{cat1?.typeName}</span>
                {cat2 && (
                  <>
                    <span className="xy-cat-divider">/</span>
                    <span className="xy-cat-sub" onClick={(e) => { e.stopPropagation(); openCategory(cat2.id) }}>{cat2.typeName}</span>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* 中间 Bento Grid 区域 */}
        <div className="xy-bento-area">
          <div className="xy-bento-grid">
            {/* 左侧主推卡片 - 跨4行 */}
            <div 
              className="xy-bento-main"
              style={{ background: bentoSections[0].bg, gridColumn: 1, gridRow: '1 / 5' }}
              onClick={() => openCategory(undefined, { sortField: 'price', sortOrder: 'ascend' })}
            >
              <div className="xy-bento-main-content">
                <h2>{bentoSections[0].title}</h2>
                <p>{bentoSections[0].subtitle}</p>
                <span className="xy-bento-main-badge">{bentoSections[0].badge}</span>
                <div className="xy-bento-main-action">去看看 &gt;</div>
              </div>
              <div className="xy-bento-main-images-grid">
                {commodities[0] && (
                  <img src={commodities[0].commodityAvatar} alt="" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${commodities[0].id}`) }} />
                )}
              </div>
            </div>

            {/* 中间 - 箱包（跨4行，单张大图铺满） */}
            <div 
              className="xy-bento-card xy-bento-card-center"
              style={{ background: bentoSections[1].bg, gridColumn: 2, gridRow: '1 / 5' }}
              onClick={() => openCategory(getTypeIdByName('箱包'))}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[1].tagBg }}>
                  {bentoSections[1].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[1].subtitle}</span>
              </div>
              <div className="xy-bento-single-image">
                {commodities[0] && (
                  <img src={commodities[0].commodityAvatar} alt="" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${commodities[0].id}`) }} />
                )}
              </div>
            </div>

            {/* 右侧上 - 数码（跨1-2行） */}
            <div 
              className="xy-bento-card xy-bento-card-right"
              style={{ background: bentoSections[2].bg, gridColumn: 3, gridRow: '1 / 3' }}
              onClick={() => openCategory(getTypeIdByName('数码'))}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[2].tagBg }}>
                  {bentoSections[2].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[2].subtitle}</span>
              </div>
              <div className="xy-bento-products">
                {(getProductsForSection('数码配件').length > 0 ? getProductsForSection('数码配件') : commodities.slice(0, 3)).map((item, i) => (
                  <div key={i} className="xy-bento-product" onClick={(e) => { e.stopPropagation(); navigate(`/commodity/${item.id}`) }}>
                    <img src={item.commodityAvatar} alt="" />
                    <span className="xy-bento-price">¥{Math.floor(Number(item.price))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧下 - 教材（跨3-4行） */}
            <div 
              className="xy-bento-card xy-bento-card-right"
              style={{ background: bentoSections[3].bg, gridColumn: 3, gridRow: '3 / 5' }}
              onClick={() => openCategory(getTypeIdByName('教材'))}
            >
              <div className="xy-bento-card-header">
                <span className="xy-bento-tag" style={{ background: bentoSections[3].tagBg }}>
                  {bentoSections[3].title}
                </span>
                <span className="xy-bento-subtitle">{bentoSections[3].subtitle}</span>
              </div>
              <div className="xy-bento-products">
                {(getProductsForSection('图书教材').length > 0 ? getProductsForSection('图书教材') : commodities.slice(0, 3)).map((item, i) => (
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
          <div className="dock-item dock-publish" onClick={() => navigate('/commodity-manage')}>
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

        {/* AI助手 */}
        <Tooltip title="AI助手" placement="left">
          <div className="dock-item dock-ai" onClick={() => setShowAiChat(!showAiChat)}>
            <RobotOutlined className="dock-icon" />
            <span className="dock-label">AI</span>
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

      {/* 页脚备案信息 */}
      <div className="xy-footer">
        <div>UniSwap - 智能校园二手交易平台 ©2024</div>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          湘ICP备2025135383号-1
        </a>
      </div>

      {/* AI聊天框 */}
      {showAiChat && (
        <div className="ai-chat-box">
          <div className="ai-chat-header">
            <RobotOutlined />
            <span>AI助手</span>
            <CloseOutlined className="ai-chat-close" onClick={() => setShowAiChat(false)} />
          </div>
          <div className="ai-chat-messages" ref={aiMessagesRef}>
            {aiMessages.map((msg, i) => (
              <div key={i} className={`ai-chat-message ${msg.role}`}>
                {msg.role === 'ai' && <Avatar size={32} icon={<RobotOutlined />} className="home-ai-avatar" />}
                <div className="ai-chat-bubble">
                  {msg.content}
                </div>
                {msg.role === 'user' && <Avatar size={32} icon={<UserOutlined />} className="home-user-avatar" />}
              </div>
            ))}
          </div>
          <div className="ai-chat-input">
            <Input
              placeholder="输入你的问题..."
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              disabled={aiLoading}
              onPressEnter={() => {
                if (aiMessage.trim() && !aiLoading) {
                  if (!token) {
                    message.warning('请先登录后再使用AI助手')
                    return
                  }
                  const userMsg = aiMessage.trim()
                  setAiMessages(prev => [...prev, { role: 'user', content: userMsg }])
                  setAiMessage('')
                  setAiLoading(true)
                  // 添加一个空的AI消息用于流式显示
                  setAiMessages(prev => [...prev, { role: 'ai', content: '', streaming: true }])
                  
                  streamChat(
                    userMsg,
                    (text) => {
                      // 逐字更新最后一条AI消息
                      setAiMessages(prev => {
                        const newMsgs = [...prev]
                        const lastMsg = newMsgs[newMsgs.length - 1]
                        if (lastMsg && lastMsg.role === 'ai') {
                          lastMsg.content += text
                        }
                        return newMsgs
                      })
                    },
                    () => {
                      // 完成时移除streaming标记
                      setAiMessages(prev => {
                        const newMsgs = [...prev]
                        const lastMsg = newMsgs[newMsgs.length - 1]
                        if (lastMsg && lastMsg.role === 'ai') {
                          lastMsg.streaming = false
                        }
                        return newMsgs
                      })
                      setAiLoading(false)
                    },
                    (error) => {
                      setAiMessages(prev => {
                        const newMsgs = [...prev]
                        const lastMsg = newMsgs[newMsgs.length - 1]
                        if (lastMsg && lastMsg.role === 'ai') {
                          lastMsg.content = `抱歉，请求失败：${error}`
                          lastMsg.streaming = false
                        }
                        return newMsgs
                      })
                      setAiLoading(false)
                    }
                  )
                }
              }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              loading={aiLoading}
              onClick={() => {
                if (aiMessage.trim() && !aiLoading) {
                  if (!token) {
                    message.warning('请先登录后再使用AI助手')
                    return
                  }
                  const userMsg = aiMessage.trim()
                  setAiMessages(prev => [...prev, { role: 'user', content: userMsg }])
                  setAiMessage('')
                  setAiLoading(true)
                  setAiMessages(prev => [...prev, { role: 'ai', content: '', streaming: true }])
                  
                  streamChat(
                    userMsg,
                    (text) => {
                      setAiMessages(prev => {
                        const newMsgs = [...prev]
                        const lastMsg = newMsgs[newMsgs.length - 1]
                        if (lastMsg && lastMsg.role === 'ai') {
                          lastMsg.content += text
                        }
                        return newMsgs
                      })
                    },
                    () => {
                      setAiMessages(prev => {
                        const newMsgs = [...prev]
                        const lastMsg = newMsgs[newMsgs.length - 1]
                        if (lastMsg && lastMsg.role === 'ai') {
                          lastMsg.streaming = false
                        }
                        return newMsgs
                      })
                      setAiLoading(false)
                    },
                    (error) => {
                      setAiMessages(prev => {
                        const newMsgs = [...prev]
                        const lastMsg = newMsgs[newMsgs.length - 1]
                        if (lastMsg && lastMsg.role === 'ai') {
                          lastMsg.content = `抱歉，请求失败：${error}`
                          lastMsg.streaming = false
                        }
                        return newMsgs
                      })
                      setAiLoading(false)
                    }
                  )
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
