import { useState, useEffect } from 'react'
import { Table, Button, Input, Space, Tag, Popconfirm, message, Card, Modal, Form, InputNumber, Select } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { commodityApi, CommodityEditRequest } from '../../../api/commodity'
import { commodityTypeApi } from '../../../api/commodityType'
import './index.css'

interface Commodity {
  id: number
  commodityName: string
  commodityDescription?: string
  commodityAvatar?: string
  price: number
  commodityInventory: number
  commodityTypeId?: number
  degree?: string
  isListed: number
  createTime: string
}

interface CommodityType {
  id: number
  typeName: string
}

const CommodityManage = () => {
  const [loading, setLoading] = useState(false)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({
    current: 1,
    pageSize: 10,
    searchText: '',
  })
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null)
  const [commodityTypes, setCommodityTypes] = useState<CommodityType[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
    loadCommodityTypes()
  }, [query])

  const loadCommodityTypes = async () => {
    try {
      const types = await commodityTypeApi.getList()
      setCommodityTypes(types || [])
    } catch (error) {
      console.error('加载商品类型失败', error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await commodityApi.getList(query)
      setCommodities(res?.records || [])
      setTotal(res?.total || 0)
    } catch (error) {
      console.error('加载商品列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (record: Commodity) => {
    try {
      // 加载商品详情
      const detail = await commodityApi.getDetail(record.id)
      setEditingCommodity(detail)
      form.setFieldsValue({
        id: detail.id,
        commodityName: detail.commodityName,
        commodityDescription: detail.commodityDescription,
        commodityAvatar: detail.commodityAvatar,
        price: detail.price,
        commodityInventory: detail.commodityInventory,
        commodityTypeId: detail.commodityTypeId,
        degree: detail.degree,
        isListed: detail.isListed,
      })
      setEditModalVisible(true)
    } catch (error) {
      message.error('加载商品详情失败')
      console.error(error)
    }
  }

  const handleEditSubmit = async (values: any) => {
    try {
      const editData: CommodityEditRequest = {
        id: values.id,
        commodityName: values.commodityName,
        commodityDescription: values.commodityDescription,
        commodityAvatar: values.commodityAvatar,
        price: values.price,
        commodityInventory: values.commodityInventory,
        commodityTypeId: values.commodityTypeId,
        degree: values.degree,
        isListed: values.isListed,
      }
      await commodityApi.edit(editData)
      message.success('编辑成功')
      setEditModalVisible(false)
      form.resetFields()
      setEditingCommodity(null)
      loadData()
    } catch (error: any) {
      message.error(error.response?.data?.message || '编辑失败')
      console.error(error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await commodityApi.delete(id)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<Commodity> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
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
      render: (isListed: number) => (
        <Tag color={isListed === 1 ? 'green' : 'red'}>
          {isListed === 1 ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个商品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-commodity-manage">
      <Card>
        <div className="page-header">
          <h1>商品管理</h1>
          <Space>
            <Input
              placeholder="搜索商品名称"
              prefix={<SearchOutlined />}
              value={query.searchText}
              onChange={(e) => setQuery({ ...query, searchText: e.target.value, current: 1 })}
              style={{ width: 200 }}
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={commodities}
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

      <Modal
        title="编辑商品"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          form.resetFields()
          setEditingCommodity(null)
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item name="id" hidden>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="commodityName"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="commodityDescription"
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入商品描述" />
          </Form.Item>
          <Form.Item
            name="commodityAvatar"
            label="商品图片URL"
            rules={[{ required: true, message: '请输入商品图片URL' }]}
          >
            <Input placeholder="请输入商品图片URL" />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入价格"
            />
          </Form.Item>
          <Form.Item
            name="commodityInventory"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入库存"
            />
          </Form.Item>
          <Form.Item
            name="commodityTypeId"
            label="商品分类"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择商品分类">
              {commodityTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  {type.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="degree"
            label="新旧程度"
            rules={[{ required: true, message: '请输入新旧程度' }]}
          >
            <Input placeholder="如：9成新、几乎全新" />
          </Form.Item>
          <Form.Item
            name="isListed"
            label="上架状态"
            rules={[{ required: true, message: '请选择上架状态' }]}
          >
            <Select placeholder="请选择上架状态">
              <Select.Option value={1}>上架</Select.Option>
              <Select.Option value={0}>下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CommodityManage

