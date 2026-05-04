# AI 流式接口使用说明

## 接口概述

后端提供了流式 AI 对话接口 `/api/llm/stream`，使用 Server-Sent Events (SSE) 实现实时逐字推送 AI 响应。

**接口特点：**
- 使用 SSE 协议进行流式传输
- 需要在请求头中设置 `Accept: text/event-stream`
- 请求体使用 `userInputText` 字段（匹配后端 `UserAiMessageDTO`）
- 支持可选的 `commodityId` 参数用于商品相关对话

## 前端使用示例

### 1. 基础用法（字符串参数）

```typescript
import { aiApi } from '@/api/ai'

// 在组件中使用 - 传递字符串
const handleStreamChat = async () => {
  await aiApi.stream(
    '你好，请介绍一下自己',
    (token) => {
      // 处理每个文本片段（打字机效果）
      console.log('收到token:', token)
      setResponse((prev) => prev + token)
    },
    (messageId) => {
      // 流式传输完成
      console.log('对话完成，消息ID:', messageId)
    },
    (error) => {
      // 错误处理
      console.error('流式传输错误:', error)
      message.error('AI 对话失败，请重试')
    }
  )
}
```

### 2. 高级用法（对象参数，包含商品上下文）

```typescript
import { aiApi } from '@/api/ai'

// 传递完整请求对象
const handleStreamChat = async () => {
  await aiApi.stream(
    {
      userInputText: '这个商品怎么样？',
      commodityId: 123,
    },
    (token) => {
      setResponse((prev) => prev + token)
    },
    (messageId) => {
      console.log('对话完成，消息ID:', messageId)
    },
    (error) => {
      message.error(`对话失败: ${error}`)
    }
  )
}
```

### 3. React 组件完整示例

```typescript
import React, { useState } from 'react'
import { Button, Input, Card, message } from 'antd'
import { aiApi } from '@/api/ai'

const AIChat: React.FC = () => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) {
      message.warning('请输入内容')
      return
    }

    setLoading(true)
    setResponse('') // 清空之前的回复

    try {
      await aiApi.stream(
        input, // 直接传递字符串
        (token) => {
          // 实时追加内容（打字机效果）
          setResponse((prev) => prev + token)
        },
        (messageId) => {
          setLoading(false)
          message.success('对话完成')
          console.log('消息ID:', messageId)
        },
        (error) => {
          setLoading(false)
          message.error(`对话失败: ${error}`)
        }
      )
    } catch (error) {
      setLoading(false)
      console.error('发送失败:', error)
    }
  }

  return (
    <div>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入你的问题..."
        rows={4}
      />
      <Button
        type="primary"
        onClick={handleSend}
        loading={loading}
        style={{ marginTop: 16 }}
      >
        发送
      </Button>
      
      {response && (
        <Card title="AI 回复" style={{ marginTop: 16 }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{response}</div>
        </Card>
      )}
    </div>
  )
}

export default AIChat
```

## API 签名

```typescript
aiApi.stream(
  request: string | AiChatRequest,
  onToken: (token: string) => void,
  onDone: (messageId: number) => void,
  onError: (error: string) => void
): Promise<void>
```

**参数说明：**
- `request`: 用户消息内容（字符串）或完整请求对象
  - 字符串：直接传递消息内容，如 `"你好"`
  - 对象：`{ userInputText: string, commodityId?: number }`
- `onToken`: 接收每个文本片段的回调函数
- `onDone`: 流式传输完成的回调函数，接收消息ID
- `onError`: 错误处理回调函数，接收错误消息

## 后端接口要求

**请求格式：**
```
POST /api/llm/stream
Content-Type: application/json
Accept: text/event-stream
Authorization: Bearer <token>

{
  "userInputText": "你好",
  "commodityId": 123  // 可选
}
```

**响应格式（SSE）：**

前端已兼容两种格式：

**格式1：标准JSON格式（推荐）**
```
data: {"type":"token","content":"你"}
data: {"type":"token","content":"好"}
data: {"type":"done","messageId":12345}
```

**格式2：纯文本格式（当前后端实现）**
```
data:你
data:好
data:，
data:我
data:是
data:AI
data:助手
{"errorCode":0,"errorMsg":"操作成功","timestamp":"2026-05-05 00:44:28","traceId":"..."}
```

**错误响应：**
```
data: {"type":"error","message":"错误信息"}
```

## 认证机制

前端使用 `getAccessToken()` 获取当前用户的访问令牌，并通过 `Authorization` 请求头传递：

```
Authorization: Bearer <access_token>
```

**认证流程：**
1. 调用 `getAccessToken()` 获取令牌
2. 验证令牌是否存在（空值检查）
3. 使用 `formatAuthToken()` 确保 Bearer 前缀
4. 在请求头中包含 Authorization 字段

## 错误处理

前端会自动处理以下错误场景：

| HTTP 状态码 | 错误消息 | 说明 |
|------------|---------|------|
| 401/403 | 登录已过期，请重新登录 | Token 无效或过期 |
| 429 | 请求过于频繁，请稍后再试 | 触发限流 |
| 其他 | 从响应体解析错误消息 | 其他服务端错误 |

**调试日志：**
- Token 获取日志（前20个字符）
- 请求 URL 日志
- 错误详情日志

## 注意事项

1. **Token 管理**：使用统一的 `getAccessToken()` 获取令牌，确保与其他 API 保持一致
2. **错误处理**：务必实现 `onError` 回调，处理网络错误和认证失败等情况
3. **打字机效果**：在 `onToken` 回调中使用 `setResponse((prev) => prev + token)` 追加内容
4. **限流**：后端限制为 3次/分钟（`@RateLimit(rate = 3)`），请合理控制请求频率
5. **Token 刷新**：流式接口不支持自动 Token 刷新，如果 Token 在对话过程中过期，需要用户重新登录
6. **格式兼容**：前端已兼容两种SSE格式：
   - 标准JSON格式：`data: {"type":"token","content":"文本"}`
   - 纯文本格式：`data:文本`（当前后端实现）

## 常见问题

### Q1: 为什么使用 fetch 而不是 axios？
A: SSE 需要逐块读取响应流，`fetch` API 的 `ReadableStream` 提供了更好的流式处理能力。axios 不适合处理 SSE。

### Q2: Token 过期了怎么办？
A: 流式接口中 Token 过期时，会触发 `onError('登录已过期，请重新登录')` 回调。建议在回调中提示用户重新登录。

### Q3: 如何实现打字机效果？
A: 在 `onToken` 回调中使用 `setResponse((prev) => prev + token)` 追加内容即可实现逐字显示效果。

### Q4: 如何传递商品上下文？
A: 使用对象参数：`aiApi.stream({ userInputText: '问题', commodityId: 123 }, ...)`

### Q5: SSE 事件格式是什么？
A: 后端返回的每行以 `data: ` 开头，后跟 JSON 对象。前端会自动解析并根据 `type` 字段调用相应的回调函数。
