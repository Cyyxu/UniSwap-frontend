import { useEffect, useState } from 'react'
import { Card, Row, Col, Carousel, Typography, Button, Tag } from 'antd'
import { ShoppingOutlined, FileTextOutlined, RobotOutlined, RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { commodityApi, Commodity } from '../../api/commodity'
import { postApi, Post } from '../../api/post'
import { noticeApi, Notice } from '../../api/notice'
import './index.css'

const { Title, Paragraph } = Typography

const Home = () => {
  const navigate = useNavigate()
  const [hotCommodities, setHotCommodities] = useState<Commodity[]>([])
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [commodities, posts, noticesData] = await Promise.all([
        commodityApi.getList({ current: 1, pageSize: 8, isListed: 1 }),
        postApi.getList({ current: 1, pageSize: 6 }),
        noticeApi.getList({ current: 1, pageSize: 5 }),
      ])
      setHotCommodities(commodities?.records || [])
      setLatestPosts(posts?.records || [])
      setNotices(noticesData?.records || [])
    } catch (error) {
      console.error('加载数据失败', error)
    }
  }

  const bannerImages = [
    'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
  ]

  return (
    <div className="home-container">
      {/* Banner */}
      <Carousel autoplay className="home-banner">
        {bannerImages.map((img, index) => (
          <div key={index}>
            <div
              className="banner-item"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="banner-content">
                <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
                  智能 AI 校园二手交易平台
                </Title>
                <Paragraph style={{ color: '#fff', fontSize: 18 }}>
                  让闲置物品找到新主人，让校园生活更美好
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/commodity')}
                >
                  开始交易 <RightOutlined />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* 功能入口 */}
      <Row gutter={[24, 24]} style={{ marginTop: 40, marginBottom: 40 }}>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            className="feature-card"
            onClick={() => navigate('/commodity')}
          >
            <ShoppingOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={4}>商品交易</Title>
            <Paragraph>浏览、购买、出售二手商品</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            className="feature-card"
            onClick={() => navigate('/post')}
          >
            <FileTextOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <Title level={4}>社区帖子</Title>
            <Paragraph>分享经验、交流心得</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            className="feature-card"
            onClick={() => navigate('/ai-chat')}
          >
            <RobotOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
            <Title level={4}>AI 助手</Title>
            <Paragraph>智能推荐、购物咨询</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* 热门商品 */}
      <Card
        title="🔥 热门商品"
        extra={<Button type="link" onClick={() => navigate('/commodity')}>查看更多 <RightOutlined /></Button>}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          {hotCommodities.map((item) => (
            <Col xs={12} sm={8} md={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.commodityName}
                    src={item.commodityAvatar || 'https://via.placeholder.com/200'}
                    style={{ height: 150, objectFit: 'cover' }}
                  />
                }
                onClick={() => navigate(`/commodity/${item.id}`)}
              >
                <Card.Meta
                  title={<div style={{ fontSize: 14 }}>{item.commodityName}</div>}
                  description={
                    <div>
                      <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
                        ¥{item.price}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {item.commodityTypeName}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 最新帖子 */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            title="📝 最新帖子"
            extra={<Button type="link" onClick={() => navigate('/post')}>查看更多 <RightOutlined /></Button>}
          >
            {latestPosts.map((post) => (
              <Card
                key={post.id}
                type="inner"
                hoverable
                style={{ marginBottom: 16 }}
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <Title level={5} style={{ marginBottom: 8 }}>{post.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                  {post.content}
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {(post.tagList || post.tags || []).map((tag, index) => (
                      <Tag key={`${post.id}-${tag}-${index}`} color="blue">{tag}</Tag>
                    ))}
                  </div>
                  <div style={{ color: '#999', fontSize: 12 }}>
                    👍 {post.thumbNum}  ❤️ {post.favourNum}
                  </div>
                </div>
              </Card>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="📢 公告通知">
            {notices.map((notice) => (
              <Card
                key={notice.id}
                type="inner"
                hoverable
                style={{ marginBottom: 12 }}
                onClick={() => navigate(`/notice`)}
              >
                <Title level={5} style={{ marginBottom: 4 }}>{notice.noticeTitle}</Title>
                <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12, color: '#666' }}>
                  {notice.noticeContent}
                </Paragraph>
              </Card>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home

