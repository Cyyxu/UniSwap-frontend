import React, { useEffect, useState } from 'react'
import { Card, List, message, Empty, Spin, Tag, Avatar } from 'antd'
import { HeartOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/request'
import { Post } from '../../api/post'
import { userApi, User } from '../../api/user'
import './index.css'

const UserFavourites: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const navigate = useNavigate()

  const normalizePosts = (records: any[] = []): Post[] =>
    records.map((item) => {
      const { createTime, ...rest } = item
      return { ...rest, createdAt: item.createdAt || createTime || '' }
    })

  const userId = searchParams.get('userId')

  // 加载用户信息
  const loadUserInfo = async () => {
    if (!userId) return
    
    try {
      const user = await userApi.getUserById(Number(userId))
      setUserInfo(user)
    } catch (error: any) {
      console.error('加载用户信息失败', error)
    }
  }

  const loadUserFavourites = async (page: number = 1) => {
    if (!userId) {
      message.error('缺少用户ID参数')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/post_favour/list/page', {
        userId: Number(userId),
        current: page,
        pageSize,
      })
      setPosts(normalizePosts(res.data.records))
      setTotal(res.data.total || 0)
      setCurrent(page)
    } catch (error: any) {
      if (!error.handled) {
        message.error(error.message || '加载收藏列表失败')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserInfo()
    loadUserFavourites()
  }, [userId])

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`)
  }

  const handlePageChange = (page: number) => {
    loadUserFavourites(page)
  }

  return (
    <div className="user-favourites-container">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              size={40} 
              src={userInfo?.userAvatar} 
              icon={<UserOutlined />}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{userInfo?.userName || '用户'} 的收藏</div>
              <Tag color="blue" style={{ marginTop: 4 }}>{total} 篇</Tag>
            </div>
          </div>
        }
        bordered={false}
      >
        <Spin spinning={loading}>
          {posts.length === 0 && !loading ? (
            <Empty description="该用户暂无收藏" />
          ) : (
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                current,
                pageSize,
                total,
                onChange: handlePageChange,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 篇帖子`,
              }}
              dataSource={posts}
              renderItem={(post) => (
                <List.Item
                  key={post.id}
                  className="post-item"
                  onClick={() => handlePostClick(post.id)}
                  actions={[
                    <span key="thumb">
                      <LikeOutlined /> {post.thumbNum || 0}
                    </span>,
                    <span key="favour">
                      <HeartOutlined /> {post.favourNum || 0}
                    </span>,
                  ]}
                  extra={
                    post.user?.userAvatar && (
                      <img
                        width={120}
                        alt="avatar"
                        src={post.user.userAvatar}
                      />
                    )
                  }
                >
                  <List.Item.Meta
                    title={
                      <a onClick={(e) => {
                        e.stopPropagation()
                        handlePostClick(post.id)
                      }}>
                        {post.title}
                      </a>
                    }
                    description={
                      <div>
                        <span>作者: {post.user?.userName || '未知'}</span>
                        <span style={{ marginLeft: 16 }}>
                          {new Date(post.createdAt || '').toLocaleDateString()}
                        </span>
                      </div>
                    }
                  />
                  <div className="post-content">
                    {post.content?.substring(0, 200)}
                    {post.content && post.content.length > 200 ? '...' : ''}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {post.tags.map((tag, index) => (
                        <Tag key={index} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default UserFavourites
