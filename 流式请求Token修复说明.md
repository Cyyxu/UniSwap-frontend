# 流式请求 Token 修复说明

## 问题根源

AI 对话使用的是**原生 fetch API**，它不会自动继承 axios 拦截器的逻辑：
- ❌ 不会自动从内存获取 Token
- ❌ 不会在 Token 过期时自动刷新
- ❌ 不会在刷新后自动重试请求

## 修复方案

### 核心思路：三步走策略

```typescript
// 步骤1：发起流式请求前，先用 axios 发一个轻量级请求
// 目的：触发 request.ts 的拦截器，如果 Token 过期会自动刷新
await api.post('/api/user/current', {})

// 步骤2：此时内存中的 Token 一定是最新的
const token = getAccessToken()

// 步骤3：使用新鲜的 Token 发起流式请求
const response = await fetch(`${baseURL}/api/llm/stream`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  credentials: 'include', // 携带 Cookie（Refresh Token）
})
```

## 修复的文件

1. ✅ `src/pages/AIChat/index.tsx` - AI 聊天页面
2. ✅ `src/pages/Home/index.tsx` - 首页的 AI 对话功能

## 修复内容

### 1. 导入必要的依赖
```typescript
import { getAccessToken } from '../../utils/auth'
import api from '../../api/request'
```

### 2. 修改 streamChat 函数
- 移除 `localStorage.getItem('token')`
- 添加 Token 预检逻辑（借助 axios 的自动刷新机制）
- 使用 `getAccessToken()` 获取内存中的 Token
- 添加 401 错误处理和登录跳转

## 工作原理

```
用户发送消息
    ↓
先调用 axios 请求（POST /api/user/current）
    ↓
如果 Token 过期 → request.ts 自动刷新 → 更新内存中的 Token
    ↓
从内存获取最新的 Token
    ↓
使用 fetch 发起流式请求（携带新鲜的 Token）
    ↓
成功接收流式响应 ✅
```

## 测试验证

1. **正常场景**：Token 未过期，直接成功
2. **Token 过期场景**：预检时自动刷新，流式请求成功
3. **Refresh Token 过期**：自动跳转登录页

## 技术要点

- ✅ 利用 axios 拦截器的自动刷新机制
- ✅ 内存存储 Token（安全性更高）
- ✅ 流式请求前的 Token 预检（使用 POST 方法）
- ✅ 统一的错误处理和登录跳转

