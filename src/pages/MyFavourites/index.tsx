import React, { useEffect, useState } from 'react'
import { Card, List, message, Empty, Spin, Tag } from 'antd'
import { HeartOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../api/request'
import { Post } from '../../api/post'
import './index.css'

const MyFavourites: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const navigate = useNavigate()

  const loadFavourites = async (page: number = 1) => {
    setLoading(true)
    try {
      const res = await api.post('/post_favour/my/list/page', {
        current: page,
        pageSize,
      })
      setPosts(res.data.records || [])
      setTotal(res.data.total || 0)
      setCurrent(page)
    } catch (error: any) {
      message.error(error.message || '加载收藏列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavourites()
  }, [])

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`)
  }

  const handlePageChange = (page: number) => {
    loadFavourites(page)
  }

  return (
    <div className="my-favourites-container">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartOutlined style={{ color: '#ff4d4f' }} />
            <span>我的收藏</span>
            <Tag color="blue">{total} 篇</Tag>
          </div>
        }
        bordered={false}
      >
        <Spin spinning={loading}>
          {posts.length === 0 && !loading ? (
            <Empty description="暂无收藏的帖子" />
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
                          {new Date(post.createTime).toLocaleDateString()}
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

export default MyFavourites
