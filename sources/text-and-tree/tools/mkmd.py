import json
T={ep:json.load(open(f'tl_e{ep}.json')) for ep in (1,2,3)}
def ch(ep): return '\n'.join(f"{int(s['start']//60):02d}:{int(s['start']%60):02d} {s['title'].split(' ',1)[1] if s['chapter'] else '开场'}" for s in T[ep]['scenes']).replace('00:01 开场','00:00 开场')
dur={ep:f"{T[ep]['total']/60:.0f}" for ep in T}
md=f"""# 文本与树：代码结构化编辑与可视化的得失与未来（三集）

## 标题
- 上集：【文本与树·上】七十年五波尝试：为什么程序员不直接编辑语法树？
- 中集：【文本与树·中】结构化编辑与代码可视化的八条规律
- 下集：【文本与树·下】AI 来了，谁来编辑这棵树？八个判断

备选：
- 从 Lisp 到 AI 智能体：代码结构化编辑与可视化简史
- 文本还是树？编程工具七十年的一场拉锯

## 通用简介（每集开头加上对应集的说明）
本系列由 AI 根据公开资料整理（脚本与画面：Claude；配音：Gemini TTS，1.25 倍速）。年份与实验数据尽量核对了原始来源，仍可能有误，欢迎指正；画面中的示意图仅用于说明概念。第八条规律（思想回潮）是个人观察，证据较弱。下集的判断附有可信度与观察指标，可能出错。

配套网页（提纲、对比表与资料来源）：https://repo.tiye.me/Memkits/desk/structural-editing/index.html

### 上集 · 调查（约 {dur[1]} 分钟）
用“存储、编辑、呈现、运行可见”四个问题拆开争论，调查五波结构化编辑尝试（语法制导编辑器、图形与数据流语言、积木、投影式编辑、结构沉到文本底下）和可视化的四次转向。
{ch(1)}

### 中集 · 对比与规律（约 {dur[2]} 分钟）
把二十多个系统放进同一张表，归纳八条规律：文本的网络效应、结构会下沉、正确与流畅的拉锯、领域决定成败、新手红利不迁移、可视化要回答具体问题、演示与产品之间的鸿沟、思想会回潮。
{ch(2)}

### 下集 · AI 与预测（约 {dur[3]} 分钟）
已经发生的六件事，新方案与旧想法的对照，八个附可信度与观察指标的判断，可能走偏的地方，以及给工具作者的建议。
{ch(3)}

## 主要资料
- Waters 1982《Program editors should not abandon text oriented commands》
- Berger 等，FSE 2016，投影式编辑效率对照实验（MPS）
- Weintrop & Wilensky 2019，积木与文本的对比研究
- Merino 等，软件可视化评估系统综述
- Green & Petre，认知维度框架
- Hazelnut（POPL 2017）、Pantograph（POPL 2025）、Typed holes + LLM（OOPSLA 2024）、Type-Constrained Code Generation（PLDI 2025）
- Darklang 状态更新（2024）；calcit-lang/calcit 结构编辑器文档
- 图片：Wikimedia Commons（作者与授权见画面）；Calcit Editor / Hovenia 截图来自项目 README

## 标签
编程语言, 结构化编辑, 代码可视化, 投影式编辑, 语法树, Lisp, Scratch, LabVIEW, tree-sitter, LSP, AI编程, 编程史
"""
open('final/标题与描述.md','w').write(md); print(md[:400])
