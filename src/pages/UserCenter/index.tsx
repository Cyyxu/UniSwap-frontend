import { useEffect, useState } from 'react'
import { Card, Descriptions, Avatar, Button, Tag, Modal, Form, Input, message, Spin, Upload } from 'antd'
import { UserOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { useAuthStore } from '../../store/authStore'
import { userApi, UpdateMyUserRequest } from '../../api/user'
import { fileApi } from '../../api/file'
import { formatDateTime } from '../../utils/format'

const UserCenter = () => {
  const { user, setUser } = useAuthStore()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [uploadLoading, setUploadLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')

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
    const currentAvatar = userInfo?.userAvatar || ''
    setAvatarUrl(currentAvatar)
    form.setFieldsValue({
      userName: userInfo?.userName,
      userAvatar: currentAvatar,
      userProfile: userInfo?.userProfile,
      userPhone: userInfo?.userPhone,
      userEmail: userInfo?.userEmail,
      userSchool: userInfo?.userSchool,
      userMajor: userInfo?.userMajor,
      userAddress: userInfo?.userAddress,
    })
    setEditModalOpen(true)
  }

  // 上传前校验
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件！')
      return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！')
      return false
    }
    return true
  }

  // 自定义上传逻辑（两步上传）
  const handleUploadChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true)
      return
    }
    
    if (info.file.status === 'done' || info.file.originFileObj) {
      try {
        setUploadLoading(true)
        
        // 第一步：上传图片到 MinIO，获取 URL
        const file = info.file.originFileObj as RcFile
        const imageUrl = await fileApi.upload(file)
        
        console.log('图片上传成功，URL:', imageUrl)
        
        // 更新表单和预览
        setAvatarUrl(imageUrl)
        form.setFieldsValue({ userAvatar: imageUrl })
        
        message.success('头像上传成功')
      } catch (error: any) {
        console.error('上传失败:', error)
        message.error(error?.message || '上传失败')
      } finally {
        setUploadLoading(false)
      }
    }
    
    if (info.file.status === 'error') {
      setUploadLoading(false)
      message.error('上传失败')
    }
  }

  // 自定义上传请求（阻止 antd 默认上传行为）
  const customRequest = ({ file, onSuccess }: any) => {
    // 立即标记为成功，实际上传在 handleUploadChange 中处理
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      // 第二步：使用上传后的 URL 更新用户信息
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
      if (!error.handled) {
        message.error(error.message || '保存失败')
      }
    }
  }

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  )

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
          <Form.Item name="userName" label="昵称">
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="头像">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              customRequest={customRequest}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="userAvatar" label="头像URL" tooltip="上传图片后自动填充，也可手动输入">
            <Input placeholder="请输入头像图片地址或上传图片" />
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
