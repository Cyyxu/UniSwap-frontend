import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout, List, Avatar, Input, Button, Empty, message as antMessage, Badge, Popconfirm } from 'antd'
import { SendOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons'
import { messageApi } from '../../api/message'
import { useAuthStore } from '../../store/authStore'
import dayjs from 'dayjs'
import './index.css'

const { Sider, Content } = Layout
const { TextArea } = Input

interface Message {
  id: number
  senderId: number
  recipientId: number
  content: string
  createTime: string
  alreadyRead: number
}

interface Conversation {
  userId: number
  userName: string
  userAvatar?: string
  lastMessage: string
  lastTime: string
  unreadCount: number
  isOnline?: boolean
}

const ChatRoom = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set())
  const [onlineCount, setOnlineCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 从URL参数获取接收人ID
  useEffect(() => {
    const recipientId = searchParams.get('recipientId')
    if (recipientId) {
      const userId = Number(recipientId)
      setSelectedUserId(userId)
      // 从URL进入时也建立WebSocket连接
      setTimeout(() => connectWebSocket(), 100)
    }
  }, [searchParams])

  // 建立WebSocket连接（当选择会话时）
  const connectWebSocket = () => {
    if (!user?.id) {
      console.error('无法建立WebSocket连接：用户信息未加载', user)
      antMessage.error('用户信息未加载，请刷新页面')
      return
    }

    console.log('准备建立WebSocket连接，用户ID:', user.id)

    // 如果已有连接，先关闭
    if (ws) {
      console.log('关闭旧的WebSocket连接')
      ws.close()
    }

    // 开发环境直连后端，生产环境使用相对路径
    const wsHost = import.meta.env.PROD 
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
      : 'ws://localhost:8109'
    const wsUrl = `${wsHost}/uniswap/api/ws/chat/${user.id}`
    console.log('WebSocket连接URL:', wsUrl)
    const websocket = new WebSocket(wsUrl)
    
    websocket.onopen = () => {
      console.log('✅ WebSocket连接成功，用户ID:', user.id)
    }

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('收到消息:', data)
        
        if (data.type === 'message') {
          // 收到新消息，添加到消息列表
          const newMessage: Message = {
            id: Date.now(),
            senderId: data.senderId,
            recipientId: user.id,
            content: data.content,
            createTime: new Date(data.timestamp).toISOString(),
            alreadyRead: 0
          }
          
          if (data.senderId === selectedUserId) {
            setMessages(prev => [...prev, newMessage])
          }
          
          // 刷新会话列表
          loadConversations()
        }
      } catch (error) {
        console.error('处理消息失败:', error)
      }
    }

    websocket.onerror = (error) => {
      console.error('❌ WebSocket错误:', error)
      console.error('连接URL:', wsUrl)
      console.error('用户ID:', user.id)
      antMessage.error('WebSocket连接失败，请检查后端服务是否启动')
    }

    websocket.onclose = (event) => {
      console.log('WebSocket连接关闭', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      })
      // 如果不是正常关闭，提示用户
      if (!event.wasClean) {
        console.warn('WebSocket异常关闭')
      }
    }

    setWs(websocket)
  }

  // 组件卸载时关闭WebSocket
  useEffect(() => {
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [ws])

  // 加载在线用户统计（需要管理员权限）
  const loadOnlineStats = async () => {
    try {
      const res: any = await messageApi.getOnlineStats()
      // 合并 WebSocket 在线用户和活跃用户
      const allOnlineIds = [
        ...(res?.wsOnlineUserIds || []),
        ...(res?.activeUserIds || [])
      ]
      setOnlineUsers(new Set(allOnlineIds))
      setOnlineCount(res?.activeCount || res?.wsOnlineCount || 0)
    } catch (error) {
      // 非管理员可能没有权限，静默处理
      console.log('加载在线统计失败（可能无权限）:', error)
    }
  }

  // 加载会话列表
  const loadConversations = async () => {
    try {
      const res: any = await messageApi.getConversations()
      const conversationList = res || []
      
      // 加载在线用户统计
      await loadOnlineStats()
      
      setConversations(conversationList.map((conv: any) => ({
        userId: conv.userId,
        userName: conv.userName || `用户${conv.userId}`,
        lastMessage: conv.lastMessage,
        lastTime: conv.lastTime,
        unreadCount: conv.unreadCount || 0,
        isOnline: onlineUsers.has(conv.userId)
      })))
    } catch (error) {
      console.error('加载会话列表失败:', error)
    }
  }

  // 加载聊天记录
  const loadChatHistory = async (otherUserId: number) => {
    try {
      const chatMessages: any = await messageApi.getChatHistory(otherUserId)
      setMessages(chatMessages || [])
      
      // 滚动到底部
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
      }, 100)
    } catch (error) {
      console.error('加载聊天记录失败:', error)
    }
  }

  // 选择会话
  const handleSelectConversation = async (userId: number) => {
    setSelectedUserId(userId)
    await loadChatHistory(userId)
    // 标记消息为已读
    try {
      await messageApi.markAsRead(userId)
      // 刷新会话列表，更新未读数
      loadConversations()
    } catch (error) {
      console.error('标记已读失败:', error)
    }
    // 选择会话时建立WebSocket连接
    connectWebSocket()
  }

  // 删除消息
  const handleDeleteMessage = async (messageId: number) => {
    try {
      await messageApi.delete(messageId)
      // 从本地消息列表中移除
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      // 刷新会话列表
      loadConversations()
      antMessage.success('消息已删除')
    } catch (error: any) {
      console.error('删除消息失败:', error)
      antMessage.error(error.response?.data?.message || '删除失败')
    }
  }

  // 删除整个会话
  const handleDeleteConversation = async (userId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      await messageApi.deleteConversation(userId)
      // 从会话列表中移除
      setConversations(prev => prev.filter(conv => conv.userId !== userId))
      // 如果删除的是当前选中的会话，清空聊天窗口
      if (selectedUserId === userId) {
        setSelectedUserId(null)
        setMessages([])
      }
      antMessage.success('会话已删除')
    } catch (error: any) {
      console.error('删除会话失败:', error)
      antMessage.error(error.response?.data?.message || '删除失败')
    }
  }

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedUserId) {
      antMessage.warning('请输入消息内容')
      return
    }

    try {
      // 通过HTTP发送消息（保存到数据库）
      await messageApi.add({
        recipientId: selectedUserId,
        content: inputValue.trim()
      })

      // 通过WebSocket发送实时消息（如果连接可用）
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'chat',
          recipientId: selectedUserId,
          content: inputValue.trim()
        }))
      } else {
        // WebSocket未连接，消息已通过HTTP保存，对方上线后可查看
        console.log('WebSocket未连接，消息已保存到数据库')
      }

      // 添加到本地消息列表
      const newMessage: Message = {
        id: Date.now(),
        senderId: user!.id,
        recipientId: selectedUserId,
        content: inputValue.trim(),
        createTime: new Date().toISOString(),
        alreadyRead: 0
      }
      setMessages(prev => [...prev, newMessage])
      setInputValue('')
      
      // 滚动到底部
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      antMessage.error(error.message || '发送失败')
    }
  }

  useEffect(() => {
    loadConversations()
    
    // 定时刷新在线统计（每30秒）
    const interval = setInterval(() => {
      loadOnlineStats()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedUserId) {
      loadChatHistory(selectedUserId)
    }
  }, [selectedUserId])

  return (
    <div className="chat-room-container">
      <Layout className="chat-layout">
        {/* 左侧会话列表 */}
        <Sider width={300} theme="light" className="conversation-sider">
          <div className="conversation-header">
            <h3>消息</h3>
            <Badge 
              count={onlineCount} 
              showZero 
              style={{ backgroundColor: '#52c41a' }}
              title={`当前在线: ${onlineCount} 人`}
            />
          </div>
          <List
            dataSource={conversations}
            renderItem={(conv) => (
              <List.Item
                className={`conversation-item ${selectedUserId === conv.userId ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conv.userId)}
                actions={[
                  <Popconfirm
                    key="delete"
                    title="确定要删除整个会话吗？"
                    description="这将删除与该用户的所有聊天记录"
                    onConfirm={(e) => handleDeleteConversation(conv.userId, e)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot status={conv.isOnline ? 'success' : 'default'} offset={[-5, 35]}>
                      <Avatar icon={<UserOutlined />} src={conv.userAvatar} />
                    </Badge>
                  }
                  title={
                    <div className="conversation-title">
                      <span>{conv.userName}</span>
                      {conv.isOnline && <span style={{ color: '#52c41a', fontSize: 12, marginLeft: 8 }}>在线</span>}
                      {conv.unreadCount > 0 && (
                        <Badge count={conv.unreadCount} />
                      )}
                    </div>
                  }
                  description={
                    <div className="conversation-desc">
                      <div className="last-message">{conv.lastMessage}</div>
                      <div className="last-time">{dayjs(conv.lastTime).format('MM-DD HH:mm')}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Sider>

        {/* 右侧聊天窗口 */}
        <Content className="chat-content">
          {selectedUserId ? (
            <>
              <div className="chat-header">
                <h3>用户{selectedUserId}</h3>
              </div>
              
              <div className="messages-container">
                {messages.length === 0 ? (
                  <Empty description="暂无消息" />
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-item ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                    >
                      <Avatar icon={<UserOutlined />} />
                      <div className="message-bubble">
                        <div className="message-content">{msg.content}</div>
                        <div className="message-time">
                          {dayjs(msg.createTime).format('HH:mm:ss')}
                          {msg.senderId === user?.id && (
                            <span className={`message-status ${msg.alreadyRead === 1 ? 'read' : 'unread'}`}>
                              {msg.alreadyRead === 1 ? '已读' : '未读'}
                            </span>
                          )}
                        </div>
                        {/* 删除按钮 - 只对自己发送的消息显示 */}
                        {msg.senderId === user?.id && (
                          <Popconfirm
                            title="确定要删除这条消息吗？"
                            onConfirm={() => handleDeleteMessage(msg.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              className="delete-btn"
                              danger
                            />
                          </Popconfirm>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-container">
                <TextArea
                  rows={3}
                  placeholder="输入消息..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  style={{ marginTop: 8 }}
                >
                  发送
                </Button>
              </div>
            </>
          ) : (
            <div className="empty-chat-state">
              <div className="empty-icon">💬</div>
              <div className="empty-title">闲来无事找个人聊聊吧</div>
              <div className="empty-desc">选择左侧会话开始聊天</div>
            </div>
          )}
        </Content>
      </Layout>
    </div>
  )
}

export default ChatRoom
