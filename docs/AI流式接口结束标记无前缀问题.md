# AI流式接口结束标记无前缀问题修复

## 问题现象

AI助手回答完成后，输入框一直处于禁用状态（灰色），发送按钮显示loading状态（橙色），用户无法继续输入。

## 根本原因

**后端返回的结束标记没有 `data:` 前缀！**

### 后端实际返回格式

```
data:好的
data:
data:为了
data:给您
data:推荐
...
{"errorCode":0,"errorMsg":"操作成功","timestamp":"2026-05-05 00:44:28","traceId":"68f09f524d49470f"}
```

注意最后一行：`{"errorCode":0,...}` **没有** `data:` 前缀！

### 前端原有逻辑

```typescript
for (const line of lines) {
  if (line.startsWith('data:')) {
    // 只处理以data:开头的行
    const dataContent = line.substring(5)
    
    if (dataContent.includes('errorCode')) {
      onDone()  // ← 这里永远不会执行！
      return
    }
  }
  // 结束标记没有data:前缀，直接被跳过！
}
```

### 问题流程

```
┌─────────────────────────────────────────────────────────────┐
│                    问题流程图                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 后端发送流式数据                                        │
│     data:好的  ✓ 被处理                                    │
│     data:为了  ✓ 被处理                                    │
│     ...                                                     │
│     {"errorCode":0,...}  ❌ 没有data:前缀，被跳过！        │
│                                                             │
│  2. 前端解析逻辑                                            │
│     for (const line of lines) {                            │
│       if (line.startsWith('data:')) {  ← 检查失败          │
│         // 处理数据                                        │
│       }                                                     │
│       // 结束标记被跳过，继续循环                          │
│     }                                                       │
│                                                             │
│  3. 循环正常结束                                            │
│     while (true) {                                          │
│       const { done, value } = await reader.read()          │
│       if (done) break  ← 这里才退出                        │
│     }                                                       │
│     onDone()  ← 在循环外调用，但可能不会执行到             │
│                                                             │
│  4. 结果                                                    │
│     aiLoading 保持为 true                                   │
│     输入框持续禁用 ❌                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 修复方案

在处理每一行数据时，**优先检测无前缀的JSON结束标记**：

### 修复代码

```typescript
for (const line of lines) {
  // 🔥 关键修复：优先检测无前缀的结束标记
  if (line.trim().startsWith('{') && line.includes('errorCode')) {
    try {
      const endData = JSON.parse(line.trim())
      if (endData && typeof endData === 'object' && 'errorCode' in endData) {
        console.log('[Stream] 收到结束标记（无data前缀）:', endData)
        onDone()
        return  // 立即退出，清除loading状态
      }
    } catch {
      // 不是有效的JSON，继续处理
    }
  }
  
  // 然后处理正常的data:行
  if (line.startsWith('data:')) {
    const dataContent = line.slice(5).trim()
    // ... 处理数据
  }
}
```

### 修复后的流程

```
┌─────────────────────────────────────────────────────────────┐
│                    修复后流程图                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 后端发送流式数据                                        │
│     data:好的  ✓ 被处理                                    │
│     data:为了  ✓ 被处理                                    │
│     ...                                                     │
│     {"errorCode":0,...}  ✓ 被检测到！                      │
│                                                             │
│  2. 前端解析逻辑                                            │
│     for (const line of lines) {                            │
│       // 优先检测无前缀的JSON                              │
│       if (line.trim().startsWith('{') &&                   │
│           line.includes('errorCode')) {                    │
│         const endData = JSON.parse(line.trim())            │
│         if ('errorCode' in endData) {                      │
│           onDone()  ✓ 被调用！                             │
│           return    ✓ 立即退出                             │
│         }                                                   │
│       }                                                     │
│     }                                                       │
│                                                             │
│  3. onDone回调执行                                          │
│     setAiLoading(false)  ✓ loading状态清除                 │
│                                                             │
│  4. 结果                                                    │
│     输入框恢复可用 ✅                                       │
│     用户可以继续输入 ✅                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 修改的文件

### 1. src/pages/Home/index.tsx

在 `streamChat` 函数的 `for (const line of lines)` 循环开始处添加：

```typescript
// 先检查是否是结束标记（不带data:前缀的JSON）
if (line.trim().startsWith('{') && line.includes('errorCode')) {
  try {
    const parsed = JSON.parse(line.trim())
    if (parsed && typeof parsed === 'object' && 'errorCode' in parsed) {
      console.log('[Stream] 收到结束标记（无data前缀）:', parsed)
      onDone()
      return
    }
  } catch {
    // 不是有效的JSON，继续处理
  }
}
```

### 2. src/api/ai.ts

在 `stream` 方法的 `for (const line of lines)` 循环开始处添加相同的逻辑：

```typescript
// 先检查是否是结束标记（不带data:前缀的JSON）
if (line.trim().startsWith('{') && line.includes('errorCode')) {
  try {
    const endData = JSON.parse(line.trim())
    if (endData && typeof endData === 'object' && 'errorCode' in endData) {
      console.log('[AI Stream] 流结束标记（无data前缀）:', endData)
      onDone(Date.now())
      return
    }
  } catch {
    // 不是有效的JSON，继续处理
  }
}
```

## 验证方法

### 1. 浏览器控制台验证

打开浏览器开发者工具（F12），在Console中应该看到：

```
[Stream] 收到结束标记（无data前缀）: {errorCode: 0, errorMsg: "操作成功", ...}
```

### 2. 功能验证

1. ✅ 发送消息后，输入框正确禁用
2. ✅ AI回复过程中，输入框保持禁用
3. ✅ AI回复完成后，输入框**立即**恢复可用（不再卡住）
4. ✅ 可以连续发送多条消息
5. ✅ 发送按钮从loading状态恢复为正常状态

### 3. Network验证

在Network标签页中查看 `/api/llm/stream` 请求：

- 状态码：200
- Response最后一行：`{"errorCode":0,"errorMsg":"操作成功",...}`
- 注意：这一行**没有** `data:` 前缀

## 为什么之前没发现

1. **文档误导**：API文档中写的是标准SSE格式（带data:前缀），但实际后端实现不同
2. **测试不充分**：之前的修复只测试了纯文本内容的处理，没有注意到结束标记的格式
3. **假设错误**：假设所有SSE数据都有 `data:` 前缀，但后端的结束标记是例外

## 关键教训

1. **不要假设格式**：即使文档这样写，也要验证实际返回的数据格式
2. **查看原始数据**：使用Network标签查看原始响应，而不是只看处理后的结果
3. **添加详细日志**：在关键位置添加日志，帮助追踪数据流
4. **测试边界情况**：不仅测试正常流程，还要测试开始和结束的边界情况

## 后端建议

虽然前端已经兼容了这种格式，但建议后端统一格式：

### 当前格式（不规范）
```
data:好的
data:为了
{"errorCode":0,"errorMsg":"操作成功"}  ← 没有data:前缀
```

### 建议格式（规范）
```
data: {"type":"token","content":"好的"}
data: {"type":"token","content":"为了"}
data: {"type":"done","messageId":123}  ← 统一有data:前缀
```

或者至少保持一致：
```
data:好的
data:为了
data:{"errorCode":0,"errorMsg":"操作成功"}  ← 加上data:前缀
```

## 修复时间

2026-05-05

## 修复状态

✅ 已完成 - 前端已兼容无前缀的结束标记，输入框现在能正常恢复可用状态
