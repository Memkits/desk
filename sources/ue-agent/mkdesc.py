import json, os
TL = json.load(open('tl_e1.json')); d = TL['total']; fn = 'AI智能体进驻虚幻引擎_2026年11月新闻解读'
o = [f'''# AI 智能体进驻虚幻引擎（新闻解读，{int(d//60)}:{int(d%60):02d}）

**标题候选**

1. 一周做出一个引擎版本？AI 智能体进驻虚幻引擎
2. 虚幻引擎 5.9 预览版“主要由智能体构建”：能做什么、卡在哪里
3. 去掉蓝图、押注 AI：虚幻引擎 6 与游戏开发的未来

**文件**：`{fn}.mp4`　字幕：`{fn}.srt`　封面：`封面_16x9.png` / `封面_4x3.png` / `封面_3x4.png`

**简介**

2026 年 11 月 9 日，Epic 发布虚幻引擎 5.9 预览版，称它是“第一个主要用智能体工作流构建的虚幻引擎版本”，从决定动手到发布约一周。本期解读：5.9 预览版做了什么、付出了什么代价；智能体如何通过 MCP 接入编辑器（5.7 AI 助手 → 5.8 实验 MCP 插件 → 5.9 扩展工具集与编辑器内智能体面板）；一次公开实测里的两成两败、等待时间与额度消耗；三个瓶颈（蓝图是二进制看不见、每次会话从零摸索、多步修改没有事务和读回验证）以及本机服务器的安全问题；11 月 3 日东京大会宣布虚幻引擎 6 去掉蓝图、Actor 和 C++ 玩法框架、改用 Verse 与场景图；Unity 的同类动向；对游戏行业的可能影响与行业里的反对声音。

本片由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。新闻均来自公开报道并已联网核对（截至 2026-11-10）；画面为程序绘制的示意图，其中工具调用代码、时间分配比例、“模型见过多少”柱状图为示意；Sweeney 的效率数字来自经翻译的报道，原话以官方为准。

**章节**

''']
for s in TL['scenes']:
    t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '开场'}\n")
o.append('''
**标签**：虚幻引擎　Unreal Engine　UE5.9　UE6　AI 智能体　MCP　Claude Code　游戏开发　Verse　蓝图　科技新闻　AI 生成

## 参考资料

- Epic 开发者论坛：Unreal Engine 5.9 MegaJam Preview（2026-11-09）
- Inven Global：Epic says Unreal Engine 5.9 Preview was built mostly by AI agents（2026-11-09）
- Inven Global：Epic Games will remove Blueprints and Actors from Unreal Engine 6（2026-11）；GameBusiness.jp（2026-11-05）；Kotaku（2026-11-05）
- AICoder：Epic Confirms Unreal Engine 5.9（2026-11-03）
- Puget Systems：Unreal Engine MCP Hands-On: Testing AI Inside the Editor（2026-07-09）
- Engadget：Epic Games details how it's embracing gen AI in Unreal Engine（2026-06-17）
- Ludus AI：Claude Code for Unreal Engine: What It Can and Can't See（2026-09-13）
- StraySpark：Epic's Official MCP Plugin Is Here (UE 5.8)（厂商文章，2026-06/08）
- DEV Community：Epic AI MegaJam 2026: rules, prizes and Unreal MCP setup（2026-11-08）
- Unity AI 公测（2026-05-04）相关报道
- GDC 2026 State of the Game Industry（2026-01）
''')
os.makedirs('final', exist_ok=True); open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
