import { useEffect, useState } from 'react'
import { Card, Table, Tag, Pagination } from 'antd'
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
      setOrders(res?.data?.records || [])
      // 确保 total 是数字类型
      setTotal(Number(res?.data?.total) || 0)
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
      width: 180,
      ellipsis: true,
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'buyNumber',
      key: 'buyNumber',
      width: 80,
      align: 'center',
    },
    {
      title: '总金额',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      width: 120,
      render: (amount) => amount != null ? `¥${amount}` : '¥0',
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      key: 'payStatus',
      width: 100,
      align: 'center',
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
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 100,
      align: 'center',
      render: (status) => {
        const statusText = status === 'Yundefined' ? '未定义' : status
        return <Tag>{statusText}</Tag>
      },
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

