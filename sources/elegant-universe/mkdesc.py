import json, os
NM = {1: '两座大厦的裂缝', 2: '万物皆是弦', 3: 'M理论与之后'}
EP = {1: ('第一集', '两座大厦的裂缝', '《宇宙的琴弦》第 1–5 章导读：光速不变与光钟、缪子与时间变慢、“以光速穿行时空”、质能等价；等效原理、弯曲时空、1919 年日食与卫星定位、光钟测出的引力时间差、黑洞与大爆炸；量子化、双缝实验、概率波、不确定性与量子涨落、费曼路径求和；标准模型与希格斯；重整化为何救不了引力、量子泡沫，以及圈量子引力这条另路。',
          ['《宇宙的琴弦》导读（一）：两座大厦的裂缝', '相对论和量子力学为什么打架？十分钟看懂弦论要解决的问题', '从光钟到量子泡沫：读《宇宙的琴弦》之前要知道的物理']),
      2: ('第二集', '万物皆是弦', '《宇宙的琴弦》第 6–10 章导读：弦论从 1968 年的意外到 1984 年第一次超弦革命；振动模式与粒子、能量阶梯、闭弦与引力子；弦怎样把相互作用抹开、避开无穷大；自旋、超对称、力的统一与暗物质候选；卡鲁扎–克莱因、为什么是十维、卡拉比–丘空间；缠绕模式与 T 对偶、最小尺度；能量差距与书中设想的实验信号。',
          ['《宇宙的琴弦》导读（二）：万物皆是弦', '粒子是弦的音符：振动、超对称与卷起来的六个维度', '弦论到底说了什么？一集讲清基本图像']),
      3: ('第三集', 'M 理论与之后', '《宇宙的琴弦》第 11–15 章导读 + 1999 年以后的进展：翻转与镜像对称；微扰论与弦耦合常数；五种弦论的对偶之网与十一维 M 理论、膜；黑洞熵的弦论计数与锥形转变；弦宇宙学、暴胀（视界与平坦性问题）与前大爆炸设想；原书第 15 章的三个未解问题。补充时间线（理论）：AdS/CFT 全息对偶、兰德尔–桑德拉姆膜世界、KKLT 与弦景观、沼泽地纲领、2006 年的批评、火墙、ER=EPR、岛屿与佩奇曲线；（观测）宇宙加速膨胀、LHC 与希格斯、未发现超对称、BICEP2、引力波、黑洞照片、GW250114、纳赫兹引力波背景、DESI 暗能量信号、缪子 g−2 终局、2026 年 LHC 停机升级。最后是“今天怎么读这本书”。',
          ['《宇宙的琴弦》导读（三）：M 理论与之后的二十多年', '弦论这 27 年：从 M 理论到没找到超对称', '书出版以后发生了什么？弦论与观测的时间线'])}
o = ['# 宇宙的琴弦 · 导读（三集）\n\n基于布赖恩·格林《宇宙的琴弦》（The Elegant Universe，1999）的导读视频：用自己的话概述原书内容，并补充例子和书出版之后（1999–2026）的进展。不是原书朗读，也不能代替阅读原书。\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画；曲线、比例和部分数字为示意（如力的统一图、T 对偶能谱、负概率柱图）。时间线条目已联网核对年份（截至 2026 年 11 月），仍以原始论文和官方公告为准。\n\n标签：宇宙的琴弦　弦论　相对论　量子力学　M理论　黑洞　宇宙学　科普　读书　AI 生成\n']
for ep, (k, nm, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']; fn = f'宇宙的琴弦导读_第{ep}集_{NM[ep]}'
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　字幕：`{fn}.srt`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- Brian Greene, *The Elegant Universe*（W. W. Norton, 1999）；中译本《宇宙的琴弦》
- J. Maldacena, The Large N Limit of Superconformal Field Theories and Supergravity（1997）
- L. Randall, R. Sundrum, A Large Mass Hierarchy from a Small Extra Dimension（1999）
- Kachru, Kallosh, Linde, Trivedi, De Sitter Vacua in String Theory（2003）
- Almheiri, Marolf, Polchinski, Sully, Black Holes: Complementarity or Firewalls?（2012）；Maldacena, Susskind, Cool horizons for entangled black holes（2013）
- Penington（2019）；Almheiri, Engelhardt, Marolf, Maxfield（2019）：黑洞蒸发的佩奇曲线
- ATLAS / CMS：希格斯粒子发现（2012-07-04）
- LIGO / Virgo：GW150914（2016）；GW250114，Physical Review Letters（2025-09）
- Event Horizon Telescope：M87*（2019-04-10）
- NANOGrav 15 年数据：引力波背景证据（2023-06）
- DESI DR2 Results II（arXiv:2503.14738，2025-03）
- Fermilab Muon g−2 最终结果（2025-06-03）；Muon g−2 Theory Initiative 2025 白皮书
- CERN：LHC 第三轮运行结束与第三次长停机（2026-06）
''')
os.makedirs('final', exist_ok=True); open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
