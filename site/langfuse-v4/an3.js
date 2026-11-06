// 下集动画：原理、迁移、脱敏
AN.v3v4 = (g, t, R, st) => {
  const half = R.w / 2 - 30;
  [['v3：每个用户的成本', C.fg3, ['traces FINAL（去重）', 'observations FINAL（去重）', 'JOIN 几十亿行', 'GROUP BY user_id'], '秒级 · 长范围可能 OOM'], ['v4：每个用户的成本', C.g, ['events（不可变，无需去重）', 'GROUP BY user_id'], '毫秒级 · 单次扫描']].forEach(([n, col, steps, res], i) => {
    const x = R.x + 20 + i * (half + 20), u = pop(t, .2 + i * .6); g.save(); g.globalAlpha = u; rr(g, x, R.y + 30, half, 620, 18, 'rgba(14,20,36,.9)', col, 2.5); txt(g, n, x + 30, R.y + 80, col, fnt(800, 30));
    steps.forEach((s, j) => { const y = R.y + 140 + j * 110; const uu = pop(t, .5 + i * .6 + j * .3); g.globalAlpha = u * uu; node(g, x + 40, y, half - 80, 80, s, col); if (j) arrow(g, x + half / 2, y - 26, x + half / 2, y - 4, C.fg3, 2.5, 9); });
    g.globalAlpha = u; txt(g, res, x + 30, R.y + 610, i ? C.g : C.r, fnt(700, 26)); g.restore(); });
};
AN.v3update = (g, t, R, st) => {
  const k = st.k; const x = R.x + 20, y = R.y + 40;
  txt(g, '一次调用 → 多个事件（同一条记录）', x, y, C.fg, fnt(700, 26));
  const ev = [['observation-create', 'input', '09:41:02.100'], ['observation-update', 'output · usage', '09:41:05.870'], ['observation-update', 'metadata 补丁', '09:41:06.020']];
  ev.forEach(([a, b, tm], i) => { const u = pop(t, .3 + i * .5); g.save(); g.globalAlpha = u; rr(g, x, y + 40 + i * 90, 760, 72, 12, 'rgba(14,20,36,.9)', C.b); txt(g, a, x + 20, y + 76 + i * 90, C.b, fnt(600, 21, 'mono')); txt(g, b, x + 330, y + 76 + i * 90, C.fg2, fnt(500, 21)); txt(g, tm, x + 740, y + 76 + i * 90, C.fg3, fnt(500, 18, 'mono'), 'right'); g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const bx = R.x + 840; txt(g, 'ReplacingMergeTree：每次更新写一整行新版本', bx, y, C.fg, fnt(700, 24)); for (let i = 0; i < 3; i++) { rr(g, bx, y + 40 + i * 70, 560, 56, 10, i === 2 ? 'rgba(95,224,160,.15)' : 'rgba(255,255,255,.04)', i === 2 ? C.g : C.line2); txt(g, `obs-1 · event_ts = v${i + 1}`, bx + 20, y + 68 + i * 70, i === 2 ? C.g : C.fg3, fnt(500, 20, 'mono')); }
    txt(g, '后台合并时间不确定 → 读时必须去重', bx, y + 270, C.r, fnt(700, 24));
    rr(g, x, y + 340, R.w - 40, 230, 14, '#0B1020', C.r); [['FINAL', '完整去重，大表上时间、内存都贵'], ['ORDER BY event_ts DESC LIMIT 1 BY id', '通常最便宜，但依赖排序'], ['argMax(…)', '整个结果集放在内存里，很少用']].forEach(([a, b], i) => { txt(g, a, x + 24, y + 384 + i * 64, C.r, fnt(600, 22, 'mono')); txt(g, b, x + 640, y + 384 + i * 64, C.fg2, fnt(500, 21)); }); g.restore(); }
};
AN.v3join = (g, t, R, st) => {
  const k = st.k; const x = R.x + 20, y = R.y + 40;
  if (k === 0) { node(g, x, y + 80, 380, 120, 'traces', C.fg3, 1, 'user_id 在这里'); node(g, x + 820, y + 80, 380, 120, 'observations', C.fg3, 1, '成本在这里'); const ph = (t * .6) % 1; for (let i = 0; i < 18; i++) { const yy = y + 100 + (i % 6) * 16; const xx = x + 390 + ((ph + i / 18) % 1) * 420; dot(g, xx, yy, 4, C.r); } txt(g, 'JOIN 几十亿行', x + 600, y + 260, C.r, fnt(800, 30), 'center'); txt(g, '试过：grace_hash 关联 · 调整顺序 · 下推过滤 —— 都不够', x, y + 360, C.fg2, fnt(500, 23)); }
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; txt(g, '一年里：数据 vs 节点规格（官方博客，示意）', x, y, C.fg, fnt(700, 24)); bars(g, x + 40, y + 40, 700, 380, [['数据量', 19, C.r], ['节点规格', 15, C.fg3]], st.tk, { fmt: v => v + '×' }); txt(g, '长时间范围查询仍然内存溢出 → 加机器不是解法', x, y + 520, C.gold, fnt(700, 25)); txt(g, '对象存储：按实体存增量，读时 LIST + GET + 合并', x, y + 570, C.fg2, fnt(500, 22)); g.restore(); }
};
AN.v4idea = (g, t, R, st) => {
  const k = st.bi; const x = R.x + 20, y = R.y + 30;
  const tl = (yy, lab, col, marks) => { line(g, [[x + 200, yy], [x + R.w - 80, yy]], C.line2, 2); txt(g, lab, x + 180, yy, col, fnt(700, 22), 'right'); marks.forEach(([p, s]) => { dot(g, x + 200 + p * (R.w - 300), yy, 9, col); txt(g, s, x + 200 + p * (R.w - 300), yy - 26, C.fg2, fnt(500, 18), 'center'); }); };
  tl(y + 60, 'v3 事件', C.fg3, [[.1, 'create'], [.55, 'update'], [.7, 'update']]); tl(y + 160, 'OTel span', C.g, [[.6, 'end() 后导出一次']]);
  txt(g, '不可变：span 结束后才导出，导出后不再修改', x, y + 230, C.gold, fnt(700, 26));
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; rr(g, x, y + 290, R.w - 40, 200, 16, '#0B1020', C.g); txt(g, '反范式：trace 属性复制到每一行', x + 24, y + 330, C.g, fnt(700, 24)); const hdr = ['span_id', 'name', 'user_id', 'session_id', 'tags', 'total_cost']; hdr.forEach((h, i) => txt(g, h, x + 24 + i * 210, y + 375, C.fg3, fnt(600, 18, 'mono'))); [['a1', 'chat', 'u-42', 's-7', '[prod]', '0.0123'], ['a2', 'retrieve', 'u-42', 's-7', '[prod]', '0'], ['a3', 'llm', 'u-42', 's-7', '[prod]', '0.0119']].forEach((r, j) => r.forEach((c, i) => txt(g, c, x + 24 + i * 210, y + 410 + j * 26, i >= 2 && i <= 4 ? C.g : C.fg2, fnt(500, 18, 'mono')))); g.restore(); }
  if (k >= 3) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; rr(g, x, y + 520, R.w - 40, 140, 16, 'rgba(255,210,122,.08)', C.gold); txt(g, '少量修改（收藏 · 公开）→ ClickHouse 轻量更新', x + 24, y + 565, C.fg, fnt(600, 23)); txt(g, '25.12 的原因：轻量更新 · 全文索引 · JSON 类型（events 表 metadata 目前是两个数组）', x + 24, y + 615, C.fg2, fnt(500, 21)); g.restore(); }
};
AN.chnotes = (g, t, R, st) => {
  const k = st.k; const N = [['数据块过多', '一个分区约 1000 个（正常 150–200）', '扫描效率差', C.r], ['单行过大', '行里几 MB 字符串，合并接近 150 GiB 上限卡住', '去冗余 · granule 64 MiB · 截断表', C.o], ['物化视图拖慢插入', '默认关闭插入并行', 'parallel_view_processing = 1', C.b], ['Keeper 元数据积压', '频繁 TTL 删分区，节点晚 25 分钟看到新数据', '与 ClickHouse 团队修上游', C.p], ['迁移吞吐', '按新排序键复制表 · 冻结合并', '按数据块并发（≤ 15）· 约 4×', C.g]];
  const hot = [[], [0, 1], [2, 3], [4]][k] || [];
  N.forEach(([n, a, b, col], i) => { const y = R.y + 20 + i * 140, on = !hot.length || hot.includes(i); g.save(); g.globalAlpha = pop(t, i * .15) * (on ? 1 : .35); rr(g, R.x + 20, y, R.w - 40, 120, 14, 'rgba(14,20,36,.9)', col, on && hot.length ? 3 : 1.5); txt(g, n, R.x + 44, y + 42, col, fnt(800, 26)); txt(g, a, R.x + 44, y + 86, C.fg2, fnt(500, 21)); txt(g, '→ ' + b, R.x + R.w - 60, y + 86, C.g, fnt(600, 20), 'right'); g.restore(); });
};
AN.modes = (g, t, R, st) => {
  const k = st.k; const M = [['legacy', '旧表写 · 旧表读', '事件表不写', C.fg3], ['dual', '旧表 + 事件表', '旧 SDK 经暂存表延迟进入', C.o], ['events_only', '只写事件表（v4 默认）', '旧批量接口只收评分', C.g]];
  M.forEach(([n, a, b, col], i) => { const x = R.x + 20 + i * (R.w - 40) / 3, w = (R.w - 40) / 3 - 30, u = pop(t, .2 + i * .3); g.save(); g.globalAlpha = u; rr(g, x, R.y + 30, w, 220, 16, 'rgba(14,20,36,.9)', col, 2.5); txt(g, n, x + 24, R.y + 80, col, fnt(800, 30, 'mono')); txt(g, a, x + 24, R.y + 140, C.fg, fnt(600, 22)); txt(g, b, x + 24, R.y + 190, C.fg3, fnt(500, 20)); g.restore(); if (i) arrow(g, x - 28, R.y + 140, x - 4, R.y + 140, C.fg3, 3, 10, u); });
  txt(g, 'LANGFUSE_MIGRATION_V4_WRITE_MODE', R.x + 20, R.y + 290, C.fg3, fnt(500, 19, 'mono'));
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const y = R.y + 340; txt(g, '× NATIVE_OTEL_BEHAVIOUR', R.x + 20, y, C.fg, fnt(700, 24)); const cell = (x, yy, s, ok) => { rr(g, x, yy, 280, 60, 10, ok ? 'rgba(95,224,160,.12)' : 'rgba(255,107,107,.15)', ok ? C.g : C.r); txt(g, s, x + 140, yy + 30, ok ? C.g : C.r, fnt(700, 20), 'center'); };
    ['legacy', 'dual', 'events_only'].forEach((m, i) => txt(g, m, R.x + 360 + i * 300, y + 50, C.fg2, fnt(600, 20, 'mono'), 'center')); [['direct', [0, 1, 1]], ['dual_write', [1, 1, 0]]].forEach(([n, oks], j) => { txt(g, n, R.x + 20, y + 110 + j * 80, C.fg2, fnt(600, 20, 'mono')); oks.forEach((ok, i) => cell(R.x + 220 + i * 300, y + 80 + j * 80, ok ? '可用' : '启动报错', ok)); }); g.restore(); }
};
AN.backfill = (g, t, R, st) => {
  const k = st.k; const S = [['① 根 span', 'traces → events_full', 'span_id = t-<trace_id> · type SPAN', C.b], ['② 重排', 'observations → pid_tid_sorting', '按 (project_id, trace_id, id) 排序', C.p], ['③ 子事件', 'JOIN traces 补属性', 'trace 元数据不复制', C.g], ['④ 实验', 'dataset run items', '补 experiment_* 字段', C.o], ['⑤ 清理', '删中间表（可选）', 'DROP_PID_TID_SORTING_TABLES', C.fg3]];
  const w = (R.w - 40) / 5; S.forEach(([n, a, b, col], i) => { const x = R.x + 20 + i * w, u = pop(t, .2 + i * .3); g.save(); g.globalAlpha = u; rr(g, x, R.y + 40, w - 30, 260, 16, 'rgba(14,20,36,.9)', col, 2.5); txt(g, n, x + 20, R.y + 86, col, fnt(800, 26)); wrapTxt(g, a, x + 20, R.y + 140, w - 70, 28, C.fg, fnt(600, 20)); wrapTxt(g, b, x + 20, R.y + 210, w - 70, 26, C.fg3, fnt(500, 17)); g.restore(); if (i) arrow(g, x - 28, R.y + 170, x - 4, R.y + 170, C.fg3, 3, 10, u); });
  txt(g, '后台迁移链：不停机 · 从新到旧 · 可续跑 · 只跑一次（要在双写确认健康后再开）', R.x + 20, R.y + 350, C.gold, fnt(600, 23));
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; [['回填', '磁盘 ≈ 3× 现有 ClickHouse 数据', C.b], ['不回填', '双写一个完整保留周期，旧数据自然过期', C.o]].forEach(([a, b, col], i) => { const x = R.x + 20 + i * (R.w / 2); rr(g, x, R.y + 400, R.w / 2 - 40, 120, 14, 'rgba(14,20,36,.9)', col); txt(g, a, x + 24, R.y + 442, col, fnt(800, 26)); txt(g, b, x + 24, R.y + 488, C.fg2, fnt(500, 21)); }); rr(g, R.x + 20, R.y + 550, R.w - 40, 90, 14, 'rgba(255,107,107,.1)', C.r); txt(g, '升级前：v3 后台迁移必须全部完成，否则 v4 迁移会删掉还没复制的行', R.x + 44, R.y + 595, C.fg, fnt(700, 23)); g.restore(); }
};
// 脱敏三个位置
function maskDiagram(g, t, R, hot) {
  const y = R.y + 120, items = [['应用 + SDK', 'mask(data=…)', C.b], ['OTel 采集器', 'attributes / transform 处理器', C.p], ['Web 入口', '', C.fg3], ['S3 原始事件', '未脱敏', C.r], ['Worker', '脱敏回调（EE）', C.o], ['ClickHouse', '', C.g]];
  const w = (R.w - 40) / 6; items.forEach(([n, d, col], i) => { const x = R.x + 20 + i * w, on = hot.includes(i); node(g, x, y, w - 30, 110, n, col, on || !hot.length ? 1 : .35, d); if (i) arrow(g, x - 28, y + 55, x - 4, y + 55, C.fg3, 2.5, 9); });
  const ph = (t * .3) % 1, px = R.x + 20 + ph * (R.w - 60), stage = Math.floor(ph * 6); const masked = stage >= 1; dot(g, px, y + 150, 10, stage === 3 ? C.r : C.gold); txt(g, stage === 3 ? '原始' : '…', px, y + 180, C.fg3, fnt(500, 16), 'center');
  [[0, '①'], [1, '②'], [4, '③']].forEach(([i, s]) => txt(g, s, R.x + 20 + i * w + (w - 30) / 2, y - 26, C.gold, fnt(800, 30), 'center'));
}
AN.mask3 = (g, t, R, st) => {
  const k = st.bi; const hot = k === 0 ? [] : k === 2 ? [1] : [0, 1, 4];
  maskDiagram(g, t, R, hot);
  const y = R.y + 360; const rows = [['① 客户端', '数据不离开应用', '每个应用都要接 · 第三方埋点不经过', C.b], ['② 采集器', '所有来源都经过', '规则语言弱 · I/O 是整段 JSON 字符串', C.p], ['③ 服务端回调', '集中处理 · 可做复杂识别', '需要 EE · 只管 OTel · S3 原件未脱敏', C.o]];
  rows.forEach(([n, a, b, col], i) => { const on = !hot.length || (k === 2 ? i === 1 : true); g.save(); g.globalAlpha = pop(t, .5 + i * .3) * (on ? 1 : .35); rr(g, R.x + 20, y + i * 110, R.w - 40, 92, 12, 'rgba(14,20,36,.9)', col, 2); txt(g, n, R.x + 44, y + i * 110 + 46, col, fnt(800, 25)); txt(g, '✓ ' + a, R.x + 300, y + i * 110 + 30, C.g, fnt(600, 20)); txt(g, '✗ ' + b, R.x + 300, y + i * 110 + 64, C.r, fnt(600, 20)); g.restore(); });
};
AN.maskcb = (g, t, R, st) => {
  const k = st.n === 1 ? 3 : 4 + st.k; maskDiagram(g, t, R, [3, 4]);
  const y = R.y + 360;
  if (k <= 3) { const ph = (t * .35) % 1; node(g, R.x + 60, y, 300, 100, 'Worker', C.o); node(g, R.x + R.w - 380, y, 320, 100, '你们的脱敏服务', C.gold); arrow(g, R.x + 370, y + 35, R.x + R.w - 390, y + 35, C.fg3, 2.5); arrow(g, R.x + R.w - 390, y + 70, R.x + 370, y + 70, C.fg3, 2.5); dot(g, LERP(R.x + 380, R.x + R.w - 400, ph), y + 35, 7, C.r); dot(g, LERP(R.x + R.w - 400, R.x + 380, ph), y + 70, 7, C.g); txt(g, 'POST 整批 resourceSpans（原始）', R.x + R.w / 2, y + 18, C.fg3, fnt(500, 18), 'center'); txt(g, '200 · 同结构（已脱敏）', R.x + R.w / 2, y + 96, C.fg3, fnt(500, 18), 'center'); }
  if (k === 4) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const yy = y + 130; txt(g, '失败处理', R.x + 20, yy, C.fg, fnt(700, 24)); [['CALLBACK_FAIL_CLOSED = false（默认）', '放行：用原始数据继续 → 未脱敏入库', C.r], ['CALLBACK_FAIL_CLOSED = true', '丢弃整批 · 日志留 S3 key · replayIngestionEventsV2 重放', C.g]].forEach(([a, b, col], i) => { rr(g, R.x + 20, yy + 30 + i * 90, R.w - 40, 76, 12, 'rgba(14,20,36,.9)', col); txt(g, a, R.x + 44, yy + 56 + i * 90, col, fnt(600, 20, 'mono')); txt(g, b, R.x + 44, yy + 88 + i * 90, C.fg2, fnt(500, 19)); }); g.restore(); }
  if (k === 5) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const yy = y + 130; ['① 需要企业版许可证（无许可证时配置被忽略并告警）', '② 只作用于 OTel 路径：旧 /api/public/ingestion、Scores API 不经过', '③ 在下载 S3 之后执行：原始文件未脱敏，blob_storage_file_path 指向原件'].forEach((s, i) => txt(g, s, R.x + 20, yy + i * 54, i === 2 ? C.r : C.fg, fnt(600, 22))); g.restore(); }
  if (k === 6) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const yy = y + 130; rr(g, R.x + 20, yy, R.w - 40, 170, 14, 'rgba(255,107,107,.08)', C.r); txt(g, '原始事件桶按敏感数据对待', R.x + 44, yy + 40, C.r, fnt(800, 26)); txt(g, 'SSE-KMS 加密（LANGFUSE_S3_EVENT_UPLOAD_SSE）· 最小权限 · 生命周期规则短期删除', R.x + 44, yy + 86, C.fg2, fnt(500, 20)); txt(g, '或者在入口之前，用采集器 / 网关先做一遍', R.x + 44, yy + 128, C.fg2, fnt(500, 20)); g.restore(); }
};
AN.plan = (g, t, R, st) => {
  const k = st.k; const L = [['第一层 · 客户端', ['SDK mask：手机号、证件号等确定字段', '媒体在这里抽走', 'mask 抛异常 → 整段替换为兜底值'], C.b], ['第二层 · 网关（OTel Collector）', ['统一加 x-langfuse-ingestion-version: 4', '补租户等资源属性 · 删不允许出域的属性', '限制单批大小 · 采样保留根 span'], C.p], ['第三层 · 服务端', ['脱敏回调 + FAIL_CLOSED=true · 模型识别', '事件桶、媒体桶 SSE-KMS + 短生命周期', '打开字段溢出：超长文本落媒体桶'], C.o], ['导出侧', ['导到自有桶 · 先读清单 · 按 id 去重', 'metadata_names/values 还原结构', '回查原件：blob_storage_file_path'], C.g]];
  const hot = k === 0 ? [] : [k - 1];
  L.forEach(([n, items, col], i) => { const y = R.y + 10 + i * 175, on = !hot.length || hot.includes(i); g.save(); g.globalAlpha = pop(t, i * .2) * (on ? 1 : .35); rr(g, R.x + 20, y, R.w - 40, 158, 16, on && hot.length ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.9)', col, on && hot.length ? 3 : 2); txt(g, n, R.x + 44, y + 40, col, fnt(800, 26)); items.forEach((s, j) => txt(g, '· ' + s, R.x + 44, y + 82 + j * 30, C.fg2, fnt(500, 20))); g.restore(); });
};
AN.risks = (g, t, R, st) => {
  const k = st.k; const L = [['重复上报', '同一 span 两次 → 两条记录（读取不保证去重）', 0], ['属性缺失', 'trace 属性没复制到子 span → 按用户查不到', 1], ['兜底键', '未识别属性在 metadata.attributes 下，嵌套键不能直接过滤', 1], ['旧批量接口', 'events_only 下只收评分', 1], ['回调放行', '回调故障期间数据未脱敏', 2], ['原始事件桶', '始终未脱敏', 2], ['导出差异', 'latency 秒 / 毫秒 · Parquet 缺单价字段', 2], ['参考网页', '每个结论附代码位置 · 改造以代码为准', 3]];
  L.forEach(([n, d, b], i) => { const x = R.x + 20 + (i % 2) * (R.w / 2), y = R.y + 20 + Math.floor(i / 2) * 160, on = b <= k; g.save(); g.globalAlpha = pop(t, i * .1) * (on ? 1 : .15); rr(g, x, y, R.w / 2 - 40, 140, 14, 'rgba(14,20,36,.9)', b === 3 ? C.gold : C.r, 2); txt(g, n, x + 24, y + 44, b === 3 ? C.gold : C.r, fnt(800, 26)); wrapTxt(g, d, x + 24, y + 88, R.w / 2 - 90, 28, C.fg2, fnt(500, 20)); g.restore(); });
};
