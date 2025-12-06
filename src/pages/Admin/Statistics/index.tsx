import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { statisticsApi, TrendData } from '../../../api/statistics'
import './index.css'

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCommodities: 0,
    totalOrders: 0,
    totalPosts: 0,
    todayUsers: 0,
    todayOrders: 0,
    todayPosts: 0,
    userGrowthRate: 0,
    orderGrowthRate: 0,
    postGrowthRate: 0,
  })
  const [loading, setLoading] = useState(false)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [monthlyData, setMonthlyData] = useState<TrendData[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      // 从后端获取统计数据
      const [statsData, weekTrend, monthTrend]: any[] = await Promise.all([
        statisticsApi.getOverall(),
        statisticsApi.getTrend(7),
        statisticsApi.getTrend(30),
      ])

      // 设置统计数据（包含后端计算的增长率）
      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalCommodities: statsData.totalCommodities || 0,
        totalOrders: statsData.totalOrders || 0,
        totalPosts: statsData.totalPosts || 0,
        todayUsers: statsData.todayUsers || 0,
        todayOrders: statsData.todayOrders || 0,
        todayPosts: statsData.todayPosts || 0,
        userGrowthRate: statsData.userGrowthRate || 0,
        orderGrowthRate: statsData.orderGrowthRate || 0,
        postGrowthRate: statsData.postGrowthRate || 0,
      })

      setTrendData(weekTrend || [])
      setMonthlyData(monthTrend || [])
    } catch (error) {
      console.error('加载统计数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  // 使用后端返回的增长率
  const userGrowth = stats.userGrowthRate
  const orderGrowth = stats.orderGrowthRate
  const postGrowth = stats.postGrowthRate

  // 表格数据
  const tableData = trendData.map((item, index) => ({
    key: index,
    date: item.date,
    users: item.users,
    orders: item.orders,
    posts: item.posts,
    total: item.users + item.orders + item.posts,
  }))

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '新增用户',
      dataIndex: 'users',
      key: 'users',
      render: (val: number) => <Tag color="green">{val}</Tag>,
    },
    {
      title: '新增订单',
      dataIndex: 'orders',
      key: 'orders',
      render: (val: number) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: '新增帖子',
      dataIndex: 'posts',
      key: 'posts',
      render: (val: number) => <Tag color="purple">{val}</Tag>,
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => <strong>{val}</strong>,
    },
  ]

  return (
    <div className="admin-statistics">
      <h1>数据统计</h1>
      
      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading}>
            <Statistic
              title="今日新增用户"
              value={stats.todayUsers}
              prefix={<UserOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: userGrowth >= 0 ? '#52c41a' : '#f5222d' }}>
                  {userGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(userGrowth)}%
                </span>
              }
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              总用户数：{stats.totalUsers}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading}>
            <Statistic
              title="商品总数"
              value={stats.totalCommodities}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              在售商品
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading}>
            <Statistic
              title="今日订单数"
              value={stats.todayOrders}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: orderGrowth >= 0 ? '#52c41a' : '#f5222d' }}>
                  {orderGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(orderGrowth)}%
                </span>
              }
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              总订单数：{stats.totalOrders}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading}>
            <Statistic
              title="今日新增帖子"
              value={stats.todayPosts}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: postGrowth >= 0 ? '#52c41a' : '#f5222d' }}>
                  {postGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(postGrowth)}%
                </span>
              }
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              总帖子数：{stats.totalPosts}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="最近7天数据趋势" loading={loading}>
            <div style={{ padding: '20px 0' }}>
              {trendData.map((item, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.date}</span>
                    <span>
                      <UserOutlined style={{ color: '#52c41a', marginRight: 4 }} />{item.users}
                      <ShoppingCartOutlined style={{ color: '#1890ff', marginLeft: 12, marginRight: 4 }} />{item.orders}
                      <FileTextOutlined style={{ color: '#722ed1', marginLeft: 12, marginRight: 4 }} />{item.posts}
                    </span>
                  </div>
                  <Progress
                    percent={Math.min((item.users + item.orders + item.posts) * 10, 100)}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="数据对比分析" loading={loading}>
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>用户增长率</span>
                  <span style={{ color: userGrowth >= 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
                    {userGrowth >= 0 ? '+' : ''}{userGrowth}%
                  </span>
                </div>
                <Progress
                  percent={Math.min(Math.abs(userGrowth), 100)}
                  strokeColor={userGrowth >= 0 ? '#52c41a' : '#f5222d'}
                  status={userGrowth >= 0 ? 'success' : 'exception'}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>订单增长率</span>
                  <span style={{ color: orderGrowth >= 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
                    {orderGrowth >= 0 ? '+' : ''}{orderGrowth}%
                  </span>
                </div>
                <Progress
                  percent={Math.min(Math.abs(orderGrowth), 100)}
                  strokeColor={orderGrowth >= 0 ? '#1890ff' : '#f5222d'}
                  status={orderGrowth >= 0 ? 'success' : 'exception'}
                />
              </div>

              <div>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>帖子增长率</span>
                  <span style={{ color: postGrowth >= 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
                    {postGrowth >= 0 ? '+' : ''}{postGrowth}%
                  </span>
                </div>
                <Progress
                  percent={Math.min(Math.abs(postGrowth), 100)}
                  strokeColor={postGrowth >= 0 ? '#722ed1' : '#f5222d'}
                  status={postGrowth >= 0 ? 'success' : 'exception'}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细数据表格 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="每日数据明细" loading={loading}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 月度统计 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="最近30天数据汇总" loading={loading}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="月度新增用户"
                  value={monthlyData.reduce((sum, item) => sum + item.users, 0)}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="月度新增订单"
                  value={monthlyData.reduce((sum, item) => sum + item.orders, 0)}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="月度新增帖子"
                  value={monthlyData.reduce((sum, item) => sum + item.posts, 0)}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Statistics

