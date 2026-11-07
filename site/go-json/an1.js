// 上集动画：Go JSON v1 → v2
const GO = '#5CB4FF', V1 = C.r, V2 = C.g;
AN.news = (g, t, R) => {
  const cx = R.x + R.w / 2;
  const u = pop(t, .3, .8); g.save(); g.globalAlpha = u;
  txt(g, 'Go 1.27', cx, R.y + 90, GO, fnt(900, 76, 'mono'), 'center'); txt(g, '2026 年 8 月', cx, R.y + 160, C.fg3, fnt(600, 26), 'center'); g.restore();
  // 外壳：API 不变；内核：引擎替换
  const bx = cx - 420, by = R.y + 230, bw = 840, bh = 420;
  g.save(); g.globalAlpha = pop(t, 1.2); rr(g, bx, by, bw, bh, 28, 'rgba(92,180,255,.05)', GO, 3);
  txt(g, 'encoding/json', bx + 30, by + 40, C.fg, fnt(800, 30, 'mono'));
  ['Marshal', 'Unmarshal', 'NewDecoder', 'NewEncoder', 'Valid'].forEach((f, i) => chip(g, f, bx + 30 + i * 158, by + 100, C.fg3, 1, 19));
  txt(g, '对外的 API：一个都没变', bx + bw - 30, by + 40, C.fg3, fnt(600, 22), 'right'); g.restore();
  const sw = SS((t - 3) / 1.6), ix = bx + 120, iy = by + 170, iw = bw - 240, ih = 200;
  g.save(); g.globalAlpha = pop(t, 1.6) * (1 - sw); rr(g, ix, iy + sw * 120, iw, ih, 18, 'rgba(255,122,147,.08)', V1, 2.5); txt(g, '旧引擎（v1）', ix + iw / 2, iy + ih / 2 + sw * 120, V1, fnt(800, 34), 'center'); g.restore();
  g.save(); g.globalAlpha = sw; rr(g, ix, iy - (1 - sw) * 120, iw, ih, 18, 'rgba(95,224,160,.1)', V2, 3); txt(g, '新引擎（v2）', ix + iw / 2, iy + ih / 2 - 22 - (1 - sw) * 120, V2, fnt(800, 34), 'center'); txt(g, 'encoding/json/v2 + jsontext', ix + iw / 2, iy + ih / 2 + 26 - (1 - sw) * 120, C.fg2, fnt(600, 22, 'mono'), 'center'); g.restore();
};
AN.timeline = (g, t, R, st) => {
  const E = [['2021', '实验仓库', 'go-json-experiment'], ['2023-10', '社区讨论', '#63397'], ['2025-01', '正式提案', '#71497'], ['2025-08', 'Go 1.25 实验', 'GOEXPERIMENT=jsonv2'], ['2026-05', '提案接受', ''], ['2026-08', 'Go 1.27 默认启用', '旧 API 跑在新引擎上'], ['2026-11', '官方博客', 'A new Go API for JSON']];
  const x0 = R.x + 60, x1 = R.x + R.w - 130, y = R.y + 330;
  line(g, [[x0, y], [x0 + (x1 - x0) * SS(t / 2.5), y]], C.line2, 4);
  E.forEach(([d, a, b], i) => {
    const u = pop(t, .3 + i * .45); if (u <= 0) return; const x = LERP(x0, x1, i / (E.length - 1)), up = i % 2 === 0, last = i >= 5;
    g.save(); g.globalAlpha = u; dot(g, x, y, last ? 13 : 9, last ? V2 : GO); line(g, [[x, y], [x, up ? y - 70 : y + 70]], C.line2, 2);
    const yy = up ? y - 150 : y + 110;
    txt(g, d, x, yy, last ? V2 : GO, fnt(800, 26, 'mono'), 'center'); txt(g, a, x, yy + 38, C.fg, fnt(700, 24), 'center'); if (b) txt(g, b, x, yy + 72, C.fg3, fnt(500, 17, 'mono'), 'center'); g.restore();
  });
  g.save(); g.globalAlpha = pop(t, 3.5); txt(g, '前后约 6 年', R.x + R.w / 2, R.y + 40, C.gold, fnt(800, 34), 'center'); g.restore();
  if (st.k >= 1 || t > 6) { const u = pop(st.k >= 1 ? st.tk : t - 6, .3); [['上集', 'v1 → v2：区别、迁移、性能', V2], ['下集', '与 Rust、C++ 等方案横评', C.o]].forEach(([a, b, col], i) => { g.save(); g.globalAlpha = u * pop(st.tk, .3 + i * .6); const x = R.x + 120 + i * 780; rr(g, x, R.y + 650, 700, 110, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 30, R.y + 705, col, fnt(800, 32)); txt(g, b, x + 130, R.y + 705, C.fg, fnt(600, 26)); g.restore(); }); }
};
AN.v1issues = (g, t, R, st) => {
  const k = st.k; hdr(g, R, 'encoding/json（v1）：十几年的包袱', '兼容性承诺：行为不能随便改');
  const G = [['默认太宽松', ['无效 UTF-8 → 悄悄替换', '重复键 → 后者覆盖', '大小写不敏感匹配'], C.r], ['性能与接口', ['Decoder 先缓存整个值', 'UnmarshalJSON 拿到字节再解析', '嵌套时成倍重复'], C.o], ['缺少配置', ['nil → null 写死', 'omitempty 含义固定', 'Duration → 纳秒数'], C.p]];
  const w = (R.w - 80) / 3;
  G.forEach(([h, L, col], i) => { const on = k >= i + 1, u = k === 0 ? pop(t, .6 + i * .5) * .45 : on ? 1 : .3; card(g, R.x + 20 + i * (w + 20), R.y + 130, w, 380, h, L, col, u, k === i + 1, 23); });
  // 重复键示意
  if (k === 1) { const u = pop(st.tk, 1.5), x = R.x + 40, y = R.y + 580; g.save(); g.globalAlpha = u; rr(g, x, y, R.w - 80, 150, 16, C.panel, C.line2); txt(g, '{"role":"user", "role":"admin"}', x + 30, y + 50, C.fg, fnt(600, 28, 'mono'));
    txt(g, '解析器 A：取第一个 → user', x + 30, y + 108, C.fg2, fnt(600, 23)); txt(g, '解析器 B：取最后一个 → admin', x + 520, y + 108, C.bad, fnt(700, 23)); g.restore(); }
  if (k === 2) { const u = pop(st.tk, 1.2), x = R.x + 40, y = R.y + 580; g.save(); g.globalAlpha = u; txt(g, '嵌套 3 层的 UnmarshalJSON', x, y + 20, C.fg2, fnt(600, 22));
    [1, 2, 3].forEach((d, i) => { const s = pop(st.tk, 1.6 + i * .6); rr(g, x + i * 60, y + 50 + i * 30, (R.w - 200) * s - i * 120, 22, 6, i ? 'rgba(255,178,92,.3)' : 'rgba(255,178,92,.6)'); }); txt(g, '同一段字节被扫描 3 次（示意）', x + R.w - 120, y + 160, C.o, fnt(600, 22), 'right'); g.restore(); }
  if (k === 3) banner(g, R, '社区为这些问题提了大量 issue —— v2 一次性重新设计', pop(st.tk, .8));
};
AN.layers = (g, t, R, st) => {
  const k = st.k, x = R.x + 40, w = R.w - 80;
  // 下层 jsontext
  const u0 = pop(t, .3);
  g.save(); g.globalAlpha = u0; rr(g, x, R.y + 520, w, 220, 22, 'rgba(92,180,255,.06)', GO, 3); txt(g, 'jsontext', x + 30, R.y + 560, GO, fnt(800, 32, 'mono')); txt(g, '语法层：记号（token）的读写，不懂 Go 类型', x + 220, R.y + 560, C.fg2, fnt(600, 24));
  const T = ['{', '"name"', '"zoe"', '"age"', '30', '}'], cs = [C.fg3, C.o, C.g, C.o, C.p, C.fg3];
  T.forEach((s, i) => { const v = pop(t, .8 + i * .3); g.save(); g.globalAlpha = v; chip(g, s, x + 40 + i * 175, R.y + 650, cs[i], 1, 26); g.restore(); }); g.restore();
  // 上层 json/v2
  const u1 = k >= 1 ? pop(st.tk, .2) : pop(t, 3) * .35;
  g.save(); g.globalAlpha = u1; rr(g, x, R.y + 260, w, 200, 22, 'rgba(95,224,160,.06)', V2, 3); txt(g, 'encoding/json/v2', x + 30, R.y + 300, V2, fnt(800, 32, 'mono')); txt(g, '语义层：Go 值 ⇄ 记号', x + 400, R.y + 300, C.fg2, fnt(600, 24));
  txt(g, 'type User struct { Name string; Age int }', x + 40, R.y + 380, C.fg, fnt(600, 26, 'mono')); arrow(g, x + w / 2, R.y + 460, x + w / 2, R.y + 515, V2, 3, 12); g.restore();
  // 最上：v1 API 外壳
  if (k >= 1) { const v = pop(st.tk, 1.5); g.save(); g.globalAlpha = v; rr(g, x, R.y + 90, w, 120, 22, 'rgba(255,122,147,.06)', V1, 2.5); txt(g, 'encoding/json（v1 API）', x + 30, R.y + 130, V1, fnt(800, 28, 'mono')); txt(g, '同样建在这两层上，只是默认选项 = v1 行为', x + 30, R.y + 178, C.fg2, fnt(600, 23)); arrow(g, x + w / 2, R.y + 210, x + w / 2, R.y + 255, V1, 3, 12); g.restore(); }
};
AN.stream = (g, t, R) => {
  hdr(g, R, '流式解码：一次一个记号', '解码一个很大的数组 [ {…}, {…}, {…}, … ]');
  const x = R.x + 40, y = R.y + 160, w = R.w - 80;
  // 输入带：记号流过
  rr(g, x, y, w, 90, 14, C.panel, C.line2); const ph = t * 2.2;
  for (let i = 0; i < 30; i++) { const xx = x + w - ((ph * 60 + i * 110) % (30 * 110)); if (xx < x + 10 || xx > x + w - 60) continue; chip(g, i % 3 ? '{…}' : ',', xx, y + 45, i % 3 ? C.g : C.fg3, 1, 20); }
  txt(g, '输入', x - 10, y - 20, C.fg3, fnt(600, 20));
  // 内存曲线
  const gx = x, gy = y + 200, gw = w, gh = 380; rr(g, gx, gy, gw, gh, 14, 'rgba(14,20,36,.6)', C.line);
  txt(g, '内存占用（示意）', gx + 20, gy + 30, C.fg3, fnt(600, 20)); const P = SS(t / 6);
  const curve = (f, col, lab) => { const pts = []; for (let i = 0; i <= 60 * P; i++) { const u = i / 60; pts.push([gx + 30 + u * (gw - 60), gy + gh - 30 - f(u) * (gh - 90)]); } if (pts.length > 1) { line(g, pts, col, 4); const l = pts[pts.length - 1]; txt(g, lab, l[0] - 10, l[1] - 26, col, fnt(700, 22), 'right'); } };
  curve(u => u, V1, 'v1 Decoder：先读完整个值'); curve(u => .12 + .03 * Math.sin(u * 40), V2, 'jsontext.Decoder：保持平稳');
};
AN.recursive = (g, t, R) => {
  hdr(g, R, 'Kubernetes OpenAPI：递归的 UnmarshalJSON', 'kube-openapi#315');
  const x = R.x + 40, w = R.w - 80, half = (w - 40) / 2;
  [['UnmarshalJSON（每层再扫一遍）', V1, 0], ['UnmarshalJSONFrom（一遍流式）', V2, 1]].forEach(([h, col, j]) => {
    const X = x + j * (half + 40), Y = R.y + 120; rr(g, X, Y, half, 560, 18, 'rgba(14,20,36,.9)', col, 2.5); txt(g, h, X + 24, Y + 36, col, fnt(800, 24));
    const levels = 5; for (let d = 0; d < levels; d++) { const u = pop(t, .5 + d * .5 + j * .2), bx = X + 30 + d * 36, bw = half - 60 - d * 72;
      for (let p = 0; p < (j ? 1 : d + 1); p++) { const yy = Y + 80 + d * 92 + p * 0, pr = j ? (d ? 0 : SS((t - 1) / 3)) : SS((t - .8 - d * .5 - p * .3) / 1.2); g.save(); g.globalAlpha = u; rr(g, bx, yy, bw, 60, 10, 'rgba(255,255,255,.03)', C.line2); if (!j || d === 0) rr(g, bx, yy, bw * pr, 60, 10, j ? 'rgba(95,224,160,.25)' : `rgba(255,122,147,${.15 + p * .1})`); if (!j) txt(g, `扫描 ×${d + 1}`, bx + bw - 14, yy + 30, C.fg2, fnt(700, 20, 'mono'), 'right'); else txt(g, d ? '直接从解码器读' : '扫描 ×1', bx + bw - 14, yy + 30, C.fg2, fnt(700, 20), 'right'); g.restore(); } }
  });
  banner(g, R, '官方博客：改用 UnmarshalJSONFrom 后，性能提升“几个数量级”', pop(t, 5));
};
AN.risk3 = (g, t, R) => {
  hdr(g, R, '六处变化，三种风险', '越往右越难发现');
  const G = [['会报错', ['无效 UTF-8', '重复的键', 'time.Duration'], C.o, '测试里就能发现'], ['输出变了', ['nil → [] / {}', 'omitempty 保留 0 和 false'], C.b, '看下游怎么解析'], ['静默丢数据', ['大小写不匹配 → 字段留空', '没有任何错误'], C.bad, '最危险']];
  const w = (R.w - 80) / 3;
  G.forEach(([h, L, col, f], i) => { const u = pop(t, .4 + i * 1.2); card(g, R.x + 20 + i * (w + 20), R.y + 130, w, 400, h, L, col, u, i === 2, 24); g.save(); g.globalAlpha = u; txt(g, f, R.x + 20 + i * (w + 20) + w / 2, R.y + 590, col, fnt(800, 26), 'center'); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 4); const y = R.y + 660; const grd = g.createLinearGradient(R.x + 40, 0, R.x + R.w - 40, 0); grd.addColorStop(0, C.o); grd.addColorStop(1, C.bad); g.fillStyle = grd; g.fillRect(R.x + 40, y, R.w - 80, 8); arrow(g, R.x + R.w - 80, y + 4, R.x + R.w - 30, y + 4, C.bad, 8, 18); txt(g, '发现难度', R.x + 40, y + 40, C.fg3, fnt(600, 20)); g.restore();
};
AN.migrate = (g, t, R, st) => {
  const k = st.k, x = R.x + 40, y = R.y + 140;
  hdr(g, R, '升级到 Go 1.27：现有代码怎么办？');
  node(g, x, y + 80, 290, 110, '你的代码', C.fg2, pop(t, .3), 'import "encoding/json"');
  arrow(g, x + 296, y + 135, x + 326, y + 135, C.fg3, 3, 12, pop(t, .8));
  g.save(); g.globalAlpha = pop(t, 1); rr(g, x + 336, y + 40, 480, 190, 18, 'rgba(14,20,36,.9)', GO, 2.5); txt(g, 'encoding/json', x + 366, y + 80, GO, fnt(800, 26, 'mono')); txt(g, '+ DefaultOptionsV1()', x + 366, y + 125, C.fg, fnt(600, 24, 'mono')); txt(g, '行为保持 v1 不变', x + 366, y + 175, C.ok, fnt(700, 24)); g.restore();
  arrow(g, x + 822, y + 135, x + 870, y + 135, C.fg3, 3, 12, pop(t, 1.5));
  node(g, x + 880, y + 80, 260, 110, 'v2 引擎', V2, pop(t, 1.6), '默认启用');
  ticks(g, x + 346, y + 290, pop(t, 2.2)); g.save(); g.globalAlpha = pop(t, 2.2); txt(g, '兼容性承诺：按设计，现有代码不会坏', x + 396, y + 290, C.fg, fnt(700, 26)); g.restore();
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, x, y + 380, R.w - 100, 200, 18, 'rgba(255,178,92,.06)', C.o, 2.5); txt(g, '退路', x + 30, y + 420, C.o, fnt(800, 28));
    txt(g, '$ GOEXPERIMENT=nojsonv2 go build ./...', x + 30, y + 480, C.fg, fnt(600, 28, 'mono')); txt(g, 'encoding/json 换回旧的 v1 实现', x + 30, y + 535, C.fg2, fnt(600, 23)); g.restore();
    const sw = SS((st.tk - 1.5) / 1); g.save(); g.globalAlpha = sw; rr(g, x + 880, y + 80, 260, 110, 14, 'rgba(14,20,36,.97)', V1, 2.5); txt(g, '旧 v1 引擎', x + 1010, y + 135, C.fg, fnt(700, 27), 'center'); g.restore(); }
};
AN.steps = (g, t, R) => {
  hdr(g, R, '逐步迁移（官方迁移指南的思路）', 'go.dev/doc/jsonv2-migration');
  const S = [['在测试里打开 v2 默认', '跑一遍现有用例', C.b], ['看报错与输出差异', '重复键 · nil · 大小写 …', C.o], ['逐处决定', '改代码，或加兼容选项', C.p], ['切换到 json/v2', '新代码直接使用', C.g]];
  const w = (R.w - 100) / 4;
  S.forEach(([a, b, col], i) => { const u = pop(t, .4 + i * 1.1), X = R.x + 20 + i * (w + 20), Y = R.y + 240;
    g.save(); g.globalAlpha = u; rr(g, X, Y, w, 260, 20, 'rgba(14,20,36,.92)', col, 2.5); txt(g, String(i + 1), X + 30, Y + 50, col, fnt(900, 48, 'mono')); wrapTxt(g, a, X + 30, Y + 120, w - 60, 36, C.fg, fnt(800, 27)); wrapTxt(g, b, X + 30, Y + 200, w - 60, 30, C.fg3, fnt(500, 21)); g.restore();
    if (i < 3) arrow(g, X + w + 2, Y + 130, X + w + 18, Y + 130, C.fg3, 3, 9, pop(t, .9 + i * 1.1)); });
  banner(g, R, '先暴露差异，再一处处决定；不要一次性全量切换', pop(t, 5));
};
AN.claims = (g, t, R) => {
  hdr(g, R, '官方说法', 'go.dev/blog/jsonv2（相对 v1）');
  const x = R.x + 60, y = R.y + 160, w = R.w - 120;
  const row = (i, lab, txtv, frac, col, sub) => { const u = pop(t, .5 + i * 1.3), Y = y + i * 170; g.save(); g.globalAlpha = Math.min(1, u * 2); txt(g, lab, x, Y + 30, C.fg, fnt(800, 30)); txt(g, sub, x, Y + 74, C.fg3, fnt(500, 21));
    rr(g, x + 330, Y + 10, w - 520, 50, 12, C.panel, C.line2); rr(g, x + 330, Y + 10, (w - 520) * frac * SS(u), 50, 12, col); txt(g, txtv, x + w - 170, Y + 36, col, fnt(800, 34, 'mono')); g.restore(); };
  row(0, 'Marshal', '≈ 1×', .1, C.b, '大致持平，时快时慢');
  row(1, 'Unmarshal', '最高 10×', 1, V2, '基准测试里明显更快');
  row(2, 'Kubernetes', '几个数量级', 1, C.gold, '改用 UnmarshalJSONFrom');
  g.save(); g.globalAlpha = pop(t, 5); txt(g, '刻度示意：长度只表示方向', x + 330, y + 520, C.fg3, fnt(500, 20)); g.restore();
};
AN.lemire = (g, t, R, st) => {
  const k = st.k; hdr(g, R, k ? '换用 v2 的 API（相对原版 v1）' : '旧 API + 新引擎（MB/s，越高越好）', 'Daniel Lemire，2026-08-29');
  if (k === 0) {
    const D = [['twitter 反序列化', 172, 203], ['citm 反序列化', 186, 241], ['canada 反序列化', 128, 106], ['twitter 序列化', 198, 374]];
    const x = R.x + 320, w = R.w - 480, M = 400;
    D.forEach(([lab, a, b], i) => { const Y = R.y + 140 + i * 150, u = pop(t, .5 + i * .8, .8); txt(g, lab, R.x + 20, Y + 40, C.fg, fnt(700, 24));
      rr(g, x, Y + 5, w * a / M * u, 30, 8, V1); rr(g, x, Y + 45, w * b / M * u, 30, 8, b > a ? V2 : C.bad);
      if (u > .9) { txt(g, `${a}`, x + w * a / M + 12, Y + 20, C.fg2, fnt(700, 22, 'mono')); txt(g, `${b}`, x + w * b / M + 12, Y + 60, b > a ? V2 : C.bad, fnt(800, 22, 'mono')); } });
    g.save(); g.globalAlpha = pop(t, 1); rr(g, x, R.y + 760, 22, 22, 4, V1); txt(g, '原实现', x + 34, R.y + 771, C.fg2, fnt(600, 20)); rr(g, x + 260, R.y + 760, 22, 22, 4, V2); txt(g, '新引擎（Go 1.27）', x + 294, R.y + 771, C.fg2, fnt(600, 20)); g.restore();
  } else {
    const D0 = [['反序列化', 1.5, 2.3, V2], ['序列化', 1.2, 3, V2], ['一万条结构体切片 · 序列化', 1 / 1.5, 1 / 1.5, C.bad]];
    const x = R.x + 420, w = R.w - 520, M = 3.2, X = v => x + w * v / M;
    line(g, [[X(1), R.y + 120], [X(1), R.y + 640]], C.fg3, 2, [6, 6]); txt(g, '1×（v1）', X(1), R.y + 660, C.fg3, fnt(600, 20, 'mono'), 'center');
    D.forEach(([lab, a, b, col], i) => { const Y = R.y + 170 + i * 160, u = pop(st.tk, .4 + i * .9); g.save(); g.globalAlpha = u; txt(g, lab, R.x + 20, Y + 25, C.fg, fnt(700, 25));
      if (a === b) { rr(g, X(a), Y + 5, X(1) - X(a), 40, 8, col); txt(g, '约慢 1.5×', X(a) - 14, Y + 25, col, fnt(800, 24), 'right'); }
      else { rr(g, X(1), Y + 5, (X(a) - X(1)), 40, 8, 'rgba(95,224,160,.5)'); rr(g, X(a), Y + 5, X(b) - X(a), 40, 8, col); txt(g, `${a}–${b}×`, X(b) + 14, Y + 25, col, fnt(800, 26, 'mono')); } g.restore(); });
  }
};
AN.regress = (g, t, R, st) => {
  const k = st.k; hdr(g, R, '1 万条结构体切片 · Marshal（耗时，越短越好）', 'golang/go#81315 中的修复数据');
  const D = [['v1（旧实现）', 1.659, V1, 0], ['v2（Go 1.27）', 3.094, C.bad, 0], ['v2 + 修复补丁', 1.594, V2, 0]];
  const x = R.x + 330, w = R.w - 520, M = 3.3;
  D.forEach(([lab, v, col, kk], i) => { if (k < kk) return; const Y = R.y + 170 + i * 150, u = pop(kk ? st.tk : t, .4 + (kk ? 0 : i * .8), .9); g.save(); g.globalAlpha = Math.min(1, u * 2); txt(g, lab, R.x + 20, Y + 30, C.fg, fnt(700, 26)); rr(g, x, Y + 5, w * v / M * u, 50, 10, col); if (u > .9) txt(g, `${v.toFixed(3)} ms`, x + w * v / M + 16, Y + 30, col, fnt(800, 26, 'mono')); g.restore(); });
  banner(g, R, '修复后略快于旧实现；改进计划进入 Go 1.28', pop(t, 4), V2);
};
AN.anytrap = (g, t, R) => {
  hdr(g, R, '解码目标决定收益（相对 v1 的速度）', 'reqfleet，Apple M2');
  const D = [['解码到 any（兼容模式）', .78, C.bad], ['解码到具体结构体', 1.69, V2]];
  const x = R.x + 440, w = R.w - 620, M = 2, X = v => x + w * v / M;
  line(g, [[X(1), R.y + 130], [X(1), R.y + 480]], C.fg3, 2, [6, 6]); txt(g, '1×（v1）', X(1), R.y + 500, C.fg3, fnt(600, 20, 'mono'), 'center');
  D.forEach(([lab, v, col], i) => { const Y = R.y + 190 + i * 140, u = pop(t, .5 + i * 1); g.save(); g.globalAlpha = u; txt(g, lab, R.x + 20, Y + 28, C.fg, fnt(700, 26)); rr(g, x, Y + 5, (X(v) - x) * SS(u), 46, 10, col); txt(g, `${v}×`, X(v) + 16, Y + 28, col, fnt(800, 28, 'mono')); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 3.5); rr(g, R.x + 20, R.y + 560, R.w - 40, 120, 18, 'rgba(255,210,122,.08)', C.gold, 2.5); txt(g, 'v2 不是处处更快', R.x + 50, R.y + 600, C.gold, fnt(800, 30)); txt(g, '用自己的数据、自己的类型测一遍再下结论', R.x + 50, R.y + 650, C.fg, fnt(600, 25)); g.restore();
};
AN.hn = (g, t, R, st) => {
  const k = st.k; hdr(g, R, k ? '也有抱怨与提醒' : 'Hacker News：A new Go API for JSON', k ? '' : '390 points · 211 comments');
  const Q = k === 0 ? [['“biggest benefit is the improved API”', '速度之外，更看重接口', C.g], ['“works like a charm”', '说的是 jsontext', C.g], ['选项可以组合、可以往下传', '社区讨论的共识（概括）', C.b]] :
    [['找不到 MarshalIndent？', '→ jsontext.WithIndent("  ")', C.o], ['做了整整六年', '从 2021 年的实验仓库算起', C.fg2], ['Lemire 在 X 上发布测试结果', '先测再下结论', C.p]];
  Q.forEach(([a, b, col], i) => { const u = pop(k ? st.tk : t, .4 + i * 1.1), Y = R.y + 140 + i * 190; g.save(); g.globalAlpha = u; g.translate((1 - u) * 30, 0); rr(g, R.x + 20, Y, R.w - 40, 160, 18, 'rgba(14,20,36,.92)', col, 2.5); rr(g, R.x + 20, Y, 10, 160, 4, col); txt(g, a, R.x + 60, Y + 58, C.fg, fnt(700, 32)); txt(g, b, R.x + 60, Y + 112, C.fg3, fnt(500, 24, i === 0 && k ? 'mono' : 'sans')); g.restore(); });
};
AN.sonic = (g, t, R) => {
  hdr(g, R, '第三方库：依赖运行时内部的代价', '以 bytedance/sonic 为例');
  const x = R.x + 40, y = R.y + 160;
  node(g, x, y, 300, 110, 'Go 1.27', GO, pop(t, .3), '运行时有变化');
  const B = [['sonic ≥ v1.15.3', '支持 Go 1.27：JIT + SIMD', V2, 0], ['sonic 旧版本', '遇到新 Go：回退标准库', C.o, 1], ['某些项目', 'nuclei#7720：升级后卡住', C.bad, 2]];
  B.forEach(([a, b, col, i]) => { const u = pop(t, 1 + i * 1.2), Y = y - 20 + i * 190; arrow(g, x + 310, y + 55, x + 480, Y + 75, col, 3, 12, u); g.save(); g.globalAlpha = u; rr(g, x + 490, Y, 640, 150, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 520, Y + 50, col, fnt(800, 28)); txt(g, b, x + 520, Y + 102, C.fg, fnt(600, 24)); g.restore(); });
  banner(g, R, '升级 Go 之前，先升级这类依赖', pop(t, 5));
};
AN.sum1 = (g, t, R, st) => {
  const k = st.k; hdr(g, R, '上集小结');
  const L = [['两层架构', 'jsontext 语法 · json/v2 语义', V2, 0], ['真正的流式', 'MarshalJSONTo / UnmarshalJSONFrom', V2, 0], ['可组合的选项', 'Deterministic、WithMarshalers …', V2, 0], ['更严格的默认', 'UTF-8、重复键、大小写 …', V2, 0], ['盯住静默变化', '大小写匹配最危险', C.o, 1], ['性能要自己测', '反序列化通常更快；Go 1.28 继续改进', C.o, 1]];
  L.forEach(([a, b, col, kk], i) => { if (k < kk) return; const u = pop(kk ? st.tk : t, .3 + (i % 4) * .6), col2 = i % 2, row = Math.floor(i / 2), X = R.x + 20 + col2 * (R.w / 2), Y = R.y + 120 + row * 180; g.save(); g.globalAlpha = u; rr(g, X, Y, R.w / 2 - 40, 150, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X + 30, Y + 50, col, fnt(800, 30)); txt(g, b, X + 30, Y + 104, C.fg2, fnt(600, 22)); g.restore(); });
  if (k === 1) { g.save(); g.globalAlpha = pop(st.tk, 4); txt(g, '下集：和 Rust、C++ 等方案横评 →', R.x + R.w - 20, R.y + R.h - 30, C.gold, fnt(800, 28), 'right'); g.restore(); }
};
