import { useEffect, useState } from 'react'
import { Card, Row, Col, Empty, Modal, message, Pagination, Tabs } from 'antd'
import { DeleteOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { favoriteApi } from '../../api/favorite'
import { postApi, Post, PostQuery } from '../../api/post'
import './index.css'

interface FavoriteQuery {
  current?: number
  pageSize?: number
}

const Favorites = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('commodity')

  // 商品收藏
  const [commodityLoading, setCommodityLoading] = useState(false)
  const [commodities, setCommodities] = useState<any[]>([])
  const [commodityTotal, setCommodityTotal] = useState(0)
  const [commodityQuery, setCommodityQuery] = useState<FavoriteQuery>({
    current: 1,
    pageSize: 12,
  })

  // 帖子收藏
  const [postLoading, setPostLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [postTotal, setPostTotal] = useState(0)
  const [postQuery, setPostQuery] = useState<PostQuery>({
    current: 1,
    pageSize: 12,
  })

  useEffect(() => {
    if (activeTab === 'commodity') {
      loadCommodities()
    } else {
      loadPosts()
    }
  }, [activeTab, commodityQuery, postQuery])

  const loadCommodities = async () => {
    setCommodityLoading(true)
    try {
      const res: any = await favoriteApi.getMine(commodityQuery)
      setCommodities(res?.records || [])
      setCommodityTotal(res?.total || 0)
    } catch (error) {
      console.error('加载商品收藏失败', error)
    } finally {
      setCommodityLoading(false)
    }
  }

  const loadPosts = async () => {
    setPostLoading(true)
    try {
      const res: any = await postApi.getMyFavourList(postQuery)
      setPosts(res?.records || [])
      setPostTotal(res?.total || 0)
    } catch (error) {
      console.error('加载帖子收藏失败', error)
    } finally {
      setPostLoading(false)
    }
  }

  const handleDeleteCommodity = async (commodityId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要取消收藏吗？',
      onOk: async () => {
        try {
          await favoriteApi.toggle(commodityId)
          message.success('取消收藏成功')
          loadCommodities()
        } catch (error) {
          message.error('取消收藏失败')
        }
      },
    })
  }

  const handleDeletePost = async (postId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要取消收藏吗？',
      onOk: async () => {
        try {
          await postApi.toggleFavour(postId)
          message.success('取消收藏成功')
          loadPosts()
        } catch (error) {
          message.error('取消收藏失败')
        }
      },
    })
  }

  const renderCommodityList = () => (
    <>
      {commodities.length === 0 ? (
        <Empty description="暂无商品收藏" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {commodities.map((item: any) => (
              <Col xs={12} sm={8} md={6} key={item.id}>
                <Card
                  hoverable
                  loading={commodityLoading}
                  cover={
                    <img
                      alt={item.commodityName}
                      src={item.commodityAvatar || 'https://via.placeholder.com/200'}
                      style={{ height: 150, objectFit: 'cover' }}
                      onClick={() => navigate(`/commodity/${item.id}`)}
                    />
                  }
                  actions={[
                    <ShoppingOutlined
                      key="view"
                      onClick={() => navigate(`/commodity/${item.id}`)}
                    />,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => handleDeleteCommodity(item.id)}
                    />,
                  ]}
                >
                  <Card.Meta
                    title={item.commodityName}
                    description={
                      <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
                        ¥{item.price}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={commodityQuery.current}
              pageSize={commodityQuery.pageSize}
              total={commodityTotal}
              onChange={(page, size) =>
                setCommodityQuery({ ...commodityQuery, current: page, pageSize: size })
              }
              showSizeChanger
              showTotal={(total) => `共 ${total} 件商品`}
            />
          </div>
        </>
      )}
    </>
  )

  const renderPostList = () => (
    <>
      {posts.length === 0 ? (
        <Empty description="暂无帖子收藏" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {posts.map((item) => (
              <Col xs={24} sm={12} md={8} key={item.id}>
                <Card
                  hoverable
                  loading={postLoading}
                  onClick={() => navigate(`/post/${item.id}`)}
                  actions={[
                    <FileTextOutlined key="view" />,
                    <DeleteOutlined
                      key="delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePost(item.id)
                      }}
                    />,
                  ]}
                >
                  <Card.Meta
                    title={item.title}
                    description={
                      <div>
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#666',
                          }}
                        >
                          {item.content?.replace(/<[^>]+>/g, '').slice(0, 50)}...
                        </div>
                        <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                          👍 {item.thumbNum} · ❤️ {item.favourNum}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={postQuery.current}
              pageSize={postQuery.pageSize}
              total={postTotal}
              onChange={(page, size) =>
                setPostQuery({ ...postQuery, current: page, pageSize: size })
              }
              showSizeChanger
              showTotal={(total) => `共 ${total} 篇帖子`}
            />
          </div>
        </>
      )}
    </>
  )

  return (
    <Card title="我的收藏">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'commodity',
            label: '商品收藏',
            children: renderCommodityList(),
          },
          {
            key: 'post',
            label: '帖子收藏',
            children: renderPostList(),
          },
        ]}
      />
    </Card>
  )
}

export default Favorites
