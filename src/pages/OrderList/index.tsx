import { useEffect, useState } from 'react'
import { Card, Table, Tag, Space, Pagination } from 'antd'
import { orderApi, Order, OrderQuery } from '../../api/order'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const OrderList = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<OrderQuery>({
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await orderApi.getMyOrders(query)
      setOrders(res?.records || [])
      // 确保 total 是数字类型
      setTotal(Number(res?.total) || 0)
    } catch (error) {
      console.error('加载订单失败', error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品',
      dataIndex: 'commodityName',
      key: 'commodityName',
    },
    {
      title: '数量',
      dataIndex: 'buyNumber',
      key: 'buyNumber',
    },
    {
      title: '总金额',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      render: (amount) => amount != null ? `¥${amount}` : '¥0',
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      key: 'payStatus',
      render: (status) => {
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
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  return (
    <Card title="我的订单">
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Pagination
          current={query.current}
          pageSize={query.pageSize}
          total={total}
          onChange={(page, size) => setQuery({ ...query, current: page, pageSize: size })}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条订单`}
        />
      </div>
    </Card>
  )
}

export default OrderList

