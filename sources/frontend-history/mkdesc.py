import json
EP = {1: ('上集', '从文档到应用', '前端三十年_上集_从文档到应用',
          '按问题梳理前端的起点（1990–2010）：WWW 与早期浏览器（WorldWideWeb、Mosaic、Netscape）；JavaScript 的诞生与第一次浏览器大战；CSS 与布局的演进（表格、float、Flexbox、Grid）；IE6 时代的兼容性地狱与 jQuery 等库；Ajax 与 JSON；Flash 等插件与 HTML5；V8 引擎与 Node.js；以及 VRML、ES4、Gears、Chrome Frame、Web SQL 等“昙花一现”的方案。',
          ['前端三十年（上）：从文档到应用', '从 Mosaic 到 V8：前端最初二十年解决了哪些问题', '兼容性地狱、Ajax 与 Flash：按问题回顾早期前端']),
      2: ('中集', '框架与工程化', '前端三十年_中集_框架与工程化',
          '2010–2020 年前端如何应对规模：模块化（CommonJS、AMD、SeaJS、webpack、ES Modules）；第一代 MV* 框架（Backbone、Knockout、AngularJS）；React、Vue 与组件化及状态管理；语言补课（CoffeeScript、ES2015、TypeScript）；CSS 规模化的五批方案与组件库；响应式、跨端与小程序；工程化工具；以及 Bower、Grunt、AngularJS、Polymer、CRA、Recoil 等被淘汰的方案。',
          ['前端三十年（中）：框架与工程化', '从 jQuery 到 React：前端框架十年的问题与答案', 'webpack、TypeScript、Tailwind：前端工程化是怎么来的']),
      3: ('下集', '钟摆、新平台与 AI', '前端三十年_下集_钟摆新平台与AI',
          '最近十年：渲染位置的钟摆（SSR、水合、Jamstack、岛屿架构、服务端组件、htmx）；编译器与 Signals（Svelte、Solid、React Compiler）；Go 与 Rust 重写的工具链与 Vite 8；WebAssembly、WebGPU 等平台能力；AI 浪潮：AI 写前端、AI 界面与浏览器内置 AI、AI 代理与 WebMCP、新的问题；最后的“昙花一现”与三十年的规律。',
          ['前端三十年（下）：渲染钟摆、新平台与 AI 浪潮', 'SSR、Signals、Vite 与 AI：最近十年的前端变化', 'AI 时代的前端：从写界面到写给代理看'])}
o = ['# 前端三十年：按问题梳理的技术史（三集）\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画，网页截图来自原始页面，版权归各自所有。年份为各项目公开记录的约数；浏览器份额曲线、代码量、启动耗时等图示为示意；AI 部分的趋势判断不作定论。\n\n标签：前端　Web　JavaScript　React　Vue　CSS　前端工程化　技术史　AI 编程　AI 生成\n']
for ep, (k, nm, fn, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- CERN：The birth of the Web；info.cern.ch
- State of JavaScript 2025（InfoQ 报道，2026-03）
- Vite 8 发布公告（2026-03-12）；React Compiler v1.0（2025-10-07）
- WebGPU 浏览器支持（Chrome 113、Firefox 141、Safari 26）
- Chrome 内置 AI API 文档；WebMCP 提案报道（Google I/O 2026）
- Temporal 进入 Chrome 144 的报道（InfoQ，2026-02）
- styled-components 维护模式公告（2025-03）
- 各框架与工具的官方博客与发布记录

## 截图来源（原始页面，版权归各自所有）

- info.cern.ch
- todomvc.com
- vite.dev/blog/announcing-vite8
''')
open('标题与描述.md', 'w').write(''.join(o)); print('ok')
