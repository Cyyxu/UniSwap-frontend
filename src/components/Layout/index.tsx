import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button } from 'antd'
import {
  HomeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  HeartOutlined,
  RobotOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import { useEffect } from 'react'
import { userApi } from '../../api/user'
import FloatingDock from '../FloatingDock'
import './index.css'

const { Header, Content, Footer } = AntLayout

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user, setUser, logout } = useAuthStore()

  useEffect(() => {
    if (token && !user) {
      userApi.getCurrentUser().then((data: any) => {
        setUser(data)
      })
    }
  }, [token, user, setUser])

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/commodity', icon: <ShoppingOutlined />, label: '商品' },
    { key: '/post', icon: <FileTextOutlined />, label: '帖子' },
    { key: '/notice', icon: <BellOutlined />, label: '公告' },
  ]

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

  // 首页使用自己的导航栏
  const isHomePage = location.pathname === '/'
  // 登录/注册页不显示悬浮栏
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {!isHomePage && (
        <Header style={{ 
          background: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 50px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div 
            style={{ 
              fontSize: 22, 
              fontWeight: 'bold', 
              color: '#FF6B00',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onClick={() => navigate('/')}
          >
            🔄 UniSwap
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {token ? (
            <>
              <Button 
                type="link" 
                onClick={() => navigate('/commodity-manage')}
                style={{ color: '#FF6B00' }}
              >
                发布商品
              </Button>
              <Button 
                type="link" 
                onClick={() => navigate('/post/create')}
                style={{ color: '#FF6B00' }}
              >
                发布帖子
              </Button>
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleMenuClick }}
                placement="bottomRight"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <Avatar src={user?.userAvatar} icon={<UserOutlined />} />
                  <span>{user?.userName || '用户'}</span>
                </div>
              </Dropdown>
            </>
          ) : (
            <>
              <Button type="link" onClick={() => navigate('/login')} style={{ color: '#333' }}>
                登录
              </Button>
              <Button 
                type="primary" 
                onClick={() => navigate('/register')}
                style={{ background: '#FF6B00', borderColor: '#FF6B00' }}
              >
                注册
              </Button>
            </>
          )}
        </div>
      </Header>
      )}
      <Content style={{ padding: isHomePage ? '0' : '24px 50px', flex: 1 }}>
        <Outlet />
      </Content>
      {/* 悬浮功能栏 - 首页和登录/注册页面不显示 */}
      {!isHomePage && !isAuthPage && <FloatingDock />}
      {!isHomePage && (
        <Footer style={{ textAlign: 'center', background: '#fff', color: '#999' }}>
          🔄 UniSwap - 智能校园二手交易平台 ©2024
        </Footer>
      )}
    </AntLayout>
  )
}

export default Layout

