// 类型标注 · 上集：风格与来历
const PRE = 'var(--vis)', POST = 'var(--edit)', NAME = 'var(--both)', DYN = 'var(--ok)';
const grid = (x, y, w, cols, cards, gap = 16) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${cards.map(h => `<div class="gc">${h}</div>`).join('')}</div>`;
const stag = (c, el, t0, gap) => [...el.querySelectorAll('.gc')].forEach((e, i) => c.in(e, t0 + i * gap, { dy: 10 }));

S('t_open', c => {
  const { b, be } = c;
  show(c, at(120, 170, 1000, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">编程语言专题 · 上集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">类型标注</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">风格与来历</div>`), .1, be(0) + .2);
  show(c, at(1180, 200, 620, `<div class="mc" style="--c:var(--edit)"><div class="s">上集</div><h3>风格与来历</h3><ul><li>六种风格；名字里带类型</li><li>C：声明模仿使用</li><li>Pascal / ML：冒号与推断；Haskell 签名行</li><li>现代收敛</li></ul></div><div class="mc" style="--c:var(--vis);margin-top:16px"><div class="s">下集</div><h3>代价与取舍</h3><ul><li>解析歧义、泛型尖括号</li><li>给动态语言补类型、写在哪里</li><li>设计清单</li></ul></div>`), b(0) + 1.2, be(0) + .2);
  show(c, det(120, 680, 1000, '说明', 'AI 协助整理（稿件与画面：Claude；配音：Gemini TTS，1.25 倍速）。代码示例按各语言常见写法整理，未逐一编译。'), b(0) + 3, be(0) + .2);
  const g = show(c, grid(120, 160, 1680, 3, [
    cc('C', 'char *rep(const char *s, int n);', '1972'),
    cc('Pascal', 'function Rep(s: string; n: Integer): string;', '1970'),
    cc('Go', 'func rep(s string, n int) string', '2009'),
    cc('Rust', 'fn rep(s: &str, n: usize) -> String', '2015'),
    cc('Haskell', 'rep :: String -> Int -> String\nrep s n = concat (replicate n s)', '1990'),
    cc('Ruby · RBS（另一个文件 rep.rbs）', 'def rep: (String s, Integer n) -> String', '2020'),
  ], 18), b(1) + .1);
  stag(c, g, b(1) + .2, 1.6);
  show(c, at(120, 720, 1680, `<div style="font:700 40px var(--serif);text-align:center">同一个函数：接收字符串和整数，返回字符串</div>`), b(1) + .3);
});

S('t_six', c => {
  const { b } = c;
  c.head('01', '六种风格');
  const cat = (n, h, col, code) => `<div class="mc" style="--c:${col};padding:16px 18px"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="font-size:26px">${n} ${h}</h3></div>${code}</div>`;
  const g = show(c, grid(120, 245, 1680, 3, [
    cat('1', '类型在前', PRE, cc('C · Java · C#', 'int n = 0;\nString rep(String s, int n)')),
    cat('2', '在后 + 冒号', POST, cc('Pascal · Rust · TS · Python', 'let n: i32 = 0;\ndef rep(s: str, n: int) -> str:')),
    cat('3', '在后，无冒号', POST, cc('Go', 'var n int = 0\nfunc rep(s string, n int) string')),
    cat('4', 'As 关键字', PRE, cc('Visual Basic', 'Dim n As Integer\nFunction Rep(s As String) As String')),
    cat('5', '签名单独一行', NAME, cc('Haskell · Elm · Erlang', 'rep :: String -> Int -> String\n-spec rep(string(), integer()) -> string().')),
    cat('6', '写在别处', DYN, cc('OCaml .mli · TS .d.ts · Ruby 注释', 'val rep : string -> int -> string\n#: (String, Integer) -> String')),
  ], 18), b(0) + .1);
  const E = [...g.querySelectorAll('.gc')];
  [F(c, 0, .08), F(c, 0, .3), F(c, 0, .78), b(1) + .1, F(c, 1, .3), F(c, 1, .55)].forEach((t, i) => c.in(E[i], t, { dy: 10 }));
});

S('t_name', c => {
  const { b } = c;
  c.head('02', '名字里带类型');
  show(c, at(120, 245, 900, cc('Fortran 77（1957 年起的规则）', `      PROGRAM DEMO
      N = 10            «I–N 开头：整数»
      X = 2.5           «其余字母：实数»
      TOTAL = 0.0
      DO 10 I = 1, N
⟦        TOTL = TOTAL + X⟧  «拼错：静默地多出一个变量»
   10 CONTINUE
      END`, '不声明也能用', { fs: 21 })), b(0) + .1);
  show(c, at(120, 640, 900, cc('Fortran 90', `      IMPLICIT NONE      «关掉隐式类型，所有变量必须声明»
      INTEGER :: N
      REAL    :: X, TOTAL`, '', { fs: 21 })), F(c, 0, .75));
  show(c, at(1080, 245, 720, `<div class="cap" style="margin-bottom:10px">同样的思路</div>`), b(1) + .1);
  const g = show(c, grid(1080, 285, 720, 1, [
    cc('BASIC', 'A$ = "HELLO"     «$ 结尾：字符串»\nN% = 3           «% 结尾：整数»'),
    cc('Perl', 'my $n  = 3;      «$ 标量»\nmy @xs = (1, 2); «@ 数组»\nmy %h  = ();     «% 哈希»'),
    cc('匈牙利命名法', 'int   iCount;\nchar *szName;    «sz：以零结尾的字符串»'),
  ], 14), b(1) + .2);
  stag(c, g, b(1) + .3, 1.2);
  show(c, concl(1080, 820, 720, '类型一多，<b>名字就不够用了</b>'), F(c, 1, .7));
});

S('t_c', c => {
  const { b } = c;
  c.head('03', '声明模仿使用');
  const L = show(c, lin(120, 250, 820, 330, {
    a60: [90, 30, 'ALGOL 60', '1960 · integer i', PRE], a68: [420, 30, 'ALGOL 68', '类型组合', PRE],
    cpl: [90, 120, 'CPL', '1963', PRE], bcpl: [90, 210, 'BCPL', '1967 · 无类型', 'var(--itp)'], bb: [300, 210, 'B', '1969 · 无类型', 'var(--itp)'],
    c: [520, 210, 'C', '1972', PRE], cpp: [520, 300, 'C++', '1985', PRE], java: [720, 300, 'Java · C#', '1995 · 2000', PRE],
  }, [['a60', 'cpl'], ['cpl', 'bcpl'], ['bcpl', 'bb'], ['bb', 'c'], ['a68', 'c', 1], ['c', 'cpp'], ['cpp', 'java']]), b(0) + .1);
  linIn(c, L, [['a60', b(0) + .2], ['cpl', b(0) + .8], ['bcpl', b(0) + 1.4], ['bb', b(0) + 2], ['c', F(c, 0, .35)], ['a68', F(c, 0, .35)], ['cpp', b(2) + .2], ['java', b(2) + .8]]);
  show(c, at(1000, 245, 800, `<div class="mc" style="--c:${PRE};padding:16px 20px"><h3 style="font-size:24px">Ritchie：声明“长得像它在表达式里的用法”</h3>${cc('C', `int *p;        «*p 是一个 int»
int a[3];      «a[i] 是一个 int»
int (*fp)(int, int);           «fp 是什么？»
int (*(*f)(int))(int);         «返回函数指针的函数指针»`, '由内向外读', { fs: 19 })}</div>`), F(c, 0, .55));
  show(c, at(1000, 560, 800, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">${cc('cdecl 翻译', 'declare f as pointer to\nfunction (int) returning\npointer to function (int)\nreturning int', '', { fs: 16 })}${cc('Go 的同一个类型', 'var f func(int) func(int) int\n«从左往右读»', '', { fs: 17 })}</div>`), b(1) + .1);
  show(c, at(120, 640, 820, cc('后来的补丁', `int[] a;                       «Java：数组括号移到类型这边»
var n = 0;                     «C# 3.0（2007）/ Java 10（2018）»
auto x = 1;                    «C++11：推断要另造占位词»
auto f(int x) -> int;          «C++11：尾置返回类型»
int* x, y;                     «坑：只有 x 是指针»`, '', { fs: 18 })), b(2) + .1);
});

S('t_pascal', c => {
  const { b } = c;
  c.head('04', '冒号的来历');
  const L = show(c, lin(120, 250, 820, 360, {
    algol: [90, 30, 'ALGOL W', '1966', 'var(--itp)'], pascal: [90, 130, 'Pascal', '1970 · x: integer', POST],
    modula: [300, 130, 'Modula-2', '1978', POST], oberon: [510, 130, 'Oberon', '1987', POST], go: [720, 130, 'Go', '2009 · 去掉冒号', POST],
    ada: [300, 40, 'Ada', '1983', POST], delphi: [510, 40, 'Delphi', '1995', POST],
    ml: [90, 260, 'ML', '1973 · 推断', POST], ocaml: [300, 260, 'SML · OCaml · F#', '', POST], haskell: [90, 340, 'Haskell', '1990', POST], scala: [510, 260, 'Scala · Rust · Swift', '', POST],
  }, [['algol', 'pascal'], ['pascal', 'modula'], ['modula', 'oberon'], ['oberon', 'go', 1], ['pascal', 'ada', 1], ['pascal', 'delphi', 1], ['ml', 'ocaml'], ['ml', 'haskell'], ['ocaml', 'scala', 1]]), b(0) + .1);
  linIn(c, L, [['algol', b(0) + .2], ['pascal', b(0) + .6], ['modula', F(c, 0, .55)], ['oberon', F(c, 0, .6)], ['ada', F(c, 0, .62)], ['delphi', F(c, 0, .66)], ['go', F(c, 0, .8)], ['ml', b(1) + .2], ['ocaml', F(c, 1, .4)], ['haskell', F(c, 1, .45)], ['scala', F(c, 1, .5)]]);
  show(c, at(1000, 245, 800, cc('Pascal', `var i: integer;
    xs: array[1..10] of integer;
    p: ^Node;
function Area(r: real): real;`, '从左往右读：i 是一个整数', { fs: 20 })), F(c, 0, .2));
  show(c, at(1000, 470, 800, cc('OCaml（ML 家族）', `let rec len = function
  | [] -> 0
  | _ :: t -> 1 + len t
«推断出：val len : 'a list -> int»

let n = (len [1; 2] : int)      «类型归属：任意表达式上可加»
let xs : string option list = []  «类型构造写成后缀»`, '大部分类型可以不写', { fs: 19 })), b(1) + .1);
});

S('t_haskell', c => {
  const { b } = c;
  c.head('05', '签名独占一行');
  show(c, at(120, 245, 820, cc('Haskell', `⟦rep :: String -> Int -> String⟧
rep _ 0 = ""
rep s n = s ++ rep s (n - 1)

⟦len :: [a] -> Int⟧
len []       = 0
len (_ : xs) = 1 + len xs      «: 是列表构造»`, '签名一行，定义可以多个子句', { fs: 21 })), b(0) + .1);
  show(c, at(980, 245, 820, tbl([['', 'ML 家族', 'Haskell 家族'], ['列表构造', '<span class="k">x :: xs</span>', '<span class="k">x : xs</span>'], ['类型标注', '<span class="k">(e : t)</span>', '<span class="k">(e :: t)</span>'], ['来源', 'ML（1973）', '冒号构造来自 Miranda 等前辈']], { st: 'font-size:22px' })), b(1) + .1);
  show(c, det(980, 470, 820, '《A History of Haskell》', '用 <b>:</b> 表示列表构造、用 <b>::</b> 表示类型签名，“当时争议很大”，而且 ML 正好相反。', 'Hudak 等，2007'), F(c, 1, .4));
  const L = show(c, lin(980, 640, 820, 240, {
    miranda: [80, 40, 'Miranda', '1985', NAME], hs: [260, 40, 'Haskell', '1990', NAME], elm: [450, 40, 'Elm', '2012', NAME], ps: [640, 40, 'PureScript', '2013', NAME],
    idris: [450, 140, 'Idris · Agda', '依赖类型', NAME], tr: [640, 140, 'Typed Racket', '(: f (-> A B))', NAME],
  }, [['miranda', 'hs'], ['hs', 'elm'], ['elm', 'ps', 1], ['hs', 'idris', 1]]), F(c, 1, .6));
  linIn(c, L, [['miranda', F(c, 1, .6)], ['hs', F(c, 1, .65)], ['elm', F(c, 1, .72)], ['ps', F(c, 1, .76)], ['idris', F(c, 1, .8)], ['tr', F(c, 1, .84)]]);
});

S('t_modern', c => {
  const { b } = c;
  c.head('06', '现代收敛');
  const g = show(c, grid(120, 245, 1680, 3, [
    cc('Scala', 'val n: Int = 0\ndef rep(s: String, n: Int): String', '2004'),
    cc('Go', 'var n int = 0\nfunc rep(s string, n int) string', '2009'),
    cc('TypeScript', 'let n: number = 0\nfunction rep(s: string, n: number): string', '2012 · 同 ActionScript 3'),
    cc('Swift', 'let n: Int = 0\nfunc rep(_ s: String, _ n: Int) -> String', '2014'),
    cc('Rust', 'let n: i32 = 0;\nfn rep(s: &str, n: usize) -> String', '2015'),
    cc('Kotlin', 'val n: Int = 0\nfun rep(s: String, n: Int): String', '2016 · 取代 Java，却不用 Java 的前置'),
  ], 16), b(0) + .1);
  const E = [...g.querySelectorAll('.gc')];
  [F(c, 0, .05), F(c, 0, .18), F(c, 0, .5), F(c, 0, .8), F(c, 0, .84), F(c, 0, .88)].forEach((t, i) => c.in(E[i], t, { dy: 10 }));
  const R = [['类型推断成标配', 'let x = 1\nlet x: i32 = 1     «同一语法，标注可选»\nauto x = 1;        «前置：要另造占位词»'], ['名字比类型重要', 'handlers: HashMap<String, Vec<Box<dyn Fn()>>>\n«类型再长，名字仍在最左»'], ['解析更简单', 'let / val / fn / func\n«第一个词就宣告：这是声明»'], ['兼容动态语言', 'def f(x):          «旧代码»\ndef f(x: int):     «加上类型，其他不变»']];
  const r = show(c, grid(120, 560, 1680, 4, R.map(([h, code]) => `<div class="mc" style="--c:${POST};padding:14px 16px"><h3 style="font-size:24px">${h}</h3>${cc('', code, '', { fs: 15 })}</div>`), 14), b(1) + .1);
  stag(c, r, b(1) + .3, 2.2);
});

S('t_end', c => {
  const { b } = c;
  c.head('07', '上集小结');
  const L = show(c, lin(120, 250, 1680, 470, {
    fortran: [120, 50, 'Fortran', '1957 · 首字母定类型', NAME], basic: [400, 50, 'BASIC  A$', '', NAME], perl: [640, 50, 'Perl  $ @ %', '', NAME], hung: [900, 50, '匈牙利命名法', '', NAME],
    algol: [120, 190, 'ALGOL 60', 'integer i', PRE], c: [400, 190, 'C', '声明模仿使用', PRE], cpp: [640, 190, 'C++ · Java · C#', '', PRE], patch: [930, 190, 'var · auto', '补丁', PRE],
    pascal: [120, 330, 'Pascal · ML', 'x : T', POST], hs: [400, 410, 'Haskell', '签名单独一行 ::', NAME], go: [640, 330, 'Go', 'x T', POST], modern: [1000, 330, 'Scala · Swift · Rust · Kotlin · TS', 'x: T + 推断', POST], py: [1420, 330, 'Python · Luau', '给动态语言补 : T', DYN],
  }, [['fortran', 'basic', 1], ['basic', 'perl', 1], ['perl', 'hung', 1], ['algol', 'c'], ['c', 'cpp'], ['cpp', 'patch'], ['pascal', 'go'], ['go', 'modern'], ['modern', 'py', 1], ['pascal', 'hs'], ['algol', 'pascal', 1]]), b(0) + .1);
  linIn(c, L, [['fortran', F(c, 0, .1)], ['basic', F(c, 0, .15)], ['perl', F(c, 0, .2)], ['hung', F(c, 0, .25)], ['algol', F(c, 0, .35)], ['c', F(c, 0, .4)], ['cpp', F(c, 0, .45)], ['patch', F(c, 0, .5)], ['pascal', F(c, 0, .65)], ['hs', F(c, 0, .7)], ['go', F(c, 0, .72)], ['modern', F(c, 0, .78)], ['py', F(c, 0, .85)]]);
  show(c, at(120, 760, 1680, `<div class="mc" style="--c:${PRE};display:grid;grid-template-columns:260px 1fr;gap:20px;align-items:center"><div><div class="s">下集</div><h3>代价与取舍</h3></div><div style="font-size:22px;color:var(--ink2);line-height:1.6">解析歧义 · 泛型尖括号 · 推断与占位词 · 给动态语言补类型 · 写在哪里 · 设计清单</div></div>`), b(1) + .1);
});
