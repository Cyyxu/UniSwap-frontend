# 🚀 快速测试指南

## 修复内容

已修复 Token 刷新后购物车请求失败的竞态问题。

### 核心改动

1. **src/main.tsx** - 优化 Token 提取逻辑，添加详细日志
2. **src/api/request.ts** - 防止发送空 Token，添加请求日志
3. **src/components/Layout/index.tsx** - 添加延迟，解决竞态问题

## 快速测试

### 1️⃣ 启动开发服务器

```bash
npm run dev
```

### 2️⃣ 打开浏览器

访问：http://localhost:5173

### 3️⃣ 打开控制台

按 `F12` 打开浏览器开发者工具，切换到 Console 标签

### 4️⃣ 登录系统

使用测试账号登录

### 5️⃣ 刷新页面

按 `F5` 刷新页面

### 6️⃣ 观察日志

应该看到以下日志序列（按顺序）：

```
✅ [App Init] 尝试静默刷新 Token...
✅ [App Init] 刷新接口完整响应: { errorCode: 0, data: { accessToken: "eyJ..." } }
✅ [App Init] 从 data.data.accessToken 提取: 成功
✅ [App Init] ✅ 静默刷新成功，恢复登录态
✅ [App Init] Token 前缀: eyJhbGciOiJIUzUxMiJ9...
✅ [API Request] POST /api/user/current
✅ [API Request] 已添加 Token: eyJhbGciOiJIUzUxMiJ9...
✅ [Layout] 开始加载购物车数据
✅ [API Request] POST /api/cart/list
✅ [API Request] 已添加 Token: eyJhbGciOiJIUzUxMiJ9...
```

### 7️⃣ 验证结果

检查以下几点：

- ✅ 页面保持登录状态（没有跳转到登录页）
- ✅ 右上角显示用户头像和用户名
- ✅ 购物车图标显示正确的数量
- ✅ 控制台没有 "用户未登录" 错误
- ✅ 控制台没有 401 错误

## 预期效果对比

### ❌ 修复前

```
[App Init] 静默刷新成功，恢复登录态
[API Request] POST /api/cart/list
Error: 用户未登录  ← 这是问题！
```

### ✅ 修复后

```
[App Init] ✅ 静默刷新成功，恢复登录态
[App Init] Token 前缀: eyJhbGciOiJIUzUxMiJ9...
[Layout] 开始加载购物车数据
[API Request] POST /api/cart/list
[API Request] 已添加 Token: eyJhbGciOiJIUzUxMiJ9...
购物车数据加载成功 ✓
```

## 故障排查

### 问题 1：仍然报"用户未登录"

**检查点：**
1. 是否看到 `[App Init] ✅ 静默刷新成功` ？
2. 是否看到 `[App Init] Token 前缀:` ？
3. 是否看到 `[API Request] 已添加 Token:` ？

**如果没有看到这些日志：**
- 检查后端是否正常运行
- 检查后端返回的数据结构（看 `刷新接口完整响应` 日志）
- 检查浏览器 Cookie 中是否有 `refreshToken`

### 问题 2：后端报 500 错误

**检查点：**
1. 后端日志是否有错误？
2. Cookie 中是否有 `refreshToken`？
3. 后端刷新接口是否正确实现？

**解决方案：**
- 查看后端日志，定位具体错误
- 参考 `docs/后端刷新接口实现示例.md`

### 问题 3：购物车数据不显示

**检查点：**
1. 是否看到 `[Layout] 开始加载购物车数据` ？
2. 购物车接口是否返回 200 ？
3. 购物车中是否有数据？

**解决方案：**
- 检查 Network 标签，查看购物车接口的响应
- 尝试添加商品到购物车

## 调试技巧

### 查看请求头

1. 打开 Network 标签
2. 刷新页面
3. 找到 `/api/cart/list` 请求
4. 查看 Request Headers
5. 确认 `Authorization: Bearer eyJ...` 存在

### 查看 Cookie

1. 打开 Application 标签
2. 展开 Cookies
3. 选择当前域名
4. 确认 `refreshToken` 存在

### 清除状态重新测试

```javascript
// 在控制台执行
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

## 详细文档

- 📖 [Token 刷新竞态问题修复](./docs/Token刷新竞态问题修复.md)
- 📖 [Token 流程测试指南](./test-token-flow.md)
- 📖 [后端刷新接口实现示例](./docs/后端刷新接口实现示例.md)

## 成功标志

当你看到以下画面时，说明修复成功：

1. ✅ 刷新页面后，页面保持登录状态
2. ✅ 用户信息正常显示
3. ✅ 购物车数量正常显示
4. ✅ 控制台没有任何错误
5. ✅ 所有功能正常使用

## 下一步

如果测试通过，可以：

1. 🎯 移除部分调试日志（保留关键日志）
2. 🎯 调整 Token 过期时间
3. 🎯 优化用户体验（加载动画等）
4. 🎯 部署到生产环境

---

**祝测试顺利！** 🎉
