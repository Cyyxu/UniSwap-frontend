import { useState, useEffect } from 'react'
import { Table, Button, Input, Space, Tag, Popconfirm, message, Card } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { userApi } from '../../../api/user'
import './index.css'

interface User {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userRole: string
  createTime: string
}

const UserManage = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({
    current: 1,
    pageSize: 10,
    userName: '',
  })

  useEffect(() => {
    loadData()
  }, [query])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await userApi.getList(query)
      setUsers(res?.records || [])
      setTotal(res?.total || 0)
    } catch (error) {
      console.error('加载用户列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      // await userApi.delete(id)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      key: 'userAccount',
    },
    {
      title: '昵称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          admin: 'red',
          user: 'blue',
          ban: 'default',
        }
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-user-manage">
      <Card>
        <div className="page-header">
          <h1>用户管理</h1>
          <Space>
            <Input
              placeholder="搜索用户昵称"
              prefix={<SearchOutlined />}
              value={query.userName}
              onChange={(e) => setQuery({ ...query, userName: e.target.value, current: 1 })}
              style={{ width: 200 }}
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: query.current,
            pageSize: query.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => setQuery({ ...query, current: page, pageSize: size }),
          }}
        />
      </Card>
    </div>
  )
}

export default UserManage

