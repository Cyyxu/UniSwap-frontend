import { useEffect, useState } from 'react'
import { Card, Input, Button, Pagination, Empty, Tag, Avatar, Space } from 'antd'
import { SearchOutlined, LikeOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { postApi, Post, PostQuery } from '../../api/post'
import dayjs from 'dayjs'
import './index.css'

const { Search } = Input

const PostList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<PostQuery>({
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await postApi.getList(query)
      setPosts(res?.records || [])
      // 确保 total 是数字类型
      setTotal(Number(res?.total) || 0)
    } catch (error) {
      console.error('加载帖子失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setQuery({ ...query, searchText: value, current: 1 })
  }

  return (
    <div className="post-list-container">
      <Card>
        <div className="search-bar">
          <Search
            placeholder="搜索帖子"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 500 }}
          />
          <Button type="primary" onClick={() => navigate('/post/create')}>
            发布帖子
          </Button>
        </div>
      </Card>

      {posts.length === 0 ? (
        <Card style={{ marginTop: 24 }}>
          <Empty description="暂无帖子" />
        </Card>
      ) : (
        <>
          <div className="post-list" style={{ marginTop: 24 }}>
            {posts.map((post) => (
              <Card
                key={post.id}
                hoverable
                className="post-card"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="post-header">
                  <Avatar 
                    src={post.user?.userAvatar || post.userAvatar} 
                    icon={<span>{(post.user?.userName || post.userName)?.[0] || 'U'}</span>} 
                  />
                  <div className="post-meta">
                    <div className="post-author">{post.user?.userName || post.userName || '未知用户'}</div>
                    <div className="post-time">{dayjs(post.createTime).format('YYYY-MM-DD HH:mm')}</div>
                  </div>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
                <div className="post-footer">
                  <div className="post-tags">
                    {(post.tagList || post.tags || []).map((tag, index) => (
                      <Tag key={`${post.id}-${tag}-${index}`} color="blue">{tag}</Tag>
                    ))}
                  </div>
                  <Space>
                    <span><LikeOutlined /> {post.thumbNum}</span>
                    <span><HeartOutlined /> {post.favourNum}</span>
                    <span><MessageOutlined /> 0</span>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={query.current}
              pageSize={query.pageSize}
              total={total}
              onChange={(page, size) => setQuery({ ...query, current: page, pageSize: size })}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条帖子`}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default PostList

