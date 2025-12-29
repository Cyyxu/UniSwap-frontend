import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, message, Image, Rate, List, Avatar, Divider, Input } from 'antd'
import { 
  HeartOutlined, 
  HeartFilled,
  StarOutlined, 
  UserOutlined, 
  MessageOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  LeftOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { commodityApi, Commodity } from '../../api/commodity'
import { favoriteApi } from '../../api/favorite'
import { scoreApi } from '../../api/score'
import { messageApi } from '../../api/message'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { formatDateTime, getRelativeTime } from '../../utils/format'
import './index.css'

const CommodityDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const addItem = useCartStore((s) => s.addItem)
  const [commodity, setCommodity] = useState<Commodity | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [averageScore, setAverageScore] = useState<number>(0)
  const [myScore, setMyScore] = useState<number>(0)
  const [myScoreId, setMyScoreId] = useState<number | null>(null)
  const [scoreList, setScoreList] = useState<any[]>([])
  const [myComment, setMyComment] = useState<string>('')
  const [chatLoading, setChatLoading] = useState(false)

  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      loadDetail()
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!commodity) return

    setCartLoading(true)
    try {
      await addItem(commodity.id, 1)
      message.success('已加入购物车')
    } catch (error: any) {
      message.error(error?.message || '加入购物车失败')
    } finally {
      setCartLoading(false)
    }
  }

  const loadDetail = async () => {
    if (!id || isNaN(Number(id))) {
      message.error('商品ID无效')
      return
    }
    try {
      const data: any = await commodityApi.getDetail(Number(id))
      setCommodity(data)
      
      // 增加浏览量（无需登录）
      favoriteApi.view(Number(id)).catch(() => {})
      
      // 商品加载完成后，如果已登录，检查收藏状态和评分
      if (token && data) {
        checkFavoriteStatus(data.id)
        loadScoreData(data.id)
      } else if (data) {
        // 未登录也加载平均评分和评分列表
        loadAverageScore(data.id)
        loadScoreList(data.id)
      }
    } catch (error) {
      message.error('加载商品详情失败')
    }
  }

  const handlePurchase = async () => {
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!commodity) return

    try {
      await commodityApi.purchase({
        commodityId: commodity.id,
        buyNumber: 1,
      })
      message.success('购买成功')
      navigate('/order')
    } catch (error: any) {
      message.error(error.message || '购买失败')
    }
  }

  const checkFavoriteStatus = async (_commodityId: number) => {
    // 后端没有 check 接口，收藏状态通过商品详情返回或 toggle 时更新
    // 暂时不检查，点击收藏按钮时通过 toggle 切换
  }

  const loadScoreData = async (commodityId: number) => {
    await Promise.all([
      loadAverageScore(commodityId),
      loadMyScore(commodityId),
      loadScoreList(commodityId)
    ])
  }

  const loadAverageScore = async (commodityId: number) => {
    try {
      const score: any = await scoreApi.getAverage(commodityId)
      setAverageScore(Number(score) || 0)
    } catch (error) {
      console.error('加载平均评分失败', error)
    }
  }

  const loadMyScore = async (commodityId: number) => {
    if (!token) return
    try {
      const res: any = await scoreApi.getMyList({ commodityId, current: 1, pageSize: 1 })
      if (res?.records && res.records.length > 0) {
        const score = res.records[0]
        setMyScore(score.score)
        setMyScoreId(score.id)
      }
    } catch (error) {
      console.error('加载我的评分失败', error)
    }
  }

  const loadScoreList = async (commodityId: number) => {
    try {
      const res: any = await scoreApi.getList({ commodityId, current: 1, pageSize: 10 })
      setScoreList(res?.records || [])
    } catch (error) {
      console.error('加载评分列表失败', error)
    }
  }

  const handleRateChange = (value: number) => {
    setMyScore(value)
  }

  const handleSubmitReview = async () => {
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!commodity) return
    if (myScore === 0) {
      message.warning('请先选择评分')
      return
    }

    try {
      if (myScoreId) {
        // 更新评分
        await scoreApi.edit({ id: myScoreId, score: myScore, comment: myComment || undefined })
        message.success('评价已更新')
      } else {
        // 新增评分
        const id: any = await scoreApi.add({ commodityId: commodity.id, score: myScore, comment: myComment || undefined })
        setMyScoreId(Number(id) || null)
        message.success('评价成功')
      }
      // 刷新评分数据
      loadScoreData(commodity.id)
    } catch (error: any) {
      message.error(error.message || '评价失败')
    }
  }

  const handleContactSeller = async () => {
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!commodity) return
    
    setChatLoading(true)
    try {
      // 调用接口初始化聊天室，传入商品ID
      await messageApi.startChat(commodity.id)
      // 跳转到私信页面
      navigate(`/message?recipientId=${commodity.adminId}`)
    } catch (error: any) {
      message.error(error.message || '建立联系失败，请稍后再试')
    } finally {
      setChatLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!token) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!commodity) return

    try {
      const res = await favoriteApi.toggle(commodity.id)
      if (res) {
        // 返回 true 表示已收藏
        setIsFavorited(true)
        message.success('已添加到收藏')
        // 更新本地收藏数
        setCommodity({ ...commodity, favourNum: (commodity.favourNum || 0) + 1 })
      } else {
        // 返回 false 表示已取消收藏
        setIsFavorited(false)
        message.success('已取消收藏')
        // 更新本地收藏数
        setCommodity({ ...commodity, favourNum: Math.max((commodity.favourNum || 0) - 1, 0) })
      }
    } catch (error: any) {
      if (!error.handled) {
        message.error(error.message || '操作失败')
      }
    }
  }

  if (!commodity) {
    return (
      <div className="xy-detail-loading">
        <div className="loading-spinner" />
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="xy-detail-page">
      {/* 顶部卖家信息栏 */}
      <div className="xy-detail-header">
        <div className="xy-detail-header-content">
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={() => navigate(-1)}
            className="xy-back-btn"
          />
          <div className="xy-seller-info" onClick={() => navigate(`/user/${commodity.adminId}`)}>
            <Avatar size={40} src={(commodity as any).adminAvatar} icon={<UserOutlined />} />
            <div className="xy-seller-meta">
              <span className="xy-seller-name">{(commodity as any).adminName || '卖家'}</span>
              <span className="xy-seller-detail">
                <EnvironmentOutlined /> 校园 · {getRelativeTime(new Date(commodity.createTime || Date.now()))} · 在售{commodity.commodityInventory}件
              </span>
            </div>
          </div>
          <div className="xy-header-right">
            <span className="xy-shop-tag">
              <img src="/logo-icon.svg" alt="UniSwap" style={{ width: 20, height: 20, marginRight: 4, verticalAlign: 'middle' }} />
              UniSwap
            </span>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="xy-detail-main">
        {/* 左侧商品图片 */}
        <div className="xy-detail-image">
          <Image
            src={commodity.commodityAvatar || 'https://via.placeholder.com/500'}
            alt={commodity.commodityName}
            className="xy-main-image"
          />
        </div>

        {/* 右侧商品信息 */}
        <div className="xy-detail-info">
          {/* 价格区 */}
          <div className="xy-price-section">
            <div className="xy-price-row">
              <span className="xy-price">
                <em>¥</em>{Math.floor(Number(commodity.price))}
              </span>
              <span className="xy-price-tag">包邮</span>
            </div>
            <div className="xy-stats">
              <span><EyeOutlined /> {commodity.viewNum || 0}人想要</span>
              <span><HeartOutlined /> {commodity.favourNum || 0}收藏</span>
            </div>
          </div>

          {/* 商品标题和描述 */}
          <div className="xy-title-section">
            <h1 className="xy-title">{commodity.commodityName}</h1>
            <p className="xy-description">{commodity.commodityDescription}</p>
          </div>

          {/* 商品属性 */}
          <div className="xy-attr-section">
            <div className="xy-attr-item">
              <span className="xy-attr-label">成色</span>
              <span className="xy-attr-value">{commodity.degree || '未标注'}</span>
            </div>
            <div className="xy-attr-item">
              <span className="xy-attr-label">分类</span>
              <span className="xy-attr-value">{commodity.commodityTypeName || '其他'}</span>
            </div>
            <div className="xy-attr-item">
              <span className="xy-attr-label">评分</span>
              <span className="xy-attr-value">
                <Rate disabled value={averageScore} allowHalf style={{ fontSize: 14 }} />
                <em style={{ marginLeft: 4 }}>{averageScore.toFixed(1)}</em>
              </span>
            </div>
          </div>

          {/* 发货信息 */}
          <div className="xy-delivery-section">
            <div className="xy-delivery-row">
              <span className="xy-delivery-label">预计工期</span>
              <span className="xy-delivery-value">1-3天</span>
            </div>
            <div className="xy-delivery-row">
              <span className="xy-delivery-label">计价方式</span>
              <span className="xy-delivery-value">元/件</span>
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="xy-action-bar">
            <Button 
              className="xy-chat-btn"
              icon={chatLoading ? <LoadingOutlined /> : <MessageOutlined />}
              onClick={handleContactSeller}
              loading={chatLoading}
            >
              聊一聊
            </Button>
            <Button
              type="primary"
              className="xy-buy-btn"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              loading={cartLoading}
              disabled={commodity.commodityInventory !== undefined && commodity.commodityInventory !== null && commodity.commodityInventory <= 0}
            >
              加入购物车
            </Button>
            <Button 
              type="primary"
              className="xy-buy-btn"
              onClick={handlePurchase}
              disabled={commodity.commodityInventory !== undefined && commodity.commodityInventory !== null && commodity.commodityInventory <= 0}
            >
              立即购买
            </Button>
            <Button 
              className="xy-fav-btn"
              onClick={handleToggleFavorite}
            >
              {isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              <span>{isFavorited ? '已收藏' : '收藏'}</span>
            </Button>
          </div>

          {/* 安全提示 */}
          <div className="xy-safety-tip">
            <SafetyCertificateOutlined />
            <span>如服务包含额外费用，请与卖家沟通后再交易</span>
          </div>
        </div>
      </div>

      {/* 评分区域 */}
      <div className="xy-review-section">
        <div className="xy-review-header">
          <h3>商品评价 ({scoreList.length})</h3>
        </div>
        
        {token && (
          <div className="xy-my-rate">
            <div className="xy-rate-row">
              <span>我的评分：</span>
              <Rate
                value={myScore}
                onChange={handleRateChange}
              />
              {myScore > 0 && <span className="xy-rate-text">{myScore} 分</span>}
            </div>
            <Input.TextArea
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              placeholder="写下你的评价（可选）"
              maxLength={500}
              showCount
              rows={2}
              style={{ marginTop: 12 }}
            />
            <div className="xy-review-submit">
              <Button 
                type="primary" 
                onClick={handleSubmitReview}
                disabled={myScore === 0}
              >
                {myScoreId ? '更新评价' : '提交评价'}
              </Button>
            </div>
          </div>
        )}
        
        <Divider style={{ margin: '16px 0' }} />
        
        {scoreList.length > 0 ? (
          <List
            dataSource={scoreList}
            renderItem={(item: any) => (
              <List.Item className="xy-review-item">
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} src={item.userAvatar} />}
                  title={
                    <div className="xy-review-title">
                      <span>{item.userName || '用户'}</span>
                      <Rate disabled value={item.score} style={{ fontSize: 12, marginLeft: 8 }} />
                    </div>
                  }
                  description={
                    <div className="xy-review-content">
                      {item.comment && <p className="xy-comment-text">{item.comment}</p>}
                      <span className="xy-comment-time">{formatDateTime(item.createTime)}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="xy-empty-review">
            <StarOutlined />
            <p>暂无评价</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommodityDetail

