
# cf-nav Docker

## Build

```bash
docker build -f docker/Dockerfile -t cf-nav .

Run
docker run -d -p 3000:3000 cf-nav


---

## 三、GitHub Actions 自动构建 & 发布镜像

### 目标
- push 到 `main`
- 自动构建 Docker
- 发布到 **GitHub Container Registry (ghcr.io)**

---

### 1️⃣ 创建文件  
`.github/workflows/docker-image.yml`

```yaml
name: Build & Publish Docker Image

on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}

使用方式（发布后）
拉取镜像
docker pull ghcr.io/djkyc/cf-nav:latest

运行
docker run -d -p 3000:3000 ghcr.io/djkyc/cf-nav:latest
