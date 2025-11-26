import { useEffect, useState } from 'react'
import { Card, Descriptions, Avatar, Button, Tabs, Table, Tag } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import { userApi } from '../../api/user'
import { orderApi, Order } from '../../api/order'
import type { ColumnsType } from 'antd/es/table'

const UserCenter = () => {
  const { user, setUser } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await orderApi.getMyOrders({ current: 1, pageSize: 10 })
      setOrders(res?.records || [])
    } catch (error) {
      console.error('加载订单失败', error)
    } finally {
      setLoading(false)
    }
  }

  const orderColumns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品名称',
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
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '待支付', color: 'orange' },
          1: { text: '已支付', color: 'green' },
          2: { text: '已发货', color: 'blue' },
          3: { text: '已完成', color: 'default' },
          4: { text: '已取消', color: 'red' },
        }
        const statusInfo = statusMap[status] || { text: '未知', color: 'default' }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
  ]

  const tabItems = [
    {
      key: 'info',
      label: '个人信息',
      children: (
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar size={100} src={user?.userAvatar} icon={<UserOutlined />} />
            <h2 style={{ marginTop: 16 }}>{user?.userName}</h2>
          </div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户ID">{user?.id}</Descriptions.Item>
            <Descriptions.Item label="账号">{user?.userAccount}</Descriptions.Item>
            <Descriptions.Item label="昵称">{user?.userName}</Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color={user?.userRole === 'admin' ? 'red' : 'blue'}>
                {user?.userRole === 'admin' ? '管理员' : '普通用户'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'orders',
      label: '我的订单',
      children: (
        <Table
          columns={orderColumns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  )
}

export default UserCenter

