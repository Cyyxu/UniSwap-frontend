# AI助手历史记录说明

## 当前状态

### AIChat页面（/ai-chat）
✅ **有历史记录功能**
- 页面加载时自动加载历史记录
- 使用 `aiApi.getMyList()` 或 `aiApi.history()` 获取历史
- 历史记录保存在后端数据库
- 刷新页面后历史记录仍然存在

### Home页面的AI助手（右下角弹窗）
❌ **没有历史记录功能**
- 对话只保存在内存中（`aiMessages` state）
- 刷新页面后对话记录丢失
- 没有调用后端API保存对话
- 设计为临时快捷对话

## 问题分析

### 为什么Home页面没有历史记录？

1. **设计定位不同**
   - AIChat页面：完整的AI聊天功能，类似ChatGPT
   - Home页面AI助手：快捷咨询窗口，类似客服对话

2. **后端API调用差异**
   ```typescript
   // AIChat页面
   useEffect(() => {
     const loadMessages = async () => {
       const res = await aiApi.getMyList({ current: 1, pageSize: 50 })
       setMessages(res?.records || [])
     }
     loadMessages()
   }, [])
   
   // Home页面
   // 没有加载历史记录的代码
   // 只有内存中的 aiMessages state
   ```

3. **流式对话的保存问题**
   - 流式对话使用 `aiApi.stream()` 方法
   - 这个方法**不会自动保存**对话到数据库
   - 需要在对话完成后手动调用保存API

## 解决方案

### 方案1：让Home页面AI助手也有历史记录（推荐）

#### 步骤1：在页面加载时加载历史记录

```typescript
// src/pages/Home/index.tsx
useEffect(() => {
  const loadAiHistory = async () => {
    if (!token) return
    
    try {
      const res = await aiApi.getMyList({ current: 1, pageSize: 10 })
      const records = res?.records || []
      
      // 转换为aiMessages格式
      const historyMessages = records.flatMap(msg => {
        const messages = []
        if (msg.userInputText) {
          messages.push({ role: 'user', content: msg.userInputText })
        }
        if (msg.aiGenerateText) {
          messages.push({ role: 'ai', content: msg.aiGenerateText })
        }
        return messages
      })
      
      setAiMessages([
        { role: 'ai', content: '你好！我是UniSwap AI助手，有什么可以帮你的吗？' },
        ...historyMessages
      ])
    } catch (error) {
      console.error('加载AI历史记录失败', error)
    }
  }
  
  loadAiHistory()
}, [token])
```

#### 步骤2：在对话完成后保存记录

但是这里有个问题：**流式API不会自动保存对话**！

查看后端API文档，流式接口 `/api/llm/stream` 可能：
- 选项A：自动保存对话（需要确认后端实现）
- 选项B：不保存对话，需要前端调用同步API保存

如果是选项B，需要在 `onDone` 回调中调用同步API：

```typescript
streamChat(
  userMsg,
  (text) => {
    // 显示文本
  },
  () => {
    // 对话完成
    setAiLoading(false)
    
    // 🔥 保存对话到数据库
    aiApi.chat({ userInputText: userMsg })
      .then(() => console.log('对话已保存'))
      .catch(err => console.error('保存对话失败', err))
  },
  (error) => {
    // 错误处理
  }
)
```

### 方案2：保持现状，引导用户使用AIChat页面

如果Home页面的AI助手定位为"快捷咨询"，可以：

1. 在AI助手窗口添加提示：
   ```
   "需要查看历史记录？前往 AI聊天页面 →"
   ```

2. 添加一个按钮跳转到AIChat页面：
   ```typescript
   <Button 
     type="link" 
     onClick={() => navigate('/ai-chat')}
   >
     查看完整对话历史
   </Button>
   ```

## 推荐方案

**方案1（添加历史记录功能）**，理由：

1. **用户期望**：用户刷新页面后期望看到之前的对话
2. **数据一致性**：两个AI助手入口应该共享同一份历史记录
3. **用户体验**：避免用户因刷新页面而丢失对话内容

## 实现步骤

### 1. 确认后端行为

首先需要确认：**流式API是否自动保存对话？**

测试方法：
1. 在AIChat页面发送一条消息（使用流式API）
2. 刷新页面
3. 查看历史记录中是否有这条对话

如果有，说明后端自动保存了。
如果没有，需要前端手动调用保存API。

### 2. 修改Home页面

#### 2.1 添加历史记录加载

```typescript
useEffect(() => {
  if (!token || !showAiChat) return
  
  const loadHistory = async () => {
    try {
      const res = await aiApi.getMyList({ current: 1, pageSize: 10 })
      // 转换并设置历史记录
    } catch (error) {
      console.error('加载历史失败', error)
    }
  }
  
  loadHistory()
}, [token, showAiChat])
```

#### 2.2 （如果需要）添加保存逻辑

如果后端不自动保存，在 `onDone` 回调中调用保存API。

### 3. 测试验证

1. ✅ 在Home页面AI助手发送消息
2. ✅ 刷新页面
3. ✅ 历史记录仍然存在
4. ✅ 在AIChat页面也能看到相同的历史记录

## 当前修复

已修复的问题：
- ✅ 添加了 `AIMessage` 类型定义（兼容AIChat页面）
- ✅ 添加了 `aiApi.getMyList()` 方法（兼容AIChat页面）
- ✅ AIChat页面现在可以正常加载历史记录

待实现的功能：
- ⏳ Home页面AI助手加载历史记录
- ⏳ 确认流式API是否自动保存对话
- ⏳ （如果需要）添加手动保存逻辑

## 相关文件

- `src/api/ai.ts` - AI API定义（已修复类型和方法）
- `src/pages/AIChat/index.tsx` - AI聊天页面（有历史记录）
- `src/pages/Home/index.tsx` - Home页面（AI助手无历史记录）

## 修复时间

2026-05-05

## 修复状态

✅ 部分完成 - AIChat页面历史记录已修复，Home页面待实现
