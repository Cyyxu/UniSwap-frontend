import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Space, Tag, Avatar, Divider, Input, message, List, Empty } from 'antd'
import { LikeOutlined, HeartOutlined, LeftOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons'
import { postApi, Post } from '../../api/post'
import { postCommentApi, PostComment } from '../../api/postComment'
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
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasThumb, setHasThumb] = useState(false)
  const [hasFavour, setHasFavour] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    if (id) {
      loadDetail()
      loadComments()
    }
  }, [id])

  // 加载点赞和收藏状态
  const loadInteractionStatus = async (postId: number) => {
    if (!token) return
    try {
      const [thumbStatus, favourStatus] = await Promise.all([
        postApi.checkThumb(postId).catch(() => false),
        postApi.checkFavour(postId).catch(() => false),
      ])
      setHasThumb(!!thumbStatus)
      setHasFavour(!!favourStatus)
    } catch (error) {
      console.error('加载互动状态失败', error)
    }
  }

  const loadDetail = async () => {
    setLoading(true)
    try {
      const data = await postApi.getDetail(Number(id))
      setPost(data)
      // 如果后端返回了状态，使用后端的；否则单独查询
      if (data.hasThumb !== undefined) {
        setHasThumb(data.hasThumb)
      }
      if (data.hasFavour !== undefined) {
        setHasFavour(data.hasFavour)
      }
      // 单独查询状态（确保准确）
      loadInteractionStatus(Number(id))
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
      const result: any = await postApi.thumb(post.id)
      console.log('[Thumb] 后端返回:', result)
      // 后端返回 1 表示点赞成功，-1 或 0 表示取消
      const nowThumb = result === 1 || result === true
      const wasThumb = hasThumb
      setHasThumb(nowThumb)
      if (nowThumb !== wasThumb) {
        setPost({
          ...post,
          thumbNum: nowThumb ? (post.thumbNum || 0) + 1 : Math.max((post.thumbNum || 0) - 1, 0)
        })
      }
      message.success(nowThumb ? '点赞成功' : '已取消点赞')
    } catch (error: any) {
      if (!error.handled) {
        message.error(error.message || '操作失败')
      }
    }
  }

  const handleFavour = async () => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (!post) return

    try {
      const result: any = await postApi.favour(post.id)
      console.log('[Favour] 后端返回:', result)
      // 后端返回 1 表示收藏成功，-1 或 0 表示取消
      const nowFavour = result === 1 || result === true
      const wasFavour = hasFavour
      setHasFavour(nowFavour)
      if (nowFavour !== wasFavour) {
        setPost({
          ...post,
          favourNum: nowFavour ? (post.favourNum || 0) + 1 : Math.max((post.favourNum || 0) - 1, 0)
        })
      }
      message.success(nowFavour ? '收藏成功' : '已取消收藏')
    } catch (error: any) {
      if (!error.handled) {
        message.error(error.message || '操作失败')
      }
    }
  }

  const loadComments = async () => {
    if (!id) return
    setCommentLoading(true)
    try {
      const data: any = await postCommentApi.getByPostId(Number(id))
      // 处理分页返回格式
      if (data?.records) {
        setComments(data.records)
      } else if (Array.isArray(data)) {
        setComments(data)
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
      await postCommentApi.add({
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
      await postCommentApi.delete(commentId)
      message.success('删除成功')
      loadComments()
    } catch (error: any) {
      message.error(error.message || '删除失败')
    }
  }

  // 递归渲染评论列表（支持嵌套回复）
  const renderComment = (commentItem: PostComment, level: number = 0) => {
    const isOwner = user?.id === commentItem.userId
    return (
      <div key={commentItem.id} style={{ marginLeft: level * 40, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar 
            src={commentItem.user?.userAvatar} 
            icon={<span>{(commentItem.user?.userName || 'U')?.[0]}</span>} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                  {commentItem.user?.userName || '未知用户'}
                </span>
                {commentItem.repliedUser && (
                  <span style={{ color: '#999', marginRight: 8 }}>
                    回复 @{commentItem.repliedUser.userName}
                  </span>
                )}
                <span style={{ color: '#999', fontSize: 12 }}>
                  {dayjs(commentItem.createTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              {isOwner && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteComment(commentItem.id)}
                >
                  删除
                </Button>
              )}
            </div>
            <div style={{ marginTop: 8, marginBottom: 8 }}>{commentItem.content}</div>
            {commentItem.replies && commentItem.replies.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {commentItem.replies.map((reply) => renderComment(reply, level + 1))}
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
            <div className="post-time">{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        </div>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-tags">
          {(() => {
            const tags = post.tagList || post.tags || []
            const tagArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').filter(Boolean) : [])
            return tagArray.map((tag, index) => (
              <Tag key={`${post.id}-${tag}-${index}`} color="blue">{tag}</Tag>
            ))
          })()}
        </div>
        <Divider />
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        <Divider />
        <div className="post-actions">
          <Space size="large">
            <Button
              type={hasThumb ? 'primary' : 'default'}
              icon={<LikeOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleThumb()
              }}
            >
              点赞 ({post.thumbNum || 0})
            </Button>
            <Button
              type={hasFavour ? 'primary' : 'default'}
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
