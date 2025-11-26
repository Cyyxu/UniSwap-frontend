import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, List, Input, Button, Avatar, Empty, message, Pagination } from 'antd'
import { SendOutlined, UserOutlined } from '@ant-design/icons'
import { messageApi, type PrivateMessage, MessageQuery, MessageAddRequest } from '../../api/message'
import dayjs from 'dayjs'
import './index.css'

const { TextArea } = Input

const PrivateMessagePage = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<PrivateMessage[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<MessageQuery>({
    current: 1,
    pageSize: 20,
  })
  const [content, setContent] = useState('')
  const [recipientId, setRecipientId] = useState<number | null>(null)

  // 从 URL 参数中读取接收人 ID
  useEffect(() => {
    const recipientIdParam = searchParams.get('recipientId')
    if (recipientIdParam) {
      setRecipientId(Number(recipientIdParam))
    }
  }, [searchParams])

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await messageApi.getMyList(query)
      setMessages(res?.records || [])
      setTotal(res?.total || 0)
    } catch (error) {
      console.error('加载私信失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!content.trim()) {
      message.warning('请输入消息内容')
      return
    }
    if (!recipientId) {
      message.warning('请输入接收人ID')
      return
    }
    if (recipientId <= 0) {
      message.warning('接收人ID必须大于0')
      return
    }

    try {
      await messageApi.add({
        recipientId,
        content: content.trim(),
      })
      message.success('发送成功')
      setContent('')
      loadData()
    } catch (error: any) {
      message.error(error.response?.data?.errorMsg || error.message || '发送失败')
    }
  }

  return (
    <div className="message-container">
      <Card title="私信">
        <div className="message-input-section">
          <Input
            placeholder="接收人ID"
            type="number"
            value={recipientId || ''}
            onChange={(e) => setRecipientId(e.target.value ? Number(e.target.value) : null)}
            style={{ marginBottom: 12 }}
          />
          <TextArea
            rows={4}
            placeholder="输入消息内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            style={{ marginTop: 12 }}
            block
          >
            发送
          </Button>
        </div>

        {messages.length === 0 ? (
          <Empty description="暂无私信" style={{ marginTop: 40 }} />
        ) : (
          <>
            <List
              dataSource={messages}
              loading={loading}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <div className="message-header">
                        <span>
                          {item.senderId ? `发送者: ${item.senderId}` : '未知用户'} → 
                          {item.recipientId ? `接收者: ${item.recipientId}` : '未知用户'}
                        </span>
                        <span className="message-time">
                          {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                      </div>
                    }
                    description={
                      <div className={`message-content ${item.alreadyRead === 0 ? 'unread' : ''}`}>
                        {item.content}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination
                current={query.current}
                pageSize={query.pageSize}
                total={total}
                onChange={(page, size) => setQuery({ ...query, current: page, pageSize: size })}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条消息`}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default PrivateMessagePage

