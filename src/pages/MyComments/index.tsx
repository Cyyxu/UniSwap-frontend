import React, { useEffect, useState } from 'react'
import { Card, List, message, Empty, Spin, Button, Modal, Input, Tag } from 'antd'
import { CommentOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../api/request'
import './index.css'

const { TextArea } = Input

interface MyComment {
  id: number
  postId: number
  postTitle: string
  content: string
  createTime: string
  updateTime?: string
}

const MyComments: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<MyComment[]>([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingComment, setEditingComment] = useState<MyComment | null>(null)
  const [editContent, setEditContent] = useState('')
  const navigate = useNavigate()

  const loadMyComments = async () => {
    setLoading(true)
    try {
      const res = await api.post('/comment/myComments', {})
      setComments(res.data || [])
    } catch (error: any) {
      message.error(error.message || '加载评论列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyComments()
  }, [])

  const handleEdit = (comment: MyComment) => {
    setEditingComment(comment)
    setEditContent(comment.content)
    setEditModalVisible(true)
  }

  const handleSaveEdit = async () => {
    if (!editingComment) return
    
    if (!editContent.trim()) {
      message.error('评论内容不能为空')
      return
    }

    try {
      await api.post('/comment/edit', {
        id: editingComment.id,
        content: editContent,
      })
      message.success('编辑成功')
      setEditModalVisible(false)
      loadMyComments()
    } catch (error: any) {
      message.error(error.message || '编辑失败')
    }
  }

  const handleDelete = (commentId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.post('/comment/delete', { id: commentId })
          message.success('删除成功')
          loadMyComments()
        } catch (error: any) {
          message.error(error.message || '删除失败')
        }
      },
    })
  }

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`)
  }

  return (
    <div className="my-comments-container">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CommentOutlined />
            <span>我的评论</span>
            <Tag color="green">{comments.length} 条</Tag>
          </div>
        }
        bordered={false}
      >
        <Spin spinning={loading}>
          {comments.length === 0 && !loading ? (
            <Empty description="暂无评论" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item
                  key={comment.id}
                  className="comment-item"
                  actions={[
                    <Button
                      key="edit"
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(comment)}
                    >
                      编辑
                    </Button>,
                    <Button
                      key="delete"
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(comment.id)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextOutlined />
                        <a onClick={() => handlePostClick(comment.postId)}>
                          {comment.postTitle}
                        </a>
                      </div>
                    }
                    description={
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        {new Date(comment.createTime).toLocaleString()}
                        {comment.updateTime && comment.updateTime !== comment.createTime && (
                          <span style={{ marginLeft: 8 }}>
                            (已编辑于 {new Date(comment.updateTime).toLocaleString()})
                          </span>
                        )}
                      </span>
                    }
                  />
                  <div className="comment-content">{comment.content}</div>
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>

      <Modal
        title="编辑评论"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <TextArea
          rows={6}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="请输入评论内容"
          maxLength={500}
          showCount
        />
      </Modal>
    </div>
  )
}

export default MyComments
