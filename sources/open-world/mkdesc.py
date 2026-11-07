import json
EP = {1: ('第一集', '装得下', '流式加载、大世界坐标、LOD 与 Nanite、剔除、IO：开放世界的地基。分块与流式加载（World Partition、Addressables）；单精度浮点的精度问题与大世界坐标（LWC、原点重设、反向 Z）；离散 LOD、HLOD 与 Nanite 的簇与 DAG；视锥剔除、遮挡剔除与 HZB；SSD、硬件解压与 DirectStorage、IoStore；《巫师 4》技术演示的快速几何流送；以及 MegaTexture、硬件曲面细分、“无限细节”点云等昙花一现的方案。',
          ['开放世界是怎么做出来的（一）：装得下', '走到远处的城不用读条：流式加载、精度与剔除', '从读条到无缝：开放世界的地基是怎么搭的']),
      2: ('第二集', '画得出', '大世界渲染：高度图、clipmap 与虚拟纹理地形；GPU 实例化、风场与 Nanite 植被；从光照图、探针、SVOGI 到 Lumen、DDGI 与 MegaLights 的动态全局光照；虚拟阴影贴图；物理大气、体积云与 FFT 海面；16.6 毫秒的帧预算、超分辨率与插帧；以及光照传播体积、UE4 体素 GI、GPU 物理粒子等昙花一现的方案。',
          ['开放世界是怎么做出来的（二）：画得出', '地形、植被、光照与天空：大世界每一帧是怎么画出来的', '16.6 毫秒里画完一整片山河']),
      3: ('第三集', '造得出', '内容生产管线：分形噪声与水力侵蚀生成地形；遮罩、河流与道路；规则、泊松盘采样与 PCG 框架的程序化散布，《地平线》的运行时摆放；摄影测量与扫描资产库；编辑器工具、One File Per Actor、版本控制（Perforce、Lore）、派生数据缓存与持续集成；清单式填充、热力图、数据驱动任务、系统化设计与环境叙事；以及体素大世界、“全程序化宇宙”、爬塔解锁地图等昙花一现的做法。',
          ['开放世界是怎么做出来的（三）：造得出', '几百万棵树是谁种的：程序化生成、扫描与工具链', '从噪声到任务表：开放世界的内容生产管线']),
      4: ('第四集', '活起来', '让世界活起来：导航网格、行为树与状态树、感知、智能物体、ECS 与 AI 细节层次；固定步长、休眠与孤岛、载具与破坏、三大引擎的物理；差异存档、版本迁移与异步存档；相关性裁剪、复制图、服务器网格、客户端预测与延迟补偿；AI 浪潮（AI NPC 对话、高斯泼溅、编辑器 AI 助手与 MCP、世界模型、AI 测试）；SpatialOS 与 Stadia；最后是全专题的九方向技能地图。',
          ['开放世界是怎么做出来的（四）：活起来', 'NPC、物理、存档与多人：让世界活起来的工程', '从行为树到世界模型：开放世界的最后一块拼图'])}
o = ['# 开放世界是怎么做出来的（四集专题）\n\n本系列由 AI 生成：文稿与画面由 Claude 制作，配音为 Gemini TTS 合成（1.25 倍速）。画面为程序绘制的示意图与动画，并非任何游戏或引擎的实际截图；代码卡为简化后的示意代码；性能数字、时间条、比例图等均为示意。引擎版本与年份以官方发布记录为准（截至 2026 年 11 月）。\n\n标签：开放世界　游戏开发　游戏引擎　虚幻引擎5　Unity　Godot　图形学　程序化生成　游戏AI　AI 生成\n']
for ep, (k, nm, bl, titles) in EP.items():
    TL = json.load(open(f'tl_e{ep}.json')); d = TL['total']; fn = f'开放世界是怎么做出来的_第{ep}集_{nm}'
    o.append(f'\n## {k} · {nm}（{int(d//60)}:{int(d%60):02d}）\n\n**标题候选**\n\n' + ''.join(f'{i+1}. {t}\n' for i, t in enumerate(titles)) + f'\n**文件**：`{fn}.mp4`　字幕：`{fn}.srt`　封面：`封面_第{ep}集_16x9.png` / `_4x3.png` / `_3x4.png`\n\n**简介**：{bl}\n\n**章节**\n\n')
    for s in TL['scenes']:
        t = 0 if s is TL['scenes'][0] else s['start']; o.append(f"{int(t//60):02d}:{int(t%60):02d} {s['title'].split(' ', 1)[1] if s['chapter'] else '片头'}\n")
o.append('''
## 参考资料

- Unreal Engine 5.7 发布说明（2025-11-12）；Unreal Engine 5.8 发布说明（2026-06-17）
- Unreal Engine 文档：World Partition、Large World Coordinates、Nanite、Lumen、Virtual Shadow Maps、PCG、Mass Entity、StateTree、Smart Objects、Replication Graph、Iris、Chaos
- Unreal Fest Orlando 2025：《巫师 4》UE5 技术演示
- Unity 文档：Addressables、Entities、AI Navigation、Netcode、HDRP
- Godot 4.4 发布说明（2025-03，内置 Jolt 物理）
- GDC 2017：Jaap van Muijden，《地平线：零之曙光》GPU 程序化摆放
- Robert Bridson：Fast Poisson Disk Sampling（2007）
- Glenn Fiedler：Fix Your Timestep!
- Kerbl 等：3D Gaussian Splatting（SIGGRAPH 2023）
- Google DeepMind：Genie 3（2025-08）
- 《星际公民》Alpha 4.0 发布（2024-12）；Google Stadia 关闭公告（2023-01-18）
''')
open('final/标题与描述.md', 'w').write(''.join(o)); print('ok')
