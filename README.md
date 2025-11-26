# 智能 AI 校园二手交易平台 - 前端

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design 5
- React Router 6
- Axios
- Zustand (状态管理)

## 功能特性

### 用户功能
- ✅ 用户注册/登录
- ✅ 个人中心
- ✅ 用户信息管理

### 商品功能
- ✅ 商品列表浏览
- ✅ 商品详情查看
- ✅ 商品搜索和筛选
- ✅ 商品购买
- ✅ 商品管理（发布/编辑/删除）
- ✅ 商品收藏

### 订单功能
- ✅ 订单列表
- ✅ 订单详情
- ✅ 订单状态查看

### 社区功能
- ✅ 帖子列表
- ✅ 帖子详情
- ✅ 发布帖子
- ✅ 帖子点赞/收藏
- ✅ 帖子搜索

### AI 功能
- ✅ AI 智能对话
- ✅ 商品推荐咨询

### 其他功能
- ✅ 公告通知
- ✅ 私信功能
- ✅ 收藏管理

## 安装和运行

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端将在 http://localhost:3000 启动

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

```
frontend/
├── src/
│   ├── api/              # API 接口定义
│   ├── components/       # 公共组件
│   ├── pages/           # 页面组件
│   ├── store/           # 状态管理
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 后端 API 配置

后端服务地址：`http://localhost:8109/api`

在 `vite.config.ts` 中已配置代理，开发环境下会自动转发到后端。

## 注意事项

1. 确保后端服务已启动（端口 8109）
2. 首次使用需要先注册账号
3. 部分功能需要登录后才能使用
4. JWT Token 会自动存储在 localStorage 中

## 开发说明

- 使用 TypeScript 进行类型检查
- 使用 Ant Design 组件库构建 UI
- 使用 Zustand 进行状态管理
- API 请求统一通过 `src/api/request.ts` 处理
- 路由配置在 `src/App.tsx` 中

