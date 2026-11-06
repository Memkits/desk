// 《AI 全栈上线》专题：通用场景。每个 beat 的画面（anim:名 / code:名）；相邻 beat 同一动画连成一段，动画函数拿到段内时间与所在 beat 序号。
window.SCENES = {}; window.AN = {}; window.CODE = {};
const SS = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const CL = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), LERP = (a, b, u) => a + (b - a) * u;
const C = { r: '#FF7A93', b: '#5CB4FF', g: '#5FE0A0', p: '#C79BFF', o: '#FFB25C', gold: '#FFD27A', ok: '#5FD39A', bad: '#FF6B6B', fg: '#E9EEF7', fg2: '#A3AEC3', fg3: '#66728C', line: '#1F2940', line2: '#2C3854', panel: '#0E1424', panel2: '#131B2E' };
const F = { sans: '"Noto Sans CJK SC",sans-serif', mono: '"DejaVu Sans Mono",monospace', serif: '"Noto Serif CJK SC",serif' };
const fnt = (w, s, f = 'sans') => `${w} ${s}px ${F[f]}`;

// ---------- 细节卡（金色）：按 beat 键 ----------
const DET = {
  a_open_2: ['本系列', '案例：活动报名网站', '片中服务名只是举例', '价格与配额以官网为准', '设计 / 前端：见前两个系列'],
  a_req_4: ['规格文档 docs/spec.md', '目标与不做清单', '用户故事 + 验收标准', '数据模型草图', '外部服务与费用', '开放问题'],
  a_stack_1: ['全托管举例（海外）', '前端 / 函数：Vercel · Netlify · Cloudflare', 'Postgres：Neon · Supabase', '登录：Auth.js · Clerk 等', '支付 Stripe · 邮件 Resend / Postmark 等'],
  a_stack_2: ['自管举例', '容器平台：Fly.io · Render · Railway', '或 云服务器 + Docker Compose', '自己负责：备份 · 升级 · 补丁 · 监控'],
  a_backend_3: ['Stripe 回调要点', 'Stripe-Signature 头：HMAC 签名', '验签用未解析的原始请求体', '官方 SDK 默认时间容差 300 s', '不保证顺序，可能重复', '生产模式失败后重试最长约 3 天'],
  a_backend_4: ['后台任务队列举例', 'Postgres 任务表（如 pg-boss）', 'Redis 队列（如 BullMQ）', '平台队列（如 Cloudflare Queues）', '失败重试 + 死信记录'],
  a_admin_0: ['预签名上传', 'S3 / R2：presigned PUT URL', '有效期几分钟', '服务端限定类型与大小', '对象名用随机 ID，不用原文件名'],
  a_data_1: ['字段约定', 'amount_cents integer（分）', 'currency char(3)', 'created_at timestamptz（UTC）', 'UNIQUE (user_id, event_id)', 'stripe_payment_intent_id UNIQUE'],
  a_auth_1: ['常见越权（IDOR）', 'GET /api/registrations/1042', '只查了“已登录”，没查“是本人”', '修复：WHERE id = $1 AND user_id = $2', '后台接口再查角色'],
  b_ci_0: ['每次提交检查', 'format · lint · typecheck', 'unit test · build', 'npm audit 等依赖审计', '密钥扫描（如 gitleaks）'],
  b_deploy_0: ['托管平台部署', '每个分支 / PR 一个预览地址', '生产：主分支或手动提升', '回滚：切回上一个部署', '构建产物不可变'],
  b_deploy_2: ['迁移时机', '新代码启动前执行一次', '放在流水线里，不在每个实例启动时跑', '必须兼容上一个版本的代码'],
  b_domain_1: ['TLS 证书最长有效期（CA/B 论坛）', '2026-03-15 起：200 天', '2027-03-15 起：100 天', '2029-03-15 起：47 天', "Let's Encrypt 计划 2028 年起默认 45 天"],
  b_domain_3: ['邮件发送域名', 'SPF：允许谁代你发信', 'DKIM：签名用的公钥', 'DMARC：验证失败怎么处理', '具体记录由邮件服务后台给出'],
  b_sec_3: ['参考清单', 'OWASP Top 10', 'OWASP ASVS（更细的验证标准）', '支付页面交给支付服务托管'],
  b_perf_1: ['压测', '工具举例：k6 · Locust · autocannon', '压预发布，不压生产', '看 p95 延迟、错误率、DB 连接数'],
  b_perf_2: ['连接池', '无服务器 + Postgres：每个实例各开连接', 'Neon / Supabase：提供池化连接串', '自管：PgBouncer', 'Cloudflare Workers：Hyperdrive'],
  b_release_0: ['功能开关举例', '最简单：数据库里一张 flags 表', '服务：LaunchDarkly · Unleash · PostHog 等', '用完的开关要删掉'],
  c_obs_0: ['工具举例', '错误上报：Sentry', '追踪 / 指标：OpenTelemetry → Grafana 等', '日志：平台自带或集中日志服务', '真实用户：Sentry / 平台 Web Analytics'],
  c_obs_2: ['告警示例（阈值为示意）', '报名接口 5xx > 2%，持续 5 分钟', 'p95 延迟 > 2 s，持续 10 分钟', '证书剩余 < 14 天', 'DB 连接 > 80%', '已付款未入账 > 0，持续 10 分钟'],
  c_incident_3: ['Stripe 侧的恢复手段', '失败回调自动重试（生产最长约 3 天）', '控制台可手动重发事件', 'Events API 列出事件补拉', '按 PaymentIntent 与本地记录对账'],
  c_backup_0: ['确认三件事', '保留期：几天到几周（看套餐）', '能否按时间点恢复（PITR）', '恢复耗时：演练实测才知道'],
  c_cost_1: ['预算控制', '平台 / 云厂商的预算与用量提醒', 'AI 接口：按密钥设置花费上限', '代码里：每用户每日调用上限'],
  c_sec_0: ['自动化', 'GitHub Dependabot：安全提醒与升级 PR', 'Renovate：另一种升级机器人', 'Secret scanning：推送密钥时提醒'],
  c_aiops_3: ['只读账号示例', 'DB：只读角色 + 只读副本', '日志 / 指标：仅查看', '无部署 / 密钥 / 账单权限', '改动：PR → 流水线 → 人审'],
};

// ---------- 代码卡 ----------
function hl(src) {
  const cm = []; src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/((?<!:)\/\/.*|\/\*.*?\*\/|(?<=\s)# .*)/g, m => { cm.push(m); return `\u0001${'x'.repeat(cm.length)}\u0002`; });
  src = src.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="s">$1</span>')
    .replace(/\b(const|let|type|interface|function|return|await|async|import|from|export|new|if|else|for|of|as|extends|keyof|typeof|in)\b/g, '<span class="k">$1</span>')
    .replace(/\b(string|number|boolean|Promise|void|never|unknown|Worker|Map)\b/g, '<span class="t">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="n">$1</span>');
  return src.replace(/\u0001(x+)\u0002/g, (_, i) => `<span class="c">${cm[i.length - 1]}</span>`);
}
CODE.agents = { fn: 'AGENTS.md（给代理看的仓库说明，节选）', src: `# 活动报名网站
规格：docs/spec.md（每个任务先读对应小节）

## 运行
pnpm install && pnpm db:migrate && pnpm db:seed
pnpm dev            # http://localhost:3000
pnpm test           # 单元测试；pnpm e2e 走浏览器

## 约定
- TypeScript strict；接口输入一律用 zod 校验
- 金额用整数（分），时间存 UTC
- 改表结构只写新迁移，不改旧迁移

## 不要碰
- .env*、migrations/ 里已有的文件、支付回调的验签逻辑
- 不要新增依赖，除非任务里写了`, note: '文件名各家工具不同（AGENTS.md、CLAUDE.md 等），内容思路一样。', fs: 23 };
CODE.migration = { fn: 'migrations/0003_registrations.sql', src: `CREATE TABLE registrations (
  id          bigserial PRIMARY KEY,
  event_id    bigint NOT NULL REFERENCES events(id),
  user_id     bigint NOT NULL REFERENCES users(id),
  status      text NOT NULL DEFAULT 'pending',   -- pending / paid / cancelled / refunded
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency    char(3) NOT NULL DEFAULT 'USD',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)                     -- 数据库层面防止重复报名
);
CREATE INDEX registrations_event_idx ON registrations (event_id, status);`, note: '迁移只往前走：生产库只通过迁移修改，不手动执行语句。' };
CODE.env = { fn: '.env.example（进仓库，只有变量名）', src: `DATABASE_URL=postgres://user:pass@localhost:5432/signup
APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...        # 本地 / 预发布用测试模式
STRIPE_WEBHOOK_SECRET=whsec_...

EMAIL_API_KEY=
EMAIL_FROM=noreply@example.com

SENTRY_DSN=
# 真实的值放在部署平台的密钥管理里，每个环境一套`, note: '.env 进 .gitignore；仓库里只有这份示例。' };
CODE.ci = { fn: '.github/workflows/ci.yml（节选）', src: `on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:17, env: { POSTGRES_PASSWORD: test }, ports: ['5432:5432'] }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck
      - run: pnpm db:migrate && pnpm test
      - run: pnpm build
      - run: pnpm audit --audit-level=high
      - run: pnpm exec playwright install --with-deps chromium && pnpm e2e`, note: '代理写的代码和人写的代码走同一条流水线。', fs: 23 };
CODE.log = { fn: '一条结构化日志（JSON，一行一条）', src: `{"ts":"2026-11-06T12:03:41.512Z","level":"error",
 "msg":"webhook signature verification failed",
 "request_id":"req_8f3a","route":"POST /api/webhooks/stripe",
 "event_id":42,"registration_id":1042,"user_id":"u_9c1",
 "stripe_event":"evt_…","duration_ms":12,
 "release":"2026.11.06-2","env":"production"}

// 不要出现：密码、令牌、完整卡号、完整手机号、邮件正文`, note: '带上请求编号和版本号：出事时按编号把一次请求的日志全找出来。' };

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


// ---------- 通用版式 ----------
function card(g, x, y, w, h, head, lines, col = C.b, a = 1, hi = false, fs = 22) {
  if (a <= 0) return; g.save(); g.globalAlpha = a;
  rr(g, x, y, w, h, 16, hi ? 'rgba(255,210,122,.09)' : 'rgba(14,20,36,.92)', hi ? C.gold : col, hi ? 3 : 2);
  txt(g, head, x + 22, y + 34, hi ? C.gold : col, fnt(800, 26));
  let yy = y + 78; const lh = Math.round(fs * 1.4);
  (lines || []).forEach(l => { dot(g, x + 28, yy, 4, col); const n = wrapTxt(g, l, x + 44, yy, w - 66, lh, C.fg2, fnt(500, fs)); yy += n * lh + 8; });
  g.restore();
}
function ticks(g, x, y, u, col = C.ok) { if (u <= 0) return; const P = [[x + 6, y + 1], [x + 12, y + 8], [x + 24, y - 9]]; const L1 = 9.2, L2 = 20.8, d = u * (L1 + L2); const pts = [P[0]]; if (d <= L1) pts.push([LERP(P[0][0], P[1][0], d / L1), LERP(P[0][1], P[1][1], d / L1)]); else { pts.push(P[1]); const v = (d - L1) / L2; pts.push([LERP(P[1][0], P[2][0], v), LERP(P[1][1], P[2][1], v)]); } line(g, pts, col, 4); }
function cross(g, x, y, u, col = C.bad, s = 11) { if (u <= 0) return; g.save(); g.globalAlpha = u; line(g, [[x - s, y - s], [x + s, y + s]], col, 4); line(g, [[x + s, y - s], [x - s, y + s]], col, 4); g.restore(); }
function check(g, x, y, s, u, col = C.ok, fs = 24, sub = '') { rr(g, x, y - 15, 30, 30, 7, 'rgba(14,20,36,.9)', u > 0 ? col : C.line2, 2); ticks(g, x + 1, y + 1, u, col); txt(g, s, x + 46, y, u > 0 ? C.fg : C.fg2, fnt(600, fs)); if (sub) { g.font = fnt(600, fs); const w = g.measureText(s).width; txt(g, sub, x + 66 + w, y, C.fg3, fnt(500, fs - 4)); } }
function banner(g, R, s, u, col = C.gold) { if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, R.x + 10, R.y + R.h - 76, R.w - 20, 66, 14, 'rgba(255,210,122,.08)', col); txt(g, s, R.x + 36, R.y + R.h - 43, C.fg, fnt(600, 25)); g.restore(); }
function packet(g, pts, ph, col = C.gold, r = 9) { // 沿折线移动，ph ∈ [0,1]
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let d = CL(ph) * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const u = L[i] ? CL(d / L[i]) : 0; dot(g, LERP(pts[i][0], pts[i + 1][0], u), LERP(pts[i][1], pts[i + 1][1], u), r, col); return; } d -= L[i]; }
}
function person(g, x, y, col = C.fg2, s = 1) { g.save(); g.fillStyle = col; g.beginPath(); g.arc(x, y - 14 * s, 11 * s, 0, 7); g.fill(); g.beginPath(); g.arc(x, y + 18 * s, 18 * s, Math.PI, 0); g.fill(); g.restore(); }
function bot(g, x, y, col = C.p, s = 1) { g.save(); rr(g, x - 18 * s, y - 22 * s, 36 * s, 30 * s, 8 * s, col); dot(g, x - 7 * s, y - 8 * s, 4 * s, '#0B1020'); dot(g, x + 7 * s, y - 8 * s, 4 * s, '#0B1020'); line(g, [[x, y - 22 * s], [x, y - 30 * s]], col, 3); dot(g, x, y - 32 * s, 4 * s, col); rr(g, x - 14 * s, y + 12 * s, 28 * s, 16 * s, 5 * s, col); g.restore(); }
function hdr(g, R, s, sub, col = C.fg) { txt(g, s, R.x + 20, R.y + 22, col, fnt(800, 32)); if (sub) txt(g, sub, R.x + 20, R.y + 64, C.fg3, fnt(500, 22)); }
function chip(g, s, x, y, col = C.b, a = 1, fs = 22) { if (a <= 0) return 0; g.save(); g.globalAlpha = a; g.font = fnt(700, fs); const w = g.measureText(s).width + 32; rr(g, x, y - fs * .9, w, fs * 1.8, 10, 'rgba(14,20,36,.95)', col, 2); txt(g, s, x + w / 2, y, C.fg, fnt(700, fs), 'center'); g.restore(); return w; }

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
  if (!sc.chapter) { const [k, rest] = sc.title.split('：'); const subs = { 1: '需求 · 选型 · AI 协作 · 后端 · 数据 · 环境', 2: '流水线 · 部署 · 域名证书 · 安全 · 性能 · 发布', 3: '可观测 · 事故 · 备份 · 成本 · 安全 · 迭代 · AI 运维' }; ttl = c.el(`<div class="ttl"><div class="k">${k}</div><h1>${rest}</h1><div class="s">${subs[sc.ep]}</div></div>`); }
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
