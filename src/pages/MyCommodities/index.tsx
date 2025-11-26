import React, { useEffect, useState } from 'react'
import { Card, List, message, Empty, Spin, Tag, Button } from 'antd'
import { ShopOutlined, EyeOutlined, HeartOutlined, DollarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../api/request'
import { Commodity } from '../../api/commodity'
import './index.css'

const MyCommodities: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const navigate = useNavigate()

  const loadMyCommodities = async (page: number = 1) => {
    setLoading(true)
    try {
      const res = await api.post('/commodity/my/list/page/vo', {
        current: page,
        pageSize,
      })
      setCommodities(res.data.records || [])
      setTotal(res.data.total || 0)
      setCurrent(page)
    } catch (error: any) {
      message.error(error.message || '加载商品列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyCommodities()
  }, [])

  const handleCommodityClick = (commodityId: number) => {
    navigate(`/commodity/${commodityId}`)
  }

  const handlePageChange = (page: number) => {
    loadMyCommodities(page)
  }

  const getStatusTag = (isListed: number) => {
    return isListed === 1 ? (
      <Tag color="success">已上架</Tag>
    ) : (
      <Tag color="default">已下架</Tag>
    )
  }

  return (
    <div className="my-commodities-container">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShopOutlined style={{ color: '#1890ff' }} />
            <span>我的商品</span>
            <Tag color="blue">{total} 件</Tag>
          </div>
        }
        bordered={false}
      >
        <Spin spinning={loading}>
          {commodities.length === 0 && !loading ? (
            <Empty description="暂无发布的商品" />
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
                showTotal: (total) => `共 ${total} 件商品`,
              }}
              dataSource={commodities}
              renderItem={(commodity) => (
                <List.Item
                  key={commodity.id}
                  className="commodity-item"
                  onClick={() => handleCommodityClick(commodity.id)}
                  actions={[
                    <span key="view">
                      <EyeOutlined /> {commodity.viewNum || 0}
                    </span>,
                    <span key="favour">
                      <HeartOutlined /> {commodity.favourNum || 0}
                    </span>,
                    <span key="price" style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                      <DollarOutlined /> ¥{commodity.price}
                    </span>,
                  ]}
                  extra={
                    commodity.commodityAvatar && (
                      <img
                        width={200}
                        alt="商品图片"
                        src={commodity.commodityAvatar}
                        style={{ borderRadius: 8 }}
                      />
                    )
                  }
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <a onClick={(e) => {
                          e.stopPropagation()
                          handleCommodityClick(commodity.id)
                        }}>
                          {commodity.commodityName}
                        </a>
                        {getStatusTag(commodity.isListed)}
                        {commodity.commodityTypeName && (
                          <Tag color="blue">{commodity.commodityTypeName}</Tag>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <div>成色: {commodity.degree}</div>
                        <div>库存: {commodity.commodityInventory} 件</div>
                        <div style={{ marginTop: 4, color: '#999', fontSize: '12px' }}>
                          发布时间: {new Date(commodity.createTime).toLocaleDateString()}
                        </div>
                      </div>
                    }
                  />
                  <div className="commodity-description">
                    {commodity.commodityDescription?.substring(0, 150)}
                    {commodity.commodityDescription && commodity.commodityDescription.length > 150 ? '...' : ''}
                  </div>
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default MyCommodities
