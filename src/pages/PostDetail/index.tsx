import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Space, Tag, Avatar, Divider, Input, message, List, Empty } from 'antd'
import { LikeOutlined, HeartOutlined, LeftOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons'
import { postApi, Post } from '../../api/post'
import { commentApi, Comment } from '../../api/comment'
import { useAuthStore } from '../../store/authStore'
import dayjs from 'dayjs'
import './index.css'

const { TextArea } = Input

const PostDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState<Post | null>(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    if (id) {
      loadDetail()
      loadComments()
    }
  }, [id])

  const loadDetail = async () => {
    setLoading(true)
    try {
      const data = await postApi.getDetail(Number(id))
      setPost(data)
    } catch (error) {
      message.error('加载帖子失败')
    } finally {
      setLoading(false)
    }
  }

  const handleThumb = async () => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (!post) return

    try {
      const result = await postApi.thumb(post.id)
      // result 是变化数：1表示点赞，-1表示取消点赞
      if (result === 1) {
        message.success('点赞成功')
      } else if (result === -1) {
        message.success('已取消点赞')
      }
      loadDetail()
    } catch (error: any) {
      message.error(error.message || '操作失败')
    }
  }

  const handleFavour = async () => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (!post) return

    try {
      const result = await postApi.favour(post.id)
      // result 是变化数：1表示收藏，-1表示取消收藏
      if (result === 1) {
        message.success('收藏成功')
      } else if (result === -1) {
        message.success('已取消收藏')
      }
      loadDetail()
    } catch (error: any) {
      message.error(error.message || '操作失败')
    }
  }

  const loadComments = async () => {
    if (!id) return
    setCommentLoading(true)
    try {
      const data = await commentApi.getByPostId(Number(id))
      // 确保 data 是数组
      if (Array.isArray(data)) {
        setComments(data)
      } else if (data && Array.isArray(data.data)) {
        setComments(data.data)
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('加载评论失败', error)
      setComments([])
    } finally {
      setCommentLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (!post) return
    if (!comment.trim()) {
      message.warning('请输入评论内容')
      return
    }

    setSubmitting(true)
    try {
      await commentApi.add({
        postId: post.id,
        content: comment.trim(),
      })
      message.success('评论成功')
      setComment('')
      loadComments()
    } catch (error: any) {
      message.error(error.message || '评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.delete(commentId)
      message.success('删除成功')
      loadComments()
    } catch (error: any) {
      message.error(error.message || '删除失败')
    }
  }

  // 递归渲染评论列表（支持嵌套回复）
  const renderComment = (comment: Comment, level: number = 0) => {
    const isOwner = user?.id === comment.userId
    return (
      <div key={comment.id} style={{ marginLeft: level * 40, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar 
            src={comment.user?.userAvatar} 
            icon={<span>{(comment.user?.userName || 'U')?.[0]}</span>} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                  {comment.user?.userName || '未知用户'}
                </span>
                {comment.repliedUser && (
                  <span style={{ color: '#999', marginRight: 8 }}>
                    回复 @{comment.repliedUser.userName}
                  </span>
                )}
                <span style={{ color: '#999', fontSize: 12 }}>
                  {dayjs(comment.createTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              {isOwner && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  删除
                </Button>
              )}
            </div>
            <div style={{ marginTop: 8, marginBottom: 8 }}>{comment.content}</div>
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {comment.replies.map((reply) => renderComment(reply, level + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return <Card loading={loading}>加载中...</Card>
  }

  return (
    <div className="post-detail-container">
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>
      <Card>
        <div className="post-header">
          <Avatar 
            src={post.user?.userAvatar || post.userAvatar} 
            size={48} 
            icon={<span>{(post.user?.userName || post.userName)?.[0] || 'U'}</span>} 
          />
          <div className="post-meta">
            <div className="post-author">{post.user?.userName || post.userName || '未知用户'}</div>
            <div className="post-time">{dayjs(post.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        </div>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-tags">
          {(post.tagList || post.tags || []).map((tag, index) => (
            <Tag key={`${post.id}-${tag}-${index}`} color="blue">{tag}</Tag>
          ))}
        </div>
        <Divider />
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        <Divider />
        <div className="post-actions">
          <Space size="large">
            <Button
              type={post.hasThumb ? 'primary' : 'default'}
              icon={<LikeOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleThumb()
              }}
            >
              点赞 ({post.thumbNum || 0})
            </Button>
            <Button
              type={post.hasFavour ? 'primary' : 'default'}
              icon={<HeartOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleFavour()
              }}
            >
              收藏 ({post.favourNum || 0})
            </Button>
          </Space>
        </div>
      </Card>

      <Card title={`评论 (${comments.length})`} style={{ marginTop: 24 }}>
        {token ? (
          <div className="comment-input" style={{ marginBottom: 24 }}>
            <TextArea
              rows={4}
              placeholder="写下你的评论..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              showCount
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              style={{ marginTop: 12 }}
              onClick={handleSubmitComment}
              loading={submitting}
            >
              发表评论
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
            <p>请先登录后发表评论</p>
            <Button type="primary" onClick={() => navigate('/login')}>
              去登录
            </Button>
          </div>
        )}
        
        <Divider />
        
        {commentLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
        ) : !comments || comments.length === 0 ? (
          <Empty description="暂无评论，快来发表第一条评论吧！" />
        ) : (
          <div>
            {Array.isArray(comments) && comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default PostDetail

