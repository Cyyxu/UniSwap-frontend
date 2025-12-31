import { useEffect, useState } from 'react'
import { Card, Descriptions, Avatar, Button, Tag, Modal, Form, Input, message, Spin } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import { userApi, UpdateMyUserRequest } from '../../api/user'
import { formatDateTime } from '../../utils/format'

const UserCenter = () => {
  const { user, setUser } = useAuthStore()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    setLoading(true)
    try {
      const res = await userApi.getCurrentUser()
      setUserInfo(res)
    } catch (error) {
      console.error('加载用户信息失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    form.setFieldsValue({
      userName: userInfo?.userName,
      userAvatar: userInfo?.userAvatar,
      userProfile: userInfo?.userProfile,
      userPhone: userInfo?.userPhone,
      userEmail: userInfo?.userEmail,
      userSchool: userInfo?.userSchool,
      userMajor: userInfo?.userMajor,
      userAddress: userInfo?.userAddress,
    })
    setEditModalOpen(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await userApi.updateMyUser(values as UpdateMyUserRequest)
      message.success('保存成功')
      setEditModalOpen(false)
      loadUserInfo()
      // 更新全局用户状态
      if (user) {
        setUser({ ...user, userName: values.userName, userAvatar: values.userAvatar })
      }
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.message || '保存失败')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Spin spinning={loading}>
        <Card 
          title="个人信息" 
          extra={<Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑资料</Button>}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar size={100} src={userInfo?.userAvatar} icon={<UserOutlined />} />
            <h2 style={{ marginTop: 16, marginBottom: 4 }}>{userInfo?.userName}</h2>
            <Tag color={userInfo?.userRole === 'admin' ? 'red' : 'blue'}>
              {userInfo?.userRole === 'admin' ? '管理员' : '普通用户'}
            </Tag>
          </div>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="用户ID">{userInfo?.id}</Descriptions.Item>
            <Descriptions.Item label="账号">{userInfo?.userAccount}</Descriptions.Item>
            <Descriptions.Item label="昵称">{userInfo?.userName || '-'}</Descriptions.Item>
            <Descriptions.Item label="手机号">{userInfo?.userPhone || '-'}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{userInfo?.userEmail || '-'}</Descriptions.Item>
            <Descriptions.Item label="学校">{userInfo?.userSchool || '-'}</Descriptions.Item>
            <Descriptions.Item label="专业">{userInfo?.userMajor || '-'}</Descriptions.Item>
            <Descriptions.Item label="地址">{userInfo?.userAddress || '-'}</Descriptions.Item>
            <Descriptions.Item label="个人简介" span={2}>{userInfo?.userProfile || '-'}</Descriptions.Item>
            <Descriptions.Item label="注册时间" span={2}>{formatDateTime(userInfo?.createdAt)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Spin>

      <Modal
        title="编辑个人资料"
        open={editModalOpen}
        onOk={handleSave}
        onCancel={() => setEditModalOpen(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="userAvatar" label="头像URL">
            <Input placeholder="请输入头像图片地址" />
          </Form.Item>
          <Form.Item name="userPhone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="userEmail" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="userSchool" label="学校">
            <Input placeholder="请输入学校" />
          </Form.Item>
          <Form.Item name="userMajor" label="专业">
            <Input placeholder="请输入专业" />
          </Form.Item>
          <Form.Item name="userAddress" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item name="userProfile" label="个人简介">
            <Input.TextArea rows={3} placeholder="请输入个人简介" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserCenter
