import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { userApi } from '../../api/user'

interface AdminRouteProps {
  children: React.ReactNode
}

/**
 * 管理员路由保护组件
 * 检查用户是否已登录且具有管理员权限
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { token, user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // 如果用户信息不存在，先获取用户信息
        if (!user) {
          const userInfo = await userApi.getCurrentUser()
          if (userInfo) {
            setUser(userInfo)
            setIsAdmin(userInfo.userRole === 'admin')
          } else {
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(user.userRole === 'admin')
        }
      } catch (error) {
        console.error('获取用户信息失败', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [token, user, setUser])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute

