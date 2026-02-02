import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Avatar, Descriptions, Button, message, Spin } from 'antd'
import { UserOutlined, LeftOutlined, MessageOutlined } from '@ant-design/icons'
import { userApi, User } from '../../api/user'
import { useAuthStore } from '../../store/authStore'
import './index.css'

const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user: currentUser } = useAuthStore()
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadUserInfo()
    }
  }, [id])

  const loadUserInfo = async () => {
    if (!id) return
    
    setLoading(true)
    try {
      console.log('[UserProfile] 请求用户信息，ID:', id)
      const user = await userApi.getUserById(Number(id)) as any
      console.log('[UserProfile] 获取到的用户信息:', user)
      setUserInfo(user)
    } catch (error: any) {
      console.error('[UserProfile] 加载用户信息失败:', error)
      if (!error.handled) {
        message.error(error?.message || '加载用户信息失败')
      }
      // 加载失败后返回上一页
      setTimeout(() => navigate(-1), 1500)
    } finally {
      setLoading(false)
    }
  }

  const handleContactUser = () => {
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!id) return
    
    // 跳转到私信页面
    navigate(`/message?recipientId=${id}`)
  }

  const handleViewFavourites = () => {
    navigate(`/user-favourites?userId=${id}`)
  }

  if (loading) {
    return (
      <div className="user-profile-loading">
        <Spin size="large" />
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="user-profile-error">
        <p>用户信息加载失败</p>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    )
  }

  const isCurrentUser = currentUser?.id === userInfo.id

  return (
    <div className="user-profile-container">
      <Card className="user-profile-card">
        <div className="profile-header">
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={() => navigate(-1)}
            className="back-btn"
          />
          <h2>用户主页</h2>
        </div>

        <div className="profile-info">
          <Avatar 
            size={100} 
            src={userInfo.userAvatar} 
            icon={<UserOutlined />}
            className="profile-avatar"
          />
          <div className="profile-details">
            <h1 className="profile-name">{userInfo.userName}</h1>
            <p className="profile-account">账号: {userInfo.userAccount}</p>
            <p className="profile-role">
              {userInfo.userRole === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
        </div>

        <Descriptions bordered column={1} className="profile-descriptions">
          <Descriptions.Item label="用户ID">{userInfo.id}</Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {new Date(userInfo.createTime).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        {!isCurrentUser && token && (
          <div className="profile-actions">
            <Button 
              type="primary" 
              icon={<MessageOutlined />}
              onClick={handleContactUser}
              size="large"
            >
              发私信
            </Button>
            <Button 
              onClick={handleViewFavourites}
              size="large"
            >
              查看TA的收藏
            </Button>
          </div>
        )}

        {isCurrentUser && (
          <div className="profile-actions">
            <Button 
              type="primary"
              onClick={() => navigate('/user')}
              size="large"
            >
              编辑个人信息
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UserProfile
