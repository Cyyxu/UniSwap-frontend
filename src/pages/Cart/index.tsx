import { useMemo, useState } from 'react'
import { Button, Card, Checkbox, Divider, Empty, Image, InputNumber, Space, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { commodityApi } from '../../api/commodity'
import { useAuthStore } from '../../store/authStore'

const { Text } = Typography

const Cart = () => {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const {
    items,
    totalCount,
    totalAmount,
    selectedCount,
    selectedAmount,
    updateQuantity,
    removeItem,
    toggleSelected,
    setAllSelected,
    clear,
    clearSelected,
  } = useCartStore()

  const [submitting, setSubmitting] = useState(false)

  const allSelected = useMemo(() => items.length > 0 && items.every((it) => it.selected), [items])
  const indeterminate = useMemo(() => items.some((it) => it.selected) && !allSelected, [items, allSelected])

  const handleCheckout = async () => {
    const selectedItems = items.filter((it) => it.selected)
    if (selectedItems.length === 0) {
      message.warning('请先选择要结算的商品')
      return
    }
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      for (const it of selectedItems) {
        await commodityApi.purchase({ commodityId: it.commodityId, buyNumber: it.quantity })
      }
      message.success('结算成功')
      clearSelected()
      navigate('/order')
    } catch (e: any) {
      message.error(e?.message || '结算失败')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnsType<(typeof items)[number]> = [
    {
      title: (
        <Checkbox
          checked={allSelected}
          indeterminate={indeterminate}
          onChange={(e) => setAllSelected(e.target.checked)}
        >
          全选
        </Checkbox>
      ),
      dataIndex: 'selected',
      width: 90,
      render: (_v, record) => (
        <Checkbox checked={record.selected} onChange={() => toggleSelected(record.commodityId)} />
      ),
    },
    {
      title: '商品',
      dataIndex: 'commodityName',
      render: (_v, record) => (
        <Space>
          <Image width={56} height={56} src={record.commodityAvatar} fallback="https://via.placeholder.com/56" />
          <div>
            <div>{record.commodityName}</div>
            <Text type="secondary">ID: {record.commodityId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 120,
      render: (v) => <Text>¥{Number(v).toFixed(2)}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 160,
      render: (v, record) => (
        <InputNumber
          min={1}
          value={v}
          onChange={(val) => updateQuantity(record.commodityId, Number(val))}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      width: 140,
      render: (_v, record) => <Text strong>¥{(record.price * record.quantity).toFixed(2)}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_v, record) => (
        <Button
          danger
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.commodityId)}
        >
          移除
        </Button>
      ),
    },
  ]

  return (
    <Card title="购物车" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {items.length === 0 ? (
        <Empty description="购物车为空">
          <Button type="primary" onClick={() => navigate('/commodity')}>去逛逛</Button>
        </Empty>
      ) : (
        <>
          <Table
            rowKey="commodityId"
            columns={columns}
            dataSource={items}
            pagination={false}
          />

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button onClick={clear} danger>清空购物车</Button>
              <Button onClick={clearSelected}>删除已选</Button>
            </Space>

            <Space size="large">
              <div>
                <Text type="secondary">总件数：</Text>
                <Text>{totalCount}</Text>
                <Text type="secondary">（已选 {selectedCount}）</Text>
              </div>
              <div>
                <Text type="secondary">总金额：</Text>
                <Text>¥{totalAmount.toFixed(2)}</Text>
                <Text type="secondary">（已选）</Text>
                <Text strong>¥{selectedAmount.toFixed(2)}</Text>
              </div>
              <Button type="primary" loading={submitting} onClick={handleCheckout}>
                去结算
              </Button>
            </Space>
          </div>
        </>
      )}
    </Card>
  )
}

export default Cart
