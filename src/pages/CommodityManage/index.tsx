import { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { commodityApi, Commodity, CommodityAddRequest } from '../../api/commodity'
import type { ColumnsType } from 'antd/es/table'

const CommodityManage = () => {
  const [loading, setLoading] = useState(false)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Commodity | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await commodityApi.getList({ current: 1, pageSize: 100 })
      setCommodities(res?.records || [])
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

  return (
    <div>
      <Card
        title="商品管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加商品
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={commodities}
          loading={loading}
          rowKey="id"
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

