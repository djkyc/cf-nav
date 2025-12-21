FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 只复制依赖描述文件（利用缓存）
COPY package.json package-lock.json* ./

RUN npm install --production

# 复制源码
COPY . .

# 默认端口（如有）
EXPOSE 3000

# 启动命令（按你的项目改）
CMD ["node", "worker.js"]
