import { useEffect, useState } from 'react'
import { Card, Row, Col, Input, Select, Button, Pagination, Empty, Tag } from 'antd'
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { commodityApi, Commodity, CommodityQuery } from '../../api/commodity'
import './index.css'

const { Search } = Input
const { Option } = Select

const CommodityList = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<CommodityQuery>({
    current: 1,
    pageSize: 12,
    isListed: 1,
    commodityName: searchParams.get('search') || undefined,
    commodityTypeId: searchParams.get('typeId') ? Number(searchParams.get('typeId')) : undefined,
    sortField: searchParams.get('sortField') || undefined,
    sortOrder: searchParams.get('sortOrder') || undefined,
  })

  const syncFiltersToUrl = (state: CommodityQuery) => {
    const params = new URLSearchParams()
    if (state.commodityName) params.set('search', state.commodityName)
    if (state.commodityTypeId) params.set('typeId', String(state.commodityTypeId))
    if (state.sortField && state.sortOrder) {
      params.set('sortField', state.sortField)
      params.set('sortOrder', state.sortOrder)
    }
    setSearchParams(params)
  }

  useEffect(() => {
    loadData()
  }, [query])

  useEffect(() => {
    const typeId = searchParams.get('typeId')
    const commodityName = searchParams.get('search')
    const sortField = searchParams.get('sortField')
    const sortOrder = searchParams.get('sortOrder')

    setQuery((prev) => {
      const next: CommodityQuery = {
        ...prev,
        current: 1,
        isListed: 1,
        commodityTypeId: typeId ? Number(typeId) : undefined,
        commodityName: commodityName || undefined,
        sortField: sortField || undefined,
        sortOrder: sortOrder || undefined,
      }

      const unchanged =
        prev.commodityTypeId === next.commodityTypeId &&
        prev.commodityName === next.commodityName &&
        prev.sortField === next.sortField &&
        prev.sortOrder === next.sortOrder

      return unchanged ? prev : next
    })
  }, [searchParams])

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
    const keyword = value.trim()
    const merged: CommodityQuery = {
      ...query,
      commodityName: keyword || undefined,
      current: 1,
    }
    setQuery(merged)
    syncFiltersToUrl(merged)
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
            defaultValue={query.commodityName}
            style={{ maxWidth: 500 }}
          />
          <Select
            placeholder="排序方式"
            style={{ width: 200 }}
            value={query.sortField && query.sortOrder ? `${query.sortField}_${query.sortOrder}` : undefined}
            onChange={(value) => {
              const [field, order] = value.split('_')
              const merged: CommodityQuery = {
                ...query,
                sortField: field,
                sortOrder: order,
                current: 1,
              }
              setQuery(merged)
              syncFiltersToUrl(merged)
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
