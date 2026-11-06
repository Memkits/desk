// 《现代前端》专题：通用场景。每个 beat 的画面（anim:名 / code:名）；相邻 beat 同一动画连成一段，动画函数拿到段内时间与所在 beat 序号。
window.SCENES = {}; window.AN = {}; window.CODE = {};
const SS = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const CL = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), LERP = (a, b, u) => a + (b - a) * u;
const C = { r: '#FF7A93', b: '#5CB4FF', g: '#5FE0A0', p: '#C79BFF', o: '#FFB25C', gold: '#FFD27A', ok: '#5FD39A', bad: '#FF6B6B', fg: '#E9EEF7', fg2: '#A3AEC3', fg3: '#66728C', line: '#1F2940', line2: '#2C3854', panel: '#0E1424', panel2: '#131B2E' };
const F = { sans: '"Noto Sans CJK SC",sans-serif', mono: '"DejaVu Sans Mono",monospace', serif: '"Noto Serif CJK SC",serif' };
const fnt = (w, s, f = 'sans') => `${w} ${s}px ${F[f]}`;

// ---------- 细节卡（金色）：按 beat 键 ----------
const DET = {
  a_open_2: ['核对基准', 'langfuse/langfuse @ 6918181（2026-11-05）', 'web 4.76.0 · langfuse-python 5.2.0', '与文档不一致处以代码为准'],
  a_arch_1: ['四个存储', 'Postgres：用户 / 项目 / 密钥 / 提示词 / 配置', 'ClickHouse：追踪数据与评分', 'Redis：BullMQ 队列 + 缓存', 'S3：原始事件 / 媒体 / 导出'],
  a_proto_0: ['OTLP 入口', 'POST /api/public/otel/v1/traces', 'application/x-protobuf 或 application/json', 'Content-Encoding: gzip 可选', 'Authorization: Basic base64(pk:sk)'],
  a_proto_2: ['服务端识别的约定（节选）', 'langfuse.*（首选）', 'gen_ai.*（OTel GenAI 语义约定）', 'ai.*（Vercel AI SDK）', 'llm.* / input.value（OpenInference）'],
  a_gate_0: ['入口体积', 'LANGFUSE_OTEL_INGESTION_MAX_BODY_BYTES', '默认 512 MiB，压缩前后都检查', '超限 413 + Connection: close', '> 16 MiB 记警告'],
  a_gate_2: ['x-langfuse-ingestion-version', '= 4：按 v4 约定，直写', '> 4：400 拒绝', '缺省或 < 4：接收，按其他规则判路径'],
  a_store_0: ['原始事件对象键', '{PREFIX}otel/{projectId}/', '  yyyy/mm/dd/hh/mm/{uuid}.json', '内容：resourceSpans 数组（整批）'],
  a_store_2: ['旧接口对象键', '{PREFIX}{projectId}/{entityType}/', '  {entityId}/{eventId}.json', '入队延迟：非 OTel 默认 ≤ 5 s', 'UTC 23:45–00:15 用 QUEUE_DELAY_MS'],
  a_worker_3: ['ClickhouseWriter 默认', 'WRITE_BATCH_SIZE = 1000', 'WRITE_INTERVAL_MS = 1000', 'MAX_ATTEMPTS = 3'],
  a_route_1: ['resolveOtelWritePath', '1 direct_header', '2 direct_env（NATIVE_OTEL_BEHAVIOUR=direct）', '3 direct_scope', '4 direct_org_cutoff（仅 Cloud）', '否则 dual'],
  a_route_3: ['两个不同的版本门槛', '服务端直写：Python ≥ 4.0.0 / JS ≥ 5.0.0', 'SDK 复制 trace 属性：Python ≥ 4.7.0 / JS ≥ 5.4.0', 'Python SDK 5 / JS SDK 6 需要 v4 服务端'],
  a_cases_4: ['events_only 下的旧接口', 'POST /api/public/ingestion', '只接受 score-create', '其余事件 400，说明“未存储”'],
  a_cases_6: ['采集器转发要点', '透传 Authorization 与 x-langfuse-ingestion-version', '采样 / 过滤不能丢根 span', '同一 span 不要两路重复发送'],
  a_attrs_1: ['user_id 的查找顺序', 'span：langfuse.user.id / user.id', '  / …metadata.langfuse_user_id', '资源：langfuse.user.id / user.id', '最后：user.name', 'session 另识别 gen_ai.conversation.id'],
  a_media_2: ['媒体引用标记', '@@@langfuseMedia:type=image/png', '  |id=<mediaId>|source=base64_data_uri@@@', '对象键：{prefix}{projectId}/{mediaId}.{ext}', 'mediaId 由 sha256 派生，同项目复用'],
  b_table_2: ['events_full 引擎', 'ReplacingMergeTree(event_ts, is_deleted)', 'PARTITION BY toYYYYMM(start_time)', 'SAMPLE BY xxHash32(trace_id)', 'index_granularity_bytes = 64Mi'],
  b_cols_1: ['成本列', 'cost_details：Map(String, Decimal(18,12))', 'calculated_input/output/total_cost：MATERIALIZED', 'total_cost：ALIAS cost_details[\'total\']'],
  b_cols_3: ['展平规则（flattenJsonToPathArrays）', '{a:{b:1}} → names [a.b] values ["1"]', '字符串原样，null 保留', '数组 / 数字 / 布尔 → JSON.stringify'],
  b_core_2: ['逻辑表路由（eventsRouting.ts）', 'e.metadata[k] = \'short\' → events_core', 'startsWith(e.metadata[k], …) → events_core', 'e.input = … / select e.input → events_full'],
  b_core_3: ['events_full 索引', 'bloom_filter：span / trace / user / session', 'text(splitByNonAlpha)：lower(input/output)', 'ngrambf：metadata / name / trace_name / user / session'],
  b_size_2: ['字段溢出（默认关闭）', 'LANGFUSE_OBSERVATION_FIELD_OVERFLOW_ENABLED', '阈值 FIELD_SIZE_LIMIT_BYTES = 2 MiB', '→ @@@langfuseMedia:type=text/plain', '  |id=…|source=field_size_limit@@@'],
  b_size_3: ['写入兜底（jsonRecords.ts）', 'ClickHouse JSON 过大 / Node 字符串超长', '→ 批次对半拆分重试', '单条：> 1M 字符截到 500K', '  + "[TRUNCATED: Field exceeded size limit]"'],
  b_dual_1: ['双写节奏（代码默认）', '暂存分区：3 分钟（s3_first_seen_timestamp）', '处理条件：分区早于 now() − 10 min', '游标：Redis langfuse:event-propagation:…', '暂存 TTL：48 h'],
  b_dual_3: ['和文档不一致', 'STUCK_THRESHOLD_MINUTES：代码默认 35', '文档写 15', '健康检查：GET :3030/api/health?failIfEventPropagationStuck=true'],
  b_export_1: ['导出目录', '{prefix}{projectId}/observations_v2/{ts}.{fmt}[.gz]', '{prefix}{projectId}/scores/…', '{prefix}{projectId}/manifests/{ts}.json'],
  b_export_4: ['导出单位与格式', 'latency / TTFT：2026-04-01 后创建为秒，之前毫秒', 'Parquet：无 input/output/total_price', 'ClickHouse < 25.11：Parquet 可能不完整'],
  c_why_3: ['官方博客数据', '数据增长约 19×，节点规格约 15×', '长时间范围查询仍有 OOM', '改为不可变批次后部分自部署 S3 费用约 −85%'],
  c_idea_3: ['v4 最低版本', 'ClickHouse 25.12 · Postgres 15 · Redis 7.0', '原因：轻量更新、全文索引、JSON 类型', '现状：events 表 metadata 为两个数组'],
  c_ch_2: ['相关设置', 'parallel_view_processing = 1', '任务耗时恢复到约 45 s'],
  c_modes_1: ['启动即报错的组合', 'legacy + NATIVE_OTEL_BEHAVIOUR=direct', 'events_only + dual_write', 'events_only + ALLOW_PREVIEW_OPT_IN=false'],
  c_modes_3: ['回填前检查', 'SELECT * FROM background_migrations', '  WHERE finished_at IS NULL  -- 必须 0 行', '磁盘：约 3× 现有 ClickHouse 数据'],
  c_cb_1: ['脱敏回调配置（EE）', 'LANGFUSE_INGESTION_MASKING_CALLBACK_URL', 'TIMEOUT_MS = 500 · MAX_RETRIES = 1', 'CALLBACK_FAIL_CLOSED = false（放行）', 'PROPAGATED_HEADERS = 逗号分隔头名'],
  c_cb_2: ['回调的边界', '只作用于 OTel 路径', '旧 /api/public/ingestion、Scores API 不经过', '原始 S3 文件不回写', '重放：worker/src/scripts/replayIngestionEventsV2'],
};

// ---------- 代码卡 ----------
function hl(src) {
  const cm = []; src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(\/\/.*|\/\*.*?\*\/)/g, m => { cm.push(m); return `\u0001${'x'.repeat(cm.length)}\u0002`; });
  src = src.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="s">$1</span>')
    .replace(/\b(const|let|type|interface|function|return|await|async|import|from|export|new|if|else|for|of|as|extends|keyof|typeof|in)\b/g, '<span class="k">$1</span>')
    .replace(/\b(string|number|boolean|Promise|void|never|unknown|Worker|Map)\b/g, '<span class="t">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="n">$1</span>');
  return src.replace(/\u0001(x+)\u0002/g, (_, i) => `<span class="c">${cm[i.length - 1]}</span>`);
}
CODE.otlp = { fn: 'OTLP/JSON 请求体（节选）', src: `POST /api/public/otel/v1/traces
x-langfuse-ingestion-version: 4

{ "resourceSpans": [{
  "resource": { "attributes": [
    { "key": "service.name", "value": { "stringValue": "chat-api" } } ] },
  "scopeSpans": [{
    "scope": { "name": "langfuse-sdk", "version": "5.2.0" },
    "spans": [{
      "traceId": "5b8efff798038103d269b633813fc60c",
      "spanId": "eee19b7ec3c1b174",
      "startTimeUnixNano": "1793884668928000000",
      "attributes": [
        { "key": "langfuse.observation.type",
          "value": { "stringValue": "generation" } },
        { "key": "user.id", "value": { "stringValue": "u-42" } } ]
    }] }] }] }`, note: '属性是 {key, value} 列表，不是 JSON 对象；结构化内容先序列化成字符串。', fs: 21 };
CODE.propagate = { fn: 'Python SDK · 传播 trace 属性', src: `from langfuse import get_client, propagate_attributes
langfuse = get_client()

with propagate_attributes(user_id="u-42", session_id="s-7",
                          tags=["prod"], metadata={"tenant": "acme"}):
    with langfuse.start_as_current_observation(name="chat"):
        call_llm()          # 这里创建的每个 span 都带上 user/session/tags

# 跨服务：as_baggage=True 通过 HTTP 头传给下游（会发给所有下游，勿放敏感值）`, note: '服务端不会在批内从根 span 继承，属性必须在每个 span 上。' };
CODE.events_full = { fn: 'clickhouse/migrations/canonical/0039_create_events_full.up.sql（节选）', src: `CREATE TABLE events_full (
  project_id String, trace_id String, span_id String, parent_span_id String,
  start_time DateTime64(6), end_time Nullable(DateTime64(6)),
  name String, type LowCardinality(String), environment LowCardinality(String),
  trace_name String, user_id String, session_id String, tags Array(String),
  usage_details Map(LowCardinality(String), UInt64),
  cost_details  Map(LowCardinality(String), Decimal(18,12)),
  input String CODEC(ZSTD(3)), output String CODEC(ZSTD(3)),
  metadata_names Array(String), metadata_values Array(String),
  blob_storage_file_path String, event_ts DateTime64(6), is_deleted UInt8, …
) ENGINE = ReplacingMergeTree(event_ts, is_deleted)
PARTITION BY toYYYYMM(start_time)
ORDER BY (project_id, toStartOfMinute(start_time), xxHash32(trace_id), span_id, start_time)`, note: 'trace 级属性是行上的列；元数据是两个平行数组。' };
CODE.propagate_sql = { fn: 'worker/…/eventPropagation/handleEventPropagationJob.ts（节选）', src: `INSERT INTO events_full (…)
SELECT
  obs.id AS span_id,
  CASE WHEN obs.id = concat('t-', obs.trace_id) THEN ''
       ELSE coalesce(obs.parent_observation_id, concat('t-', obs.trace_id)) END,
  coalesce(t.user_id, '') AS user_id, coalesce(t.session_id, '') AS session_id,
  t.tags, t.name AS trace_name,
  mapKeys(mapConcat(obs.metadata, coalesce(t.metadata, map()))) AS metadata_names,
  mapValues(mapConcat(obs.metadata, coalesce(t.metadata, map()))) AS metadata_values,
  multiIf(mapContains(obs.metadata, 'resourceAttributes'),
          'otel-dual-write', 'ingestion-api-dual-write') AS source, …
FROM observations_batch_staging obs FINAL
LEFT JOIN relevant_traces t        -- traces 取 LIMIT 1 BY 最新一行，回看 ≤ 7 天
  ON obs.project_id = t.project_id AND obs.trace_id = t.id
WHERE obs._partition_value = tuple('{partition}')`, note: 'mapConcat 前面的 observation 元数据优先；缺父节点指向虚拟根 t-<trace_id>。' };
CODE.sdkmask = { fn: 'Python SDK · 客户端脱敏', src: `import re
from langfuse import Langfuse

PHONE = re.compile(r"1[3-9]\\d{9}")
def mask(*, data, **kwargs):
    if isinstance(data, str):
        return PHONE.sub("[PHONE]", data)
    return data            # 对象会被递归处理时，可在这里遍历

langfuse = Langfuse(mask=mask)
# 对每个 span 的 input / output / metadata 调用：先抽走媒体，再调用 mask`, note: '敏感数据不离开应用；第三方埋点产生的 span 不经过这里。' };
CODE.maskcb = { fn: '服务端脱敏回调 · 请求与响应', src: `POST {LANGFUSE_INGESTION_MASKING_CALLBACK_URL}
Content-Type: application/json
X-Langfuse-Org-Id: org_123
X-Langfuse-Project-Id: proj_456
x-tenant-id: acme              ← PROPAGATED_HEADERS 里列出的上报头

[ { "resource": {…}, "scopeSpans": [ { "scope": {…}, "spans": [ … ] } ] } ]

—— 响应 200 ——
[ { "resource": {…}, "scopeSpans": [ … 改写后的 spans … ] } ]   // 结构必须一致`, note: '超时 500 ms，重试 1 次（100 ms 起翻倍，≤ 1 s）；失败默认放行。' };

// ---------- 画布工具 ----------
function txt(g, s, x, y, col = C.fg2, font = fnt(600, 26), al = 'left', bl = 'middle') { g.fillStyle = col; g.font = font; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r, fill, stroke, lw = 2) { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function node(g, x, y, w, h, label, col = C.b, a = 1, sub = '') { if (a <= 0) return; g.save(); g.globalAlpha = a; rr(g, x, y, w, h, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, label, x + w / 2, y + h / 2 - (sub ? 12 : 0), C.fg, fnt(700, sub ? 26 : 27), 'center'); if (sub) txt(g, sub, x + w / 2, y + h / 2 + 20, C.fg3, fnt(500, 19), 'center'); g.restore(); }
function arrow(g, x0, y0, x1, y1, col = C.fg3, lw = 3, head = 12, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); const an = Math.atan2(y1 - y0, x1 - x0); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - head * Math.cos(an - .45), y1 - head * Math.sin(an - .45)); g.lineTo(x1 - head * Math.cos(an + .45), y1 - head * Math.sin(an + .45)); g.fill(); g.restore(); }
function line(g, pts, col = C.fg3, lw = 2, dash = null) { g.save(); g.strokeStyle = col; g.lineWidth = lw; if (dash) g.setLineDash(dash); g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.restore(); }
function dot(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function pop(t, t0, d = .5) { return SS((t - t0) / d); }
function bars(g, x, y, w, h, items, t, opts = {}) { // items: [label, value, col]
  const max = opts.max || Math.max(...items.map(i => i[1])); const bw = w / items.length;
  items.forEach(([lab, v, col, sub], i) => { const u = pop(t, (opts.t0 || 0) + i * (opts.gap ?? .25), .6); const bh = h * v / max * u; const X = x + i * bw + bw * .18; g.fillStyle = col || C.b; rr(g, X, y + h - bh, bw * .64, bh, 8, col || C.b); txt(g, lab, X + bw * .32, y + h + 26, C.fg2, fnt(600, 22), 'center'); if (u > .9) txt(g, opts.fmt ? opts.fmt(v) : v, X + bw * .32, y + h - bh - 20, C.fg, fnt(700, 24, 'mono'), 'center'); if (sub) txt(g, sub, X + bw * .32, y + h + 54, C.fg3, fnt(500, 18), 'center'); });
}
function wrapTxt(g, s, x, y, maxW, lh, col, font) { g.font = font; const out = []; let cur = ''; for (const ch of s) { if (g.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch.trim() ? ch : ''; } else cur += ch; } if (cur) out.push(cur); out.forEach((l, i) => txt(g, l, x, y + i * lh, col, font)); return out.length; }
function title(g, s, R, sub) { txt(g, s, R.x + 20, R.y + 26, C.fg, fnt(700, 30)); if (sub) txt(g, sub, R.x + 20, R.y + 66, C.fg3, fnt(500, 22)); }
function tag(g, s, x, y, col = C.b, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = fnt(600, 20); const w = g.measureText(s).width + 28; rr(g, x, y - 18, w, 36, 18, 'rgba(255,255,255,.06)', col, 1.5); txt(g, s, x + w / 2, y, col, fnt(600, 20), 'center'); g.restore(); return w; }

// ---------- 场景组装 ----------
function codeLayer(c, lay, name, det) {
  const d = CODE[name]; const w = det ? 1300 : 1600;
  c.el(`<div class="codecard" style="width:${w}px"><div class="fn"><i></i><i></i><i></i>${d.fn}</div><pre style="${d.fs ? `font-size:${d.fs}px` : ''}">${hl(d.src)}</pre>${d.note ? `<div class="note">${d.note}</div>` : ''}</div>`, lay);
  return {};
}
function animLayer(c, lay, name, det) {
  const cv = c.el(`<canvas class="an" width="1920" height="1080"></canvas>`, lay), g = cv.getContext('2d');
  const R = det ? { x: 100, y: 140, w: 1300, h: 820 } : { x: 100, y: 140, w: 1720, h: 820 };
  return { draw: (lt, st) => { g.clearRect(0, 0, 1920, 1080); (AN[name] || AN._missing)(g, lt, R, st); } };
}
AN._missing = (g, t, R) => txt(g, '（画面待做）', R.x + R.w / 2, R.y + R.h / 2, C.fg3, fnt(600, 40), 'center');

function build(c) {
  const sc = c.sc, n = sc.beats.length, segs = [];
  sc.beats.forEach((b, i) => {
    const st = i === 0 ? 0 : b.s - .35, en = i < n - 1 ? sc.beats[i + 1].s - .35 : sc.T;
    const v = b.vis[0], last = segs[segs.length - 1];
    if (last && last.v === v) { last.b = en; last.beats.push({ i, s: b.s }); return; }
    segs.push({ v, a: st, b: en, key: b.key, bi: i, beats: [{ i, s: b.s }] });
  });
  const detOf = i => DET[sc.beats[i].key] || null;
  segs.forEach(s => { s.lay = c.el(`<div class="lay"></div>`); const [kind, name] = s.v.split(':'); const det = s.beats.some(b => detOf(b.i)); s.obj = kind === 'code' ? codeLayer(c, s.lay, name, det) : animLayer(c, s.lay, name, det); });
  const dets = [];
  sc.beats.forEach((b, i) => { const d = detOf(i); if (!d) return; const e = i < n - 1 ? sc.beats[i + 1].s - .3 : sc.T - .3;
    const el = c.el(`<div class="det" style="left:1440px;top:200px"><span class="h">${d[0]}</span>${d.slice(1).map(x => `<span class="ln">${x}</span>`).join('')}</div>`); el.style.opacity = 0; dets.push({ el, a: b.s + .4, e }); });
  let ttl = null;
  if (!sc.chapter) { const [k, rest] = sc.title.split('：'); const subs = { 1: '协议 · 入口 · 转存 · 处理 · 写入路径 · 六种对接', 2: '事件表 · 字段 · 两张表 · 格式链 · 大体积 · 导出', 3: 'v3 的问题 · 不可变与反范式 · 迁移 · 三层脱敏' }; ttl = c.el(`<div class="ttl"><div class="k">${k}</div><h1>${rest}</h1><div class="s">${subs[sc.ep]}</div></div>`); }
  c.tick(t => {
    segs.forEach((s, i) => {
      const nx = segs[i + 1], fi = i === 0 ? 1 : SS((t - s.a) / .6), fo = nx ? 1 - SS((t - nx.a) / .6) : 1;
      const op = t < s.a ? 0 : Math.min(fi, fo);
      if (op <= 0) { if (s.lay.style.display !== 'none') s.lay.style.display = 'none'; return; }
      s.lay.style.display = 'block'; s.lay.style.opacity = op;
      if (s.obj.draw) { let k = 0; for (let j = 1; j < s.beats.length; j++) if (t >= s.beats[j].s) k = j; s.obj.draw(t - s.a, { k, tk: t - (k ? s.beats[k].s : s.a), n: s.beats.length, bi: s.beats[k].i }); }
    });
    dets.forEach(({ el, a, e }) => { const u = SS((t - a) / .5); el.style.opacity = Math.min(u, SS((e - t) / .4)); el.style.transform = `translateY(${(1 - u) * 14}px)`; });
    if (ttl) ttl.style.opacity = t < 4.5 ? 1 : 1 - SS((t - 4.5) / .8);
  });
}
TL.scenes.forEach(s => SCENES[s.id] = { build });
