import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, message, Space, Popconfirm, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, CommentOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/request'
import { formatDateTime } from '../../../utils/format'
import './index.css'

const { TextArea } = Input

interface Comment {
  id: number
  postId: number
  userId: number
  content: string
  createTime: string
  updateTime?: string
  user?: {
    userName: string
    userAvatar: string
  }
}

const CommentManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [form] = Form.useForm()
  const [searchPostId, setSearchPostId] = useState<number | undefined>()
  const navigate = useNavigate()

  const loadComments = async (page: number = 1, postId?: number) => {
    setLoading(true)
    try {
      const res = await api.post('/api/commoditycomment/page', {
        current: page,
        pageSize,
        postId,
      })
      setComments(res.records || [])
      setTotal(res.total || 0)
      setCurrent(page)
    } catch (error: any) {
      message.error(error.message || '加载评论列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [])

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment)
    form.setFieldsValue({
      content: comment.content,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.post('/api/commoditycomment/remove', { id })
      message.success('删除成功')
      loadComments(current, searchPostId)
    } catch (error: any) {
      message.error(error.message || '删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingComment) {
        await api.post('/api/commoditycomment/manage', {
          id: editingComment.id,
          ...values,
        })
        message.success('更新成功')
      }
      
      setModalVisible(false)
      loadComments(current, searchPostId)
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || '操作失败')
    }
  }

  const handleSearch = () => {
    loadComments(1, searchPostId)
  }

  const handleReset = () => {
    setSearchPostId(undefined)
    loadComments(1)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '帖子ID',
      dataIndex: 'postId',
      key: 'postId',
      width: 100,
      render: (postId: number) => (
        <a onClick={() => navigate(`/post/${postId}`)}>
          {postId}
        </a>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (user: any) => user?.userName || '未知用户',
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Comment) => (
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
            title="确定要删除这条评论吗？"
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
    <div className="comment-manage-container">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CommentOutlined />
            <span>评论管理</span>
          </div>
        }
        bordered={false}
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Input
            placeholder="输入帖子ID搜索"
            value={searchPostId}
            onChange={(e) => setSearchPostId(e.target.value ? Number(e.target.value) : undefined)}
            style={{ width: 200 }}
            type="number"
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
          dataSource={comments}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            onChange: (page) => loadComments(page, searchPostId),
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="编辑评论"
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
            name="content"
            label="评论内容"
            rules={[
              { required: true, message: '请输入评论内容' },
              { max: 500, message: '内容不能超过500个字符' },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="请输入评论内容"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CommentManage
