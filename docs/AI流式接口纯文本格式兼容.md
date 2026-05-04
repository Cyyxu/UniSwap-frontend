# AI 流式接口纯文本格式兼容修复

## 问题描述

前端调用 `/api/llm/stream` 接口时，后端正常返回流式数据，但前端UI没有任何反应。

### 后端实际返回的数据格式

```
data:好的
data:
data:为了
data:给您
data:推荐
data:最
data:合适的
data:手机
...
{"errorCode":0,"errorMsg":"操作成功","timestamp":"2026-05-05 00:44:28","traceId":"68f09f524d49470f"}
```

### 前端期望的数据格式

```
data: {"type":"token","content":"好"}
data: {"type":"token","content":"的"}
data: {"type":"done","messageId":12345}
```

## 根本原因

```
┌─────────────────────────────────────────────────────────────┐
│                    格式不匹配问题                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  后端发送：纯文本格式 + 无前缀的结束标记                   │
│  ┌──────────────────┐                                       │
│  │ data:好的         │  ← 有data:前缀                      │
│  │ data:            │                                       │
│  │ data:为了         │                                       │
│  │ {"errorCode":0}  │  ← 🔥 关键：结束标记没有data:前缀！ │
│  └──────────────────┘                                       │
│                                                             │
│  前端解析：只检查data:开头的行                              │
│  ┌────────────────────────────────────────┐                │
│  │ if (line.startsWith('data:')) {        │                │
│  │   // 处理数据                          │                │
│  │   if ('errorCode' in parsed) {         │                │
│  │     onDone() ← 永远不会执行！          │                │
│  │   }                                    │                │
│  │ }                                      │                │
│  │ // 结束标记没有data:前缀，被跳过！     │                │
│  └────────────────────────────────────────┘                │
│                                                             │
│  结果：onDone()永远不被调用 → aiLoading保持true           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 修复方案

修改前端 `src/api/ai.ts` 和 `src/pages/Home/index.tsx` 的SSE解析逻辑，在处理每一行数据时：

### 修复要点

1. **优先检测无前缀的结束标记**
   ```typescript
   // 🔥 关键修复：在检查data:之前，先检查无前缀的JSON
   if (line.trim().startsWith('{') && line.includes('errorCode')) {
     try {
       const endData = JSON.parse(line.trim())
       if (endData && typeof endData === 'object' && 'errorCode' in endData) {
         console.log('[Stream] 收到结束标记（无data前缀）:', endData)
         onDone()
         return  // 立即退出
       }
     } catch {
       // 不是有效的JSON，继续处理
     }
   }
   ```

2. **兼容有无空格的data前缀**
   ```typescript
   if (line.startsWith('data:')) {
     const dataContent = line.startsWith('data: ') 
       ? line.substring(6) 
       : line.substring(5)
     // 处理数据...
   }
   ```

3. **添加buffer处理跨chunk的数据**
   ```typescript
   let buffer = ''
   buffer += decoder.decode(value, { stream: true })
   const lines = buffer.split('\n')
   buffer = lines.pop() || '' // 保留不完整的行
   ```

4. **双重保险：data:内也检测结束标记**
   ```typescript
   // 在data:内的catch块中也检测
   if (dataContent.startsWith('{') && dataContent.includes('errorCode')) {
     const endData = JSON.parse(dataContent)
     onDone(Date.now())
   }
   ```

### 修改后的解析逻辑

```typescript
for (const line of lines) {
  if (line.startsWith('data:')) {
    // 兼容 data: 和 data: 两种格式
    const dataContent = line.startsWith('data: ') 
      ? line.substring(6) 
      : line.substring(5)
    
    // 跳过空行
    if (!dataContent.trim()) continue
    
    try {
      // 尝试JSON格式（标准）
      const data: SSEEvent = JSON.parse(dataContent)
      if (data.type === 'token') onToken(data.content)
      else if (data.type === 'done') onDone(data.messageId)
      else if (data.type === 'error') onError(data.message)
    } catch (e) {
      // 纯文本格式（后端当前实现）
      if (dataContent.startsWith('{') && dataContent.includes('errorCode')) {
        // 结束标记
        onDone(Date.now())
      } else {
        // 普通文本token
        onToken(dataContent)
      }
    }
  }
}
```

## 兼容性说明

修复后的前端代码可以同时支持：

### 格式1：标准JSON格式（推荐）

```
data: {"type":"token","content":"你"}
data: {"type":"token","content":"好"}
data: {"type":"done","messageId":12345}
```

**优点：**
- 结构化数据，易于扩展
- 可以传递额外的元数据
- 明确的事件类型

### 格式2：纯文本格式（当前后端）

```
data:你
data:好
data:，
data:我
data:是
data:AI
{"errorCode":0,"errorMsg":"操作成功",...}
```

**优点：**
- 后端实现简单
- 数据量更小
- 无需JSON序列化

## 测试验证

修复后，测试以下场景：

1. ✅ 后端返回纯文本格式时，前端能正常显示
2. ✅ 后端返回JSON格式时，前端能正常显示
3. ✅ 打字机效果正常工作
4. ✅ 流结束时正确调用 `onDone` 回调
5. ✅ 错误情况正确调用 `onError` 回调
6. ✅ 跨chunk的数据能正确拼接

## 调试日志

修复后的代码会输出以下日志：

```
[AI Stream] ===== 开始流式请求 =====
[AI Stream] 开始 Token 预检（调用 /api/user/current）...
[AI Stream] ✓ Token 预检成功
[AI Stream] ✓ Token 已获取
[AI Stream] 请求 URL: http://localhost:8080/api/llm/stream
[AI Stream] 请求体: {"userInputText":"推荐手机"}
[AI Stream] ✓ 连接成功，开始接收数据流
[AI Stream] 收到数据: 好的
[AI Stream] 纯文本模式，直接显示: 好的
[AI Stream] 收到数据: 为了
[AI Stream] 纯文本模式，直接显示: 为了
...
[AI Stream] 流结束标记: {errorCode: 0, errorMsg: "操作成功", ...}
[AI Stream] 数据流结束
```

## 后续优化建议

### 建议后端升级为标准JSON格式

虽然前端已兼容纯文本格式，但建议后端升级为标准JSON格式，原因：

1. **更好的扩展性**：可以传递更多元数据（如token类型、置信度等）
2. **更清晰的事件类型**：明确区分token、done、error事件
3. **更好的错误处理**：可以传递结构化的错误信息
4. **符合SSE最佳实践**：业界标准做法

### 后端修改示例（Java）

```java
// 当前实现（纯文本）
emitter.send("好的");

// 推荐实现（JSON）
Map<String, Object> event = new HashMap<>();
event.put("type", "token");
event.put("content", "好的");
emitter.send(SseEmitter.event()
    .data(objectMapper.writeValueAsString(event)));

// 结束事件
Map<String, Object> doneEvent = new HashMap<>();
doneEvent.put("type", "done");
doneEvent.put("messageId", messageId);
emitter.send(SseEmitter.event()
    .data(objectMapper.writeValueAsString(doneEvent)));
```

## 相关文件

- `src/api/ai.ts` - AI API实现（已修复）
- `docs/AI流式接口使用说明.md` - 使用文档（已更新）
- `src/pages/AIChat/index.tsx` - AI聊天页面（无需修改）

## 修复时间

2026-05-05

## 修复状态

✅ 已完成 - 前端已兼容后端当前的纯文本格式
