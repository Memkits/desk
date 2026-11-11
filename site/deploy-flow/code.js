// 代码卡（示意）
CODE.gha = { fn: '.github/workflows/deploy.yml（示意）', fs: 26, src: `on:
  push:
    branches: [main]          # 推到主干就触发
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4      # 拉取代码
      - run: npm ci                    # 按锁文件安装依赖
!!      - run: npm test                  # 测试不过，就到此为止
      - run: docker build -t app:\${{ github.sha }} .
!!      - run: ./deploy.sh app:\${{ github.sha }}   # 用提交号当版本`,
  note: '制品以提交号命名：线上跑的是哪一次提交，一眼就能查到' };
CODE.deploy = { fn: 'deployment.yaml（Kubernetes，节选示意）', fs: 25, src: `kind: Deployment
spec:
  replicas: 4
  strategy:
    rollingUpdate:
!!      maxSurge: 1          # 最多多开 1 个新副本
!!      maxUnavailable: 0    # 任何时候都不少于 4 个可用
  template:
    spec:
      containers:
        - image: shop/cart:1.5
          readinessProbe:      # 准备好了才接流量
            httpGet: { path: /healthz, port: 8080 }`,
  note: '你只写“想要什么”，控制器负责一步步做到' };
