// 代数作用 · 上集：来历与用法
const K = { eff: 'var(--eff)', hd: 'var(--hd)', kk: 'var(--kk)' };
const MODES = [['不恢复', 'var(--bad)', '不调用 k', '异常'], ['立刻恢复', 'var(--ok)', 'k(v)', '依赖注入 · 状态'], ['存起来再恢复', 'var(--eff)', '把 k 存起来', '生成器 · 协程 · 异步'], ['恢复多次', 'var(--kk)', 'k(v1) … k(v2)', '回溯 · 概率编程']];
const modeRow = (x, y, w, sel) => at(x, y, w, `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${MODES.map(([h, c, wd, u], i) => `<div class="mode md" style="--c:${c};${sel != null && sel !== i ? 'opacity:.35' : ''}"><h4>${h}</h4><div class="w">${wd}</div><p>${u}</p></div>`).join('')}</div>`);

S('c_open', c => {
  const { b, be } = c;
  show(c, at(120, 170, 1100, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">编程语言专题 · 上集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">代数作用</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">来历与用法</div><div style="font:500 28px var(--mono);color:var(--ink3);margin-top:14px">algebraic effects &amp; handlers</div>`), .1);
  show(c, at(1230, 200, 570, `<div class="mc" style="--c:var(--eff)"><div class="s">上集</div><h3>来历与用法</h3><ul><li>可以恢复的异常</li><li>三条源头：续延、作用理论、语言</li><li>异常、注入、生成器、协程、回溯</li></ul></div><div class="mc" style="--c:var(--hd);margin-top:18px"><div class="s">下集</div><h3>类型与实现</h3><ul><li>作用类型、意外捕获</li><li>纤程、证据传递、CPS、WasmFX</li><li>主流语言里的影子与局限</li></ul></div>`), b(0) + 1.5, be(0) + .3);
  show(c, det(120, 690, 1060, '说明', 'AI 协助整理（稿件与画面：Claude；配音：Gemini TTS，1.25 倍速）。代码按 Koka、OCaml 官方文档整理，未在本机编译。'), b(0) + 3, be(0) + .3);
  show(c, at(1230, 250, 570, `<div class="code2" style="font-size:22px"><span class="kw">try</span> {
  …
  x = <span class="hl">perform Ask()</span>
  …
} <span class="kw">handle</span> (Ask, <b style="color:#C9B6FF">k</b>) {
  <b style="color:#C9B6FF">k</b>(42)   <span class="cm">// 回到 perform 处</span>
}</div><div style="font:700 40px/1.3 var(--serif);margin-top:26px">可以恢复的异常</div>`), b(1) + .3);
});

S('c_idea', c => {
  const { b } = c;
  c.head('01', '可以恢复的异常');
  show(c, at(120, 250, 820, `<div class="code2" style="font-size:22px"><span class="kw">function</span> greet() {
  <span class="kw">const</span> name = <span class="hl">perform AskName()</span>;
  <span class="kw">return</span> <span class="s">"你好，"</span> + name;
}

<span class="kw">try</span> {
  print(greet());
} <span class="kw">handle</span> (AskName, k) {
  k(<span class="s">"阿杰"</span>);   <span class="cm">// 带着值回到 perform 处</span>
}
<span class="cm">// 输出：你好，阿杰</span></div><div style="font-size:17px;color:var(--ink3);margin-top:8px">接近 JavaScript 的伪代码；JS 本身没有这个特性</div>`), b(0) + .1);
  // 右：调用栈
  const st = show(c, `<div class="stk" style="left:1080px;top:260px;width:560px"><div class="fr eff">greet()：perform AskName()</div><div class="fr">中间的函数 ……</div><div class="fr">中间的函数 ……</div><div class="fr hh">try … handle (AskName, k)</div><div class="fr">main()</div></div>`, b(0) + .3);
  show(c, at(1080, 222, 560, `<div class="cap">调用栈（上面是最新的帧）</div>`), b(0) + .3);
  const thr = show(c, at(1660, 300, 150, `<div style="font-size:19px;color:var(--bad);font-weight:700">throw：<br>中间帧全部丢弃</div>`), F(c, 0, .25), F(c, 0, .5));
  show(c, `<div class="kbr" style="left:1060px;top:254px;width:20px;height:184px"></div>`, F(c, 0, .55));
  show(c, `<div class="klab" style="left:1010px;top:330px">k</div>`, F(c, 0, .55));
  show(c, at(1080, 570, 720, `<div class="mc" style="--c:var(--kk)"><h3 style="font-size:26px">k = 从 perform 到处理器的那一段</h3><div style="font-size:20px;color:var(--ink2)">处理器拿到它，就能决定“之后”怎么继续</div></div>`), F(c, 0, .65));
  show(c, at(1080, 720, 720, `<div class="flow" style="position:static">${[['perform AskName', 'var(--eff)'], ['处理器收到请求和 k', 'var(--hd)'], ['k("阿杰")', 'var(--kk)'], ['回到原处继续', 'var(--ok)']].map(([a, col], i) => `${i ? '<span class="ar">→</span>' : ''}<div class="st" style="--c:${col};font-size:18px">${a}</div>`).join('')}</div>`), b(1) + .2);
});

S('c_three', c => {
  const { b } = c;
  c.head('02', '三个要点');
  const P = [['谁来回答，调用方不知道', '读配置、走网络、测试里写死，都由外层的处理器决定'], ['中间的函数不用改', '隔十层调用也不用加参数，也不用标成 async'], ['处理器掌握“之后”', 'k 怎么用，决定了这个作用是什么']];
  const g = show(c, `<div class="col3" style="left:120px;top:250px;width:1680px">${P.map(([h, d], i) => `<div class="mc pp" style="--c:${[K.eff, 'var(--itp)', K.kk][i]}"><div class="k cap">0${i + 1}</div><h3 style="font-size:30px">${h}</h3><div style="font-size:21px;color:var(--ink2);line-height:1.5">${d}</div></div>`).join('')}</div>`, b(0) + .1);
  [...g.querySelectorAll('.pp')].forEach((e, i) => c.in(e, [b(0) + .2, F(c, 0, .55), b(1) + .1][i]));
  const m = show(c, modeRow(120, 560, 1680), F(c, 1, .2));
  [...m.querySelectorAll('.md')].forEach((e, i) => c.in(e, F(c, 1, [.22, .38, .55, .72][i])));
});

S('c_hist1', c => {
  const { b } = c;
  c.head('03', '源头一：续延与控制流');
  const T = [['1960–70 年代', '续延', '“程序接下来要做的全部事情”，用来描述跳转与异常'], ['Scheme', 'call/cc', '把续延变成值，但抓的是全部剩余计算，难以组合'], ['1988', 'Felleisen：prompt', '可定界的续延：只抓到栈上标记为止的那一段'], ['1990', 'Danvy 与 Filinski', 'shift / reset，同一类定界控制']];
  const t = show(c, at(120, 250, 1000, tbl([['时间', '名字', '意义'], ...T], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, F(c, 0, .05)], [1, F(c, 0, .25)], [2, F(c, 0, .5)], [3, F(c, 0, .8)]]);
  show(c, `<div class="stk" style="left:1180px;top:260px;width:560px"><div class="fr">f()</div><div class="fr">g()</div><div class="fr" style="border-style:dashed;border-color:var(--kk);color:var(--kk);font-weight:700">── prompt（标记）──</div><div class="fr">main()</div></div>`, F(c, 0, .55));
  show(c, `<div class="abs" style="left:0;top:0"><div class="kbr" style="left:1160px;top:254px;width:20px;height:110px"></div><div class="klab" style="left:1180px;top:222px;font-size:20px;white-space:nowrap">只抓到标记为止的这一段</div></div>`, F(c, 0, .65));
  show(c, concl(1180, 520, 620, '一个处理器，就是一个<b>带名字的 prompt</b>'), b(1) + .1);
  show(c, at(120, 600, 1000, `<div class="mc" style="--c:var(--itp)"><h3 style="font-size:28px">Common Lisp 条件系统（1994 年入 ANSI 标准）</h3><ul><li>处理器在<b>不展开栈</b>的情况下运行</li><li>由处理器选一个<b>重启点</b>让程序继续</li><li>差一步：重启点要事先列好，拿不到可以存起来的续延</li></ul></div>`), F(c, 1, .45));
});

S('c_hist2', c => {
  const { b } = c;
  c.head('04', '源头二：作用的理论');
  show(c, at(120, 250, 820, `<div class="mc" style="--c:var(--itp)"><div class="s">1989 · Moggi；1992 · Wadler</div><h3>单子（monad）</h3><ul><li>统一描述异常、状态、非确定性等“计算作用”</li><li>Haskell 的 IO 建立在单子上</li><li><b>难组合</b>：多种作用要叠单子变换器，还要排好顺序</li></ul></div>`), b(0) + .1);
  show(c, at(980, 250, 820, `<div class="mc" style="--c:var(--eff)"><div class="s">2001–2003 · Plotkin 与 Power</div><h3>代数作用</h3><div style="font-size:21px;color:var(--ink2)">作用 = <b>一组操作</b> + 操作满足的<b>等式</b></div><div class="code2" style="font-size:19px;margin-top:12px">get : () → S          put : S → ()
put(a); put(b)  ≡  put(b)       <span class="cm">// 等式</span>
put(s); get()   ≡  put(s); s</div></div>`), b(1) + .1);
  show(c, at(980, 640, 820, `<div class="mc" style="--c:var(--hd)"><div class="s">2009 · Plotkin 与 Pretnar（ESOP）</div><h3>作用处理器</h3><div style="font-size:21px;color:var(--ink2)">处理器 = 给这组操作一个具体的解释；异常处理只是特例</div></div>`), F(c, 1, .6));
  show(c, at(120, 640, 820, `<div style="font:700 30px/1.5 var(--serif)">“代数”= 操作是代数的运算，<br>等式是代数的公理</div><div style="font-size:18px;color:var(--ink3);margin-top:8px">实际语言大多不检查这些等式，工程上的“代数作用”主要指“操作 + 处理器”这套机制</div>`), F(c, 1, .4));
});

S('c_hist3', c => {
  const { b } = c;
  c.head('05', '源头三：语言与运行时');
  const E = [[2012, 'Eff', '第一门以作用和处理器为核心的语言', 'eff'], [2013, 'Haskell 库', '用自由单子模拟处理器', 'eff'], [2015, 'Multicore OCaml', '用处理器写并发调度器', 'eff'], [2017, 'Koka · Frank', '作用写进类型系统', 'eff'], [2020, 'Effekt', '作用即能力', 'eff'], [2022, 'OCaml 5.0', '工业语言的运行时首次内置', 'hd'], [2023, 'GHC 9.6 · WasmFX', '定界续延原语；Wasm 指令集提案', 'hd'], [2025, 'OCaml 5.3', 'effect 语法', 'hd'], [2026, 'Wasm 栈切换', '提案处于第三阶段，Chrome 需开启标志', 'hd']];
  const X = y => 160 + (y - 2011) / (2027 - 2011) * 1600;
  show(c, `<div class="abs" style="left:0;top:470px;width:1920px;height:4px"><div style="position:absolute;left:150px;width:1640px;height:4px;background:var(--line2)"></div></div>`, b(0) + .1);
  E.forEach(([y, n, d, k], i) => {
    const up = i % 2 === 0, col = k === 'eff' ? K.eff : K.hd;
    const t = i < 5 ? F(c, 0, .08 + i * .17) : F(c, 1, .05 + (i - 5) * .22);
    show(c, `<div class="abs" style="left:0;top:0"><div class="abs" style="left:${X(y) - 9}px;top:463px;width:18px;height:18px;border-radius:9px;background:${col}"></div><div class="abs" style="left:${X(y) - 1}px;top:${up ? 330 : 481}px;width:2px;height:${up ? 133 : 60}px;background:${col};opacity:.5"></div><div class="abs" style="left:${X(y) - 100}px;top:${up ? 250 : 545}px;width:200px;text-align:center"><div style="font:700 22px var(--mono);color:${col}">${y}</div><div style="font-weight:700;font-size:22px">${n}</div><div style="font-size:17px;color:var(--ink2);line-height:1.35">${d}</div></div></div>`, t, null, { dy: up ? 10 : -10 });
  });
  show(c, at(120, 760, 1680, `<div style="display:flex;gap:30px;font-size:20px"><span><b style="color:var(--eff)">●</b> 研究语言与库</span><span><b style="color:var(--hd)">●</b> 工业运行时与标准</span></div>`), b(0) + .5);
});

S('c_concept', c => {
  const { b } = c;
  c.head('06', '几个术语');
  const t1 = show(c, at(120, 245, 820, tbl([['术语', '意思'], ['作用 effect', '一组操作的签名：只说能做什么'], ['操作 operation', '如 get、put、raise、yield'], ['perform', '发出一个操作，暂停在这里'], ['处理器 handler', '每个操作一条规则 + 一条返回规则'], ['续延 k', 'perform 到处理器之间的那段计算'], ['转发', '没被认领的操作继续向外，处理器可层层叠放']], { st: 'font-size:20px' })), b(0) + .1);
  rowsIn(c, t1, [0, 1, 2, 3, 4, 5].map(k => [k, F(c, 0, .05 + k * .14)]));
  const t2 = show(c, at(980, 245, 820, tbl([['维度', '选项', '代表'], ['深 / 浅', '深：恢复后继续管后面的操作', 'Koka、Eff、OCaml Deep'], ['', '浅：只管第一个，恢复时重新指定', 'OCaml Shallow、Frank'], ['恢复次数', '单次：可直接切换栈', 'OCaml 5、WasmFX'], ['', '多次：要复制栈或用 CPS', 'Koka、Eff、Effekt']], { st: 'font-size:19px' })), b(1) + .1);
  rowsIn(c, t2, [[0, F(c, 1, .05)], [1, F(c, 1, .2)], [2, F(c, 1, .4)], [3, F(c, 1, .62)]]);
  show(c, concl(980, 640, 820, '最影响实现的是<b>单次还是多次</b>：OCaml 5 选单次，Koka 支持多次'), F(c, 1, .7));
});

S('c_exc', c => {
  const { b } = c;
  c.head('07', '不恢复与立刻恢复');
  show(c, at(120, 245, 820, `<div class="cap" style="margin-bottom:6px"><b style="color:var(--bad)">不恢复 = 异常</b>（Koka）</div><div class="code2" style="font-size:19px"><span class="kw">effect</span> raise
  <span class="kw">ctl</span> raise( msg : string ) : a

<span class="kw">fun</span> safe-divide( x : int, y : int ) : <span class="hl">raise int</span>
  <span class="kw">if</span> y == 0 <span class="kw">then</span> raise(<span class="s">"div-by-zero"</span>) <span class="kw">else</span> x / y

<span class="kw">fun</span> raise-maybe( action ) : e maybe&lt;a&gt;
  <span class="kw">with handler</span>
    <span class="kw">return</span>(x)      Just(x)
    <span class="kw">ctl</span> raise(msg) Nothing     <span class="cm">// 不调用 resume</span>
  action()</div><div style="font-size:18px;color:var(--ink2);margin-top:8px">类型 <span class="k">raise int</span>：可能发出 raise；忘了处理，编译期报错</div>`), b(0) + .1);
  show(c, at(980, 245, 820, `<div class="cap" style="margin-bottom:6px"><b style="color:var(--ok)">立刻恢复 = 依赖注入</b>（Koka）</div><div class="code2" style="font-size:19px"><span class="kw">effect val</span> width : int

<span class="kw">fun</span> pretty-internal( line ) : <span class="hl">width string</span>
  line.truncate(width)      <span class="cm">// 不用层层传参</span>

<span class="kw">fun</span> pretty-thin( d ) : string
  <span class="kw">with val</span> width = 40       <span class="cm">// 在这个范围里提供</span>
  pretty(d)</div>`), b(1) + .1);
  const t = show(c, at(980, 640, 820, tbl([['对比', '作用域', '中间函数', '漏配何时发现'], ['全局变量', '无', '不改', '运行时'], ['层层传参', '有', '每层都改', '编译期'], ['DI 容器', '容器内', '不改', '运行时'], ['<b>作用处理器</b>', '<b>有</b>', '<b>不改</b>', '<b>编译期</b>']], { hl: [3], st: 'font-size:19px' })), F(c, 1, .35));
  show(c, det(120, 700, 820, '测试替身', '把时间、随机数、网络请求都写成操作；生产环境装真实处理器，测试里装返回固定值的处理器，不需要 mock 框架。'), F(c, 1, .72));
});

S('c_gen', c => {
  const { b } = c;
  c.head('08', '存起来再恢复');
  show(c, at(120, 245, 820, `<div class="cap" style="margin-bottom:6px"><b style="color:var(--eff)">生成器</b>（OCaml 5.3）</div><div class="code2" style="font-size:18px"><span class="kw">type</span> _ Effect.t += Yield : int -&gt; unit Effect.t

<span class="kw">let rec</span> walk = <span class="kw">function</span>          <span class="cm">(* 普通的递归遍历 *)</span>
  | Leaf -&gt; ()
  | Node (l, x, r) -&gt;
      walk l; <span class="hl">perform (Yield x)</span>; walk r

<span class="kw">let</span> print_all t =
  <span class="kw">match</span> walk t <span class="kw">with</span>
  | () -&gt; ()
  | <span class="kw">effect</span> (Yield x), k -&gt;
      print_int x; continue k ()</div><div style="font-size:18px;color:var(--ink2);margin-top:8px;line-height:1.5">处理器若把 <b>k 和 x 一起交出去</b>，调用方就得到“要一个给一个”的迭代器；遍历代码一行不改。JS 则要把每一层改成 <span class="k">function*</span> 和 <span class="k">yield*</span>。</div>`), b(0) + .1);
  show(c, at(980, 245, 820, `<div class="cap" style="margin-bottom:6px"><b style="color:var(--eff)">协程调度器</b>（OCaml 5.3）</div><div class="code2" style="font-size:18px"><span class="kw">let</span> run main =
  <span class="kw">let</span> q = Queue.create () <span class="kw">in</span>
  <span class="kw">let</span> next () = <span class="kw">if not</span> (Queue.is_empty q)
                <span class="kw">then</span> (Queue.pop q) () <span class="kw">in</span>
  <span class="kw">let rec</span> spawn f =
    <span class="kw">match</span> f () <span class="kw">with</span>
    | () -&gt; next ()
    | <span class="kw">effect</span> (Fork g), k -&gt;
        <span class="hl">Queue.push (fun () -&gt; continue k ()) q</span>; spawn g
    | <span class="kw">effect</span> Pause, k -&gt;
        <span class="hl">Queue.push (fun () -&gt; continue k ()) q</span>; next ()
  <span class="kw">in</span> spawn main</div>`), b(1) + .1);
  show(c, concl(980, 720, 820, '把 Pause 换成“等文件可读”，接上 io_uring：业务代码里的 <b>read 仍是普通同步调用</b>（OCaml Eio 的做法）'), F(c, 1, .6));
});

S('c_amb', c => {
  const { b } = c;
  c.head('09', '恢复多次');
  show(c, at(120, 245, 820, `<div class="code2" style="font-size:19px"><span class="kw">effect</span> amb
  <span class="kw">ctl</span> flip() : bool

<span class="kw">fun</span> xor() : amb bool
  <span class="kw">val</span> p = flip()
  <span class="kw">val</span> q = flip()
  (p || q) &amp;&amp; not(p &amp;&amp; q)

<span class="kw">fun</span> all-results( action ) : e list&lt;a&gt;
  <span class="kw">with handler</span>
    <span class="kw">return</span>(x)  [x]
    <span class="kw">ctl</span> flip() <span class="hl">resume(False) ++ resume(True)</span>
  action()

<span class="cm">// all-results(xor) == [False, True, True, False]</span></div><div style="font-size:17px;color:var(--ink3);margin-top:6px">Koka；OCaml 5 的单次续延做不到这一点</div>`), b(0) + .1);
  // 右：分支树
  const node = (x, y, t, col) => `<div class="abs" style="left:${x - 70}px;top:${y}px;width:140px;text-align:center;padding:8px 0;border-radius:10px;border:2px solid ${col};background:var(--surface);font:600 19px var(--mono)">${t}</div>`;
  const ln = (x1, y1, x2, y2) => `<svg class="abs" style="left:0;top:0;overflow:visible" width="1" height="1"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9AA0A8" stroke-width="2"/></svg>`;
  show(c, `<div class="abs" style="left:0;top:0">${node(1390, 260, 'flip() p', K.kk) + ln(1390, 300, 1200, 360) + ln(1390, 300, 1580, 360) + node(1200, 360, 'p=False', 'var(--line2)') + node(1580, 360, 'p=True', 'var(--line2)')}</div>`, F(c, 0, .35));
  show(c, `<div class="abs" style="left:0;top:0">${ln(1200, 400, 1100, 460) + ln(1200, 400, 1300, 460) + ln(1580, 400, 1480, 460) + ln(1580, 400, 1680, 460) + node(1100, 460, 'q=F → F', 'var(--line2)') + node(1300, 460, 'q=T → T', 'var(--ok)') + node(1480, 460, 'q=F → T', 'var(--ok)') + node(1680, 460, 'q=T → F', 'var(--line2)')}</div>`, F(c, 0, .6));
  show(c, at(980, 560, 820, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div class="mc" style="--c:var(--kk)"><h3 style="font-size:24px">++ 换成按概率加权</h3><div style="font-size:19px;color:var(--ink2)">概率编程（Pyro / NumPyro 的核心就叫作用处理器）</div></div><div class="mc" style="--c:var(--kk)"><h3 style="font-size:24px">找到一个就停</h3><div style="font-size:19px;color:var(--ink2)">回溯搜索</div></div></div>`), b(1) + .1);
  show(c, at(980, 760, 820, `<div class="mc" style="--c:var(--itp)"><h3 style="font-size:24px">叠放顺序有语义</h3><div style="font-size:19px;color:var(--ink2);line-height:1.5">raise 在 amb <b>里面</b>处理：一个分支失败只丢这个分支<br>raise 在 amb <b>外面</b>处理：一个分支失败就整体失败</div></div>`), F(c, 1, .6));
});

S('c_cmp', c => {
  const { b } = c;
  c.head('10', '和熟悉的机制比一比');
  const t = show(c, at(120, 245, 1680, tbl([['机制', '能做到', '和代数作用的差别'],
    ['异常', '中止并跳到外层', '只是“不调用 k”的特例'],
    ['async / await', '异步代码顺序写', '只管异步一种作用；函数着色：一处 async，调用链层层要改'],
    ['JS / Python 生成器', '暂停与恢复', '无栈：只能在自己这一层暂停，嵌套靠 yield* 逐层转发'],
    ['有栈协程（Lua、goroutine、Java 虚拟线程）', '任意深度暂停', '能力接近单次处理器；但接收暂停的只有一个固定调度器'],
    ['单子与变换器', '表达力相当，作用写进类型', '代码要改成单子写法；多种作用要排变换器顺序'],
    ['依赖注入容器', '替换实现', '运行时查表，漏配运行时才发现；没有控制流能力']], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, F(c, 0, .05)], [1, F(c, 0, .2)], [2, F(c, 0, .62)], [3, b(1) + .1], [4, F(c, 1, .45)], [5, F(c, 1, .7)]]);
  show(c, concl(120, 770, 1680, '代数作用的位置：代码保持<b>直接风格</b>，“怎么做”交给<b>外层的处理器</b>'), F(c, 1, .85));
});

S('c_end', c => {
  const { b } = c;
  c.head('11', '上集小结');
  show(c, at(120, 250, 1680, `<div class="flow" style="position:static;justify-content:center">${[['perform 发出请求', 'var(--eff)'], ['处理器拿到请求和 k', 'var(--hd)'], ['k 的用法决定功能', 'var(--kk)']].map(([a, col], i) => `${i ? '<span class="ar">→</span>' : ''}<div class="st" style="--c:${col};font-size:26px;padding:16px 22px">${a}</div>`).join('')}</div>`), b(0) + .1);
  const m = show(c, modeRow(120, 400, 1680), F(c, 0, .35));
  [...m.querySelectorAll('.md')].forEach((e, i) => c.in(e, F(c, 0, [.35, .5, .65, .8][i])));
  show(c, at(120, 680, 1680, `<div class="mc" style="--c:var(--hd);display:grid;grid-template-columns:260px 1fr;gap:20px;align-items:center"><div><div class="s">下集</div><h3>类型与实现</h3></div><div style="font-size:22px;color:var(--ink2);line-height:1.6">类型系统怎么保证每个请求都有人处理 · 编译器和运行时怎么把“剩下的计算”变成可恢复的对象</div></div>`), b(1) + .1);
});
