import json
EP = {1: ('上集', '数据怎么进来', 'Langfuse_v4_上集_数据怎么进来',
          '从 SDK 到 ClickHouse 的上报链路：OpenTelemetry 协议与 span 结构、入口的三道检查（内容类型、512 MiB 体积上限、编号校验）和摄入版本头、整批写入对象存储且队列只传地址、Worker 的转换与补全（提示词、模型价格、token、成本、元数据展平）、直写与双写的判定顺序，以及客户端和服务端对接的六种情况：新版 SDK、过渡版 SDK、旧 OTel SDK、旧 REST 批量接口、第三方埋点、企业采集器。',
          ['Langfuse v4（上）：一次 LLM 调用怎么走进 ClickHouse', '对接 Langfuse v4 的六种情况：哪些直写、哪些会延迟、哪些会被拒', 'Langfuse 数据链路拆解：OTLP → S3 → Redis → Worker → ClickHouse']),
      2: ('中集', '格式转换与大体积数据', 'Langfuse_v4_中集_格式转换与大体积数据',
          'events_full 宽表的排序键、分区和引擎；trace 属性下沉到每一行；元数据为什么是两个平行数组以及对接数仓时怎么还原；events_core 截断表与按列自动路由；从 OTel span 到导出文件的七层格式转换；大体积数据的七道关口（客户端批大小、入口上限、媒体上传、字段溢出、写入兜底、截断表、导出字段组）；双写暂存表的节奏与 SQL；导出的目录、清单、去重、字段组和单位差异。',
          ['Langfuse v4（中）：七层格式转换和七道体积关口', 'Langfuse 的 events_full 表长什么样：元数据、截断表与查询路由', '大段文本和图片在 Langfuse 里怎么存：字段溢出、媒体抽取与截断']),
      3: ('下集', '改造原理与企业脱敏', 'Langfuse_v4_下集_改造原理与企业脱敏',
          '第三版为什么越来越慢（可变更新、读时去重、几十亿行关联、规模增长）；第四版的不可变与反范式；官方在 ClickHouse 上碰到的工程问题；三种写入模式、启动即报错的配置组合和历史回填链；企业脱敏的三个位置（SDK mask、OTel 采集器、服务端回调），回调的契约、超时、失败策略与边界（只管 OTel、原始事件桶未脱敏）；一套三层脱敏方案和改造风险清单。',
          ['Langfuse v4（下）：从 v3 到 v4 的改造原理与企业脱敏方案', 'Langfuse 脱敏的三个位置：客户端、采集器、服务端回调', '为什么 Langfuse v4 要把 trace 拆进每一行：不可变与反范式'])}
o = ['# Langfuse v4 数据链路（三集）\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画。片中的代码路径、默认值、表结构和请求格式都对照过 Langfuse 主干源码（langfuse/langfuse @6918181，2026-11-05；langfuse-python 5.2.0）；规模、耗时类数字除注明来源外为示意。与官方文档不一致的几处以代码为准，片中和参考网页里都有说明。\n\n配套参考网页：desk 项目 `site/langfuse-v4/report.html`（格式转换表、六种对接、大体积关口、脱敏回调契约、环境变量与代码位置）。\n\n标签：Langfuse　LLM 可观测性　OpenTelemetry　ClickHouse　数据管道　脱敏　自部署　AI 生成\n']
for ep, (k, nm, fn, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_9x16.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('\n## 参考资料\n\n- Langfuse, *Langfuse v4: Faster at Scale*（2026-08-17 changelog）\n- Langfuse, *Migrate Langfuse v3 to v4 (self-hosted)*\n- Langfuse, *Migrate custom ingestion to Langfuse v4*\n- Langfuse, *Export to blob storage*\n- Langfuse, *Simplifying Langfuse for Scale*（2026-03-10 博客）\n- 源码：github.com/langfuse/langfuse、github.com/langfuse/langfuse-python\n')
open('标题与描述.md', 'w').write(''.join(o)); print('ok')
