# UniSwap - 智能校园二手交易平台

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Ant%20Design-5.12.0-0170FE?logo=antdesign" alt="Ant Design">
  <img src="https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite" alt="Vite">
</p>

## 📖 项目简介

UniSwap 是一个面向大学生的智能校园二手交易平台，采用仿闲鱼风格的现代化 UI 设计。平台支持商品发布、浏览、收藏、私信聊天、AI 智能助手等功能，致力于为校园用户提供便捷、安全的二手交易体验。

## ✨ 核心功能

- **🏠 闲鱼风格首页** - Bento Grid 布局，卡片化设计，渐变色彩
- **🛍️ 商品管理** - 发布、浏览、搜索、收藏商品
- **💬 即时通讯** - 买卖双方实时私信聊天
- **🤖 AI 智能助手** - 智能推荐、问答交互
- **👤 用户中心** - 个人信息、我的发布、我的收藏
- **🔧 管理后台** - 用户管理、商品审核、数据统计
- **🔒 安全认证** - 内存存储 Token + 静默刷新，防 XSS 攻击

## 🖼️ 页面预览

### 首页布局
- **顶部导航栏** - Logo、搜索框、用户菜单
- **左侧分类栏** - 10大商品分类，emoji图标
- **核心推荐区** - Bento Grid 不规则拼图布局
- **商品瀑布流** - 自适应网格展示
- **悬浮快捷入口** - 收藏、AI助手、社区、全部商品

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| React 18 | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Ant Design 5 | UI 组件库 |
| React Router 6 | 路由管理 |
| Zustand | 状态管理 |
| Axios | HTTP 请求 |
| CSS Grid | 布局技术 |

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📁 项目结构

```
UniSwap-frontend/
├── public/              # 静态资源
├── src/
│   ├── api/             # API 接口
│   │   ├── ai.ts        # AI 接口
│   │   ├── favorites.ts # 收藏接口
│   │   ├── message.ts   # 消息接口
│   │   └── request.ts   # Axios 封装
│   ├── components/      # 公共组件
│   │   ├── Layout/      # 页面布局
│   │   ├── AdminLayout/ # 后台布局
│   │   └── FloatingDock/# 悬浮导航
│   ├── pages/           # 页面组件
│   │   ├── Home/        # 首页
│   │   ├── CommodityList/   # 商品列表
│   │   ├── CommodityDetail/ # 商品详情
│   │   ├── ChatRoom/    # 私信聊天
│   │   ├── AIChat/      # AI 助手
│   │   └── Admin/       # 管理后台
│   ├── store/           # 状态管理
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 根组件
│   └── main.tsx         # 入口文件
├── .env.development     # 开发环境配置
├── .env.production      # 生产环境配置
├── vite.config.ts       # Vite 配置
└── package.json
```

## 🔗 路由说明

| 路由 | 说明 |
|------|------|
| `/` | 首页 |
| `/commodity` | 商品列表 |
| `/commodity/:id` | 商品详情 |
| `/post` | 社区帖子 |
| `/chat` | 私信列表 |
| `/chat/:id` | 聊天室 |
| `/ai-chat` | AI 助手 |
| `/user` | 用户中心 |
| `/favorites` | 我的收藏 |
| `/admin/*` | 管理后台 |

## 🎨 设计特点

1. **Bento Grid 布局** - 不规则网格，打破传统
2. **渐变色彩** - 现代感十足的配色方案
3. **玻璃态效果** - backdrop-filter 模糊背景
4. **流畅动画** - CSS transform 实现丝滑交互
5. **响应式设计** - 完美适配桌面端、平板、手机

## 🔧 环境配置

开发环境 `.env.development`:
```
VITE_API_BASE_URL=/uniswap
```

生产环境 `.env.production`:
```
VITE_API_BASE_URL=/uniswap
```

## 🔒 安全认证机制

本项目采用业界最佳实践的认证方案，实现了高安全性和良好的用户体验：

### 核心特性
- ✅ **内存存储 Token** - Access Token 存储在 JS 内存变量中，防止 XSS 攻击窃取
- ✅ **HttpOnly Cookie** - Refresh Token 存储在 HttpOnly Cookie 中，JS 无法读取
- ✅ **静默刷新** - Token 过期时自动刷新，用户无感知
- ✅ **请求队列** - 并发请求时只刷新一次，优化性能
- ✅ **刷新页面保持登录** - 应用初始化时自动恢复登录态

### 工作原理
1. **登录**：后端返回 Access Token（短期），设置 Refresh Token 到 Cookie（长期）
2. **请求**：前端从内存获取 Token，自动添加到请求头
3. **刷新**：收到 401 时自动调用刷新接口，更新内存中的 Token
4. **初始化**：页面加载时尝试刷新，恢复登录态

### 详细文档
- 📖 [Token 安全改造说明](docs/Token安全改造说明.md)
- 🔧 [后端刷新接口实现示例](docs/后端刷新接口实现示例.md)
- 🧪 [测试验证指南](docs/测试验证指南.md)
- ✅ [迁移检查清单](docs/迁移检查清单.md)
- 🚀 [快速开始](docs/快速开始.md)

## 📝 后端项目

后端采用 Spring Boot + MyBatis-Plus 开发，仓库地址：
- [UniSwap-backend](https://github.com/Cyyxu/UniSwap-backend)

## 📄 License

MIT License

---

**开发团队**: Cyyxu  
**技术支持**: React + TypeScript + Ant Design
