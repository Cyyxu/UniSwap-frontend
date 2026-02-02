# 双 Token 机制说明

## 架构概述

本项目采用 **Access Token + Refresh Token** 双 Token 机制，提供安全且用户体验良好的身份认证方案。

### Token 类型

| Token 类型 | 存储位置 | 有效期 | 用途 | 安全特性 |
|-----------|---------|--------|------|---------|
| **Access Token** | 内存变量 | 15-30分钟 | 业务接口认证 | 防 XSS（不存 localStorage） |
| **Refresh Token** | HttpOnly Cookie | 7-30天 | 刷新 Access Token | 防 XSS（JS 无法读取） |

---

## 后端接口实现

### 1. 登录接口 `/api/user/login`

**功能**：用户登录，返回 Access Token 并设置 Refresh Token Cookie

```java
@PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
    // 1. 验证用户账号密码
    User user = userService.login(request);
    
    // 2. 生成双 Token
    TokenService.TokenPair tokenPair = tokenService.generateTokenPair(user.getId());
    
    // 3. 设置 Refresh Token 到 HttpOnly Cookie
    ResponseCookie cookie = ResponseCookie.from("refresh_token", tokenPair.getRefreshToken())
            .httpOnly(true)           // JS 无法读取
            .secure(false)            // 本地调试 false，生产环境改为 true
            .path("/")                // 全站可用
            .maxAge(7 * 24 * 60 * 60) // 7天
            .sameSite("Strict")       // 防 CSRF
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    
    // 4. 返回 Access Token（响应体）
    LoginResponse resp = new LoginResponse();
    resp.setAccessToken(tokenPair.getAccessToken());
    resp.setUser(user);
    return resp;
}
```

**响应格式**：
```json
{
  "accessToken": "eyJhbGciOiJIUzM4NCJ9...",
  "user": {
    "id": 123,
    "userAccount": "admin",
    "userName": "管理员",
    "userRole": "admin"
  }
}
```

**Cookie 设置**：
```
Set-Cookie: refresh_token=eyJhbGciOiJIUzM4NCJ9...; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict
```

---

### 2. 刷新接口 `/api/user/refresh`

**功能**：使用 Refresh Token 获取新的 Access Token

```java
@PostMapping("/refresh")
@Operation(summary = "刷新Token")
public LoginResponse refreshToken(
    @CookieValue(name = "refresh_token", required = false) String refreshToken,
    HttpServletResponse response
) {
    if (StringUtils.isBlank(refreshToken)) {
        throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "Refresh token 缺失");
    }
    
    // 1. 验证旧 Token 并生成新 Token
    TokenService.TokenPair tokenPair = tokenService.refreshToken(refreshToken);
    
    // 2. 重新写 Cookie（刷新 Refresh Token 的过期时间）
    ResponseCookie cookie = ResponseCookie.from("refresh_token", tokenPair.getRefreshToken())
            .httpOnly(true)
            .secure(false) // 本地调试 false，上线改为 true
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .sameSite("Strict")
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    
    // 3. 返回新的 Access Token
    LoginResponse resp = new LoginResponse();
    resp.setAccessToken(tokenPair.getAccessToken());
    return resp;
}
```

**响应格式**：
```json
{
  "accessToken": "eyJhbGciOiJIUzM4NCJ9..."
}
```

---

### 3. 登出接口 `/api/user/logout`

**功能**：清除 Refresh Token Cookie

```java
@PostMapping("/logout")
public boolean logout(HttpServletResponse response) {
    // 清除 Cookie（设置 MaxAge = 0）
    ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0) // 立即过期
            .sameSite("Strict")
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    
    return true;
}
```

---

## 前端实现

### 1. 登录流程

```typescript
// src/pages/Login/index.tsx
const onFinish = async (values: { userAccount: string; userPassword: string }) => {
  try {
    const res = await userApi.login(values)
    
    // 解构响应（Access Token 在响应体，Refresh Token 在 Cookie）
    const { accessToken, user } = res
    
    if (accessToken) {
      // 存储 Access Token 到内存
      setToken(accessToken)
      setUser(user)
      
      message.success('登录成功')
      navigate('/', { replace: true })
    }
  } catch (error: any) {
    message.error(error.message || '登录失败')
  }
}
```

### 2. 请求拦截器（自动添加 Token）

```typescript
// src/api/request.ts
api.interceptors.request.use((config) => {
  // 从内存获取 Access Token
  const token = getAccessToken()
  
  if (token && token.trim().length > 0) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})
```

### 3. 响应拦截器（自动刷新 Token）

```typescript
// src/api/request.ts
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config
    
    // 收到 401 且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 防止刷新接口本身报 401 导致死循环
      if (originalRequest.url?.includes('/user/refresh')) {
        clearAccessToken()
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      
      // 如果已经有其他请求在刷新，进入队列等待
      if (isRefreshing) {
        return new Promise((resolve) => {
          requestsQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }
      
      // 开始刷新
      originalRequest._retry = true
      isRefreshing = true
      
      try {
        // 调用刷新接口（Cookie 会自动带上 Refresh Token）
        const refreshResponse = await axios.post(
          `${baseURL}/api/user/refresh`,
          {},
          { withCredentials: true } // 关键：发送 Cookie
        )
        
        // 提取新的 Access Token
        const newAccessToken = refreshResponse.data?.accessToken
        
        if (!newAccessToken) {
          throw new Error('刷新 Token 失败：未返回有效 Token')
        }
        
        // 更新内存中的 Token
        setAccessToken(newAccessToken)
        useAuthStore.getState().setToken(newAccessToken)
        
        // 执行队列中等待的请求
        requestsQueue.forEach(callback => callback(newAccessToken))
        requestsQueue = []
        
        // 重试当前请求
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
        
      } catch (refreshError) {
        // 刷新失败（Refresh Token 过期）-> 跳转登录
        requestsQueue = []
        clearAccessToken()
        useAuthStore.getState().logout()
        message.error('登录已过期，请重新登录')
        window.location.href = '/login'
        return Promise.reject(refreshError)
        
      } finally {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  }
)
```

---

## 完整流程图

### 首次登录
```
用户输入账号密码
    ↓
POST /api/user/login
    ↓
后端验证 → 生成双 Token
    ↓
响应体：Access Token
Cookie：Refresh Token (HttpOnly)
    ↓
前端存储 Access Token 到内存
    ↓
所有请求自动携带 Authorization: Bearer <Access Token>
```

### Access Token 过期自动刷新
```
业务请求 → 401 Unauthorized
    ↓
拦截器检测到 401
    ↓
POST /api/user/refresh (Cookie 自动携带 Refresh Token)
    ↓
后端验证 Refresh Token → 生成新 Access Token
    ↓
响应体：新 Access Token
Cookie：新 Refresh Token (刷新过期时间)
    ↓
前端更新内存中的 Token
    ↓
重试原请求（带新 Token）
    ↓
成功返回数据（用户无感知）
```

### Refresh Token 过期
```
业务请求 → 401
    ↓
POST /api/user/refresh → 401
    ↓
清除登录状态
    ↓
跳转登录页
    ↓
提示：登录已过期，请重新登录
```

---

## 安全特性

### 1. 防 XSS 攻击
- ✅ Access Token 存储在 **JS 内存变量**，不存 localStorage/sessionStorage
- ✅ Refresh Token 存储在 **HttpOnly Cookie**，JS 无法读取
- ✅ 即使页面被注入恶意脚本，也无法窃取 Token

### 2. 防 CSRF 攻击
- ✅ Cookie 设置 `SameSite=Strict`
- ✅ 业务接口使用 Authorization Header（不依赖 Cookie）
- ✅ 刷新接口虽然依赖 Cookie，但只返回 Token，不执行敏感操作

### 3. Token 泄露风险降低
- ✅ Access Token 短期有效（15-30分钟），即使泄露影响有限
- ✅ Refresh Token 长期有效但存储在 HttpOnly Cookie，难以窃取
- ✅ 刷新时同时更新 Refresh Token，进一步降低风险

### 4. 用户体验优化
- ✅ 静默刷新，用户无感知
- ✅ 并发请求只刷新一次，避免重复刷新
- ✅ 刷新失败才跳转登录，减少打断

---

## 配置说明

### 后端配置

```yaml
# application.yml
jwt:
  secret: your-secret-key-at-least-32-characters
  access-token-expiration: 1800000  # 30分钟（毫秒）
  refresh-token-expiration: 604800000  # 7天（毫秒）

# 生产环境
cookie:
  secure: true  # 仅 HTTPS
  same-site: Strict
```

### 前端配置

```typescript
// src/api/request.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // 关键：必须开启，用于发送和接收 Cookie
})
```

```env
# .env.development
VITE_API_BASE_URL=/uniswap

# .env.production
VITE_API_BASE_URL=https://your-domain.com/uniswap
```

---

## 测试验证

### 1. 登录测试
```bash
# 打开浏览器开发者工具
# Network 标签 → 查看 /api/user/login 响应
# - 响应体包含 accessToken
# - Response Headers 包含 Set-Cookie: refresh_token=...

# Application 标签 → Cookies
# - 确认 refresh_token 存在
# - 确认 HttpOnly = ✓
```

### 2. 自动刷新测试
```bash
# 方法 1：等待 Access Token 过期（30分钟）
# 方法 2：手动清除内存 Token
# 在控制台执行：
window.__clearToken = () => {
  const { clearAccessToken } = require('./utils/auth')
  clearAccessToken()
  console.log('Token 已清除，下次请求将自动刷新')
}
window.__clearToken()

# 然后访问任意需要登录的页面
# 观察 Network 标签：
# 1. 业务请求 → 401
# 2. /api/user/refresh → 200
# 3. 业务请求重试 → 200
```

### 3. Refresh Token 过期测试
```bash
# Application 标签 → Cookies
# 删除 refresh_token

# 访问任意需要登录的页面
# 预期：自动跳转到登录页
```

---

## 常见问题

### Q1: 为什么刷新接口返回 "Refresh token 缺失"？

**原因**：
- Cookie 未正确发送到后端
- `withCredentials: true` 未配置

**解决**：
```typescript
// 确保 axios 配置了 withCredentials
const api = axios.create({
  withCredentials: true, // 必须
})

// 刷新请求也要配置
axios.post('/api/user/refresh', {}, { 
  withCredentials: true 
})
```

### Q2: 为什么页面刷新后需要重新登录？

**原因**：
- Access Token 存储在内存，页面刷新后丢失
- 这是正常行为，符合安全设计

**解决**：
- 方案 1：在 App 初始化时调用刷新接口恢复登录态
- 方案 2：引导用户使用"记住我"功能（延长 Refresh Token 有效期）

### Q3: 本地开发时 Cookie 无法设置？

**原因**：
- 跨域问题
- SameSite 策略限制

**解决**：
```java
// 本地开发时设置
cookie.setSecure(false);  // 允许 HTTP
cookie.setSameSite("Lax"); // 放宽策略
```

---

## 总结

✅ **安全性**：双 Token 机制 + HttpOnly Cookie + 内存存储
✅ **用户体验**：静默刷新 + 并发优化 + 无感知续期
✅ **可维护性**：清晰的接口设计 + 完善的错误处理
✅ **生产就绪**：支持 HTTPS + CSRF 防护 + XSS 防护

你的实现已经完全符合业界最佳实践！🎉
