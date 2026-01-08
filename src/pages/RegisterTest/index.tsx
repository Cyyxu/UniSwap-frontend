import { useState } from 'react'
import { Card, Button, message, Descriptions, Tag } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { registerApi } from '../../api/register'

interface ParsedResult {
  statusCode?: number
  username?: string
  email?: string
  password?: string
  [key: string]: any
}

const RegisterTest = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ParsedResult | null>(null)

  const parseResult = (rawResult: string): ParsedResult => {
    try {
      // 尝试直接解析为 JSON
      const jsonData = JSON.parse(rawResult)
      return { statusCode: 200, ...jsonData }
    } catch (e) {
      // 如果不是纯 JSON，尝试旧格式解析
      const parsed: ParsedResult = {}
      
      // 提取状态码
      const statusMatch = rawResult.match(/Status Code:\s*(\d+)/)
      if (statusMatch) {
        parsed.statusCode = parseInt(statusMatch[1])
      }
      
      // 提取 JSON 部分
      const jsonMatch = rawResult.match(/Response Body:\s*(\{[\s\S]*\})/)
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[1])
          Object.assign(parsed, jsonData)
        } catch (e) {
          // JSON 解析失败，保留原始文本
          parsed.raw = rawResult
        }
      } else {
        parsed.raw = rawResult
      }
      
      return parsed
    }
  }

  const handleTest = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await registerApi.testRegister()
      const parsedData = parseResult(typeof res === 'string' ? res : JSON.stringify(res))
      setResult(parsedData)
      message.success('测试完成')
    } catch (error: any) {
      setResult({ error: error.message })
      message.error('测试失败')
    } finally {
      setLoading(false)
    }
  }

  const isSuccess = result?.statusCode && result.statusCode >= 200 && result.statusCode < 300

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Card 
        title={
          <span style={{ fontSize: 18, color: '#FF6B00' }}>
            🧪 注册测试工具
          </span>
        }
        style={{ 
          background: 'linear-gradient(135deg, #FFF9E6 0%, #FFEDD5 100%)',
          border: '1px solid #FFD8A8'
        }}
      >
        <Button 
          type="primary" 
          icon={<PlayCircleOutlined />} 
          onClick={handleTest}
          loading={loading}
          size="large"
          style={{ 
            background: 'linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)',
            border: 'none',
            height: 48,
            fontSize: 16,
            fontWeight: 500
          }}
        >
          {loading ? '测试中...' : '执行测试注册'}
        </Button>
        
        {result && (
          <Card 
            style={{ 
              marginTop: 24,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(255, 107, 0, 0.1)'
            }} 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isSuccess ? (
                  <>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                    <span style={{ color: '#52c41a' }}>测试成功</span>
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                    <span style={{ color: '#ff4d4f' }}>测试失败</span>
                  </>
                )}
              </div>
            }
          >
            <Descriptions 
              bordered 
              column={1}
              labelStyle={{ 
                background: '#FFF9E6',
                fontWeight: 500,
                width: 150
              }}
              contentStyle={{
                background: '#fff'
              }}
            >
              {result.username && (
                <Descriptions.Item label="用户名">
                  <span style={{ fontFamily: 'monospace', color: '#FF6B00' }}>
                    {result.username}
                  </span>
                </Descriptions.Item>
              )}
              {result.email && (
                <Descriptions.Item label="邮箱">
                  <span style={{ fontFamily: 'monospace', color: '#FF6B00' }}>
                    {result.email}
                  </span>
                </Descriptions.Item>
              )}
              {result.password && (
                <Descriptions.Item label="密码">
                  <span style={{ fontFamily: 'monospace', color: '#FF6B00' }}>
                    {result.password}
                  </span>
                </Descriptions.Item>
              )}
              {result.error && (
                <Descriptions.Item label="错误信息">
                  <span style={{ color: '#ff4d4f' }}>{result.error}</span>
                </Descriptions.Item>
              )}
              {result.raw && (
                <Descriptions.Item label="原始响应">
                  <pre style={{ 
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: 12
                  }}>
                    {result.raw}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </Card>
    </div>
  )
}

export default RegisterTest
