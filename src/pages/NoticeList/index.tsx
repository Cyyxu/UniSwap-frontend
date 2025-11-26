import { useEffect, useState } from 'react'
import { Card, List, Empty, Pagination } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { noticeApi, Notice, NoticeQuery } from '../../api/notice'
import dayjs from 'dayjs'
import './index.css'

const NoticeList = () => {
  const [loading, setLoading] = useState(false)
  const [notices, setNotices] = useState<Notice[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<NoticeQuery>({
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await noticeApi.getList(query)
      setNotices(res?.records || [])
      // 确保 total 是数字类型
      setTotal(Number(res?.total) || 0)
    } catch (error) {
      console.error('加载公告失败', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="公告通知" icon={<BellOutlined />}>
      {notices.length === 0 ? (
        <Empty description="暂无公告" />
      ) : (
        <>
          <List
            dataSource={notices}
            loading={loading}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                  title={
                    <div className="notice-title">
                      {item.noticeTitle}
                      <span className="notice-time">
                        {dayjs(item.createTime).format('YYYY-MM-DD HH:mm')}
                      </span>
                    </div>
                  }
                  description={
                    <div
                      className="notice-content"
                      dangerouslySetInnerHTML={{ __html: (item.noticeContent || '').replace(/\n/g, '<br/>') }}
                    />
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
              showTotal={(total) => `共 ${total} 条公告`}
            />
          </div>
        </>
      )}
    </Card>
  )
}

export default NoticeList

