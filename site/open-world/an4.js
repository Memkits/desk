// 第四集动画：活起来（以及第三集的环境叙事）
const FR = (t, st, a, b) => CL((t - a * (st.D || 18)) / ((b - a) * (st.D || 18)));
function npc(g, x, y, col = C.fg2, s = 1) { dot(g, x, y - 10 * s, 6 * s, col); rr(g, x - 5 * s, y - 3 * s, 10 * s, 16 * s, 4 * s, col); }
function boxObj(g, x, y, w, h, fill, stroke) { rr(g, x, y, w, h, 4, fill, stroke, 2); }

// ---------- 第三集：环境叙事 ----------
AN.story = (g, t, R, st) => {
  hdr(g, R, '环境叙事：不用一句台词');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 560; rr(g, x, y, W, H, 14, '#0F1A24', C.line2, 2);
  g.save(); g.beginPath(); g.roundRect(x, y, W, H, 14); g.clip();
  g.fillStyle = '#1B2B22'; g.fillRect(x, y + 330, W, H); g.fillStyle = '#3B3226'; g.beginPath(); g.moveTo(x, y + 450); g.bezierCurveTo(x + 400, y + 400, x + 800, y + 470, x + W, y + 380); g.lineTo(x + W, y + 440); g.bezierCurveTo(x + 800, y + 530, x + 400, y + 460, x, y + 520); g.fill();
  // 远处的烟
  for (let i = 0; i < 14; i++) { const k = ((t * .3 + i / 14) % 1), sx = x + W - 180 + Math.sin(k * 6 + i) * 20 * k, sy = y + 320 - k * 260; al(g, (1 - k) * pop(t, 1), () => dot(g, sx, sy, 14 + k * 40, 'rgba(160,170,190,.18)')); }
  rr(g, x + W - 210, y + 300, 60, 30, 4, '#2A1F18');
  // 翻倒的马车
  g.save(); g.translate(x + 360, y + 420); g.rotate(-.35); rr(g, -110, -50, 220, 70, 8, '#5A4632', '#8A6A48', 2); g.restore();
  g.beginPath(); g.arc(x + 260, y + 470, 34, 0, 7); g.strokeStyle = '#8A6A48'; g.lineWidth = 6; g.stroke(); g.beginPath(); g.arc(x + 470, y + 360, 30, 0, 7); g.stroke();
  [[520, 470], [560, 490], [600, 462], [430, 505]].forEach(([a, b], i) => al(g, pop(t, 2 + i * .3), () => { g.save(); g.translate(x + a, y + b); g.rotate(i * .5); rr(g, -16, -12, 32, 24, 3, '#7A5E3E', '#A5835A', 1.5); g.restore(); }));
  for (let i = 0; i < 9; i++) al(g, pop(t, 4 + i * .2), () => { dot(g, x + 640 + i * 46, y + 455 - i * 10 + (i % 2) * 12, 5, 'rgba(255,255,255,.35)'); });
  g.restore();
  const Q = [['马车翻了', x + 360, y + 300], ['行李散落一地', x + 560, y + 400], ['脚印通往远处', x + 840, y + 380], ['烟：有人在那里？', x + W - 180, y + 160]];
  Q.forEach(([s, qx, qy], i) => al(g, pop(t, 5 + i * 1.6), () => { chip(g, '？ ' + s, qx - 90, qy, C.gold, 1, 22); }));
  al(g, pop(t, 12), () => txt(g, '玩家自己拼出故事 → 主动停下来探索', x, y + H + 50, C.fg, fnt(700, 26)));
};

// ---------- 片头 ----------
AN.open4 = (g, t, R, st) => {
  landscape(g, R, t, st.k === 0 ? .9 : .35);
  for (let i = 0; i < 9; i++) { const px = R.x + 100 + ((t * (14 + i * 3) + i * 170) % (R.w - 200)), py = R.y + 650 + (i % 3) * 40; al(g, st.k === 0 ? 1 : .3, () => npc(g, px, py, [C.gold, C.b, C.g][i % 3], 1.4)); }
  for (let i = 0; i < 6; i++) { const bx = R.x + ((t * 60 + i * 300) % R.w), by = R.y + 150 + Math.sin(t * 2 + i) * 20 + i * 12; line(g, [[bx - 10, by - 6], [bx, by], [bx + 10, by - 6]], C.fg2, 2.5); }
  if (st.k === 0) { al(g, pop(t, 3), () => { rr(g, R.x + 60, R.y + 120, 760, 230, 18, 'rgba(14,20,36,.9)', C.line2, 2); ['路上有行人', '森林里有动物', '推得动的箱子', '下次进来，一切还在'].forEach((s, i) => check(g, R.x + 100, R.y + 170 + i * 48, s, pop(t, 3.5 + i * 1.5), C.ok, 26)); }); return; }
  hdr(g, R, '这一集');
  const E = [['NPC', '思考与行动', C.g], ['物理', '跑得动的模拟', C.o], ['存档', '记住改动', C.b], ['多人', '共处一个世界', C.p], ['AI', '正在带来的变化', C.r], ['技能地图', '四集汇总', C.gold]], w = (R.w - 5 * 24) / 6;
  E.forEach(([a, b, col], i) => { const u = pop(st.tk, .5 + i * 1.2); node(g, R.x + i * (w + 24), R.y + 300, w, 140, a, col, u, b); });
};

// ---------- 01 NPC ----------
const OBST = [[.18, .2, .12, .35], [.45, .05, .1, .3], [.42, .6, .2, .22], [.72, .3, .08, .4]];
AN.navmesh = (g, t, R, st) => {
  hdr(g, R, '导航网格：先知道哪里能走');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 560, nx = 8, ny = 5, tw = W / nx, th = H / ny, pl = [x + W * (.08 + .5 * FR(t, st, .1, .9)), y + H * .85];
  rr(g, x, y, W, H, 12, '#101826', C.line2, 2);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const cx = x + (i + .5) * tw, cy = y + (j + .5) * th, near = Math.hypot(cx - pl[0], cy - pl[1]) < 520, X = x + i * tw, Y = y + j * th;
    al(g, near ? 1 : .25, () => { rr(g, X + 3, Y + 3, tw - 6, th - 6, 4, 'rgba(95,224,160,.16)', 'rgba(95,224,160,.35)', 1); line(g, [[X + 3, Y + 3], [X + tw - 3, Y + th - 3]], 'rgba(95,224,160,.25)', 1); line(g, [[X + tw - 3, Y + 3], [X + tw * .5, Y + th - 3]], 'rgba(95,224,160,.2)', 1); }); }
  OBST.forEach(([a, b, c, d]) => rr(g, x + a * W, y + b * H, c * W, d * H, 6, '#2A3550', C.fg3, 2));
  al(g, pop(t, 1), () => { const P = [[.05, .62], [.35, .6], [.4, .48], [.62, .48], [.68, .22], [.86, .2], [.94, .5]].map(p => [x + p[0] * W, y + p[1] * H]); line(g, P, C.gold, 4); packet(g, P, (t * .08) % 1, C.gold, 10); txt(g, '寻路：在多边形上找最短路径', x + 20, y + 30, C.gold, fnt(700, 22)); });
  person(g, pl[0], pl[1], C.b, 1); al(g, pop(t, 4), () => txt(g, '跟着玩家流式加载', pl[0] + 24, pl[1] - 10, C.b, fnt(700, 21)));
  const rb = FR(t, st, .6, .7); if (rb > 0) { const X = x + 6 * tw, Y = y + 3 * th; rr(g, X + 3, Y + 3, tw - 6, th - 6, 4, `rgba(255,210,122,${.25 + .2 * Math.sin(t * 8)})`, C.gold, 3); dot(g, X + tw / 2, Y + th / 2, 18 * rb, '#5A5060'); txt(g, '地形改了：只重建这一块', X + tw / 2, Y - 18, C.gold, fnt(700, 22), 'center'); }
};
AN.bt = (g, t, R, st) => {
  hdr(g, R, '行为树：从根往下，挑能做的事');
  const cx = R.x + R.w / 2, y0 = R.y + 130, ph = Math.floor(FR(t, st, .2, 1) * 6);
  const N = { root: [cx, y0, '选择', '?'], s1: [cx - 400, y0 + 170, '序列', '→'], s2: [cx, y0 + 170, '序列', '→'], idle: [cx + 400, y0 + 170, '闲逛', ''], c1: [cx - 540, y0 + 340, '看见敌人？', ''], a1: [cx - 320, y0 + 340, '战斗', ''], c2: [cx - 90, y0 + 340, '饿了？', ''], a2: [cx + 130, y0 + 340, '找吃的', ''] };
  const E = [['root', 's1'], ['root', 's2'], ['root', 'idle'], ['s1', 'c1'], ['s1', 'a1'], ['s2', 'c2'], ['s2', 'a2']];
  const S = { root: ph >= 1 ? 'run' : '', s1: ph >= 2 ? 'fail' : ph >= 1 ? 'run' : '', c1: ph >= 2 ? 'fail' : ph >= 1 ? 'run' : '', s2: ph >= 3 ? 'run' : '', c2: ph >= 4 ? 'ok' : ph >= 3 ? 'run' : '', a2: ph >= 5 ? 'run' : '' };
  const col = s => s === 'ok' ? C.ok : s === 'fail' ? C.bad : s === 'run' ? C.gold : C.line2;
  E.forEach(([a, b]) => line(g, [[N[a][0], N[a][1] + 40], [N[b][0], N[b][1] - 40]], col(S[b]), S[b] ? 3 : 2));
  Object.entries(N).forEach(([k, [x, y, s, sym]]) => { const c = col(S[k]); rr(g, x - 95, y - 40, 190, 80, 14, 'rgba(14,20,36,.95)', S[k] ? c : (k[0] === 'c' ? C.b : k[0] === 'a' || k === 'idle' ? C.g : C.p), S[k] ? 3 : 2); txt(g, (sym ? sym + ' ' : '') + s, x, y, C.fg, fnt(700, 25), 'center');
    if (S[k] === 'ok' || S[k] === 'fail') txt(g, S[k] === 'ok' ? '成功' : '失败', x, y - 60, c, fnt(800, 20), 'center'); if (S[k] === 'run' && k === 'a2') txt(g, '进行中', x, y - 60, c, fnt(800, 20), 'center'); });
  al(g, pop(t, 1), () => { [['条件', C.b], ['动作', C.g], ['组合节点', C.p]].forEach(([s, c], i) => chip(g, s, R.x + 20 + i * 150, R.y + 620, c, 1, 22)); });
  al(g, FR(t, st, .8, .9), () => txt(g, '状态树：状态机 + 行为树的选择逻辑', R.x + 520, R.y + 620, C.fg2, fnt(600, 23)));
};
AN.sense = (g, t, R, st) => {
  hdr(g, R, '感知：看得见、听得到，才会反应');
  const x = R.x + 20, y = R.y + 110, W = 780, H = 560; rr(g, x, y, W, H, 12, '#101826', C.line2, 2);
  const nx = x + 200, ny = y + 300, ang = -.2 + .25 * Math.sin(t * .4), fov = .55, rng = 420; rr(g, x + 430, y + 120, 30, 200, 4, '#2A3550', C.fg3, 2);
  g.save(); g.beginPath(); g.moveTo(nx, ny); g.arc(nx, ny, rng, ang - fov, ang + fov); g.closePath(); g.fillStyle = 'rgba(255,210,122,.1)'; g.fill(); g.strokeStyle = 'rgba(255,210,122,.5)'; g.lineWidth = 2; g.stroke(); g.restore();
  const u = FR(t, st, .05, .9), pp = [x + 640 - u * 260, y + 140 + u * 250], running = u > .3 && u < .55, seen = u > .7;
  if (running) [1, 2, 3].forEach(k => { const r = ((t * 120 + k * 60) % 180); g.beginPath(); g.arc(pp[0], pp[1], r, 0, 7); g.strokeStyle = `rgba(92,180,255,${.5 * (1 - r / 180)})`; g.lineWidth = 2; g.stroke(); });
  line(g, [[nx, ny], pp], seen ? C.bad : 'rgba(160,170,190,.4)', 2, [6, 6]); person(g, pp[0], pp[1], C.b, 1); npc(g, nx, ny, C.gold, 2);
  const states = [['未察觉', C.fg3], ['听到声响', C.b], ['去查看', C.gold], ['看见了 → 战斗', C.bad]], si = seen ? 3 : u > .55 ? 2 : running ? 1 : 0;
  const px = x + W + 40; states.forEach(([s, c], i) => { const on = i === si; rr(g, px, y + 20 + i * 100, R.x + R.w - px - 10, 80, 14, on ? c + '22' : 'rgba(14,20,36,.92)', on ? c : C.line2, on ? 3 : 2); txt(g, s, px + 24, y + 60 + i * 100, on ? C.fg : C.fg3, fnt(700, 26)); });
  txt(g, '视野：距离 + 角度 + 视线不被挡', px, y + 460, C.fg2, fnt(600, 21)); txt(g, '声音：按距离衰减，跑步传得更远', px, y + 500, C.fg2, fnt(600, 21));
};
AN.smartobj = (g, t, R, st) => {
  hdr(g, R, '智能物体：物体告诉角色“怎么用我”');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 560; rr(g, x, y, W, H, 12, '#101826', C.line2, 2);
  const O = [['长椅', '坐下 · 聊天', x + 300, y + 160, C.b], ['篝火', '取暖 · 烤肉', x + 900, y + 180, C.o], ['铁匠铺', '打铁', x + 820, y + 440, C.g], ['水井', '打水', x + 260, y + 450, C.p]];
  O.forEach(([a, b, ox, oy, col], i) => { rr(g, ox - 40, oy - 20, 80, 40, 8, col + '33', col, 2); txt(g, a, ox, oy, C.fg, fnt(700, 21), 'center'); al(g, pop(t, 1 + i * .6), () => { rr(g, ox - 90, oy - 82, 180, 44, 10, 'rgba(14,20,36,.95)', col, 1.5); txt(g, b, ox, oy - 60, col, fnt(600, 20), 'center'); }); });
  const n0 = [x + 600, y + 300], u = FR(t, st, .35, .7), tgt = [x + 300, y + 205], p = [LERP(n0[0], tgt[0], SS(u)), LERP(n0[1], tgt[1], SS(u))];
  if (FR(t, st, .2, .35) > 0 && u < .05) { const r = 300 * FR(t, st, .2, .35); g.beginPath(); g.arc(n0[0], n0[1], r, 0, 7); g.strokeStyle = `rgba(255,210,122,${.6 * (1 - r / 300)})`; g.lineWidth = 3; g.stroke(); txt(g, '附近有什么能用？', n0[0], n0[1] - 50, C.gold, fnt(700, 22), 'center'); }
  npc(g, p[0], p[1] + (u >= 1 ? 6 : 0), C.gold, 2); if (u >= 1) txt(g, '坐下 · 播放对应动画', tgt[0], tgt[1] + 54, C.gold, fnt(700, 22), 'center');
  al(g, FR(t, st, .75, .85), () => banner(g, R, '设计师摆一张长椅 = 多了一个能坐下聊天的地方', 1));
};
AN.ecs = (g, t, R, st) => {
  hdr(g, R, '实体组件系统：同类数据放在一起，一批批处理');
  const x = R.x + 20, y = R.y + 120; txt(g, '每个都是完整对象', x, y, C.bad, fnt(700, 24));
  for (let i = 0; i < 12; i++) { const bx = x + 20 + HSH(i, 1) * 400, by = y + 50 + HSH(i, 2) * 300; rr(g, bx, by, 70, 46, 6, '#1E2A44', C.line2, 1.5); txt(g, '角色', bx + 35, by + 23, C.fg3, fnt(600, 18), 'center'); if (i) { const px = x + 20 + HSH(i - 1, 1) * 400 + 35, py = y + 50 + HSH(i - 1, 2) * 300 + 23; line(g, [[px, py], [bx + 35, by + 23]], 'rgba(255,107,107,.3)', 1.5, [4, 5]); } }
  txt(g, '内存里东一块西一块：缓存不友好', x, y + 420, C.fg3, fnt(600, 21));
  const ax = x + 560, cw = 30, n = 20, rows = [['位置', C.b], ['速度', C.g], ['生命', C.o]];
  al(g, pop(t, 2), () => { txt(g, '按组件连续存放', ax, y, C.ok, fnt(700, 24)); rows.forEach(([s, c], r) => { txt(g, s, ax, y + 70 + r * 70, C.fg2, fnt(700, 22)); for (let i = 0; i < n; i++) rr(g, ax + 70 + i * (cw + 3), y + 52 + r * 70, cw, 36, 3, c + (r < 2 ? '66' : '22'), null); });
    const sc = Math.floor(FR(t, st, .25, .65) * n); if (sc > 0) { rr(g, ax + 66, y + 46, sc * (cw + 3) + 2, 120, 6, null, C.gold, 3); txt(g, '移动系统：位置 += 速度 × dt', ax + 70, y + 290, C.gold, fnt(700, 23)); } });
  al(g, FR(t, st, .65, .75), () => { const ty = y + 340; txt(g, '分给 4 个线程', ax, ty, C.fg, fnt(700, 23)); [C.b, C.g, C.p, C.o].forEach((c, k) => { rr(g, ax + 70 + k * 5 * (cw + 3), ty + 30, 5 * (cw + 3) - 6, 30, 6, c + '55', c, 2); txt(g, `线程 ${k + 1}`, ax + 70 + k * 5 * (cw + 3) + 2.5 * (cw + 3), ty + 45, C.fg, fnt(600, 18), 'center'); }); });
};
AN.ailod = (g, t, R, st) => {
  hdr(g, R, 'AI 也有细节层次');
  const cx = R.x + 380, cy = R.y + 440, rs = [110, 210, 300, 360], cols = [C.ok, C.b, C.p, C.fg3], hz = [24, 2, .3, 0];
  for (let k = 3; k >= 0; k--) { g.beginPath(); g.arc(cx, cy, rs[k], 0, 7); g.fillStyle = cols[k] + '14'; g.fill(); g.strokeStyle = cols[k]; g.lineWidth = 1.5; g.stroke(); }
  person(g, cx, cy, C.gold, 1.1);
  for (let i = 0; i < 60; i++) { const a = HSH(i, 1) * 6.283, d = 40 + HSH(i, 2) * 310, k = rs.findIndex(r => d < r), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; if (k === 3) { if (i % 6 === 0) txt(g, '#', x, y, C.fg3, fnt(700, 16, 'mono'), 'center'); continue; }
    const think = hz[k] > 10 || ((t * hz[k] + HSH(i, 3)) % 1) < .15; npc(g, x, y, think ? cols[k] : cols[k] + '66', k === 0 ? 1.2 : .8); }
  const L = [['最近', '每帧思考 · 完整动画 · 真实避让', C.ok], ['近', '几秒思考一次 · 简化动画', C.b], ['远', '按日程表在地图上移动', C.p], ['最远', '只是一个数字：这片有几个人', C.fg3]], px = R.x + 800;
  L.forEach(([a, b, c], i) => al(g, pop(t, 1 + i * 1.5), () => { rr(g, px, R.y + 140 + i * 120, R.x + R.w - px - 10, 96, 14, 'rgba(14,20,36,.92)', c, 2); txt(g, a, px + 24, R.y + 172 + i * 120, c, fnt(800, 25)); txt(g, b, px + 24, R.y + 212 + i * 120, C.fg2, fnt(600, 21)); }));
  al(g, FR(t, st, .8, .9), () => txt(g, '玩家走近：无缝换成完整角色', px, R.y + 660, C.gold, fnt(700, 24)));
};

// ---------- 02 物理 ----------
AN.fixed = (g, t, R, st) => {
  hdr(g, R, '固定步长：渲染可以忽快忽慢，物理一步一样长');
  const x0 = R.x + 160, W = R.w - 200, y1 = R.y + 200, y2 = R.y + 360, sc = W / 0.2;
  const fr = [0, .014, .031, .040, .062, .079, .097, .118, .131, .150, .168, .186, .2], vis = FR(t, st, .05, .7);
  txt(g, '渲染帧', R.x + 20, y1 + 30, C.b, fnt(700, 24)); txt(g, '物理步', R.x + 20, y2 + 30, C.o, fnt(700, 24));
  for (let i = 0; i < fr.length - 1; i++) { if (fr[i] / .2 > vis) break; rr(g, x0 + fr[i] * sc + 2, y1, (fr[i + 1] - fr[i]) * sc - 4, 60, 6, 'rgba(92,180,255,.2)', C.b, 2); }
  const dt = 1 / 60; for (let k = 0; k * dt < .2 - 1e-6; k++) { if (k * dt / .2 > vis) break; rr(g, x0 + k * dt * sc + 2, y2, dt * sc - 4, 60, 6, 'rgba(255,178,92,.2)', C.o, 2); }
  for (let i = 1; i < fr.length; i++) if (fr[i] / .2 <= vis) line(g, [[x0 + fr[i] * sc, y1 + 60], [x0 + fr[i] * sc, y2]], C.line2, 1.5, [4, 4]);
  txt(g, '时间宽度不一', x0 + W, y1 - 24, C.b, fnt(600, 20), 'right'); txt(g, '每步 1/60 秒', x0 + W, y2 + 90, C.o, fnt(600, 20), 'right');
  al(g, FR(t, st, .6, .7), () => { const yy = R.y + 520; txt(g, '累加器：', R.x + 20, yy, C.fg, fnt(700, 24)); const a = (t * .9) % 1; rr(g, R.x + 140, yy - 18, 400, 36, 8, '#18223A'); rr(g, R.x + 140, yy - 18, 400 * a, 36, 8, C.gold); line(g, [[R.x + 540, yy - 28], [R.x + 540, yy + 28]], C.o, 3); txt(g, '满一步 → 模拟一步', R.x + 570, yy, C.fg2, fnt(600, 22)); txt(g, '剩下的比例 → 画面插值', R.x + 140, yy + 60, C.fg2, fnt(600, 22)); });
};
AN.sleep = (g, t, R, st) => {
  hdr(g, R, '休眠与孤岛：只算正在动的东西');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 560; rr(g, x, y, W, H, 12, '#101826', C.line2, 2);
  g.fillStyle = 'rgba(8,12,22,.6)'; g.fillRect(x + W * .72, y, W * .28, H); txt(g, '远处：不模拟', x + W * .86, y + 40, C.fg3, fnt(700, 22), 'center');
  const hit = FR(t, st, .35, .5), act = hit > 0 && FR(t, st, .5, .95) < 1;
  for (let i = 0; i < 40; i++) { const bx = x + 40 + (i % 10) * 85, by = y + 120 + Math.floor(i / 10) * 110; const isl = i === 13 || i === 14 || i === 23 || i === 24; const c = isl && act ? C.gold : '#2A3550'; let ox = 0, oy = 0; if (isl && act) { ox = Math.sin(t * 9 + i) * 4; oy = Math.cos(t * 7 + i) * 3; }
    boxObj(g, bx + ox, by + oy, 54, 54, c + (isl && act ? '55' : ''), isl && act ? C.gold : C.line2); if (!(isl && act)) txt(g, 'z', bx + 44, by + 6, C.fg3, fnt(700, 16), 'center'); }
  if (hit > 0 && hit < 1) dot(g, LERP(x + 60, x + 40 + 3.5 * 85, hit), y + 230 - Math.sin(hit * 3.14) * 80, 14, C.r);
  if (act) { rr(g, x + 40 + 3 * 85 - 12, y + 120 + 110 - 12, 2 * 85 + 8, 2 * 110 - 8, 12, null, C.gold, 2.5); txt(g, '一个孤岛：一起求解', x + 40 + 4 * 85, y + 120 + 3 * 110 + 20, C.gold, fnt(700, 22), 'center'); }
  txt(g, 'z = 休眠：不计算', x + 40, y + H - 30, C.fg3, fnt(600, 21));
};
AN.vehicle = (g, t, R, st) => {
  hdr(g, R, '载具：射线悬挂 + 轮胎模型');
  const x = R.x + 20, W = 760, gy = R.y + 520, sh = t * 120, G = X => gy - 30 * Math.sin((X + sh) * .012) - 14 * Math.sin((X + sh) * .031);
  const P = []; for (let X = x; X <= x + W; X += 8) P.push([X, G(X)]); g.beginPath(); g.moveTo(x, gy + 120); P.forEach(p => g.lineTo(...p)); g.lineTo(x + W, gy + 120); g.closePath(); g.fillStyle = '#1E2B22'; g.fill(); line(g, P, '#7FBF8A', 3);
  const wx = [x + 250, x + 510], bodyY = (G(wx[0]) + G(wx[1])) / 2 - 120, tilt = Math.atan2(G(wx[1]) - G(wx[0]), wx[1] - wx[0]) * .6;
  g.save(); g.translate((wx[0] + wx[1]) / 2, bodyY); g.rotate(tilt); rr(g, -190, -40, 380, 70, 16, '#2E4A7A', C.b, 2.5); rr(g, -100, -90, 200, 54, 12, '#24385E', C.b, 2); g.restore();
  wx.forEach((X, i) => { const top = bodyY + 30 + (i ? 1 : -1) * Math.sin(tilt) * 130, gnd = G(X), comp = CL(1 - (gnd - top - 40) / 110); line(g, [[X, top], [X, gnd]], C.gold, 2, [5, 5]);
    for (let k = 0; k < 6; k++) { const yy = LERP(top, gnd - 34, k / 6); line(g, [[X - 10, yy], [X + 10, yy + (gnd - 34 - top) / 12]], C.fg2, 2); }
    g.beginPath(); g.arc(X, gnd - 30, 30, 0, 7); g.fillStyle = '#151A24'; g.fill(); g.strokeStyle = C.fg2; g.lineWidth = 3; g.stroke();
    arrow(g, X + 40, gnd - 10, X + 40, gnd - 10 - 40 - comp * 60, C.ok, 3, 10); txt(g, `压缩 ${Math.round(comp * 100)}%`, X, top - 22, C.gold, fnt(700, 19, 'mono'), 'center'); });
  al(g, pop(t, 1), () => txt(g, '射线向下：测出每个轮子的悬挂压缩', x, R.y + 150, C.gold, fnt(700, 23)));
  const cx = x + W + 70, cw = R.x + R.w - cx - 20, cy = R.y + 200, ch = 280; al(g, pop(t, 6), () => { rr(g, cx, cy, cw, ch, 12, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '轮胎模型：打滑程度 → 抓地力', cx + 20, cy + 30, C.fg2, fnt(700, 21));
    const Q = []; for (let k = 0; k <= 60; k++) { const s = k / 60 * 12, q = s * 10 / 12, f = Math.sin(1.9 * Math.atan(q - .3 * (q - Math.atan(q)))); Q.push([cx + 30 + k / 60 * (cw - 60), cy + ch - 40 - f * (ch - 100)]); } line(g, Q, C.ok, 3); txt(g, '打滑 →', cx + cw - 30, cy + ch - 18, C.fg3, fnt(600, 18), 'right'); txt(g, '峰值：最佳抓地', cx + 140, cy + 64, C.ok, fnt(600, 19)); });
  al(g, FR(t, st, .75, .85), () => txt(g, '开得快：流式加载要跑得过车', cx, R.y + 560, C.r, fnt(700, 24)));
};
function shards() { return pcache('shards', () => { const S = [], r = RND(17), pts = []; for (let i = 0; i < 22; i++) pts.push([r(), r()]); const n = 40;
  const own = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let b = 0, bd = 9; pts.forEach((p, k) => { const d = (p[0] - i / n) ** 2 + (p[1] - j / n) ** 2; if (d < bd) { bd = d; b = k; } }); own.push(b); }
  pts.forEach((p, k) => { const cells = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (own[j * n + i] === k) cells.push([i / n, j / n]); S.push({ c: p, cells, v: [(p[0] - .3) * 2 + (r() - .5), -r() * 1.5 - .3], w: (r() - .5) * 4 }); }); return S; }); }
AN.destruct = (g, t, R, st) => {
  hdr(g, R, '破坏：提前切好碎块，被打中才拆开');
  const x = R.x + 380, y = R.y + 160, W = 360, H = 400, S = shards(), hitT = .25 * (st.D || 18), dt = Math.max(0, t - hitT), cs = W / 40, floor = R.y + 640;
  line(g, [[R.x + 20, floor], [R.x + R.w - 20, floor]], C.fg3, 2);
  S.forEach((s, k) => { const cx = x + s.c[0] * W, cy0 = y + s.c[1] * H, vx = s.v[0] * 90, vy = s.v[1] * 120, gr = 700, tl = (-vy + Math.sqrt(vy * vy + 4 * gr * .5 * Math.max(0, floor - 14 - cy0))) / gr, tt = Math.min(dt, tl), ox = vx * tt, dy = vy * tt + .5 * gr * tt * tt, rot = s.w * tt * .5;
    const fade = 1 - .8 * CL((dt - .4 * (st.D || 18)) / (.15 * (st.D || 18))); al(g, fade, () => { g.save(); g.translate(cx + ox, cy0 + dy); g.rotate(rot); g.fillStyle = `hsl(20,15%,${32 + (k % 5) * 5}%)`; s.cells.forEach(([u, v]) => g.fillRect((u - s.c[0]) * W, (v - s.c[1]) * H, cs + 1.5, cs + 1.5)); g.restore(); }); });
  if (dt === 0) { const showCut = t > .12 * (st.D || 18); if (showCut) S.forEach(s => { const [u, v] = s.c; dot(g, x + u * W, y + v * H, 3, C.gold); }); txt(g, showCut ? '整体存在 · 预切碎块（金点 = 碎块中心）' : '一面墙', x + W / 2, y - 30, C.gold, fnt(700, 22), 'center'); }
  if (t > hitT - 1 && dt < .2) dot(g, LERP(R.x + 60, x, CL((t - hitT + 1))), y + H / 2, 18, C.r);
  const px = R.x + 820; [['平时', '一个整体：便宜', C.fg2, 0], ['受到冲击', '拆成碎块交给物理', C.r, .35], ['静止之后', '合并或淡出，免得越积越多', C.ok, .6]].forEach(([a, b, c, f], i) => al(g, FR(t, st, f, f + .05), () => { rr(g, px, R.y + 160 + i * 140, R.x + R.w - px - 10, 110, 14, 'rgba(14,20,36,.92)', c, 2); txt(g, a, px + 24, R.y + 198 + i * 140, c, fnt(800, 25)); txt(g, b, px + 24, R.y + 240 + i * 140, C.fg2, fnt(600, 21)); }));
};
AN.physeng = (g, t, R, st) => {
  hdr(g, R, '三大引擎的物理');
  const D = [['虚幻引擎五', 'Chaos', ['自研，取代早年的 PhysX', '刚体 · 破坏 · 载具 · 布料'], C.b], ['Unity', 'PhysX + DOTS 物理', ['传统对象：PhysX', 'DOTS：Unity Physics', '或 Havok Physics'], C.g], ['Godot', 'Jolt（4.4 起内置）', ['开源，以性能著称', '此前是 Godot 自带的物理'], C.p]], w = (R.w - 60) / 3;
  D.forEach(([a, b, ls, c], i) => al(g, pop(t, .5 + i * 2), () => { const x = R.x + i * (w + 30); rr(g, x, R.y + 140, w, 380, 18, 'rgba(14,20,36,.92)', c, 2.5); txt(g, a, x + 26, R.y + 186, c, fnt(700, 24)); txt(g, b, x + 26, R.y + 252, C.fg, fnt(800, 34)); ls.forEach((s, k) => { dot(g, x + 32, R.y + 330 + k * 56, 4, c); wrapTxt(g, s, x + 48, R.y + 330 + k * 56, w - 70, 30, C.fg2, fnt(600, 22)); }); }));
};

// ---------- 03 存档 ----------
AN.delta = (g, t, R, st) => {
  hdr(g, R, '只存差异：初始世界不用存');
  const x = R.x + 20, y = R.y + 130, cs = 50, n = 10, m = 7; rr(g, x - 10, y - 20, n * cs + 20, m * cs + 60, 14, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '初始世界（游戏包里，只读）', x, y, C.fg2, fnt(700, 22));
  const ch = [[2, 1, '已打开', C.gold], [6, 3, '已摧毁', C.bad], [4, 5, '位置变了', C.b], [8, 2, '已打开', C.gold], [1, 4, '已摧毁', C.bad]];
  for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) { const c = ch.findIndex(q => q[0] === i && q[1] === j), on = c >= 0 && FR(t, st, .1 + c * .06, .14 + c * .06) > 0; rr(g, x + i * cs + 6, y + 30 + j * cs + 6, cs - 12, cs - 12, 6, on ? ch[c][3] + '55' : '#1E2A44', on ? ch[c][3] : null, 2); }
  const fx = x + n * cs + 70, fw = R.x + R.w - fx - 10; al(g, FR(t, st, .2, .3), () => { rr(g, fx, y - 20, fw, 380, 14, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, 'save_01.dat', fx + 24, y + 14, C.gold, fnt(700, 23, 'mono'));
    ch.forEach(([i, j, s, c], k) => al(g, FR(t, st, .1 + k * .06, .14 + k * .06), () => txt(g, `obj_${(j * n + i + 1000)}: ${s}`, fx + 24, y + 70 + k * 52, c, fnt(600, 22, 'mono')))); });
  al(g, FR(t, st, .55, .65), () => { const yy = R.y + 570; txt(g, '大小（示意）', x, yy, C.fg2, fnt(700, 23)); rr(g, x + 170, yy - 18, 900, 36, 8, 'rgba(255,107,107,.25)', C.bad, 2); txt(g, '存整个世界', x + 1090, yy, C.bad, fnt(700, 21)); rr(g, x + 170, yy + 40, 900 * .04 * FR(t, st, .6, .7), 36, 8, C.ok); txt(g, '只存差异', x + 230, yy + 58, C.ok, fnt(700, 21)); });
};
AN.savever = (g, t, R, st) => {
  hdr(g, R, '游戏更新了，旧存档还得能读');
  const V = [['版本 1', '箱子：开/关'], ['版本 2', '+ 箱子的冷却时间'], ['版本 3', '编号改为稳定 ID']], w = 300, gap = (R.w - 40 - 3 * w) / 2, y = R.y + 200;
  V.forEach(([a, b], i) => { const x = R.x + 20 + i * (w + gap); node(g, x, y, w, 120, a, [C.fg3, C.b, C.g][i], pop(t, .3 + i * .5), b); if (i < 2) { arrow(g, x + w + 8, y + 60, x + w + gap - 8, y + 60, C.gold, 3, 12, pop(t, 1 + i * .5)); al(g, pop(t, 1 + i * .5), () => txt(g, `迁移 ${i + 1}→${i + 2}`, x + w + gap / 2, y + 30, C.gold, fnt(700, 20), 'center')); } });
  const u = FR(t, st, .3, .75), fx = R.x + 20 + w / 2 + u * 2 * (w + gap); al(g, pop(t, 2), () => { rr(g, fx - 80, y + 170, 160, 60, 10, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, '旧存档 v' + (1 + Math.min(2, Math.floor(u * 2 + .02))), fx, y + 200, C.gold, fnt(700, 22), 'center'); });
  al(g, FR(t, st, .75, .85), () => { check(g, R.x + 40, R.y + 520, '存档头带版本号', 1, C.ok, 25); check(g, R.x + 40, R.y + 580, '一版一版地升级，不跳步', 1, C.ok, 25); check(g, R.x + 40, R.y + 640, '编号不依赖加载顺序', 1, C.ok, 25); });
};
AN.asyncsave = (g, t, R, st) => {
  hdr(g, R, '存档不能卡住游戏');
  const x0 = R.x + 180, W = R.w - 220, y1 = R.y + 200, y2 = R.y + 360, sc = W / 10, u = FR(t, st, .05, .8) * 10;
  txt(g, '主线程', R.x + 20, y1 + 30, C.b, fnt(700, 24)); txt(g, '后台线程', R.x + 20, y2 + 30, C.o, fnt(700, 24));
  for (let k = 0; k < 10 && k < u; k++) rr(g, x0 + k * sc + 2, y1, sc - 4, 60, 6, k === 2 ? 'rgba(255,210,122,.35)' : 'rgba(92,180,255,.2)', k === 2 ? C.gold : C.b, 2);
  if (u > 2) txt(g, '拍快照', x0 + 2.5 * sc, y1 - 22, C.gold, fnt(700, 21), 'center');
  const J = [['序列化', 3, 5.2], ['压缩', 5.2, 7], ['写临时文件', 7, 8.6], ['替换', 8.6, 9.4]];
  J.forEach(([s, a, b], i) => { if (u < a) return; const e = Math.min(u, b); rr(g, x0 + a * sc + 2, y2, (e - a) * sc - 4, 60, 6, 'rgba(255,178,92,.2)', C.o, 2); if (u > a + .4) txt(g, s, x0 + (a + e) / 2 * sc, y2 + 30, C.fg, fnt(600, 20), 'center'); });
  if (u > 2) line(g, [[x0 + 2.9 * sc, y1 + 60], [x0 + 3 * sc, y2]], C.gold, 2, [5, 5]);
  al(g, FR(t, st, .8, .9), () => { rr(g, R.x + 20, R.y + 500, R.w - 40, 150, 14, 'rgba(14,20,36,.92)', C.ok, 2); txt(g, '写到一半断电？', R.x + 50, R.y + 545, C.fg, fnt(800, 27)); txt(g, '新内容只在临时文件里，旧存档完好；写完再整体替换', R.x + 50, R.y + 600, C.fg2, fnt(600, 23)); });
};

// ---------- 04 多人 ----------
AN.relev = (g, t, R, st) => {
  hdr(g, R, '相关性：只发玩家需要知道的');
  const cx = R.x + 420, cy = R.y + 440, r1 = 160, r2 = 300; g.beginPath(); g.arc(cx, cy, r2, 0, 7); g.fillStyle = 'rgba(92,180,255,.06)'; g.fill(); g.strokeStyle = 'rgba(92,180,255,.4)'; g.setLineDash([6, 6]); g.stroke(); g.beginPath(); g.arc(cx, cy, r1, 0, 7); g.fillStyle = 'rgba(95,211,154,.08)'; g.fill(); g.strokeStyle = 'rgba(95,211,154,.6)'; g.stroke(); g.setLineDash([]);
  for (let i = 0; i < 46; i++) { const a = HSH(i, 4) * 6.283, d = 40 + HSH(i, 5) * 360, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .9; if (y > R.y + R.h - 60 || y < R.y + 100) continue; const k = d < r1 ? 0 : d < r2 ? 1 : 2, c = [C.ok, C.b, C.fg3][k];
    boxObj(g, x - 8, y - 8, 16, 16, c + (k < 2 ? '88' : '33'), null); const rate = [1.5, .4, 0][k]; if (rate && ((t * rate + HSH(i, 6)) % 1) < .3) packet(g, [[x, y], [cx, cy]], ((t * rate + HSH(i, 6)) % 1) / .3, c, 4); }
  const tm = [cx + 340, cy - 260]; person(g, ...tm, C.gold, .9); line(g, [tm, [cx, cy]], C.gold, 2, [4, 6]); txt(g, '队友：永远相关', tm[0] - 10, tm[1] - 40, C.gold, fnt(700, 20), 'center');
  person(g, cx, cy, C.fg, 1.1);
  const px = R.x + 880; [['近处', '高频同步', C.ok], ['中间', '低频同步', C.b], ['远处', '不发', C.fg3]].forEach(([a, b, c], i) => al(g, pop(t, 1 + i * 1.5), () => { rr(g, px, R.y + 160 + i * 120, R.x + R.w - px - 10, 96, 14, 'rgba(14,20,36,.92)', c, 2); txt(g, a, px + 24, R.y + 208 + i * 120, c, fnt(800, 26)); txt(g, b, px + 140, R.y + 208 + i * 120, C.fg2, fnt(600, 24)); }));
};
AN.repgraph = (g, t, R, st) => {
  hdr(g, R, '人一多：先按格子粗筛，再细算');
  const x = R.x + 20, y = R.y + 120, cs = 64, n = 10, m = 8, pl = [[2, 2], [7, 5], [4, 6]];
  for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) { const hot = FR(t, st, .3, .4) > 0 && pl.some(([a, b]) => Math.abs(a - i) <= 1 && Math.abs(b - j) <= 1); rr(g, x + i * cs, y + j * cs, cs - 4, cs - 4, 4, hot ? 'rgba(255,210,122,.14)' : '#141C30', hot ? C.gold : null, 1.5); }
  for (let k = 0; k < 90; k++) { const ox = x + HSH(k, 7) * n * cs, oy = y + HSH(k, 8) * m * cs; dot(g, ox, oy, 4, C.fg3); }
  pl.forEach(([i, j]) => person(g, x + (i + .5) * cs, y + (j + .5) * cs + 6, C.b, .8));
  const px = x + n * cs + 50, pw = R.x + R.w - px - 10; al(g, pop(t, 1.5), () => { rr(g, px, y, pw, 160, 14, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, '两两比较', px + 24, y + 40, C.bad, fnt(800, 26)); txt(g, '100 个玩家 × 10 万个物体', px + 24, y + 90, C.fg2, fnt(600, 22)); txt(g, '= 每次 1000 万次判断', px + 24, y + 130, C.bad, fnt(700, 22)); });
  al(g, FR(t, st, .3, .4), () => { rr(g, px, y + 200, pw, 160, 14, 'rgba(95,211,154,.08)', C.ok, 2); txt(g, '格子粗筛', px + 24, y + 240, C.ok, fnt(800, 26)); txt(g, '只看玩家周围的格子', px + 24, y + 290, C.fg2, fnt(600, 22)); txt(g, '判断次数降一两个数量级', px + 24, y + 330, C.ok, fnt(700, 22)); });
  al(g, FR(t, st, .7, .8), () => { rr(g, px, y + 400, pw, 110, 14, 'rgba(14,20,36,.92)', C.p, 2); txt(g, '新的复制系统', px + 24, y + 435, C.p, fnt(800, 24)); txt(g, '批量化 · 多线程并行', px + 24, y + 478, C.fg2, fnt(600, 22)); });
};
AN.mesh = (g, t, R, st) => {
  hdr(g, R, '一台服务器不够：把世界分给多台');
  const x = R.x + 20, y = R.y + 110, W = 760, H = 560, cols = [C.b, C.g, C.o, C.p], hx = x + W / 2, hy = y + H / 2;
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j], k) => { rr(g, x + i * W / 2, y + j * H / 2, W / 2 - 4, H / 2 - 4, 10, cols[k] + '18', cols[k], 2); txt(g, `服务器 ${String.fromCharCode(65 + k)}`, x + i * W / 2 + 20, y + j * H / 2 + 30, cols[k], fnt(700, 22)); });
  g.fillStyle = 'rgba(255,210,122,.12)'; g.fillRect(hx - 30, y, 60, H); txt(g, '边界带：两边都知道', hx, y + H + 30, C.gold, fnt(700, 21), 'center');
  const u = FR(t, st, .2, .7), p = [LERP(x + 160, x + W - 160, u), y + H * .25 + Math.sin(u * 3) * 30], owner = p[0] < hx ? 0 : 1; person(g, p[0], p[1], cols[owner], 1);
  if (Math.abs(p[0] - hx) < 30) { txt(g, '交接中…', p[0], p[1] - 50, C.gold, fnt(800, 22), 'center'); line(g, [[x + W / 4, y + 60], p, [x + W * .75, y + 60]], C.gold, 2, [4, 5]); }
  const px = x + W + 50; al(g, pop(t, 1), () => { rr(g, px, y, R.x + R.w - px - 10, 220, 14, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '传统做法', px + 24, y + 40, C.fg, fnt(800, 25)); ['分区：一个区一台服务器', '分线：同一地图开多份', '跨区要读条'].forEach((s, i) => txt(g, '· ' + s, px + 24, y + 90 + i * 42, C.fg2, fnt(600, 22))); });
  al(g, FR(t, st, .5, .6), () => { rr(g, px, y + 260, R.x + R.w - px - 10, 220, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '服务器网格', px + 24, y + 300, C.gold, fnt(800, 25)); ['无缝跨越边界', '按人数动态切分', '研究了十年才上线'].forEach((s, i) => txt(g, '· ' + s, px + 24, y + 350 + i * 42, C.fg2, fnt(600, 22))); });
};
AN.predict = (g, t, R, st) => {
  hdr(g, R, '延迟：先预测，再修正');
  const x0 = R.x + 160, W = R.w - 200, yc = R.y + 180, ys = R.y + 400, u = FR(t, st, .05, .55) * 10, sc = W / 10;
  txt(g, '玩家', R.x + 20, yc, C.b, fnt(700, 25)); txt(g, '服务器', R.x + 20, ys, C.o, fnt(700, 25)); line(g, [[x0, yc], [x0 + W, yc]], C.line2, 2); line(g, [[x0, ys], [x0 + W, ys]], C.line2, 2);
  if (u > .5) { dot(g, x0 + sc, yc, 9, C.b); txt(g, '按键：立刻移动（预测）', x0 + sc, yc - 34, C.b, fnt(700, 21), 'left'); }
  if (u > 1) { const k = CL((u - 1) / 3); arrow(g, x0 + sc, yc + 10, x0 + LERP(1, 4, k) * sc, LERP(yc + 10, ys - 10, k), C.b, 2.5, 10); }
  if (u > 4) { dot(g, x0 + 4 * sc, ys, 9, C.o); txt(g, '服务器算出结果', x0 + 4 * sc, ys + 34, C.o, fnt(700, 21), 'center'); }
  if (u > 4.5) { const k = CL((u - 4.5) / 3); arrow(g, x0 + 4 * sc, ys - 10, x0 + LERP(4, 7, k) * sc, LERP(ys - 10, yc + 10, k), C.o, 2.5, 10); }
  if (u > 7.5) { dot(g, x0 + 7 * sc, yc, 9, C.ok); txt(g, '确认 · 如有偏差，平滑修正', x0 + 7 * sc, yc - 34, C.ok, fnt(700, 21), 'center'); }
  if (u > 1) txt(g, '几十毫秒', x0 + 2.5 * sc + 30, (yc + ys) / 2, C.fg3, fnt(600, 20));
  al(g, FR(t, st, .6, .7), () => { const y = R.y + 520, bx = R.x + 200; rr(g, R.x + 20, y - 20, R.w - 40, 170, 14, 'rgba(14,20,36,.92)', C.r, 2); txt(g, '延迟补偿', R.x + 50, y + 20, C.r, fnt(800, 26));
    const k = FR(t, st, .7, .8); al(g, .4, () => person(g, bx + 520, y + 90, C.fg2, 1)); al(g, 1, () => person(g, LERP(bx + 520, bx + 360, k), y + 90, C.r, 1)); line(g, [[bx + 40, y + 80], [bx + 360, y + 80]], C.gold, 2, [5, 5]); txt(g, '开枪时', bx + 360, y + 135, C.r, fnt(600, 19), 'center'); txt(g, '现在', bx + 520, y + 135, C.fg3, fnt(600, 19), 'center');
    txt(g, '服务器把对方倒回到开枪那一刻，再判断有没有打中', R.x + 200, y + 20, C.fg2, fnt(600, 22)); });
};

// ---------- 05 AI 浪潮 ----------
AN.aitalk = (g, t, R, st) => {
  hdr(g, R, 'AI 对话：台词实时生成');
  const x = R.x + 20, y = R.y + 140; person(g, x + 60, y + 120, C.b, 1.6); npc(g, x + 760, y + 130, C.gold, 3);
  al(g, pop(t, .5), () => { rr(g, x + 120, y + 30, 420, 70, 14, 'rgba(92,180,255,.12)', C.b, 2); txt(g, '你知道北边的塔怎么了吗？', x + 140, y + 65, C.fg, fnt(600, 23)); });
  const ans = '听说那里夜里有火光……我劝你天亮再去，路上的狼最近很凶。', n = Math.floor(FR(t, st, .15, .45) * ans.length);
  if (n > 0) { rr(g, x + 180, y + 140, 540, 110, 14, 'rgba(255,210,122,.1)', C.gold, 2); wrapTxt(g, ans.slice(0, n), x + 200, y + 176, 500, 34, C.fg, fnt(600, 23)); }
  const P = [['语音识别', C.b], ['语言模型', C.p], ['语音合成', C.g], ['口型动画', C.o]], w = 220, py = R.y + 470;
  P.forEach(([s, c], i) => { const px = R.x + 20 + i * (w + 40); node(g, px, py, w, 80, s, c, pop(t, 2 + i * .5)); if (i < 3) arrow(g, px + w + 4, py + 40, px + w + 36, py + 40, C.fg3, 3, 10, pop(t, 2.3 + i * .5)); if (t > 4) packet(g, [[R.x + 20, py + 95], [R.x + 20 + 4 * (w + 40) - 40, py + 95]], (t * .4) % 1, C.gold, 6); });
  al(g, FR(t, st, .6, .7), () => { let xx = R.x + 20; txt(g, '难点', xx, py + 150, C.fg3, fnt(700, 22)); xx += 80; ['不跑题', '不剧透', '延迟', '成本'].forEach((s, i) => { xx += chip(g, s, xx, py + 150, C.r, pop(t, FR(t, st, 0, 1) * 0 + .6 * (st.D || 18) + i * .4), 22) + 16; }); });
};
AN.gsplat = (g, t, R, st) => {
  hdr(g, R, '高斯泼溅：用无数半透明椭球表示真实场景');
  const cx = R.x + 420, cy = R.y + 420, P = pcache('gs', () => { const r = RND(29), A = []; for (let i = 0; i < 700; i++) { const k = r(); let x, y, c; if (k < .35) { x = (r() - .5) * 220; y = -60 - r() * 200 * (1 - Math.abs(x) / 160); c = [60 + r() * 40, 120 + r() * 60, 70 + r() * 30]; } else if (k < .45) { x = (r() - .5) * 40; y = -60 + r() * 160; c = [90 + r() * 30, 65 + r() * 20, 40]; } else { x = (r() - .5) * 600; y = 100 + r() * 120; c = [70 + r() * 40, 90 + r() * 40, 60 + r() * 20]; } A.push([x, y, 6 + r() * 22, 3 + r() * 10, r() * 3.14, c]); } return A; });
  const u = FR(t, st, .05, .5), rot = Math.sin(t * .3) * .4;
  g.save(); g.beginPath(); g.rect(R.x + 20, R.y + 110, 800, 620); g.clip();
  P.forEach(([x, y, a, b, an, c], i) => { if (i / P.length > u) return; const X = cx + x * Math.cos(rot), Y = cy + y; g.save(); g.translate(X, Y); g.rotate(an); g.beginPath(); g.ellipse(0, 0, a, b, 0, 0, 7); g.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},.55)`; g.fill(); g.restore(); });
  g.restore(); txt(g, '每个椭球：位置 · 形状 · 颜色 · 透明度', R.x + 40, R.y + 700, C.fg2, fnt(600, 22));
  const px = R.x + 880; [['拍一段视频', C.b], ['优化出几百万个椭球', C.gold], ['实时渲染：自由观看', C.ok]].forEach(([s, c], i) => al(g, FR(t, st, .1 + i * .15, .15 + i * .15), () => { rr(g, px, R.y + 150 + i * 110, R.x + R.w - px - 10, 86, 14, 'rgba(14,20,36,.92)', c, 2); txt(g, s, px + 24, R.y + 193 + i * 110, c, fnt(700, 25)); }));
  al(g, FR(t, st, .6, .7), () => { rr(g, px, R.y + 500, R.x + R.w - px - 10, 130, 14, 'rgba(199,155,255,.08)', C.p, 2); txt(g, '另一条路：文字 / 图片', px + 24, R.y + 540, C.p, fnt(800, 24)); txt(g, '→ 三维模型 · 贴图 · 动画', px + 24, R.y + 590, C.fg2, fnt(600, 22)); });
};
AN.aiedit = (g, t, R, st) => {
  hdr(g, R, '编辑器里的 AI：从问答到动手');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 600; editorWin(g, x, y, W, H, '编辑器');
  const vx = x + 20, vy = y + 64, vw = 720, vh = 400, ss = FR(t, st, .6, .7); rr(g, vx, vy, vw, vh, 8, '#13241C', C.line2, 1.5);
  for (let i = 0; i < 40; i++) { const a = [79, 160, 110], b = [215, 140, 60], k = HSH(i, 3) * .4 + .6; tree(g, vx + 30 + HSH(i, 1) * (vw - 60), vy + 40 + HSH(i, 2) * (vh - 80), 16, `rgb(${LERP(a[0], b[0], ss) * k | 0},${LERP(a[1], b[1], ss) * k | 0},${LERP(a[2], b[2], ss) * k | 0})`); }
  const cx = vx + vw + 30, cw = x + W - cx - 20; rr(g, cx, vy, cw, H - 90, 10, '#0E1626', C.p, 2); txt(g, 'AI 助手', cx + 20, vy + 30, C.p, fnt(800, 22));
  al(g, pop(t, 1), () => { rr(g, cx + 20, vy + 60, cw - 40, 70, 10, 'rgba(92,180,255,.12)', C.b, 1.5); wrapTxt(g, '把这片森林换成秋天，再检查所有路灯有没有碰撞', cx + 34, vy + 82, cw - 70, 28, C.fg, fnt(600, 20)); });
  const A = ['查询场景里的树木', '批量改材质参数', '列出所有路灯', '发现 3 个没有碰撞 → 已修复'];
  A.forEach((s, i) => al(g, FR(t, st, .25 + i * .12, .3 + i * .12), () => { txt(g, '⚙ ' + s, cx + 24, vy + 170 + i * 46, i === 3 ? C.ok : C.fg2, fnt(600, 20)); }));
  al(g, FR(t, st, .55, .65), () => { const by = y + H - 100; rr(g, x + 20, by, vw, 70, 12, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '外部智能体 ⇄ 标准协议 ⇄ 编辑器：搭场景 · 改参数 · 跑测试', x + 40, by + 35, C.fg, fnt(600, 21)); });
};
AN.worldmodel = (g, t, R, st) => {
  hdr(g, R, '世界模型：每一帧都是预测出来的');
  al(g, pop(t, .5), () => { rr(g, R.x + 20, R.y + 110, R.w - 40, 60, 12, 'rgba(199,155,255,.1)', C.p, 2); txt(g, '“黄昏的海边小镇，雨刚停”', R.x + 44, R.y + 140, C.fg, fnt(600, 24)); });
  const n = 5, w = (R.w - 40 - (n - 1) * 30) / n, y = R.y + 230, h = w * .62, k = Math.floor(FR(t, st, .1, .6) * n) + 1;
  for (let i = 0; i < Math.min(n, k); i++) { const x = R.x + 20 + i * (w + 30), drift = i * .08; g.save(); g.beginPath(); g.roundRect(x, y, w, h, 8); g.clip();
    const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#F2A65A'); gr.addColorStop(.55, '#7A4B6A'); gr.addColorStop(.56, '#2A4A6A'); gr.addColorStop(1, '#1A2A40'); g.fillStyle = gr; g.fillRect(x, y, w, h);
    for (let b = 0; b < 6; b++) { const bx = x + 10 + b * w / 6 - i * 8, bh = 20 + HSH(b, 1) * 40 + (i > 2 ? HSH(b, i) * 20 * drift * 5 : 0); g.fillStyle = '#2B2238'; g.fillRect(bx, y + h * .55 - bh, w / 7, bh); }
    g.restore(); rr(g, x, y, w, h, 8, null, C.line2, 2); txt(g, `第 ${i + 1} 帧`, x + w / 2, y + h + 28, C.fg2, fnt(600, 20), 'center'); if (i) arrow(g, x - 26, y + h / 2, x - 4, y + h / 2, C.gold, 2, 8); }
  al(g, FR(t, st, .3, .4), () => txt(g, '输入：前几帧 + 玩家的操作 → 输出：下一帧', R.x + 20, y + h + 90, C.gold, fnt(700, 24)));
  al(g, FR(t, st, .6, .7), () => { const yy = y + h + 160; txt(g, '一致性', R.x + 20, yy, C.fg, fnt(700, 24)); const P = []; for (let k2 = 0; k2 <= 50; k2++) P.push([R.x + 140 + k2 * 14, yy - 30 + 60 * (1 - Math.exp(-k2 / 18))]); line(g, P, C.r, 3); txt(g, '时间越长越容易“走样”；也没有精确规则', R.x + 880, yy, C.fg2, fnt(600, 22)); });
};
AN.aitest = (g, t, R, st) => {
  hdr(g, R, 'AI 测试：成千上万次跑遍地图');
  const x = R.x + 20, y = R.y + 110, W = 760, H = 600; img(g, reliefCanvas(3), x, y, W, H); g.fillStyle = 'rgba(8,12,22,.4)'; g.fillRect(x, y, W, H);
  const u = FR(t, st, .05, .8); for (let b = 0; b < 26; b++) { const P = []; let px = x + W / 2, py = y + H / 2; const r = RND(100 + b); for (let k = 0; k < 40 * u; k++) { px = CL(px + (r() - .5) * 70, x + 10, x + W - 10); py = CL(py + (r() - .5) * 70, y + 10, y + H - 10); P.push([px, py]); } if (P.length > 1) { line(g, P, 'rgba(199,155,255,.35)', 1.5); bot(g, ...P[P.length - 1], C.p, .5); } }
  const B = [['卡住', .25, .3, C.gold], ['掉出世界', .7, .2, C.bad], ['任务无法完成', .55, .75, C.r], ['穿模', .15, .7, C.o]];
  B.forEach(([s, a, b, c], i) => al(g, FR(t, st, .3 + i * .1, .35 + i * .1), () => { const X = x + a * W, Y = y + b * H; dot(g, X, Y, 12, c); chip(g, s, X + 18, Y, c, 1, 20); }));
  const px = x + W + 50; al(g, pop(t, 1), () => { rr(g, px, y, R.x + R.w - px - 10, 200, 14, 'rgba(14,20,36,.92)', C.p, 2); txt(g, '已跑路线', px + 24, y + 44, C.p, fnt(800, 25)); txt(g, (Math.floor(u * 18000)).toLocaleString() + ' 条', px + 24, y + 120, C.fg, fnt(800, 52, 'mono')); });
  al(g, FR(t, st, .7, .8), () => txt(g, '覆盖面远超人工测试', px, y + 260, C.fg, fnt(700, 26)));
};
AN.aiwrap = (g, t, R, st) => {
  hdr(g, R, 'AI 成为工具链和引擎的一部分');
  const E = [['装得下', '流式加载 · 剔除', C.b, '自动生成 LOD'], ['画得出', '渲染 · 光照', C.g, '神经网络超分'], ['造得出', '地形 · 散布 · 资产', C.o, '生成模型与贴图'], ['活起来', 'NPC · 物理 · 网络', C.r, '对话 · 测试']], w = (R.w - 90) / 4;
  E.forEach(([a, b, c, ai], i) => { const x = R.x + i * (w + 30); al(g, pop(t, .5 + i * .5), () => { rr(g, x, R.y + 160, w, 200, 18, 'rgba(14,20,36,.92)', c, 2.5); txt(g, a, x + 26, R.y + 220, C.fg, fnt(800, 40, 'serif')); txt(g, b, x + 26, R.y + 290, C.fg2, fnt(600, 22)); });
    al(g, pop(t, 4 + i * .8), () => { rr(g, x + 20, R.y + 390, w - 40, 64, 12, 'rgba(199,155,255,.12)', C.p, 2); txt(g, 'AI：' + ai, x + 40, R.y + 422, C.p, fnt(700, 21)); }); });
  al(g, pop(t, 9), () => { person(g, R.x + R.w / 2 - 60, R.y + 580, C.gold, 1.4); bot(g, R.x + R.w / 2 + 60, R.y + 586, C.p, 1.4); txt(g, '人 + AI 一起完成', R.x + R.w / 2, R.y + 660, C.fg, fnt(800, 30), 'center'); });
};

// ---------- 06 昙花一现 / 07 对照 / 08 技能地图 ----------
AN.graves4 = (g, t, R, st) => {
  lifespans(g, t, R, st, [['云端大世界平台', 2015, 2022, '押注的游戏相继关服', 0], ['纯云游戏平台', 2019, 2023, '上线三年多后关闭', 1]], '昙花一现', '条形为大致的流行时段（示意）', 2012, 2027, [2015, 2020, 2025]);
};
AN.table4 = (g, t, R, st) => engTable(g, t, R, st, '三大引擎对照：活起来', ['导航', '行为与决策', '群体模拟', '物理', '网络复制', '大世界多人'],
  [[['Navigation System', 2], ['AI Navigation', 2], ['NavigationServer', 2]], [['StateTree · Behavior Tree', 2], ['Behavior 包', 2], ['LimboAI（插件）', 1]],
   [['Mass Entity', 2], ['Entities（DOTS）', 2], ['自己实现', 0]], [['Chaos', 2], ['PhysX · Unity Physics', 2], ['Jolt（4.4 起）', 2]],
   [['Replication Graph · Iris', 2], ['Netcode 两套', 2], ['MultiplayerSynchronizer', 1]], [['分服需自研', 1], ['分服需自研', 1], ['自己实现', 0]]], '超大世界的分服与服务器网格：三家都要自己搭');
AN.skillmap = (g, t, R, st) => {
  if (st.k === 0) { hdr(g, R, '这一集的角色');
    const D = [['AI 与玩法程序', ['负责：角色行为 · 系统规则', '技能：行为树 · 状态机 · 数据驱动'], C.g], ['物理程序', ['负责：模拟 · 载具 · 破坏', '技能：数值方法 · 碰撞检测'], C.o], ['网络程序', ['负责：同步 · 预测 · 服务器架构', '技能：网络协议 · 分布式系统'], C.p]], w = (R.w - 60) / 3;
    D.forEach(([h, ls, c], i) => { const u = pop(t, .3 + i * 2); g.save(); g.translate(0, (1 - u) * 20); card(g, R.x + i * (w + 30), R.y + 130, w, 280, h, ls, c, u, false, 25); g.restore(); });
    al(g, pop(t, 7), () => banner(g, R, '共同的底子：数据结构 · 并发 · 调试能力', 1)); return; }
  const cx = R.x + R.w / 2, cy = R.y + 420, D = [['引擎', 'C++ · 内存 · 并发', C.b, 1], ['渲染', '图形接口 · 着色器 · 数学', C.g, 1], ['工具', '编辑器扩展 · 自动化', C.o, 3], ['技术美术', '材质 · 着色器 · 程序化', C.p, 2], ['美术', '地编 · 建模 · 扫描', C.gold, 3], ['设计', '关卡 · 节奏 · 数据配置', C.r, 3], ['玩法', '行为 · 物理 · 系统', C.ok, 4], ['网络', '同步 · 预测 · 服务器', C.b, 4], ['AI', '模型接入 · 生成 · 测试', C.p, 4]];
  hdr(g, R, st.k === 1 ? '全专题技能地图：九个方向' : '先挑一个方向，做一个小而完整的作品');
  al(g, pop(st.k === 1 ? st.tk : 99, .2), () => { g.beginPath(); g.arc(cx, cy, 110, 0, 7); g.fillStyle = 'rgba(255,210,122,.1)'; g.fill(); g.strokeStyle = C.gold; g.lineWidth = 3; g.stroke(); txt(g, '开放世界', cx, cy - 14, C.fg, fnt(800, 32, 'serif'), 'center'); txt(g, '一条管线', cx, cy + 26, C.fg2, fnt(600, 20), 'center'); });
  const pick = st.k === 2 ? Math.floor(st.tk * .6) % 9 : -1;
  D.forEach(([a, b, c, ep], i) => { const an = -1.57 + i / 9 * 6.283, x = cx + Math.cos(an) * 640, y = cy + Math.sin(an) * 300, u = pop(st.k === 1 ? st.tk : 99, .6 + i * .5), hot = i === pick, w = 330, h = 104;
    al(g, u, () => { line(g, [[cx + Math.cos(an) * 112, cy + Math.sin(an) * 112], [x - Math.cos(an) * 60, y - Math.sin(an) * 40]], c + '66', 2); rr(g, x - w / 2, y - h / 2, w, h, 14, hot ? c + '33' : 'rgba(14,20,36,.95)', c, hot ? 4 : 2); txt(g, a, x - w / 2 + 20, y - 18, c, fnt(800, 26)); txt(g, `第${'一二三四'[ep - 1]}集`, x + w / 2 - 18, y - 18, C.fg3, fnt(600, 18), 'right'); txt(g, b, x - w / 2 + 20, y + 22, C.fg2, fnt(600, 20)); }); });
  if (st.k === 2) al(g, pop(st.tk, 9), () => { rr(g, cx - 260, cy - 60, 520, 120, 20, 'rgba(14,20,36,.97)', C.gold, 3); txt(g, '谢谢观看', cx, cy, C.fg, fnt(800, 48, 'serif'), 'center'); });
};
