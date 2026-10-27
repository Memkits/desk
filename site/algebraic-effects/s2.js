// 代数作用 · 下集：类型与实现
const K = { eff: 'var(--eff)', hd: 'var(--hd)', kk: 'var(--kk)' };
const W = (inner) => `<div class="abs" style="left:0;top:0">${inner}</div>`;

S('d_open', c => {
  const { b } = c;
  show(c, at(120, 170, 1100, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">编程语言专题 · 下集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">代数作用</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">类型与实现</div>`), .1);
  show(c, at(1180, 200, 620, `<div class="mc" style="--c:var(--hd)"><ul><li>作用类型：行多态、能力、意外捕获</li><li>四条实现路线：纤程、CPS、证据传递、库模拟</li><li>WebAssembly 栈切换</li><li>主流语言里的影子、局限、什么时候用</li></ul></div>`), b(0) + 1);
  show(c, at(120, 600, 1680, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px"><div class="mc" style="--c:var(--eff);padding:26px 30px"><div class="k cap">问题一</div><h3>perform 时，怎么找到处理器？</h3></div><div class="mc" style="--c:var(--kk);padding:26px 30px"><div class="k cap">问题二</div><h3>“剩下的计算”怎么变成可恢复的对象？</h3></div></div>`), b(1) + .2);
});

S('d_types', c => {
  const { b } = c;
  c.head('01', '把作用写进类型');
  const tag = (t, col) => `<span style="display:inline-block;padding:8px 16px;border-radius:9px;font:600 24px var(--mono);border:2px solid ${col};background:var(--surface);margin-right:8px">${t}</span>`;
  show(c, at(120, 250, 820, `<div class="cap" style="margin-bottom:10px">Koka 的行多态：作用是一行标签</div><div>${tag('raise', K.eff)}${tag('console', K.eff)}${tag('| e', 'var(--line2)')}</div><div style="font-size:19px;color:var(--ink3);margin:10px 0 18px">e 是作用变量：“还可能有别的”</div>`), b(0) + .1);
  show(c, at(120, 400, 820, `<div class="flow" style="position:static"><div class="st" style="--c:var(--hd)">raise-maybe 处理掉 raise</div><span class="ar">→</span><div>${tag('console', K.eff)}${tag('| e', 'var(--line2)')}</div></div>`), F(c, 0, .65));
  show(c, at(120, 540, 820, `<div class="mc" style="--c:var(--bad)"><h3 style="font-size:26px">total 函数偷偷调用系统命令 → 编译失败</h3><div class="code2" style="font-size:18px;margin-top:6px"><span class="kw">fun</span> factorial(n : int) : <span class="hl">total</span> int
  …
  run-system(<span class="s">"rm -rf /"</span>)   <span class="cm">// 类型错误</span></div></div>`), F(c, 0, .85));
  show(c, at(980, 250, 820, `<div class="cap" style="margin-bottom:6px">高阶函数对作用多态</div><div class="code2" style="font-size:20px"><span class="kw">fun</span> map( xs : list&lt;a&gt;, f : (a) -&gt; <span class="hl">e</span> b ) : <span class="hl">e</span> list&lt;b&gt;
  <span class="kw">match</span> xs
    Cons(x, rxs) -&gt; Cons(f(x), map(rxs, f))
    Nil -&gt; Nil</div><div style="font-size:20px;color:var(--ink2);margin-top:10px">f 有什么作用，map 就有什么作用：同一个 map 跑纯函数，也跑异步函数</div>`), b(1) + .1);
  show(c, concl(980, 620, 820, '函数着色没有消失，只是从“必须改代码”变成了“<b>类型里多一个标签</b>”'), F(c, 1, .7));
  show(c, `<div class="src">代码：LWN《Koka》评测 · Koka 文档</div>`, b(0) + .5);
});

S('d_capture', c => {
  const { b } = c;
  c.head('02', '意外捕获与几种取舍');
  show(c, `<div class="stk" style="left:120px;top:270px;width:640px"><div class="fr eff">用户的函数 f：perform Log("…")</div><div class="fr hh">库函数内部的 Log 处理器 ← <b style="color:var(--bad)">意外截住</b></div><div class="fr">库函数 withRetry(f)</div><div class="fr hh">用户自己的 Log 处理器 ← 本该由它处理</div></div>`, b(0) + .1);
  show(c, at(120, 560, 640, `<div class="mc" style="--c:var(--eff)"><h3 style="font-size:26px">Effekt：作用即能力（OOPSLA 2020）</h3><div style="font-size:20px;color:var(--ink2);line-height:1.5">处理器是一个“能力”对象，按<b>词法作用域</b>传到用它的地方，不在调用栈上动态查找；签名也更短</div></div>`), F(c, 0, .55));
  const t = show(c, at(840, 270, 960, tbl([['语言', '作用写在哪', '漏处理何时发现'], ['Koka', '行 &lt;raise, io | e&gt;；mask 原语', '编译期'], ['Unison', '箭头上 -&gt;{Abort, IO}，叫能力', '编译期'], ['Effekt', '词法传递的能力', '编译期'], ['Eff', '带子类型的作用类型', '编译期'], ['OCaml 5', '不写，Effect.t 可扩展变体', '<span class="r">运行时 Unhandled</span>'], ['Haskell 库', "Eff '[State s, Error e]", '编译期']], { st: 'font-size:20px' })), b(1) + .1);
  rowsIn(c, t, [0, 1, 2, 3, 4, 5].map(k => [k, F(c, 1, .05 + k * .13)]));
  show(c, det(840, 700, 960, 'OCaml 5 的取舍', '不动现有的类型系统和生态；安全性留给程序员。常见用法是 Eio 这类库在内部使用，对外暴露普通函数。'), F(c, 1, .75));
});

S('d_impl', c => {
  const { b } = c;
  c.head('03', '四条实现路线');
  const t = show(c, at(120, 245, 1680, tbl([['做法', '续延长什么样', '多次恢复', '不用作用时的代价', '代表'],
    ['运行时栈切换（纤程）', '一段可以摘下、再接回的栈', '否', '<span class="g">接近零</span>', 'OCaml 5、Wasm 栈切换、libmprompt'],
    ['CPS 变换', '闭包；每一步都显式传递', '是', '<span class="r">高</span>：到处分配闭包、间接调用', 'js_of_ocaml、研究编译器'],
    ['单子翻译 + 证据传递', '真正挂起时才逐帧拼出', '是', '低：每次调用后查一个标志', 'Koka（编译到 C）'],
    ['库层模拟', '自由单子结构，或语言自带生成器', '视实现', '中到高', 'Haskell 作用库、JS 生成器方案']], { st: 'font-size:22px' })), b(0) + .1);
  rowsIn(c, t, [[0, F(c, 0, .1)], [1, F(c, 0, .55)], [2, b(1) + .1], [3, F(c, 1, .6)]]);
  show(c, `<div class="abs" style="left:120px;top:640px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:22px"><div class="mc" style="--c:var(--ok)"><h3 style="font-size:26px">不用作用的代码不该付钱</h3><div style="font-size:20px;color:var(--ink2)">栈切换、证据传递在这一点上占优</div></div><div class="mc" style="--c:var(--kk)"><h3 style="font-size:26px">多次恢复要求续延是“值”</h3><div style="font-size:20px;color:var(--ink2)">CPS、证据传递天然支持；栈切换要复制栈</div></div></div>`, F(c, 1, .75));
});

S('d_fiber', c => {
  const { b } = c;
  c.head('04', 'OCaml 5：摘下纤程');
  // 左：before
  show(c, at(120, 240, 520, `<div class="cap" style="margin-bottom:8px">perform 之前</div><div class="stk" style="position:static"><div style="border:2px solid var(--line2);border-radius:12px;padding:10px;background:var(--surface)"><div style="font-size:16px;color:var(--ink3);margin-bottom:6px">纤程 F1（堆上，初始 16 个字）</div><div class="fr eff" style="margin-bottom:6px">perform (Xchg 0)</div><div class="fr">comp1 ()</div></div><div style="border:2px solid var(--line2);border-radius:12px;padding:10px;background:#ECEEE9;margin-top:10px"><div style="font-size:16px;color:var(--ink3);margin-bottom:6px">主栈</div><div class="fr hh" style="margin-bottom:6px">try … with effect …</div><div class="fr">main ()</div></div></div>`), b(0) + .1);
  show(c, at(660, 330, 120, `<div style="font:700 44px var(--sans);color:var(--kk);text-align:center">→</div><div style="font-size:18px;color:var(--kk);text-align:center;font-weight:700">摘下</div>`), F(c, 0, .5));
  show(c, at(800, 240, 520, `<div class="cap" style="margin-bottom:8px">perform 之后：处理器在运行</div><div style="border:2px dashed var(--kk);border-radius:12px;padding:10px;background:var(--surface)"><div style="font-size:16px;color:var(--kk);margin-bottom:6px;font-weight:700">k = 摘下来的 F1，帧原封不动</div><div class="stk" style="position:static"><div class="fr" style="margin-bottom:6px">perform (Xchg 0)</div><div class="fr">comp1 ()</div></div></div><div style="border:2px solid var(--line2);border-radius:12px;padding:10px;background:#ECEEE9;margin-top:10px"><div style="font-size:16px;color:var(--ink3);margin-bottom:6px">主栈</div><div class="stk" style="position:static"><div class="fr hh" style="margin-bottom:6px;font-weight:700">effect (Xchg n), k -&gt; continue k (n+1)</div><div class="fr" style="margin-bottom:6px">try … with effect …</div><div class="fr">main ()</div></div></div>`), F(c, 0, .5));
  show(c, at(120, 760, 1200, `<div style="font-size:20px;color:var(--ink2)">continue k v：把 F1 接回当前栈上方，perform 返回 v。<b>不复制所以快，也因此只能恢复一次</b>，第二次报错。</div>`), F(c, 0, .8));
  const t = show(c, at(1380, 240, 420, tbl([['操作', '耗时'], ['分配纤程并切换', '23 ns'], ['perform 找到处理器', '5 ns'], ['continue 恢复', '11 ns'], ['返回并释放纤程', '7 ns']], { nums: [1], st: 'font-size:19px' })), b(1) + .1);
  show(c, at(1380, 500, 420, `<div class="cap" style="margin-bottom:8px">生成器遍历深度 25 的二叉树（相对手写 CPS）</div>` + logBars([['手写 CPS', 1, C.ok, '1.0×'], ['作用处理器', 2.76, K.kk, '2.76×'], ['并发单子', 8.69, C.itp, '8.69×']], .8, 12, { lw: 110 })), F(c, 1, .55));
  show(c, det(1380, 760, 420, '不用作用的程序', '54 个基准几何平均慢约 <b>1%</b>', 'Sivaramakrishnan 等，PLDI 2021'), F(c, 1, .35));
});

S('d_evid', c => {
  const { b } = c;
  c.head('05', 'Koka：证据传递');
  show(c, at(120, 250, 820, `<div class="cap" style="margin-bottom:8px">当前的处理器作为“证据向量”隐式传给每个函数</div><div class="ev"><span>raise → h1</span><span>width → h2</span><span>amb → h3</span></div><div style="font-size:20px;color:var(--ink2);margin-top:14px;line-height:1.5">perform 直接在向量里查，不用顺着栈找；<br>作用类型封闭时，查找是<b>固定偏移</b></div>`), b(0) + .1);
  show(c, at(120, 500, 820, `<div class="mc" style="--c:var(--ok)"><div class="s">fun 声明的操作</div><h3 style="font-size:28px">尾恢复：就地调用</h3><div style="font-size:20px;color:var(--ink2);line-height:1.5">处理规则最后一步就是恢复 → 不抓续延，直接在 perform 处调用处理函数，成本接近<b>一次虚方法调用</b>。作者认为绝大多数操作属于这一类，例外主要是异步 I/O 和回溯。</div></div>`), b(1) + .1);
  show(c, at(980, 250, 820, `<div class="mc" style="--c:var(--kk)"><div class="s">ctl 声明的其他操作</div><h3 style="font-size:28px">冒泡</h3><div class="code2" style="font-size:18px;margin-top:8px">x = f(…)
<span class="hl">if (ctx-&gt;is_yielding)</span>          <span class="cm">// 每次调用后查一个标志</span>
  <span class="kw">return</span> yield_extend(<span class="cm">剩余工作</span>)  <span class="cm">// 接到续延上，继续向上</span>
…                                 <span class="cm">// 正常路径只多一次分支</span></div><div style="font-size:19px;color:var(--ink2);margin-top:10px">一直返回到匹配的处理器为止；续延是普通闭包链，<b>可以恢复多次</b>，配合 Perceus 引用计数及时回收</div></div>`), F(c, 1, .45));
  show(c, det(980, 680, 820, '代价', '续延只能在捕获它的那组处理器下恢复（有作用域的恢复），否则证据向量对不上。', 'Xie 与 Leijen，ICFP 2020 / 2021'), F(c, 1, .8));
});

S('d_wasm', c => {
  const { b } = c;
  c.head('06', '续延传递与 WebAssembly');
  show(c, at(120, 250, 820, `<div class="cap" style="margin-bottom:6px">CPS：每个函数多一个“之后要做什么”</div><div class="code2" style="font-size:19px"><span class="cm">// 直接风格</span>
<span class="kw">function</span> f(x) { <span class="kw">const</span> y = g(x); <span class="kw">return</span> y + 1; }

<span class="cm">// CPS：k 是一个普通闭包，可以存、可以调多次</span>
<span class="kw">function</span> f(x, k) { g(x, y =&gt; k(y + 1)); }</div><div style="font-size:19px;color:var(--ink2);margin-top:10px;line-height:1.5">不需要运行时支持，能编译到 JavaScript；代价是到处分配闭包、打乱控制流。有作用类型时可以只改写可能发出作用的函数（选择性 CPS）。</div>`), b(0) + .1);
  show(c, at(980, 250, 820, `<div class="mc" style="--c:var(--hd)"><div class="s">WasmFX（OOPSLA 2023）→ 栈切换提案</div><h3 style="font-size:28px">单次、带类型的续延</h3>${tbl([['指令', '作用'], ['cont.new', '把函数变成一段可运行的栈'], ['suspend $tag', '挂起到最近的处理该标签的 resume'], ['resume', '在一组处理分支下恢复；重复恢复会陷阱']], { st: 'box-shadow:none;font-size:19px' })}</div>`), b(1) + .1);
  show(c, at(980, 600, 820, `<div class="cap" style="margin-bottom:8px">协程服务器基准（论文的 Wasmtime 原型）</div>${tbl([['方案', '二进制', '耗时', '内存'], ['WasmFX', '0.8 KB', '2700 ms', '55.5 MB'], ['Asyncify', '9.2 KB', '700 ms', '54.1 MB'], ['手写状态机', '0.9 KB', '140 ms', '13.4 MB']], { nums: [1, 2, 3], st: 'font-size:19px' })}<div style="font-size:16px;color:var(--ink3);margin-top:6px">慢主要来自未优化的栈切换与宿主调用；提案目前处于第三阶段，Chrome 需开启标志</div>`), F(c, 1, .5));
});

S('d_main', c => {
  const { b } = c;
  c.head('07', '主流语言里的影子');
  const t = show(c, at(120, 245, 1680, tbl([['语言 / 库', '对应的特例', '缺什么'],
    ['async：JS、C#、Kotlin、Swift、Rust', '异步', '只管一种作用；函数着色；和 yield、throws 组合别扭'],
    ['JS / Python 生成器', '生成器', '无栈，只停一层；不能复制，写不了多次恢复'],
    ['Java 虚拟线程、Go goroutine', '阻塞自动挂起', '底层和纤程同类，但处理器固定为运行时的调度器'],
    ['React Hooks / Suspense', '依赖注入、挂起', '抛出 Promise 后<b>重新渲染</b>，不能从中断处恢复'],
    ['Effect（TS）、ZIO、cats-effect', '类型里写明错误与依赖', '单子风格；处理器拿不到续延'],
    ['Haskell 作用库', '完整处理器', '自由单子、ReaderT IO 或 GHC 9.6 定界续延原语，各有取舍']], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, F(c, 0, .2)], [1, F(c, 0, .4)], [2, F(c, 0, .7)], [3, b(1) + .1], [4, F(c, 1, .5)], [5, F(c, 1, .7)]]);
  show(c, concl(120, 790, 1680, 'JS 无法保存调用栈 → React 只能“抛出、等待、重跑” → 组件必须是<b>可以安全重跑的纯函数</b>'), F(c, 1, .65));
});

S('d_limits', c => {
  const { b } = c;
  c.head('08', '局限');
  const L = [['可读性', '交给“最近的处理器”，读代码时未必看得出是哪个：动态绑定的老问题', 0], ['资源安全', '不恢复的续延让清理代码悬着；多次恢复可能让写文件执行两遍', 0], ['可变状态 × 多次恢复', '变量在两次恢复间共享还是各一份，取决于在栈上还是堆上（Koka 区分 var 与 ref）', 0], ['高阶作用', 'catch、带超时运行这类“收一段程序作参数”的操作不是代数的', 1], ['生态边界', '续延一般不能跨过 C 栈帧；调试器要理解分段的栈', 1], ['类型负担', '作用多态让签名变长、报错难读', 1]];
  const g = show(c, `<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">${L.map(([h, d]) => `<div class="mc ll" style="--c:var(--bad)"><h3 style="font-size:28px">${h}</h3><div style="font-size:20px;color:var(--ink2);line-height:1.5">${d}</div></div>`).join('')}</div>`, b(0) + .1);
  const E = [...g.querySelectorAll('.ll')];
  [F(c, 0, .05), F(c, 0, .4), F(c, 0, .75), b(1) + .1, F(c, 1, .4), F(c, 1, .6)].forEach((t, i) => c.in(E[i], t));
  show(c, concl(120, 720, 1680, '这些都是主流语言迟迟没有引入通用作用处理器的原因'), F(c, 1, .82));
});

S('d_use', c => {
  const { b } = c;
  c.head('09', '什么时候值得用');
  const U = [['并发与 I/O 运行时', '直接风格的代码跑在异步内核上（OCaml Eio + io_uring）', K.eff], ['生成器与流', '递归遍历变成外部迭代，遍历代码不改', K.eff], ['可测试的业务代码', '时间、随机数、网络写成操作，测试里换处理器', K.hd], ['解释器、DSL、概率编程', '换一个处理器就换一种解释：执行、模拟、记录、重放', K.kk]];
  const g = show(c, `<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px">${U.map(([h, d, col]) => `<div class="mc uu" style="--c:${col}"><h3 style="font-size:27px">${h}</h3><div style="font-size:20px;color:var(--ink2);line-height:1.5">${d}</div></div>`).join('')}</div>`, b(0) + .1);
  [...g.querySelectorAll('.uu')].forEach((e, i) => c.in(e, F(c, 0, [.08, .3, .45, .62][i])));
  show(c, at(120, 560, 1680, `<div class="mc" style="--c:var(--itp)"><h3 style="font-size:27px">不太值得</h3><ul><li>只是想少传几个参数：显式传参更清楚</li><li>主力语言没有原生支持，只能靠生成器硬模拟</li></ul></div>`), b(1) + .1);
});

S('d_end', c => {
  const { b } = c;
  c.head('10', '结尾');
  const R = [['理论上', '单子的可组合替代', K.eff], ['机制上', '带名字的定界续延', K.kk], ['工程上', '可以恢复的异常', K.hd]];
  const g = show(c, `<div class="col3" style="left:120px;top:260px;width:1680px">${R.map(([h, d, col]) => `<div class="mc rr" style="--c:${col};padding:30px"><div class="s">${h}</div><h3 style="font-size:40px">${d}</h3></div>`).join('')}</div>`, b(0) + .1);
  [...g.querySelectorAll('.rr')].forEach((e, i) => c.in(e, F(c, 0, [.15, .3, .45][i])));
  show(c, at(120, 500, 1680, `<div style="font-size:24px;color:var(--ink2)">实现：<b>栈切换</b>（OCaml 5、Wasm）· <b>证据传递</b>（Koka）· <b>续延传递</b>（编译到 JS）</div>`), F(c, 0, .7));
  show(c, at(120, 620, 1680, `<div class="det" style="position:static;font-size:22px"><span class="h">资料</span>完整文档与参考文献：《代数作用：历史、功能与实现》<br>github.com/Memkits/desk · sources/algebraic-effects</div>`), b(1) + .1);
});
