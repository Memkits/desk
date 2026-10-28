// 类型标注 · 下集：代价与取舍
const PRE = 'var(--vis)', POST = 'var(--edit)', NAME = 'var(--both)', DYN = 'var(--ok)';
const grid = (x, y, w, cols, cards, gap = 16) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${cards.map(h => `<div class="gc">${h}</div>`).join('')}</div>`;
const stag = (c, el, t0, gap) => [...el.querySelectorAll('.gc')].forEach((e, i) => c.in(e, t0 + i * gap, { dy: 10 }));

S('u_open', c => {
  const { b } = c;
  show(c, at(120, 170, 1000, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">编程语言专题 · 下集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">类型标注</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">代价与取舍</div>`), .1, c.be(0) + .2);
  const D = [['位置', 'int n · n: Int'], ['分隔符', '无 · : · :: · As'], ['返回类型', ': T · -> T · return T'], ['泛型括号', '<T> · [T] · List T'], ['修饰符', '*T · []T · T? · int[]'], ['省略程度', '必须 · 局部 · 全局推断'], ['写在哪里', '代码 · 注释 · 接口文件'], ['运行时含义', '擦除 · 检查 · 分派 · 提示']];
  const g = show(c, grid(120, 200, 1680, 4, D.map(([h, e], i) => `<div class="mc" style="--c:${[PRE, POST, POST, PRE, PRE, POST, DYN, DYN][i]};padding:18px 20px"><div class="k cap">0${i + 1}</div><h3 style="font-size:30px">${h}</h3><div style="font:500 19px var(--mono);color:var(--ink2)">${esc(e)}</div></div>`), 18), b(1) + .05);
  stag(c, g, b(1) + .1, .45);
  show(c, concl(120, 640, 1680, '最硬的代价不在好不好看，而在<b>解析器和工具</b>'), F(c, 1, .8));
});

S('u_parse', c => {
  const { b } = c;
  c.head('01', '这是不是类型');
  show(c, at(120, 245, 820, cc('C', `T * x;       «T 是 typedef：声明指针 x»
             «T 是变量：T 乘以 x»
(T)(x);      «强制转换？还是函数调用？»`, '要先查符号表才能解析', { fs: 22 })), b(0) + .1);
  show(c, at(120, 470, 820, `<div class="mc" style="--c:var(--bad)"><h3 style="font-size:26px">lexer hack</h3><div style="font-size:20px;color:var(--ink2);line-height:1.5">词法分析器回头查符号表，把 typedef 过的名字标成“类型名”，语法分析才能继续。</div></div>`), F(c, 0, .6));
  show(c, at(980, 245, 820, cc('C++：最令人烦恼的解析', `Foo bar(Baz());   «想要：用临时 Baz 初始化 bar»
                  «实际：声明函数 bar»
Foo bar{Baz()};   «C++11 起用花括号绕开»`, '', { fs: 21 })), b(1) + .1);
  show(c, at(980, 500, 820, cc('有引导关键字的语言', `let p: *const T = ptr;     «Rust»
var x int                  «Go»
val f: (Int) -> Int = ::g  «Kotlin»`, '第一个词就说明：这是声明', { fs: 21 })), F(c, 1, .55));
  show(c, concl(120, 760, 1680, '根源：声明没有引导关键字，只能靠“开头是不是类型”来判断'), F(c, 1, .4));
});

S('u_generic', c => {
  const { b } = c;
  c.head('02', '尖括号难题');
  show(c, at(120, 245, 820, cc('Go FAQ 的例子', `a, b = w < x, y > (z)
«读法一：a = w < x；b = y > (z)»
«读法二：a, b = (w<x, y>)(z)  泛型调用»`, '不看类型就无法决定', { fs: 22 })), b(0) + .1);
  show(c, at(120, 470, 820, cc('Go 1.18（2022）：方括号', `func Map[T, U any](xs []T, f func(T) U) []U
ys := Map[int, string](xs, strconv.Itoa)`, '“不需要类型信息就能解析”', { fs: 20 })), F(c, 0, .65));
  const g = show(c, grid(980, 245, 820, 1, [
    cc('Rust：涡轮鱼', `let n = "5".parse::<i32>();
«测试用例 bastion-of-the-turbofish：»
«(the<guardian, stands>(resolute))»`, '', { fs: 19 }),
    cc('C++', `vector<vector<int>> v;          «C++11 前要写 > >»
typename T::value_type x;       «告诉编译器这是类型»
obj.template get<int>();        «告诉编译器这是模板»`, '', { fs: 19 }),
    cc('TypeScript（.tsx）', `const id = <T,>(x: T) => x;     «<T> 会被当成 JSX»
const n = value as number;      «取代 <number>value»`, '', { fs: 19 }),
  ], 14), b(1) + .1);
  stag(c, g, b(1) + .2, 3.2);
  show(c, at(120, 740, 820, `<div style="font-size:20px;color:var(--ink2)">绕开括号的另一种办法：空格应用 <span class="k">Maybe Int</span>（Haskell）、<span class="k">int option</span>（ML）</div>`), F(c, 1, .85));
});

S('u_infer', c => {
  const { b } = c;
  c.head('03', '推断与占位词');
  show(c, at(120, 245, 820, cc('类型在后：标注只是可选的一段', `let x = 1;            «Rust»
let x: i32 = 1;

val x = 1             «Kotlin»
val x: Int = 1

let x = 1             «TypeScript»
let x: number = 1`, '', { fs: 21 })), b(0) + .1);
  show(c, at(980, 245, 820, cc('类型在前：另造占位词', `auto x = 1;           «C++11»
int  x = 1;

var x = 1;            «C# 3.0 / Java 10»
int x = 1;`, '', { fs: 21 })), F(c, 0, .55));
  show(c, at(120, 580, 820, cc('局部推断（Rust、Go、Swift、Kotlin）', `fn total(xs: &[i32]) -> i32 {   «边界必须写»
    let s = xs.iter().sum();    «内部可省»
    s
}`, '签名即文档，错误留在局部', { fs: 20 })), b(1) + .1);
  show(c, at(980, 580, 820, cc('全局推断（Haskell、ML）', `total xs = sum xs
«推断：total :: Num a => [a] -> a»
«签名可以完全不写；出错时，报错可能离原因很远»`, '', { fs: 20 })), F(c, 1, .35));
});

S('u_dyn', c => {
  const { b } = c;
  c.head('04', '给动态语言补类型');
  show(c, at(120, 240, 1680, `<div class="mc" style="--c:${DYN};padding:14px 20px;display:flex;gap:24px;align-items:center"><b style="font-size:24px">渐进类型（Siek 与 Taha，2006）</b><span style="font-size:20px;color:var(--ink2)">用一个“未知”类型 <span class="k">Any / ?</span> 把静态代码和动态代码接起来</span></div>`), b(0) + .1);
  const g = show(c, grid(120, 350, 1680, 4, [
    `<div class="mc" style="--c:var(--itp);padding:14px 16px"><h3 style="font-size:24px">一 · 优化提示</h3>${cc('Common Lisp', '(defun f (x)\n  (declare (fixnum x))\n  (* x 2))', '', { fs: 16 })}${cc('Clojure', '(defn len [^String s]\n  (.length s))  ; 避免反射', '', { fs: 16, st: 'margin-top:10px' })}</div>`,
    `<div class="mc" style="--c:${POST};padding:14px 16px"><h3 style="font-size:24px">二 · 外部检查，运行时忽略</h3>${cc('Python', 'def rep(s: str, n: int) -> str:\n    return s * n\nrep(1, 2)  # 运行不报错', '', { fs: 16 })}${cc('TypeScript', 'let n: number = 0\n// 编译后：let n = 0', '', { fs: 16, st: 'margin-top:10px' })}</div>`,
    `<div class="mc" style="--c:${PRE};padding:14px 16px"><h3 style="font-size:24px">三 · 运行时也检查</h3>${cc('PHP 7', 'declare(strict_types=1);\nfunction rep(string $s,\n             int $n): string\nrep(1, 2); // TypeError', '', { fs: 16 })}</div>`,
    `<div class="mc" style="--c:${NAME};padding:14px 16px"><h3 style="font-size:24px">四 · 参与语义</h3>${cc('Julia：多重分派', 'area(s::Circle) = π * s.r^2\narea(s::Square) = s.a^2\narea(x)  # 按类型选方法', '', { fs: 16 })}</div>`,
  ], 16), b(1) + .1);
  stag(c, g, b(1) + .2, 2.6);
});

S('u_where', c => {
  const { b } = c;
  c.head('05', '写在哪里');
  const g = show(c, grid(120, 245, 1680, 3, [
    cc('rep.rbs（Ruby 3.0，2020）', 'class Greeter\n  def rep: (String, Integer) -> String\nend', '另一个文件', { fs: 19 }),
    cc('Sorbet sig（2019）', 'sig { params(s: String, n: Integer)\n        .returns(String) }\ndef rep(s, n) = s * n', '代码里的 DSL', { fs: 19 }),
    cc('RBS 注释（Sorbet，2025）', '#: (String, Integer) -> String\ndef rep(s, n) = s * n', '注释', { fs: 19 }),
  ], 16), b(0) + .1);
  stag(c, g, b(0) + .3, 3.5);
  show(c, det(120, 470, 1680, 'Shopify 2025', '开发者觉得 sig 太啰嗦，调查里近 <b>75%</b> 的人希望更易读的语法；运行时检查也带来开销。于是 Sorbet 支持了写在注释里的 RBS（目前为实验特性）。', 'railsatscale.com，2025-04'), F(c, 0, .7));
  const h = show(c, grid(120, 600, 1680, 3, [
    cc('TypeScript', 'function rep(s: string, n: number): string', '代码里，编译时擦除', { fs: 18 }),
    cc('index.d.ts', 'declare function rep(s: string,\n                     n: number): string;', '给纯 JS 库的接口文件', { fs: 18 }),
    cc('TC39 提案（Stage 1）', 'let x: string;     // 引擎当注释跳过\nfunction eq(a: number, b: number): boolean', '“类型即注释”', { fs: 18 }),
  ], 16), b(1) + .1);
  stag(c, h, b(1) + .2, 3);
});

S('u_order', c => {
  const { b } = c;
  c.head('06', '先标注还是先推断');
  const T = [['2006', 'PEP 3107', 'def f(x: "anything") -> 42:   # 只有语法，含义不定'], ['2014', 'PEP 484', 'def f(x: int) -> int:          # 定为类型提示（mypy）'], ['2016', 'PEP 526', 'n: int = 0                     # 变量注解'], ['2023', 'PEP 695', 'def first[T](xs: list[T]) -> T:'], ['2025', 'PEP 649', 'def f(x: Node) -> Node: ...    # 3.14：读取时才求值，前向引用不用引号']];
  show(c, at(120, 245, 1100, `<div class="cap" style="margin-bottom:8px">Python：先给语法，再补含义</div>` + tbl([['年份', 'PEP', '代码'], ...T.map(([y, p, code]) => [y, p, `<span class="k" style="font-size:17px">${esc(code)}</span>`])], { st: 'font-size:19px' })), b(0) + .1);
  show(c, at(120, 640, 1100, cc('3.14 之前的前向引用', 'class Node:\n    def next(self) -> "Node": ...   # 只好写成字符串', '', { fs: 18 })), F(c, 0, .6));
  show(c, at(1260, 245, 540, `<div class="mc" style="--c:${DYN}"><div class="s">Elixir：先推断，再给语法</div><h3 style="font-size:26px">集合论类型</h3><ul><li>2022 年宣布，2023 年发表设计论文</li><li>不引入任何标注，对已有程序推断与渐进检查</li><li><b>Elixir 1.20（2026-06）</b>完成这一阶段</li><li>用户写的类型签名：仍在计划中</li></ul></div>`), b(1) + .1);
  show(c, at(1260, 640, 540, cc('现有的 @spec（供 Dialyzer）', '@spec rep(String.t(), integer())\n      :: String.t()', '', { fs: 17 })), F(c, 1, .55));
});

S('u_check', c => {
  const { b } = c;
  c.head('07', '设计清单');
  const t = show(c, at(120, 245, 1000, tbl([['问题', '默认建议'], ['声明怎么开头', '关键字引导：let / fn'], ['类型放哪', '名字后面，用冒号'], ['返回类型', '与函数类型写法一致：-> T'], ['泛型括号', '[T] 或空格应用，避开 <'], ['修饰符', '统一一侧，从左往右读：?T、[]T'], ['哪里必须写', '导出函数的边界；局部可省'], ['写在哪里', '代码里；可生成接口文件'], ['运行时', '静态检查 + 动态边界插检查'], ['标注求值', '独立的类型语法，延迟求值']], { st: 'font-size:20px' })), b(0) + .1);
  rowsIn(c, t, [[0, F(c, 0, .1)], [1, F(c, 0, .25)], [2, F(c, 0, .45)], [3, F(c, 0, .62)], [4, F(c, 0, .8)], [5, b(1) + .1], [6, F(c, 1, .3)], [7, F(c, 1, .45)], [8, F(c, 1, .55)]]);
  show(c, at(1160, 245, 640, cc('一个最小参考语法', `let n = 0                      // 推断
let m: Int = 0                 // 归属，可选
fn rep(s: String, n: Int) -> String
fn map[T, U](xs: List[T],
             f: (T) -> U) -> List[U]
let name: ?String = none       // 前置修饰`, '示意', { fs: 19 })), F(c, 0, .5));
  show(c, det(1160, 560, 640, '例外', '要和 C 紧密互通、类型要参与分派（Julia）、或者是依赖类型语言（类型即表达式）时，结论会不同。'), F(c, 1, .75));
});

S('u_lisp', c => {
  const { b } = c;
  c.head('08', 'Lisp 与结构化编辑');
  const g = show(c, grid(120, 245, 1680, 3, [
    cc('Typed Racket', '(: rep (-> String Integer String))\n(define (rep s n)\n  (string-append* (make-list n s)))', '签名单独一行', { fs: 18 }),
    cc('Clojure', '(defn rep ^String\n  [^String s ^long n]\n  (apply str (repeat n s)))', '元数据贴在参数上', { fs: 18 }),
    cc('Common Lisp', '(defun rep (s n)\n  (declare (string s)\n           (fixnum n))\n  …)', '声明形式', { fs: 18 }),
  ], 16), b(0) + .1);
  stag(c, g, b(0) + .3, 2);
  // 结构化编辑：树节点带类型属性
  const node = (x, y, t, ty) => `<div class="abs" style="left:${x}px;top:${y}px;padding:10px 16px;border-radius:10px;background:var(--surface);border:2px solid var(--edit);white-space:nowrap;font:600 22px var(--mono)">${t}${ty ? `<span style="margin-left:10px;font:600 15px var(--sans);color:#fff;background:var(--both);border-radius:6px;padding:2px 8px">${ty}</span>` : ''}</div>`;
  show(c, `<div class="abs" style="left:0;top:0">${node(140, 540, 'defn rep', '(String, Int) -> String')}${node(120, 680, 's', 'String')}${node(330, 680, 'n', 'Int')}${node(530, 680, 'repeat n s', '')}<svg class="abs" style="left:0;top:0;overflow:visible" width="1" height="1"><line x1="300" y1="592" x2="170" y2="680" stroke="#8A929B" stroke-width="2"/><line x1="320" y1="592" x2="380" y2="680" stroke="#8A929B" stroke-width="2"/><line x1="340" y1="592" x2="600" y2="680" stroke="#8A929B" stroke-width="2"/></svg></div>`, b(1) + .1);
  show(c, at(980, 540, 820, `<div class="mc" style="--c:${NAME}"><h3 style="font-size:28px">类型作为节点的属性</h3><ul><li>不存在解析歧义；取舍在“单独一行”还是“贴在参数上”</li><li>结构化编辑器里，类型可以不出现在文本中，由编辑器决定何时显示</li><li>比文本语法留下更大的设计空间</li></ul></div>`), F(c, 1, .45));
  show(c, at(120, 780, 820, `<div style="font-size:16px;color:var(--ink3)">示意：树状编辑器中的类型属性</div>`), b(1) + .3);
});

S('u_end', c => {
  const { b } = c;
  c.head('09', '结尾');
  show(c, at(120, 260, 1680, `<div class="flow" style="position:static;justify-content:center">${[['名字携带类型', 'Fortran · BASIC · Perl', NAME], ['类型在前，声明模仿使用', 'ALGOL · C 家族', PRE], ['类型在后，可以推断', 'Pascal · ML · 今天的新语言', POST]].map(([a, s, col], i) => `${i ? '<span class="ar">→</span>' : ''}<div class="st" style="--c:${col};font-size:26px;padding:16px 22px">${a}<small style="font-size:16px">${s}</small></div>`).join('')}</div>`), b(0) + .1);
  show(c, at(120, 420, 1680, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px"><div class="mc" style="--c:${POST}"><h3 style="font-size:28px">收敛的动力</h3><div style="font-size:22px;color:var(--ink2)">类型推断 · 名字优先的可读性 · 更简单的解析</div></div><div class="mc" style="--c:${PRE}"><h3 style="font-size:28px">仍在分歧</h3><div style="font-size:22px;color:var(--ink2)">泛型括号 · 写在哪里 · 运行时管不管</div></div></div>`), F(c, 0, .55));
  show(c, at(120, 640, 1680, `<div class="det" style="position:static;font-size:22px"><span class="h">资料</span>调研文档《类型标注：风格与历史脉络》与参考资料 · github.com/Memkits/desk · sources/type-annotations</div>`), b(1) + .1);
});
