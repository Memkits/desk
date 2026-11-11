import json, os
NM = {1: '莱布尼茨的梦', 2: '无穷与危机', 3: '通用机器', 4: '梦想之后'}
EP = {1: ('第一集', '莱布尼茨的梦', '《逻辑的引擎》第 1–3 章导读：莱布尼茨的步进计算器、微积分记号与二进制；“通用文字”与“推理演算”——让我们算一算；布尔把逻辑写成代数（x·x = x、矛盾律、三段论）及其局限；香农 1937 年把布尔代数用于开关电路，与或非门和二进制加法器；弗雷格《概念文字》、量词与可机械检查的证明；逻辑主义与罗素悖论、理发师悖论，以及集合论公理与《数学原理》。',
          ['《逻辑的引擎》导读（一）：莱布尼茨的梦', '从“让我们算一算”到开关电路：计算机的逻辑源头', '布尔、弗雷格与罗素悖论：推理怎样变成计算']),
      2: ('第二集', '无穷与危机', '《逻辑的引擎》第 4–6 章导读：康托尔用一一对应比较无穷，偶数、分数都可数；对角线论证证明实数不可数，幂集与无穷的阶梯，连续统假设；克罗内克的反对与集合论悖论；希尔伯特 1900 年的问题、与布劳威尔直觉主义之争、形式化纲领与判定问题；哥德尔编码、“本句不可证”、第一与第二不完备定理；哥德尔与科恩：连续统假设的独立性。',
          ['《逻辑的引擎》导读（二）：无穷与危机', '对角线、希尔伯特纲领与哥德尔不完备定理', '无穷有多大？数学能证明自己不矛盾吗？']),
      3: ('第三集', '通用机器', '《逻辑的引擎》第 7–8 章导读：图灵把“计算的人”抽象成纸带机器，二进制加一的完整演示；通用图灵机与“程序也是数据”；丘奇的 λ 演算与丘奇-图灵论题；停机问题的对角线证明与判定问题无解；普林斯顿、布莱奇利园与恩尼格玛、巨人；巴贝奇分析机与 1940 年代的早期机器；ENIAC 与六位女性程序员；冯·诺依曼的 EDVAC 报告与存储程序之争；ACE、曼彻斯特“宝宝”、EDSAC；图灵的晚年。',
          ['《逻辑的引擎》导读（三）：通用机器', '图灵机、停机问题与第一批存储程序计算机', '一台机器模拟所有机器：计算机是怎样从逻辑里诞生的']),
      4: ('第四集', '梦想之后', '《逻辑的引擎》第 9 章导读 + 2000 年以后的进展：图灵测试与达特茅斯会议、逻辑理论家；卢卡斯—彭罗斯的哥德尔论证与戴维斯的反驳；塞尔的中文屋与系统回应；作者戴维斯本人的工作：DPLL 与 SAT 求解器、希尔伯特第十问题与 MRDP 定理；补充时间线：四色定理与奇阶定理的 Coq 验证、开普勒猜想 Flyspeck、Lean 与 mathlib、液态张量实验、BB(5) = 47,176,870；AlexNet、AlphaGo、Transformer、ChatGPT；AI 在 IMO 达到银牌、金牌水平；2026 年 AI 参与解决埃尔德什问题；不变的边界：停机问题、不完备定理与量子计算。',
          ['《逻辑的引擎》导读（四）：梦想之后', '机器能思考吗？从中文屋到大模型证明数学定理', '书出版以后：机器证明与 AI 的二十六年'])}
o = ['# 逻辑的引擎 · 导读（四集）\n\n基于马丁·戴维斯《逻辑的引擎》（Engines of Logic: Mathematicians and the Origin of the Computer，2000；第一推动丛书中译本）的导读视频：按原书九章的顺序，用自己的话概述内容，补充例子和书出版之后（2000–2026）的进展。不是原书朗读，也不能代替阅读原书。\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画，人物用文字徽章代替肖像；部分图示为示意（如莱布尼茨的质数编码、哥德尔编码的符号表、弗雷格记号的简化画法）。时间线条目已联网核对年份（截至 2026 年 11 月），仍以原始论文和官方公告为准。\n\n标签：逻辑的引擎　第一推动丛书　数理逻辑　图灵　哥德尔　计算机史　人工智能　科普　读书　AI 生成\n']
for ep, (k, nm, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']; fn = f'逻辑的引擎导读_第{ep}集_{NM[ep]}'
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`（或 parts/ 里的分段）　字幕：`{fn}.srt`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- Martin Davis, *Engines of Logic: Mathematicians and the Origin of the Computer*（W. W. Norton, 2000；又名 *The Universal Computer*）；中译本《逻辑的引擎》（第一推动丛书）
- G. Boole, *An Investigation of the Laws of Thought*（1854）；C. Shannon, A Symbolic Analysis of Relay and Switching Circuits（1938）
- K. Gödel, Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I（1931）
- A. Turing, On Computable Numbers, with an Application to the Entscheidungsproblem（1936）；Computing Machinery and Intelligence（1950）
- J. von Neumann, First Draft of a Report on the EDVAC（1945）
- J. Searle, Minds, Brains, and Programs（1980）；R. Penrose, *The Emperor's New Mind*（1989）
- M. Davis, H. Putnam（1960）；M. Davis, G. Logemann, D. Loveland（1962）：DPLL
- G. Gonthier, Formal Proof—The Four-Color Theorem（2008）；Gonthier 等，奇阶定理的 Coq 形式化（2012-09）
- T. Hales 等，A Formal Proof of the Kepler Conjecture（Forum of Mathematics, Pi, 2017；Flyspeck 完成于 2014-08）
- Lean / mathlib；Liquid Tensor Experiment（2022-07 完成）
- bbchallenge, Determination of the fifth Busy Beaver value（arXiv:2509.12337，2025）
- Google DeepMind：AlphaProof（2024-07）；Gemini Deep Think IMO 2025 金牌水平（2025-07）
- Quanta Magazine, Why the Legendary Erdős Problems Are Falling to AI（2026-08）；OpenAI, Model disproves discrete geometry conjecture（2026-05）
- NYU Courant：Martin Davis 讣告（2023-01）
''')
os.makedirs('final', exist_ok=True); open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
