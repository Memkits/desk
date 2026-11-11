import json, os
NM = {1: '电脑能有心灵吗', 2: '数学是发现还是发明', 3: '经典世界与量子之谜', 4: '心灵的物理在哪里'}
EP = {1: ('第一集', '电脑能有心灵吗', '《皇帝新脑》序言与第 1–2 章导读：彭罗斯为什么写这本书；图灵测试与下棋程序；强人工智能的主张与“传送机”思想实验；塞尔的中文屋；什么是算法（欧几里得算法）；图灵机、图灵机编号与通用图灵机；丘奇-图灵论题；停机问题的对角线证明。',
          ['《皇帝新脑》导读（一）：电脑能有心灵吗', '图灵测试、中文屋与停机问题：彭罗斯的出发点', '会思考的机器只是在运行算法吗？']),
      2: ('第二集', '数学是发现还是发明', '《皇帝新脑》第 3–4 章导读：曼德布罗集——谁也没有发明它的复杂结构；实数、复数与柏拉图世界；形式系统与哥德尔不完备定理；彭罗斯的论证：数学洞察不是算法；不可计算的铺砖问题、彭罗斯镶嵌与 2023 年发现的“帽子”单片非周期瓷砖；希尔伯特第十问题；P 与 NP、旅行商问题。',
          ['《皇帝新脑》导读（二）：数学是发现还是发明', '曼德布罗集、哥德尔定理与彭罗斯镶嵌', '数学家的洞察能被算法代替吗？']),
      3: ('第三集', '经典世界与量子之谜', '《皇帝新脑》第 5–6 章导读：彭罗斯的物理理论分级（超级、有用、试探）；牛顿力学、台球混沌与相空间；麦克斯韦电磁学、光锥与广义相对论（外尔与里奇曲率）；普朗克与双缝实验、复数振幅；自旋与黎曼球、施特恩-格拉赫实验；U 与 R 两种演化，薛定谔的猫；EPR 与贝尔不等式。',
          ['《皇帝新脑》导读（三）：经典世界与量子之谜', '从台球到薛定谔的猫：彭罗斯眼中的物理世界', '双缝、自旋与贝尔不等式：量子力学哪里不完整？']),
      4: ('第四集', '心灵的物理在哪里', '《皇帝新脑》第 7–10 章与尾声导读 + 书后进展：熵与第二定律、太阳给我们的是低熵；大爆炸的特殊性与外尔曲率假设；引力导致的客观坍缩（OR）与 τ ≈ ħ/E；大脑结构、裂脑与神经元；判断、灵感与“啊哈”时刻；利贝特实验与准晶生长；书后：《心灵的影子》（1994）、共形循环宇宙（2010）、哈默罗夫-彭罗斯 Orch-OR 与泰格马克的退相干批评、格兰萨索地下实验（2020）、微管稳定剂实验（2024）；2020 年诺贝尔物理学奖；大模型时代与彭罗斯的立场。',
          ['《皇帝新脑》导读（四）：心灵的物理在哪里', '量子引力、微管与意识：彭罗斯的大胆猜想', '书出版三十多年后：Orch-OR、地下实验与大模型'])}
o = ['# 皇帝新脑 · 导读（四集）\n\n基于罗杰·彭罗斯《皇帝新脑——有关电脑、人脑及物理定律》（The Emperor\'s New Mind，1989；中译本许明贤、吴忠超译，湖南科学技术出版社，第一推动丛书）的导读视频：按原书十章加尾声的顺序，用自己的话概述内容，补充例子和书出版之后（1989–2026）的进展。不是原书朗读，也不能代替阅读原书。彭罗斯的核心论点（意识不可计算、与量子引力有关）在学界争议很大，视频中会同时介绍主要的反对意见。\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画，人物用文字徽章代替肖像；部分图示为示意（如图灵机编号、相空间、大脑与神经元的简化画法、坍缩时间的数量级）。书后进展已联网核对（截至 2026 年 11 月），仍以原始论文为准。\n\n标签：皇帝新脑　彭罗斯　第一推动丛书　人工智能　意识　哥德尔　图灵机　量子力学　科普　读书　AI 生成\n']
for ep, (k, nm, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']; fn = f'皇帝新脑导读_第{ep}集_{NM[ep]}'
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`（或 parts/ 里的分段）　字幕：`{fn}.srt`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- Roger Penrose, *The Emperor's New Mind: Concerning Computers, Minds, and the Laws of Physics*（Oxford University Press, 1989）；中译本《皇帝新脑》（许明贤、吴忠超译，湖南科学技术出版社，第一推动丛书）
- A. Turing, On Computable Numbers, with an Application to the Entscheidungsproblem（1936）；Computing Machinery and Intelligence（Mind, 1950）
- K. Gödel, Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I（1931）
- J. Searle, Minds, Brains, and Programs（Behavioral and Brain Sciences, 1980）
- D. Smith, J. S. Myers, C. S. Kaplan, C. Goodman-Strauss, An aperiodic monotile（arXiv:2303.10798, 2023）；A chiral aperiodic monotile（arXiv:2305.17743, 2023）
- R. Penrose, On Gravity's Role in Quantum State Reduction（General Relativity and Gravitation, 1996）
- R. Penrose, *Shadows of the Mind*（1994）；*Cycles of Time*（2010）
- M. Tegmark, Importance of quantum decoherence in brain processes（Physical Review E 61, 4194, 2000）
- S. Donadi et al., Underground test of gravity-related wave function collapse（Nature Physics 17, 74, 2021；2020-09 在线发表）
- S. Khan et al., Microtubule-Stabilizer Epothilone B Delays Anesthetic-Induced Unconsciousness in Rats（eNeuro, 2024）
- Nobel Prize in Physics 2020：Roger Penrose（黑洞形成是广义相对论的稳健预言），与 R. Genzel、A. Ghez 分享
''')
os.makedirs('final', exist_ok=True); open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
