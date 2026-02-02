# Token 流程测试指南

## 修复内容总结

### 1. main.tsx 优化
- ✅ 添加详细的日志输出，方便调试
- ✅ 改进 Token 提取逻辑，确保正确解析 `response.data.data.accessToken`
- ✅ 添加 Token 有效性验证（非空字符串检查）
- ✅ 同时更新内存变量和 Store

### 2. request.ts 优化
- ✅ 添加 Token 存在性检查，防止发送 `Bearer undefined`
- ✅ 添加详细的请求日志，显示是否携带 Token

### 3. Layout 组件优化
- ✅ 添加 100ms 延迟，确保 Token 完全设置后再请求购物车
- ✅ 添加错误处理和日志输出

## 测试步骤

### 测试 1：刷新页面恢复登录态

1. **登录系统**
   ```
   访问 http://localhost:5173/login
   输入账号密码登录
   ```

2. **刷新页面**
   ```
   按 F5 或点击浏览器刷新按钮
   ```

3. **检查控制台日志**
   应该看到以下日志序列：
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

4. **验证结果**
   - ✅ 页面保持登录状态
   - ✅ 用户信息正常显示
   - ✅ 购物车数量正常显示
   - ✅ 没有 "用户未登录" 错误

### 测试 2：未登录状态刷新

1. **清除登录状态**
   ```
   点击退出登录
   ```

2. **刷新页面**
   ```
   按 F5 刷新
   ```

3. **检查控制台日志**
   应该看到：
   ```
   [App Init] 尝试静默刷新 Token...
   [App Init] 静默刷新失败（未登录或登录已过期）
   [App Init] 错误状态码: 401
   ```

4. **验证结果**
   - ✅ 页面显示未登录状态
   - ✅ 显示"登录"和"注册"按钮
   - ✅ 没有报错提示

### 测试 3：Token 过期自动刷新

1. **等待 Access Token 过期**
   ```
   登录后等待 30 分钟（或后端配置的过期时间）
   ```

2. **触发需要认证的操作**
   ```
   点击购物车、个人中心等需要登录的功能
   ```

3. **检查控制台日志**
   应该看到：
   ```
   [API Request] POST /api/cart/list
   [API Request] 已添加 Token: eyJ...
   (收到 401 响应)
   [Token Refresh] 开始刷新 Token...
   [Token Refresh] 刷新成功，更新 Token
   [API Request] POST /api/cart/list (重试)
   [API Request] 已添加 Token: eyJ... (新 Token)
   ```

4. **验证结果**
   - ✅ 自动刷新 Token，用户无感知
   - ✅ 原请求自动重试成功
   - ✅ 没有跳转到登录页

### 测试 4：Refresh Token 过期

1. **清除后端 Cookie**
   ```
   在浏览器开发者工具 -> Application -> Cookies
   删除 refreshToken
   ```

2. **刷新页面**
   ```
   按 F5 刷新
   ```

3. **检查控制台日志**
   应该看到：
   ```
   [App Init] 尝试静默刷新 Token...
   [App Init] 静默刷新失败（未登录或登录已过期）
   ```

4. **验证结果**
   - ✅ 页面显示未登录状态
   - ✅ 需要重新登录

## 常见问题排查

### 问题 1：刷新后仍然报"用户未登录"

**排查步骤：**
1. 检查控制台是否有 `[App Init] ✅ 静默刷新成功` 日志
2. 检查是否有 `[App Init] Token 前缀:` 日志
3. 检查购物车请求是否有 `[API Request] 已添加 Token:` 日志

**可能原因：**
- 后端返回结构不匹配：检查 `[App Init] 刷新接口完整响应:` 的内容
- Token 提取失败：检查是否有 `从 data.data.accessToken 提取: 失败` 日志
- 竞态问题未解决：检查购物车请求是否在 Token 设置之前发出

### 问题 2：后端报 500 错误

**排查步骤：**
1. 检查后端日志
2. 确认 Cookie 中是否有 `refreshToken`
3. 确认后端刷新接口是否正确实现

**可能原因：**
- 后端未正确读取 Cookie
- Refresh Token 验证失败
- 后端代码有 bug

### 问题 3：购物车请求发送了 `Bearer undefined`

**排查步骤：**
1. 检查是否有 `[API Request] 无 Token，跳过 Authorization 头` 日志
2. 检查 Token 提取是否成功

**可能原因：**
- Token 提取逻辑错误
- 后端返回结构不符合预期

## 调试技巧

### 1. 查看完整的响应结构
在 `main.tsx` 中已添加：
```typescript
console.log('[App Init] 刷新接口完整响应:', response.data)
```

### 2. 查看 Token 是否正确设置
在 `main.tsx` 中已添加：
```typescript
console.log('[App Init] Token 前缀:', accessToken.substring(0, 20) + '...')
```

### 3. 查看请求是否携带 Token
在 `request.ts` 中已添加：
```typescript
console.log('[API Request] 已添加 Token:', token.substring(0, 20) + '...')
```

### 4. 使用浏览器开发者工具
- Network 标签：查看请求头中的 `Authorization`
- Application 标签：查看 Cookie 中的 `refreshToken`
- Console 标签：查看所有日志输出

## 预期效果

修复后，整个 Token 流程应该是：

1. **首次登录**
   - 用户输入账号密码
   - 后端返回 Access Token（响应体）+ Refresh Token（Cookie）
   - 前端存储 Access Token 到内存
   - 所有请求携带 Access Token

2. **刷新页面**
   - 内存中的 Access Token 丢失
   - `initApp` 自动调用刷新接口
   - Cookie 自动携带 Refresh Token
   - 后端返回新的 Access Token
   - 前端恢复登录态

3. **Access Token 过期**
   - 请求返回 401
   - 拦截器自动调用刷新接口
   - 获取新的 Access Token
   - 自动重试原请求

4. **Refresh Token 过期**
   - 刷新接口返回 401
   - 清除登录状态
   - 跳转到登录页

## 下一步

如果测试通过，可以：
1. 移除部分调试日志（保留关键日志）
2. 调整 Token 过期时间
3. 添加更多的错误处理
4. 优化用户体验（加载动画等）
