// 中集动画：存储、格式、大体积、导出
AN.layers = (g, t, R, st) => {
  const L = [['客户端 span', C.fg2], ['S3 原始 JSON', C.o], ['中间事件 EventInput', C.b], ['写库记录', C.p], ['events_full', C.p], ['events_core', C.g], ['API / 导出行', C.gold]];
  const w = (R.w - 40) / 7;
  L.forEach(([n, col], i) => { const x = R.x + 20 + i * w, u = pop(t, .2 + i * .2); node(g, x, R.y + 200, w - 30, 110, n, col, u); if (i) arrow(g, x - 28, R.y + 255, x - 4, R.y + 255, C.fg3, 2.5, 9, u); });
  const k = st.k; if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; [['格式转换总图', '七层之间每个字段怎么变', C.b], ['体积上限分层图', '七道关口各自怎么处理大数据', C.o]].forEach(([a, b, col], i) => { const x = R.x + 40 + i * (R.w / 2); rr(g, x, R.y + 420, R.w / 2 - 80, 140, 16, 'rgba(14,20,36,.9)', col, 2.5); txt(g, a, x + 30, R.y + 470, col, fnt(800, 30)); txt(g, b, x + 30, R.y + 520, C.fg2, fnt(500, 22)); }); g.restore(); }
};
// 排序键
AN.sortkey = (g, t, R, st) => {
  const k = st.k; const keys = [['project_id', C.b], ['toStartOfMinute(start_time)', C.g], ['xxHash32(trace_id)', C.p], ['span_id', C.fg2], ['start_time', C.fg3]];
  txt(g, 'ORDER BY', R.x + 20, R.y + 40, C.fg3, fnt(600, 22, 'mono')); let x = R.x + 150; keys.forEach(([s, col], i) => { g.font = fnt(600, 22, 'mono'); const w = g.measureText(s).width + 40; const u = pop(t, .2 + i * .2); g.save(); g.globalAlpha = u; rr(g, x, R.y + 18, w, 44, 10, 'rgba(14,20,36,.9)', col, 2); txt(g, s, x + 20, R.y + 40, col, fnt(600, 22, 'mono')); g.restore(); x += w + 12; });
  // 数据块示意：按项目、分钟排列的格子
  const gx = R.x + 20, gy = R.y + 110, cw = 22, rows = 8, cols = Math.floor((R.w - 60) / cw);
  const scanProj = 3, t0 = 18, t1 = 30;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const hit = r === scanProj && c >= t0 && c <= t1; g.fillStyle = hit ? C.gold : (r % 2 ? 'rgba(92,180,255,.10)' : 'rgba(92,180,255,.06)'); g.fillRect(gx + c * cw, gy + r * 34, cw - 3, 30); }
  for (let r = 0; r < rows; r++) txt(g, `项目 ${r + 1}`, gx - 6, gy + r * 34 + 15, C.fg3, fnt(500, 15), 'right');
  txt(g, '时间（分钟）→', gx + cols * cw, gy + rows * 34 + 22, C.fg3, fnt(500, 18), 'right');
  txt(g, "WHERE project_id = 'p4' AND start_time BETWEEN …  → 只读金色的数据块", gx, gy + rows * 34 + 60, C.gold, fnt(600, 22, 'mono'));
  if (k >= 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const y = R.y + 520; [['v3', 'ReplacingMergeTree + 多次更新', '读时 FINAL / LIMIT 1 BY 去重', C.fg3], ['v4', 'ReplacingMergeTree + 每个 span 写一次', '正常没有需要去重的版本', C.g]].forEach(([a, b, c2, col], i) => { const xx = R.x + 20 + i * (R.w / 2); rr(g, xx, y, R.w / 2 - 40, 150, 16, 'rgba(14,20,36,.9)', col, 2.5); txt(g, a, xx + 24, y + 42, col, fnt(800, 30)); txt(g, b, xx + 24, y + 88, C.fg2, fnt(500, 20)); txt(g, c2, xx + 24, y + 124, col, fnt(600, 20)); }); g.restore(); }
  if (k === 3) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const y = R.y + 520; rr(g, R.x + 20, y, R.w - 40, 150, 16, 'rgba(14,20,36,.95)', C.gold); txt(g, '时间：DateTime64(3) 毫秒 → DateTime64(6) 微秒', R.x + 44, y + 50, C.fg, fnt(600, 24)); txt(g, 'index_granularity_bytes：10 MiB（默认）→ 64 MiB，每 granule 仍 8192 行', R.x + 44, y + 100, C.fg, fnt(600, 24)); g.restore(); }
};
// 字段分组
AN.cols = (g, t, R, st) => {
  const k = st.bi; const groups = [['标识', 'project_id · trace_id · span_id · parent_span_id', C.fg2], ['trace 属性', 'trace_name · user_id · session_id · tags · release · version · environment', C.g], ['时间', 'start_time · end_time · completion_start_time（微秒）', C.fg2], ['模型 / 用量 / 成本', 'model_id · provided_model_name · usage_details{} · cost_details{} · calculated_*_cost', C.p], ['I/O', 'input · output（ZSTD 压缩）· input_length · output_length', C.b], ['元数据', 'metadata_names[] · metadata_values[]', C.gold], ['来源', 'source · service_name · scope_name · telemetry_sdk_* · ingestion_api_key · ingestion_sdk_*', C.o], ['存储', 'blob_storage_file_path（→ S3 原始文件）· event_bytes · event_ts · is_deleted', C.o]];
  const hot = k === 0 ? [1] : k === 1 ? [3] : k === 4 ? [6, 7] : [];
  groups.forEach(([n, d, col], i) => { const y = R.y + 20 + i * 86, u = pop(t, i * .12), on = hot.includes(i); g.save(); g.globalAlpha = u * (hot.length && !on ? .35 : 1); rr(g, R.x + 20, y, R.w - 40, 72, 12, on ? 'rgba(255,210,122,.08)' : 'rgba(14,20,36,.9)', on ? col : C.line2, on ? 3 : 1.5); txt(g, n, R.x + 44, y + 36, col, fnt(700, 24)); txt(g, d, R.x + 300, y + 36, C.fg2, fnt(500, 19, 'mono')); g.restore(); });
  if (k === 0) { const u = pop(st.tk, 1.2); g.save(); g.globalAlpha = u; txt(g, "SELECT user_id, sum(total_cost) FROM events WHERE … GROUP BY user_id   ← 不再需要关联", R.x + 20, R.y + 730, C.gold, fnt(600, 21, 'mono')); g.restore(); }
};
AN.meta = (g, t, R, st) => {
  const k = st.k; const x = R.x + 20, y = R.y + 30;
  rr(g, x, y, 560, 330, 14, '#0B1020', C.b); txt(g, '上报的 metadata', x + 20, y + 30, C.b, fnt(600, 20));
  ['{ "tenant": "acme",', '  "req": { "id": "r-1", "retry": 2 },', '  "flags": ["a", "b"],', '  "pii": true,', '  "note": null }'].forEach((s, i) => txt(g, s, x + 20, y + 80 + i * 44, C.fg2, fnt(500, 22, 'mono')));
  const u = pop(t, 1); arrow(g, x + 580, y + 170, x + 660, y + 170, C.gold, 3.5, 12, u);
  const tx = x + 680; g.save(); g.globalAlpha = u; rr(g, tx, y, R.w - 720, 330, 14, '#0B1020', C.gold); txt(g, 'metadata_names', tx + 20, y + 30, C.gold, fnt(600, 20, 'mono')); txt(g, 'metadata_values', tx + 300, y + 30, C.gold, fnt(600, 20, 'mono'));
  [['tenant', '"acme"'], ['req.id', '"r-1"'], ['req.retry', '"2"  ← 数字变字符串'], ['flags', '"[\\"a\\",\\"b\\"]"  ← 数组整体 JSON'], ['pii', '"true"'], ['note', 'null → ""']].forEach(([a, b], i) => { const uu = pop(t, 1.2 + i * .2); g.globalAlpha = u * uu; txt(g, a, tx + 20, y + 80 + i * 42, C.fg, fnt(500, 21, 'mono')); txt(g, b, tx + 300, y + 80 + i * 42, /←/.test(b) ? C.o : C.fg2, fnt(500, 21, 'mono')); }); g.restore();
  if (k >= 0) { const u2 = pop(t, 3); g.save(); g.globalAlpha = u2; rr(g, x, y + 380, R.w - 40, 120, 14, 'rgba(14,20,36,.9)', C.g); txt(g, '读取时还原', x + 24, y + 420, C.g, fnt(700, 24)); txt(g, 'mapFromArrays(arrayReverse(metadata_names), arrayReverse(metadata_values))', x + 24, y + 466, C.fg2, fnt(500, 21, 'mono')); g.restore(); }
  if (k >= 1) { const u3 = pop(st.tk, .3); g.save(); g.globalAlpha = u3; rr(g, x, y + 530, R.w - 40, 150, 14, 'rgba(255,178,92,.08)', C.o); txt(g, '对接数仓时', x + 24, y + 570, C.o, fnt(700, 24)); txt(g, '· 所有值都是字符串：数字、布尔需要按 JSON 解析还原', x + 24, y + 610, C.fg2, fnt(500, 21)); txt(g, '· 嵌套对象是点号路径；数组不展开；键里本身带点会和路径混淆', x + 24, y + 646, C.fg2, fnt(500, 21)); g.restore(); }
};
// 两张表
AN.core = (g, t, R, st) => {
  const k = st.k; const fx = R.x + 20, cx = R.x + R.w / 2 + 20, y = R.y + 30, w = R.w / 2 - 60;
  node(g, fx, y, w, 90, 'events_full', C.p, 1, '完整内容 · 全文索引'); node(g, cx, y, w, 90, 'events_core', C.g, 1, 'input/output/每个元数据值 ≤ 200 字符');
  const ph = (t * .5) % 1; arrow(g, fx + w + 6, y + 45, cx - 6, y + 45, C.fg3, 3, 12); txt(g, '物化视图 leftUTF8(…, 200)', (fx + w + cx) / 2, y + 20, C.fg3, fnt(500, 17, 'mono'), 'center'); dot(g, LERP(fx + w + 10, cx - 10, ph), y + 45, 7, C.g);
  const row = (x, full) => { const s = '{"role":"user","content":"请根据下面这份 38 页的合同摘要列出所有付款节点和违约条款……（共 182,344 字）"}'; rr(g, x, y + 130, w, 90, 10, '#0B1020', C.line2); txt(g, full ? s.slice(0, 44) + '…' : s.slice(0, 32) + '…（截断）', x + 16, y + 175, full ? C.fg2 : C.g, fnt(500, 18, 'mono')); };
  row(fx, true); row(cx, false);
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; [['列表 · 图表 · 看板 · 过滤', 'events_core', C.g, cx], ['打开单条详情 · 全文搜索', 'events_full', C.p, fx]].forEach(([a, b, col, x], i) => { rr(g, x, y + 260, w, 80, 12, 'rgba(14,20,36,.9)', col); txt(g, a, x + 20, y + 300, C.fg, fnt(600, 22)); txt(g, '→ ' + b, x + w - 20, y + 300, col, fnt(600, 20, 'mono'), 'right'); }); g.restore(); }
  if (k === 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, y + 380, R.w - 40, 280, 14, '#0B1020', C.gold); txt(g, '调用方只写逻辑表 events，编译期按读到的列路由', R.x + 44, y + 420, C.gold, fnt(700, 24)); [['SELECT name, total_cost FROM events …', 'events_core'], ["… WHERE e.metadata['tenant'] = 'acme'", 'events_core（短值等值）'], ['SELECT input, output FROM events …', 'events_full'], ['FROM events_truncated …', '强制 events_core']].forEach(([a, b], i) => { txt(g, a, R.x + 44, y + 470 + i * 46, C.fg2, fnt(500, 20, 'mono')); txt(g, '→ ' + b, R.x + R.w - 60, y + 470 + i * 46, /full/.test(b) ? C.p : C.g, fnt(600, 20, 'mono'), 'right'); }); g.restore(); }
  if (k === 3) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, y + 380, R.w - 40, 240, 14, '#0B1020', C.p); [['text(tokenizer = splitByNonAlpha)', 'lower(input) · lower(output) · metadata_names · metadata_values'], ['ngrambf_v1', 'metadata 拼接值 · lower(name) · lower(trace_name) · lower(user_id) · lower(session_id)'], ['bloom_filter', 'span_id · trace_id · user_id · session_id']].forEach(([a, b], i) => { txt(g, a, R.x + 44, y + 430 + i * 66, C.p, fnt(600, 21, 'mono')); txt(g, b, R.x + 44, y + 460 + i * 66, C.fg2, fnt(500, 18, 'mono')); }); g.restore(); }
};
// 格式转换总图
const CHAIN = [
  ['① OTel span', '客户端', ['traceId：16 字节', 'startTimeUnixNano：整数 ns', 'attributes：[{key, value}]', 'input：JSON 字符串属性'], C.fg2],
  ['② S3 原始文件', 'Web 写入', ['resourceSpans JSON', 'int64 → 十进制字符串', '不脱敏、不修改', '路径 otel/{p}/…/{uuid}.json'], C.o],
  ['③ EventInput', 'processToEvent', ['traceId：32 位 hex', 'startTimeISO：ISO 字符串', 'input：可为对象', 'metadata：对象'], C.b],
  ['④ EventRecord', 'createEventRecord', ['input / output：字符串', 'metadata → names[] / values[]', '+ model_id · usage · cost', '+ prompt_id · source'], C.p],
  ['⑤ events_full', 'ClickHouse', ['DateTime64(6) 微秒', 'Map / Array / Decimal(18,12)', '可选：溢出为媒体引用', 'blob_storage_file_path'], C.p],
  ['⑥ events_core', '物化视图', ['input / output ≤ 200 字符', '每个 metadata 值 ≤ 200', '其余列相同', '列表与看板读这里'], C.g],
  ['⑦ API / 导出', 'Observations v2 · 导出', ['camelCase 或 snake_case', 'metadata → 对象', 'latency：秒或毫秒', '按 span 去重'], C.gold]];
AN.chain = (g, t, R, st) => {
  const k = st.bi; const hot = { 1: [0], 2: [1], 3: [2, 3], 4: [4, 5, 6] }[k];
  const w = (R.w - 20) / 7;
  CHAIN.forEach(([n, who, items, col], i) => { const x = R.x + 10 + i * w, u = pop(t, .15 + i * .15), on = !hot || hot.includes(i); g.save(); g.globalAlpha = u * (on ? 1 : .3); rr(g, x, R.y + 30, w - 18, 600, 14, on && hot ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.9)', col, on && hot ? 3 : 2); txt(g, n, x + 14, R.y + 66, col, fnt(800, 21)); txt(g, who, x + 14, R.y + 98, C.fg3, fnt(500, 16)); items.forEach((s, j) => wrapTxt(g, s, x + 14, R.y + 160 + j * 110, w - 46, 26, C.fg2, fnt(500, 18))); g.restore(); if (i) arrow(g, x - 16, R.y + 330, x - 2, R.y + 330, C.fg3, 2, 7, u); });
};
// 七道关口
const GATES = [['① 客户端', 'SDK 批大小 · 媒体抽走', 'LANGFUSE_OTEL_MAX_BATCH_SIZE_BYTES', C.fg2], ['② 入口', 'OTel 512 MiB · 旧接口 4.5 MB', '413 / > 16 MiB 警告', C.b], ['③ 媒体上传', '单文件 ≤ 1 GB · sha256 去重', 'S3_MEDIA_MAX_CONTENT_LENGTH', C.o], ['④ 服务端抽取 / 溢出', '默认关闭 · 字段 > 2 MiB 移到媒体桶', 'OBSERVATION_FIELD_OVERFLOW_ENABLED', C.o], ['⑤ 写入兜底', '对半拆批 · 单条截到 500K', '只处理 input / output', C.r], ['⑥ events_core', '200 字符', '列表 · 看板', C.g], ['⑦ 导出', '选了 io / metadata 才读完整版', '否则是截断内容', C.gold]];
AN.size = (g, t, R, st) => {
  const k = st.k; const hot = [[], [0, 1], [2, 3], [4], [5, 6], []][k] || [];
  const ph = (t * .25) % 1; const blobX = R.x + 20 + ph * (R.w - 60);
  GATES.forEach(([n, a, b, col], i) => { const y = R.y + 10 + i * 100, u = pop(t, .1 + i * .15), on = !hot.length || hot.includes(i); g.save(); g.globalAlpha = u * (on ? 1 : .3); rr(g, R.x + 20, y, R.w - 40, 84, 12, on && hot.length ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.9)', col, on && hot.length ? 3 : 1.5); txt(g, n, R.x + 44, y + 42, col, fnt(800, 24)); txt(g, a, R.x + 330, y + 30, C.fg, fnt(600, 21)); txt(g, b, R.x + 330, y + 62, C.fg3, fnt(500, 18, 'mono')); g.restore(); });
  if (k === 5) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 120, R.w - 40, 460, 18, 'rgba(10,14,26,.97)', C.gold, 3); txt(g, '大体积数据的建议', R.x + 50, R.y + 175, C.gold, fnt(800, 30)); ['媒体一定在客户端抽走（新版 SDK 默认）', '超长文本打开字段溢出，落到对象存储而不是分析库', '必要时在客户端或采集器先裁剪（检索结果只留摘要和编号）', '导出时确认选了 io / metadata 字段组', '元数据不要放大块内容：只有字段溢出能处理它，写入兜底不截断元数据'].forEach((s, i) => txt(g, `${i + 1}. ${s}`, R.x + 50, R.y + 240 + i * 62, C.fg, fnt(600, 23))); g.restore(); }
};
// 双写
AN.dual = (g, t, R, st) => {
  const k = st.k; const x0 = R.x + 20, y0 = R.y + 60, n = 12, cw = (R.w - 40) / n;
  txt(g, 'observations_batch_staging · 每 3 分钟一个分区（按收到时间）', x0, y0 - 30, C.fg2, fnt(600, 22));
  const now = 11.4; for (let i = 0; i < n; i++) { const age = (now - i) * 3; const ready = age >= 10 + 3; const done = i < 6; rr(g, x0 + i * cw, y0, cw - 8, 90, 8, done ? 'rgba(95,224,160,.25)' : ready ? 'rgba(255,210,122,.25)' : 'rgba(92,180,255,.08)', done ? C.g : ready ? C.gold : C.line2, 2); txt(g, `09:${String(i * 3).padStart(2, '0')}`, x0 + i * cw + cw / 2 - 4, y0 + 45, C.fg2, fnt(500, 17, 'mono'), 'center'); }
  txt(g, '绿：已处理   金：可处理（早于 now − 10 min）   蓝：等待', x0, y0 + 130, C.fg3, fnt(500, 19));
  const cur = x0 + 6 * cw - 4; line(g, [[cur, y0 - 10], [cur, y0 + 100]], C.r, 3); txt(g, 'Redis 游标', cur + 8, y0 + 115, C.r, fnt(600, 18));
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, x0, y0 + 180, R.w - 40, 120, 14, 'rgba(14,20,36,.9)', C.o); txt(g, '双写数据进入事件表 ≈ 分区长度 3 min + 延迟 10 min + 处理时间', x0 + 24, y0 + 225, C.fg, fnt(600, 23)); txt(g, '→ 通常 10–15 分钟；48 h 后暂存分区按 TTL 整块删除', x0 + 24, y0 + 270, C.o, fnt(600, 22)); g.restore(); }
};
// 导出
AN.export = (g, t, R, st) => {
  const k = st.k; const x = R.x + 20, y = R.y + 30;
  rr(g, x, y, 640, 420, 14, '#0B1020', C.o); txt(g, 's3://corp-langfuse-export/lf/', x + 20, y + 34, C.o, fnt(600, 20, 'mono'));
  ['proj_456/', '├─ observations_v2/', '│   ├─ 2026-11-06T09-00-00.parquet', '│   └─ 2026-11-06T10-00-00.parquet', '├─ scores/', '│   └─ 2026-11-06T10-00-00.parquet', '└─ manifests/', '    └─ 2026-11-06T10-00-00.json  ← 完成标记'].forEach((s, i) => txt(g, s, x + 20, y + 80 + i * 40, /manifest|完成/.test(s) ? C.gold : C.fg2, fnt(500, 19, 'mono')));
  if (k === 0) { const u = pop(st.tk, .5); g.save(); g.globalAlpha = u; [['频率', '20 分钟 · 每小时 · 每天 · 每周'], ['格式', 'Parquet（默认）· CSV · JSON · JSONL'], ['压缩', '文本格式可 .gz'], ['目标', 'S3 · GCS · Azure Blob'], ['起点', '全部历史 · 从配置日 · 自定义日期']].forEach(([a, b], i) => { txt(g, a, x + 700, y + 60 + i * 60, C.fg, fnt(700, 23)); txt(g, b, x + 800, y + 60 + i * 60, C.fg2, fnt(500, 21)); }); g.restore(); }
  if (k === 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, x + 700, y, R.w - 740, 300, 14, '#0B1020', C.gold); ['{ "files": [', '   { "key": "…/observations_v2/…parquet", … },', '   { "key": "…/scores/…parquet", … } ] }'].forEach((s, i) => txt(g, s, x + 720, y + 50 + i * 40, C.fg2, fnt(500, 18, 'mono'))); txt(g, '读取方：先等清单 → 再按 files[].key 取', x + 720, y + 240, C.gold, fnt(700, 22)); g.restore(); }
  if (k === 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; const tx = x + 700, tw = R.w - 760; [0, 1, 2].forEach(i => { rr(g, tx + i * tw / 3, y + 80, tw / 3 - 6, 70, 8, 'rgba(255,178,92,.15)', C.o); txt(g, `窗口 ${i + 1}`, tx + i * tw / 3 + 20, y + 115, C.fg, fnt(600, 20)); }); [1, 2].forEach(i => { line(g, [[tx + i * tw / 3 - 3, y + 60], [tx + i * tw / 3 - 3, y + 170]], C.r, 3); }); txt(g, '边界共享 → 按 id 去重', tx, y + 210, C.r, fnt(700, 22)); txt(g, '[min, max) 按 start_time · 文件名 = 窗口结束时间', tx, y + 250, C.fg2, fnt(500, 19, 'mono')); txt(g, '失败重试：覆盖同名对象', tx, y + 290, C.fg2, fnt(500, 21)); g.restore(); }
};
AN.groups = (g, t, R, st) => {
  const k = st.k; const G = [['core', '必选', 'id · trace_id · project_id · type · parent_observation_id · start/end_time'], ['basic', '', 'name · level · environment · version · user_id · session_id · is_root_observation …'], ['time', '', 'created_at · updated_at · completion_start_time'], ['io', '读 full', 'input · output'], ['metadata', '读 full', 'metadata'], ['model', '', 'provided_model_name · model_id · model_parameters · 价格'], ['usage', '', 'usage_details · cost_details · total_cost · 定价档'], ['prompt', '', 'prompt_id · prompt_name · prompt_version'], ['metrics', '单位', 'latency · time_to_first_token'], ['trace_context', '', 'trace_name · tags · release'], ['tools', '', 'tool_calls · tool_call_names · tool_definitions']];
  const hot = k === 0 ? [3, 4] : k === 1 ? [8] : [];
  G.forEach(([n, tagv, d], i) => { const y = R.y + 10 + i * 62, on = !hot.length || hot.includes(i); g.save(); g.globalAlpha = pop(t, i * .08) * (on ? 1 : .35); rr(g, R.x + 20, y, R.w - 40, 52, 10, 'rgba(14,20,36,.9)', on && hot.length ? C.gold : C.line2, on && hot.length ? 2.5 : 1.5); txt(g, n, R.x + 44, y + 26, C.b, fnt(700, 21, 'mono')); if (tagv) txt(g, tagv, R.x + 250, y + 26, tagv === '必选' ? C.g : C.gold, fnt(700, 18)); txt(g, d, R.x + 360, y + 26, C.fg2, fnt(500, 18, 'mono')); g.restore(); });
  if (k === 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 200, R.w - 40, 300, 16, 'rgba(10,14,26,.97)', C.g, 3); txt(g, 'JSONL 直通模式', R.x + 50, R.y + 250, C.g, fnt(800, 30)); const s = [['ClickHouse', 'FORMAT JSONEachRow'], ['Worker', '不解析 · 不补全 · 不重序列化'], ['存储桶', '流式上传（可 gzip）']]; s.forEach(([a, b], i) => { node(g, R.x + 50 + i * 420, R.y + 300, 360, 100, a, C.g, 1, b); if (i) arrow(g, R.x + 50 + i * 420 - 56, R.y + 350, R.x + 50 + i * 420 - 6, R.y + 350, C.g, 3); }); txt(g, '整形（秒单位、去掉单价、字段组）直接写在 SQL 里', R.x + 50, R.y + 460, C.fg2, fnt(500, 21)); g.restore(); }
};

AN.chainall = (g, t, R, st) => AN.chain(g, t, R, { ...st, bi: 0 });
