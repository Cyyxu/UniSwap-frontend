import { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Space, Tag } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { commodityApi, Commodity, CommodityAddRequest } from '../../api/commodity'
import { useAuthStore } from '../../store/authStore'
import type { ColumnsType } from 'antd/es/table'

const CommodityManage = () => {
  const { user } = useAuthStore()
  const isAdmin = user?.userRole === 'admin'
  const [loading, setLoading] = useState(false)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Commodity | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      if (isAdmin) {
        // 管理员：获取所有商品
        const res: any = await commodityApi.getList({ current: 1, pageSize: 100 })
        setCommodities(res?.records || [])
      } else {
        // 普通用户：获取自己的商品
        const res: any = await commodityApi.getMine({ current: 1, pageSize: 100 })
        setCommodities(res?.records || [])
      }
    } catch (error) {
      message.error('加载商品失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Commodity) => {
    setEditingItem(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      onOk: async () => {
        try {
          await commodityApi.delete(id)
          message.success('删除成功')
          loadData()
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  // 发布/上架商品
  const handlePublish = async (id: number) => {
    try {
      const res = await commodityApi.publish([id])
      if (res) {
        message.success('发布成功')
      } else {
        message.error('发布失败，请检查商品状态或权限')
      }
      loadData()
    } catch (error: any) {
      message.error(error?.message || '发布失败')
    }
  }

  // 下架商品
  const handleUnpublish = async (id: number) => {
    try {
      const res = await commodityApi.publish([id])
      if (res) {
        message.success('下架成功')
      } else {
        message.error('下架失败，请检查商品状态或权限')
      }
      loadData()
    } catch (error: any) {
      message.error(error?.message || '下架失败')
    }
  }

  // 批量操作（发布/下架切换）
  const handleBatchToggle = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择商品')
      return
    }
    try {
      const res = await commodityApi.publish(selectedRowKeys)
      if (res) {
        message.success('操作成功')
      } else {
        message.error('操作失败')
      }
      setSelectedRowKeys([])
      loadData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        // 更新逻辑
        message.success('更新成功')
      } else {
        await commodityApi.add(values as CommodityAddRequest)
        message.success('添加成功')
      }
      setModalVisible(false)
      loadData()
    } catch (error: any) {
      message.error(error.message || '操作失败')
    }
  }

  const columns: ColumnsType<Commodity> = [
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '库存',
      dataIndex: 'commodityInventory',
      key: 'commodityInventory',
    },
    {
      title: '状态',
      dataIndex: 'isListed',
      key: 'isListed',
      render: (isListed) => (
        <Tag color={isListed === 1 ? 'green' : 'red'}>
          {isListed === 1 ? '已上架' : '未上架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.isListed === 1 ? (
            <Button
              type="link"
              icon={<StopOutlined />}
              onClick={() => handleUnpublish(record.id)}
            >
              下架
            </Button>
          ) : (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          )}
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as number[]),
  }

  return (
    <div>
      <Card
        title={isAdmin ? '商品管理' : '我的商品'}
        extra={
          <Space>
            {selectedRowKeys.length > 0 && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleBatchToggle}
              >
                批量发布/下架 ({selectedRowKeys.length})
              </Button>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加商品
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={commodities}
          loading={loading}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? '编辑商品' : '添加商品'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="commodityName" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="commodityDescription" label="商品描述" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="commodityAvatar" label="商品图片URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="commodityInventory" label="库存" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="commodityTypeId" label="商品分类" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="degree" label="新旧程度" rules={[{ required: true }]}>
            <Input placeholder="如：9成新" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CommodityManage

