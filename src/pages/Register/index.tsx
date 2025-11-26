import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../../api/user'
import './index.css'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    if (values.userPassword !== values.checkPassword) {
      message.error('两次密码输入不一致')
      return
    }
    setLoading(true)
    try {
      await userApi.register({
        userAccount: values.userAccount,
        userPassword: values.userPassword,
        checkPassword: values.checkPassword,
        userName: values.userName,
      })
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error: any) {
      message.error(error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <Card className="register-card" bordered={false}>
        <div className="register-header">
          <h1>🎓 注册账号</h1>
          <p>创建您的账号，开始交易之旅</p>
        </div>
        <Form
          name="register"
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
              placeholder="账号"
            />
          </Form.Item>
          <Form.Item
            name="userName"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="昵称（可选）"
            />
          </Form.Item>
          <Form.Item
            name="userPassword"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item
            name="checkPassword"
            rules={[{ required: true, message: '请确认密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              注册
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            已有账号？<Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register

