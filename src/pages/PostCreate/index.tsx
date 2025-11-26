import { useState } from 'react'
import { Card, Form, Input, Button, message, Tag, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { postApi, PostAddRequest } from '../../api/post'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

const PostCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = async (values: PostAddRequest) => {
    setLoading(true)
    try {
      await postApi.add({
        ...values,
        tags: tags.length > 0 ? tags : [],
      })
      message.success('发布成功')
      navigate('/post')
    } catch (error: any) {
      message.error(error.message || '发布失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <Card title="发布帖子">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入帖子标题" size="large" />
        </Form.Item>
        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <TextArea
            rows={12}
            placeholder="请输入帖子内容..."
            showCount
            maxLength={5000}
          />
        </Form.Item>
        <Form.Item label="标签">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                placeholder="输入标签后按回车添加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onPressEnter={handleAddTag}
                style={{ width: 200 }}
              />
              <Button icon={<PlusOutlined />} onClick={handleAddTag}>
                添加
              </Button>
            </Space>
            <div>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  color="blue"
                  style={{ marginBottom: 8 }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </Space>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              发布
            </Button>
            <Button onClick={() => navigate(-1)}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PostCreate

