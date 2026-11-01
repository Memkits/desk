import json
M = json.load(open('img.json')); cr = {int(c['file'][4:6]): c for c in json.load(open('/home/claude/sw/web/web_images_credits.json'))}
EP = {1: ('上集', '被关起来的波', '驻波_上集_被关起来的波', '两列反向的波怎样叠成原地振动的驻波；为什么边界让频率只能取整数倍；拨弦与傅里叶分解、吉他泛音；长笛和单簧管的音色差别、昆特管与鲁本斯管；克拉尼图形、鼓膜的不和谐泛音、定音鼓；房间低音、微波炉热点测光速、激光腔、声悬浮与回音廊。'),
      2: ('下集', '从大地到宇宙', '驻波_下集_从大地到宇宙', '日内瓦湖的假潮与芬迪湾的大潮差；地震后地球的自由振荡、舒曼共振；太阳五分钟振荡与日震学；千禧桥、台北 101 阻尼球、塔科马大桥的气动颤振；德布罗意波、盒中粒子、原子轨道、量子围栏与量子点；宇宙微波背景里的声学峰。')}
o = ['# 驻波（两集）\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面中的数字多为典型值或示意；动画（行波反射、弦的模式、拨弦分解、管内空气、克拉尼沙粒、鼓膜模式）为程序计算的示意，自绘插图为示意图。网络图片均来自 Wikimedia Commons，未做内容改动（仅缩放），署名见文末。\n\n标签：驻波　物理　科普　声学　振动　共振　量子力学　原子轨道　日震学　宇宙微波背景　克拉尼图形　AI 生成\n']
for ep, (k, nm, fn, bl) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n1. 驻波（{k}）｜{nm}\n2. {"从吉他弦到微波炉：驻波是什么" if ep == 1 else "从湖泊、太阳到原子和宇宙：到处都是驻波"}\n3. {"为什么琴弦只能发出确定的音高？" if ep == 1 else "地球会像钟一样响，太阳会唱歌"}\n\n**文件**：`{fn}.mp4`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_9x16.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
used = sorted({int(v[8:]) for ep in (1, 2) for s in json.load(open(f'tl_e{ep}.json'))['scenes'] for b in s['beats'] for v in b['vis'] if v.startswith('img:web')} | {35, 37})
o.append('\n## 网络图片署名\n\n')
for n in used:
    c = cr[n]; o.append(f"- {M[f'web_{n:02d}']['cap']}：[{c['title']}]({c['page']}) · {M[f'web_{n:02d}']['cr'].split(' · ')[0]} · {c['lic']}\n")
o.append('\n封面背景：上集为“拨弦的吉他”，下集为普朗克卫星宇宙微波背景图（署名同上）。\n')
open('标题与描述.md', 'w').write(''.join(o)); print(len(used), 'web images')
