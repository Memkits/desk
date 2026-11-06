// 上集动画：数据怎么进来
// 架构图布局（相对 R），供多个场景复用
function archLayout(R) {
  const W = R.w, X = R.x, Y = R.y;
  return {
    app: [X + 10, Y + 300, 210, 110, '你的应用', 'SDK / 埋点', C.fg2],
    web: [X + W * .26, Y + 300, 230, 110, 'Web', 'Next.js · 接口', C.b],
    s3: [X + W * .26, Y + 600, 230, 100, 'S3', '原始事件 · 媒体', C.o],
    redis: [X + W * .5, Y + 300, 210, 110, 'Redis', 'BullMQ 队列', C.r],
    worker: [X + W * .72, Y + 300, 230, 110, 'Worker', '处理 · 评估 · 导出', C.g],
    ch: [X + W * .72, Y + 600, 230, 100, 'ClickHouse', '追踪 · 评分', C.p],
    pg: [X + W * .5, Y + 80, 210, 100, 'Postgres', '项目 · 密钥 · 配置', C.fg3],
  };
}
const ctr = b => [b[0] + b[2] / 2, b[1] + b[3] / 2];
function drawArch(g, t, R, A, lit = {}, packets = true) {
  const edges = [['app', 'web', 'OTLP'], ['web', 's3', '整批写入'], ['web', 'redis', '只传地址'], ['redis', 'worker', '取任务'], ['s3', 'worker', '下载'], ['worker', 'ch', '批量写'], ['web', 'pg', ''], ['worker', 'pg', '']];
  edges.forEach(([a, b, lab], i) => { const [x0, y0] = ctr(A[a]), [x1, y1] = ctr(A[b]); const u = pop(t, .4 + i * .15); if (u <= 0) return; g.save(); g.globalAlpha = u * (lit.edges && !lit.edges.includes(i) ? .25 : 1); line(g, [[x0, y0], [x1, y1]], i >= 6 ? C.line2 : C.fg3, i >= 6 ? 1.5 : 2.5, i >= 6 ? [6, 6] : null); if (lab) txt(g, lab, (x0 + x1) / 2 + (x0 === x1 ? 14 : 0), (y0 + y1) / 2 - (x0 === x1 ? 0 : 16), C.fg3, fnt(500, 18), x0 === x1 ? 'left' : 'center'); g.restore(); });
  Object.entries(A).forEach(([k, b], i) => { const u = pop(t, i * .12); const dim = lit.nodes && !lit.nodes.includes(k); node(g, b[0], b[1], b[2], b[3], b[4], b[6], u * (dim ? .3 : 1), b[5]); });
  if (packets) { const order = [0, 1, 2, 3, 4, 5]; const ph = (t * .35) % 1, seg = Math.floor(ph * 6), f = (ph * 6) % 1; const [a, b] = edges[order[seg]]; const [x0, y0] = ctr(A[a]), [x1, y1] = ctr(A[b]); dot(g, LERP(x0, x1, SS(f)), LERP(y0, y1, SS(f)), 9, C.gold); }
}
AN.overview = (g, t, R, st) => {
  const A = archLayout(R); drawArch(g, t, R, A);
  const k = st.k; if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; [['上集', '数据怎么进来 · 六种对接', C.b], ['中集', '格式转换 · 大体积 · 导出', C.g], ['下集', 'v3→v4 原理 · 企业脱敏', C.o]].forEach(([a, b, col], i) => { const x = R.x + R.w * .05 + i * R.w * .32; g.globalAlpha = u * pop(st.tk, .3 + i * .4); rr(g, x, R.y + R.h - 70, R.w * .29, 64, 14, 'rgba(14,20,36,.9)', col); txt(g, a, x + 20, R.y + R.h - 38, col, fnt(800, 26)); txt(g, b, x + 100, R.y + R.h - 38, C.fg2, fnt(500, 21)); }); g.restore(); }
};
AN.overview2 = (g, t, R, st) => { const A = archLayout(R); drawArch(g, t, R, A); if (st.k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; ['带 x-langfuse-ingestion-version: 4', '每个 span 带 trace 属性', '旧批量接口新模式下只收评分'].forEach((s, i) => tag(g, s, R.x + 20 + i * 520, R.y + R.h - 30, C.gold)); g.restore(); } };
AN.arch = (g, t, R, st) => {
  const A = archLayout(R); const k = st.k;
  const lit = [{}, { nodes: ['pg', 'ch', 'redis', 's3'] }, { nodes: ['app', 'web', 's3', 'redis'], edges: [0, 1, 2] }, {}][k] || {};
  drawArch(g, t, R, A, lit, k !== 1);
  if (k === 2) { const u = pop(st.tk, 1); g.save(); g.globalAlpha = u; txt(g, '← 立刻返回 200', A.web[0] + 20, A.web[1] - 30, C.g, fnt(700, 24)); g.restore(); }
  if (k === 3) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 10, R.y + R.h - 76, R.w - 20, 66, 14, 'rgba(255,210,122,.08)', C.gold); txt(g, '入口轻 · 削峰  ↔  非实时：正常秒级，双写路径十几分钟', R.x + 36, R.y + R.h - 43, C.fg, fnt(600, 25)); g.restore(); }
};
// span 结构
AN.span = (g, t, R, st) => {
  const k = st.k; const x = R.x + 20, y = R.y + 40, w = 760;
  rr(g, x, y, w, 640, 16, '#0B1020', C.b, 2); txt(g, 'Span', x + 24, y + 36, C.b, fnt(800, 28));
  const f = [['traceId', '16 字节 → 32 位十六进制'], ['spanId', '8 字节 → 16 位十六进制'], ['parentSpanId', '空 = 根'], ['start / endTimeUnixNano', '纳秒整数'], ['attributes', '键值列表']];
  f.forEach(([a, b], i) => { const u = pop(t, .2 + i * .2); g.save(); g.globalAlpha = u; txt(g, a, x + 30, y + 90 + i * 50, C.fg, fnt(600, 22, 'mono')); txt(g, b, x + 420, y + 90 + i * 50, C.fg3, fnt(500, 20)); g.restore(); });
  const attrs = [['langfuse.observation.type', 'generation'], ['langfuse.observation.input', '"[{role:user…}]"'], ['langfuse.observation.output', '"…"'], ['langfuse.observation.model.name', 'gpt-x'], ['langfuse.observation.usage_details', '{"input":812,…}'], ['langfuse.observation.prompt.name', 'qa'], ['user.id · session.id', 'u-42 · s-7']];
  attrs.forEach(([a, b], i) => { const u = pop(t, 1.3 + i * .15); g.save(); g.globalAlpha = u; rr(g, x + 30, y + 350 + i * 40, w - 60, 34, 6, 'rgba(92,180,255,.07)', null); txt(g, a, x + 44, y + 367 + i * 40, C.gold, fnt(500, 18, 'mono')); txt(g, b, x + w - 50, y + 367 + i * 40, C.fg2, fnt(500, 18, 'mono'), 'right'); g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const conv = [['langfuse.*', 'Langfuse SDK', C.gold], ['gen_ai.*', 'OTel GenAI 约定', C.g], ['ai.*', 'Vercel AI SDK', C.b], ['llm.* / input.value', 'OpenInference', C.p]];
    txt(g, '服务端认识的命名约定', R.x + 830, R.y + 70, C.fg, fnt(700, 26)); conv.forEach(([a, b, col], i) => { const yy = R.y + 120 + i * 100; rr(g, R.x + 830, yy, 460, 82, 14, 'rgba(14,20,36,.9)', col); txt(g, a, R.x + 856, yy + 30, col, fnt(700, 23, 'mono')); txt(g, b, R.x + 856, yy + 60, C.fg3, fnt(500, 19)); arrow(g, R.x + 1060, yy + 84, R.x + 1060, R.y + 540, C.fg3, 1.5, 8, i === 3 ? 1 : 0); });
    node(g, R.x + 830, R.y + 550, 460, 90, '统一的 observation', C.gold, 1, '输入 · 输出 · 模型 · 用量'); txt(g, '第三方埋点不改代码也能接入', R.x + 830, R.y + 690, C.fg2, fnt(600, 23)); g.restore(); }
};
AN.nest = (g, t, R, st) => {
  title(g, '一批数据：资源 → 作用域 → span', R);
  const L = [['resourceSpans[]', '资源：哪个服务发的', 'service.name = chat-api', C.o, 0], ['scopeSpans[]', '作用域：哪个埋点库发的', 'scope.name = langfuse-sdk · 5.2.0', C.p, 1], ['spans[]', '一个个操作', 'chat · retrieve · tool:search …', C.b, 2]];
  L.forEach(([n, d, ex, col, i]) => { const u = pop(t, .3 + i * .5); const x = R.x + 40 + i * 70, y = R.y + 110 + i * 100, w = R.w - 80 - i * 140, h = 560 - i * 200; g.save(); g.globalAlpha = u; rr(g, x, y, w, h, 16, `rgba(14,20,36,${.6 + i * .1})`, col, 2.5); txt(g, n, x + 24, y + 34, col, fnt(700, 26, 'mono')); txt(g, d, x + 300, y + 34, C.fg, fnt(600, 22)); txt(g, ex, x + 300, y + 68, C.fg3, fnt(500, 19, 'mono')); g.restore(); });
  const u = pop(t, 2); g.save(); g.globalAlpha = u; for (let i = 0; i < 4; i++) rr(g, R.x + 210 + i * 300, R.y + 400, 270, 70, 10, 'rgba(92,180,255,.15)', C.b); g.restore();
  txt(g, '这个结构原样存进对象存储', R.x + 40, R.y + R.h - 20, C.gold, fnt(600, 24));
};
// 入口
AN.gate = (g, t, R, st) => {
  const k = st.k; const gates = [['内容类型', 'protobuf / JSON', '其他 → 400'], ['体积', '≤ 512 MiB（压缩前后）', '超 → 413 断开'], ['编号校验', '每个 span 有 traceId / spanId', '一个不合法 → 整批 400'], ['版本头', 'ingestion-version', '> 4 → 400']];
  const on = [[0, 1], [2], [3]][k] || [];
  gates.forEach(([n, d, bad], i) => { const x = R.x + 30 + i * (R.w - 60) / 4, w = (R.w - 60) / 4 - 30, u = pop(t, .2 + i * .2), hot = on.includes(i); g.save(); g.globalAlpha = u * (hot || k < 0 ? 1 : .4); rr(g, x, R.y + 60, w, 200, 16, hot ? 'rgba(255,210,122,.1)' : 'rgba(14,20,36,.9)', hot ? C.gold : C.line2, hot ? 3 : 2); txt(g, n, x + 20, R.y + 100, C.fg, fnt(700, 26)); txt(g, d, x + 20, R.y + 150, C.fg2, fnt(500, 19)); txt(g, bad, x + 20, R.y + 210, C.r, fnt(600, 19)); g.restore(); if (i) arrow(g, x - 28, R.y + 160, x - 4, R.y + 160, C.fg3, 2.5, 9, u); });
  const ph = (t * .4) % 1; dot(g, R.x + 20 + ph * (R.w - 40), R.y + 300, 10, C.gold);
  if (k === 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 30, R.y + 340, R.w - 60, 300, 16, '#0B1020', C.r); txt(g, '400  Invalid OTLP trace export: 12 of 12 span(s) cannot be processed', R.x + 56, R.y + 380, C.r, fnt(600, 20, 'mono')); txt(g, '(spanId:absent, traceId:absent). traceId and spanId are required on every span …', R.x + 56, R.y + 414, C.fg2, fnt(500, 18, 'mono')); txt(g, 'This endpoint accepts OpenTelemetry traces only — if you are exporting', R.x + 56, R.y + 448, C.fg2, fnt(500, 18, 'mono')); txt(g, 'OpenTelemetry logs, point your log exporter elsewhere.', R.x + 56, R.y + 476, C.fg2, fnt(500, 18, 'mono'));
    txt(g, '常见原因：OTel 日志打到了 traces 端点', R.x + 56, R.y + 560, C.gold, fnt(700, 26)); txt(g, 'ResourceLogs 与 ResourceSpans 字段号相同，能解析，但没有编号', R.x + 56, R.y + 600, C.fg3, fnt(500, 21)); g.restore(); }
  if (k === 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; [['= 4', '按 v4 约定准备好的数据', '直写候选', C.g], ['> 4', '未知的未来版本', '400 拒绝', C.r], ['缺省 / < 4', '旧客户端或第三方', '接收，按其他规则判路径', C.o]].forEach(([a, b, c2, col], i) => { const y = R.y + 360 + i * 100; rr(g, R.x + 30, y, 900, 80, 14, 'rgba(14,20,36,.9)', col); txt(g, a, R.x + 60, y + 40, col, fnt(800, 30, 'mono')); txt(g, b, R.x + 260, y + 40, C.fg2, fnt(500, 22)); txt(g, c2, R.x + 900, y + 40, col, fnt(700, 22), 'right'); }); g.restore(); }
  if (k === 0) { const u = pop(st.tk, 1); g.save(); g.globalAlpha = u; txt(g, '压缩前：Content-Length 与读取字节', R.x + 40, R.y + 380, C.fg2, fnt(500, 22)); txt(g, '解压后：gunzip 输出字节，同一上限', R.x + 40, R.y + 420, C.fg2, fnt(500, 22)); g.restore(); }
};
// S3 键
AN.s3key = (g, t, R, st) => {
  const k = st.k; const x = R.x + 30, y = R.y + 40;
  if (k <= 1) {
    const parts = [['{PREFIX}', C.fg3], ['otel/', C.o], ['{projectId}/', C.b], ['2026/11/06/09/41/', C.g], ['{uuid}.json', C.gold]]; let xx = x; g.font = fnt(600, 30, 'mono'); parts.forEach(([s, col], i) => { const u = pop(t, .2 + i * .25); g.save(); g.globalAlpha = u; txt(g, s, xx, y + 30, col, fnt(600, 30, 'mono')); g.restore(); xx += g.measureText(s).width; });
    const labs = ['前缀（可配）', '来源', '项目', '年/月/日/时/分', '随机编号']; xx = x; parts.forEach(([s], i) => { g.font = fnt(600, 30, 'mono'); const w = g.measureText(s).width; txt(g, labs[i], xx + w / 2, y + 80, C.fg3, fnt(500, 18), 'center'); xx += w; });
    rr(g, x, y + 130, 640, 360, 14, '#0B1020', C.o); txt(g, '文件内容：resourceSpans 数组（整批）', x + 20, y + 160, C.o, fnt(600, 20)); for (let i = 0; i < 6; i++) { g.fillStyle = C.line2; g.fillRect(x + 30 + (i % 3) * 20, y + 200 + i * 44, 520 - i * 40, 14); }
  }
  if (k >= 1 && k <= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; const jx = x + 720; rr(g, jx, y + 130, R.w - 760, 360, 14, '#0B1020', C.r); txt(g, 'Redis 任务（otel-ingestion-queue）', jx + 20, y + 160, C.r, fnt(600, 20)); ['{ fileKey: "otel/proj_456/2026/…/9f…json",', '  authCheck: { projectId, orgId },', '  sdkName: "python", sdkVersion: "5.2.0",', '  ingestionVersion: "4",', '  propagatedHeaders: { "x-tenant-id": "acme" } }'].forEach((s, i) => txt(g, s, jx + 20, y + 210 + i * 40, C.fg2, fnt(500, 19, 'mono'))); txt(g, '只传指针，不传数据', jx + 20, y + 440, C.gold, fnt(700, 24)); g.restore(); }
  if (k === 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const cols = [['v3 旧接口：一个事件一个文件', C.fg3], ['v4 OTel：一批一个文件', C.g]]; cols.forEach(([n, col], j) => { const bx = R.x + 30 + j * (R.w / 2), by = R.y + 40; txt(g, n, bx, by, col, fnt(700, 26)); if (!j) { ['proj/observation/obs-1/', '   e1.json  e2.json  e3.json', 'proj/trace/tr-9/', '   e4.json  e5.json', '…  处理时：LIST 目录 → GET 每个文件 → 合并'].forEach((s, i) => txt(g, s, bx, by + 50 + i * 42, i === 4 ? C.r : C.fg2, fnt(500, 20, 'mono'))); } else { ['otel/proj/2026/11/06/09/41/', '   9f2c….json   ← 整批 1 次 PUT', '处理时：1 次 GET'].forEach((s, i) => txt(g, s, bx, by + 50 + i * 42, i === 2 ? C.g : C.fg2, fnt(500, 20, 'mono'))); } }); bars(g, R.x + 200, R.y + 330, 700, 300, [['v3 S3 调用费', 100, C.fg3], ['v4', 15, C.g]], st.tk, { fmt: v => v + '%' }); txt(g, '部分自部署用户：约 −85%（官方博客）', R.x + 1000, R.y + 500, C.gold, fnt(600, 23)); g.restore(); }
  if (k === 3) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; node(g, R.x + 60, R.y + 160, 300, 100, 'Web 接口', C.b); [['otel-ingestion-queue', '主队列', C.r], ['secondary-otel-ingestion-queue', '次队列 · 高吞吐项目', C.p]].forEach(([n, d, col], i) => { node(g, R.x + 560, R.y + 80 + i * 200, 520, 100, n, col, 1, d); arrow(g, R.x + 370, R.y + 210, R.x + 550, R.y + 130 + i * 200, C.fg3, 2.5); }); txt(g, '队列内按 projectId + fileKey 分片', R.x + 560, R.y + 460, C.fg2, fnt(600, 22)); txt(g, '次队列名单：…_SECONDARY_…_ENABLED_PROJECT_IDS', R.x + 560, R.y + 500, C.fg3, fnt(500, 19, 'mono')); g.restore(); }
};
// 后台处理流水线
const PSTEPS = [['下载 S3', C.o], ['脱敏回调（EE）', C.r], ['span → 事件', C.b], ['补全', C.p], ['评估匹配', C.gold], ['写入缓冲', C.g]];
AN.pipeline = (g, t, R, st) => {
  const k = st.k; const on = [[0, 1], [2], [3], [4, 5]][k] || []; const w = (R.w - 40) / 6;
  PSTEPS.forEach(([n, col], i) => { const x = R.x + 20 + i * w, hot = on.includes(i); node(g, x, R.y + 40, w - 30, 90, n, hot ? col : C.line2, pop(t, i * .15) * (hot ? 1 : .45)); if (i) arrow(g, x - 28, R.y + 85, x - 4, R.y + 85, C.fg3, 2.5, 9); });
  const y = R.y + 190; const u = pop(st.tk, .3); g.save(); g.globalAlpha = u;
  if (k === 0) { txt(g, '配置了 LANGFUSE_INGESTION_MASKING_CALLBACK_URL 且有企业许可证', R.x + 30, y + 20, C.fg2, fnt(500, 22)); txt(g, '→ 整批 POST 给你们的服务，用返回结果继续（下集详细讲）', R.x + 30, y + 60, C.r, fnt(600, 22)); }
  if (k === 1) { const rows = [['traceId / spanId', 'bytes / base64', '32 / 16 位十六进制字符串'], ['startTimeUnixNano', '"1793884668928000000"', 'ISO 时间字符串'], ['langfuse.observation.input', 'JSON 字符串', 'input（可保持对象）'], ['langfuse.observation.metadata.*', '多个属性', 'metadata 对象'], ['未识别的属性', '—', 'metadata.attributes / .resourceAttributes']]; rows.forEach(([a, b, c2], i) => { const yy = y + i * 70; rr(g, R.x + 30, yy, R.w - 60, 56, 10, 'rgba(14,20,36,.9)', C.line2); txt(g, a, R.x + 50, yy + 28, C.fg, fnt(600, 20, 'mono')); txt(g, b, R.x + 640, yy + 28, C.fg3, fnt(500, 19, 'mono')); arrow(g, R.x + 1000, yy + 28, R.x + 1060, yy + 28, C.b, 2, 9); txt(g, c2, R.x + 1080, yy + 28, i === 4 ? C.o : C.b, fnt(600, 19, 'mono')); }); }
  if (k === 2) { const E = [['提示词', 'prompt.name + version → Postgres → prompt_id', C.p], ['模型与价格', 'model.name → 价格表匹配 → model_id', C.p], ['用量', '未提供时按分词器计算 token', C.p], ['成本', 'usage × 单价 → cost_details', C.p], ['元数据', '嵌套对象 → names[] + values[]', C.gold]]; E.forEach(([a, b, col], i) => { const yy = y + i * 72; rr(g, R.x + 30, yy, 1100, 58, 10, 'rgba(14,20,36,.9)', col); txt(g, a, R.x + 54, yy + 29, col, fnt(700, 22)); txt(g, b, R.x + 260, yy + 29, C.fg2, fnt(500, 21, 'mono')); }); }
  if (k === 3) { txt(g, '观测级评估规则命中 → evaluation 队列', R.x + 30, y + 20, C.gold, fnt(600, 23)); const n = Math.floor((st.tk * 400) % 1000); rr(g, R.x + 30, y + 80, 900, 60, 10, '#0B1020', C.g); g.fillStyle = C.g; g.fillRect(R.x + 34, y + 84, 892 * n / 1000, 52); txt(g, `缓冲 ${n} / 1000 条`, R.x + 960, y + 110, C.g, fnt(700, 24, 'mono')); txt(g, '够 1000 条或满 1 秒 → INSERT events_full；失败重试 ≤ 3 次', R.x + 30, y + 190, C.fg2, fnt(500, 22)); }
  g.restore();
};
// 写入路径
AN.route = (g, t, R, st) => {
  const k = st.k; const x0 = R.x + 20;
  const checks = [['① 请求头', 'ingestion-version ≥ 4\n或 python ≥ 4.0.0 / javascript ≥ 5.0.0', 'direct_header'], ['② 部署配置', 'NATIVE_OTEL_BEHAVIOUR = direct\n（v4 默认）', 'direct_env'], ['③ 作用域', 'scope 含 langfuse 且版本满足', 'direct_scope'], ['④ 组织日期', '仅 Cloud：组织晚于截止日\n且非 Langfuse SDK', 'direct_org_cutoff']];
  const on = k === 1 ? [0, 1] : k === 2 ? [2, 3] : k >= 0 ? [0, 1, 2, 3] : [];
  checks.forEach(([n, d, lab], i) => { const y = R.y + 30 + i * 140, u = pop(t, .2 + i * .25), hot = on.includes(i) && k > 0; g.save(); g.globalAlpha = u * (k === 0 || hot ? 1 : .35); rr(g, x0, y, 560, 112, 14, 'rgba(14,20,36,.9)', hot ? C.gold : C.line2, hot ? 3 : 2); txt(g, n, x0 + 20, y + 32, C.fg, fnt(700, 24)); d.split('\n').forEach((s, j) => txt(g, s, x0 + 20, y + 66 + j * 28, C.fg3, fnt(500, 18, 'mono'))); arrow(g, x0 + 570, y + 56, x0 + 660, y + 56, C.g, 2.5, 10); txt(g, lab, x0 + 670, y + 56, C.g, fnt(600, 19, 'mono')); if (i < 3) { txt(g, '否', x0 + 280, y + 126, C.fg3, fnt(500, 16), 'center'); } g.restore(); });
  txt(g, '都不满足 → dual', x0 + 20, R.y + 600, C.o, fnt(700, 24));
  const bx = R.x + 980, bw = R.w - 1000; [['直写', 'events_full', '秒级可见', C.g, R.y + 60], ['双写', '旧表 + 暂存表 → 定时任务补属性 → events_full', '10–15 分钟', C.o, R.y + 300]].forEach(([n, d, lat, col, y]) => { rr(g, bx, y, bw, 190, 16, 'rgba(14,20,36,.9)', col, 2.5); txt(g, n, bx + 24, y + 42, col, fnt(800, 32)); txt(g, d, bx + 24, y + 96, C.fg2, fnt(500, 18)); txt(g, lat, bx + 24, y + 150, C.fg, fnt(700, 26)); });
  if (k === 3) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 640, R.w - 40, 120, 14, 'rgba(255,210,122,.08)', C.gold); txt(g, '服务端直写门槛：Python ≥ 4.0.0 · JS ≥ 5.0.0（checkHeaderBasedDirectWrite）', R.x + 44, R.y + 680, C.fg, fnt(600, 22)); txt(g, 'SDK 复制 trace 属性：Python ≥ 4.7.0 · JS ≥ 5.4.0（文档的“实时”门槛）  → 直写 ≠ 属性完整', R.x + 44, R.y + 724, C.gold, fnt(600, 22)); g.restore(); }
};
// 六种对接
const CASES = [['新版 SDK', 'Python 5.x · JS 6.x', '带 v4 头 · 直写 · SDK 复制属性', '需要 v4 服务端', C.g], ['过渡版 SDK', 'Python 4.x · JS 5.x', 'v3 / v4 都兼容 · 按头直写', '< 4.7 / 5.4：属性只在根 span', C.b], ['旧 OTel SDK', 'Python 3.x · JS 4.x', '无版本头 · 靠作用域识别', '默认直写·无补全；dual_write 才延迟补属性', C.o], ['旧 REST / 非 OTel', 'Python 2.x · JS 3.x · 自调 /ingestion', 'events_only 下只收评分', '其余 400“未存储”', C.r], ['第三方 OTel', 'OpenInference · Vercel AI · 框架自带', '能进来，属性要自己补', '建议加 v4 头', C.p], ['企业采集器', 'OTel Collector 转发', '透传认证头和版本头', '不丢根 span · 不重复发送', C.gold]];
AN.cases = (g, t, R, st) => {
  const k = st.k, cw = (R.w - 40) / 3, ch = 330;
  CASES.forEach(([n, who, d1, d2, col], i) => { const x = R.x + 20 + (i % 3) * cw, y = R.y + 20 + Math.floor(i / 3) * (ch + 30), u = pop(t, .2 + i * .15), hot = k === i + 1; g.save(); g.globalAlpha = u * (k === 0 || hot ? 1 : .35); rr(g, x, y, cw - 30, ch, 18, hot ? 'rgba(255,255,255,.05)' : 'rgba(14,20,36,.9)', col, hot ? 3.5 : 2); txt(g, String(i + 1), x + 26, y + 46, col, fnt(900, 44, 'mono')); txt(g, n, x + 76, y + 46, C.fg, fnt(800, 28)); txt(g, who, x + 26, y + 104, C.fg3, fnt(500, 19)); txt(g, d1, x + 26, y + 170, C.fg2, fnt(600, 21)); txt(g, d2, x + 26, y + 220, hot ? C.gold : C.fg3, fnt(600, 20)); g.restore(); });
};
// trace 属性传播
AN.propagate = (g, t, R, st) => {
  const k = st.k; const cx = R.x + 340, y0 = R.y + 80;
  const nodes = [[cx, y0, 'chat（根）'], [cx - 200, y0 + 170, 'retrieve'], [cx + 200, y0 + 170, 'llm'], [cx - 200, y0 + 340, 'embed'], [cx + 200, y0 + 340, 'tool:search']]; const par = [-1, 0, 0, 1, 2];
  const withAttr = k === 0 ? (t % 6 < 3 ? [0] : [0, 1, 2, 3, 4]) : k === 1 ? [0] : [0, 1, 2, 3, 4];
  nodes.forEach(([x, y, n], i) => { if (par[i] >= 0) line(g, [[nodes[par[i]][0], nodes[par[i]][1] + 36], [x, y - 36]], C.line2, 2); const has = withAttr.includes(i); rr(g, x - 130, y - 36, 260, 72, 12, has ? 'rgba(95,224,160,.12)' : 'rgba(14,20,36,.9)', has ? C.g : C.line2, 2); txt(g, n, x, y - 8, C.fg, fnt(600, 21), 'center'); txt(g, has ? 'user_id=u-42' : 'user_id=（空）', x, y + 20, has ? C.g : C.r, fnt(500, 17, 'mono'), 'center'); });
  rr(g, R.x + 20, R.y + 560, 640, 90, 12, '#0B1020', C.b); txt(g, "WHERE user_id = 'u-42'", R.x + 44, R.y + 590, C.b, fnt(600, 22, 'mono')); txt(g, `→ 命中 ${withAttr.length} / 5 个 observation`, R.x + 44, R.y + 626, withAttr.length === 5 ? C.g : C.r, fnt(700, 22));
  const rx = R.x + 760;
  if (k === 0) { txt(g, '必须写在每个 span 上的属性', rx, R.y + 80, C.fg, fnt(700, 26)); ['user.id / langfuse.user.id', 'session.id / langfuse.session.id', 'langfuse.trace.name', 'langfuse.trace.tags', 'langfuse.trace.metadata.<key>', 'langfuse.version · langfuse.release', 'langfuse.environment'].forEach((s, i) => txt(g, '· ' + s, rx, R.y + 130 + i * 44, C.fg2, fnt(500, 21, 'mono'))); }
  if (k === 1) { txt(g, '服务端不在批内从根 span 继承', rx, R.y + 80, C.r, fnt(700, 26)); txt(g, '但资源属性对整个服务生效：', rx, R.y + 150, C.fg, fnt(600, 24)); rr(g, rx, R.y + 190, 680, 150, 12, '#0B1020', C.gold); ['resource.attributes:', '  service.name = "tenant-acme-api"', '  user.id      = "tenant:acme"'].forEach((s, i) => txt(g, s, rx + 20, R.y + 225 + i * 38, i === 2 ? C.gold : C.fg2, fnt(500, 20, 'mono'))); txt(g, '整个服务一个值 · 适合“一个服务 = 一个租户”', rx, R.y + 390, C.fg3, fnt(500, 21)); }
};
// 媒体
AN.media = (g, t, R, st) => {
  const k = st.k; const x = R.x + 20, y = R.y + 40;
  rr(g, x, y, 700, 300, 14, '#0B1020', C.line2); txt(g, 'input（处理前）', x + 20, y + 30, C.fg3, fnt(600, 20));
  ['[{ "role": "user", "content": [', '   { "type": "text", "text": "这张图里有什么？" },', '   { "type": "image_url", "image_url": { "url":', '     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…' + '（3.2 MB）"'].forEach((s, i) => txt(g, s, x + 20, y + 80 + i * 40, i === 3 ? C.r : C.fg2, fnt(500, 18, 'mono')));
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; const steps = [['识别', 'data:*;base64 · Anthropic {type:base64} · Gemini inline_data'], ['哈希', 'sha256(content) → mediaId'], ['申请', 'POST /api/public/media → 预签名 URL（已存在则为空）'], ['上传', 'PUT 直传对象存储 · 同项目同内容只传一次']]; steps.forEach(([a, b], i) => { const yy = y + 360 + i * 80; rr(g, x, yy, 1100, 64, 10, 'rgba(14,20,36,.9)', C.o); txt(g, a, x + 24, yy + 32, C.o, fnt(700, 22)); txt(g, b, x + 120, yy + 32, C.fg2, fnt(500, 20, 'mono')); }); g.restore(); }
  if (k >= 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; const bx = R.x + 760; rr(g, bx, y, R.w - 780, 300, 14, '#0B1020', C.g); txt(g, 'input（处理后）', bx + 20, y + 30, C.g, fnt(600, 20)); ['…"image_url": { "url":', '  "@@@langfuseMedia:type=image/png', '   |id=Xk3…|source=base64_data_uri@@@"'].forEach((s, i) => txt(g, s, bx + 20, y + 90 + i * 40, i ? C.gold : C.fg2, fnt(500, 18, 'mono'))); txt(g, '3.2 MB → 80 字节', bx + 20, y + 260, C.g, fnt(700, 24)); g.restore(); }
};
