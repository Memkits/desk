import json, html
F = json.load(open('figs.json'))
CAP = {'flow1947': '1947 年 Goldstine 与冯·诺依曼报告中的流程图', 'sketchpad': 'Sketchpad（1963）', 'nls': 'NLS 的鼠标与和弦键盘', 'alto': 'Xerox Alto，Smalltalk 的诞生地',
 'st76': 'Smalltalk-76 界面示意（重绘）', 'ns': 'Nassi–Shneiderman 结构图', 'sort': '排序算法动画', 'treemap': '树图', 'callgraph': '自动布局的调用图', 'uml': 'UML 类图', 'cfg': '控制流图',
 'labview': 'LabVIEW 数据流框图', 'pd': 'Pure Data 补丁', 'etoys': 'Etoys', 'scratch': 'Scratch 3.0', 'blockly': 'Blockly', 'snap': 'Snap!', 'appinv': 'App Inventor', 'ue': 'Unreal 蓝图：规模变大后的“面条图”',
 'nodered': 'Node-RED', 'emacs': 'GNU Emacs（paredit 的宿主）', 'pharo': 'Pharo：Smalltalk 浏览器的今天', 'gource': 'Gource：版本历史动画', 'codecharta': 'CodeCharta：3D 软件地图', 'altost': 'Alto 上的 Smalltalk（重绘）', 'calcit_expr': 'Calcit Editor：表达式按块自动布局', 'calcit_defs': 'Calcit Editor：定义依赖树', 'hovenia_doc': 'Hovenia Editor：Canvas 渲染的树布局', 'hovenia_demo': 'Hovenia Editor 演示'}
def fig(k):
    f = F[k]
    return f'<figure><a href="{f["page"]}" target="_blank" rel="noopener"><img src="{f["src"]}" alt="{CAP[k]}" loading="lazy"></a><figcaption>{CAP[k]}<span>{html.escape(f["by"].splitlines()[0])} · {html.escape(f["lic"])}{"" if "README" in f["lic"] else " · Wikimedia Commons"}</span></figcaption></figure>'
def figs(*ks): return '<div class="figs">' + ''.join(fig(k) for k in ks) + '</div>'
def ev(t, a): return f'<a class="ev" href="{a}" target="_blank" rel="noopener">{t}</a>'

S = []
add = S.append

# ── 框架
add(f'''<section id="frame"><header><span class="no">序章</span><span class="era">约 6 分钟</span></header>
<h2><small>先拆开问题</small>“文本还是树”其实是四个问题</h2>
<p class="lead">七十年来很多争论没有结论，是因为把四件事混在一起谈。视频开头先给出这把尺子，后面每个系统都按它定位、比较。</p>
<div class="axes">
<div><b>① 存储</b><p>代码在磁盘上是什么：字符文本，还是语法树 / 数据库 / 哈希寻址的定义？</p></div>
<div><b>② 编辑</b><p>手的动作作用在什么上：字符与选区，还是节点与模板？</p></div>
<div><b>③ 呈现</b><p>眼睛看到什么：等宽文本、积木、连线图、表格、3D 城市？</p></div>
<div><b>④ 运行可见</b><p>能不能在写的同时看到值、轨迹与变化？</p></div>
</div>
<p>例：Scratch 是“树存储 + 节点编辑 + 积木呈现”；paredit 是“文本存储 + 节点编辑 + 文本呈现”；gofmt / Prettier 是“文本存储，但文本只是语法树的一种标准投影”；Python Tutor 只做第 ④ 项。</p>
</section>''')

# ── 第一部分 调查
add('<div class="part"><span>第一部分</span>调查：五波尝试，每一波都押注了一个假设</div>')
waves = [
 ('w1', '第一波', '正确性优先：语法制导编辑器', '1971–1990', '只要编辑器不让你写出非法程序，错误就会消失。',
  [('Emily（1971）、Interlisp、Mentor、Cornell Program Synthesizer（1978–81）、Gandalf、Synthesizer Generator（1984）、Centaur、Pan',)],
  [('得', '教学场景表现好：Cornell Program Synthesizer 在康奈尔入门课中长期使用；属性文法、增量语义分析等技术留了下来。'),
   ('失', '职业程序员抵触。Waters 1982 年的文章标题就是结论：“程序编辑器不应抛弃面向文本的命令”。表达式级编辑像填表，改小地方要先拆再装。'),
   ('留下', '“编辑器理解语言”这件事本身被继承，后来以增量解析、语言服务的形式回归。')],
  ev('Waters 1982', 'https://www.springerprofessional.de/doi/10.1145/988376.988380') + ' · ' + ev('Structure editor 词条', 'https://en.wikipedia.org/wiki/Structure_editor'),
  ['alto', 'st76']),
 ('w2', '第二波', '绕开文本：图形与数据流语言', '1975–至今', '图比字更直观，程序画出来就能看懂。',
  [('VisiCalc（1979）/ Excel、Pygmalion（1975）、Prograph、LabVIEW（1986）、HyperCard（1987）、Max（1988）/ Pure Data（1996）、Unreal 蓝图、Node-RED',)],
  [('得', '在“本来就是信号流”的领域大获成功：测控、音频合成、游戏逻辑、物联网。用户往往不是职业程序员。最成功的一例常被忽略：电子表格——二维网格呈现、公式即时重算，是使用人数最多的“实时编程环境”；2020 年起 Excel 加入 LAMBDA，公式语言成为完整的函数式语言。'),
   ('失', '通用编程中输掉。可读性实验并未证明图形优于文本（Green、Petre 等 1990 年代的 LabVIEW 对比研究，待核原文数据）；规模一大就成“面条图”，即所谓 Deutsch 极限：一屏能放的图元远少于文本。'),
   ('留下', '“认知维度”框架（Green & Petre）成为评价一切编程界面的通用语言：粘滞度、隐藏依赖、过早承诺……')],
  ev('认知维度', 'https://en.wikipedia.org/wiki/Cognitive_dimensions_of_notations') + ' · ' + ev('CD 教程（Blackwell & Green）', 'https://www.cl.cam.ac.uk/~afb21/CognitiveDimensions/CDtutorial.pdf'),
  ['labview', 'pd', 'ue']),
 ('w3', '第三波', '形状即语法：积木编程', '1990s–至今', '让拼不上的东西拼不上，新手就不会被语法挡住。',
  [('Etoys、Alice、Scratch（2007）、App Inventor、Blockly（2012）、Snap!、MakeCode',)],
  [('得', '结构化编辑影响最广的形态：数以千万计的学生，从未意识到自己在用“结构编辑器”。'),
   ('失', '红利不迁移。Weintrop & Wilensky（2019）对比两个高中班：积木班在第 5 周领先（66.6% 对 58.8%），转到 Java 后到第 15 周持平（64.9% 对 64.7%），自信心反而下降。'),
   ('留下', '积木成了“入口”，而不是“终点”；混合式、可双向切换的编辑器成为研究方向（Stride、Pencil Code）。')],
  ev('Weintrop & Wilensky 2019', 'https://www.terpconnect.umd.edu/~weintrop/papers/Weintrop&Wilensky_2019_C&E.pdf'),
  ['scratch', 'blockly', 'snap']),
 ('w4', '第四波', '一模多视：投影式编辑与语言工作台', '1990s–至今', '源代码是模型，文本、表格、公式、图只是它的投影；语言可以自由组合。',
  [('Intentional Programming（Simonyi，1990s–2017）、JetBrains MPS（2003–）、mbeddr、Lamdu、Unison、Darklang Classic（2017–2024）、Cirru / Calcit Editor（2012–2025，自动布局的树编辑器，按定义逐屏编辑、多端实时同步）及其 Canvas 实验 Hovenia Editor',)],
  [('得', 'Berger 等（FSE 2016）用 MPS 做对照实验：学生经 45 分钟培训，基础编辑速度与文本编辑器无显著差异；熟练用户在复杂任务上快约 2–3 倍，拼写错误更少，更多使用“移动”和重构。'),
   ('失', '同一实验：删除、选中“视觉上相邻但不是兄弟节点”的代码最痛苦，表达式级的非法插入更多。生态成本更致命：diff、版本控制、代码评审、搜索全要重做。Darklang 在 2024 年移除结构编辑器，称其占了半个代码库、bug 多，且“在代码生成的世界里活不下去”。'),
   ('留下', '在工业 DSL（嵌入式、保险、法规等）中有稳定用户；“格式化器 = 规范投影”的思想悄悄普及。')],
  ev('Berger et al. FSE 2016', 'https://gup.ub.gu.se/file/206790') + ' · ' + ev('Darklang 状态更新', 'https://blog.darklang.com/an-overdue-status-update/') + ' · ' + ev('Petro & Porubän 2024', 'https://drops.dagstuhl.de/entities/document/10.4230/OASIcs.SLATE.2024.5') + ' · ' + ev('calcit-lang/editor', 'https://github.com/calcit-lang/editor') + ' · ' + ev('Hovenia Editor', 'https://github.com/Cirru/hovenia-editor'),
  ['calcit_expr', 'calcit_defs', 'hovenia_doc']),
 ('w5', '第五波', '结构沉到文本底下', '2005–至今', '别换掉文本，在文本下面加一棵随时可用的树。',
  [('paredit（约 2005）、Coccinelle、gofmt（2009）/ Prettier（2017）、LSP（2016）、tree-sitter（2018）、Semgrep / ast-grep / Comby（结构化搜索与改写）、OpenRewrite（无损语义树，大规模重构）、difftastic（结构化 diff）、Mergiraf（2024，按语法树合并）、Cursorless',)],
  [('得', '迄今最成功的一波：几乎每个现代编辑器都在后台维护语法树，“按结构选择、重命名、折叠、比较”成了日常，而用户仍觉得自己在编辑文本。'),
   ('失', '结构只是“辅助”，不能保证中间状态有意义；跨文件语义仍依赖重量级语言服务。'),
   ('留下', '研究前沿转向“像文本一样流畅的结构编辑”：Hazel 的类型洞（POPL 2017）、tylr、Pantograph（POPL 2025）。')],
  ev('Hazelnut POPL 2017', 'https://popl17.sigplan.org/details/POPL-2017-papers/2/Hazelnut-A-Bidirectionally-Typed-Structure-Editor-Calculus') + ' · ' + ev('Pantograph POPL 2025', 'https://popl25.sigplan.org/details/POPL-2025-popl-research-papers/28/Pantograph-A-Fluid-and-Typed-Structure-Editor') + ' · ' + ev('结构编辑器清单', 'https://github.com/yairchu/list-of-structural-editors'),
  ['emacs']),
]
for wid, k, t, era, bet, systems, gl, src, fg in waves:
    rows = ''.join(f'<li class="g-{"plus" if a=="得" else "minus" if a=="失" else "keep"}"><span>{a}</span><p>{b}</p></li>' for a, b in gl)
    add(f'''<section id="{wid}"><header><span class="no">{k}</span><span class="era">{era}</span></header><h2>{t}</h2>
<p class="bet"><b>押注</b>{bet}</p><p class="sys">{systems[0][0]}</p><ul class="gl">{rows}</ul><p class="srcs">证据：{src}</p>{figs(*fg) if fg else ''}</section>''')

add(f'''<section id="vis"><header><span class="no">平行线索</span><span class="era">1947–至今</span></header><h2>可视化的四次转向</h2>
<p class="lead">可视化这条线也有自己的押注变化：从“画出结构”到“放映算法”，再到“俯瞰全局”和“看见运行”。</p>
<ol class="steps">
<li><b>画结构</b><span>1947–1997</span><p>流程图、Nassi–Shneiderman 图、UML。结局：设计文档里活着，代码里没人维护——图与代码不同步。</p></li>
<li><b>放映算法</b><span>1981–2010</span><p>《Sorting Out Sorting》、BALSA、Tango、Python Tutor。结局：教学中长盛不衰，职业开发中少见。</p></li>
<li><b>俯瞰全局</b><span>1991–2015</span><p>Treemap、SeeSoft、CodeCity、Gource。结局：论文多、演示惊艳、日常使用少。Merino 等综述 181 篇 SOFTVIS/VISSOFT 论文，约 62% 没有任何评估。</p></li>
<li><b>看见运行</b><span>2011–至今</span><p>火焰图（2011）、调试器变量视图、覆盖率标记、notebook（Mathematica 1988 → Jupyter）、Code Bubbles / Code Canvas（2010）、Bret Victor 的演讲、Light Table、Glamorous Toolkit。结局：小而专的视图成了标配，宏大的“实时编程环境”多数停在原型。</p></li>
</ol>
<p class="srcs">证据：{ev('Merino et al. 系统综述', 'https://scg.unibe.ch/research/softvis-eval')} · {ev('Diehl 讲义', 'https://www.rw.cdl.uni-saarland.de/people/diehl/private/SoftVisVorles/slides/SVScript.pdf')} · {ev('Light Table', 'https://chris-granger.com/2012/04/12/light-table-a-new-ide-concept/')}</p>
{figs('ns', 'sort', 'treemap', 'callgraph', 'gource', 'codecharta')}</section>''')

# ── 第二部分 对比
add('<div class="part"><span>第二部分</span>对比：把三十个系统放进同一张表</div>')
T = [
 ('VisiCalc / Excel', '单元格网格', '公式', '表格', '即时重算', '办公/财务/分析', '最大规模的终端用户编程'),
 ('Cornell Program Synthesizer', '树', '节点/模板', '文本', '部分', '教学', '停用，思想被继承'),
 ('Interlisp / paredit', '文本(S式)', '节点', '文本', '—', 'Lisp 社区', '小众但长寿'),
 ('LabVIEW', '图', '连线', '数据流图', '有', '测控', '领域标准'),
 ('Max / Pure Data', '图', '连线', '补丁图', '实时', '音频/艺术', '领域标准'),
 ('Scratch / Blockly', '树', '拖拽', '积木', '有', '入门教育', '大规模成功'),
 ('JetBrains MPS', '模型', '投影', '混合', '—', '工业 DSL', '稳定小众'),
 ('Unison', '哈希树', '文本→解析', '文本', '—', '通用', '仍在发展'),
 ('Darklang Classic', '树', '结构(Fluid)', '文本', '有', '后端', '2024 年回到文本'),
 ('Cirru / Calcit', '树快照(Cirru EDN)', '树编辑器 → Agent CLI', '自动布局积木 → 命令行视图', '热替换', '个人/小团队 Web 应用', '2025–26 年弃用树编辑器，保留树存储'),
 ('gofmt / Prettier', '文本', '文本', '规范文本', '—', '通用', '普及'),
 ('LSP / tree-sitter', '文本', '文本+结构命令', '文本', '—', '通用', '普及'),
 ('Hazel', '树', '结构(带洞)', '文本样式', '实时', '研究/教学', '研究前沿'),
 ('Python Tutor', '文本', '文本', '文本+堆栈图', '逐步', '教学', '教学常用'),
 ('CodeCity / Gource', '文本', '—', '3D/动画', '历史', '分析/展示', '演示多、日常少'),
 ('火焰图', '—', '—', '层叠条形', '采样', '性能分析', '普及'),
 ('Jupyter / Observable', '文本单元', '文本', '文本+结果', '实时', '数据/科学', '普及'),
 ('OpenRewrite / Semgrep / Mergiraf', '文本', '规则化改写', '文本', '—', '大规模维护', '工业中普及'),
 ('Haystack 等画布 IDE', '文本', '文本+AI', '无限画布', '—', '通用', '早期'),
 ('Kiro / Spec Kit（规格驱动）', '文本+规格', '自然语言→AI', '规格/任务清单', '—', '通用', '2025 年兴起'),
 ('DeepWiki 等 AI 文档图', '文本', '—', '自动生成文档与图', '—', '理解代码库', '2025 年兴起'),
 ('Unreal 蓝图 / ComfyUI / n8n', '图', '连线', '节点图', '有', '游戏/AI 流程/自动化', '快速增长'),
]
rows = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in T)
add(f'''<section id="table"><header><span class="no">对比表</span><span class="era">视频中逐行展开</span></header><h2>同一把尺子量所有系统</h2>
<div class="tw"><table><thead><tr><th>系统</th><th>① 存储</th><th>② 编辑</th><th>③ 呈现</th><th>④ 运行可见</th><th>主要领域</th><th>结局</th></tr></thead><tbody>{rows}</tbody></table></div>
<p class="note">读表的方法：凡是动了“① 存储”的方案，都要为整个工具生态（diff、合并、评审、搜索、复制粘贴、聊天里贴代码）付出重建成本；只动“② 编辑”和“③ 呈现”、存储仍是文本的方案，普及速度明显更快。这一点是第三部分第一条规律的来源。</p>
</section>''')

# ── 第三部分 规律
add('<div class="part"><span>第三部分</span>规律：七十年里反复出现的八件事</div>')
L = [
 ('文本的网络效应', '文本是所有工具的公共接口：版本控制、diff、grep、邮件、论坛、代码评审，以及如今大模型的训练数据。改存储格式等于退出这个网络，要支付“生态税”。', 'Darklang、Unison、Intentional Software 的经历'),
 ('结构会下沉', '成功的结构化不是取代文本，而是藏到文本底下：后台解析、前台仍是文本。格式化器本质上就是投影式编辑的胜利——文本成了语法树的规范视图。', 'paredit → LSP → tree-sitter → Prettier'),
 ('正确性与流畅性的拉锯', '结构编辑追求“随时合法”，而人的思考大量发生在不合法的中间状态。谁能让“未完成”也有意义，谁就能缓解这对矛盾。', 'Waters 1982、Berger 2016 的删除/选择问题、Hazel 的类型洞'),
 ('领域决定成败', '当领域本身就是流（信号、音频、着色器、数据管线）、用户不是职业程序员时，图形与结构胜出；通用编程中撞上规模天花板。', 'LabVIEW、Max、蓝图、ComfyUI 对比通用可视化语言'),
 ('新手红利不迁移', '结构化界面降低入门门槛，但优势在转向文本后消失；它适合当入口，不适合当阶梯本身。', 'Weintrop & Wilensky 2019'),
 ('可视化要回答一个具体问题', '日常使用的可视化都是“一个高频问题、零配置”：火焰图回答热点在哪，git 图回答分支怎么合，调试器回答变量是多少。宏大的全景视图常常没有人每天需要。', 'Merino 等：62% 无评估；火焰图与 CodeCity 的对比'),
 ('演示与产品之间的鸿沟', '实时编程的演示极有感染力，但需要语言、运行时、编辑器三者同时配合，产品化成本巨大，多数停在原型或缩回研究。', 'Bret Victor 的演讲、Light Table、Eve（2014–2018）、Dynamicland'),
 ('思想约 15 年回潮一次', '每当输入设备或交互范式变化（光笔、鼠标、网页、触屏、大模型），同一批想法会换个名字重来一遍，并带回上一轮的一部分成果。', '1960s Sketchpad → 1980s 语法制导 → 2000s MPS → 2010s 实时编程 → 2020s AI'),
]
add('<section id="laws"><div class="laws">' + ''.join(f'<div><span class="ln">规律 {i+1}</span><b>{a}</b><p>{b}</p><small>案例：{c}</small></div>' for i, (a, b, c) in enumerate(L)) + '</div></section>')

# ── 第四部分 AI
add('<div class="part"><span>第四部分</span>AI 背景下：变量变了，结论会变吗</div>')
add(f'''<section id="ai-now"><header><span class="no">现状调查</span><span class="era">2023–2026</span></header><h2>已经发生的六件事</h2>
<ol class="tl">
<li><span class="yr">2023–24</span><div><b>大模型巩固了文本</b><p>模型以文本训练、以文本输出。Darklang 明确把“代码生成的世界”列为放弃结构编辑器的理由之一。</p></div></li>
<li><span class="yr">2024–26</span><div><b>两种相反的退出方式</b><p>Darklang 移除结构编辑器，存储改回文本、接入 LSP；Calcit 在 2025–26 年弃用人用的树编辑器（文档理由是转向 LLM 生成代码的工作流），但保留树存储，把编辑改成给智能体调用的结构化命令，带 dry-run 与版本守卫。前者放弃了树，后者只放弃了“人手编辑树”。</p></div></li>
<li><span class="yr">2023–25</span><div><b>智能体在后台大量使用结构</b><p>用 tree-sitter 生成仓库地图挑选上下文，用语言服务器做跳转、重命名和诊断，用测试和类型检查做反馈回路。结构没有消失，它成了 AI 的工具。</p></div></li>
<li><span class="yr">2024</span><div><b>类型洞成为 AI 的上下文</b><p>Hazel 团队（OOPSLA 2024）让语言服务器告诉模型“洞”的类型和上下文，类型定义对补全质量影响最大，并提出给 LSP 加 ChatLSP 扩展。</p></div></li>
<li><span class="yr">2025</span><div><b>约束解码进入代码生成</b><p>PLDI 2025 等工作在解码时用语法和类型约束模型输出，显著减少编译错误。“生成过程只能产出合法树”——这正是 1970 年代语法制导编辑器的理想，换了一个执行者。</p></div></li>
<li><span class="yr">2023–26</span><div><b>节点图在 AI 流程里复兴</b><p>ComfyUI、n8n、Dify 等用连线图编排模型与工具，并开始出现由 AI 生成和修改节点图的助手（如 ComfyUI-Copilot）。</p></div></li>
</ol>
<p class="srcs">证据：{ev('Darklang', 'https://blog.darklang.com/an-overdue-status-update/')} · {ev('Calcit 结构编辑器文档', 'https://github.com/calcit-lang/calcit/blob/main/docs/structural-editor.md')} · {ev('Typed holes + LLM（OOPSLA 2024）', 'https://arxiv.org/abs/2409.00921')} · {ev('Type-Constrained Code Generation（PLDI 2025）', 'https://arxiv.org/abs/2504.09246')} · {ev('ComfyUI-Copilot', 'https://arxiv.org/html/2506.05010v1')}</p>
{figs('nodered')}</section>''')


add(f'''<section id="ai-new"><header><span class="no">新方案调查</span><span class="era">2023–2026</span></header><h2>AI 带出来的新尝试，以及它们在重复谁</h2>
<p class="lead">把新方案放回历史坐标里看：几乎每一个都对应一个旧想法，只是执行者从人换成了模型。</p>
<div class="tw"><table><thead><tr><th>新方案</th><th>做了什么</th><th>对应的旧想法</th><th>变化在哪</th></tr></thead><tbody>
<tr><td>规格驱动开发（Kiro、GitHub Spec Kit、Tessl，2025）</td><td>先写需求、设计与任务清单，再由智能体生成和更新代码；规格成为主要编辑对象</td><td>Intentional Programming 的“意图树”、文学化编程</td><td>“意图”第一次有了能自动落地为代码的执行者</td></tr>
<tr><td>按语法与类型约束的解码、ChatLSP</td><td>生成时只允许合法语法或类型，或把类型洞的上下文喂给模型</td><td>1970 年代的语法制导编辑器、Hazel 类型洞</td><td>约束作用在生成器上，人不再为“随时合法”付出粘滞度</td></tr>
<tr><td>智能体的结构化工具（LSP / tree-sitter 封装为工具、MCP 服务）</td><td>重命名、跳转、按符号读取、结构化替换</td><td>paredit、IDE 重构、结构编辑器的命令集</td><td>命令的使用者从键盘变成智能体</td></tr>
<tr><td>AI + 确定性改写（OpenRewrite 配合 LLM、AI 生成 codemod）</td><td>模型写改写规则，规则在无损语义树上确定地执行</td><td>Coccinelle、程序变换系统</td><td>规则的编写成本大幅下降，执行仍可审计</td></tr>
<tr><td>下一处编辑预测（Copilot NES、Cursor Tab 等）</td><td>根据最近的修改预测下一处要改的位置和内容</td><td>结构化重构中的“相关修改”传播</td><td>不需要显式的结构模型，靠统计学习</td></tr>
<tr><td>画布 IDE（Haystack，2024）</td><td>把函数放在无限画布上，按调用关系排列，AI 辅助导航与编辑</td><td>Code Bubbles、Code Canvas（2010）</td><td>布局与关联由 AI 自动维护</td></tr>
<tr><td>草图即程序（tldraw Make Real，2023）</td><td>在画布上画界面草图，模型生成可运行的网页</td><td>Sketchpad、RAND GRAIL、Pygmalion</td><td>“画出来就能跑”第一次在通用场景可用</td></tr>
<tr><td>AI 生成的代码库文档与图（DeepWiki，2025）</td><td>为任意仓库自动生成架构说明与图示，可追问</td><td>SeeSoft、CodeCity 等全景可视化</td><td>按需生成、能对话，绕开“没人维护”的问题</td></tr>
<tr><td>节点图 + AI（ComfyUI、n8n，及其 AI 助手）</td><td>模型生成或修改节点图</td><td>LabVIEW、Max/Pd</td><td>图由 AI 搭建，人在图层面审阅</td></tr>
<tr><td>可塑软件（Ink &amp; Switch，2025 文章）</td><td>主张让用户借助 AI 改造自己的工具</td><td>Smalltalk、HyperCard、Glamorous Toolkit</td><td>“为自己造工具”的成本可能降到普通用户可承受</td></tr>
</tbody></table></div>
<p class="note">这些新方案大多还在早期，采用规模和效果缺少独立评估；视频中只描述它们做了什么、对应什么，不对效果下结论。</p>
<p class="srcs">证据：{ev('Martin Fowler：SDD 工具比较', 'https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html')} · {ev('GitHub Spec Kit', 'https://github.blog/2025-09-02-spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/')} · {ev('OpenRewrite LST', 'https://docs.openrewrite.org/concepts-and-explanations/lossless-semantic-trees.md')} · {ev('Moderne：LST + 生成式 AI', 'https://moderne.io/blog/auto-remediating-code-at-scale-with-lossless-semantic-tree-and-generative-ai')} · {ev('Mergiraf（LWN）', 'https://lwn.net/Articles/1042355')} · {ev('Haystack', 'https://www.ycombinator.com/launches/LeM-haystack-editor-an-ai-powered-code-editor-built-on-top-of-a-digital-canvas')} · {ev('tldraw Make Real', 'https://tldraw.dev/blog/make-real-the-story-so-far')} · {ev('DeepWiki 介绍', 'https://huggingface.co/blog/lynn-mikami/deepwiki')} · {ev('Ink & Switch：Malleable software', 'https://www.inkandswitch.com/essay/malleable-software/')} · {ev('Excel LAMBDA', 'https://www.microsoft.com/en-us/research/blog/lambda-the-ultimatae-excel-worksheet-function/')}</p>
</section>''')

P = [
 ('结构化编辑的“买家”从人变成 AI', '较高', '历史上结构编辑失败的主因是人手编辑的粘滞度。当大部分修改由智能体发起，粘滞度的代价消失，而“只产出合法修改”的价值上升。结构化编辑原语（重命名、移动、提取、填洞）会以工具接口的形式暴露给 AI，而不是以快捷键的形式暴露给人。', '智能体工具集中 AST/LSP 操作的比例；约束解码进入主流产品'),
 ('瓶颈从“写”转到“读”，可视化需求回升', '较高', 'AI 让生成变便宜，审核变成稀缺环节。需要的是回答具体问题的视图：这次改动影响了哪些调用者、行为差异在哪、为什么测试变了。正好避开了规律 6 的陷阱。', '代码评审工具中出现语义 diff、影响面图、执行轨迹对比'),
 ('按需生成的一次性可视化', '中', '可塑开发（Glamorous Toolkit）主张“为每个问题造一个检视器”，过去成本太高；AI 可以在几秒内为当前问题写一个专用视图，用完即弃。全景式可视化的“没人每天需要”问题因此被绕开。', 'IDE/智能体输出中内联图表、自动生成的架构图被频繁使用'),
 ('文本仍是交换格式，但更像“投影”', '较高', '人和模型都读写文本，网络效应在 AI 时代更强。但文本越来越由格式化器、代码生成和约束解码产生，存储层面的“唯一真相”逐渐是树与类型信息，文本是它的规范视图。', '格式化与 lint 全自动化；仓库中手写格式差异趋近于零'),
 ('“未完成的程序”成为一等公民', '中', '智能体大量工作在半成品状态：留洞、占位、待实现。Hazel 式的“有类型的洞”可能从研究走向工业语言与工具协议。', 'LSP 或主流语言增加对洞/占位的正式支持'),
 ('领域节点图继续扩张，混合形态成为主流', '较高', '粗粒度流程用图（人好审），细粒度逻辑用代码（AI 好写）。图中节点由 AI 生成和改写，人主要在图层面审阅。', 'AI 流程平台用户规模；节点内嵌代码的比例'),
 ('编辑对象上移到规格与意图', '中', '规格驱动开发让人主要编辑需求、设计和任务清单，代码由智能体维护。这是 Intentional Programming 想法的回潮；它能否持久，取决于规格与代码长期保持一致的成本。', '规格文件在仓库中的比例；规格与代码不一致导致的返工报告'),
 ('非文本存储的语言获得第二次机会', '低', 'Calcit 改由智能体通过结构化命令编辑树存储，说明这条路在个别项目中可行；但训练数据和工具生态仍以文本为主，能否推广还没有证据。', '模型对 MCP/工具化代码库操作的熟练度；此类语言的生态增长'),
]
add('<section id="predict"><header><span class="no">预测</span><span class="era">2026–2031</span></header><h2>八个判断，各附可信度与观察指标</h2><div class="preds">' +
    ''.join(f'<div><div class="ph"><b>{a}</b><span class="conf c-{"hi" if c=="较高" else "mid" if c=="中" else "lo"}">可信度 {c}</span></div><p>{b}</p><small>观察指标：{d}</small></div>' for a, c, b, d in P) + '</div></section>')

add('''<section id="plan"><header><span class="no">视频结构</span><span class="era">三集，合计约 55–65 分钟</span></header><h2>分集建议</h2>
<ol class="plan">
<li><b>上集 · 调查</b><div>序章四维框架；五波尝试（每波“押注—得—失—留下”）；可视化四次转向。约 22 分钟。动画：同一段代码在文本/树/积木/连线图之间变形；SeeSoft 与排序赛跑复刻。</div></li>
<li><b>中集 · 对比与规律</b><div>对比表逐行展开；八条规律，每条配一个正例一个反例。约 20 分钟。动画：系统在“存储—呈现”平面上的分布图；粘滞度演示（同一修改在文本与结构编辑器中的步数）。</div></li>
<li><b>下集 · AI 与预测</b><div>现状六件事；新方案对照表；八个判断与观察指标；结尾回到“文本还是树”。约 18 分钟。</div></li>
</ol>
<p class="note">已确认：三集；Cirru / Calcit 的关键尝试并入对比表、第四波和 AI 现状，与其他系统同等处理，只陈述可查证的事实。写稿时逐条核对原文，标“待核”的优先处理；Calcit 编辑器截图可由你提供或从仓库 README 引用。</p>
</section>''')

# 附录时间线（压缩）
add('''<section id="appendix"><header><span class="no">附录</span></header><h2>前史与配图素材</h2>
<p class="lead">1947 年冯·诺依曼的流程图、1963 年 Sketchpad、1968 年 NLS 与 GRAIL 作为开场素材；Smalltalk 浏览器、积木与数据流的截图用于第一部分。</p>''' + figs('flow1947', 'sketchpad', 'nls', 'etoys', 'appinv', 'pharo') + '</section>')

page = open('tpl2.html').read().replace('%%BODY%%', '\n'.join(S))
open('pub/index.html', 'w').write(page); print(len(page))
