import { useState } from 'react'
import { Form, Input, Button, Card, message, Tabs } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../../api/user'
import { useAuthStore } from '../../store/authStore'
import Register from '../Register'
import './index.css'

const Login = () => {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { userAccount: string; userPassword: string }) => {
    setLoading(true)
    try {
      const res = await userApi.login(values)
      console.log('登录响应:', res)
      
      // 根据实际后端返回结构：{ user: {...}, accessToken: "..." }
      const { accessToken, user } = res
      
      if (accessToken) {
        setToken(accessToken)
        setUser(user)
        message.success('登录成功')
        navigate('/', { replace: true })
      } else {
        message.error('登录异常：未返回 Token')
      }
    } catch (error: any) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <h1>🎓 校园二手交易平台</h1>
          <p>欢迎回来，请登录您的账号</p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="userAccount"
            rules={[{ required: true, message: '请输入账号!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入账号"
            />
          </Form.Item>
          <Form.Item
            name="userPassword"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            还没有账号？<Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login

