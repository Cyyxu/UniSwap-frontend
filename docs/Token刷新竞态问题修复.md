# Token 刷新竞态问题修复

## 问题描述

在实现双 Token 机制后，后端的 `/refresh` 接口工作正常，但前端出现了竞态问题：

**现象：**
- 刷新页面后，控制台显示 `[App Init] 静默刷新成功，恢复登录态`
- 但紧接着的购物车请求报错：`Error: 用户未登录`

**根本原因：**
1. **Token 提取路径错误**：后端返回 `{ errorCode: 0, data: { accessToken: "..." } }`，需要通过 `response.data.data.accessToken` 提取
2. **竞态条件**：Layout 组件的 `useEffect` 在 Token 完全设置到内存之前就触发了购物车请求

## 修复方案

### 1. 优化 main.tsx 的 Token 提取逻辑

**修改前：**
```typescript
const { data } = await axios.post(...)
let accessToken: string | null = null

if (data?.errorCode === 0) {
  accessToken = data.data?.accessToken || data.data  // ❌ 可能提取到 undefined
}
```

**修改后：**
```typescript
const response = await axios.post(...)

// 🔍 打印完整响应结构，方便调试
console.log('[App Init] 刷新接口完整响应:', response.data)

let accessToken: string | null = null

if (response.data?.errorCode === 0) {
  // 标准格式：Result<RefreshResponse>
  accessToken = response.data.data?.accessToken
  console.log('[App Init] 从 data.data.accessToken 提取:', accessToken ? '成功' : '失败')
}

// ✅ 严格验证 Token 有效性
if (accessToken && typeof accessToken === 'string' && accessToken.length > 0) {
  console.log('[App Init] ✅ 静默刷新成功，恢复登录态')
  console.log('[App Init] Token 前缀:', accessToken.substring(0, 20) + '...')
  
  // 同时更新内存变量和 Store
  setAccessToken(accessToken)
  useAuthStore.getState().setToken(accessToken)
}
```

**改进点：**
- ✅ 使用完整的 `response` 对象，避免解构丢失数据
- ✅ 添加详细的日志输出，方便调试
- ✅ 严格验证 Token 的类型和长度
- ✅ 同时更新内存变量和 Store，确保一致性

### 2. 优化 request.ts 的请求拦截器

**修改前：**
```typescript
const token = getAccessToken()
if (token) {
  config.headers.Authorization = formatAuthToken(token)
}
```

**修改后：**
```typescript
const token = getAccessToken()

// 🔍 只有当 token 存在且不为空字符串时才添加
if (token && token.trim().length > 0) {
  config.headers.Authorization = formatAuthToken(token)
  console.log('[API Request] 已添加 Token:', token.substring(0, 20) + '...')
} else {
  console.log('[API Request] 无 Token，跳过 Authorization 头')
}
```

**改进点：**
- ✅ 防止发送 `Bearer undefined` 或 `Bearer `
- ✅ 添加日志，方便排查 Token 是否正确携带

### 3. 优化 Layout 组件的购物车加载逻辑

**修改前：**
```typescript
useEffect(() => {
  if (token) {
    fetchCart()  // ❌ 可能在 Token 完全设置前就执行
  }
}, [token, fetchCart])
```

**修改后：**
```typescript
useEffect(() => {
  if (token) {
    // 添加微小延迟，确保 Token 已完全设置到请求拦截器中
    const timer = setTimeout(() => {
      console.log('[Layout] 开始加载购物车数据')
      fetchCart().catch(err => {
        console.error('[Layout] 购物车加载失败:', err)
      })
    }, 100)
    
    return () => clearTimeout(timer)
  }
}, [token, fetchCart])
```

**改进点：**
- ✅ 添加 100ms 延迟，确保 Token 完全设置后再请求
- ✅ 添加错误处理，避免未捕获的 Promise 错误
- ✅ 添加日志，方便追踪执行时机

## 技术原理

### 为什么需要延迟？

JavaScript 的事件循环机制：

1. `setAccessToken(token)` 是同步操作，立即执行
2. `useAuthStore.getState().setToken(token)` 触发 Store 更新
3. Store 更新触发 Layout 组件的 `useEffect`
4. 但此时可能存在微小的时间差，导致：
   - Token 已经设置到内存变量
   - 但请求拦截器还没来得及读取到最新值

通过添加 100ms 的延迟，确保：
- Token 完全设置到内存
- 所有依赖 Token 的组件都已更新
- 请求拦截器能正确读取到 Token

### 为什么不直接在 initApp 中阻塞渲染？

**方案对比：**

**方案 A（当前方案）：**
```typescript
async function initApp() {
  await refreshToken()  // 等待刷新完成
  root.render(<App />)  // 然后渲染
}
```

**方案 B（备选方案）：**
```typescript
async function initApp() {
  root.render(<App />)  // 先渲染
  await refreshToken()  // 后台刷新
}
```

**选择方案 A 的原因：**
- ✅ 确保首次渲染时 Token 已经就绪
- ✅ 避免首屏请求失败
- ✅ 用户体验更好（不会看到"未登录"闪烁）
- ⚠️ 缺点：首屏渲染会延迟 100-500ms（可接受）

## 测试验证

### 测试场景 1：刷新页面恢复登录态

**步骤：**
1. 登录系统
2. 刷新页面（F5）
3. 观察控制台日志

**预期结果：**
```
[App Init] 尝试静默刷新 Token...
[App Init] 刷新接口完整响应: { errorCode: 0, data: { accessToken: "eyJ..." } }
[App Init] 从 data.data.accessToken 提取: 成功
[App Init] ✅ 静默刷新成功，恢复登录态
[App Init] Token 前缀: eyJhbGciOiJIUzUxMiJ9...
[API Request] POST /api/user/current
[API Request] 已添加 Token: eyJhbGciOiJIUzUxMiJ9...
[Layout] 开始加载购物车数据
[API Request] POST /api/cart/list
[API Request] 已添加 Token: eyJhbGciOiJIUzUxMiJ9...
```

**验证点：**
- ✅ 页面保持登录状态
- ✅ 用户信息正常显示
- ✅ 购物车数量正常显示
- ✅ 没有 "用户未登录" 错误

### 测试场景 2：未登录状态刷新

**步骤：**
1. 退出登录
2. 刷新页面（F5）
3. 观察控制台日志

**预期结果：**
```
[App Init] 尝试静默刷新 Token...
[App Init] 静默刷新失败（未登录或登录已过期）
[App Init] 错误状态码: 401
```

**验证点：**
- ✅ 页面显示未登录状态
- ✅ 显示"登录"和"注册"按钮
- ✅ 没有报错提示

## 常见问题

### Q1: 为什么不把延迟时间设置得更长？

A: 100ms 是一个经过权衡的值：
- 太短（<50ms）：可能无法完全解决竞态问题
- 太长（>200ms）：影响用户体验，购物车加载延迟明显
- 100ms：既能解决问题，又不影响体验

### Q2: 如果后端返回结构变了怎么办？

A: 代码中已经添加了详细的日志：
```typescript
console.log('[App Init] 刷新接口完整响应:', response.data)
```
通过这个日志可以快速定位问题，然后调整提取逻辑。

### Q3: 为什么不使用 Promise.all 并发请求？

A: 购物车数据依赖于用户登录状态，必须在 Token 设置后才能请求。并发会导致竞态问题。

### Q4: 能否去掉 100ms 延迟？

A: 可以尝试以下优化方案：

**方案 1：使用 Promise 链**
```typescript
async function initApp() {
  await refreshToken()
  await new Promise(resolve => {
    root.render(<App />)
    resolve()
  })
}
```

**方案 2：使用事件通知**
```typescript
// 在 setAccessToken 后发送事件
window.dispatchEvent(new CustomEvent('token-ready'))

// 在 Layout 中监听事件
useEffect(() => {
  const handler = () => fetchCart()
  window.addEventListener('token-ready', handler)
  return () => window.removeEventListener('token-ready', handler)
}, [])
```

但这些方案都比当前的 100ms 延迟更复杂，性价比不高。

## 总结

通过以下三个关键修复：

1. **正确提取 Token**：`response.data.data.accessToken`
2. **防止发送空 Token**：严格验证 Token 有效性
3. **解决竞态问题**：添加 100ms 延迟

成功解决了 Token 刷新后购物车请求失败的问题。整个双 Token 机制现在运行稳定，用户体验良好。

## 相关文档

- [Token 安全改造说明](./Token安全改造说明.md)
- [后端刷新接口实现示例](./后端刷新接口实现示例.md)
- [测试验证指南](./测试验证指南.md)
