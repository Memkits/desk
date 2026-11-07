// 下集动画：跨语言横评
const LG = { go: '#5CB4FF', rs: '#FFB25C', cc: '#C79BFF', jv: '#FF7A93' };
AN.map2 = (g, t, R, st) => {
  const k = st.k, cx = R.x + R.w / 2, cy = R.y + 400;
  const N = [['Go', 'encoding/json/v2 · sonic · …', LG.go, -1, -1], ['Rust', 'serde_json · simd-json · sonic-rs · facet', LG.rs, 1, -1], ['C / C++', 'simdjson · yyjson · glaze', LG.cc, 1, 1], ['Java', 'JEP 540 · Jackson · Gson', LG.jv, -1, 1]];
  g.save(); g.globalAlpha = pop(t, .3); dot(g, cx, cy, 70, 'rgba(255,210,122,.12)'); txt(g, 'JSON', cx, cy, C.gold, fnt(900, 40, 'mono'), 'center'); g.restore();
  N.forEach(([a, b, col, sx, sy], i) => { const u = pop(t, .8 + i * .6), X = cx + sx * 420, Y = cy + sy * 210; line(g, [[cx + sx * 70, cy + sy * 30], [X - sx * 200, Y]], col, 2, [6, 6]); g.save(); g.globalAlpha = u; rr(g, X - 260, Y - 70, 520, 140, 20, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X, Y - 22, col, fnt(800, 34), 'center'); txt(g, b, X, Y + 30, C.fg2, fnt(500, 20, 'mono'), 'center'); g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .3); ['Go 生态', 'Rust', 'C/C++', 'Java', '原理', '写法', '对比', '选择'].forEach((s, i) => { g.save(); g.globalAlpha = u * pop(st.tk, .3 + i * .25); chip(g, s, R.x + 40 + i * 205, R.y + R.h - 30, C.fg3, 1, 22); g.restore(); }); }
};
AN.golibs = (g, t, R, st) => {
  const k = st.k; hdr(g, R, 'v2 之前：Go 社区的提速方案');
  const L = [['json-iterator', '与标准库同接口，直接替换', '反射 + 缓存', 0], ['easyjson', '为每个类型预先生成代码', '代码生成', 0], ['goccy/go-json', '激进的类型缓存与优化', '反射优化', 1], ['segmentio/encoding', '同接口，减少分配', '反射优化', 1], ['bytedance/sonic', '运行时生成机器码 + SIMD（amd64 / arm64）', 'JIT + SIMD', 1]];
  L.forEach(([a, b, tg, kk], i) => { if (k < kk) return; const u = pop(kk ? st.tk : t, .4 + (kk ? i - 2 : i) * .8), Y = R.y + 110 + i * 136; g.save(); g.globalAlpha = u; g.translate((1 - u) * 40, 0); rr(g, R.x + 20, Y, R.w - 40, 116, 16, 'rgba(14,20,36,.92)', i === 4 ? C.gold : LG.go, i === 4 ? 3 : 2); txt(g, a, R.x + 50, Y + 40, C.fg, fnt(800, 28, 'mono')); txt(g, b, R.x + 50, Y + 84, C.fg2, fnt(500, 22)); chip(g, tg, R.x + R.w - 250, Y + 58, i === 4 ? C.gold : C.fg3, 1, 20); g.restore(); });
};
AN.jsonbench = (g, t, R, st) => {
  const k = st.k; hdr(g, R, k ? '速度的代价：跟着 Go 版本适配' : 'v2 之后：快，还要对', k ? '' : 'go-json-experiment/jsonbench');
  if (k === 0) {
    const cols = ['重复键', '无效 UTF-8', '大小写', '…'], libs = ['json/v2', '某些第三方库'];
    const x = R.x + 360, w = (R.w - 420) / cols.length;
    cols.forEach((c, j) => txt(g, c, x + j * w + w / 2, R.y + 150, C.fg2, fnt(700, 24), 'center'));
    libs.forEach((l, i) => { const Y = R.y + 230 + i * 150; txt(g, l, R.x + 20, Y, C.fg, fnt(800, 28, i ? 'sans' : 'mono')); cols.forEach((c, j) => { const u = pop(t, .8 + i * 1.2 + j * .3); if (j === 3) { g.save(); g.globalAlpha = u; txt(g, '…', x + j * w + w / 2, Y, C.fg3, fnt(700, 30), 'center'); g.restore(); return; } if (i === 0) ticks(g, x + j * w + w / 2 - 14, Y, u); else if (j < 2) cross(g, x + j * w + w / 2, Y, u); else { g.save(); g.globalAlpha = u; txt(g, '不一致', x + j * w + w / 2, Y, C.o, fnt(700, 22), 'center'); g.restore(); } }); });
    g.save(); g.globalAlpha = pop(t, 4); txt(g, '示意：不同库在边界情况上的表现各不相同，详见 jsonbench 的结果表', R.x + 20, R.y + 600, C.fg3, fnt(500, 21)); g.restore();
  } else {
    const V = ['1.25', '1.26', '1.27', '1.28'], x0 = R.x + 80, x1 = R.x + R.w - 80, y = R.y + 300;
    line(g, [[x0, y], [x1, y]], C.line2, 4);
    V.forEach((v, i) => { const X = LERP(x0, x1, i / 3), u = pop(st.tk, .3 + i * .5); g.save(); g.globalAlpha = u; dot(g, X, y, 10, LG.go); txt(g, 'Go ' + v, X, y - 40, LG.go, fnt(800, 26, 'mono'), 'center'); rr(g, X - 110, y + 50, 220, 80, 12, 'rgba(255,178,92,.08)', C.o, 2); txt(g, '适配新运行时', X, y + 90, C.o, fnt(700, 22), 'center'); g.restore(); });
    banner(g, R, '依赖运行时内部细节的库：每个 Go 版本都要跟进', pop(st.tk, 2.5), C.o);
  }
};
AN.rustlibs = (g, t, R) => {
  hdr(g, R, 'Rust：追求极致速度的两个库');
  const L = [['simd-json', ['C++ simdjson 的 Rust 移植', 'SIMD：一次处理几十个字节', '提供 serde 兼容接口'], LG.rs], ['sonic-rs（字节跳动）', ['SIMD 解析与序列化', '按需解析：LazyValue、惰性迭代', '兼容 serde：直接解析到结构体'], C.gold]];
  const w = (R.w - 60) / 2;
  L.forEach(([h, ls, col], i) => card(g, R.x + 20 + i * (w + 20), R.y + 120, w, 360, h, ls, col, pop(t, .4 + i * 1.2), false, 24));
  // SIMD 示意：一次比较 16 个字节
  const s = '{"id":1,"name":"zoe"}', y = R.y + 560, cw = 52, x0 = R.x + 40; const u = pop(t, 3);
  g.save(); g.globalAlpha = u; txt(g, '一条指令比较 16 个字节，得到“哪些位置是引号”的位掩码（示意）', x0, y - 30, C.fg3, fnt(500, 21));
  [...s.slice(0, 16)].forEach((ch, i) => { const hit = ch === '"'; const on = SS((t - 3.5) * 2) ; rr(g, x0 + i * cw, y, cw - 6, 56, 8, hit && on > .5 ? 'rgba(255,210,122,.25)' : C.panel, hit && on > .5 ? C.gold : C.line2, 1.5); txt(g, ch, x0 + i * cw + cw / 2 - 3, y + 28, C.fg, fnt(700, 26, 'mono'), 'center'); txt(g, hit ? '1' : '0', x0 + i * cw + cw / 2 - 3, y + 86, hit ? C.gold : C.fg3, fnt(700, 22, 'mono'), 'center'); });
  g.restore();
};
AN.facet = (g, t, R, st) => {
  const k = st.k; hdr(g, R, 'facet：把反射带回 Rust', '编译期只生成“形状”，运行时按形状处理');
  const x = R.x + 40, half = (R.w - 120) / 2;
  [['serde：编译期展开', ['每个类型 × 每种格式 → 生成代码', '运行很快', '代码量大，编译慢'], LG.rs], ['facet：形状 + 运行时', ['每个类型 → 一份形状描述', '各种格式共用同一套逻辑', '更通用，生成的代码更少'], C.p]].forEach(([h, ls, col], i) => card(g, x + i * (half + 40), R.y + 120, half, 300, h, ls, col, pop(t, .4 + i * 1.2), false, 23));
  if (k >= 1) { const D = [['serde_json', 1, LG.rs], ['facet-json（初期）', 6, C.bad], ['facet-json + 二级 JIT', .85, C.p]], X = x + 360, w = R.w - 560, M = 7;
    txt(g, '相对耗时（示意，以 serde_json 为 1）', x, R.y + 470, C.fg3, fnt(500, 21));
    D.forEach(([a, v, col], i) => { const Y = R.y + 510 + i * 90, u = pop(st.tk, .5 + i * 1.3); g.save(); g.globalAlpha = u; txt(g, a, x, Y + 22, C.fg, fnt(700, 24, 'mono')); rr(g, X, Y, w * v / M * SS(u), 44, 10, col); txt(g, i === 1 ? '慢 5–7×' : i === 2 ? '部分测试更快' : '1×', X + w * v / M + 14, Y + 22, col, fnt(800, 22), 'left'); g.restore(); }); }
};
AN.twostage = (g, t, R) => {
  hdr(g, R, 'simdjson 的两阶段解析', 'Langdale & Lemire, 2019');
  const s = '{"a":[1,2],"b":"x"}', cw = 64, x0 = R.x + 40, y = R.y + 180;
  [...s].forEach((ch, i) => { const st = '{}[]:,"'.includes(ch), u = SS((t - 1 - i * .08) * 3); rr(g, x0 + i * cw, y, cw - 6, 66, 8, st && u > .5 ? 'rgba(92,180,255,.22)' : C.panel, st && u > .5 ? LG.go : C.line2, 1.5); txt(g, ch, x0 + i * cw + cw / 2 - 3, y + 33, C.fg, fnt(700, 30, 'mono'), 'center'); });
  g.save(); g.globalAlpha = pop(t, .5); txt(g, '阶段 1 · SIMD：一次扫过，找出所有结构字符的位置', x0, y - 40, LG.go, fnt(800, 26)); g.restore();
  const idx = [...s].map((ch, i) => '{}[]:,"'.includes(ch) ? i : -1).filter(i => i >= 0);
  g.save(); g.globalAlpha = pop(t, 3); txt(g, '结构索引', x0, y + 130, C.fg3, fnt(600, 22)); idx.forEach((i, j) => chip(g, String(i), x0 + 130 + j * 76, y + 130, LG.go, 1, 20)); g.restore();
  g.save(); g.globalAlpha = pop(t, 4.5); txt(g, '阶段 2：沿索引跳着走，构建结果（树或按需访问）', x0, y + 250, C.g, fnt(800, 26));
  const ph = CL((t - 5) / 4); const pts = idx.map(i => [x0 + i * cw + cw / 2 - 3, y + 70]); if (pts.length) { for (let j = 0; j < pts.length - 1; j++) if (j / (pts.length - 1) < ph) { const [a, b] = [pts[j], pts[j + 1]]; g.strokeStyle = C.g; g.lineWidth = 3; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, a[1] + 40, b[0], b[1]); g.stroke(); } }
  g.restore();
  g.save(); g.globalAlpha = pop(t, 6); rr(g, x0, y + 320, R.w - 80, 150, 16, 'rgba(14,20,36,.9)', C.line2); txt(g, '为什么快：', x0 + 30, y + 360, C.fg, fnt(800, 25)); txt(g, '第一阶段几乎没有分支，CPU 流水线不被打断；第二阶段不用逐字节判断', x0 + 30, y + 420, C.fg2, fnt(600, 23)); g.restore();
};
AN.ondemand = (g, t, R) => {
  hdr(g, R, '按需解析（On-Demand）', '只取 doc["user"]["name"]');
  const x = R.x + 40, y = R.y + 130, w = R.w - 80;
  const keys = ['"meta"', '"items"', '"user"', '"tags"', '"stats"'], hit = 2;
  [['先建整棵树（DOM）', C.fg3, 0], ['按需：访问到哪，解析到哪', C.g, 1]].forEach(([h, col, j]) => { const Y = y + j * 320; txt(g, h, x, Y + 20, col, fnt(800, 26));
    keys.forEach((kk, i) => { const X = x + i * (w / 5), bw = w / 5 - 20, u = j ? (i <= hit ? SS((t - 2 - i * .7) * 2) : 0) : SS((t - .5 - i * .3) * 2); rr(g, X, Y + 60, bw, 180, 14, C.panel, C.line2); rr(g, X, Y + 60, bw, 180 * u, 14, j ? (i === hit ? 'rgba(95,224,160,.35)' : 'rgba(95,224,160,.12)') : 'rgba(163,174,195,.18)');
      txt(g, kk, X + bw / 2, Y + 150, i === hit && j ? C.g : C.fg2, fnt(700, 24, 'mono'), 'center'); if (j && i < hit && u > .9) txt(g, '跳过', X + bw / 2, Y + 200, C.fg3, fnt(600, 19), 'center'); if (j && i > hit) txt(g, '不碰', X + bw / 2, Y + 200, C.fg3, fnt(600, 19), 'center'); }); });
};
AN.cpplibs = (g, t, R) => {
  hdr(g, R, 'C / C++ 的另外两种思路');
  const w = (R.w - 60) / 2;
  card(g, R.x + 20, R.y + 120, w, 380, 'yyjson（C）', ['纯 C，容易嵌入', '数据布局与分支精心设计', '公布的测试里与 simdjson 不相上下'], LG.cc, pop(t, .4), false, 24);
  card(g, R.x + 40 + w, R.y + 120, w, 380, 'glaze（C++）', ['编译期反射', 'JSON ⇄ 结构体直接转换', '读写都很快'], C.gold, pop(t, 1.6), false, 24);
  // yyjson README 数字
  const D = [['yyjson', 1.72], ['simdjson（DOM）', 1.52], ['rapidjson', .26]], x = R.x + 320, W = R.w - 480;
  g.save(); g.globalAlpha = pop(t, 3); txt(g, 'twitter.json 解析（GB/s）· yyjson README · AMD EPYC 7R32', R.x + 20, R.y + 560, C.fg3, fnt(500, 20));
  D.forEach(([a, v], i) => { const Y = R.y + 600 + i * 64, u = pop(t, 3.4 + i * .5); txt(g, a, R.x + 20, Y + 20, C.fg, fnt(700, 23, 'mono')); rr(g, x, Y, W * v / 2 * SS(u), 40, 8, i ? (i === 1 ? LG.go : C.fg3) : LG.cc); txt(g, v.toFixed(2), x + W * v / 2 + 14, Y + 20, C.fg2, fnt(800, 22, 'mono')); }); g.restore();
};
AN.java = (g, t, R, st) => {
  const k = st.k; hdr(g, R, 'JEP 540：JDK 里的简单 JSON API', 'jdk.incubator.json（孵化）');
  const cx = R.x + R.w / 2;
  // 树
  const N = [[cx, R.y + 180, 'JsonObject'], [cx - 300, R.y + 330, 'JsonArray'], [cx, R.y + 330, 'JsonString'], [cx + 300, R.y + 330, 'JsonNumber'], [cx - 430, R.y + 470, 'JsonBoolean'], [cx - 170, R.y + 470, 'JsonNull']];
  [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]].forEach(([a, b], i) => line(g, [[N[a][0], N[a][1] + 30], [N[b][0], N[b][1] - 30]], C.line2, 2));
  N.forEach(([x, y, s], i) => node(g, x - 110, y - 30, 220, 60, s, LG.jv, pop(t, .4 + i * .3)));
  g.save(); g.globalAlpha = pop(t, 2.5); txt(g, '不可变 · 线程安全 · 严格遵守 RFC 8259', cx + 160, R.y + 470, C.fg2, fnt(600, 22)); g.restore();
  if (k >= 1) { const u = pop(st.tk, .3), Y = R.y + 570; g.save(); g.globalAlpha = u; rr(g, R.x + 20, Y, R.w - 40, 190, 18, 'rgba(14,20,36,.92)', C.line2);
    [['做', '解析 · 遍历 · 生成', C.ok], ['不做', '对象绑定 · 流式 · 宽松模式', C.bad]].forEach(([a, b, col], i) => { txt(g, a, R.x + 50, Y + 55 + i * 70, col, fnt(800, 28)); txt(g, b, R.x + 160, Y + 55 + i * 70, C.fg, fnt(600, 26)); });
    txt(g, 'Go：绑定、流式、选项都在标准库', R.x + R.w - 50, Y + 90, LG.go, fnt(700, 24), 'right'); g.restore(); }
};
AN.tech = (g, t, R, st) => {
  const k = st.k; hdr(g, R, k === 3 ? 'Go v2 选了哪些' : '快的四种技术');
  const T = [['SIMD', '一条指令处理 16–64 字节', 'simdjson · simd-json · sonic', C.b], ['绕开反射', '编译期生成 / 代码生成 / JIT', 'serde · glaze · easyjson · sonic', C.o], ['少做事', '按需解析 · 零拷贝', 'simdjson On-Demand · sonic-rs', C.g], ['流式', '内存不随输入增长', 'jsontext · Jackson streaming', C.p]];
  const w = (R.w - 80) / 2, used = [false, false, true, true];
  T.forEach(([a, b, c, col], i) => { const show = i <= [0, 1, 3, 3][k], u = show ? pop(i === [0, 1, 2, 3][k] || (k === 2 && i === 3) ? st.tk : 99, .4 + (k === 2 && i === 3 ? .8 : 0)) : 0; if (u <= 0) return;
    const X = R.x + 20 + (i % 2) * (w + 40), Y = R.y + 110 + Math.floor(i / 2) * 290, dim = k === 3 && !used[i]; g.save(); g.globalAlpha = u * (dim ? .35 : 1); rr(g, X, Y, w, 250, 20, 'rgba(14,20,36,.92)', col, k === 3 && used[i] ? 4 : 2.5); txt(g, a, X + 30, Y + 50, col, fnt(800, 36)); txt(g, b, X + 30, Y + 120, C.fg, fnt(600, 25)); txt(g, c, X + 30, Y + 185, C.fg3, fnt(500, 21, 'mono')); g.restore();
    if (k === 3) { if (used[i]) ticks(g, X + w - 60, Y + 50, pop(st.tk, .8)); else cross(g, X + w - 45, Y + 50, pop(st.tk, .8)); } });
  if (k === 3) banner(g, R, '标准库的取舍：可移植、安全、好维护 > 极限速度', pop(st.tk, 2));
};
AN.table = (g, t, R, st) => {
  const k = st.k; hdr(g, R, '公开数字（twitter.json，解析）', '不同硬件、不同口径，只看量级');
  const H = ['方案', '技术', '公开数字', '来源 · 硬件'];
  const D = [['Go encoding/json（原实现）', '反射', '172 MB/s（解码到 any）', 'Lemire 2026-08', LG.go, 172], ['Go 1.27 新引擎（旧 API）', '反射 + 流式', '203 MB/s（同上）', '同上', LG.go, 203], ['Rust serde_json', '编译期生成', 'DOM 300 · 结构体 550 MB/s', 'json-benchmark · i7-6600U', LG.rs, 550], ['simdjson', 'SIMD 两阶段', 'DOM 1.52 GB/s', 'yyjson README · EPYC 7R32', LG.cc, 1520], ['yyjson', '数据布局', '1.72 GB/s', '同上', LG.cc, 1720]];
  const cx = [R.x + 20, R.x + 470, R.x + 720, R.x + 1180], y0 = R.y + 130;
  H.forEach((h, j) => txt(g, h, cx[j], y0, C.fg3, fnt(700, 22)));
  line(g, [[R.x + 10, y0 + 24], [R.x + R.w - 10, y0 + 24]], C.line2, 2);
  D.forEach(([a, b, c, d, col, v], i) => { const u = pop(k ? 99 : t, .4 + i * .5), Y = y0 + 76 + i * 88; g.save(); g.globalAlpha = u; txt(g, a, cx[0], Y, col, fnt(700, 25)); txt(g, b, cx[1], Y, C.fg2, fnt(500, 23)); txt(g, c, cx[2], Y, C.fg, fnt(700, 23, 'mono')); txt(g, d, cx[3], Y, C.fg3, fnt(500, 20)); g.restore();
    if (k >= 1) { const w = 430 * Math.log10(v / 100) / Math.log10(20), uu = pop(st.tk, .4 + i * .4); g.save(); g.globalAlpha = uu * .9; rr(g, cx[2] - 6, Y - 18, Math.max(6, w * SS(uu)), 36, 8, col + '33'); g.restore(); } });
  g.save(); g.globalAlpha = pop(t, 3.5); txt(g, 'Go 的 v2 API 另测：比原版反序列化快 1.5–2.3×（Lemire）。sonic、sonic-rs、glaze 等在各自 README 里有自测，口径不同，未列入。', R.x + 20, R.y + 640, C.fg3, fnt(500, 20)); g.restore();
  if (k >= 1) banner(g, R, '量级：Go 数百 MB/s · serde 数百 MB/s · SIMD 方案 1.5 GB/s 以上（底色为对数刻度）', pop(st.tk, 2.5));
};
AN.radar = (g, t, R) => {
  const AX = ['速度', '类型安全', '易用', '严格', '可移植', '维护'];
  const L = [['Go json/v2', [3, 4, 5, 5, 5, 5], LG.go], ['Go sonic', [5, 4, 4, 3, 2, 2], LG.go], ['Rust serde_json', [4, 5, 4, 5, 5, 5], LG.rs], ['Rust sonic-rs', [5, 4, 3, 4, 3, 3], LG.rs], ['C++ simdjson', [5, 2, 3, 5, 4, 4], LG.cc], ['C yyjson', [5, 2, 3, 4, 5, 4], LG.cc]];
  hdr(g, R, '多维度比较（主观评分，1–5，示意）');
  const cw = R.w / 3, rad = 120;
  L.forEach(([name, v, col], i) => { const cx = R.x + cw * (i % 3) + cw / 2, cy = R.y + 250 + Math.floor(i / 3) * 330, u = pop(t, .4 + i * .5, .8);
    for (let r = 1; r <= 5; r++) { const pts = AX.map((_, j) => { const a = -Math.PI / 2 + j * Math.PI * 2 / 6; return [cx + Math.cos(a) * rad * r / 5, cy + Math.sin(a) * rad * r / 5]; }); line(g, [...pts, pts[0]], C.line, 1); }
    AX.forEach((a, j) => { const an = -Math.PI / 2 + j * Math.PI * 2 / 6; line(g, [[cx, cy], [cx + Math.cos(an) * rad, cy + Math.sin(an) * rad]], C.line, 1); if (i === 0 || true) txt(g, a, cx + Math.cos(an) * (rad + 26), cy + Math.sin(an) * (rad + 22), C.fg3, fnt(500, 18), 'center'); });
    const pts = v.map((s, j) => { const an = -Math.PI / 2 + j * Math.PI * 2 / 6; return [cx + Math.cos(an) * rad * s / 5 * u, cy + Math.sin(an) * rad * s / 5 * u]; });
    g.save(); g.beginPath(); pts.forEach((p, j) => j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fillStyle = col + '33'; g.fill(); g.strokeStyle = col; g.lineWidth = 2.5; g.stroke(); g.restore();
    txt(g, name, cx, cy + rad + 62, col, fnt(800, 23), 'center'); });
};
AN.pick = (g, t, R, st) => {
  const k = st.k;
  if (k < 2) { const G = k === 0 ? [['Go', LG.go, [['新代码', 'encoding/json/v2'], ['旧代码', '升级到 Go 1.27，享受新引擎'], ['确认 JSON 是瓶颈', 'sonic 等，注意版本适配']]]] :
      [['Rust', LG.rs, [['默认', 'serde_json'], ['极致速度', 'sonic-rs · simd-json'], ['编译时间 / 通用反射', 'facet']]], ['C / C++', LG.cc, [['大文档取少量字段', 'simdjson On-Demand'], ['简单嵌入', 'yyjson'], ['结构体映射', 'glaze']]]];
    hdr(g, R, '怎么选'); const w = (R.w - 40 - (G.length - 1) * 30) / G.length;
    G.forEach(([lang, col, L], gi) => { const X = R.x + 20 + gi * (w + 30); g.save(); g.globalAlpha = pop(st.tk, .3); txt(g, lang, X, R.y + 130, col, fnt(900, 40)); g.restore();
      L.forEach(([a, b], i) => { const u = pop(st.tk, .8 + gi * 1.5 + i * .7), Y = R.y + 180 + i * 170; g.save(); g.globalAlpha = u; rr(g, X, Y, w, 140, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X + 30, Y + 48, C.fg2, fnt(600, 24)); txt(g, b, X + 30, Y + 98, C.fg, fnt(800, 30, /[a-z]/.test(b[0]) ? 'mono' : 'sans')); g.restore(); }); });
    return; }
  const cx = R.x + R.w / 2; g.save(); g.globalAlpha = pop(st.tk, .3); txt(g, 'Go JSON v2', cx, R.y + 220, LG.go, fnt(900, 80, 'mono'), 'center'); g.restore();
  [['不破坏兼容', C.ok], ['重新设计', C.gold], ['六年', C.p]].forEach(([s, col], i) => { const u = pop(st.tk, 1.2 + i * 1); g.save(); g.globalAlpha = u; chip(g, s, cx - 390 + i * 280, R.y + 400, col, 1, 34); g.restore(); });
  g.save(); g.globalAlpha = pop(st.tk, 4.5); txt(g, '最大的价值也许不在速度', cx, R.y + 560, C.fg, fnt(700, 34), 'center'); g.restore();
};
