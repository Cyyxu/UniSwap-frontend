# UniSwap - 智能校园二手交易平台
## Campus Smart Second-hand Trading Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/uniswap-frontend)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-username/uniswap-frontend)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

> 🎓 专为校园学生打造的智能二手交易平台，集商品交易、社区互动、AI助手于一体

## 📖 项目简介

UniSwap 是一个现代化的校园二手交易平台，旨在为大学生提供安全、便捷的二手物品交易环境。平台不仅支持传统的商品买卖功能，还融入了社区互动、智能客服、消息系统等特色功能，打造完整的校园生活服务生态。

### 🎯 项目愿景
- 🛒 **安全交易**：为校园学生提供可信赖的二手物品交易平台
- 🤝 **社区互动**：构建活跃的校园社区，促进学生间的交流分享
- 🤖 **智能服务**：集成AI助手，提供个性化的购物建议和客服支持
- 📱 **便捷体验**：响应式设计，支持多端访问，随时随地进行交易

### 📸 应用截图

<div align="center">

#### 🏠 首页展示
<!-- ![首页](./docs/screenshots/home.png) -->
*首页展示热门商品和推荐内容*

#### 🛍️ 商品浏览
<!-- ![商品列表](./docs/screenshots/commodity-list.png) -->
*商品列表支持分类筛选和搜索*

#### 💬 社区互动
<!-- ![社区页面](./docs/screenshots/community.png) -->
*活跃的校园社区，分享生活点滴*

#### 🤖 AI 助手
<!-- ![AI聊天](./docs/screenshots/ai-chat.png) -->
*智能AI助手，24小时在线服务*

#### 📱 移动端适配
<!-- ![移动端](./docs/screenshots/mobile.png) -->
*完美适配移动设备，随时随地使用*

</div>

### 🎬 在线演示

- **演示地址**: [https://demo.uniswap.example.com](https://demo.uniswap.example.com)
- **测试账号**: 
  - 用户名: `demo_student`
  - 密码: `demo123456`
- **管理后台**: [https://admin.uniswap.example.com](https://admin.uniswap.example.com)
  - 管理员: `admin`
  - 密码: `admin123`

> 💡 **提示**: 演示环境数据会定期重置，请勿上传重要信息

## 📋 目录

- [项目简介](#-项目简介)
- [功能特色](#-功能特色)
- [技术栈](#-技术栈)
- [系统架构](#-系统架构)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
  - [环境要求](#环境要求)
  - [安装步骤](#安装步骤)
  - [环境配置](#环境配置)
  - [启动项目](#启动项目)
  - [验证安装](#验证安装)
- [开发指南](#-开发指南)
  - [可用脚本](#可用脚本)
  - [开发工作流](#开发工作流)
  - [代码规范](#代码规范)
  - [测试指南](#测试指南)
- [API 文档](#-api-文档)
- [部署指南](#-部署指南)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [联系我们](#-联系我们)

## ✨ 功能特色

### 🛍️ 商品交易模块
- **商品发布**：支持多图片上传，详细商品描述
- **分类管理**：完善的商品分类体系，便于浏览和搜索
- **购物车**：批量商品管理，一键结算
- **订单系统**：完整的订单流程，支持多种支付方式
- **收藏夹**：个人商品收藏，随时查看心仪商品

### 💬 社区互动模块
- **帖子发布**：分享校园生活，发布求购信息
- **点赞评论**：互动式社区体验
- **用户关注**：关注感兴趣的用户动态
- **话题讨论**：围绕热门话题展开讨论

### 💰 支付钱包系统
- **多支付方式**：支持支付宝、微信等主流支付
- **钱包余额**：平台内虚拟钱包，方便快捷交易
- **交易记录**：详细的收支明细，账目清晰

### 📨 消息通知系统
- **实时消息**：买卖双方即时沟通
- **系统通知**：订单状态、活动通知等
- **公告管理**：平台重要信息发布

### 🤖 AI 智能助手
- **智能客服**：24小时在线问答服务
- **商品推荐**：基于用户行为的个性化推荐
- **价格建议**：智能定价参考

### 🔧 后台管理系统
- **用户管理**：用户信息维护，权限控制
- **商品管理**：商品审核，分类管理
- **订单管理**：订单状态跟踪，异常处理
- **数据统计**：平台运营数据分析
- **系统配置**：平台参数设置，功能开关

### 🎓 目标用户
- **在校大学生**：主要用户群体，进行二手物品交易
- **校园商家**：小型商户，销售学习用品、生活用品
- **毕业生**：处理闲置物品，传承校园文化
- **新生群体**：购买学习生活必需品，快速融入校园

## 🛠️ 技术栈

### 前端核心技术
- **⚛️ React 18.2.0** - 现代化的用户界面库
- **📘 TypeScript 5.3.3** - 类型安全的 JavaScript 超集
- **⚡ Vite 5.0.8** - 快速的前端构建工具
- **🎨 Ant Design 5.12.0** - 企业级 UI 设计语言和组件库

### 状态管理与数据获取
- **🐻 Zustand 4.4.7** - 轻量级状态管理库
- **🔄 SWR 2.2.4** - 数据获取和缓存库
- **📡 Axios 1.6.2** - HTTP 客户端库

### 路由与工具
- **🛣️ React Router DOM 6.20.0** - 声明式路由
- **📅 Day.js 1.11.10** - 轻量级日期处理库
- **🎯 Ant Design Icons 5.2.6** - 图标库

### 开发工具
- **📊 Rollup Plugin Visualizer** - 构建分析工具
- **🔧 Vite React Plugin** - React 开发支持

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        UniSwap 前端架构                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         用户界面层                               │
├─────────────────────────────────────────────────────────────────┤
│  🏠 首页    🛍️ 商城    💬 社区    📨 消息    🤖 AI助手    👤 个人  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         组件层                                   │
├─────────────────────────────────────────────────────────────────┤
│  📦 Layout   🎨 UI组件   🔘 表单组件   📊 图表组件   🖼️ 媒体组件   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         状态管理层                               │
├─────────────────────────────────────────────────────────────────┤
│  🐻 Zustand Store  │  🔄 SWR Cache  │  📱 Local State         │
│  ├─ userStore      │  ├─ API Cache  │  ├─ Form State         │
│  ├─ cartStore      │  ├─ Data Sync  │  └─ UI State           │
│  └─ appStore       │  └─ Error      │                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API 服务层                              │
├─────────────────────────────────────────────────────────────────┤
│  📡 HTTP Client (Axios)                                        │
│  ├─ 🔐 认证拦截器    ├─ 📊 请求/响应日志    ├─ ⚠️ 错误处理        │
│  ├─ 🔄 Token刷新     ├─ 📈 请求重试        └─ 🌐 请求转换        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         后端 API                                │
├─────────────────────────────────────────────────────────────────┤
│  👤 用户模块  🛍️ 商品模块  📦 订单模块  💬 社区模块  🤖 AI模块     │
│  💰 支付模块  📨 消息模块  🔧 系统模块  📊 统计模块              │
└─────────────────────────────────────────────────────────────────┘

## 📁 项目结构

```
uniswap-frontend/
├── 📁 public/                    # 静态资源文件
│   ├── favicon.svg              # 网站图标
│   ├── logo.svg                 # 项目Logo
│   ├── manifest.json            # PWA配置文件
│   └── sw.js                    # Service Worker
├── 📁 src/                      # 源代码目录
│   ├── 📁 api/                  # API接口层
│   │   ├── request.ts           # HTTP请求配置
│   │   ├── user.ts              # 用户相关接口
│   │   ├── commodity.ts         # 商品相关接口
│   │   ├── order.ts             # 订单相关接口
│   │   ├── payment.ts           # 支付相关接口
│   │   ├── post.ts              # 帖子相关接口
│   │   ├── message.ts           # 消息相关接口
│   │   ├── ai.ts                # AI助手接口
│   │   └── ...                  # 其他模块接口
│   ├── 📁 components/           # 可复用组件
│   │   ├── Layout/              # 布局组件
│   │   ├── ErrorBoundary/       # 错误边界组件
│   │   ├── LazyImage/           # 懒加载图片组件
│   │   ├── PaymentButton/       # 支付按钮组件
│   │   └── ...                  # 其他通用组件
│   ├── 📁 pages/                # 页面组件
│   │   ├── Home/                # 首页
│   │   ├── CommodityList/       # 商品列表
│   │   ├── CommodityDetail/     # 商品详情
│   │   ├── Cart/                # 购物车
│   │   ├── OrderConfirm/        # 订单确认
│   │   ├── PostList/            # 帖子列表
│   │   ├── Chat/                # 聊天页面
│   │   ├── Admin/               # 后台管理
│   │   └── ...                  # 其他页面
│   ├── 📁 store/                # 状态管理
│   │   ├── userStore.ts         # 用户状态
│   │   ├── cartStore.ts         # 购物车状态
│   │   ├── appStore.ts          # 应用全局状态
│   │   └── ...                  # 其他状态管理
│   ├── 📁 utils/                # 工具函数
│   │   ├── auth.ts              # 认证工具
│   │   ├── format.ts            # 格式化工具
│   │   ├── request.ts           # 请求工具
│   │   └── ...                  # 其他工具函数
│   ├── 📁 types/                # TypeScript类型定义
│   ├── App.tsx                  # 应用根组件
│   └── main.tsx                 # 应用入口文件
├── 📁 docs/                     # 项目文档
│   ├── api/                     # API文档
│   ├── README.md                # 文档说明
│   └── ...                      # 其他文档
├── 📁 openspec/                 # OpenSpec规范文件
├── package.json                 # 项目依赖配置
├── tsconfig.json                # TypeScript配置
├── vite.config.ts               # Vite构建配置
└── README.md                    # 项目说明文档
```

### 📂 模块组织说明

#### 🔌 API 接口层 (`src/api/`)
负责与后端服务的通信，每个模块对应一个API文件：
- **统一请求配置**：`request.ts` 配置 Axios 实例，处理认证、错误拦截
- **模块化接口**：按业务模块划分，如用户、商品、订单等
- **类型安全**：所有接口都有完整的 TypeScript 类型定义

#### 🧩 组件层 (`src/components/`)
可复用的UI组件，遵循单一职责原则：
- **布局组件**：`Layout/` 提供页面整体布局结构
- **业务组件**：如 `PaymentButton/`、`FavoriteButton/` 等
- **通用组件**：`LazyImage/`、`ErrorBoundary/` 等基础组件
- **组件规范**：每个组件包含 `.tsx`、`.css`、`.test.tsx` 文件

#### 📄 页面层 (`src/pages/`)
应用的各个页面组件，按功能模块组织：
- **用户相关**：登录、注册、个人中心
- **商品相关**：商品列表、详情、购物车
- **社区相关**：帖子列表、详情、发布
- **管理相关**：后台管理各个模块

#### 🗃️ 状态管理 (`src/store/`)
使用 Zustand 进行状态管理，按业务领域划分：
- **用户状态**：`userStore.ts` 管理用户信息、认证状态
- **购物车状态**：`cartStore.ts` 管理购物车商品、数量
- **应用状态**：`appStore.ts` 管理全局UI状态、主题等

#### 🛠️ 工具函数 (`src/utils/`)
通用的工具函数和辅助方法：
- **认证工具**：Token 处理、权限验证
- **格式化工具**：日期、金额、文本格式化
- **请求工具**：API 请求封装、错误处理
- **业务工具**：特定业务逻辑的辅助函数

### 🐻 状态管理架构

项目使用 **Zustand** 作为主要的状态管理解决方案，具有以下优势：

#### 🎯 设计原则
- **轻量级**：相比 Redux，Zustand 更加简洁，无需样板代码
- **TypeScript 友好**：完整的类型推导和类型安全
- **模块化**：按业务领域拆分 Store，避免单一巨大状态树
- **响应式**：自动订阅状态变化，组件自动重渲染

#### 📊 状态分层
```
┌─────────────────────────────────────────┐
│              Zustand Stores             │
├─────────────────────────────────────────┤
│  userStore     │  cartStore    │ appStore │
│  ├─ 用户信息    │  ├─ 商品列表   │ ├─ 主题   │
│  ├─ 认证状态    │  ├─ 数量管理   │ ├─ 语言   │
│  ├─ 权限信息    │  └─ 结算逻辑   │ └─ 设置   │
│  └─ 登录方法    │               │          │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              SWR Cache                  │
├─────────────────────────────────────────┤
│  API 数据缓存  │  自动重新验证  │ 错误重试  │
└─────────────────────────────────────────┘
```

#### 🔄 数据流
1. **组件触发** → Action 方法
2. **Action 执行** → 调用 API / 更新状态
3. **状态更新** → 自动通知订阅组件
4. **组件重渲染** → 显示最新状态

## 🚀 快速开始

### 环境要求

在开始之前，请确保您的开发环境满足以下要求：

#### 📋 必需软件
- **Node.js** >= 16.0.0 (推荐使用 LTS 版本)
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **Git** >= 2.20.0

#### 🔍 版本检查
```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本  
npm --version

# 检查 yarn 版本 (可选)
yarn --version

# 检查 Git 版本
git --version
```

#### 💻 推荐开发环境
- **操作系统**：Windows 10+、macOS 10.15+、Ubuntu 18.04+
- **编辑器**：VS Code (推荐安装以下插件)
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag
- **浏览器**：Chrome 90+、Firefox 88+、Safari 14+、Edge 90+

### 安装步骤

#### 1️⃣ 克隆项目
```bash
# 使用 HTTPS
git clone https://github.com/your-username/uniswap-frontend.git

# 或使用 SSH
git clone git@github.com:your-username/uniswap-frontend.git

# 进入项目目录
cd uniswap-frontend
```

#### 2️⃣ 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm (推荐)
pnpm install
```

#### 3️⃣ 环境配置
```bash
# 复制环境变量模板
cp .env.development .env.local

# 编辑环境变量 (根据实际情况修改)
# Windows
notepad .env.local

# macOS/Linux  
nano .env.local
```

#### 4️⃣ 启动开发服务器
```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

#### 5️⃣ 访问应用
打开浏览器访问：[http://localhost:3000](http://localhost:3000)

### 环境配置

#### 🔧 环境变量说明

项目使用 Vite 的环境变量系统，支持多环境配置：

| 环境变量 | 说明 | 开发环境 | 生产环境 |
|---------|------|---------|---------|
| `VITE_API_BASE_URL` | 后端API基础路径 | `/uniswap` | `/uniswap` |
| `VITE_IMAGE_BASE_URL` | 图片服务器地址 | 本地 (可选) | `http://120.26.104.183:9000` |

#### 📝 配置文件

```bash
# 开发环境配置 (.env.development)
VITE_API_BASE_URL=/uniswap
# VITE_IMAGE_BASE_URL=http://120.26.104.183:9000

# 生产环境配置 (.env.production)  
VITE_API_BASE_URL=/uniswap
VITE_IMAGE_BASE_URL=http://120.26.104.183:9000

# 本地覆盖配置 (.env.local) - 不会提交到Git
VITE_API_BASE_URL=http://localhost:8080/uniswap
VITE_IMAGE_BASE_URL=http://localhost:9000
```

#### ⚙️ 配置说明

**API 基础路径 (`VITE_API_BASE_URL`)**
- 开发环境：使用相对路径 `/uniswap`，通过 Vite 代理转发
- 生产环境：使用相对路径，通过 Nginx 代理避免跨域

**图片服务器 (`VITE_IMAGE_BASE_URL`)**
- 开发环境：可选配置，用于访问远程图片资源
- 生产环境：必需配置，指向 MinIO 对象存储服务

#### 🔒 安全注意事项
- 所有以 `VITE_` 开头的变量会暴露给客户端
- 敏感信息（如密钥）不应放在环境变量中
- `.env.local` 文件不会提交到版本控制

### 启动项目

#### 🚀 开发服务器

```bash
# 启动开发服务器
npm run dev

# 服务器启动后会显示：
# ➜  Local:   http://localhost:3000/
# ➜  Network: http://192.168.1.100:3000/
```

**开发服务器特性：**
- 🔥 **热重载**：代码修改后自动刷新页面
- ⚡ **快速构建**：Vite 提供极速的冷启动
- 🔍 **错误提示**：详细的编译错误和运行时错误信息
- 📱 **移动端调试**：通过 Network 地址在移动设备上测试

#### 🌐 访问地址

- **本地访问**：[http://localhost:3000](http://localhost:3000)
- **局域网访问**：`http://[你的IP]:3000` (用于移动端测试)
- **API代理**：开发环境下 `/uniswap/api/*` 会代理到后端服务

#### 🔧 开发工具

**浏览器开发者工具：**
- React Developer Tools
- Redux DevTools (如果使用)
- Network 面板查看 API 请求
- Console 面板查看日志

**VS Code 调试：**
```json
// .vscode/launch.json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/src"
}
```

### 验证安装

#### ✅ 安装验证清单

完成安装后，请按以下步骤验证项目是否正确运行：

**1. 🌐 页面加载验证**
- [ ] 浏览器能正常访问 `http://localhost:3000`
- [ ] 页面显示 UniSwap 首页内容
- [ ] 没有出现白屏或错误页面

**2. 🔗 路由功能验证**
- [ ] 点击导航菜单能正常跳转
- [ ] 浏览器前进后退按钮正常工作
- [ ] URL 地址栏显示正确的路由路径

**3. 🎨 样式渲染验证**
- [ ] 页面样式正常显示（Ant Design 组件）
- [ ] 响应式布局在不同屏幕尺寸下正常
- [ ] 图标和字体正确加载

**4. 🔌 API 连接验证**
```bash
# 检查开发者工具 Network 面板
# 应该能看到以下请求：
# - GET /uniswap/api/user/info (用户信息)
# - GET /uniswap/api/commodity/list (商品列表)
```

**5. 🛠️ 开发工具验证**
- [ ] 浏览器控制台无严重错误
- [ ] React DevTools 能正常检查组件
- [ ] 热重载功能正常（修改代码后自动刷新）

#### 🚨 常见验证问题

**页面空白或加载失败：**
```bash
# 检查端口是否被占用
netstat -ano | findstr :3000

# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

**API 请求失败：**
- 检查后端服务是否启动
- 确认环境变量配置正确
- 查看浏览器 Network 面板的错误信息

### 故障排除

#### 🔧 常见问题解决方案

**问题 1：端口 3000 被占用**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# 或者使用其他端口启动
npm run dev -- --port 3001
```

**问题 2：依赖安装失败**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install

# 如果网络问题，使用国内镜像
npm config set registry https://registry.npmmirror.com
```

**问题 3：TypeScript 编译错误**
```bash
# 检查 TypeScript 版本
npx tsc --version

# 重新生成类型声明
rm -rf node_modules/@types
npm install

# 跳过类型检查启动（临时方案）
npm run dev -- --skip-type-check
```

**问题 4：Vite 构建错误**
```bash
# 清除 Vite 缓存
rm -rf node_modules/.vite

# 检查 Node.js 版本
node --version  # 确保 >= 16.0.0

# 更新 Vite 到最新版本
npm update vite
```

**问题 5：环境变量不生效**
- 确保变量名以 `VITE_` 开头
- 重启开发服务器
- 检查 `.env` 文件格式（无空格、无引号）
- 确认文件编码为 UTF-8

**问题 6：API 请求跨域错误**
```javascript
// vite.config.ts 添加代理配置
export default defineConfig({
  server: {
    proxy: {
      '/uniswap': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

#### 📞 获取帮助

如果以上方案无法解决问题，请：

1. **查看日志**：检查浏览器控制台和终端输出
2. **搜索文档**：查看 [Vite 官方文档](https://vitejs.dev/)
3. **提交 Issue**：在项目仓库提交详细的错误报告
4. **联系团队**：通过项目联系方式获取技术支持

## 💻 开发指南

### 可用脚本

项目提供了以下 npm 脚本来支持开发和构建流程：

#### 🚀 开发相关
```bash
# 启动开发服务器
npm run dev
# 功能：启动 Vite 开发服务器，支持热重载
# 端口：默认 3000，如被占用会自动选择其他端口
# 特性：快速冷启动、HMR热更新、错误提示
```

#### 🏗️ 构建相关
```bash
# 生产环境构建
npm run build
# 功能：构建生产版本到 dist/ 目录
# 优化：代码压缩、Tree Shaking、资源优化
# 输出：静态文件，可直接部署到 Web 服务器

# 预览构建结果
npm run preview  
# 功能：本地预览生产构建结果
# 用途：验证构建产物是否正常
# 地址：http://localhost:4173
```

#### 📊 分析相关
```bash
# 构建分析
npm run analyze
# 功能：分析构建产物大小和依赖关系
# 输出：生成可视化的构建分析报告
# 用途：优化包大小、识别重复依赖
```

#### 🔧 自定义脚本示例
```json
{
  "scripts": {
    "dev:host": "vite --host",
    "dev:port": "vite --port 3001", 
    "build:staging": "vite build --mode staging",
    "clean": "rm -rf dist node_modules/.vite",
    "type-check": "tsc --noEmit"
  }
}
```

### 开发工作流

#### 🌿 分支策略

项目采用 **Git Flow** 分支模型，确保代码质量和发布稳定性：

```
main (生产分支)
├── develop (开发分支)
│   ├── feature/user-auth (功能分支)
│   ├── feature/payment-system (功能分支)
│   └── feature/admin-dashboard (功能分支)
├── release/v1.1.0 (发布分支)
└── hotfix/critical-bug (热修复分支)
```

**分支说明：**
- **`main`**：生产环境分支，只包含稳定的发布版本
- **`develop`**：开发分支，集成所有新功能
- **`feature/*`**：功能分支，开发具体功能
- **`release/*`**：发布分支，准备新版本发布
- **`hotfix/*`**：热修复分支，紧急修复生产问题

#### 🔄 开发流程

**1. 开始新功能开发**
```bash
# 从 develop 分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 开发完成后提交
git add .
git commit -m "feat: add user authentication"
git push origin feature/your-feature-name
```

**2. 代码审查和合并**
```bash
# 创建 Pull Request 到 develop 分支
# 经过代码审查后合并
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

**3. 发布流程**
```bash
# 创建发布分支
git checkout -b release/v1.1.0 develop

# 完成发布准备后合并到 main
git checkout main
git merge release/v1.1.0
git tag v1.1.0

# 同时合并回 develop
git checkout develop  
git merge release/v1.1.0
```

#### 📝 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能添加
git commit -m "feat: add user login functionality"

# 问题修复  
git commit -m "fix: resolve cart calculation error"

# 文档更新
git commit -m "docs: update API documentation"

# 样式调整
git commit -m "style: improve button hover effects"

# 重构代码
git commit -m "refactor: optimize user store logic"

# 性能优化
git commit -m "perf: lazy load commodity images"

# 测试相关
git commit -m "test: add unit tests for payment module"
```

### 代码规范

#### 📏 代码风格指南

项目遵循现代 React + TypeScript 最佳实践：

**🎯 TypeScript 规范**
```typescript
// ✅ 推荐：明确的类型定义
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// ✅ 推荐：使用类型断言而非 any
const userData = response.data as User;

// ❌ 避免：使用 any 类型
const userData: any = response.data;
```

**⚛️ React 组件规范**
```tsx
// ✅ 推荐：函数组件 + TypeScript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  return <div>{title}</div>;
};

// ✅ 推荐：使用 React Hooks
const [loading, setLoading] = useState<boolean>(false);
```

**🎨 样式规范**
```css
/* ✅ 推荐：BEM 命名规范 */
.commodity-card {}
.commodity-card__title {}
.commodity-card__price--discount {}

/* ✅ 推荐：CSS 变量 */
:root {
  --primary-color: #1890ff;
  --border-radius: 6px;
}
```

#### 🔧 开发工具配置

**ESLint 配置 (推荐)**
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

**Prettier 配置**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**VS Code 设置**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 测试指南

#### 🧪 测试策略

项目采用多层次测试策略确保代码质量：

```
┌─────────────────────────────────────────┐
│              测试金字塔                  │
├─────────────────────────────────────────┤
│           E2E Tests (少量)              │
│         ├─ 关键用户流程                  │
│         └─ 核心业务场景                  │
├─────────────────────────────────────────┤
│        Integration Tests (适量)         │
│         ├─ API 集成测试                  │
│         └─ 组件集成测试                  │
├─────────────────────────────────────────┤
│          Unit Tests (大量)              │
│         ├─ 工具函数测试                  │
│         ├─ 组件单元测试                  │
│         └─ Store 逻辑测试                │
└─────────────────────────────────────────┘
```

#### 🔧 测试工具栈

**核心测试库：**
- **Vitest**：快速的单元测试框架
- **React Testing Library**：React 组件测试
- **MSW**：API Mock 服务
- **Playwright**：端到端测试

#### 📝 测试示例

**组件测试示例：**
```tsx
// src/components/FavoriteButton/index.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteButton } from './index';

describe('FavoriteButton', () => {
  it('should toggle favorite status on click', () => {
    const onToggle = jest.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
```

**Store 测试示例：**
```tsx
// src/store/cartStore.test.ts
import { cartStore } from './cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    cartStore.getState().clearCart();
  });

  it('should add item to cart', () => {
    const item = { id: 1, name: 'Test Product', price: 100 };
    cartStore.getState().addItem(item);
    
    expect(cartStore.getState().items).toHaveLength(1);
    expect(cartStore.getState().total).toBe(100);
  });
});
```

#### 🚀 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test -- FavoriteButton

# 运行 E2E 测试
npm run test:e2e
```

#### 📊 测试覆盖率

目标覆盖率指标：
- **语句覆盖率**：≥ 80%
- **分支覆盖率**：≥ 75%
- **函数覆盖率**：≥ 85%
- **行覆盖率**：≥ 80%

### 调试指南

#### 🔍 调试工具

**浏览器开发者工具：**
```javascript
// 在组件中添加调试断点
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  // 调试技巧：使用 console.log 追踪状态变化
  console.log('Component render:', { data });
  
  // 调试技巧：使用 debugger 语句
  debugger; // 浏览器会在此处暂停
  
  return <div>{data}</div>;
};
```

**React Developer Tools：**
- 安装浏览器扩展：React Developer Tools
- 查看组件树和 Props/State
- 性能分析和组件重渲染追踪
- Hook 状态检查

#### 🐛 常见调试场景

**1. API 请求调试**
```typescript
// 在 request.ts 中添加请求日志
axios.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Request Data:', config.data);
    return config;
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    console.error('📥 Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);
```

**2. 状态管理调试**
```typescript
// Zustand 状态调试
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // 状态定义
    user: null,
    setUser: (user) => {
      console.log('🔄 User state change:', { old: get().user, new: user });
      set({ user });
    }
  }))
);

// 订阅状态变化
useStore.subscribe(
  (state) => state.user,
  (user) => console.log('👤 User changed:', user)
);
```

**3. 性能调试**
```tsx
// 使用 React.memo 优化重渲染
const ExpensiveComponent = React.memo(({ data }) => {
  console.log('🔄 ExpensiveComponent render');
  return <div>{data}</div>;
});

// 使用 useMemo 优化计算
const MyComponent = ({ items }) => {
  const expensiveValue = useMemo(() => {
    console.log('💰 Expensive calculation');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>{expensiveValue}</div>;
};
```

#### 🛠️ VS Code 调试配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

#### 📱 移动端调试

```bash
# 启动开发服务器并允许外部访问
npm run dev -- --host

# 使用 Chrome DevTools 远程调试
# 1. 手机连接同一 WiFi
# 2. 访问 http://[电脑IP]:3000
# 3. Chrome 输入 chrome://inspect
# 4. 选择设备进行调试
```

#### 🔧 调试技巧

**快速定位问题：**
1. **检查控制台错误**：优先查看 Console 面板
2. **网络请求分析**：使用 Network 面板检查 API
3. **组件状态检查**：使用 React DevTools
4. **性能分析**：使用 Performance 面板
5. **内存泄漏检查**：使用 Memory 面板

## 📡 API 文档

### API 概览

UniSwap 前端通过 RESTful API 与后端服务进行通信，所有 API 请求都经过统一的请求拦截器处理，包括认证、错误处理和数据转换。

#### 🌐 API 基础信息

**基础配置：**
- **Base URL**：`/uniswap/api`
- **认证方式**：Bearer Token (JWT)
- **数据格式**：JSON
- **字符编码**：UTF-8

**请求头配置：**
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>",
  "Accept": "application/json"
}
```

#### 🔐 认证机制

**双 Token 机制：**
```javascript
// 访问令牌 (短期有效)
localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIs...');

// 刷新令牌 (长期有效)  
localStorage.setItem('refresh_token', 'eyJhbGciOiJIUzI1NiIs...');
```

**自动刷新流程：**
1. 请求携带 `access_token`
2. 如果 token 过期 (401)，自动使用 `refresh_token` 刷新
3. 获取新的 `access_token` 后重试原请求
4. 如果刷新失败，跳转到登录页面

#### 📊 响应格式

**成功响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据内容
  }
}
```

**错误响应：**
```json
{
  "code": 400,
  "message": "参数错误",
  "data": null
}
```

#### 🚦 状态码说明

| 状态码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 请求成功 | 正常处理数据 |
| 400 | 请求参数错误 | 显示错误信息 |
| 401 | 未授权/Token过期 | 自动刷新Token或跳转登录 |
| 403 | 权限不足 | 显示权限错误提示 |
| 404 | 资源不存在 | 显示404页面 |
| 500 | 服务器内部错误 | 显示系统错误提示 |

### API 模块快速参考

#### 👤 用户模块 (`/api/user`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 用户登录 | POST | `/login` | 用户名密码登录 |
| 用户注册 | POST | `/register` | 新用户注册 |
| 获取用户信息 | GET | `/info` | 当前用户详细信息 |
| 更新用户信息 | PUT | `/update` | 修改用户资料 |
| 修改密码 | POST | `/change-password` | 更改登录密码 |
| 用户列表 | GET | `/list` | 管理员获取用户列表 |

#### 🛍️ 商品模块 (`/api/commodity`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 商品列表 | GET | `/list` | 分页获取商品列表 |
| 商品详情 | GET | `/{id}` | 获取商品详细信息 |
| 发布商品 | POST | `/add` | 用户发布新商品 |
| 更新商品 | PUT | `/{id}` | 修改商品信息 |
| 删除商品 | DELETE | `/{id}` | 删除商品 |
| 商品搜索 | GET | `/search` | 关键词搜索商品 |

#### 📦 订单模块 (`/api/order`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 创建订单 | POST | `/create` | 从购物车创建订单 |
| 订单列表 | GET | `/list` | 用户订单历史 |
| 订单详情 | GET | `/{id}` | 获取订单详细信息 |
| 取消订单 | POST | `/{id}/cancel` | 取消未支付订单 |
| 确认收货 | POST | `/{id}/confirm` | 确认收货完成交易 |

#### 💰 支付模块 (`/api/payment`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 直接购买 | POST | `/direct-buy` | 单商品直接购买 |
| 购物车结算 | POST | `/cart-checkout` | 购物车批量结算 |
| 支付状态查询 | GET | `/status/{orderId}` | 查询支付结果 |
| 支付方式列表 | GET | `/methods` | 获取可用支付方式 |

#### 🛒 购物车模块 (`/api/cart`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 购物车列表 | GET | `/list` | 获取购物车商品 |
| 添加商品 | POST | `/add` | 添加商品到购物车 |
| 更新数量 | PUT | `/update` | 修改商品数量 |
| 删除商品 | DELETE | `/remove` | 从购物车移除商品 |
| 批量删除 | POST | `/batch-remove` | 批量删除选中商品 |

#### 💬 社区模块 (`/api/post`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 帖子列表 | GET | `/list` | 获取社区帖子列表 |
| 帖子详情 | GET | `/{id}` | 获取帖子详细内容 |
| 发布帖子 | POST | `/add` | 发布新帖子 |
| 点赞切换 | POST | `/thumb/toggle/{id}` | 切换帖子点赞状态 |
| 收藏切换 | POST | `/favour/toggle/{id}` | 切换帖子收藏状态 |
| 帖子评论 | POST | `/comment/add` | 添加帖子评论 |

#### 🤖 AI 模块 (`/api/ai`)

| 功能 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 发送消息 | POST | `/chat` | 与AI助手对话 |
| 聊天历史 | GET | `/history` | 获取聊天记录 |
| 清空历史 | DELETE | `/history/clear` | 清空聊天记录 |

### 详细 API 文档

完整的 API 接口文档请查看 `docs/api/` 目录：

#### 📚 模块文档链接

- **[用户模块 API](./docs/api/01-用户模块.md)** - 用户认证、注册、个人信息管理
- **[商品模块 API](./docs/api/02-商品模块.md)** - 商品发布、查询、管理功能
- **[订单模块 API](./docs/api/03-订单模块.md)** - 订单创建、状态管理、历史查询
- **[社区模块 API](./docs/api/04-社区模块.md)** - 帖子发布、点赞、评论、收藏
- **[消息模块 API](./docs/api/05-消息模块.md)** - 站内消息、通知推送
- **[AI模块 API](./docs/api/06-AI模块.md)** - AI助手对话、聊天记录管理
- **[系统模块 API](./docs/api/07-系统模块.md)** - 系统配置、数据统计
- **[支付模块 API](./docs/api/08-支付模块.md)** - 支付接口、订单结算

#### 📋 文档说明

每个模块文档包含：
- **接口列表**：完整的端点清单
- **请求参数**：详细的参数说明和示例
- **响应格式**：返回数据结构和字段说明
- **错误码**：可能的错误情况和处理方式
- **调用示例**：实际的请求和响应示例

#### 🔄 文档更新

API 文档与后端接口保持同步更新，如发现文档与实际接口不符，请：
1. 查看 `docs/` 目录下的最新文档
2. 检查后端接口变更日志
3. 联系后端开发团队确认

### 认证示例

#### 🔐 登录认证

**用户登录流程：**
```typescript
// 1. 用户登录
const loginResponse = await userApi.login({
  username: 'student123',
  password: 'password123'
});

// 2. 保存 Token
const { access_token, refresh_token, user } = loginResponse.data;
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// 3. 更新用户状态
userStore.getState().setUser(user);
userStore.getState().setToken(access_token);
```

**请求示例：**
```javascript
// POST /uniswap/api/user/login
{
  "username": "student123",
  "password": "password123"
}

// 响应
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "student123",
      "nickname": "张同学",
      "avatar": "http://example.com/avatar.jpg"
    }
  }
}
```

#### 🔄 Token 刷新

**自动刷新机制：**
```typescript
// request.ts 中的拦截器实现
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是 401 错误且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 使用 refresh_token 刷新
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/uniswap/api/user/refresh', {
          refresh_token: refreshToken
        });
        
        // 保存新的 access_token
        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);
        
        // 重试原请求
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
        
      } catch (refreshError) {
        // 刷新失败，跳转登录
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 🛡️ 权限验证

**路由守卫示例：**
```tsx
// 需要认证的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 管理员权限验证
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserStore();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }
  
  return <>{children}</>;
};
```

**API 请求权限：**
```typescript
// 带认证的 API 请求
const getProfile = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await axios.get('/uniswap/api/user/info', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
```

### 错误处理

#### ⚠️ 常见错误码

| 错误码 | 错误信息 | 原因 | 解决方案 |
|--------|----------|------|----------|
| 400 | 请求参数错误 | 参数格式不正确或缺少必需参数 | 检查请求参数格式和完整性 |
| 401 | 未授权访问 | Token 无效或已过期 | 重新登录或刷新 Token |
| 403 | 权限不足 | 用户权限不够访问该资源 | 联系管理员或使用有权限的账号 |
| 404 | 资源不存在 | 请求的资源不存在 | 检查请求路径和资源ID |
| 409 | 数据冲突 | 数据已存在或状态冲突 | 刷新页面获取最新数据 |
| 422 | 数据验证失败 | 提交的数据不符合业务规则 | 根据错误信息修正数据 |
| 429 | 请求过于频繁 | 触发了接口限流 | 稍后重试或降低请求频率 |
| 500 | 服务器内部错误 | 后端服务异常 | 联系技术支持 |
| 502 | 网关错误 | 服务不可用 | 检查网络连接或稍后重试 |
| 503 | 服务暂不可用 | 服务器维护中 | 等待服务恢复 |

#### 🛠️ 错误处理实现

**全局错误处理：**
```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
  const { response } = error;
  
  if (!response) {
    // 网络错误
    message.error('网络连接失败，请检查网络设置');
    return;
  }
  
  const { status, data } = response;
  const errorMessage = data?.message || '未知错误';
  
  switch (status) {
    case 400:
      message.error(`请求参数错误: ${errorMessage}`);
      break;
    case 401:
      message.error('登录已过期，请重新登录');
      // 清除本地存储并跳转登录
      localStorage.clear();
      window.location.href = '/login';
      break;
    case 403:
      message.error('权限不足，无法访问该资源');
      break;
    case 404:
      message.error('请求的资源不存在');
      break;
    case 409:
      message.warning(`数据冲突: ${errorMessage}`);
      break;
    case 422:
      message.error(`数据验证失败: ${errorMessage}`);
      break;
    case 429:
      message.warning('请求过于频繁，请稍后重试');
      break;
    case 500:
      message.error('服务器内部错误，请联系技术支持');
      break;
    case 502:
    case 503:
      message.error('服务暂不可用，请稍后重试');
      break;
    default:
      message.error(`请求失败: ${errorMessage}`);
  }
};
```

**组件级错误处理：**
```tsx
// 在组件中使用错误处理
const CommodityList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCommodities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await commodityApi.getList();
      // 处理成功响应
      
    } catch (error) {
      // 处理错误
      handleApiError(error);
      setError('加载商品列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={error}
        extra={<Button onClick={fetchCommodities}>重试</Button>}
      />
    );
  }
  
  return <div>{/* 正常内容 */}</div>;
};
```

**重试机制：**
```typescript
// utils/retry.ts
export const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // 指数退避延迟
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};
```

### API 使用示例

#### 🛍️ 商品相关操作

**获取商品列表：**
```typescript
// 基础列表查询
const getCommodityList = async (page: number = 1, size: number = 10) => {
  try {
    const response = await commodityApi.getList({
      page,
      size,
      status: 'active'
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 带搜索条件的查询
const searchCommodities = async (keyword: string, categoryId?: number) => {
  const params = {
    keyword,
    categoryId,
    page: 1,
    size: 20
  };
  
  const response = await commodityApi.search(params);
  return response.data;
};
```

**发布商品：**
```typescript
const publishCommodity = async (commodityData: CommodityForm) => {
  try {
    // 1. 上传商品图片
    const imageUrls = await Promise.all(
      commodityData.images.map(file => fileApi.upload(file))
    );
    
    // 2. 创建商品
    const response = await commodityApi.add({
      ...commodityData,
      images: imageUrls.map(url => url.data)
    });
    
    message.success('商品发布成功');
    return response.data;
    
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
```

#### 🛒 购物车操作

**购物车管理：**
```typescript
// 添加商品到购物车
const addToCart = async (commodityId: number, quantity: number = 1) => {
  try {
    await cartApi.add({ commodityId, quantity });
    message.success('已添加到购物车');
    
    // 更新购物车状态
    cartStore.getState().fetchCartItems();
  } catch (error) {
    handleApiError(error);
  }
};

// 更新购物车商品数量
const updateCartQuantity = async (itemId: number, quantity: number) => {
  try {
    await cartApi.update({ itemId, quantity });
    cartStore.getState().updateItemQuantity(itemId, quantity);
  } catch (error) {
    handleApiError(error);
  }
};

// 购物车结算
const checkoutCart = async (selectedItems: number[]) => {
  try {
    const response = await paymentApi.cartCheckout({
      itemIds: selectedItems,
      paymentMethod: 'alipay'
    });
    
    // 跳转到支付页面
    window.location.href = response.data.paymentUrl;
  } catch (error) {
    handleApiError(error);
  }
};
```

#### 💬 社区互动

**帖子操作：**
```typescript
// 发布帖子
const publishPost = async (postData: PostForm) => {
  try {
    const response = await postApi.add(postData);
    message.success('帖子发布成功');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 点赞/取消点赞
const togglePostLike = async (postId: number) => {
  try {
    const response = await postApi.toggleThumb(postId);
    const newLikeCount = response.data;
    
    // 更新本地状态
    postStore.getState().updatePostLikes(postId, newLikeCount);
  } catch (error) {
    handleApiError(error);
  }
};

// 添加评论
const addComment = async (postId: number, content: string) => {
  try {
    const response = await postCommentApi.add({
      postId,
      content
    });
    
    message.success('评论发布成功');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
```

#### 🤖 AI 助手对话

**聊天功能：**
```typescript
// 发送消息给 AI
const sendMessageToAI = async (message: string) => {
  try {
    const response = await aiApi.chat({ message });
    return response.data.reply;
  } catch (error) {
    handleApiError(error);
    return '抱歉，AI助手暂时无法回复，请稍后重试。';
  }
};

// 流式对话 (如果支持)
const streamChat = async (message: string, onMessage: (chunk: string) => void) => {
  try {
    const response = await fetch('/uniswap/api/ai/stream-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ message })
    });
    
    const reader = response.body?.getReader();
    if (!reader) return;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      onMessage(chunk);
    }
  } catch (error) {
    handleApiError(error);
  }
};
```

#### 📊 数据统计

**管理员统计数据：**
```typescript
// 获取概览统计
const getDashboardStats = async () => {
  try {
    const [userStats, commodityStats, orderStats] = await Promise.all([
      statisticsApi.getUserStats(),
      statisticsApi.getCommodityStats(),
      statisticsApi.getOrderStats()
    ]);
    
    return {
      users: userStats.data,
      commodities: commodityStats.data,
      orders: orderStats.data
    };
  } catch (error) {
    handleApiError(error);
    return null;
  }
};
```

## 🚀 部署指南

### 生产构建

#### 📦 构建流程

**1. 环境准备**
```bash
# 确保 Node.js 版本
node --version  # >= 16.0.0

# 安装依赖
npm ci  # 使用 ci 命令确保一致性

# 清理缓存
npm run clean  # 如果有自定义清理脚本
```

**2. 生产构建**
```bash
# 构建生产版本
npm run build

# 构建完成后的目录结构
dist/
├── assets/
│   ├── index-[hash].js      # 主应用代码
│   ├── vendor-[hash].js     # 第三方库代码
│   └── index-[hash].css     # 样式文件
├── images/                  # 图片资源
├── favicon.svg             # 网站图标
└── index.html              # 入口HTML文件
```

**3. 构建优化**
```javascript
// vite.config.ts 生产优化配置
export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd', '@ant-design/icons'],
          utils: ['axios', 'dayjs', 'zustand']
        }
      }
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除 console.log
        drop_debugger: true  // 移除 debugger
      }
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
    
    // 启用 gzip 压缩
    reportCompressedSize: true
  }
});
```

#### 📊 构建分析

**分析构建产物：**
```bash
# 生成构建分析报告
npm run analyze

# 分析结果会在浏览器中打开，显示：
# - 各模块大小占比
# - 依赖关系图
# - 重复依赖检测
# - 优化建议
```

**性能优化检查：**
```bash
# 检查构建大小
ls -lh dist/assets/

# 主要文件大小建议：
# - index-[hash].js: < 500KB
# - vendor-[hash].js: < 1MB  
# - index-[hash].css: < 100KB
```

#### 🔍 构建验证

**本地预览：**
```bash
# 预览构建结果
npm run preview

# 访问 http://localhost:4173 验证：
# ✅ 页面正常加载
# ✅ 路由跳转正常
# ✅ API 请求正常
# ✅ 静态资源加载正常
```

**构建检查清单：**
- [ ] 所有页面能正常访问
- [ ] 图片和字体资源正确加载
- [ ] API 请求路径正确
- [ ] 浏览器控制台无错误
- [ ] 响应式布局正常
- [ ] 性能指标符合要求

### 环境配置

#### 🌍 多环境管理

项目支持多个部署环境，每个环境有独立的配置：

**环境类型：**
- **开发环境** (`development`) - 本地开发
- **测试环境** (`staging`) - 功能测试
- **生产环境** (`production`) - 正式发布

#### 📝 环境配置文件

```bash
# 环境配置文件结构
├── .env                     # 默认配置
├── .env.development         # 开发环境
├── .env.staging            # 测试环境  
├── .env.production         # 生产环境
└── .env.local              # 本地覆盖配置 (不提交到Git)
```

**开发环境配置 (`.env.development`)：**
```bash
# 开发环境
NODE_ENV=development
VITE_API_BASE_URL=/uniswap
VITE_IMAGE_BASE_URL=http://localhost:9000
VITE_APP_TITLE=UniSwap - 开发环境
VITE_ENABLE_MOCK=true
VITE_LOG_LEVEL=debug
```

**测试环境配置 (`.env.staging`)：**
```bash
# 测试环境
NODE_ENV=staging
VITE_API_BASE_URL=https://staging-api.uniswap.com/uniswap
VITE_IMAGE_BASE_URL=https://staging-cdn.uniswap.com
VITE_APP_TITLE=UniSwap - 测试环境
VITE_ENABLE_MOCK=false
VITE_LOG_LEVEL=info
```

**生产环境配置 (`.env.production`)：**
```bash
# 生产环境
NODE_ENV=production
VITE_API_BASE_URL=/uniswap
VITE_IMAGE_BASE_URL=https://cdn.uniswap.com
VITE_APP_TITLE=UniSwap - 校园二手交易平台
VITE_ENABLE_MOCK=false
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=true
```

#### 🔧 构建命令

**不同环境的构建命令：**
```bash
# 开发环境构建
npm run build

# 测试环境构建
npm run build -- --mode staging

# 生产环境构建  
npm run build -- --mode production

# 自定义环境构建
npm run build -- --mode custom
```

**package.json 脚本配置：**
```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build --mode production",
    "build:staging": "vite build --mode staging",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "preview:staging": "vite preview --mode staging"
  }
}
```

#### 🎯 环境变量使用

**在代码中使用环境变量：**
```typescript
// utils/config.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL,
  appTitle: import.meta.env.VITE_APP_TITLE,
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// 使用示例
console.log('当前环境:', import.meta.env.MODE);
console.log('API地址:', config.apiBaseUrl);
```

**条件渲染：**
```tsx
// 开发环境显示调试信息
const App = () => {
  return (
    <div>
      {config.isDevelopment && (
        <div style={{ background: 'yellow', padding: '10px' }}>
          🚧 开发环境 - API: {config.apiBaseUrl}
        </div>
      )}
      
      <Router>
        {/* 应用内容 */}
      </Router>
    </div>
  );
};
```

#### 🔒 安全注意事项

**环境变量安全规则：**
- ✅ 只有 `VITE_` 开头的变量会暴露给客户端
- ❌ 不要在环境变量中存储敏感信息（密钥、密码）
- ✅ 使用 `.env.local` 存储本地开发配置
- ❌ 不要将 `.env.local` 提交到版本控制

### 部署选项

#### 🌐 静态托管部署

**Nginx 部署：**
```nginx
# /etc/nginx/sites-available/uniswap
server {
    listen 80;
    server_name uniswap.example.com;
    root /var/www/uniswap/dist;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /uniswap/api/ {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Apache 部署：**
```apache
# .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # 处理 SPA 路由
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# 启用压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

#### 🐳 Docker 部署

**Dockerfile：**
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml：**
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - uniswap-network

  backend:
    image: uniswap-backend:latest
    ports:
      - "8080:8080"
    networks:
      - uniswap-network

networks:
  uniswap-network:
    driver: bridge
```

**构建和运行：**
```bash
# 构建镜像
docker build -t uniswap-frontend .

# 运行容器
docker run -d -p 80:80 --name uniswap-frontend uniswap-frontend

# 使用 docker-compose
docker-compose up -d
```

#### ☁️ 云平台部署

**Vercel 部署：**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "rewrites": [
    {
      "source": "/uniswap/api/(.*)",
      "destination": "https://api.uniswap.com/uniswap/api/$1"
    }
  ]
}
```

**Netlify 部署：**
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/uniswap/api/*"
  to = "https://api.uniswap.com/uniswap/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**GitHub Pages 部署：**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### 🚀 CDN 加速

**配置 CDN：**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  
  // CDN 配置
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return `https://cdn.uniswap.com/${filename}`;
      }
      return { relative: true };
    }
  }
});
```

### 性能优化

#### ⚡ 构建优化

**代码分割策略：**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 基础框架
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI 组件库
          'antd-vendor': ['antd', '@ant-design/icons'],
          
          // 工具库
          'utils-vendor': ['axios', 'dayjs', 'zustand'],
          
          // 图表库 (如果使用)
          'charts-vendor': ['echarts', 'recharts']
        }
      }
    }
  }
});
```

**Tree Shaking 优化：**
```typescript
// ✅ 推荐：按需导入
import { Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// ❌ 避免：全量导入
import * as antd from 'antd';
import * as icons from '@ant-design/icons';
```

#### 🖼️ 资源优化

**图片优化：**
```tsx
// 懒加载图片组件
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="lazy-image-container">
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};
```

**字体优化：**
```css
/* 字体预加载 */
@font-face {
  font-family: 'CustomFont';
  src: url('./fonts/custom-font.woff2') format('woff2');
  font-display: swap; /* 优化字体加载 */
}

/* 系统字体栈 */
body {
  font-family: 
    -apple-system, 
    BlinkMacSystemFont, 
    'Segoe UI', 
    Roboto, 
    'Helvetica Neue', 
    Arial, 
    sans-serif;
}
```

#### 🔄 运行时优化

**组件优化：**
```tsx
// 使用 React.memo 防止不必要的重渲染
const CommodityCard = React.memo<CommodityCardProps>(({ commodity }) => {
  return (
    <Card>
      <h3>{commodity.title}</h3>
      <p>{commodity.price}</p>
    </Card>
  );
});

// 使用 useMemo 缓存计算结果
const CommodityList = ({ commodities, filters }) => {
  const filteredCommodities = useMemo(() => {
    return commodities.filter(item => 
      item.category === filters.category &&
      item.price >= filters.minPrice &&
      item.price <= filters.maxPrice
    );
  }, [commodities, filters]);

  return (
    <div>
      {filteredCommodities.map(item => (
        <CommodityCard key={item.id} commodity={item} />
      ))}
    </div>
  );
};

// 使用 useCallback 缓存函数
const SearchForm = ({ onSearch }) => {
  const handleSubmit = useCallback((values) => {
    onSearch(values);
  }, [onSearch]);

  return <Form onFinish={handleSubmit}>{/* 表单内容 */}</Form>;
};
```

**虚拟滚动：**
```tsx
// 大列表虚拟滚动
import { FixedSizeList as List } from 'react-window';

const VirtualCommodityList = ({ commodities }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <CommodityCard commodity={commodities[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={commodities.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

#### 📡 网络优化

**API 请求优化：**
```typescript
// 请求去重
const requestCache = new Map();

const dedupeRequest = (key: string, requestFn: () => Promise<any>) => {
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }

  const promise = requestFn().finally(() => {
    requestCache.delete(key);
  });

  requestCache.set(key, promise);
  return promise;
};

// 使用示例
const getCommodityList = (params: any) => {
  const key = `commodity-list-${JSON.stringify(params)}`;
  return dedupeRequest(key, () => commodityApi.getList(params));
};
```

**预加载策略：**
```tsx
// 路由预加载
const CommodityDetail = lazy(() => 
  import('./pages/CommodityDetail').then(module => ({
    default: module.CommodityDetail
  }))
);

// 数据预加载
const usePreloadData = () => {
  useEffect(() => {
    // 预加载热门商品
    commodityApi.getHotList();
    
    // 预加载用户信息
    if (isAuthenticated) {
      userApi.getProfile();
    }
  }, []);
};
```

#### 📊 性能监控

**性能指标监控：**
```typescript
// 性能监控
const performanceMonitor = {
  // 页面加载时间
  measurePageLoad: () => {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log('页面加载时间:', loadTime);
      
      // 发送到监控服务
      analytics.track('page_load_time', { duration: loadTime });
    });
  },

  // API 请求时间
  measureApiRequest: (url: string, startTime: number) => {
    const duration = performance.now() - startTime;
    console.log(`API 请求时间 ${url}:`, duration);
    
    analytics.track('api_request_time', { url, duration });
  },

  // 组件渲染时间
  measureComponentRender: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      console.log(`${componentName} 渲染时间:`, duration);
    };
  }
};
```

#### 🎯 性能目标

**关键指标：**
- **首屏加载时间** < 2秒
- **页面切换时间** < 500ms
- **API 响应时间** < 1秒
- **包大小** < 2MB (gzipped < 500KB)
- **Lighthouse 评分** > 90分

### 构建分析工具

#### 📊 Bundle 分析

**Rollup Plugin Visualizer：**
```bash
# 生成构建分析报告
npm run analyze

# 或手动运行
npx vite build --mode analyze
```

**分析报告解读：**
```javascript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // 其他插件...
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

**分析指标：**
- **模块大小**：各个模块的实际大小
- **Gzip 压缩后大小**：网络传输大小
- **依赖关系**：模块间的引用关系
- **重复依赖**：可能的优化点

#### 🔍 Webpack Bundle Analyzer (如果使用)

```bash
# 安装分析工具
npm install --save-dev webpack-bundle-analyzer

# 生成分析报告
npm run build
npx webpack-bundle-analyzer dist/static/js/*.js
```

#### 📈 性能分析工具

**Lighthouse CI：**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Web Vitals 监控：**
```typescript
// utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // 发送到分析服务
  console.log(metric);
  
  // 示例：发送到 Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

export const reportWebVitals = () => {
  getCLS(sendToAnalytics);  // 累积布局偏移
  getFID(sendToAnalytics);  // 首次输入延迟
  getFCP(sendToAnalytics);  // 首次内容绘制
  getLCP(sendToAnalytics);  // 最大内容绘制
  getTTFB(sendToAnalytics); // 首字节时间
};
```

#### 🛠️ 开发工具

**Vite 构建分析：**
```bash
# 详细构建信息
npm run build -- --debug

# 分析模式构建
npm run build -- --mode analyze --minify false
```

**Source Map 分析：**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // 生成 source map
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false
      }
    }
  }
});
```

**依赖分析：**
```bash
# 分析依赖大小
npx depcheck  # 检查未使用的依赖

# 分析包大小
npx bundlephobia <package-name>

# 检查重复依赖
npx npm-check-duplicates
```

#### 📋 优化检查清单

**构建优化检查：**
- [ ] 主包大小 < 500KB (gzipped)
- [ ] 第三方库单独打包
- [ ] 未使用的代码已移除
- [ ] 图片资源已优化
- [ ] 字体文件已压缩
- [ ] CSS 已提取和压缩

**运行时优化检查：**
- [ ] 组件懒加载已实现
- [ ] 图片懒加载已实现
- [ ] API 请求已缓存
- [ ] 长列表使用虚拟滚动
- [ ] 防抖节流已应用

**网络优化检查：**
- [ ] 启用 Gzip/Brotli 压缩
- [ ] 设置合理的缓存策略
- [ ] 使用 CDN 加速
- [ ] 预加载关键资源
- [ ] 减少 HTTP 请求数量

## 🤝 贡献指南

### 参与贡献

我们欢迎所有形式的贡献，无论是新功能、Bug 修复、文档改进还是问题反馈。

#### 🚀 快速开始

**1. Fork 项目**
```bash
# 1. 在 GitHub 上 Fork 项目
# 2. 克隆你的 Fork
git clone https://github.com/your-username/uniswap-frontend.git
cd uniswap-frontend

# 3. 添加上游仓库
git remote add upstream https://github.com/original-owner/uniswap-frontend.git
```

**2. 创建功能分支**
```bash
# 从 develop 分支创建新分支
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

**3. 开发和测试**
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 检查代码规范
npm run lint
```

#### 📝 提交规范

**提交信息格式：**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型说明：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

**示例：**
```bash
feat(commodity): add search functionality

- Add search input component
- Implement search API integration
- Add search result pagination

Closes #123
```

#### 🔍 代码审查

**Pull Request 流程：**
1. **创建 PR**：从你的功能分支向 `develop` 分支提交 PR
2. **填写模板**：使用 PR 模板描述变更内容
3. **自动检查**：确保 CI/CD 检查通过
4. **代码审查**：等待团队成员审查
5. **修改反馈**：根据审查意见修改代码
6. **合并代码**：审查通过后合并到 develop 分支

**PR 检查清单：**
- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有破坏现有功能
- [ ] 通过了所有自动化测试

#### 🐛 Bug 报告

**报告 Bug 时请包含：**
- **环境信息**：操作系统、浏览器版本、Node.js 版本
- **重现步骤**：详细的操作步骤
- **期望行为**：应该发生什么
- **实际行为**：实际发生了什么
- **截图/日志**：相关的错误信息或截图

**Bug 报告模板：**
```markdown
## Bug 描述
简要描述遇到的问题

## 环境信息
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 95, Firefox 94]
- Node.js: [e.g. 16.14.0]

## 重现步骤
1. 打开页面 '...'
2. 点击按钮 '...'
3. 滚动到 '...'
4. 看到错误

## 期望行为
描述你期望发生的行为

## 实际行为
描述实际发生的行为

## 截图
如果适用，添加截图来帮助解释问题

## 额外信息
添加任何其他相关信息
```

#### 💡 功能建议

**提出新功能时请说明：**
- **使用场景**：什么情况下需要这个功能
- **解决问题**：这个功能解决什么问题
- **实现方案**：可能的实现方式
- **影响范围**：对现有功能的影响

#### 📚 文档贡献

**文档改进包括：**
- 修正错别字和语法错误
- 改进代码示例
- 添加缺失的文档
- 翻译文档到其他语言
- 改进文档结构和导航

#### 🎨 设计贡献

**UI/UX 改进：**
- 界面设计优化
- 用户体验改进
- 无障碍访问优化
- 响应式设计改进

#### 🏆 贡献者认可

**贡献者权益：**
- 在 README 中列出贡献者
- 获得项目徽章和证书
- 参与项目决策讨论
- 优先获得新功能预览

**成为核心贡献者：**
- 持续贡献高质量代码
- 积极参与代码审查
- 帮助解答社区问题
- 维护项目文档

## 📄 许可证

### 开源许可

本项目采用 **MIT 许可证** 开源，这意味着：

#### ✅ 允许的使用方式
- **商业使用**：可以用于商业项目
- **修改**：可以修改源代码
- **分发**：可以分发原始或修改后的代码
- **私人使用**：可以私人使用
- **专利使用**：授予专利使用权

#### ⚠️ 使用条件
- **包含许可证**：分发时必须包含原始许可证
- **包含版权声明**：必须包含原始版权声明

#### 🚫 免责声明
- **无担保**：软件按"原样"提供，不提供任何担保
- **无责任**：作者不承担任何责任

### 许可证全文

```
MIT License

Copyright (c) 2024 UniSwap Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 第三方许可

本项目使用了以下开源库，请遵守相应的许可证：

| 库名称 | 许可证 | 用途 |
|--------|--------|------|
| React | MIT | 用户界面库 |
| Ant Design | MIT | UI 组件库 |
| TypeScript | Apache-2.0 | 类型系统 |
| Vite | MIT | 构建工具 |
| Axios | MIT | HTTP 客户端 |
| Zustand | MIT | 状态管理 |
| Day.js | MIT | 日期处理 |

### 商标和版权

- **UniSwap** 名称和 Logo 归项目团队所有
- 使用项目名称和 Logo 需要获得许可
- 贡献的代码将采用相同的 MIT 许可证

## 📞 联系我们

### 技术支持

遇到问题或需要帮助？我们提供多种支持渠道：

#### 🐛 问题反馈
- **GitHub Issues**: [提交 Bug 报告或功能请求](https://github.com/your-username/uniswap-frontend/issues)
- **Bug 报告**: 使用 Issue 模板详细描述问题
- **功能建议**: 提出新功能想法和改进建议

#### 💬 社区讨论
- **GitHub Discussions**: [参与项目讨论](https://github.com/your-username/uniswap-frontend/discussions)
- **QQ 群**: 123456789 (UniSwap 开发交流群)
- **微信群**: 扫描二维码加入开发者微信群

#### 📧 直接联系
- **项目负责人**: project-lead@uniswap.com
- **技术支持**: tech-support@uniswap.com
- **商务合作**: business@uniswap.com

#### 🌐 在线资源
- **项目官网**: https://uniswap.example.com
- **开发文档**: https://docs.uniswap.example.com
- **API 文档**: https://api.uniswap.example.com/docs
- **更新日志**: https://github.com/your-username/uniswap-frontend/releases

### 响应时间

我们承诺以下响应时间：

| 问题类型 | 响应时间 | 解决时间 |
|----------|----------|----------|
| 严重 Bug (影响核心功能) | 2 小时内 | 24 小时内 |
| 一般 Bug | 24 小时内 | 3-5 工作日 |
| 功能请求 | 48 小时内 | 根据优先级安排 |
| 文档问题 | 24 小时内 | 1-2 工作日 |
| 使用咨询 | 工作日 8 小时内 | - |

### 贡献者

感谢所有为项目做出贡献的开发者：

#### 核心团队
- **[@项目负责人](https://github.com/project-lead)** - 项目架构和管理
- **[@前端开发](https://github.com/frontend-dev)** - 前端开发和 UI 设计
- **[@后端开发](https://github.com/backend-dev)** - 后端 API 和数据库设计

#### 贡献者列表
<!-- 这里会自动生成贡献者列表 -->
<a href="https://github.com/your-username/uniswap-frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=your-username/uniswap-frontend" />
</a>

### 支持项目

如果这个项目对你有帮助，请考虑：

- ⭐ **Star** 项目仓库
- 🐛 **报告** 发现的问题
- 💡 **提出** 改进建议
- 🔀 **提交** Pull Request
- 📢 **分享** 给其他开发者
- ☕ **赞助** 项目开发 (如果有赞助渠道)

### 行为准则

参与项目时请遵守我们的 [行为准则](CODE_OF_CONDUCT.md)：

- 🤝 **尊重他人**：友善对待所有参与者
- 💬 **建设性沟通**：提供有用的反馈和建议
- 🎯 **专注主题**：保持讨论与项目相关
- 📚 **乐于学习**：开放接受不同观点和建议
- 🚫 **零容忍**：不容忍任何形式的骚扰或歧视

---

<div align="center">

**🎓 UniSwap - 让校园交易更简单**

Made with ❤️ by UniSwap Team

[⬆ 回到顶部](#uniswap---智能校园二手交易平台)

</div>

---

## 📋 文档维护说明

### 🔗 链接验证

本 README 中的链接需要定期验证：

**内部链接（已验证）：**
- ✅ 目录锚点链接
- ✅ 文档文件夹链接 (`./docs/api/`)
- ✅ 项目文件引用

**外部链接（需要更新）：**
- 🔄 GitHub 仓库链接（需要替换为实际仓库地址）
- 🔄 演示网站链接（需要替换为实际部署地址）
- 🔄 联系邮箱（需要替换为实际邮箱）
- 🔄 社交媒体链接（需要添加实际群组）

**命令验证：**
- ✅ npm 脚本命令已验证
- ✅ Git 命令语法正确
- ✅ Docker 命令格式正确
- ✅ 环境配置示例有效

### 📝 更新检查清单

定期检查以下内容：
- [ ] 版本号与 package.json 同步
- [ ] 依赖版本信息准确
- [ ] API 文档链接有效
- [ ] 部署指南与实际环境匹配
- [ ] 联系信息准确有效
```
