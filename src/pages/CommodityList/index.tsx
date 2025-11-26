import { useEffect, useState } from 'react'
import { Card, Row, Col, Input, Select, Button, Pagination, Empty, Tag } from 'antd'
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { commodityApi, Commodity, CommodityQuery } from '../../api/commodity'
import './index.css'

const { Search } = Input
const { Option } = Select

const CommodityList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<CommodityQuery>({
    current: 1,
    pageSize: 12,
    isListed: 1,
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await commodityApi.getList(query)
      setCommodities(res?.records || [])
      setTotal(res?.total || 0)
    } catch (error) {
      console.error('加载商品失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setQuery({ ...query, commodityName: value, current: 1 })
  }

  return (
    <div className="commodity-list-container">
      <Card>
        <div className="search-bar">
          <Search
            placeholder="搜索商品名称"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 500 }}
          />
          <Select
            placeholder="排序方式"
            style={{ width: 200 }}
            onChange={(value) => {
              const [field, order] = value.split('_')
              setQuery({ ...query, sortField: field, sortOrder: order, current: 1 })
            }}
          >
            <Option value="createTime_descend">最新发布</Option>
            <Option value="price_ascend">价格从低到高</Option>
            <Option value="price_descend">价格从高到低</Option>
            <Option value="viewNum_descend">最多浏览</Option>
          </Select>
        </div>
      </Card>

      {commodities.length === 0 ? (
        <Card style={{ marginTop: 24 }}>
          <Empty description="暂无商品" />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {commodities.map((item) => (
              <Col xs={12} sm={8} md={6} key={item.id}>
                <Card
                  hoverable
                  loading={loading}
                  cover={
                    <div
                      className="commodity-image"
                      style={{
                        backgroundImage: `url(${item.commodityAvatar || 'https://via.placeholder.com/200'})`,
                      }}
                      onClick={() => navigate(`/commodity/${item.id}`)}
                    />
                  }
                >
                  <Card.Meta
                    title={
                      <div
                        className="commodity-title"
                        onClick={() => navigate(`/commodity/${item.id}`)}
                      >
                        {item.commodityName}
                      </div>
                    }
                    description={
                      <div>
                        <div className="commodity-price">¥{item.price}</div>
                        <div className="commodity-info">
                          <Tag color="blue">{item.commodityTypeName}</Tag>
                          <span>库存: {item.commodityInventory}</span>
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
              current={query.current}
              pageSize={query.pageSize}
              total={total}
              onChange={(page, size) => setQuery({ ...query, current: page, pageSize: size })}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 件商品`}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default CommodityList

