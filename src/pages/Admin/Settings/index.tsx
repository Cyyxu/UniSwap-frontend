import { useState } from 'react'
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  message, 
  Upload, 
  Avatar, 
  Switch, 
  Select, 
  Slider,
  Radio,
  Space,
  Divider
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  BgColorsOutlined,
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons'
import { useAuthStore } from '../../../store/authStore'
import { userApi } from '../../../api/user'
import './index.css'

const { TabPane } = Tabs

const Settings = () => {
  const { user, setUser } = useAuthStore()
  const [accountForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [profileForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    primaryColor: '#1890ff',
    fontSize: 14,
    layout: 'side',
  })

  // 账户设置保存
  const handleAccountSave = async (values: any) => {
    try {
      setLoading(true)
      await userApi.updateMyUser({
        userName: values.userName,
        userAvatar: values.userAvatar,
      })
      
      // 更新本地用户信息
      const updatedUser: any = await userApi.getCurrentUser()
      setUser(updatedUser)
      
      message.success('账户信息更新成功')
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 密码修改
  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    
    try {
      setLoading(true)
      await userApi.updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      
      message.success('密码修改成功，3秒后将自动退出登录')
      passwordForm.resetFields()
      
      // 3秒后退出登录
      setTimeout(() => {
        userApi.logout().finally(() => {
          window.location.href = '/login'
        })
      }, 3000)
    } catch (error: any) {
      message.error(error.response?.data?.message || '密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  // 个人信息保存
  const handleProfileSave = async (values: any) => {
    try {
      setLoading(true)
      await userApi.updateMyUser({
        userPhone: values.phone,
        userEmail: values.email,
        userSchool: values.school,
        userMajor: values.major,
        userAddress: values.address,
        userProfile: values.bio,
      })
      message.success('个人信息更新成功')
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 头像上传 - 暂时只支持URL输入
  const handleAvatarUpload = async (info: any) => {
    // TODO: 等待后端实现文件上传接口
    message.info('头像上传功能暂未开放，请在下方输入头像URL')
  }

  // 主题设置保存
  const handleThemeSave = () => {
    // 保存到localStorage
    localStorage.setItem('themeSettings', JSON.stringify(themeSettings))
    message.success('主题设置已保存')
  }

  return (
    <div className="settings-page">
      <h1 style={{ marginBottom: 24 }}>系统设置</h1>
      
      <Tabs defaultActiveKey="account" type="card">
        {/* 账户设置 */}
        <TabPane 
          tab={<span><UserOutlined />账户设置</span>} 
          key="account"
        >
          <Card>
            <h2>基本信息</h2>
            <Form
              form={accountForm}
              layout="vertical"
              onFinish={handleAccountSave}
              initialValues={{
                userName: user?.userName,
                userAccount: user?.userAccount,
              }}
              style={{ maxWidth: 600 }}
            >
              <Form.Item label="头像">
                <Space align="center">
                  <Avatar size={80} src={user?.userAvatar} icon={<UserOutlined />} />
                  <Upload
                    showUploadList={false}
                    onChange={handleAvatarUpload}
                  >
                    <Button icon={<UploadOutlined />}>更换头像</Button>
                  </Upload>
                </Space>
              </Form.Item>

              <Form.Item
                label="用户名"
                name="userName"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item
                label="账号"
                name="userAccount"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="头像URL"
                name="userAvatar"
                initialValue={user?.userAvatar}
              >
                <Input placeholder="请输入头像图片链接" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存更改
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <h2>修改密码</h2>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                label="当前密码"
                name="oldPassword"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password 
                  placeholder="请输入当前密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
              >
                <Input.Password 
                  placeholder="请输入新密码（至少6位）"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="确认密码"
                name="confirmPassword"
                rules={[{ required: true, message: '请确认新密码' }]}
              >
                <Input.Password 
                  placeholder="请再次输入新密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<LockOutlined />} loading={loading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* 个人信息 */}
        <TabPane 
          tab={<span><UserOutlined />个人信息</span>} 
          key="profile"
        >
          <Card>
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileSave}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                label="手机号"
                name="phone"
                rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item
                label="学校"
                name="school"
              >
                <Input placeholder="请输入学校名称" />
              </Form.Item>

              <Form.Item
                label="专业"
                name="major"
              >
                <Input placeholder="请输入专业" />
              </Form.Item>

              <Form.Item
                label="宿舍地址"
                name="address"
              >
                <Input.TextArea rows={3} placeholder="请输入宿舍地址（用于线下交易）" />
              </Form.Item>

              <Form.Item
                label="个人简介"
                name="bio"
              >
                <Input.TextArea rows={4} placeholder="介绍一下自己吧" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存信息
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* 安全设置 */}
        <TabPane 
          tab={<span><SafetyOutlined />安全设置</span>} 
          key="security"
        >
          <Card>
            <h2>账户安全</h2>
            
            <div style={{ marginBottom: 24 }}>
              <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 600 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>双因素认证</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      开启后，登录时需要额外的验证码
                    </div>
                  </div>
                  <Switch />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>登录提醒</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      异地登录时发送通知
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>密码强度检测</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      当前密码强度：<span style={{ color: '#52c41a' }}>中等</span>
                    </div>
                  </div>
                  <Button size="small">检测</Button>
                </div>
              </Space>
            </div>

            <Divider />

            <h2>隐私设置</h2>
            <div style={{ marginTop: 16 }}>
              <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 600 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>个人资料可见性</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      控制其他用户能看到的信息
                    </div>
                  </div>
                  <Select defaultValue="public" style={{ width: 120 }}>
                    <Select.Option value="public">公开</Select.Option>
                    <Select.Option value="friends">仅好友</Select.Option>
                    <Select.Option value="private">私密</Select.Option>
                  </Select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>允许陌生人私信</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      关闭后只能接收好友消息
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Space>
            </div>
          </Card>
        </TabPane>

        {/* 界面自定义 */}
        <TabPane 
          tab={<span><BgColorsOutlined />界面自定义</span>} 
          key="appearance"
        >
          <Card>
            <h2>主题设置</h2>
            <div style={{ maxWidth: 600 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>主题模式</div>
                <Radio.Group 
                  value={themeSettings.theme}
                  onChange={(e) => setThemeSettings({...themeSettings, theme: e.target.value})}
                >
                  <Radio.Button value="light">浅色</Radio.Button>
                  <Radio.Button value="dark">深色</Radio.Button>
                  <Radio.Button value="auto">跟随系统</Radio.Button>
                </Radio.Group>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>主题色</div>
                <Space>
                  {['#1890ff', '#52c41a', '#722ed1', '#eb2f96', '#fa8c16'].map(color => (
                    <div
                      key={color}
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: color,
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: themeSettings.primaryColor === color ? '3px solid #000' : 'none'
                      }}
                      onClick={() => setThemeSettings({...themeSettings, primaryColor: color})}
                    />
                  ))}
                </Space>
              </div>

              <Divider />

              <h2>布局设置</h2>
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>导航布局</div>
                <Radio.Group 
                  value={themeSettings.layout}
                  onChange={(e) => setThemeSettings({...themeSettings, layout: e.target.value})}
                >
                  <Radio.Button value="side">侧边导航</Radio.Button>
                  <Radio.Button value="top">顶部导航</Radio.Button>
                  <Radio.Button value="mix">混合导航</Radio.Button>
                </Radio.Group>
              </div>

              <Divider />

              <h2>显示设置</h2>
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>字体大小</div>
                <Slider
                  min={12}
                  max={18}
                  value={themeSettings.fontSize}
                  onChange={(value) => setThemeSettings({...themeSettings, fontSize: value})}
                  marks={{
                    12: '小',
                    14: '中',
                    16: '大',
                    18: '特大'
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>高对比度</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      提高文字和背景的对比度
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>紧凑模式</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      减少页面元素间距
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button type="primary" onClick={handleThemeSave} loading={loading}>
                应用设置
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Settings

