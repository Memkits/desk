import json, os
NM = {1: '从一台服务器到流水线', 2: '几百个服务一起跑', 3: '不能出错的日子', 4: '发出去就收不回来'}
EP = {1: ('第一集', '初创公司篇：部署和发布的区别；DORA 四个指标；手工 FTP 上传与“在我电脑上是好的”；部署脚本与原子切换；测试金字塔、代码审查与主干开发；第一条 CI/CD 流水线（附 GitHub Actions 示意配置）；容器镜像与托管平台、PR 预览环境；可重复构建；开发/预发布/生产环境、十二要素配置、密钥管理与基础设施即代码；数据库迁移的“先扩后收”；回滚、不可变部署、蓝绿部署与向前修复；昙花一现：Capistrano、Puppet/Chef、Heroku 免费套餐、Travis CI。',
          ['软件部署流程（一）：从一台服务器到流水线', '初创公司怎么上线：CI/CD、环境、数据库迁移与回滚', '部署和发布不是一回事：小团队的部署入门']),
      2: ('第二集', '中大型公司篇：“七成故障来自变更”；单体与微服务、发布列车、大仓与多仓；Kubernetes 滚动更新与健康检查（附 Deployment 示意配置）；服务网格流量切分；GitOps 与 Argo CD / Flux；金丝雀发布与自动分析；功能开关；软件供应链攻击（SolarWinds 2020、xz 后门 2024）与签名、SBOM、SLSA；错误预算、可观测性、值班与无责复盘；平台工程与封网；案例：CrowdStrike 2024-07-19、Cloudflare 2025-11-18；昙花一现：Mesos、Swarm、Fleet、Weaveworks。',
          ['软件部署流程（二）：几百个服务一起跑', 'Kubernetes、GitOps 与金丝雀：大厂怎样安全地频繁上线', '从 CrowdStrike 蓝屏看配置推送：规模化部署的教训']),
      3: ('第三集', '电商、金融、游戏篇：大促封网、紧急变更、作战室与解封；全链路压测（阿里 2013）、影子表与弹性扩容；预案、限流、降级、单元化与混沌工程；金融的职责分离、变更评审、维护窗口、自动留痕、两地三中心（TSB 2018 迁移事故）、收盘后部署与总开关；案例：Knight Capital 2012 年 45 分钟亏损约 4.4 亿美元；游戏停服维护、多版本客户端、热更新、测试服、主机认证、开新服与全球同服；昙花一现：Hystrix、JSPatch。',
          ['软件部署流程（三）：不能出错的日子', '双 11 封网、银行变更窗口与游戏停服维护', '45 分钟亏 4.4 亿：高风险行业的部署规矩']),
      4: ('第四集', '移动端、SaaS、设备与跨国篇：应用商店审核、多版本共存、两周一班的发布列车；苹果 7 天分阶段发布（1/2/5/10/20/50/100%）、测试渠道与崩溃率；最低版本与强制更新；服务端驱动 UI、审核指南 2.5.2、小程序更新机制；SaaS 多租户、分环发布、按租户迁移与三种数据模型；设备 OTA 与 A/B 分区；多区域逐批发布、单元化架构与数据驻留；AI 浪潮：DORA 2024 发现与 AI 智能体的护栏、模型与提示词的发布；角色与技能；昙花一现：CodePush、Terraform 与 OpenTofu。',
          ['软件部署流程（四）：发出去就收不回来', '分阶段发布、多租户与多区域：收不回来的部署怎么做', 'App、SaaS、汽车 OTA 与 AI 时代的部署']) }
o = ['# 软件部署流程（四集专题）\n\n面向互联网从业者和计算机专业学生的科普专题：按公司规模和行业场景，讲软件是怎样从代码变成线上服务的——初创公司、中大型公司、电商大促、金融合规、游戏发服、移动应用、SaaS 多租户、设备固件和跨国多区域，以及 AI 浪潮带来的变化。每章按“遇到什么问题 → 怎么解决 → 带来什么新问题”展开，厂商、版本和数字放在画面上的金色细节卡里。\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画；代码卡为简化示意，图中的流量曲线、版本占比、日历、时长等为示意数字。案例与年份已联网核对（截至 2026 年 11 月），以原始资料为准；旁白中不点名公司，名称见画面细节卡。\n\n标签：软件部署　DevOps　CI/CD　Kubernetes　GitOps　灰度发布　金丝雀发布　SRE　运维　互联网　科普　AI 生成\n']
for ep, (k, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']; fn = f'软件部署流程_第{ep}集_{NM[ep]}'
    o.append(f'\n## {k} · {NM[ep]}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　字幕：`{fn}.srt`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- N. Forsgren, J. Humble, G. Kim, *Accelerate*（2018）；Google Cloud / DORA, *2024 Accelerate State of DevOps Report*
- B. Beyer 等，*Site Reliability Engineering: How Google Runs Production Systems*（O'Reilly, 2016）
- A. Wiggins, The Twelve-Factor App（12factor.net, 2011）；M. Fowler, BlueGreenDeployment（2010）
- Kubernetes 文档：Deployments、Liveness/Readiness Probes；Argo CD、Flux（CNCF）
- CrowdStrike, Channel File 291 Root Cause Analysis（2024-08）；Cloudflare 2025-11-18 事故说明
- SEC, In the Matter of Knight Capital Americas LLC（2013-10）
- CVE-2024-3094（xz-utils）；Sigstore、SLSA、SPDX / CycloneDX
- 阿里巴巴全链路压测与异地多活相关技术文章（阿里云开发者社区）
- FCA / PRA 对 TSB Bank 的处罚决定（2022-12）
- Apple App Store Connect 帮助：Release a version update in phases；App Store 审核指南 2.5.2
- Microsoft, Visual Studio App Center Retirement（2025-03-31）；Azure, Advancing safe deployment practices
- AWS Well-Architected, Reducing the Scope of Impact with Cell-Based Architecture
- Apache Attic: Apache Mesos（2025）
''')
os.makedirs('final', exist_ok=True); open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
