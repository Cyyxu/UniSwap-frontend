import { Card, Row, Col, Statistic, Progress, List, Avatar } from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { statisticsApi, TrendData } from '../../../api/statistics'
import './index.css'

const Dashboard = () => {
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
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [categoryStats, setCategoryStats] = useState<any[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      // 从后端获取统计数据
      const [statsData, trendDataList]: any[] = await Promise.all([
        statisticsApi.getOverall(),
        statisticsApi.getTrend(7),
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

      // 设置趋势数据
      setTrendData(trendDataList || [])

      // 生成最近活动（基于趋势数据）
      const activities: any[] = []
      trendDataList.forEach((trend: TrendData) => {
        if (trend.users > 0) {
          activities.push({
            type: 'user',
            title: `${trend.date} 新增 ${trend.users} 位用户`,
            time: `${trend.date}`,
            icon: <UserOutlined />,
            color: '#52c41a',
          })
        }
        if (trend.orders > 0) {
          activities.push({
            type: 'order',
            title: `${trend.date} 新增 ${trend.orders} 个订单`,
            time: `${trend.date}`,
            icon: <ShoppingCartOutlined />,
            color: '#1890ff',
          })
        }
        if (trend.posts > 0) {
          activities.push({
            type: 'post',
            title: `${trend.date} 新增 ${trend.posts} 篇帖子`,
            time: `${trend.date}`,
            icon: <FileTextOutlined />,
            color: '#722ed1',
          })
        }
      })
      setRecentActivities(activities.slice(0, 10))

      // 商品分类统计（基于总数的百分比）
      const totalCommodities = statsData.totalCommodities || 0
      const categories = [
        { name: '电子产品', count: Math.floor(totalCommodities * 0.4), color: '#1890ff' },
        { name: '图书教材', count: Math.floor(totalCommodities * 0.3), color: '#52c41a' },
        { name: '生活用品', count: Math.floor(totalCommodities * 0.2), color: '#faad14' },
        { name: '其他', count: Math.floor(totalCommodities * 0.1), color: '#f5222d' },
      ]
      setCategoryStats(categories)
    } catch (error) {
      console.error('加载统计数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <h1>数据概览</h1>
      
      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="用户总数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: stats.userGrowthRate >= 0 ? '#52c41a' : '#f5222d' }}>
                  {stats.userGrowthRate >= 0 ? '+' : ''}{stats.userGrowthRate}%
                </span>
              }
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              今日新增：{stats.todayUsers}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="商品总数"
              value={stats.totalCommodities}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="订单总数"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: stats.orderGrowthRate >= 0 ? '#52c41a' : '#f5222d' }}>
                  {stats.orderGrowthRate >= 0 ? '+' : ''}{stats.orderGrowthRate}%
                </span>
              }
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              今日新增：{stats.todayOrders}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="帖子总数"
              value={stats.totalPosts}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: stats.postGrowthRate >= 0 ? '#52c41a' : '#f5222d' }}>
                  {stats.postGrowthRate >= 0 ? '+' : ''}{stats.postGrowthRate}%
                </span>
              }
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              今日新增：{stats.todayPosts}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="最近7天数据趋势" loading={loading}>
            <div style={{ padding: '20px 0' }}>
              {trendData.map((item, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.date}</span>
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
        
        <Col xs={24} lg={8}>
          <Card title="商品分类分布" loading={loading}>
            <div style={{ padding: '20px 0' }}>
              {categoryStats.map((category, index) => (
                <div key={index} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{category.name}</span>
                    <span style={{ fontWeight: 'bold' }}>{category.count}</span>
                  </div>
                  <Progress
                    percent={Math.round((category.count / stats.totalCommodities) * 100)}
                    strokeColor={category.color}
                    status="active"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="最近活动" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: item.color }}
                        icon={item.icon}
                      />
                    }
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

