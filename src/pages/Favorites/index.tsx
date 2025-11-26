import { useEffect, useState } from 'react'
import { Card, Row, Col, Empty, Button, Modal, message, Pagination } from 'antd'
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { favoritesApi, Favorite, FavoriteQuery } from '../../api/favorites'
import './index.css'

const Favorites = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<FavoriteQuery>({
    current: 1,
    pageSize: 12,
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await favoritesApi.getMyList(query)
      setFavorites(res?.records || [])
      setTotal(res?.total || 0)
    } catch (error) {
      console.error('加载收藏失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要取消收藏吗？',
      onOk: async () => {
        try {
          await favoritesApi.delete(id)
          message.success('取消收藏成功')
          loadData()
        } catch (error) {
          message.error('取消收藏失败')
        }
      },
    })
  }

  return (
    <Card title="我的收藏">
      {favorites.length === 0 ? (
        <Empty description="暂无收藏" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {favorites.map((item) => (
              <Col xs={12} sm={8} md={6} key={item.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.commodityName}
                      src={item.commodityAvatar || 'https://via.placeholder.com/200'}
                      style={{ height: 150, objectFit: 'cover' }}
                      onClick={() => navigate(`/commodity/${item.commodityId}`)}
                    />
                  }
                  actions={[
                    <ShoppingOutlined
                      key="view"
                      onClick={() => navigate(`/commodity/${item.commodityId}`)}
                    />,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => handleDelete(item.id)}
                    />,
                  ]}
                >
                  <Card.Meta
                    title={item.commodityName}
                    description={
                      <div>
                        <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
                          ¥{item.price}
                        </div>
                        {item.remark && (
                          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                            {item.remark}
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={query.current}
              pageSize={query.pageSize}
              total={total}
              onChange={(page, size) => setQuery({ ...query, current: page, pageSize: size })}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 件收藏`}
            />
          </div>
        </>
      )}
    </Card>
  )
}

export default Favorites

