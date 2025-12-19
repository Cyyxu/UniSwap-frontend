#!/bin/bash
# ============================================
# Git 快捷脚本 - UniSwap 前端项目
# ============================================
#
# 使用方法:
#   ./git.sh                     # 查看状态
#   ./git.sh "提交信息"          # 提交并推送到当前分支
#   ./git.sh "提交信息" dev      # 提交并推送到指定分支
#   ./git.sh pull                # 拉取最新代码
#   ./git.sh log                 # 查看提交历史
#   ./git.sh proxy               # 开启 Git 代理 (端口 7897)
#   ./git.sh unproxy             # 关闭 Git 代理
#
# ============================================

# 颜色
G='\033[0;32m'  # 绿色-成功
Y='\033[1;33m'  # 黄色-警告
R='\033[0;31m'  # 红色-错误
B='\033[0;34m'  # 蓝色-信息
N='\033[0m'     # 重置

# ============================================
# 命令处理
# ============================================

# 无参数: 显示状态
if [ -z "$1" ]; then
    echo -e "${B}当前分支:${N} $(git branch --show-current)"
    echo -e "${B}Git 状态:${N}"
    git status --short
    exit 0
fi

# pull: 拉取代码
if [ "$1" = "pull" ]; then
    echo -e "${G}拉取最新代码...${N}"
    git pull origin $(git branch --show-current)
    exit 0
fi

# log: 查看历史
if [ "$1" = "log" ]; then
    git log --oneline -10
    exit 0
fi

# ============================================
# 代理配置
# ============================================

# proxy: 开启代理
if [ "$1" = "proxy" ]; then
    PORT=7897
    echo -e "${Y}正在设置 Git 全局代理 (端口: $PORT)...${N}"
    git config --global http.proxy http://127.0.0.1:$PORT
    git config --global https.proxy http://127.0.0.1:$PORT

    echo -e "${G}✅ 代理已开启!${N}"
    echo -e "${B}当前配置:${N}"
    git config --global --get http.proxy
    exit 0
fi

# unproxy: 关闭代理
if [ "$1" = "unproxy" ]; then
    echo -e "${Y}正在移除 Git 全局代理...${N}"
    git config --global --unset http.proxy
    git config --global --unset https.proxy

    echo -e "${G}✅ 代理已关闭!${N}"
    exit 0
fi

# ============================================
# 提交并推送
# ============================================

MSG="$1"                                          # 提交信息
BRANCH="${2:-$(git branch --show-current)}"       # 分支(默认当前)

echo -e "${Y}══════════════════════════════════════${N}"
echo -e "${B}提交信息:${N} $MSG"
echo -e "${B}目标分支:${N} $BRANCH"
echo -e "${Y}══════════════════════════════════════${N}"

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${Y}没有需要提交的更改${N}"
    exit 0
fi

# Step 1: 添加
echo -e "${G}[1/4] 添加更改...${N}"
git add .

# Step 2: 提交
echo -e "${G}[2/4] 提交...${N}"
git commit -m "$MSG"
[ $? -ne 0 ] && echo -e "${R}提交失败${N}" && exit 1

# Step 3: 拉取(rebase)
echo -e "${G}[3/4] 同步远程...${N}"
git pull origin $BRANCH --rebase 2>/dev/null

# Step 4: 推送
echo -e "${G}[4/4] 推送...${N}"
git push origin $BRANCH

# 结果
if [ $? -eq 0 ]; then
    echo -e "${G}══════════════════════════════════════${N}"
    echo -e "${G}✅ 推送成功!${N}"
    echo -e "${G}══════════════════════════════════════${N}"
else
    echo -e "${R}❌ 推送失败${N}"
    echo -e "${Y}提示: 如果是因为网络问题，请尝试先执行 ./git.sh proxy${N}"
    exit 1
fi
