import json
EP = {1: ('上集', '新旧版本有什么不同', 'GoJSON_v2_上集_新旧对比',
          'Go 1.27 把 encoding/json 的引擎换成了 v2，并新增 encoding/json/v2 与 encoding/json/jsontext。本集讲 v1 的问题；jsontext 语法层与 json/v2 语义层的两层架构和真正的流式处理；MarshalJSONTo / UnmarshalJSONFrom；新的函数、选项与结构体标签；默认行为的六处变化（UTF-8、重复键、nil、大小写、omitempty、time.Duration）及哪些会静默出错；迁移方法与 nojsonv2 退路；官方说法、Lemire 实测、#81315 回归与 Go 1.28 修复；社区与第三方库的反应。',
          ['Go JSON v2 来了（上）：新旧版本到底改了什么', 'Go 1.27 的 encoding/json：两层架构、六处行为变化与迁移', 'Go 的新 JSON 库是快还是慢？官方说法与独立实测']),
      2: ('下集', '跨语言横评', 'GoJSON_v2_下集_跨语言横评',
          '把 Go 的 JSON v2 放到更大的范围比较：Go 第三方库（json-iterator、easyjson、go-json、segmentio、sonic）及 jsonbench 的正确性测试；Rust 的 serde_json、simd-json、sonic-rs 与 facet；C/C++ 的 simdjson（两阶段与按需解析）、yyjson、glaze；Java 的 JEP 540；快的四种技术；同一结构在 Go 与 Rust 中的写法；公开基准数字与多维度比较；选择建议。',
          ['Go JSON v2 来了（下）：和 Rust、C++ 的 JSON 库比一比', 'JSON 库为什么快：SIMD、编译期生成、按需解析与流式', '从 serde 到 simdjson：近些年优秀的 JSON 方案横评'])}
o = ['# Go JSON 迎来 v2：新旧对比与跨语言横评（两集）\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画，网页截图来自原始页面，版权归各自所有。性能数字均引用公开发布的测试（画面上注明来源与硬件），未自行测量；不同语言、硬件和口径的数字不能直接比较。雷达图评分为主观评估，部分图示为示意。\n\n标签：Go　Golang　JSON　encoding/json　json/v2　Rust　serde　simdjson　性能　AI 生成\n']
for ep, (k, nm, fn, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- Go 官方博客：A new Go API for JSON（2026-11-04），go.dev/blog/jsonv2
- encoding/json/v2 迁移指南：go.dev/doc/jsonv2-migration；pkg.go.dev/encoding/json/v2
- golang/go issues：#63397、#71497、#71845、#71631、#22967、#81315、#81380、#79788
- kubernetes/kube-openapi#315
- Daniel Lemire：The new Go JSON API: twice as fast, or 1.5x slower?（2026-08-29）
- frank chu：7 Go jsonv2 breaks I verified in Go 1.27（DEV，2026-11-05）
- reqfleet 的 encoding/json/v2 实测（Apple M2）
- Hacker News 讨论 #50369106
- bytedance/sonic v1.15.3 发布说明；projectdiscovery/nuclei#7720
- go-json-experiment/jsonbench
- serde-rs/json-benchmark；simd-json；cloudwego/sonic-rs
- fasterthanlime：2025 Recap（facet）
- simdjson（Langdale & Lemire, VLDB Journal 2019）；ibireme/yyjson README；stephenberry/glaze
- InfoQ：JEP 540 Simple JSON API（2026-08）

## 截图来源（原始页面，版权归各自所有）

- go.dev/blog/jsonv2
- lemire.me/blog（2026-08-29 文章中的图表）
- github.com/golang/go/issues/81315
''')
open('标题与描述.md', 'w').write(''.join(o)); print('ok')
