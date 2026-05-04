# AI流式接口buffer处理问题修复

## 问题现象

AI助手回答完成后，输入框仍然处于禁用状态，即使结束标记已经返回。

## 实际数据格式

后端返回的数据**全部在一行，没有换行符**：

```
data:我是data: Unidata:Swapdata: 二data:手data:交易data:平台的data:智能data:助手...data:？{"errorCode":0,"errorMsg":"操作成功","timestamp":"2026-05-05 01:05:43","traceId":"08401392fab34d9c"}
```

## 根本原因

### 问题1：按换行符分割失败

前端代码使用 `buffer.split('\n')` 分割数据：

```typescript
buffer += decoder.decode(value, { stream: true })
const lines = buffer.split('\n')  // ← 如果没有\n，返回只有一个元素的数组
buffer = lines.pop() || ''         // ← pop()移除了唯一的元素
                                   // lines现在是空数组！

for (const line of lines) {        // ← 不会执行，因为lines是空的
  // 检测结束标记的代码永远不会运行
}
```

### 问题2：结束标记在buffer中

当所有数据在一行时：
1. `split('\n')` 返回 `[整行数据]`
2. `lines.pop()` 把整行数据放回buffer
3. for循环处理空的lines数组
4. 结束标记一直留在buffer中，从未被检测

### 流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    问题流程                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 接收数据                                                │
│     value = "data:我是data:...{"errorCode":0,...}"         │
│     （注意：整个响应在一行，没有\n）                        │
│                                                             │
│  2. 添加到buffer                                            │
│     buffer = "data:我是data:...{"errorCode":0,...}"        │
│                                                             │
│  3. 分割buffer                                              │
│     lines = buffer.split('\n')                             │
│     // 结果：lines = [整行数据]  （只有一个元素）          │
│                                                             │
│  4. 保留最后一行                                            │
│     buffer = lines.pop()                                    │
│     // 结果：buffer = 整行数据                             │
│     //       lines = []  （空数组！）                      │
│                                                             │
│  5. 处理lines                                               │
│     for (const line of lines) {  // lines是空的            │
│       // 这里的代码永远不会执行！                          │
│       if (line.includes('errorCode')) {                    │
│         onDone()  // ← 永远不会被调用                      │
│       }                                                     │
│     }                                                       │
│                                                             │
│  6. 循环继续                                                │
│     done = true → break                                     │
│     结束标记仍在buffer中，从未被处理                       │
│                                                             │
│  7. 结果                                                    │
│     onDone() 从未被调用                                     │
│     aiLoading 保持为 true                                   │
│     输入框持续禁用 ❌                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 修复方案

### 方案1：在每次接收数据后检查buffer

在 `buffer += decoder.decode(value)` 之后，立即检查buffer中是否包含结束标记：

```typescript
buffer += decoder.decode(value, { stream: true })

// 🔥 关键修复：检查buffer中是否包含结束标记
if (buffer.includes('{"errorCode"')) {
  const match = buffer.match(/\{"errorCode"[^}]*\}/);
  if (match) {
    try {
      const endData = JSON.parse(match[0])
      console.log('[Stream] 在buffer中找到结束标记:', endData)
      onDone()
      return  // 立即退出
    } catch (e) {
      // 继续处理
    }
  }
}

// 然后继续正常的行处理
const lines = buffer.split('\n')
buffer = lines.pop() || ''
// ...
```

### 方案2：在流结束时检查buffer

在 `if (done)` 分支中，检查buffer中的剩余数据：

```typescript
if (done) {
  // 🔥 流结束时，检查buffer中是否有剩余数据
  if (buffer.trim()) {
    console.log('[Stream] 流结束，处理剩余buffer:', buffer.substring(0, 100))
    
    if (buffer.includes('{"errorCode"')) {
      const match = buffer.match(/\{"errorCode"[^}]*\}/);
      if (match) {
        try {
          const endData = JSON.parse(match[0])
          console.log('[Stream] 在buffer中找到结束标记:', endData)
          onDone()
          return
        } catch (e) {
          console.error('[Stream] 解析buffer中的结束标记失败:', e)
        }
      }
    }
  }
  break
}
```

### 完整修复代码

```typescript
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  
  if (done) {
    // 方案2：流结束时检查buffer
    if (buffer.trim() && buffer.includes('{"errorCode"')) {
      const match = buffer.match(/\{"errorCode"[^}]*\}/);
      if (match) {
        try {
          const endData = JSON.parse(match[0])
          console.log('[Stream] 在buffer中找到结束标记:', endData)
          onDone()
          return
        } catch (e) {
          console.error('[Stream] 解析失败:', e)
        }
      }
    }
    break
  }

  buffer += decoder.decode(value, { stream: true })
  
  // 方案1：每次接收数据后检查buffer
  if (buffer.includes('{"errorCode"')) {
    const match = buffer.match(/\{"errorCode"[^}]*\}/);
    if (match) {
      try {
        const endData = JSON.parse(match[0])
        console.log('[Stream] 在buffer中找到结束标记:', endData)
        onDone()
        return
      } catch (e) {
        // 继续处理
      }
    }
  }
  
  // 正常的行处理
  const lines = buffer.split('\n')
  buffer = lines.pop() || ''

  for (const line of lines) {
    // ... 处理每一行
  }
}
```

## 为什么使用正则表达式

使用 `buffer.match(/\{"errorCode"[^}]*\}/)` 而不是简单的字符串搜索：

1. **精确匹配**：确保提取完整的JSON对象
2. **容错性**：即使结束标记后面还有其他数据，也能正确提取
3. **安全性**：避免提取不完整的JSON导致解析失败

### 正则表达式说明

```javascript
/\{"errorCode"[^}]*\}/
```

- `\{` - 匹配左花括号 `{`
- `"errorCode"` - 匹配字符串 "errorCode"
- `[^}]*` - 匹配任意非右花括号的字符，任意次
- `\}` - 匹配右花括号 `}`

这样可以匹配：
```json
{"errorCode":0,"errorMsg":"操作成功","timestamp":"2026-05-05 01:05:43","traceId":"08401392fab34d9c"}
```

## 修复后的流程

```
┌─────────────────────────────────────────────────────────────┐
│                    修复后流程                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 接收数据                                                │
│     value = "data:我是data:...{"errorCode":0,...}"         │
│                                                             │
│  2. 添加到buffer                                            │
│     buffer = "data:我是data:...{"errorCode":0,...}"        │
│                                                             │
│  3. 🔥 立即检查buffer                                       │
│     if (buffer.includes('{"errorCode"')) {                 │
│       const match = buffer.match(/\{"errorCode"[^}]*\}/)   │
│       const endData = JSON.parse(match[0])                 │
│       onDone()  ✓ 被调用！                                 │
│       return    ✓ 立即退出                                 │
│     }                                                       │
│                                                             │
│  4. onDone回调执行                                          │
│     setAiLoading(false)  ✓ loading状态清除                 │
│                                                             │
│  5. 结果                                                    │
│     输入框恢复可用 ✅                                       │
│     用户可以继续输入 ✅                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 修改的文件

1. **src/pages/Home/index.tsx**
   - 在 `buffer += decoder.decode(value)` 后添加结束标记检测
   - 在 `if (done)` 分支中添加buffer检查

2. **src/api/ai.ts**
   - 相同的修复逻辑

## 测试验证

### 1. 浏览器控制台

应该看到以下日志之一：

```
[Stream] 在buffer中找到结束标记: {errorCode: 0, errorMsg: "操作成功", ...}
```

或

```
[Stream] 流结束，处理剩余buffer: data:我是data:...
[Stream] 在buffer中找到结束标记: {errorCode: 0, errorMsg: "操作成功", ...}
```

### 2. 功能验证

1. ✅ 发送消息
2. ✅ AI逐字回复
3. ✅ 回复完成后，输入框**立即**恢复可用
4. ✅ 可以连续发送多条消息

### 3. Network验证

在Response中查看原始数据：
- 所有数据可能在一行
- 没有换行符 `\n`
- 结束标记紧跟在最后一个token后面

## 关键教训

1. **不要假设数据格式**：不能假设SSE数据一定有换行符
2. **检查buffer内容**：当数据可能在一行时，需要在buffer中直接搜索
3. **使用正则表达式**：提取嵌入在字符串中的JSON对象
4. **双重保险**：在接收数据时检查 + 在流结束时检查
5. **添加详细日志**：帮助追踪数据在buffer中的状态

## 修复时间

2026-05-05

## 修复状态

✅ 已完成 - 前端现在能正确处理无换行符的流式数据，输入框能正常恢复可用状态
