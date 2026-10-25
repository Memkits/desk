// 上集 · 调查
S('a_open', c => {
  const { b, be } = c;
  show(c, `<div class="abs" style="left:120px;top:150px"><div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">代码结构化编辑与代码可视化</div><div style="font:900 120px/1.1 var(--serif);margin-top:14px">文本与树</div></div>`, .1, be(0) + .2);
  show(c, box(120, 480, 1100, `<div class="cap" style="margin-bottom:10px">观看前说明</div><div class="p"><b>本系列由 AI 根据公开资料整理。</b>年份与实验数据尽量核对了原始来源，仍可能有误，欢迎指正。<br>画面中的示意图仅用于说明概念。</div>`), b(0) + .3, be(0) + .2);
  // 同一段代码的三种样子
  const y0 = 300;
  show(c, `<div class="abs" style="left:120px;top:${y0 - 70}px" ><div class="cap">程序员编辑的</div></div>`, b(1) + .2, be(1) + .3);
  show(c, `<div class="abs code" style="left:120px;top:${y0}px;width:560px;font-size:28px;white-space:nowrap">total = price + tax * rate</div>`, b(1) + .2, be(1) + .3);
  const tree = c.el(`<div class="abs" style="left:700px;top:${y0 - 70}px;width:560px;height:520px"><div class="cap">编译器理解的</div>
    <svg class="abs" style="left:0;top:40px" width="560" height="460"><g stroke="#9DB3D3" stroke-width="3" fill="none"><path d="M280 50 L140 150 M280 50 L420 150 M420 150 L320 260 M420 150 L520 260 M520 260 L440 370 M520 260 L600 370"/></g></svg>
    <div class="node op" style="left:280px;top:90px">=</div><div class="node" style="left:140px;top:190px">total</div><div class="node op" style="left:420px;top:190px">+</div>
    <div class="node" style="left:320px;top:300px">price</div><div class="node op" style="left:520px;top:300px">*</div><div class="node" style="left:440px;top:410px">tax</div><div class="node" style="left:600px;top:410px">rate</div></div>`);
  c.in(tree, b(1) + 3, { dy: 16 }); c.out(tree, be(1) + .3);
  const blk = c.el(`<div class="abs" style="left:1340px;top:${y0 - 70}px;width:480px;height:400px"><div class="cap">拼出来的</div>
    <div class="blk" style="left:0;top:50px;background:#E08A2E;white-space:nowrap;font-size:22px">设 total 为 <i>price</i> ＋ <i>tax × rate</i></div>
    <div class="blk" style="left:40px;top:130px;background:#4C97FF">price</div><div class="blk" style="left:190px;top:130px;background:#59C059">×</div><div class="blk" style="left:270px;top:130px;background:#4C97FF">tax</div><div class="blk" style="left:360px;top:130px;background:#4C97FF">rate</div></div>`);
  c.in(blk, b(1) + 6, { dy: 16 }); c.out(blk, be(1) + .3);
  // 三集
  const eps = [['上集', '调查', '五波编辑尝试 · 四次可视化转向'], ['中集', '对比与规律', '一张对比表 · 八条规律'], ['下集', 'AI 与预测', '已经发生的事 · 八个判断']];
  eps.forEach(([a, t, d], i) => show(c, box(120 + i * 570, 330, 530, `<div class="cap">${a}</div><div style="font:700 48px var(--serif);margin:8px 0 12px">${t}</div><div class="p">${d}</div>`), b(2) + .2 + i * .6));
});

S('a_frame', c => {
  const { b, be } = c;
  c.head('01', '四个问题', '先拆开，再比较');
  const A = [['①', '存储', '磁盘上是什么：字符，还是树、数据库？', 'edit'], ['②', '编辑', '手的动作作用在字符上，还是节点上？', 'edit'], ['③', '呈现', '看到的是文本、积木、连线图还是表格？', 'vis'], ['④', '运行可见', '写的同时能否看到值与变化？', 'vis']];
  const ax = c.el(`<div class="abs ax" style="left:120px;top:270px;width:1680px">${A.map(([n, t, d, k]) => `<div style="--c:${COL[k]};border-top:6px solid ${COL[k]}"><div class="n">${n}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`);
  [...ax.children].forEach((e, i) => c.in(e, i === 0 ? b(0) + .3 : b(1) + (i - 1) * 1.6, { dy: 16 }));
  const rows = [['Scratch', '树', '拖拽积木', '积木', '运行舞台'], ['paredit（Emacs）', '文本', '按节点', '文本', '—'], ['gofmt / Prettier', '文本（树的标准投影）', '文本', '规范文本', '—']];
  const tb = show(c, `<div class="abs" style="left:120px;top:600px;width:1680px"><table class="tb"><tr><th>系统</th><th>① 存储</th><th>② 编辑</th><th>③ 呈现</th><th>④ 运行可见</th></tr>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`, b(2) + .3);
  [...tb.querySelectorAll('tr')].slice(1).forEach((r, i) => c.in(r, b(2) + 1 + i * 2.2, { dy: 8 }));
});

S('a_pre', c => {
  const { b, be } = c;
  c.head('02', '前史', '流程图与代码即数据');
  show(c, fig('flow1947', 120, 260, 520, 660, '1947 · 戈德斯坦与冯·诺依曼的流程图'), b(0) + .2, be(2) + .2);
  show(c, `<div class="abs tl" style="left:700px;top:270px;width:1100px">${tlrow('1947', '流程图', '用框图描述程序的控制流，是控制流图的源头', 'vis')}</div>`, b(0) + 1);
  show(c, `<div class="abs tl" style="left:700px;top:400px;width:1100px">${tlrow('1958', 'Lisp：代码即数据', '程序本身是嵌套列表，可以像数据一样被遍历、被改写', 'edit')}</div>`, b(1) + .2);
  show(c, `<div class="abs code" style="left:700px;top:540px;width:640px;font-size:28px">(<span class="kw">defun</span> area (r)<br>&nbsp;&nbsp;(<span class="op">*</span> 3.14 r r))</div>`, b(1) + 1.5, be(1) + .3);
  show(c, `<div class="abs cap" style="left:1370px;top:560px;width:430px;font-size:22px;line-height:1.6">括号就是树的边界。<br>结构编辑在 Lisp 里显得最自然。</div>`, b(1) + 3, be(1) + .3);
  show(c, `<div class="abs tl" style="left:700px;top:530px;width:1100px">${tlrow('1963', 'Sketchpad', '光笔直接操作图形与约束', 'both')}${tlrow('1968', 'NLS · GRAIL', '按层级折叠跳转的文档；在手写板上画流程图编程', 'both')}</div>`, b(2) + .2);
  show(c, fig('sketchpad', 120, 260, 520, 660, '1963 · Sketchpad'), b(2) + 4, null, { dy: 0 });
  src(c, '图：Wikimedia Commons');
});

S('a_w1', c => {
  const { b, be } = c;
  c.head('03', '第一波', '正确性优先 · 1971–1990');
  const bet = show(c, `<div class="abs bet" style="left:120px;top:250px"><span class="pill">押注</span>编辑器不允许写出不合法的程序，错误就会消失</div>`, b(0) + .2, be(2) + .3);
  show(c, `<div class="abs tl" style="left:120px;top:340px;width:1100px">${tlrow('1971', 'Emily', '面向 PL/I，按语法模板逐层展开程序')}${tlrow('1970s', 'Mentor（INRIA）', '“语法必须始终正确”是铁律')}</div>`, b(0) + 2, be(0) + .3);
  show(c, `<div class="abs tl" style="left:120px;top:340px;width:1100px">${tlrow('1978–81', '康奈尔程序合成器', '面向教学：模板插入语句，边写边执行；允许警告后暂时保留语法错误')}</div>`, b(1) + .2, be(1) + .3);
  show(c, box(1280, 340, 520, `<div class="cap">模板插入示意</div><div class="k" style="font-size:24px;line-height:1.7;margin-top:10px">IF <span style="background:var(--edit-bg);color:var(--edit);padding:2px 8px;border-radius:6px">condition</span><br>THEN <span style="background:var(--edit-bg);color:var(--edit);padding:2px 8px;border-radius:6px">statement</span><br>ELSE <span style="background:var(--edit-bg);color:var(--edit);padding:2px 8px;border-radius:6px">statement</span></div>`), b(1) + 2, be(1) + .3);
  show(c, `<div class="abs tl" style="left:120px;top:340px;width:1100px">${tlrow('1984–88', 'Synthesizer Generator', '用属性文法自动生成结构编辑器')}${tlrow('1989–90', 'Centaur · Pan', '用逻辑程序检查约束')}</div>`, b(2) + .2, be(2) + .3);
  show(c, box(120, 640, 1680, `<div class="quote">“程序编辑器不应抛弃面向文本的命令”<small>Richard C. Waters，1982 年论文标题</small></div>`), b(2) + 5, be(2) + .3);
  // Interlisp
  show(c, `<div class="abs tl" style="left:120px;top:270px;width:1000px">${tlrow('1970s–80s', 'Interlisp 结构编辑器 → DEdit', '直接在表结构上移动、剪切、替换；DEdit 带图形界面')}</div>`, b(3) + .2, be(3) + .3);
  show(c, `<div class="abs code" style="left:120px;top:440px;width:1000px">(<span class="kw">cond</span> ((<span class="op">null</span> x) <span class="cm">nil</span>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(t (<span class="op">cons</span> (car x) (f (cdr x)))))</div>`, b(3) + 2, be(3) + .3);
  show(c, box(1180, 270, 620, `<div class="ttl">Lisp：括号就是树</div><p class="p">语法几乎只有括号，文本和树的距离很近。这个传统一直延续到今天的 paredit。</p>`), b(3) + 4, be(3) + .3);
  // 粘滞度演示
  const L = show(c, box(120, 260, 800, `<div class="cap">文本编辑器</div><div class="code" style="margin-top:14px;font-size:40px"><span>x = a + b</span><span class="ty"></span><span style="opacity:.6">▌</span></div><div class="p" style="margin-top:18px">在末尾敲入 <b class="k">" * c"</b>：<b>4 次按键</b></div>`), b(4) + .2, be(4) + .3);
  typeIn(c, L.querySelector('.ty'), ' * c', b(4) + 2, 3);
  const R = show(c, box(1000, 260, 800, `<div class="cap">严格的结构编辑器</div><div style="position:relative;height:330px">
    <svg class="abs" width="740" height="330"><g stroke="#9DB3D3" stroke-width="3"><path d="M370 40 L220 140 M370 40 L520 140"/><path class="e2" d="M520 140 L440 250 M520 140 L620 250" opacity="0"/></g></svg>
    <div class="node op" style="left:370px;top:40px">+</div><div class="node" style="left:220px;top:140px">a</div>
    <div class="node op n-mul" style="left:520px;top:140px;opacity:0">*</div><div class="node n-b" style="left:520px;top:140px">b</div>
    <div class="node hole n-c" style="left:620px;top:250px;opacity:0">?</div></div>
    <div class="p st">① 选中 b　② 包进乘法节点　③ 填入 c</div>`), b(4) + .2, be(4) + .3);
  const nb = R.querySelector('.n-b'), nm = R.querySelector('.n-mul'), nc = R.querySelector('.n-c'), e2 = R.querySelector('.e2');
  const t1 = b(4) + 4, t2 = b(4) + 6.5, t3 = b(4) + 9;
  c.anim(nb, [{ boxShadow: '0 0 0 0 rgba(31,95,168,0)' }, { boxShadow: '0 0 0 8px rgba(31,95,168,.35)' }], t1, .5);
  c.anim(nb, [{ left: '520px', top: '140px' }, { left: '440px', top: '250px' }], t2, .7);
  c.anim(nm, [{ opacity: 0 }, { opacity: 1 }], t2, .5); c.anim(e2, [{ opacity: 0 }, { opacity: 1 }], t2 + .3, .5); c.anim(nc, [{ opacity: 0 }, { opacity: 1 }], t2 + .5, .4);
  c.tick(t => { const v = t >= t3 ? 'c' : '?'; if (nc._v !== v) { nc._v = v; nc.textContent = v; nc.classList.toggle('hole', v === '?'); } });
  // 粘滞度
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px"><div class="law"><div class="num" style="font-size:40px;background:var(--bad)">粘</div><div><h2>粘滞度（viscosity）</h2><p>认知维度理论：做一个小改动需要多大的力气</p></div></div></div>`, b(5) + .2, be(5) + .3);
  show(c, `<div class="abs" style="left:120px;top:480px;width:1680px">${gainLoss('教学场景表现好；属性文法、增量语义分析等技术留了下来', '职业程序员抵触：改小地方要先拆再装，粘滞度高', '“编辑器应该理解语言”——后来以增量解析与语言服务的形式回归')}</div>`, b(5) + 3, be(5) + .3);
});

S('a_st', c => {
  const { b, be } = c;
  c.head('04', 'Smalltalk', '不按文件组织代码');
  show(c, fig('alto', 120, 250, 460, 660, 'Xerox Alto · Smalltalk 的诞生地', { cover: true }), b(0) + .2);
  show(c, fig('altost', 620, 250, 520, 660, 'Alto 上的 Smalltalk 环境（重绘示意）'), b(0) + 2);
  show(c, box(1180, 260, 620, `<div class="ttl">类 → 方法</div><p class="p">代码不放在文件里，而是在浏览器中按类和方法查看、编辑。</p>`), b(0) + 4);
  show(c, fig('pharo', 1180, 560, 620, 360, '今天的 Pharo 仍沿用这种浏览器'), b(1) + .3);
  show(c, `<div class="abs" style="left:620px;top:930px;width:1180px" class="cap"></div>`, b(1));
});

S('a_w2', c => {
  const { b, be } = c;
  c.head('05', '第二波', '绕开文本 · 1975–');
  show(c, `<div class="abs bet" style="left:120px;top:240px"><span class="pill">押注</span>图比字更直观，程序画出来就能看懂</div>`, b(0) + .2, be(0) + .3);
  show(c, fig('labview', 120, 320, 620, 420, '1986 · LabVIEW 数据流图'), b(0) + 1.5, be(0) + .3);
  show(c, fig('pd', 770, 320, 520, 420, '1996 · Pure Data 补丁'), b(0) + 4, be(0) + .3);
  show(c, fig('ue', 1320, 320, 480, 420, '游戏引擎的蓝图', { cover: true }), b(0) + 7, be(0) + .3);
  // 电子表格
  const cols = ['A', 'B', 'C'], data = [['单价', '数量', '金额'], ['12', '3', '=A2*B2'], ['8', '5', '=A3*B3'], ['', '合计', '=C2+C3']];
  const sh = show(c, box(120, 260, 900, `<div class="cap">电子表格：改一格，相关公式立刻重算</div><table class="tb" style="margin-top:14px;font-size:26px"><tr><th></th>${cols.map(x => `<th>${x}</th>`).join('')}</tr>${data.map((r, i) => `<tr><th>${i + 1}</th>${r.map((x, j) => `<td class="c${i}${j}">${x}</td>`).join('')}</tr>`).join('')}</table>`), b(1) + .2, be(1) + .3);
  const cells = { c02: sh.querySelector('.c12'), c22: sh.querySelector('.c32'), c00: sh.querySelector('.c10'), c12: sh.querySelector('.c22') };
  const t0 = b(1) + 4;
  c.tick(t => {
    const p = t > t0 + 3 ? 20 : 12, v1 = p * 3, v2 = 40, s = v1 + v2;
    const set = (e, v) => { if (e._v !== v) { e._v = v; e.textContent = v; } };
    set(cells.c00, String(p)); set(cells.c02, t > t0 ? String(v1) : '=A2*B2'); set(sh.querySelector('.c22'), t > t0 ? '40' : '=A3*B3'); set(cells.c22, t > t0 ? String(s) : '=C2+C3');
    const hl = t > t0 + 3 && t < t0 + 4.2; [cells.c00, cells.c02, cells.c22].forEach(e => e.style.background = hl ? '#FBE9C9' : '');
  });
  show(c, `<div class="abs tl" style="left:1080px;top:260px;width:720px">${tlrow('1979', 'VisiCalc', '程序摊成二维网格，即时重算', 'vis')}${tlrow('2020–', 'Excel LAMBDA', '公式语言成为完整的函数式语言', 'vis')}</div>`, b(1) + 6, be(1) + .3);
  // 匹配
  show(c, box(120, 260, 1680, `<div class="ttl">格林、佩特尔等人的对比实验（1990s）</div><p class="p" style="font-size:30px;margin-top:16px">结论不是“图形更好”或“文本更好”，而是：<b>表达方式与任务是否匹配</b>。</p>`), b(2) + 4, be(2) + .3);
  show(c, `<div class="abs" style="left:120px;top:520px;width:1680px;display:flex;gap:20px">${[['测控、音频、游戏逻辑', '领域本身就是流', 't-ok'], ['用户多不是职业程序员', '关心测量、声音、数字', 't-ok'], ['通用编程', '图形一直没有赢', 't-bad']].map(([a, d, k]) => `<div class="card pad" style="flex:1"><span class="pill ${k}">${k === 't-ok' ? '胜出' : '未胜出'}</span><div class="ttl" style="margin-top:10px">${a}</div><p class="p">${d}</p></div>`).join('')}</div>`, b(2) + .2, be(2) + .3);
  // Deutsch 极限
  show(c, fig('ue', 120, 250, 1000, 660, '节点一多，连线缠成“面条图”', { cover: true }), b(3) + .2, be(3) + .3);
  show(c, box(1170, 260, 630, `<div class="ttl">Deutsch 极限</div><p class="p">一块屏幕上能同时看到的图形元素，远少于文本。</p><div class="code" style="font-size:16px;line-height:1.35;margin-top:16px;opacity:.9">${Array.from({ length: 14 }, (_, i) => ['for (const x of items) {', '  if (x.ok) total += x.v;', '}', 'return total;', 'function f(a, b) {', '  return g(a) + h(b);'][i % 6]).join('<br>')}</div><p class="cap" style="margin-top:8px">同样面积，文本能放下多得多的逻辑（示意）</p>`), b(3) + 2, be(3) + .3);
  // 认知维度
  const cd = [['粘滞度', '做小改动要多大力气'], ['隐藏依赖', '关联看不见'], ['过早承诺', '被迫先做决定'], ['可见性', '能否同时看到需要的部分'], ['错误倾向', '是否容易犯错']];
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:repeat(5,1fr);gap:18px">${cd.map(([a, d]) => `<div class="card pad"><div class="ttl">${a}</div><p class="p" style="font-size:21px">${d}</p></div>`).join('')}</div>`, b(4) + .2);
  show(c, `<div class="abs cap" style="left:120px;top:470px;font-size:22px">认知维度框架（Green &amp; Petre）的部分维度：成为评价一切编程界面的通用语言</div>`, b(4) + 1);
  show(c, `<div class="abs" style="left:120px;top:540px;width:1680px">${gainLoss('信号流领域大获成功；电子表格是最成功的实时编程环境', '通用编程中输给文本；规模一大成面条图', '认知维度框架')}</div>`, b(4) + 3);
});

S('a_w3', c => {
  const { b, be } = c;
  c.head('06', '第三波', '形状即语法 · 1990s–');
  show(c, fig('scratch', 120, 250, 700, 460, '2007 · Scratch 3.0 编辑器'), b(0) + .2, be(1) + .3);
  show(c, fig('blockly', 850, 250, 460, 460, '2012 · Blockly'), b(0) + 3, be(1) + .3);
  show(c, fig('snap', 1340, 250, 460, 460, 'Snap!'), b(0) + 6, be(1) + .3);
  show(c, `<div class="abs" style="left:120px;top:740px;width:1680px;display:flex;gap:16px;align-items:center"><span class="pill t-edit" style="font-size:24px">拼不上的，就是不合法的程序</span><span class="cap">Etoys · Alice · Scratch · Blockly · App Inventor · Snap!</span></div>`, b(1) + .3, be(1) + .3);
  // Weintrop
  const ch = show(c, box(120, 250, 1100, `<div class="ttl">积木班 vs 文本班（Weintrop &amp; Wilensky 2019）</div><div class="cap" style="margin:6px 0 20px">两个高中班，前 5 周分别用积木 / 文本，之后一起学 Java · 平均成绩（%）</div>
    <div class="bars">${barRow('第 5 周 · 积木班', 66.6, 80, '66.6', 'var(--edit)')}${barRow('第 5 周 · 文本班', 58.8, 80, '58.8', 'var(--ink3)')}<div style="height:10px"></div>${barRow('第 15 周 · 积木班', 64.9, 80, '64.9', 'var(--edit)')}${barRow('第 15 周 · 文本班', 64.7, 80, '64.7', 'var(--ink3)')}</div>`), b(2) + .2, be(3) + .3);
  bars(c, ch, b(2) + 1.5, .5);
  show(c, box(1270, 250, 530, `<div class="ttl">积木班的自信心</div><p class="p">在转向 Java 后显著下降</p><div class="cap" style="margin-top:14px">样本 60 人，选拔性学校；作者措辞谨慎</div>`), b(2) + 9, be(3) + .3);
  show(c, box(1270, 560, 530, `<div class="ttl">适合当入口</div><p class="p">不一定能当成通往文本的台阶；研究转向可来回切换的混合编辑器。</p>`), b(3) + .5, be(3) + .3);
});

S('a_w4', c => {
  const { b, be } = c;
  c.head('07', '第四波', '投影式编辑 · 1990s–');
  // 模型 → 投影
  const P = c.el(`<div class="abs" style="left:120px;top:260px;width:1100px;height:600px">
    <svg class="abs" width="1100" height="600"><g stroke="#B9AEDD" stroke-width="3" fill="none" class="pl">${[[220, 90], [880, 90], [220, 510], [880, 510]].map(([x, y]) => `<path d="M550 300 L${x} ${y}"/>`).join('')}</g></svg>
    <div class="node op" style="left:550px;top:300px;background:var(--both);border-color:var(--both);height:90px;font-size:32px;padding:0 30px">模型（AST）</div>
    ${[['文本', 220, 90], ['表格', 880, 90], ['公式', 220, 510], ['图', 880, 510]].map(([t, x, y]) => `<div class="node pj" style="left:${x}px;top:${y}px;border-color:var(--both);color:var(--both);font-family:var(--sans)">${t}</div>`).join('')}</div>`);
  c.in(P, b(0) + .2); c.out(P, be(0) + .3); c.stagger(P.querySelectorAll('.pj'), b(0) + 2, .4, { dy: 0, scale: .6 });
  show(c, `<div class="abs tl" style="left:1260px;top:270px;width:540px">${tlrow('1990s', '意图编程', '西蒙尼在微软提出，后成立 Intentional Software', 'both')}${tlrow('2003–', 'JetBrains MPS', '投影式语言工作台', 'both')}</div>`, b(0) + 6, be(0) + .3);
  // Berger
  show(c, box(120, 250, 1680, `<div class="ttl">Berger 等 · FSE 2016 · MPS 对照实验</div><div class="cap" style="margin-top:6px">19 人：14 名研究生随机分组 + 5 名有经验的工业开发者</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:26px">
      <div><div class="pill t-ok" style="font-size:22px">基础编辑</div><p class="p" style="font-size:28px">45 分钟培训后，与文本编辑器<b>无显著差别</b></p></div>
      <div><div class="pill t-ok" style="font-size:22px">熟练用户 · 复杂任务</div><p class="p" style="font-size:28px">快约 <b style="font-size:44px">2–3 倍</b>，拼写错误更少，更多用“移动”与重构</p></div></div>`), b(1) + .2, be(1) + .3);
  // 痛点
  const pain = [['删除', '光标位置难预测，容易删多'], ['选择', '视觉相邻、但不是兄弟节点的代码难以一起选中'], ['插入', '表达式级的非法插入更多']];
  show(c, `<div class="abs" style="left:120px;top:260px;width:900px;display:flex;flex-direction:column;gap:16px">${pain.map(([a, d]) => `<div class="card pad" style="display:flex;gap:22px;align-items:center"><span class="pill t-bad" style="font-size:24px">${a}</span><span class="p" style="font-size:24px">${d}</span></div>`).join('')}</div>`, b(2) + .3, be(2) + .3);
  show(c, box(1080, 260, 720, `<div class="cap">“视觉上挨着”≠“树里是兄弟”（示意）</div><div class="code" style="margin-top:14px;font-size:34px">a + <span style="background:#5B4A9E;padding:0 6px">b * c</span> + d</div><p class="p" style="margin-top:14px">想选中 <b class="k">c + d</b>？在树里，它们不属于同一个节点。</p>`), b(2) + 4, be(2) + .3);
  // 生态税
  const tools = ['diff', '合并', '代码评审', '搜索', '复制粘贴', '聊天里贴代码'];
  const tax = show(c, `<div class="abs" style="left:120px;top:270px;width:1680px"><div class="ttl" style="font-size:40px;margin-bottom:24px">生态税：不存成文本，就要重做这些</div><div style="display:flex;gap:16px;flex-wrap:wrap">${tools.map(t => `<div class="card pad tx" style="font-size:30px;font-weight:700;position:relative">${t}<svg class="abs x" style="left:0;top:0;opacity:0" width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none"><path d="M1 1 L9 9" stroke="var(--bad)" stroke-width=".5"/></svg></div>`).join('')}</div>
    <div class="p" style="margin-top:36px;font-size:28px">结局：在<b>工业领域专用语言</b>（嵌入式、保险规则等）站稳；没有进入通用编程。</div></div>`, b(3) + .2, be(3) + .3);
  c.stagger(tax.querySelectorAll('.tx'), b(3) + 1, .35, { dy: 10 });
  [...tax.querySelectorAll('.x')].forEach((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], b(3) + 4 + i * .3, .3));
  // 同类尝试
  show(c, `<div class="abs tl" style="left:120px;top:250px;width:560px">${tlrow('2010s', 'Lamdu · Unison', '树 / 哈希寻址定义', 'both')}${tlrow('2017–24', 'Darklang', '每次按键直接改语法树', 'both')}${tlrow('2012–', 'Cirru → Calcit Editor', '树编辑器；按定义逐屏、表达式自动排成块、多端同步', 'both')}</div>`, b(4) + .2);
  show(c, fig('calcit_expr', 730, 250, 520, 360, 'Calcit Editor · 表达式自动布局', { dark: true }), b(4) + 5);
  show(c, fig('hovenia_doc', 1280, 250, 520, 360, 'Hovenia · Canvas 树布局', { dark: true }), b(4) + 8);
  show(c, fig('calcit_defs', 730, 640, 520, 290, 'Calcit Editor · 定义依赖树', { dark: true }), b(4) + 6.5);
  src(c, '实验数据：Berger et al., FSE 2016');
});

S('a_w5', c => {
  const { b, be } = c;
  c.head('08', '第五波', '结构沉到文本底下 · 2005–');
  show(c, `<div class="abs bet" style="left:120px;top:240px"><span class="pill">押注</span>别换掉文本，在文本下面加一棵随时可用的树</div>`, b(0) + .2, be(0) + .3);
  // paredit 演示：吞并
  const pe = show(c, box(120, 330, 1000, `<div class="cap">paredit：括号始终配平，按表达式操作（示意）</div><div class="code" style="margin-top:14px;font-size:36px"><span class="s1">(foo (bar a) b c)</span></div><div class="p st" style="margin-top:12px">向前吞并：把 <b class="k">b</b> 吞进 <b class="k">(bar a)</b></div>`), b(0) + 1, be(0) + .3);
  c.tick(t => { const v = t > b(0) + 6 ? '(foo (bar a b) c)' : '(foo (bar a) b c)'; const e = pe.querySelector('.s1'); if (e._v !== v) { e._v = v; e.textContent = v; } });
  show(c, fig('emacs', 1180, 330, 620, 560, 'GNU Emacs · paredit 的宿主'), b(0) + 3, be(0) + .3);
  // 格式化：文本 → 树 → 文本
  const steps = [['乱排的文本', 'let x={a:1,\n   b:[1,2 ,3]}'], ['语法树', '对象\n├ a: 1\n└ b: 数组[1, 2, 3]'], ['按规则打印', 'let x = {\n  a: 1,\n  b: [1, 2, 3],\n};']];
  const fm = show(c, `<div class="abs" style="left:120px;top:270px;width:1680px;display:grid;grid-template-columns:1fr 60px 1fr 60px 1fr;align-items:center;gap:10px">${steps.map(([t, code], i) => `<div class="fs"><div class="cap" style="margin-bottom:8px">${t}</div><pre class="code" style="margin:0;font-size:26px;height:230px">${code}</pre></div>${i < 2 ? '<div style="font-size:48px;color:var(--ink3);text-align:center">→</div>' : ''}`).join('')}</div>`, b(1) + .2, be(1) + .3);
  c.stagger(fm.querySelectorAll('.fs'), b(1) + .5, 2.2, { dy: 10 });
  show(c, box(120, 620, 1680, `<div class="p" style="font-size:28px"><b>gofmt（2009）· Prettier（2017）</b>：格式由语法树重新打印 —— 投影式编辑的一次悄悄的胜利，只是投影的结果恰好还是文本。</div>`), b(1) + 7, be(1) + .3);
  // 基础设施
  show(c, `<div class="abs tl" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:14px">${[['2016', '语言服务器协议（LSP）', '把理解代码的能力从编辑器抽出来'], ['2018', 'tree-sitter', '增量、容错解析；高亮、折叠、选区按树工作'], ['2010s–', 'Semgrep · ast-grep · Comby', '按语法搜索与改写'], ['2010s–', 'OpenRewrite', '在无损语义树上做大规模重构'], ['2020s', 'difftastic', '按语法比较差异'], ['2024', 'Mergiraf', '按语法树合并']].map(r => tlrow(...r, 'edit')).join('')}</div>`, b(2) + .2, be(2) + .3);
  // 成就与前沿
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px">${gainLoss('几乎每个现代编辑器都在后台维护语法树，用户仍觉得在编辑文本', '结构只是辅助，不能保证中间状态有意义', '研究前沿：像文本一样流畅的结构编辑')}</div>`, b(3) + .2);
  show(c, box(120, 560, 820, `<div class="cap">Hazel（2017）· 带类型洞的程序（示意）</div><div class="code" style="margin-top:12px;font-size:25px;white-space:nowrap">let area = fun r -> 3.14 * r * <span style="border:2px dashed #8EC5FF;padding:0 10px;border-radius:6px">?</span><span style="color:#7F8794"> : Float</span></div><p class="p" style="margin-top:10px">没写完的地方是一个有类型的洞，程序每一步都可分析</p>`), b(3) + 6);
  show(c, box(980, 560, 820, `<div class="ttl">Pantograph（POPL 2025）</div><p class="p">追求“流畅且有类型”的结构编辑；同类研究还有 tylr</p>`), b(3) + 9);
});

S('a_vis', c => {
  const { b, be } = c;
  c.head('09', '可视化', '四次转向');
  const turns = ['画结构', '放映算法', '俯瞰全局', '看见运行'];
  const tn = show(c, `<div class="abs" style="left:120px;top:236px;display:flex;gap:12px">${turns.map((t, i) => `<span class="pill tv" style="font-size:22px">${i + 1} · ${t}</span>`).join('')}</div>`, b(0) + .1);
  const pills = [...tn.querySelectorAll('.tv')];
  c.tick(t => { const k = t < b(1) ? 0 : t < b(2) ? 1 : t < b(3) ? 2 : 3; pills.forEach((p, i) => { const on = i === k; if (p._on !== on) { p._on = on; p.className = 'pill tv ' + (on ? 't-vis' : ''); } }); });
  // 1 画结构
  show(c, fig('ns', 120, 310, 560, 380, '1973 · Nassi–Shneiderman 结构图'), b(0) + .5, be(0) + .3);
  show(c, fig('uml', 710, 310, 520, 380, '1997 · UML 类图'), b(0) + 2.5, be(0) + .3);
  show(c, fig('cfg', 1260, 310, 540, 380, '控制流图'), b(0) + 4, be(0) + .3);
  show(c, `<div class="abs p" style="left:120px;top:720px;width:1680px;font-size:26px">结局：设计文档里活着，代码里没人维护 —— <b>图和代码很快就对不上</b></div>`, b(0) + 8, be(0) + .3);
  // 2 放映算法：排序赛跑
  const cv = show(c, `<div class="abs card" style="left:120px;top:310px;width:1100px;height:560px;padding:20px"><div class="cap">排序算法同屏赛跑（示意，致敬 1981 年的《Sorting Out Sorting》）</div><canvas width="1060" height="490"></canvas></div>`, b(1) + .2, be(1) + .3).querySelector('canvas');
  const N = 40, base = Array.from({ length: N }, (_, i) => i + 1); let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  const rec = alg => { const a = base.slice(), fr = [a.slice()]; alg(a, () => fr.push(a.slice())); return fr; };
  const bub = rec((a, f) => { for (let i = 0; i < a.length; i++) for (let j = 0; j < a.length - 1 - i; j++) if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; f(); } });
  const ins = rec((a, f) => { for (let i = 1; i < a.length; i++) for (let j = i; j > 0 && a[j - 1] > a[j]; j--) { [a[j], a[j - 1]] = [a[j - 1], a[j]]; f(); } });
  const qs = rec((a, f) => { const q = (l, r) => { if (l >= r) return; const p = a[r]; let i = l; for (let j = l; j < r; j++) if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; i++; f(); } [a[i], a[r]] = [a[r], a[i]]; f(); q(l, i - 1); q(i + 1, r); }; q(0, a.length - 1); });
  const g = cv.getContext('2d'), algs = [['冒泡排序', bub], ['插入排序', ins], ['快速排序', qs]], T0 = b(1) + 1, DUR = Math.max(6, c.sc.beats[1].d - 3);
  c.tick(t => {
    g.clearRect(0, 0, 1060, 490); const u = Math.max(0, Math.min(1, (t - T0) / DUR));
    algs.forEach(([name, fr], k) => {
      const x0 = k * 355, a = fr[Math.min(fr.length - 1, Math.floor(u * bub.length))]; g.fillStyle = '#7D838D'; g.font = '22px Inter, Noto Sans CJK SC'; g.fillText(name, x0 + 4, 26);
      a.forEach((v, i) => { g.fillStyle = k === 2 ? '#1F5FA8' : '#B5651D'; g.fillRect(x0 + i * 8.5, 480 - v * 10.5, 7, v * 10.5); });
    });
  });
  show(c, `<div class="abs tl" style="left:1260px;top:310px;width:540px">${tlrow('1981', 'Sorting Out Sorting', '九种排序同屏赛跑', 'vis')}${tlrow('1984 · 1990', 'BALSA · Tango', '算法动画系统', 'vis')}${tlrow('2010', 'Python Tutor', '逐步展示变量、栈和堆', 'vis')}</div>`, b(1) + 4, be(1) + .3);
  // 3 俯瞰全局
  show(c, fig('treemap', 120, 300, 520, 360, '1991 · 树图（示例：磁盘占用）'), b(2) + .2, be(2) + .3);
  const ss = show(c, `<div class="abs card" style="left:670px;top:300px;width:520px;height:360px;padding:16px"><div class="cap">SeeSoft 式视图（示意）：每行代码一条细线</div><canvas width="488" height="300"></canvas></div>`, b(2) + 3, be(2) + .3).querySelector('canvas');
  { const g2 = ss.getContext('2d'); let s2 = 3; const r2 = () => (s2 = s2 * 16807 % 2147483647) / 2147483647; const pal = ['#D7DCE3', '#9DB3D3', '#1F5FA8', '#E0A06A', '#B5651D'];
    for (let col = 0; col < 12; col++) { let y = 0; const L = 140 + r2() * 140; while (y < L) { const len = 10 + r2() * 40, ci = Math.floor(r2() * r2() * 5); g2.fillStyle = pal[ci]; for (let k = 0; k < 6 && y < L; k++, y += 2) g2.fillRect(col * 40 + 4, y + 4, 8 + r2() * 26, 1.3); } } }
  show(c, fig('codecharta', 1220, 300, 580, 360, '软件城市（CodeCharta）'), b(2) + 6, be(2) + .3);
  const dn = show(c, box(120, 690, 1680, `<div style="display:flex;align-items:center;gap:30px"><svg width="120" height="120" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#E6E8E3" stroke-width="6"/><circle class="ring" cx="21" cy="21" r="15.9" fill="none" stroke="var(--bad)" stroke-width="6" stroke-dasharray="62 38" stroke-dashoffset="25"/></svg><div><div style="font:800 56px var(--serif)">约 62%</div><div class="p">Merino 等梳理 181 篇 SOFTVIS / VISSOFT 论文：没有任何评估</div></div></div>`), b(2) + 9, be(2) + .3);
  // 4 看见运行：火焰图
  const fg = show(c, `<div class="abs card" style="left:120px;top:300px;width:1000px;height:440px;padding:18px"><div class="cap">火焰图（2011，示意）：宽度 = 耗时占比</div><svg width="964" height="380" class="fl"></svg></div>`, b(3) + .2).querySelector('.fl');
  { const F = [[0, 1, 'main'], [0, .62, 'handle'], [.62, 1, 'render'], [0, .4, 'parse'], [.4, .6, 'query'], [.62, .8, 'layout'], [.8, .98, 'paint'], [0, .3, 'tokenize'], [.42, .58, 'db.read'], [.64, .76, 'measure']];
    const lv = [0, 1, 1, 2, 2, 2, 2, 3, 3, 3], col = ['#E9C46A', '#F4A261', '#E76F51', '#F4A261', '#E9C46A'];
    fg.innerHTML = F.map(([a, z, n], i) => `<g><rect x="${a * 964 + 1}" y="${320 - lv[i] * 56}" width="${(z - a) * 964 - 2}" height="50" rx="4" fill="${col[i % 5]}"/><text x="${a * 964 + 10}" y="${352 - lv[i] * 56}" font-size="20" font-family="DejaVu Sans Mono">${n}</text></g>`).join('');
    c.stagger(fg.querySelectorAll('g'), b(3) + .6, .15, { dy: 0 }); }
  show(c, `<div class="abs tl" style="left:1160px;top:300px;width:640px">${tlrow('1988 → 2014', 'Mathematica → Jupyter', '笔记本：代码与结果交替呈现', 'vis')}${tlrow('2010', 'Code Bubbles', '以函数为单位的工作区', 'both')}${tlrow('2012', 'Bret Victor · Light Table', '写的同时看到结果', 'both')}</div>`, b(3) + 3);
  show(c, `<div class="abs p" style="left:120px;top:760px;width:1680px;font-size:26px">结局：小而专的视图成了标配；宏大的实时编程环境，多数停在原型</div>`, b(3) + 9);
  src(c, '图：Wikimedia Commons · 评估比例：Merino et al. 系统综述');
});

S('a_end', c => {
  const { b } = c;
  c.head('10', '上集小结', '');
  const W = [['第一波', '正确性优先'], ['第二波', '绕开文本'], ['第三波', '形状即语法'], ['第四波', '投影式编辑'], ['第五波', '结构沉到文本底下']];
  const V = ['画结构', '放映算法', '俯瞰全局', '看见运行'];
  const g = show(c, `<div class="abs" style="left:120px;top:270px;width:1680px"><div class="cap" style="margin-bottom:12px">结构化编辑</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px">${W.map(([a, d]) => `<div class="card pad w" style="border-top:6px solid var(--edit)"><div class="cap">${a}</div><div class="ttl" style="margin-top:6px">${d}</div></div>`).join('')}</div>
    <div class="cap" style="margin:34px 0 12px">代码可视化</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${V.map(a => `<div class="card pad w" style="border-top:6px solid var(--vis)"><div class="ttl">${a}</div></div>`).join('')}</div>
    <div class="p" style="margin-top:40px;font-size:28px">下一集：放进同一张表，用四个问题去量 → <b>八条规律</b></div></div>`, b(0) + .1);
  c.stagger(g.querySelectorAll('.w'), b(0) + .5, .5, { dy: 12 });
});
