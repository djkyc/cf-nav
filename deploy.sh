#!/bin/bash
set -e

echo "🚀 Nav-CF Cloudflare 一键部署"

# 检查 wrangler
if ! command -v wrangler &> /dev/null; then
  echo "📦 未检测到 wrangler，正在安装..."
  npm install -g wrangler
fi

# 登录 CF
wrangler login

# 创建 KV（如果不存在）
echo "📦 创建 KV Namespace..."
wrangler kv:namespace create CARD_ORDER || true
wrangler kv:namespace create CARD_ORDER --preview || true

# 部署
echo "🚀 开始部署..."
wrangler deploy

echo "✅ 部署完成！"
