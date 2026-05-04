# AI助手输入框禁用问题修复

## 问题描述

AI助手回答完成后，输入框仍然处于禁用状态，无法继续输入新的问题。

## 问题原因

Home页面的 `streamChat` 函数在处理后端返回的纯文本格式SSE数据时，没有正确识别流结束标记，导致 `onDone()` 回调没有被调用，`aiLoading` 状态一直保持为 `true`，输入框持续禁用。

### 流程分析

```
┌─────────────────────────────────────────────────────────────┐
│                    问题流程                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 用户发送消息                                            │
│     setAiLoading(true)  ← 输入框禁用                       │
│                                                             │
│  2. 后端返回流式数据                                        │
│     data:好的                                               │
│     data:为了                                               │
│     ...                                                     │
│     {"errorCode":0,"errorMsg":"操作成功",...}  ← 结束标记  │
│                                                             │
│  3. streamChat 解析数据                                     │
│     ✅ 纯文本 → onMessage() 正常调用                       │
│     ❌ 结束标记 → 未识别，当作普通消息处理                 │
│                                                             │
│  4. 流结束                                                  │
│     while循环退出 → onDone() 被调用                        │
│     BUT: 在某些情况下，循环可能不会正常退出                │
│                                                             │
│  5. 结果                                                    │
│     aiLoading 保持为 true                                   │
│     输入框持续禁用 ❌                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 修复方案

修改 `src/pages/Home/index.tsx` 中的 `streamChat` 函数，添加对后端结束标记的识别：

### 修复要点

1. **识别后端结束标记**
   ```typescript
   // 检查是否是后端的结束标记 {"errorCode":0,...}
   if (parsed && typeof parsed === 'object' && 'errorCode' in parsed) {
     console.log('[Stream] 收到结束标记:', parsed)
     onDone()
     return  // 立即退出，调用 setAiLoading(false)
   }
   ```

2. **兼容多种SSE事件格式**
   ```typescript
   // 标准格式（大写）
   if (parsed.type === 'MESSAGE') { ... }
   if (parsed.type === 'DONE') { ... }
   if (parsed.type === 'ERROR') { ... }
   
   // 兼容小写
   if (parsed.type === 'token') { ... }
   if (parsed.type === 'done') { ... }
   if (parsed.type === 'error') { ... }
   ```

3. **纯文本格式兼容**
   ```typescript
   catch {
     // JSON解析失败，说明是纯文本消息
     if (data !== '[DONE]') {
       onMessage(data)
     }
   }
   ```

## 修复后的流程

```
┌─────────────────────────────────────────────────────────────┐
│                    修复后流程                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 用户发送消息                                            │
│     setAiLoading(true)  ← 输入框禁用                       │
│                                                             │
│  2. 后端返回流式数据                                        │
│     data:好的                                               │
│     data:为了                                               │
│     ...                                                     │
│     {"errorCode":0,"errorMsg":"操作成功",...}  ← 结束标记  │
│                                                             │
│  3. streamChat 解析数据                                     │
│     ✅ 纯文本 → onMessage() 正常调用                       │
│     ✅ 结束标记 → 识别成功！                               │
│        - 调用 onDone()                                      │
│        - return 退出循环                                    │
│                                                             │
│  4. onDone 回调执行                                         │
│     setAiLoading(false)  ← 输入框恢复可用 ✅               │
│                                                             │
│  5. 结果                                                    │
│     用户可以继续输入新问题 ✅                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 兼容的SSE格式

修复后的代码支持以下所有格式：

### 格式1：标准JSON格式（大写type）
```
data: {"type":"MESSAGE","content":"你好"}
data: {"type":"DONE","messageId":123}
data: {"type":"ERROR","content":"错误信息"}
```

### 格式2：标准JSON格式（小写type）
```
data: {"type":"token","content":"你好"}
data: {"type":"done","messageId":123}
data: {"type":"error","message":"错误信息"}
```

### 格式3：纯文本格式
```
data:你
data:好
data:，
data:我
data:是
data:AI
{"errorCode":0,"errorMsg":"操作成功",...}
```

## 测试验证

修复后，测试以下场景：

1. ✅ 发送消息后，输入框正确禁用
2. ✅ AI回复过程中，输入框保持禁用
3. ✅ AI回复完成后，输入框立即恢复可用
4. ✅ 可以连续发送多条消息
5. ✅ 错误情况下，输入框也能恢复可用
6. ✅ 兼容所有SSE格式

## 相关文件

- `src/pages/Home/index.tsx` - Home页面AI助手（已修复）
- `src/pages/AIChat/index.tsx` - AI聊天页面（使用 aiApi.stream，已正常）
- `src/api/ai.ts` - AI API（已支持纯文本格式）

## 注意事项

1. **两个不同的实现**
   - Home页面：使用自定义的 `streamChat` 函数
   - AIChat页面：使用 `aiApi.stream()` 方法
   - 两者都需要支持纯文本格式

2. **后端限流**
   - 后端已经实现了限流（3次/分钟）
   - 前端不需要额外的限流逻辑
   - 用户可以自由输入，后端会返回限流错误

3. **loading状态管理**
   - `setAiLoading(true)` 在发送消息时调用
   - `setAiLoading(false)` 在以下情况调用：
     - onDone() 回调（正常完成）
     - onError() 回调（错误情况）
     - catch块（异常情况）

## 修复时间

2026-05-05

## 修复状态

✅ 已完成 - Home页面AI助手输入框现在能正常恢复可用状态
