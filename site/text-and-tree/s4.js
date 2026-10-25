// 番外 · 结构化编辑器怎么编辑
const keyc = t => `<span style="display:inline-block;font:700 22px var(--mono);background:#fff;border:2px solid var(--ink);border-bottom-width:5px;border-radius:8px;padding:2px 12px;margin:0 3px;color:var(--ink)">${t}</span>`;
const MAP = (o, os, n, ns) => `<div class="map2"><div class="o"><small>旧想法</small><b>${o}</b><span>${os}</span></div><div class="ar">→</div><div class="n"><small>新方案</small><b>${n}</b><span>${ns}</span></div></div>`;
const hole = (t = '') => `<span style="display:inline-block;min-width:40px;border:2px dashed #8EC5FF;border-radius:6px;padding:0 8px;color:#8EC5FF">${t || '&nbsp;'}</span>`;
// 文本在某时刻切换
function swapText(c, el, steps) { c.tick(t => { let v = steps[0][1]; for (const [at, s] of steps) if (t >= at) v = s; if (el._v !== v) { el._v = v; el.innerHTML = v; } }); }

S('d_open', c => {
  const { b, be } = c;
  show(c, `<div class="abs" style="left:120px;top:160px"><div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">文本与树 · 番外</div><div style="font:900 96px/1.15 var(--serif);margin-top:12px">结构化编辑器<br>怎么编辑</div></div>`, .1, be(0) + .2);
  show(c, box(120, 620, 1100, `<div class="p"><b>AI 根据公开资料整理。</b>操作细节来自各项目的论文、手册和源码；画面中的演示均为示意。</div>`), b(0) + 3, be(0) + .2);
  const T = [['插入', '加一段新代码'], ['包裹', '把表达式包进另一个表达式'], ['选择', '选中一段代码'], ['移动', '挪到别处'], ['删除', '删掉一部分']];
  const g = show(c, `<div class="abs" style="left:120px;top:260px;width:1680px"><div class="ttl" style="font-size:40px;margin-bottom:26px">同一组小任务</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:18px">${T.map(([a, d], i) => `<div class="card pad tk" style="border-top:6px solid var(--edit)"><div class="k cap">0${i + 1}</div><div class="ttl" style="font-size:40px;margin:8px 0">${a}</div><p class="p">${d}</p></div>`).join('')}</div></div>`, b(1) + .2);
  c.stagger(g.querySelectorAll('.tk'), b(1) + .5, .5, { dy: 12 });
});

S('d_axes', c => {
  const { b, be } = c;
  c.head('01', '三个观察点', '');
  const A = [['光标落在哪里', '字符之间，还是节点上'], ['新代码怎么进来', '逐字敲入、选模板、还是从菜单挑'], ['中间状态允许什么', '必须合法？还是标记、隔离不合法的部分']];
  const g = show(c, `<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px">${A.map(([a, d], i) => `<div class="card pad ob" style="border-top:6px solid ${i === 2 ? 'var(--bad)' : 'var(--edit)'}"><div class="k cap">${i + 1}</div><div class="ttl" style="font-size:36px;margin:8px 0">${a}</div><p class="p">${d}</p></div>`).join('')}</div>`, b(0) + .1, be(1) + .3);
  const obs = [...g.querySelectorAll('.ob')]; c.in(obs[0], b(0) + .5); c.in(obs[1], b(0) + 4); c.in(obs[2], b(1) + .3);
  c.anim(obs[2], [{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }], b(1) + 1, .6);
  // 文本编辑器基准
  const tx = show(c, box(120, 260, 1100, `<div class="cap">基准：文本编辑器</div><div class="code" style="margin-top:14px;font-size:36px">x = a + <span class="er"></span><span style="opacity:.6">▌</span></div><div class="p" style="margin-top:16px">光标在字符之间 · 什么都能敲 · 错误由后台解析器标出，但不会被阻止</div>`), b(2) + .2);
  swapText(c, tx.querySelector('.er'), [[0, ''], [b(2) + 2, 'b *'], [b(2) + 4, '<span style="text-decoration:underline wavy #E06C5C">b *</span>']]);
});

S('d_cps', c => {
  const { b, be } = c;
  c.head('02', '康奈尔程序合成器', '模板 + 短语 · 1981');
  const tp = show(c, box(120, 260, 900, `<div class="cap">按一个键，插入整条语句的骨架（示意）</div><div style="margin:14px 0">${keyc('.if')}</div><div class="code tpl" style="font-size:34px;line-height:1.7"></div>`), b(0) + .2);
  swapText(c, tp.querySelector('.tpl'), [[0, '▌'], [b(0) + 3, `IF ${hole('condition')}<br>THEN ${hole('statement')}<br>ELSE ${hole('statement')}`], [b(1) + 4, `IF <span style="color:#9DE29D">x &gt; 0</span> ✓<br>THEN ${hole('statement')}<br>ELSE ${hole('statement')}`]]);
  show(c, box(1080, 260, 720, `<div class="ttl">模板 = 结构</div><p class="p">不会打错；不能改，只能整体增删</p>`), b(0) + 6);
  show(c, box(1080, 470, 720, `<div class="ttl">短语 = 文本</div><p class="p">变量、表达式由人逐字输入，<b>一输入就立刻解析</b>，错误当场标出</p>`), b(1) + 1);
  show(c, box(120, 700, 1680, `<div class="quote" style="font-size:32px">“模板不能改，只能整体增删；能改的是短语。”<small>Teitelbaum &amp; Reps, CACM 1981（大意）· 骨架用结构，细节用文本</small></div>`), b(1) + 6);
});

S('d_lisp', c => {
  const { b, be } = c;
  c.head('03', 'Interlisp', '在树上走动的命令');
  const tty = show(c, `<div class="abs code" style="left:120px;top:260px;width:820px;height:600px;font-size:28px;line-height:1.6;background:#15181D"><div class="cm">EDITF(APPEND)</div><div class="ln"></div></div>`, b(0) + .2);
  const lines = [[b(0) + 2, '*P', '(LAMBDA (X) Y (COND & &))'], [b(0) + 5, '*2 P', '(X)'], [b(0) + 8, '*0 -1 P', '(COND (& Z) (T &))'], [b(1) + 1, '*(3)', '删除第三个元素'], [b(1) + 4, '*(2 (X Y))', '替换第二个元素'], [b(1) + 8, '*(RI 2 2)', '移动右括号']];
  const ln = tty.querySelector('.ln');
  c.tick(t => { const n = lines.filter(l => t >= l[0]).length; if (ln._n !== n) { ln._n = n; ln.innerHTML = lines.slice(0, n).map(([_, a, r]) => `<div><span style="color:#F0B86E">${a}</span></div><div style="color:#9DB3D3;padding-left:20px">${r}</div>`).join(''); } });
  show(c, box(1000, 260, 800, `<div class="ttl">当前表达式</div><p class="p">数字 <b class="k">n</b> 进入第 n 个元素 · <b class="k">0</b> 退回上一层 · <b class="k">P</b> 打印</p>`), b(0) + 3, be(0) + .3);
  const ri = show(c, box(1000, 260, 800, `<div class="ttl">移动括号，而不是重打内容</div><div class="code ri" style="margin-top:14px;font-size:28px"></div><p class="p" style="margin-top:10px">Y 不用重新输入，括号永远不会失衡</p>`), b(1) + 7);
  swapText(c, ri.querySelector('.ri'), [[0, '(APPEND (CDR X Y))'], [b(1) + 10, '(APPEND (CDR X) Y)']]);
  src(c, '例子来自 Interlisp 参考手册（编辑器一章）');
});

S('d_paredit', c => {
  const { b, be } = c;
  c.head('04', 'paredit', '在文本上做树操作');
  const p1 = show(c, box(120, 260, 1680, `<div class="cap">敲左括号，自动得到一对；删除时不允许只删一半</div><div class="code pa" style="margin-top:14px;font-size:40px"></div>`), b(0) + .2, be(0) + .3);
  swapText(c, p1.querySelector('.pa'), [[0, '(defn f [x] ▌)'], [b(0) + 3, '(defn f [x] (▌))'], [b(0) + 5, '(defn f [x] (inc x▌))']]);
  const p2 = show(c, box(120, 260, 1680, `<div style="display:flex;gap:30px;align-items:center"><div style="flex:1"><div class="cap">吞并（slurp）${keyc('C-)')}</div><div class="code sl" style="margin-top:14px;font-size:40px"></div></div></div>
    <div style="margin-top:30px"><div class="cap">吐出（barf）${keyc('C-}')}</div><div class="code bf" style="margin-top:14px;font-size:40px"></div></div>`), b(1) + .2);
  swapText(c, p2.querySelector('.sl'), [[0, '(* 10 20▌) (+ 30 40)'], [b(1) + 4, '(* 10 20▌ (+ 30 40))']]);
  swapText(c, p2.querySelector('.bf'), [[0, '(* 10 20▌ (+ 30 40))'], [b(1) + 8, '(* 10 20▌) (+ 30 40)']]);
  show(c, `<div class="abs p" style="left:120px;top:760px;font-size:26px">改变结构 = 移动括号 —— 和 Interlisp 的括号命令一脉相承</div>`, b(1) + 10);
  src(c, '按键：paredit 默认键位');
});

S('d_blocks', c => {
  const { b, be } = c;
  c.head('05', '积木', '拖拽与插槽');
  show(c, fig('scratch', 120, 260, 820, 560, 'Scratch 3.0'), b(0) + .2);
  const dz = show(c, `<div class="abs" style="left:1000px;top:280px;width:800px;height:500px">
    <div class="blk" style="left:0;top:40px;background:#4C97FF;width:520px">移动 <i style="min-width:90px;display:inline-block">&nbsp;</i> 步</div>
    <div class="blk dr" style="left:120px;top:300px;background:#59C059">10 × 2</div>
    <div class="cap" style="position:absolute;left:0;top:420px;width:760px">插槽形状决定能放什么：数值槽放不进语句块</div></div>`, b(0) + 2);
  c.anim(dz.querySelector('.dr'), [{ transform: 'translate(0,0)' }, { transform: 'translate(0px,-252px)' }], b(0) + 5, 1.2, 'io');
  show(c, `<div class="abs" style="left:1000px;top:640px;width:800px;display:flex;flex-direction:column;gap:12px">${[['t-ok', '几乎不可能写出语法错误'], ['t-bad', '每个动作都要精确拖放'], ['t-bad', '程序一长，找位置本身成了负担']].map(([k, t]) => `<span class="pill ${k}" style="font-size:23px">${t}</span>`).join('')}</div>`, b(1) + .3);
});

S('d_mps', c => {
  const { b, be } = c;
  c.head('06', 'JetBrains MPS', '单元格、补全与后缀变换');
  const ce = show(c, box(120, 260, 1000, `<div class="cap">看起来像文本，其实是一格一格的单元格（示意）</div><div class="code" style="margin-top:14px;font-size:32px;line-height:1.8">int <span style="outline:2px solid #8EC5FF">count</span> = <span class="cl" style="outline:2px dashed #8EC5FF;padding:0 6px">&lt;no initializer&gt;</span>;</div>
    <div class="pop" style="margin-top:10px;background:#fff;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.15);width:420px;padding:8px 0;font:22px var(--mono)">${['0', 'list.size()', 'new int[]'].map(x => `<div style="padding:6px 16px">${x}</div>`).join('')}<div class="cap" style="padding:4px 16px;font-size:16px">${'Ctrl+Space：只列出此处合法的选项'}</div></div>`), b(0) + .2, be(0) + .3);
  c.in(ce.querySelector('.pop'), b(0) + 5, { dy: 8 });
  show(c, box(1170, 260, 630, `<div class="ttl">按键</div><p class="p">${keyc('Tab')} 单元格间跳转<br>${keyc('Ctrl+Space')} 补全<br>${keyc('Alt+Enter')} 意图操作<br>${keyc('Ctrl+↑')} 沿语法树扩大选区</p>`), b(0) + 3, be(1) + .3);
  const pf = show(c, box(120, 260, 1000, `<div class="cap">后缀变换：在表达式后接着输入关键字（示意）</div><div class="code pf" style="margin-top:14px;font-size:32px;line-height:1.7"></div>`), b(1) + .2, be(1) + .3);
  swapText(c, pf.querySelector('.pf'), [[0, 'x &gt; 0▌'], [b(1) + 3, 'x &gt; 0<span style="color:#F0B86E">if</span>▌'], [b(1) + 5, '<span class="kw">if</span> (x &gt; 0) {<br>&nbsp;&nbsp;▌<br>}'], [b(1) + 9, '<span class="kw">if</span> (<span style="background:#3B4D6B">x &gt; 0</span>) {<br>&nbsp;&nbsp;<br>}  <span class="cm">← Ctrl+↑ 扩大选区</span>']]);
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div class="card pad" style="border-top:6px solid var(--ok)"><div class="ttl">快</div><p class="p">熟练用户在复杂任务上比新手快两到三倍，更多使用移动与重构</p></div>
    <div class="card pad" style="border-top:6px solid var(--bad)"><div class="ttl">难</div><p class="p">删除时光标位置难以预测；视觉相邻但不是兄弟节点的代码难以一起选中</p></div></div>`, b(2) + .2);
  src(c, '按键：MPS 文档「Commanding the editor」· 实验：Berger et al., FSE 2016');
});

S('d_stride', c => {
  const { b, be } = c;
  c.head('07', 'Stride', '框架式编辑（BlueJ / Greenfoot）');
  const fr = (y, kw, slot, ind = 0) => `<div style="margin-left:${ind * 50}px;margin-bottom:12px;border:2px solid #C9A86A;background:#FBF3E2;border-radius:10px;padding:12px 16px;font:26px var(--mono)"><b style="color:#8A5A12">${kw}</b> ${slot}</div>`;
  const f = show(c, `<div class="abs" style="left:120px;top:260px;width:900px">${fr(0, 'var', '<span style="background:#fff;padding:2px 8px;border-radius:4px">score = 0</span>')}${fr(0, 'if', '<span style="background:#fff;padding:2px 8px;border-radius:4px">isTouching(Food.class)</span>')}<div class="fi">${fr(0, 'call', '<span style="background:#fff;padding:2px 8px;border-radius:4px">eat()</span>', 1)}</div></div>`, b(0) + .2);
  c.in(f.querySelector('.fi'), b(0) + 4, { dy: 10 });
  show(c, box(1080, 260, 720, `<div class="ttl">框架 = 结构</div><p class="p">整块插入、移动（键盘或鼠标）</p><div class="ttl" style="margin-top:18px">槽位 = 文本</div><p class="p">表达式按普通文本输入</p>`), b(0) + 2);
  show(c, `<div class="abs" style="left:120px;top:660px;width:1680px">${MAP('康奈尔程序合成器（1981）', '模板 + 短语', 'Stride（2015）', '框架 + 槽位：定位为从积木到文本的过渡')}</div>`, b(1) + .3);
});

S('d_calcit', c => {
  const { b, be } = c;
  c.head('08', 'Calcit Editor', '键盘驱动的树');
  show(c, fig('calcit_expr', 120, 250, 900, 600, '每屏一个定义 · 表达式按嵌套自动排成块', { dark: true }), b(0) + .2, be(0) + .3);
  show(c, box(1070, 260, 730, `<div class="ttl">两种节点</div><p class="p"><b>叶子</b>：一个词，打字只发生在这里<br><b>表达式</b>：叶子与表达式的列表</p>`), b(0) + 4, be(0) + .3);
  // 键位表 + 树演示
  const K = [['Space', '后面插入新叶子'], ['Enter', '后面插入新表达式（表达式上）'], ['Shift', '+ 上面两者：插在前面'], ['Tab', '包一层'], ['Shift+Tab', '拆开'], ['Backspace', '删除节点'], ['方向键', '父子 / 兄弟间移动'], ['Cmd+Opt+←', '与左兄弟交换']];
  const kt = show(c, `<div class="abs" style="left:120px;top:250px;width:860px;display:flex;flex-direction:column;gap:10px">${K.map(([k, d]) => `<div class="card kr" style="display:flex;align-items:center;gap:18px;padding:10px 18px">${keyc(k)}<span class="p" style="font-size:23px">${d}</span></div>`).join('')}</div>`, b(1) + .2, be(1) + .3);
  c.stagger(kt.querySelectorAll('.kr'), b(1) + .5, 1.2, { dy: 8 });
  const tr = show(c, box(1040, 250, 760, `<div class="cap">示意：对叶子 b 按 Tab（包一层），再按 Space 加叶子</div><div class="code tv" style="margin-top:16px;font-size:34px;line-height:1.6"></div>`), b(1) + 2, be(1) + .3);
  swapText(c, tr.querySelector('.tv'), [[0, '(+ a <span style="background:#3B4D6B">b</span>)'], [b(1) + 7, '(+ a (<span style="background:#3B4D6B">b</span>))'], [b(1) + 10, '(+ a (b <span style="background:#3B4D6B">▌</span>))'], [b(1) + 13, '(+ a (b c))']]);
  const P = ['插入', '包裹', '拆开', '删除', '移动', '交换'];
  show(c, `<div class="abs" style="left:120px;top:300px;width:1680px"><div class="ttl" style="font-size:38px;margin-bottom:24px">一套最小的结构编辑原语</div><div style="display:flex;gap:16px">${P.map(t => `<div class="card pad" style="font:700 36px var(--serif)">${t}</div>`).join('')}</div><p class="p" style="margin-top:30px;font-size:28px">2025–26 年：编辑器弃用，改为给智能体用的命令行 ↓</p></div>`, b(2) + .3, be(2) + .3);
  const M = [['方向键 ↑ / ↓', 'calcit cursor move parent / child'], ['Tab（包一层）', 'calcit cursor apply wrap --code …'], ['替换节点', 'calcit tree replace &lt;def&gt; --path @1.2.0'], ['Cmd+Opt+←（交换）', 'calcit tree swap &lt;def&gt; --with next'], ['', '写入带 --expect 预期内容与版本校验']];
  const mt = show(c, `<div class="abs" style="left:120px;top:250px;width:1680px;display:flex;flex-direction:column;gap:12px">${M.map(([k, cmd]) => `<div class="mr" style="display:grid;grid-template-columns:420px 1fr;gap:20px;align-items:center"><div class="card" style="padding:14px 20px;font-size:24px;font-weight:700">${k || '&nbsp;'}</div><div class="code" style="font-size:24px;padding:14px 20px">${cmd}</div></div>`).join('')}</div>`, b(3) + .2);
  c.stagger(mt.querySelectorAll('.mr'), b(3) + 1, 2.4, { dy: 8 });
  src(c, '键位：calcit-lang/editor 源码 · 命令：calcit 文档 edit-tree');
});

S('d_hazel', c => {
  const { b, be } = c;
  c.head('09', 'Hazel', '每一步都有类型');
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${[['移动', '到父节点 / 第 n 个子节点'], ['构造', '在光标处放一个新形状'], ['删除', '留下一个空洞'], ['完成', '移除已一致的非空洞']].map(([a, d]) => `<div class="card pad"><div class="ttl" style="font-size:34px">${a}</div><p class="p">${d}</p></div>`).join('')}</div>`, b(0) + .2, be(0) + .3);
  show(c, box(120, 520, 1680, `<div class="code" style="font-size:32px">let x : Num = ${hole()}   <span class="cm">-- 空洞与任何类型兼容，程序每一步都有类型</span></div>`), b(0) + 6, be(0) + .3);
  const ex = show(c, box(120, 260, 1680, `<div class="cap">由内向外地写（Hazelnut 论文图 2 的例子，示意）</div><div class="code hz" style="margin-top:16px;font-size:40px"></div><p class="p st" style="margin-top:14px"></p>`), b(1) + .2, be(1) + .3);
  swapText(c, ex.querySelector('.hz'), [[0, `incr(${hole('▌')})`], [b(1) + 4, `incr(<span style="border:2px solid #E06C5C;border-radius:6px;padding:0 8px">incr</span>)`], [b(1) + 8, `incr(<span style="border:2px solid #E06C5C;border-radius:6px;padding:0 8px">incr(3)</span>)`], [b(1) + 11, 'incr(incr(3)) ✓']]);
  swapText(c, ex.querySelector('.st'), [[0, '光标在需要数字的位置'], [b(1) + 4, '放入函数 incr：类型不一致 → 包进<b>非空洞</b>，编辑不被拒绝'], [b(1) + 8, '给它加上参数 3'], [b(1) + 11, '“完成”：洞内已一致，移除非空洞']]);
  show(c, box(120, 260, 1680, `<div class="cap">绕过洞继续求值（示意）</div><div class="code" style="margin-top:14px;font-size:32px;line-height:1.7">let total = sum(prices)        <span class="cm">-- 120</span><br>let rate  = ${hole()}            <span class="cm">-- 洞：记录此处上下文</span><br>let tax   = total * rate       <span class="cm">-- 120 * ⦇rate⦈</span></div><p class="p" style="margin-top:14px">填洞之前，就能看到其余部分的运行结果</p>`), b(2) + .2);
  src(c, 'Omar et al., POPL 2017（Hazelnut）· POPL 2019（Live Functional Programming with Typed Holes）');
});

S('d_tylr', c => {
  const { b, be } = c;
  c.head('10', 'tylr', '像文本一样选择');
  const tl = show(c, box(120, 260, 1680, `<div class="cap">选区周围，树被拆成一串线性拼块（示意）</div><div style="display:flex;gap:8px;margin-top:20px;font:32px var(--mono)">${['let', 'x', '=', '1', '+', '2', 'in', 'x', '*', '3'].map((t, i) => `<span class="tile" style="padding:10px 16px;border-radius:8px;background:${i >= 3 && i <= 5 ? '#3B4D6B;color:#fff' : '#E5EDF8;color:#1F5FA8'}">${t}</span>`).join('')}</div><p class="p" style="margin-top:18px">从任意位置拖选到任意位置；编辑后重新组装成树，缺的部分自动补洞</p>`), b(0) + .2);
  c.stagger(tl.querySelectorAll('.tile'), b(0) + .6, .25, { dy: 8 });
  show(c, box(120, 560, 1680, `<div class="ttl">实验室研究：与文本编辑器、MPS 对比</div><p class="p">参与者经常使用灵活选择；一些修改任务比 MPS 快，少数比文本快；作者承认当前设计仍有局限</p>`), b(1) + .3);
  src(c, 'Moon, Blinn, Omar · tylr（TyDe 2022）');
});

S('d_panto', c => {
  const { b, be } = c;
  c.head('11', 'Pantograph', '剪下一段上下文 · POPL 2025');
  const z = show(c, box(120, 260, 1680, `<div class="cap">选区 = 带一个洞的上下文（示意）</div><div class="code zp" style="margin-top:16px;font-size:38px"></div><p class="p st2" style="margin-top:14px"></p>`), b(0) + .2, be(0) + .3);
  swapText(c, z.querySelector('.zp'), [[0, 'render(<span style="background:#5B4A9E;padding:0 6px">wrap(</span>item<span style="background:#5B4A9E;padding:0 6px">, style)</span>)'], [b(0) + 6, 'render(item)'], [b(0) + 10, 'render(item) &nbsp;&nbsp; <span class="cm">剪贴板：wrap(⦇ ⦈, style)</span>'], [b(0) + 14, 'log(<span style="background:#5B4A9E;padding:0 6px">wrap(</span>msg<span style="background:#5B4A9E;padding:0 6px">, style)</span>)']]);
  swapText(c, z.querySelector('.st2'), [[0, '选中外壳 wrap(⦇ ⦈, style)'], [b(0) + 6, '剪下外壳：里面的内容自动顶上去'], [b(0) + 14, '贴到别处：套在光标处的表达式外面']]);
  const td = show(c, box(120, 260, 1680, `<div class="cap">类型变化沿程序传播（示意）</div><div class="code tt" style="margin-top:16px;font-size:32px;line-height:1.7"></div>`), b(1) + .2, be(1) + .3);
  swapText(c, td.querySelector('.tt'), [[0, 'let area = fun w -> w * w<br>area(3) + area(4)'], [b(1) + 4, 'let area = fun w <span style="color:#F0B86E">h</span> -> w * h<br>area(3)<span style="color:#F0B86E">(⦇ ⦈)</span> + area(4)<span style="color:#F0B86E">(⦇ ⦈)</span>']]);
  show(c, box(120, 600, 1680, `<p class="p" style="font-size:26px">修不了的地方留下<b>可见的错误边界</b>，程序始终保持合法</p>`), b(1) + 7, be(1) + .3);
  const st = show(c, box(120, 260, 1100, `<div class="ttl">可行性研究 · 13 名学生</div><div class="bars" style="margin-top:20px">${barRow('相对文本编辑器耗时', 1.4, 2, '约 1.4×', 'var(--vis)')}</div><p class="p" style="margin-top:20px">语法错误少得多：文本中几乎所有人都出现过，Pantograph 中只有 3 人</p><p class="p">7 / 13 人修改参数时意外改变了变量类型</p>`), b(2) + .2);
  bars(c, st, b(2) + 1);
  show(c, box(1270, 260, 530, `<div class="pill t-mid">作者定位</div><p class="p" style="margin-top:12px">可行性测试，不是定论；练习时间短、可能有偏差</p>`), b(2) + 6);
  src(c, 'Pantograph: A Fluid and Typed Structure Editor, POPL 2025');
});

S('d_voice', c => {
  const { b, be } = c;
  c.head('12', 'Cursorless', '用说话指代节点');
  const toks = [['function', '#E06C5C'], ['total', '#4C97FF'], ['(', ''], ['items', '#59C059'], [')', ''], ['{', ''], ['return', '#F0B86E'], ['sum', '#B07CE8'], ['(', ''], ['items', '#4C97FF'], [')', ''], ['}', '']];
  const v = show(c, box(120, 260, 1680, `<div class="cap">每个词上方一个彩色小记号（示意）</div><div style="margin-top:30px;font:40px var(--mono);display:flex;gap:16px;flex-wrap:wrap">${toks.map(([t, col]) => `<span style="position:relative">${col ? `<i style="position:absolute;left:50%;top:-14px;width:12px;height:12px;border-radius:50%;background:${col};transform:translateX(-50%)"></i>` : ''}${t}</span>`).join('')}</div>`), b(0) + .2);
  show(c, box(120, 520, 1680, `<div style="display:flex;gap:26px;align-items:center;font-size:30px"><span class="pill t-both" style="font-size:24px">说</span><b>动作</b> + <b>范围</b> + <b>颜色 / 字母</b><span class="p">→ 借助 tree-sitter 找到语法节点</span></div><p class="p" style="margin-top:16px">例如“删掉这个函数”“把这个参数挪到那里”</p>`), b(1) + .3);
  show(c, `<div class="abs p" style="left:120px;top:720px;font-size:26px">只要能可靠地指代节点，任何输入方式都能变成结构操作</div>`, b(1) + 8);
});

S('d_cmp', c => {
  const { b, be } = c;
  c.head('13', '放在一起看', '');
  const R = [['文本编辑器', '字符之间', '逐字输入', '完全自由', ''], ['积木', '鼠标 / 插槽', '拖拽', '只允许合法', 'a'], ['康奈尔 · Stride', '语句 / 框架', '模板 + 文本', '结构与文本分层', 'b'], ['MPS', '单元格', '补全 + 后缀变换', '结构与文本分层', 'b'], ['Interlisp · paredit · Calcit', '当前节点 / 括号', '命令 / 快捷键', '括号永不失衡', 'a'], ['Hazel', '节点（拉链）', '动作', '洞让不合法也有意义', 'c'], ['tylr', '线性拼块', '像文本', '自动补洞', 'c'], ['Pantograph', '带洞的上下文', '剪贴上下文', '错误边界', 'c']];
  const tb = show(c, `<div class="abs" style="left:120px;top:240px;width:1680px"><table class="tb" style="font-size:22px"><tr><th>编辑器</th><th>光标单位</th><th>新代码怎么进来</th><th>中间状态</th></tr>${R.map(r => `<tr class="g-${r[4]}">${r.slice(0, 4).map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`, b(0) + .2, be(0) + .3);
  const rows = [...tb.querySelectorAll('tr')].slice(1);
  c.tick(t => { const k = t < b(0) + 7 ? '' : t < b(0) + 11 ? 'g-a' : t < b(0) + 15 ? 'g-b' : 'g-c'; rows.forEach(r => { const on = r.className === k; if (r._on !== on) { r._on = on; r.style.background = on ? '#ECE8F6' : ''; } }); });
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px"><div class="ttl" style="font-size:40px">选择是公认最难的操作</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:24px">${[['Berger 2016', 'MPS：跨节点选择困难'], ['tylr 2022', '用线性选择改进'], ['Pantograph 2025', '用“带洞上下文”改进']].map(([a, d]) => `<div class="card pad"><div class="ttl">${a}</div><p class="p">${d}</p></div>`).join('')}</div><p class="p" style="margin-top:28px;font-size:28px">人眼看到的是一行行文字，树的边界却是看不见的</p></div>`, b(1) + .2, be(1) + .3);
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
    <div class="card pad" style="border-top:6px solid var(--edit)"><div class="ttl" style="font-size:36px">结构接管骨架</div><p class="p" style="font-size:26px">插入语句 · 包一层 · 挪动整块 · 删除完整节点</p></div>
    <div class="card pad" style="border-top:6px solid var(--vis)"><div class="ttl" style="font-size:36px">文本保留细节</div><p class="p" style="font-size:26px">表达式内部、叶子内部，仍然是逐字输入</p></div></div>`, b(2) + .2);
});

S('d_end', c => {
  const { b, be } = c;
  c.head('14', '番外小结', '');
  const P = ['移动', '构造', '包裹', '拆开', '删除', '交换', '洞'];
  const g = show(c, `<div class="abs" style="left:120px;top:260px;width:1680px"><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:14px">${P.map(t => `<div class="card pad pp" style="font:700 34px var(--serif);text-align:center;border-top:6px solid var(--edit)">${t}</div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:30px">${[['Interlisp', '命令'], ['paredit', '括号'], ['MPS', '单元格'], ['Calcit Editor', '快捷键'], ['Hazel', '形式化动作']].map(([a, d]) => `<div class="card pad ss"><div class="ttl" style="font-size:26px">${a}</div><p class="p">${d}</p></div>`).join('')}</div></div>`, b(0) + .2, be(0) + .3);
  c.stagger(g.querySelectorAll('.pp'), b(0) + .5, .5, { dy: 10, scale: .8 });
  c.stagger(g.querySelectorAll('.ss'), b(0) + 6, .8, { dy: 10 });
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px">${MAP('同一组原语 · 人用', '快捷键、括号、单元格', '同一组原语 · 智能体用', '重命名、按路径替换、包裹、移动')}<p class="p" style="margin-top:40px;font-size:30px">人手编辑树的粘滞度，曾是结构编辑最大的障碍；<br>当操作者变成程序，这些原语本身的价值就显露出来。</p></div>`, b(1) + .3);
});
