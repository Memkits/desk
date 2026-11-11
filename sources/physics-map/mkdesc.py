import json, os
NM = {1: '石头光与冲力', 2: '从比萨到剑桥', 3: '电热与光', 4: '量子的城市', 5: '大科学时代'}
EP = {1: ('第一集', '石头、光与冲力（约前 600 – 1543）', '米利都与爱奥尼亚学派：万物由什么构成，毕达哥拉斯的琴弦，德谟克利特的原子；亚里士多德的宇宙与落体观；亚历山大港：阿基米德的杠杆与浮力、埃拉托斯特尼测地球、托勒密；《墨经》的小孔成像与力的定义、张衡地动仪；巴格达与开罗：伊本·萨赫勒的折射定律、伊本·海赛姆《光学之书》、比鲁尼与哈齐尼、法里西解释彩虹；沈括记录磁偏角、佩雷格里纳斯《磁石书信》、赵友钦的小孔实验；菲洛波努斯、布里丹的冲力、默顿学院与奥雷姆的平均速度定理。',
          ['物理的地图（一）：石头、光与冲力', '物理学最早诞生在哪里？从米利都到巴格达再到巴黎', '两千年的物理学前史：原子、杠杆、折射与指南针']),
      2: ('第二集', '从比萨到剑桥（1543 – 1800）', '哥白尼的日心说、第谷与开普勒的行星三定律；伽利略的斜面、落体与抛物线、望远镜；托里拆利的气压计、帕斯卡、格里克的马德堡半球与波义耳定律；罗默测光速、惠更斯的波动说；牛顿的苹果、月亮与《原理》（牛顿大炮动画）；欧拉、拉格朗日把力学写成方程；格雷、杜菲、莱顿瓶、富兰克林、库仑扭秤、伽伐尼与卡文迪许；温度计与潜热。',
          ['物理的地图（二）：从比萨到剑桥', '科学革命的地图：伽利略、开普勒、牛顿各在哪座城市', '从斜面到《原理》：物理学怎样变成一门精确科学']),
      3: ('第三集', '电、热与光（1800 – 1900）', '伏打电堆、奥斯特与安培、欧姆；法拉第的电磁感应与力线；卡诺热机、焦耳的热功当量、能量守恒与热力学定律；托马斯·杨的双缝与菲涅耳；麦克斯韦方程与电磁波、赫兹的实验；克劳修斯、麦克斯韦与玻尔兹曼的统计物理；夫琅禾费谱线与基尔霍夫、本生；迈克耳孙-莫雷实验、洛伦兹与塞曼；X 射线、放射性与电子；开尔文的“两朵乌云”。',
          ['物理的地图（三）：电、热与光', '十九世纪的物理地图：从伏打电堆到电子', '法拉第、麦克斯韦与热力学：一百年里物理学的三条大河']),
      4: ('第四集', '量子的城市（1900 – 1945）', '普朗克的能量子与爱因斯坦的光量子；伯尔尼与柏林：狭义与广义相对论；卢瑟福的原子核与玻尔模型；1925–1927：海森堡、薛定谔、玻恩、泡利、狄拉克与哥本哈根；萨哈、玻色、拉曼、叶企孙、赵忠尧、汤川秀树；1932 奇迹年、1933 年后的大迁徙、核裂变与芝加哥一号堆；哈勃与膨胀的宇宙、勒梅特。',
          ['物理的地图（四）：量子的城市', '量子力学的五座城市：黑尔戈兰、哥廷根、苏黎世、剑桥、哥本哈根', '1900–1945：相对论、量子与大迁徙的物理地图']),
      5: ('第五集', '大科学时代（1945 – 今）', '费曼、施温格、朝永振一郎与量子电动力学；李政道、杨振宁与吴健雄的宇称不守恒；粒子动物园、夸克与标准模型、希格斯玻色子；宇宙微波背景辐射与精确宇宙学；BCS 超导、激光、约瑟夫森效应、量子霍尔效应、高温超导、石墨烯与量子反常霍尔效应；中微子振荡、LIGO 引力波；墨子号、魔角石墨烯、黑洞照片、量子优越性；全系列小结与按今日国家的排行。',
          ['物理的地图（五）：大科学时代', '1945 年以后，物理学的新点出现在哪里？', '从宇称不守恒到引力波：大科学时代的物理地图'])}
o = ['# 物理的地图（五集专题）\n\n把物理学史上两百多项重要成果，按“做出或发表成果时物理学家所在的城市”钉在世界地图上，跟着时间轴看物理学的中心怎样从爱奥尼亚、亚历山大港、巴格达一路迁到剑桥、哥廷根、普林斯顿，再到今天遍布世界的实验室。同一个人搬了家，就会出现在好几个城市。配套的交互网页（物理学家世界地图）使用同一份数据。\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。地图底图为今日国界（Natural Earth 1:110m）；排行榜里的“当时政权”是成果当时的地域归属，片尾的国家排行按今日国界统计。古代与中世纪条目的年代、地点很多有争议（如《墨经》的成书地、张衡地动仪的结构、哥白尼临终见书的故事），画面卡片上标了“存疑”或“据说”；迁移线、实验装置和物理过程的动画（如牛顿大炮、双缝干涉、原子模型、引力波波形）都是示意，不按真实比例。数据只收录约 250 项成果，排行只反映这份数据，不代表各国物理学的完整历史。\n\n标签：物理学史　物理的地图　世界地图　时间线　伽利略　牛顿　法拉第　麦克斯韦　爱因斯坦　量子力学　标准模型　引力波　科普　AI 生成\n']
for ep, (k, nm, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']; fn = f'物理的地图_第{ep}集_{NM[ep]}'
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`（或 parts/ 里的分段）　字幕：`{fn}.srt`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- D. Lindberg, *The Beginnings of Western Science*（Chicago, 2nd ed. 2007）
- 李约瑟《中国科学技术史》第四卷 物理学及相关技术；钱临照《墨经》光学研究
- R. Rashed, A Pioneer in Anaclastics: Ibn Sahl on Burning Mirrors and Lenses（Isis, 1990）；A. M. Smith, Alhacen's Theory of Visual Perception
- R. Westfall, *Never at Rest: A Biography of Isaac Newton*；S. Drake, *Galileo at Work*
- O. Darrigol, *Electrodynamics from Ampère to Einstein*；P. Harman, *Energy, Force and Matter*
- A. Pais, *Subtle is the Lord*；*Inward Bound*；H. Kragh, *Quantum Generations*
- Nobel Prize 官网（nobelprize.org）各年度物理学奖说明
- LIGO Scientific Collaboration, Observation of Gravitational Waves from a Binary Black Hole Merger（PRL, 2016）
- Event Horizon Telescope Collaboration（ApJL, 2019）；Arute et al., Quantum supremacy using a programmable superconducting processor（Nature, 2019）
- Y. Cao et al., Unconventional superconductivity in magic-angle graphene superlattices（Nature, 2018）
- 地图数据：Natural Earth 1:110m Admin 0 Countries
''')
os.makedirs('final', exist_ok=True); open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
