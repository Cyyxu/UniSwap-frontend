import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button, List, Avatar, message, Spin } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { aiApi, AIMessage } from '../../api/ai'
import dayjs from 'dayjs'
import './index.css'

const { TextArea } = Input

const AIChat = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      })
    })
  }

  useEffect(() => {
    let cancelled = false

    const loadMessages = async () => {
      try {
        const res = await aiApi.getMyList({ current: 1, pageSize: 50 })
        const records = res?.records || []
        
        // 🔥 辅助函数：安全地解析日期
        const parseDate = (dateStr: string | null | undefined): Date => {
          if (!dateStr) return new Date() // 如果没有日期，使用当前时间
          const date = new Date(dateStr)
          // 检查日期是否有效
          return isNaN(date.getTime()) ? new Date() : date
        }
        
        // 将旧格式的消息（同时包含用户输入和AI回复）拆分成两条消息
        const separatedMessages: AIMessage[] = []
        records.forEach((msg: AIMessage) => {
          if (msg.userInputText && msg.aiGenerateText) {
            // 拆分成用户消息和AI消息
            const userMsgTime = parseDate(msg.createTime)
            const aiMsgTime = new Date(userMsgTime.getTime() + 1000) // AI消息时间稍晚1秒
            
            separatedMessages.push({
              ...msg,
              id: msg.id * 1000, // 用户消息ID
              aiGenerateText: '', // 用户消息没有AI回复
              createTime: userMsgTime.toISOString(),
            })
            separatedMessages.push({
              ...msg,
              id: msg.id * 1000 + 1, // AI消息ID
              userInputText: '', // AI消息没有用户输入
              createTime: aiMsgTime.toISOString(),
            })
          } else if (msg.userInputText && !msg.aiGenerateText) {
            // 只有用户输入，是用户消息
            separatedMessages.push({
              ...msg,
              createTime: parseDate(msg.createTime).toISOString(),
            })
          } else if (msg.aiGenerateText && !msg.userInputText) {
            // 只有AI回复，是AI消息
            separatedMessages.push({
              ...msg,
              createTime: parseDate(msg.createTime).toISOString(),
            })
          }
        })
        // 按创建时间排序
        separatedMessages.sort((a, b) => 
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        )
        if (!cancelled) {
          setMessages(separatedMessages)
          // 🔥 加载历史记录后立即滚动到底部（不使用平滑滚动）
          setTimeout(() => scrollToBottom(false), 100)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('加载消息失败', error)
        }
      }
    }

    loadMessages()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) {
      message.warning('请输入消息')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    const now = Date.now()
    // 添加用户消息到列表
    const userMsg: AIMessage = {
      id: now,
      userId: 0,
      userInputText: userMessage,
      aiGenerateText: '',
      createTime: new Date().toISOString(),
    }

    // 添加一个临时的AI消息占位符，用于流式显示
    const tempAiMsgId = now + 1
    const tempAiMsg: AIMessage = {
      id: tempAiMsgId,
      userId: 0,
      userInputText: '',
      aiGenerateText: '',
      createTime: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg, tempAiMsg])

    // 使用 aiApi.stream() 方法（已更新为支持新的后端接口）
    try {
      await aiApi.stream(
        userMessage, // 直接传递字符串，内部会转换为 { userInputText: userMessage }
        (token) => {
          // 逐字更新AI消息
          setMessages((prev) => {
            const newMessages = [...prev]
            const index = newMessages.findIndex((m) => m.id === tempAiMsgId)
            if (index !== -1) {
              newMessages[index] = {
                ...newMessages[index],
                aiGenerateText: newMessages[index].aiGenerateText + token,
              }
            }
            return newMessages
          })
        },
        (messageId) => {
          // 完成
          setLoading(false)
          message.success('AI回复完成')
          console.log('消息ID:', messageId)
        },
        (error) => {
          // 错误处理
          setMessages((prev) => {
            const newMessages = [...prev]
            const index = newMessages.findIndex((m) => m.id === tempAiMsgId)
            if (index !== -1) {
              newMessages[index] = {
                ...newMessages[index],
                aiGenerateText: `抱歉，请求失败：${error}`,
              }
            }
            return newMessages
          })
          setLoading(false)
          
          // 如果是登录过期错误，跳转到登录页
          if (error.includes('登录') || error.includes('Token') || error.includes('未登录')) {
            message.error('登录已过期，请重新登录')
            setTimeout(() => {
              navigate('/login')
            }, 1500)
          } else {
            message.error(error)
          }
        }
      )
    } catch (error: any) {
      setLoading(false)
      console.error('流式请求异常:', error)
      message.error(error.message || '请求失败')
    }
  }

  // 获取历史会话列表（按日期分组）
  const historySessions = useMemo(() => {
    const sessions: Record<string, AIMessage[]> = {}
    messages.forEach((msg) => {
      const date = dayjs(msg.createTime).format('YYYY-MM-DD')
      if (!sessions[date]) {
        sessions[date] = []
      }
      sessions[date].push(msg)
    })
    return sessions
  }, [messages])

  return (
    <div className="ai-chat-container">
      <div className="chat-layout">
        {/* 左侧历史记录 */}
        <div className="chat-history">
          <Card 
            title="历史会话" 
            className="history-card"
            bodyStyle={{ padding: 0 }}
          >
            <div className="history-list">
              {Object.entries(historySessions).map(([date, msgs]) => (
                <div key={date} className="history-group">
                  <div className="history-date">{date}</div>
                  {msgs.filter(m => m.userInputText).map((msg) => (
                    <div key={msg.id} className="history-item">
                      <div className="history-text">{msg.userInputText}</div>
                      <div className="history-time">
                        {dayjs(msg.createTime).format('HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧聊天区域 */}
        <div className="chat-main">
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate(-1)}
                  style={{ padding: '4px 8px' }}
                />
                <span>AI 智能助手</span>
              </div>
            }
            className="chat-card"
          >
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <RobotOutlined style={{ fontSize: 64, color: '#FF6B00', marginBottom: 16 }} />
                  <p>开始与 AI 助手对话吧！</p>
                </div>
              ) : (
                <List
                  dataSource={messages}
                  renderItem={(item) => {
                    // 判断是用户消息还是AI消息
                    const isUserMessage = item.userInputText && !item.aiGenerateText
                    
                    return (
                      <div className={`message-item ${isUserMessage ? 'user-message' : 'ai-message'}`}>
                        <Avatar
                          icon={isUserMessage ? <UserOutlined /> : <RobotOutlined />}
                          size={40}
                          className={isUserMessage ? 'user-avatar' : 'ai-avatar'}
                        />
                        <div className="message-content">
                          <div className="message-text">
                            {isUserMessage ? (
                              <div className="user-text">{item.userInputText}</div>
                            ) : item.aiGenerateText ? (
                              <div className="ai-text">{item.aiGenerateText}</div>
                            ) : (
                              <div className="ai-text" style={{ color: '#999', fontStyle: 'italic' }}>
                                <Spin size="small" /> AI正在思考中...
                              </div>
                            )}
                          </div>
                          <div className="message-time">
                            {dayjs(item.createTime).format('HH:mm:ss')}
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
              <TextArea
                rows={3}
                placeholder="输入您的问题..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (e.shiftKey) return
                  e.preventDefault()
                  handleSend()
                }}
                disabled={loading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={loading}
                style={{ marginTop: 12 }}
                block
              >
                发送
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIChat
