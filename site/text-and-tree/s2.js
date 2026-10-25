// 中集 · 对比与规律
const LAW = (c, n, t, d, at = .1) => show(c, `<div class="abs law" style="left:120px;top:240px;width:1680px"><div class="num">${n}</div><div><h2>${t}</h2><p>${d}</p></div></div>`, at, null, { dy: 12 });

S('b_open', c => {
  const { b } = c;
  show(c, `<div class="abs" style="left:120px;top:170px"><div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">文本与树 · 中集</div><div style="font:900 96px/1.15 var(--serif);margin-top:12px">对比与规律</div></div>`, .1);
  show(c, `<div class="abs" style="left:120px;top:470px;display:flex;gap:20px">${['同一张对比表', '八条规律', '每条配正例与反例'].map(t => `<div class="card pad" style="font:700 32px var(--serif)">${t}</div>`).join('')}</div>`, b(0) + 2);
  show(c, `<div class="abs p" style="left:120px;top:640px;font-size:26px">规律是归纳，不是定律：可以拿上集的材料去检验</div>`, b(0) + 7);
});

S('b_table', c => {
  const { b, be } = c;
  c.head('01', '同一把尺子', '二十多个系统，四个问题');
  const T = [['paredit / gofmt / Prettier', '文本', '节点 / 文本', '文本', '—', '普及', 'a'], ['LSP / tree-sitter', '文本', '文本 + 结构命令', '文本', '—', '普及', 'a'], ['Semgrep / OpenRewrite / Mergiraf', '文本', '规则化改写', '文本', '—', '工业普及', 'a'], ['Python Tutor · 火焰图 · Jupyter', '文本', '文本', '文本 + 图', '有', '普及', 'a'],
    ['康奈尔程序合成器', '树', '模板', '文本', '部分', '停用', 'b'], ['Scratch / Blockly', '树', '拖拽', '积木', '有', '入门教育', 'b'], ['LabVIEW · Max / Pd', '图', '连线', '数据流图', '有', '领域标准', 'b'], ['MPS', '模型', '投影', '混合', '—', '专用语言', 'b'], ['Unison · Darklang · Calcit', '树 / 哈希', '各异', '文本 / 命令行', '—', '小众或已转向', 'b'],
    ['电子表格', '网格', '公式', '表格', '即时', '最大规模', 'c'], ['蓝图 · ComfyUI · n8n', '图', '连线', '节点图', '有', '快速增长', 'c']];
  const tb = show(c, `<div class="abs" style="left:120px;top:240px;width:1680px"><table class="tb" style="font-size:20px"><tr><th>系统</th><th>① 存储</th><th>② 编辑</th><th>③ 呈现</th><th>④ 运行可见</th><th>结局</th></tr>${T.map(r => `<tr class="g-${r[6]}">${r.slice(0, 6).map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`, b(0) + .2, be(4) + .3);
  const rows = [...tb.querySelectorAll('tr')].slice(1);
  rows.forEach(r => c.in(r, b(r.className === 'g-a' ? 1 : r.className === 'g-b' ? 2 : 3) + .3, { dy: 6 }));
  // 分组高亮
  c.tick(t => { const k = t < b(1) ? '' : t < b(2) ? 'g-a' : t < b(3) ? 'g-b' : t < b(4) ? 'g-c' : ''; rows.forEach(r => { const on = r.className === k; if (r._on !== on) { r._on = on; r.style.background = on ? (k === 'g-a' ? '#E5EDF8' : k === 'g-b' ? '#F7EADD' : '#ECE8F6') : ''; } }); });
  show(c, box(120, 760, 1680, `<div class="p" style="font-size:27px">改动<b>存储</b>的方案，要为整个工具生态付出重建代价；只改<b>编辑与呈现</b>、存储仍是文本的，普及得快得多。</div>`), b(4) + .5, be(4) + .3);
  // 平面图
  const X0 = 300, Y0 = 880, W = 1000, H = 560;
  const pt = (x, y) => [X0 + x * W, Y0 - y * H];
  const D = [['文本编辑器', .04, .05, 'a'], ['paredit', .13, .15, 'a'], ['Prettier', .22, .06, 'a'], ['LSP · tree-sitter', .3, .16, 'a'], ['Python Tutor', .08, .52, 'a'], ['火焰图', .16, .7, 'a'], ['Jupyter', .26, .42, 'a'],
    ['MPS', .72, .5, 'b'], ['Unison', .84, .12, 'b'], ['Darklang', .74, .22, 'b'], ['Calcit Editor', .88, .48, 'b'], ['Scratch', .9, .9, 'b'], ['LabVIEW', .8, .84, 'b'], ['电子表格', .58, .72, 'c'], ['ComfyUI · n8n', .68, .92, 'c']];
  const col = { a: 'var(--edit)', b: 'var(--vis)', c: 'var(--both)' };
  const pl = show(c, `<div class="abs" style="left:0;top:0;width:1920px;height:1080px">
    <svg class="abs" width="1920" height="1080"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="#454B55"/></marker></defs>
      <path d="M${X0} ${Y0} L${X0 + W + 30} ${Y0}" stroke="#454B55" stroke-width="2" marker-end="url(#ah)"/><path d="M${X0} ${Y0} L${X0} ${Y0 - H - 30}" stroke="#454B55" stroke-width="2" marker-end="url(#ah)"/>
      <g class="mv" stroke-width="4" fill="none" stroke-dasharray="10 8">
        <path class="m1" d="M${pt(.74, .22).join(' ')} L${pt(.36, .2).join(' ')}" stroke="var(--bad)" marker-end="url(#ah)"/>
        <path class="m2" d="M${pt(.88, .48).join(' ')} L${pt(.88, .2).join(' ')}" stroke="var(--bad)" marker-end="url(#ah)"/>
        <path class="m3" d="M${pt(.04, .05).join(' ')} Q${pt(.15, .02).join(' ')} ${pt(.29, .14).join(' ')}" stroke="var(--ok)" marker-end="url(#ah)"/></g></svg>
    <div class="abs cap" style="left:${X0 + W - 160}px;top:${Y0 + 14}px;font-size:22px">存储：文本 → 树 / 图</div>
    <div class="abs cap" style="left:${X0 - 230}px;top:${Y0 - H - 40}px;font-size:22px;width:210px;text-align:right">呈现：文本 → 图形</div>
    ${D.map(([n, x, y, k]) => { const [px, py] = pt(x, y); return `<div class="abs dot" style="left:${px}px;top:${py}px;transform:translate(-50%,-50%)"><span style="display:block;width:22px;height:22px;border-radius:50%;background:${col[k]};margin:0 auto"></span><span style="position:absolute;left:28px;top:-4px;white-space:nowrap;font-size:22px;font-weight:600">${n}</span></div>`; }).join('')}</div>`, b(5) + .2, null, { dy: 0 });
  c.stagger(pl.querySelectorAll('.dot'), b(5) + 1, .25, { dy: 0, scale: .5 });
  pl.querySelectorAll('.mv path').forEach((p, i) => c.anim(p, [{ opacity: 0 }, { opacity: 1 }], b(6) + 1 + i * 3, .6));
  show(c, `<div class="abs" style="left:1420px;top:420px;width:400px" ><div class="card pad"><div class="p"><b style="color:var(--bad)">红线</b>：从右侧退回（Darklang 回到文本；Calcit 退出图形呈现）<br><b style="color:var(--ok)">绿线</b>：从左下角一点点往中间挪（LSP、tree-sitter）</div></div></div>`, b(6) + 7);
});

S('b_l1', c => {
  const { b, be } = c;
  LAW(c, '一', '文本的网络效应', '几十年的工具都假定代码是文本');
  const tools = ['版本控制', 'diff', 'grep', '邮件', '论坛', '代码评审', '大模型训练数据'];
  const g = show(c, `<div class="abs" style="left:120px;top:440px;width:1680px;display:flex;flex-wrap:wrap;gap:16px">${tools.map((t, i) => `<div class="card pad tt" style="font:700 30px var(--serif);${i === 6 ? 'border:3px solid var(--both)' : ''}">${t}</div>`).join('')}</div>`, b(0) + .5, be(0) + .3);
  c.stagger(g.querySelectorAll('.tt'), b(0) + 1, .6, { dy: 10 });
  show(c, box(120, 440, 1680, `<div class="ttl" style="font-size:40px">生态税</div><p class="p" style="font-size:28px">换掉存储格式 = 退出这个网络。自己的 diff、自己的合并、自己的评审界面，连在聊天里贴代码都要专门处理。</p>`), b(1) + .2, be(1) + .3);
  show(c, box(120, 440, 1680, `<div class="quote">“这个编辑器占了半个代码库，问题很多，<br>而且在代码生成的世界里活不下去。”<small>Darklang 状态更新（2024，大意）· 已移除结构编辑器，改用 LSP 与文本文件</small></div>`), b(2) + .2, be(2) + .3);
  show(c, `<div class="abs" style="left:120px;top:440px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div class="card pad"><span class="pill t-edit">反例 · Unison</span><div class="ttl" style="margin-top:12px">按哈希存储定义</div><p class="p">在本地给一个可编辑的文本文件，改完再解析回去</p></div>
    <div class="card pad"><span class="pill t-edit">反例 · Calcit</span><div class="ttl" style="margin-top:12px">树形快照</div><p class="p">快照本身是能放进 Git 的文本文件，只是不让人直接改</p></div></div>`, b(3) + .2, be(3) + .3);
  show(c, box(120, 440, 1680, `<div class="quote">任何存储格式，最终都要和文本网络建一座桥。<br>桥越窄，生态税越高。</div>`), b(4) + .2);
  src(c, 'Darklang：blog.darklang.com/an-overdue-status-update');
});

S('b_l2', c => {
  const { b, be } = c;
  LAW(c, '二', '结构会下沉', '成功的结构化，往往藏到文本底下');
  const ice = show(c, `<div class="abs" style="left:120px;top:430px;width:1680px;height:460px">
    <div class="abs" style="left:0;top:0;width:1680px;height:150px;background:var(--surface);border-radius:18px 18px 0 0;display:flex;align-items:center;padding:0 40px;font:700 34px var(--serif)">台前：仍然是文本编辑器</div>
    <div class="abs" style="left:0;top:150px;width:1680px;height:310px;background:#DCE6F3;border-radius:0 0 18px 18px;padding:30px 40px">
      <div class="cap" style="color:var(--edit)">台下：一直在维护的语法树</div>
      <div style="display:flex;gap:16px;margin-top:20px;flex-wrap:wrap">${['括号配平（paredit）', '语言服务器', 'tree-sitter', '重命名 · 提取函数', '格式化：解析 → 重新打印'].map(t => `<div class="card pad dn" style="font-size:26px;font-weight:700;padding:16px 22px">${t}</div>`).join('')}</div></div></div>`, b(1) + .2, be(2) + .3);
  c.stagger(ice.querySelectorAll('.dn'), b(1) + 1.5, 1.2, { dy: 10 });
  show(c, box(120, 430, 1680, `<div class="ttl" style="font-size:38px">推论</div><p class="p" style="font-size:28px;margin-top:10px">想推广一种结构化能力，优先做成<b>编辑器插件、语言服务器功能或命令行工具</b>，而不是做一个新编辑器。<br>用户不用换掉习惯，就能得到结构的好处。</p>`), b(3) + .2);
});

S('b_l3', c => {
  const { b, be } = c;
  LAW(c, '三', '正确与流畅的拉锯', '结构编辑追求随时合法，人却常在不合法的中间状态里思考');
  show(c, `<div class="abs" style="left:120px;top:440px;width:1680px;display:flex;gap:16px;font-size:28px">${['先写一半', '先放个占位', '回头再补'].map(t => `<div class="card pad" style="font-weight:700">${t}</div>`).join('<div style="align-self:center;color:var(--ink3)">→</div>')}</div>`, b(0) + 3, be(0) + .3);
  show(c, `<div class="abs tl" style="left:120px;top:440px;width:1680px">${tlrow('1982', 'Waters', '程序编辑器不应抛弃面向文本的命令')}${tlrow('2016', 'Berger 等', '删除与跨节点选择仍然是最难受的操作')}</div>`, b(1) + .2, be(1) + .3);
  const hz = show(c, box(120, 430, 1000, `<div class="cap">类型洞（Hazel）：没写完的地方也有类型（示意）</div>
    <div class="code" style="margin-top:14px;font-size:30px;line-height:1.7">let total = <span class="h1" style="border:2px dashed #8EC5FF;padding:0 10px;border-radius:6px">?</span><span class="cm"> : Float</span><br>let avg = total / <span class="h2" style="border:2px dashed #8EC5FF;padding:0 10px;border-radius:6px">?</span><span class="cm"> : Float</span></div>
    <p class="p" style="margin-top:12px">程序在每一步都可以分析、甚至运行</p>`), b(2) + .2, be(2) + .3);
  c.tick(t => { const h = hz.querySelector('.h1'), v = t > b(2) + 6 ? 'sum(xs)' : '?'; if (h._v !== v) { h._v = v; h.textContent = v; } });
  show(c, box(1170, 430, 630, `<div class="ttl">对老问题最有说服力的回答之一</div><p class="p">让“未完成”也有意义</p>`), b(2) + 4, be(2) + .3);
  show(c, box(120, 430, 1680, `<div class="ttl">tylr · Pantograph</div><p class="p" style="font-size:28px">像敲文本一样输入，编辑器在后台组织成树；暂时对不上的部分用洞或标记兜住。<br>试图证明：<b>正确与流畅不一定非此即彼。</b></p>`), b(3) + .2);
});

S('b_l4', c => {
  const { b, be } = c;
  LAW(c, '四', '领域决定成败', '领域本身是流或网格时，图形与结构胜出');
  show(c, `<div class="abs" style="left:120px;top:430px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${[['labview', 'LabVIEW · 测控'], ['pd', 'Pure Data · 音频'], ['ue', '蓝图 · 游戏逻辑'], ['nodered', 'Node-RED · 物联网']].map(([k, t], i) => `<div style="position:relative;height:420px">${fig(k, 0, 0, 405, 420, t, { cover: k === 'ue' })}</div>`).join('')}</div>`, b(0) + .5, be(1) + .3);
  show(c, `<div class="abs" style="left:120px;top:880px;width:1680px" ><span class="pill t-vis" style="font-size:22px">用户多不是职业程序员：关心测量、声音、表格里的数</span></div>`, b(1) + .3, be(1) + .3);
  show(c, box(120, 430, 1680, `<div class="ttl" style="font-size:38px">进入通用编程 → Deutsch 极限</div><p class="p" style="font-size:28px">一屏图元太少、抽象层次太多、连线缠成面条。<br>图形更适合<b>粗粒度的流程</b>，而不是<b>细粒度的逻辑</b>。</p>`), b(2) + .2, be(2) + .3);
  show(c, box(120, 430, 1680, `<div class="ttl" style="font-size:38px">电子表格：最好的注脚</div><p class="p" style="font-size:28px">领域是表格，用户是做表的人，规模通常不大。<br>长到几十个工作表、几千个公式时，<b>隐藏依赖</b>与难以审查的问题集中爆发。</p>`), b(3) + .2);
});

S('b_l5', c => {
  const { b, be } = c;
  LAW(c, '五', '新手红利不迁移', '结构化界面适合当入口，不适合当阶梯本身');
  show(c, fig('scratch', 120, 430, 700, 450, 'Scratch：大幅降低入门门槛'), b(0) + .5, be(0) + .3);
  const ch = show(c, box(120, 430, 1100, `<div class="cap" style="margin-bottom:18px">Weintrop &amp; Wilensky 2019 · 平均成绩（%）</div><div class="bars">${barRow('第 5 周 积木 / 文本', 66.6, 80, '66.6', 'var(--edit)')}${barRow('', 58.8, 80, '58.8', 'var(--ink3)')}${barRow('第 15 周 积木 / 文本', 64.9, 80, '64.9', 'var(--edit)')}${barRow('', 64.7, 80, '64.7', 'var(--ink3)')}</div>`), b(1) + .2, be(1) + .3);
  bars(c, ch, b(1) + .8, .4);
  show(c, box(120, 430, 1680, `<div class="ttl" style="font-size:38px">Stride（BlueJ / Greenfoot，2015）</div><p class="p" style="font-size:28px">框架式编辑：<b>语句一级用结构，表达式一级用文本</b>。设计者把它定位成从积木到文本的中间台阶。</p>`), b(2) + .2);
});

S('b_l6', c => {
  const { b, be } = c;
  LAW(c, '六', '可视化要回答具体问题', '高频的问题、几乎零配置');
  const Q = [['火焰图', '时间花在哪里？'], ['版本图', '分支是怎么合的？'], ['调试器', '这个变量现在是多少？']];
  show(c, `<div class="abs" style="left:120px;top:440px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">${Q.map(([a, q]) => `<div class="card pad" style="border-top:6px solid var(--ok)"><div class="ttl">${a}</div><p class="p" style="font-size:28px">${q}</p></div>`).join('')}</div>`, b(0) + 3, be(0) + .3);
  show(c, fig('codecharta', 120, 430, 760, 450, '全景视图：演示震撼，很少有人每天需要'), b(1) + .2, be(1) + .3);
  show(c, box(940, 430, 860, `<div style="font:800 80px var(--serif);color:var(--bad)">约 62%</div><p class="p" style="font-size:26px">的软件可视化论文没有任何评估（Merino 等）</p>`), b(1) + 5, be(1) + .3);
  show(c, box(120, 430, 1680, `<div class="ttl" style="font-size:40px">值不值得做？先问两个问题</div><p class="p" style="font-size:30px;margin-top:14px">① 它回答的是什么问题？　② 这个问题多久出现一次？</p>`), b(2) + .2, be(2) + .3);
  show(c, `<div class="abs" style="left:120px;top:430px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div class="card pad"><span class="pill t-ok">数据自动来</span><p class="p" style="font-size:26px;margin-top:12px">采样 → 火焰图<br>测试 → 覆盖率<br>运行时 → 调试视图</p></div>
    <div class="card pad"><span class="pill t-bad">要人手工维护</span><p class="p" style="font-size:26px;margin-top:12px">UML 等设计图<br>迟早和代码脱节</p></div></div>`, b(3) + .2);
});

S('b_l7', c => {
  const { b, be } = c;
  LAW(c, '七', '演示与产品之间的鸿沟', '实时编程需要语言、运行时、编辑器同时配合');
  show(c, `<div class="abs tl" style="left:120px;top:440px;width:1680px">${tlrow('2012', 'Bret Victor：Inventing on Principle', '写代码时实时看到结果，影响了之后十年的工具设计', 'both')}</div>`, b(0) + .3, be(0) + .3);
  show(c, `<div class="abs tl" style="left:120px;top:440px;width:1680px">${tlrow('2012', 'Light Table', '众筹成功，后来逐渐停滞', 'both')}${tlrow('2014–18', 'Eve', '2018 年关闭', 'both')}${tlrow('2010s–', 'Dynamicland', 'Victor 转向物理空间中的计算研究', 'both')}</div>`, b(1) + .2, be(1) + .3);
  show(c, `<div class="abs" style="left:120px;top:440px;width:1680px"><div class="cap" style="margin-bottom:14px">被拆成零件吸收</div><div style="display:flex;gap:16px">${['热重载', '笔记本', 'Playground', '内联显示的值'].map(t => `<div class="card pad" style="font:700 30px var(--serif)">${t}</div>`).join('')}</div></div>`, b(2) + .2, be(2) + .3);
  show(c, box(120, 440, 1680, `<div class="ttl" style="font-size:38px">对今天同样适用</div><p class="p" style="font-size:28px">AI 编程工具的演示同样惊艳。看一个新工具，与其看演示，<b>不如看它怎么接入现有工作流</b>。</p>`), b(3) + .2);
});

S('b_l8', c => {
  const { b, be } = c;
  LAW(c, '八', '思想会回潮', '一个观察，不是定律');
  const W = [['1960s', '光笔', 'Sketchpad'], ['1970s–80s', '终端 · 工作站', '语法制导编辑器'], ['2000s', '图形界面', 'MPS · 投影式编辑'], ['2010s', '网页 · 平板', '实时编程 · 积木'], ['2020s', '大模型', '约束生成 · 规格驱动']];
  const tl = show(c, `<div class="abs" style="left:120px;top:450px;width:1680px;display:grid;grid-template-columns:repeat(5,1fr);gap:16px">${W.map(([y, d, t]) => `<div class="card pad wv" style="border-top:6px solid var(--both)"><div class="k cap">${y}</div><div class="cap" style="margin-top:8px">${d}</div><div class="ttl" style="margin-top:6px;font-size:26px">${t}</div></div>`).join('')}</div>`, b(1) + .2, be(2) + .3);
  c.stagger(tl.querySelectorAll('.wv'), b(1) + .5, 1.5, { dy: 12 });
  show(c, `<div class="abs p" style="left:120px;top:740px;width:1680px;font-size:28px">每次回潮：带回上一轮的一部分成果，也重复一部分失败</div>`, b(2) + .3, be(2) + .3);
  show(c, box(120, 450, 1680, `<div class="pill t-mid" style="font-size:22px">证据最弱</div><p class="p" style="font-size:30px;margin-top:14px">间隔不规则，因果难以说清。<br>它的用处是提醒：<b>看到一个新名字，先去找找它上一次叫什么。</b></p>`), b(3) + .2);
});

S('b_end', c => {
  const { b, be } = c;
  c.head('10', '中集小结', '');
  const L = ['文本的网络效应', '结构会下沉', '正确与流畅的拉锯', '领域决定成败', '新手红利不迁移', '可视化要回答具体问题', '演示与产品之间的鸿沟', '思想会回潮'];
  const g = show(c, `<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${L.map((t, i) => `<div class="card pad lw"><div class="cap k">${'一二三四五六七八'[i]}</div><div class="ttl" style="font-size:27px;margin-top:6px">${t}</div></div>`).join('')}</div>`, b(0) + .1);
  c.stagger(g.querySelectorAll('.lw'), b(0) + .5, 1.2, { dy: 10 });
  show(c, box(120, 620, 1680, `<div class="quote" style="font-size:34px">结构化与可视化的价值是真实的，但最好以不打断现有习惯的方式出现，<br>并且只在领域和问题都合适的地方出现。</div>`), b(1) + .3);
  show(c, `<div class="abs p" style="left:120px;top:860px;font-size:28px">下一集：大模型来了以后，哪些规律被加强，哪些被削弱 →</div>`, b(2) + .3);
});
