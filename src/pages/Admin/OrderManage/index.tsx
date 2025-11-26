import { useState, useEffect } from 'react'
import { Table, Button, Input, Space, Tag, message, Card } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { orderApi } from '../../../api/order'
import './index.css'

interface Order {
  id: number
  orderNo?: string
  commodityName: string
  paymentAmount: number
  payStatus: number
  createTime: string
}

const OrderManage = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({
    current: 1,
    pageSize: 10,
    searchText: '',
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await orderApi.getList(query)
      setOrders(res?.records || [])
      setTotal(res?.total || 0)
    } catch (error) {
      console.error('加载订单列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string, record: Order) => text || `#${record.id}`,
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
    },
    {
      title: '订单金额',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      render: (price: number) => price != null ? `¥${price}` : '¥0',
    },
    {
      title: '订单状态',
      dataIndex: 'payStatus',
      key: 'payStatus',
      render: (status: number) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '未支付', color: 'orange' },
          1: { text: '已支付', color: 'green' },
        }
        const statusInfo = statusMap[status] || { text: '未知', color: 'default' }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ]

  return (
    <div className="admin-order-manage">
      <Card>
        <div className="page-header">
          <h1>订单管理</h1>
          <Space>
            <Input
              placeholder="搜索订单号"
              prefix={<SearchOutlined />}
              value={query.searchText}
              onChange={(e) => setQuery({ ...query, searchText: e.target.value, current: 1 })}
              style={{ width: 200 }}
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: query.current,
            pageSize: query.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => setQuery({ ...query, current: page, pageSize: size }),
          }}
        />
      </Card>
    </div>
  )
}

export default OrderManage

