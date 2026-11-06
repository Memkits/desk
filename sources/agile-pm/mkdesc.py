import json
EP = {1: ('上集', '方法论的现状', '敏捷项目管理_上集_方法论的现状',
          '早期历史一分钟带过，重点讲近几年：第 18 期敏捷现状报告里的混合方法与 AI 使用；Scrum（2020 指南与 2025 扩展包里的 AI 角色）；看板与流动指标（累积流图、周期时间百分位）；Shape Up 的胃口、下注与山形图；OKR、现在/接下来/以后路线图和持续探索；SAFe、LeSS、Spotify 模型与团队拓扑；故事点、不估算与蒙特卡洛预测；DORA 五项指标与开发者体验；最后一张方法对比表。',
          ['敏捷团队怎么管项目（上）：Scrum、看板、Shape Up 的现状与对比', '2026 年的敏捷方法：混合、流动指标与概率预测', '从 Scrum 到 Shape Up：互联网团队的项目管理方法论']),
      2: ('中集', '工具', '敏捷项目管理_中集_工具',
          '工具的几代演变与共同的数据模型；Jira（JQL、Data Center 停售时间表）、Linear（周期、项目、倡议、分诊）、GitHub Issues 与 Projects（2025 年的子任务和 Issue 类型）、Asana 与 Notion 等工作管理工具；国内工具与选型考量；近几年的趋势（向云端集中、开源自部署、洗牌、AI 按用量计费）；任务和代码的打通；怎么选。',
          ['敏捷团队怎么管项目（中）：Jira、Linear、GitHub 与国内工具对比', '项目管理工具怎么选：数据模型、趋势与集成', '从白板到 Issue 系统：任务管理工具的演变']),
      3: ('下集', 'AI 时代', '敏捷项目管理_下集_AI时代',
          '2025–2026 年工作项开始分配给 AI 代理（Linear、Jira、GitHub Copilot、Notion、Asana、飞书项目）；把任务交给代理的流程；一个用上代理的团队的一周；AI 做项目管理本身的工作；任务系统变成上下文中心；方法论的变化（瓶颈移到审查、就绪的定义、规格先行、DORA 2025 的“镜子与放大器”）；角色的变化；风险与护栏；三个时代的对比与总结。',
          ['敏捷团队怎么管项目（下）：当任务可以分配给 AI 代理', 'AI 时代的项目管理：代理执行、人来审查与负责', '从“问题跟踪”到“上下文中心”：AI 如何改变敏捷团队'])}
o = ['# 敏捷团队的项目与任务管理：方法、工具与 AI 时代（三集）\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画，产品截图来自各产品官方页面，版权归各自所有。产品功能、价格以官方最新说明为准；故事点、周报数字、工具雷达图等均为示意。\n\n标签：敏捷　项目管理　Scrum　看板　Jira　Linear　GitHub　AI 代理　研发管理　AI 生成\n']
for ep, (k, nm, fn, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- Digital.ai，第 18 期 State of Agile 报告（2025-10）
- Scrum Guide（2020）；Scrum Guide Expansion Pack（2025-06，Sutherland、Jocham、Coleman）
- Basecamp，Shape Up（2019）
- DORA，指标历史（五项指标、2024 年加入部署返工率）；2025 DORA 报告
- Atlassian，Data Center end of life
- GitHub Changelog：Evolving GitHub Issues and Projects（2025-04）；Copilot cloud agent for Linear（2026-07）
- Linear 文档：Agents in Linear；DevClass 关于 Linear Agent 的报道（2026-03）
- Asana Spring 2026 Release；Notion 3.0（2025-09-18）
- 量子位：飞书项目开放平台升级（2026-04）

## 截图来源（官方页面，版权归各自所有）

- Jira：atlassian.com/software/jira
- Linear：linear.app、linear.app/docs/board-layout、linear.app/docs/use-cycles
- GitHub：github.com/platform；docs.github.com《Starting GitHub Copilot sessions》
- Asana：asana.com/product、asana.com/product/ai/ai-teammates
- Notion：notion.com/releases/2025-09-18
- 飞书项目：project.feishu.cn
''')
open('标题与描述.md', 'w').write(''.join(o)); print('ok')
