import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, NotificationOutlined } from '@ant-design/icons'
import api from '../../../api/request'
import { formatDateTime } from '../../../utils/format'
import './index.css'

const { TextArea } = Input

interface Notice {
  id: number
  noticeTitle: string
  noticeContent: string
  createTime: string
  updateTime?: string
}

const NoticeManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [notices, setNotices] = useState<Notice[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [form] = Form.useForm()

  const loadNotices = async (page: number = 1) => {
    setLoading(true)
    try {
      const res = await api.post('/notice/list/page/vo', {
        current: page,
        pageSize,
      })
      setNotices(res.data.records || [])
      setTotal(res.data.total || 0)
      setCurrent(page)
    } catch (error: any) {
      message.error(error.message || '加载公告列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const handleAdd = () => {
    setEditingNotice(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice)
    form.setFieldsValue({
      noticeTitle: notice.noticeTitle,
      noticeContent: notice.noticeContent,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.post('/notice/delete', { id })
      message.success('删除成功')
      loadNotices(current)
    } catch (error: any) {
      message.error(error.message || '删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingNotice) {
        // 更新
        await api.post('/notice/update', {
          id: editingNotice.id,
          ...values,
        })
        message.success('更新成功')
      } else {
        // 添加
        await api.post('/notice/add', values)
        message.success('添加成功')
      }
      
      setModalVisible(false)
      loadNotices(current)
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return
      }
      message.error(error.message || '操作失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '公告标题',
      dataIndex: 'noticeTitle',
      key: 'noticeTitle',
      ellipsis: true,
    },
    {
      title: '公告内容',
      dataIndex: 'noticeContent',
      key: 'noticeContent',
      ellipsis: true,
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Notice) => (
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
            title="确定要删除这条公告吗？"
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
    <div className="notice-manage-container">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NotificationOutlined />
            <span>公告管理</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            发布公告
          </Button>
        }
        bordered={false}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={notices}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            onChange: loadNotices,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingNotice ? '编辑公告' : '发布公告'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="noticeTitle"
            label="公告标题"
            rules={[
              { required: true, message: '请输入公告标题' },
              { max: 100, message: '标题不能超过100个字符' },
            ]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>
          <Form.Item
            name="noticeContent"
            label="公告内容"
            rules={[
              { required: true, message: '请输入公告内容' },
              { max: 1000, message: '内容不能超过1000个字符' },
            ]}
          >
            <TextArea
              rows={8}
              placeholder="请输入公告内容"
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NoticeManage
