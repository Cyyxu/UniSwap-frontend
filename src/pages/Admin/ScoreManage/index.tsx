import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, InputNumber, message, Space, Popconfirm, Rate } from 'antd'
import { EditOutlined, DeleteOutlined, StarOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/request'
import './index.css'

interface CommodityScore {
  id: number
  commodityId: number
  commodityName?: string
  userId: number
  userName?: string
  score: number
  createTime: string
  updateTime?: string
}

const ScoreManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState<CommodityScore[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingScore, setEditingScore] = useState<CommodityScore | null>(null)
  const [form] = Form.useForm()
  const [searchCommodityId, setSearchCommodityId] = useState<number | undefined>()
  const navigate = useNavigate()

  const loadScores = async (page: number = 1, commodityId?: number) => {
    setLoading(true)
    try {
      const res = await api.post('/commodityScore/list/page/vo', {
        current: page,
        pageSize,
        commodityId,
      })
      setScores(res.data.records || [])
      setTotal(res.data.total || 0)
      setCurrent(page)
    } catch (error: any) {
      message.error(error.message || '加载评分列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScores()
  }, [])

  const handleEdit = (score: CommodityScore) => {
    setEditingScore(score)
    form.setFieldsValue({
      score: score.score,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.post('/commodityScore/delete', { id })
      message.success('删除成功')
      loadScores(current, searchCommodityId)
    } catch (error: any) {
      message.error(error.message || '删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingScore) {
        await api.post('/commodityScore/update', {
          id: editingScore.id,
          ...values,
        })
        message.success('更新成功')
      }
      
      setModalVisible(false)
      loadScores(current, searchCommodityId)
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || '操作失败')
    }
  }

  const handleSearch = () => {
    loadScores(1, searchCommodityId)
  }

  const handleReset = () => {
    setSearchCommodityId(undefined)
    loadScores(1)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '商品ID',
      dataIndex: 'commodityId',
      key: 'commodityId',
      width: 100,
      render: (commodityId: number) => (
        <a onClick={() => navigate(`/commodity/${commodityId}`)}>
          {commodityId}
        </a>
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 150,
      render: (score: number) => (
        <Rate disabled value={score} />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: CommodityScore) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条评分吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="score-manage-container">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarOutlined />
            <span>评分管理</span>
          </div>
        }
        bordered={false}
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <InputNumber
            placeholder="输入商品ID搜索"
            value={searchCommodityId}
            onChange={(value) => setSearchCommodityId(value || undefined)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={scores}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            onChange: (page) => loadScores(page, searchCommodityId),
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="编辑评分"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="score"
            label="评分"
            rules={[
              { required: true, message: '请输入评分' },
              { type: 'number', min: 1, max: 5, message: '评分必须在1-5之间' },
            ]}
          >
            <Rate />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ScoreManage
