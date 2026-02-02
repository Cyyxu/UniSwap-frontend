# Token 安全改造说明

## 改造概述

本次改造将前端认证机制从 `localStorage` 存储 Token 改为**内存变量存储**，并实现了**静默刷新（Silent Refresh）**和**请求队列机制**，大幅提升了安全性。

## 核心改动

### 1. Token 存储方式变更

**改造前：**
- Access Token 存储在 `localStorage`
- 容易被 XSS 攻击窃取

**改造后：**
- Access Token 存储在 JS 内存变量中（`src/utils/auth.ts`）
- Refresh Token 存储在 HttpOnly Cookie 中（后端设置，前端无法读取）
- 即使发生 XSS 攻击，攻击者也无法窃取 Token

### 2. 新增文件

#### `src/utils/auth.ts`
Token 内存管理模块，提供以下 API：
- `getAccessToken()` - 获取内存中的 Access Token
- `setAccessToken(token)` - 设置 Access Token 到内存
- `clearAccessToken()` - 清除内存中的 Token
- `hasAccessToken()` - 检查是否有 Token

### 3. 核心改造文件

#### `src/api/request.ts`
实现了静默刷新和请求队列机制：

**请求拦截器：**
- 从内存获取 Token（而非 localStorage）
- 自动添加 `Authorization` 头

**响应拦截器（核心）：**
- 监听 401 错误
- 自动调用 `/api/user/refresh` 接口刷新 Token
- 使用刷新锁（`isRefreshing`）防止并发刷新
- 使用请求队列（`requestsQueue`）暂存刷新期间的请求
- 刷新成功后自动重试失败的请求
- 刷新失败则跳转登录页

#### `src/store/authStore.ts`
- `setToken()` 改为调用 `setAccessToken()` 存入内存
- `logout()` 改为调用 `clearAccessToken()` 清除内存
- 新增 `isAuthenticated()` 方法检查登录状态

#### `src/main.tsx`
应用初始化时的静默刷新：
- 在渲染应用前调用 `/api/user/refresh` 接口
- 如果 Refresh Token 有效，恢复 Access Token 到内存
- 解决刷新页面后内存 Token 丢失的问题

#### `src/App.tsx`
- `PrivateRoute` 改为使用 `hasAccessToken()` 判断登录状态

#### `src/components/AdminRoute/index.tsx`
- 改为使用 `hasAccessToken()` 判断登录状态

## 工作流程

### 登录流程
1. 用户输入账号密码
2. 调用 `/api/user/login` 接口
3. 后端返回 Access Token，并设置 Refresh Token 到 HttpOnly Cookie
4. 前端将 Access Token 存入内存
5. 跳转到首页

### 请求流程
1. 发起 API 请求
2. 请求拦截器自动从内存获取 Token 并添加到请求头
3. 如果收到 401 响应：
   - 触发静默刷新机制
   - 调用 `/api/user/refresh` 接口（Cookie 自动带上 Refresh Token）
   - 更新内存中的 Access Token
   - 自动重试原请求
4. 如果刷新失败（Refresh Token 过期）：
   - 清除内存 Token
   - 跳转登录页

### 刷新页面流程
1. 用户按 F5 刷新页面
2. 内存中的 Access Token 丢失
3. `main.tsx` 中的 `initApp()` 自动调用 `/api/user/refresh`
4. 如果 Refresh Token 有效，恢复 Access Token 到内存
5. 用户无感知，保持登录状态

### 登出流程
1. 调用 `/api/user/logout` 接口
2. 后端清除 Refresh Token Cookie
3. 前端清除内存中的 Access Token
4. 跳转登录页

## 安全优势

### XSS 防护
- Access Token 存在内存中，XSS 脚本无法通过 `localStorage` 读取
- Refresh Token 在 HttpOnly Cookie 中，JS 完全无法访问
- 即使攻击者注入恶意脚本，也无法窃取 Token

### CSRF 防护
- Refresh Token 使用 HttpOnly + SameSite Cookie
- 后端需配合实现 CSRF Token 验证（建议）

### Token 泄露风险降低
- Access Token 短期有效（建议 15-30 分钟）
- Refresh Token 长期有效（建议 7-30 天）
- 即使 Access Token 泄露，影响时间窗口很小

## 后端配置要求

### 1. 登录接口 (`/api/user/login`)
返回格式：
\`\`\`json
{
  "errorCode": 0,
  "data": {
    "accessToken": "eyJhbGc...",
    "user": { ... }
  }
}
\`\`\`

同时设置 Refresh Token 到 Cookie：
\`\`\`java
Cookie cookie = new Cookie("refreshToken", refreshToken);
cookie.setHttpOnly(true);  // 关键：防止 JS 读取
cookie.setSecure(true);    // 生产环境必须：仅 HTTPS 传输
cookie.setPath("/");
cookie.setMaxAge(7 * 24 * 60 * 60); // 7 天
response.addCookie(cookie);
\`\`\`

### 2. 刷新接口 (`/api/user/refresh`)
- 从 Cookie 中读取 Refresh Token
- 验证 Refresh Token 有效性
- 返回新的 Access Token

返回格式：
\`\`\`json
{
  "errorCode": 0,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
\`\`\`

### 3. 登出接口 (`/api/user/logout`)
- 清除 Refresh Token Cookie
\`\`\`java
Cookie cookie = new Cookie("refreshToken", null);
cookie.setMaxAge(0);
cookie.setPath("/");
response.addCookie(cookie);
\`\`\`

## 注意事项

### 1. 刷新页面问题
- 用户刷新页面时，内存 Token 会丢失
- `main.tsx` 中的 `initApp()` 会自动尝试刷新
- 如果 Refresh Token 也过期，用户需要重新登录

### 2. 多标签页同步
- 不同标签页的内存 Token 是独立的
- 如果需要同步，可以使用 `BroadcastChannel` API（可选）

### 3. 开发环境配置
确保 `vite.config.ts` 配置了代理：
\`\`\`typescript
server: {
  proxy: {
    '/uniswap': {
      target: 'http://localhost:8109',
      changeOrigin: true,
    }
  }
}
\`\`\`

### 4. 生产环境配置
- 后端必须设置 `cookie.setSecure(true)`（仅 HTTPS）
- 配置 CORS 允许 `credentials`
- 建议添加 CSRF Token 验证

## 兼容性说明

### 旧代码兼容
- `useAuthStore` 的 API 保持不变
- 登录、登出逻辑无需修改
- 只是底层存储方式改变

### 清理旧数据
用户首次使用新版本时，建议清理旧的 localStorage：
\`\`\`typescript
// 可在 main.tsx 中添加
localStorage.removeItem('token');
\`\`\`

## 测试建议

### 1. 功能测试
- [ ] 登录成功后能正常访问需要认证的页面
- [ ] 刷新页面后保持登录状态
- [ ] Token 过期后自动刷新
- [ ] Refresh Token 过期后跳转登录页
- [ ] 登出后清除所有认证信息

### 2. 安全测试
- [ ] 检查 localStorage 中没有 Token
- [ ] 检查 Cookie 中的 Refresh Token 有 HttpOnly 标记
- [ ] 尝试 XSS 攻击，确认无法窃取 Token

### 3. 并发测试
- [ ] 同时发起多个需要认证的请求
- [ ] 确认只触发一次 Token 刷新
- [ ] 所有请求都能正常完成

## 总结

本次改造实现了业界最佳实践的认证方案，大幅提升了安全性：
- ✅ 防止 XSS 攻击窃取 Token
- ✅ 自动刷新 Token，用户无感知
- ✅ 刷新页面保持登录状态
- ✅ 并发请求优化，避免重复刷新
- ✅ 代码改动最小，兼容性好
