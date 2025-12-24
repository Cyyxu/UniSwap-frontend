import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Image,
  InputNumber,
  Space,
  Table,
  Typography,
  message,
  Spin,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { commodityApi } from '../../api/commodity'
import { useAuthStore } from '../../store/authStore'
import { CartItem } from '../../api/cart'

const { Text } = Typography

const Cart = () => {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const {
    items,
    loading,
    totalQuantity,
    finalAmount,
    fetchCart,
    updateQuantity,
    removeItem,
    removeBatch,
    toggleSelected,
    setAllSelected,
    clearSelected,
  } = useCartStore()

  const [submitting, setSubmitting] = useState(false)

  // 计算已选数量和金额
  const selectedItems = useMemo(() => items.filter((it) => it.selected), [items])
  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.quantity, 0),
    [selectedItems]
  )
  const selectedAmount = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.currentPrice * it.quantity, 0),
    [selectedItems]
  )

  useEffect(() => {
    if (token) {
      fetchCart()
    }
  }, [token])

  const allSelected = useMemo(
    () => items.length > 0 && items.every((it) => it.selected),
    [items]
  )
  const indeterminate = useMemo(
    () => items.some((it) => it.selected) && !allSelected,
    [items, allSelected]
  )

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
        await commodityApi.purchase({
          commodityId: it.commodityId,
          buyNumber: it.quantity,
        })
      }
      message.success('结算成功')
      await clearSelected()
      navigate('/order')
    } catch (e: any) {
      message.error(e?.message || '结算失败')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnsType<CartItem> = [
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
        <Checkbox
          checked={record.selected}
          onChange={() => toggleSelected(record.id)}
        />
      ),
    },
    {
      title: '商品',
      dataIndex: 'commodityName',
      render: (_v, record) => (
        <Space
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/commodity/${record.commodityId}`)}
        >
          <Image
            width={56}
            height={56}
            src={record.commodityAvatar}
            fallback="https://via.placeholder.com/56"
            preview={false}
          />
          <div>
            <div>{record.commodityName}</div>
            <Text type="secondary">ID: {record.commodityId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '单价',
      dataIndex: 'currentPrice',
      width: 120,
      render: (v) => <Text>¥{(Number(v) || 0).toFixed(2)}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 160,
      render: (v, record) => (
        <InputNumber
          min={1}
          max={record.stock || 99}
          value={v}
          onChange={(val) => updateQuantity(record.id, Number(val))}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      width: 140,
      render: (_v, record) => (
        <Text strong style={{ color: '#FF4D4F' }}>
          ¥{((Number(record.currentPrice) || 0) * (record.quantity || 1)).toFixed(2)}
        </Text>
      ),
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
          onClick={() => removeItem(record.id)}
        >
          移除
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <Card style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#999' }}>加载购物车中...</p>
      </Card>
    )
  }

  return (
    <Card
      title={
        <Space>
          <ShoppingCartOutlined style={{ color: '#FF6B00' }} />
          <span>购物车</span>
          {totalQuantity > 0 && (
            <Text type="secondary">（共 {totalQuantity} 件商品）</Text>
          )}
        </Space>
      }
      style={{ maxWidth: 1100, margin: '0 auto' }}
    >
      {items.length === 0 ? (
        <Empty description="购物车为空">
          <Button type="primary" onClick={() => navigate('/commodity')}>
            去逛逛
          </Button>
        </Empty>
      ) : (
        <>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={items}
            pagination={false}
          />

          <Divider />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <Space>
              <Button
                onClick={() => {
                  const allIds = items.map((it) => it.id)
                  if (allIds.length > 0) removeBatch(allIds)
                }}
                danger
              >
                清空购物车
              </Button>
              <Button onClick={clearSelected} disabled={selectedCount === 0}>
                删除已选
              </Button>
            </Space>

            <Space size="large">
              <div>
                <Text type="secondary">已选 </Text>
                <Text strong style={{ color: '#FF6B00' }}>
                  {selectedCount}
                </Text>
                <Text type="secondary"> 件</Text>
              </div>
              <div>
                <Text type="secondary">合计：</Text>
                <Text strong style={{ color: '#FF4D4F', fontSize: 20 }}>
                  ¥{(selectedAmount || 0).toFixed(2)}
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                loading={submitting}
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                style={{ minWidth: 120 }}
              >
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
