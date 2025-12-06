#!/bin/bash

# 智能 AI 校园二手交易平台 - 部署脚本
# 使用方法: ./deploy.sh

echo "================================"
echo "开始构建前端项目..."
echo "================================"

# 1. 安装依赖
echo "检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

# 2. 构建项目
echo "构建生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建成功！"

# 3. 打包 dist 文件夹
echo "打包 dist 文件夹..."
cd dist
tar -czf ../dist.tar.gz *
cd ..

echo "✅ 打包完成: dist.tar.gz"

echo ""
echo "================================"
echo "部署步骤："
echo "================================"
echo "1. 将 dist.tar.gz 上传到服务器"
echo "   scp dist.tar.gz root@120.26.104.183:/tmp/"
echo ""
echo "2. 在服务器上解压到网站目录"
echo "   ssh root@120.26.104.183"
echo "   mkdir -p /www/wwwroot/cyyai-frontend"
echo "   cd /www/wwwroot/cyyai-frontend"
echo "   tar -xzf /tmp/dist.tar.gz"
echo ""
echo "3. 配置 Nginx（参考 nginx.conf 文件）"
echo ""
echo "4. 重启 Nginx"
echo "   nginx -t"
echo "   nginx -s reload"
echo ""
echo "================================"
echo "或者使用宝塔面板上传 dist 文件夹"
echo "================================"
