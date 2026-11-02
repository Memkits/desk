// 地球上的故事画面：扁平插画风格（剪影 + 渐变 + 边缘光）。每个场景分 bg / mid（动态）/ fg 三层，bg、fg 预先画好缓存。
const ST = (() => {
  const W = 1920, H = 1080;
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  let sd = 1; const rs = s => { sd = s; }, rn = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const sky = (g, stops, y1 = H) => { const gr = g.createLinearGradient(0, 0, 0, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const stars = (g, n, a = .8, y1 = H, s = 3) => { rs(s); for (let i = 0; i < n; i++) { const b = rn(); g.fillStyle = `rgba(230,236,255,${a * (.2 + .8 * b * b)})`; const z = b > .95 ? 2.4 : 1.4; g.fillRect(rn() * W, rn() * y1, z, z); } };
  const glow = (g, x, y, r, col, a = 1) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  // 人物剪影：x 为脚底中点，h 为身高（像素）
  function person(g, x, y, h, o = {}) {
    const c = o.col || '#05070c', s = h / 100, dir = o.dir || 1; g.save(); g.translate(x, y); g.scale(s * dir, s); g.fillStyle = c; g.strokeStyle = c; g.lineCap = 'round'; g.lineJoin = 'round';
    const child = o.child; const hr = child ? 10 : 8.5;
    if (o.suit) { g.beginPath(); g.ellipse(0, -84, 12, 13, 0, 0, 7); g.fill(); g.fillStyle = o.visor || 'rgba(160,200,255,.6)'; g.beginPath(); g.ellipse(3, -85, 7, 6, 0, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.roundRect(-14, -72, 28, 40, 8); g.fill(); g.lineWidth = 11; g.beginPath(); g.moveTo(-6, -34); g.lineTo(-8, 0); g.moveTo(6, -34); g.lineTo(9, 0); g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(-12, -66); g.lineTo(-18, -40); g.moveTo(12, -66); g.lineTo(o.lamp ? 26 : 18, o.lamp ? -58 : -40); g.stroke();
      if (o.lamp) { glow(g, 30, -58, 40, 'rgba(255,220,150,A)', .9); g.fillStyle = '#ffe6b0'; g.beginPath(); g.arc(30, -58, 4, 0, 7); g.fill(); } g.restore(); return; }
    g.beginPath(); g.arc(0, -92 + (child ? 4 : 0), hr, 0, 7); g.fill();
    if (o.hood) { g.beginPath(); g.arc(0, -92, hr + 3, Math.PI, 0); g.fill(); }
    g.beginPath(); g.moveTo(-11, -80); g.quadraticCurveTo(-14, -60, -12, -40); g.lineTo(12, -40); g.quadraticCurveTo(14, -60, 11, -80); g.closePath(); g.fill();
    if (o.coat) { g.beginPath(); g.moveTo(-12, -44); g.lineTo(-16, -22); g.lineTo(16, -22); g.lineTo(12, -44); g.fill(); }
    g.lineWidth = 8;
    if (o.sit) { g.beginPath(); g.moveTo(-5, -42); g.lineTo(16, -40); g.lineTo(18, -14); g.moveTo(5, -42); g.lineTo(22, -38); g.lineTo(26, -14); g.stroke(); }
    else if (o.walk) { g.beginPath(); g.moveTo(-4, -42); g.lineTo(-14, 0); g.moveTo(4, -42); g.lineTo(12, 0); g.stroke(); }
    else { g.beginPath(); g.moveTo(-5, -42); g.lineTo(-6, 0); g.moveTo(5, -42); g.lineTo(6, 0); g.stroke(); }
    g.lineWidth = 6.5; g.beginPath();
    const arm = o.arm || 'down';
    if (arm === 'point') { g.moveTo(9, -76); g.lineTo(26, -98); g.lineTo(34, -112); } else if (arm === 'up') { g.moveTo(9, -76); g.lineTo(14, -104); g.lineTo(16, -122); } else if (arm === 'phone') { g.moveTo(9, -76); g.lineTo(18, -96); g.lineTo(18, -112); } else if (arm === 'hold') { g.moveTo(9, -76); g.lineTo(20, -58); g.lineTo(30, -50); } else { g.moveTo(9, -76); g.lineTo(13, -56); g.lineTo(14, -40); }
    g.moveTo(-9, -76); if (o.arm2 === 'hold') { g.lineTo(-20, -58); g.lineTo(-30, -50); } else { g.lineTo(-13, -56); g.lineTo(-14, -40); } g.stroke();
    if (arm === 'phone') { g.fillStyle = o.phone || '#cfe2ff'; g.fillRect(14, -126, 9, 14); glow(g, 18, -120, 26, 'rgba(190,220,255,A)', .5); }
    if (o.bag) { g.fillStyle = c; g.beginPath(); g.roundRect(-34, -48, 22, 30, 4); g.fill(); }
    if (o.pack) { g.beginPath(); g.roundRect(-22, -82, 14, 34, 5); g.fill(); }
    g.restore();
    if (o.rim) { g.save(); g.globalCompositeOperation = 'source-atop'; g.restore(); }
  }
  // 机器人：方头、一道发光的视带、履带底盘；x 为底盘中点，h 为总高
  function robot(g, x, y, h, o = {}) {
    const c = o.col || '#15161c', s = h / 100, dir = o.dir || 1; g.save(); g.translate(x, y); g.scale(s * dir, s); g.fillStyle = c;
    g.beginPath(); g.roundRect(-22, -22, 44, 22, 8); g.fill(); g.fillStyle = '#0a0a0e'; for (let k = -16; k <= 16; k += 8) { g.beginPath(); g.arc(k, -10, 4.5, 0, 7); g.fill(); }
    g.fillStyle = c; g.fillRect(-7, -56, 14, 34); g.beginPath(); g.roundRect(-16, -78, 32, 26, 5); g.fill();
    g.lineWidth = 6; g.lineCap = 'round'; g.strokeStyle = c; g.beginPath(); g.moveTo(-8, -50); g.lineTo(-30, -40); g.lineTo(o.arm === 'up' ? -36 : -34, o.arm === 'up' ? -70 : -22); g.moveTo(8, -50); g.lineTo(30, -42); g.lineTo(o.arm === 'up' ? 40 : 34, o.arm === 'up' ? -72 : -24); g.stroke();
    if (o.tool) { g.fillStyle = c; g.fillRect(30, -34, 6, 40); }
    const vc = o.visor || 'rgba(120,230,255,.95)'; g.fillStyle = vc; g.fillRect(-10, -70, 20, 5); glow(g, 0, -68, 18, vc.replace(/[\d.]+\)$/, 'A)'), .7);
    if (o.lamp) { glow(g, 0, -84, 40, 'rgba(255,230,180,A)', .8); g.fillStyle = '#fff0cc'; g.fillRect(-4, -86, 8, 4); }
    g.restore();
  }
  function crowd(g, y, n, h, col, phoneP = .25, seed = 5, x0 = 0, x1 = W) { rs(seed); for (let i = 0; i < n; i++) { const x = x0 + rn() * (x1 - x0), hh = h * (.8 + .35 * rn()), ch = rn() < .15; const ph = rn() < phoneP;
      person(g, x, y + rn() * h * .12, ch ? hh * .65 : hh, { col, child: ch, arm: ph ? 'phone' : rn() < .12 ? 'point' : 'down', dir: rn() < .5 ? 1 : -1, coat: rn() < .4 }); } }
  function tower(g, x, base, w, h, col, lit = .3, seed = 1, broken = 0, litCol = 'rgba(255,205,140,') {
    rs(seed); g.fillStyle = col; g.beginPath(); g.moveTo(x, base);
    if (broken) { g.lineTo(x, base - h * (1 - broken * rn() * .3)); for (let k = 1; k <= 6; k++) g.lineTo(x + w * k / 6, base - h * (1 - broken * (.1 + .5 * rn()))); } else { g.lineTo(x, base - h); g.lineTo(x + w, base - h); }
    g.lineTo(x + w, base); g.fill();
    const cols = Math.max(2, Math.floor(w / 14)), rows = Math.floor(h / 22);
    for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) { const r = rn(); const yy = base - h + j * 22; if (broken && yy < base - h * (1 - broken * .55)) continue;
      if (r < lit) { g.fillStyle = litCol + (.35 + .5 * rn()) + ')'; g.fillRect(x + 5 + i * (w - 8) / cols, yy, 5, 8); } else if (broken && r > .82) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x + 4 + i * (w - 8) / cols, yy, 7, 10); } }
  }
  // 月亮：o.i 相位角（0 满月，180 新月）；o.sa 屏幕上指向太阳的方向；o.eng 发动机亮度；o.dim 被照亮的亮度
  // 发动机在朝向地球的一面，离正中心 12.4°，从地球看是一圈半径约 0.215 倍月面的亮点，喷流向外斜着擦过地球
  function moon(g, x, y, r, o = {}) {
    if (!window.MOON3 || !window.MOON3_READY) return;
    const eng = o.eng ?? 0, cv = MOON3.render({ i: o.i ?? 90, sa: o.sa ?? 0, eng, t: o.t ?? 0, sunI: o.dim ?? 1, earthA: o.es !== undefined ? .04 + o.es * .5 : .09, hot: o.hot ?? eng, rpx: 180 });
    const k = r / 180; g.drawImage(cv, x - 960 * k, y - 540 * k, 1920 * k, 1080 * k);
  }
  const S = {};
  const scene = (name, bg, mid, fg, bg2, mid2) => S[name] = { bg, mid, fg, bg2, mid2, c: null };
  // ---------- 出发前一夜：屋顶上的父女 ----------
  scene('eve', g => { sky(g, [[0, '#0b1230'], [.6, '#2a2650'], [1, '#5b3b5e']], 760); stars(g, 500, .8, 700, 4);
    moon(g, 1480, 260, 30, { i: 118, sa: .55, es: .12 });
    for (let i = 0; i < 40; i++) tower(g, i * 52 - 20, 800, 46, 80 + ((i * 37) % 11) * 22, '#2c2a52', .45, 50 + i);
    for (let i = 0; i < 26; i++) tower(g, i * 80 - 40, 840, 70, 100 + ((i * 53) % 9) * 24, '#211f40', .35, 90 + i); },
   null,
   g => { g.fillStyle = '#07070f'; g.fillRect(0, 860, W, 220); g.fillRect(0, 830, W, 34); g.fillStyle = '#0d0d1a'; g.fillRect(0, 826, W, 6);
     g.fillStyle = '#07070f'; g.fillRect(180, 650, 160, 182); g.beginPath(); g.ellipse(260, 650, 80, 20, 0, 0, 7); g.fill(); g.fillRect(250, 600, 20, 52);
     g.fillStyle = 'rgba(255,190,110,.9)'; g.fillRect(1600, 700, 90, 130); glow(g, 1645, 770, 220, 'rgba(255,180,100,A)', .25); g.fillStyle = '#07070f'; g.fillRect(1590, 690, 110, 12);
     person(g, 900, 832, 260, { col: '#07070f', sit: 1 }); person(g, 1060, 832, 175, { col: '#07070f', sit: 1, child: 1, arm: 'point' });
     g.strokeStyle = 'rgba(255,200,160,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 828); g.lineTo(W, 828); g.stroke(); });
  // ---------- 广场人群看月球点火 ----------
  scene('crowd', g => { sky(g, [[0, '#050a1c'], [.7, '#14254a'], [1, '#2c4470']], 820); stars(g, 300, .6, 700, 5); glow(g, -100, 900, 900, 'rgba(120,140,200,A)', .25); },
   (g, t, u) => { const BR = 240 / 70, k = Math.min(1, Math.max(0, (t - BR) / 1.0)); moon(g, 1450, 250, 96, { i: 92, sa: Math.PI - .5, eng: k, t }); },
   g => { g.fillStyle = '#04060c'; g.fillRect(0, 900, W, 180); crowd(g, 840, 70, 120, '#0a0f1c', .2, 6); crowd(g, 900, 55, 170, '#06080f', .25, 7); crowd(g, 990, 28, 260, '#030408', .3, 8); },
   g => {
    for (let i = 0; i < 14; i++) tower(g, i * 150 - 30, 760, 120, 200 + ((i * 41) % 7) * 34, '#0b1226', .3, 120 + i, 0, 'rgba(180,215,255,');
    g.fillStyle = '#0b1226'; g.fillRect(760, 330, 400, 430); g.fillStyle = '#0a1a33'; g.fillRect(790, 360, 340, 170); },
   (g, t, u) => { const BR = 240 / 70, k = Math.min(1, Math.max(0, (t - BR) / 1.0)); if (k > 0) { g.fillStyle = `rgba(150,200,255,${.07 * k})`; g.fillRect(0, 0, W, H); }
     g.fillStyle = k > .5 ? '#bfe0ff' : '#ffd27a'; g.font = '700 64px "Noto Sans CJK SC",sans-serif'; g.textAlign = 'center'; g.fillText(k > .5 ? '点火' : '00:00:0' + Math.max(0, Math.ceil((BR - t) / BR * 5)), 960, 475); g.font = '400 22px "Noto Sans CJK SC",sans-serif'; g.fillStyle = 'rgba(200,220,255,.7)'; g.fillText('月 球 推 进 计 划', 960, 405); g.textAlign = 'left'; });

  // ---------- 撤离：海堤上的一家人 ----------
  const aurora = (g, x0, y0, a) => { for (let i = 0; i < 6; i++) { const gr = g.createLinearGradient(0, y0 - 380, 0, y0); gr.addColorStop(0, 'rgba(255,90,110,0)'); gr.addColorStop(.35, `rgba(255,90,110,${a * .25})`); gr.addColorStop(.75, `rgba(90,255,160,${a * (.5 + .1 * i)})`); gr.addColorStop(1, 'rgba(90,255,160,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x0 + i * 130, y0); g.bezierCurveTo(x0 + 120 + i * 140, y0 - 160, x0 + 260 + i * 130, y0 - 300, x0 + 420 + i * 120, y0 - 380); g.lineTo(x0 + 470 + i * 120, y0 - 370); g.bezierCurveTo(x0 + 300 + i * 130, y0 - 280, x0 + 170 + i * 140, y0 - 140, x0 + 50 + i * 130, y0 + 10); g.fill(); } };
  scene('evac', g => { sky(g, [[0, '#060b18'], [.7, '#1d2c4c'], [1, '#2f4366']], 700); stars(g, 300, .7, 650, 6); aurora(g, 0, 640, .09);
    g.fillStyle = '#16233c'; g.fillRect(0, 640, W, 120); rs(4); for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(220,235,255,${.1 + .25 * rn()})`; g.fillRect(rn() * W, 645 + rn() * 50, 20 + rn() * 120, 2); } },
   (g, t) => { moon(g, 1420, 250, 110, { i: 86, sa: Math.PI - .4, eng: 1, t }); },
   g => { g.fillStyle = '#0a101d'; g.beginPath(); g.moveTo(0, 700); g.lineTo(W, 680); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = '#121c30'; g.fillRect(0, 690, W, 16);
     g.fillStyle = '#05080f'; g.beginPath(); g.moveTo(0, 860); g.lineTo(W, 820); g.lineTo(W, H); g.lineTo(0, H); g.fill();
     const fam = [[420, 180, { bag: 1, walk: 1, dir: -1 }], [520, 165, { walk: 1, dir: -1, arm2: 'hold', pack: 1 }], [575, 110, { child: 1, walk: 1, dir: 1, arm: 'hold' }], [760, 175, { bag: 1, walk: 1, dir: -1, coat: 1 }], [900, 160, { walk: 1, dir: -1, pack: 1 }], [1040, 172, { walk: 1, dir: -1, bag: 1 }], [1180, 120, { child: 1, walk: 1, dir: -1 }], [1330, 168, { walk: 1, dir: -1, coat: 1, bag: 1 }]];
     fam.forEach(([x, h, o]) => person(g, x * 1.1 - 60, 900 - (x / W) * 40, h * 1.55, { col: '#05080f', ...o }));
     crowd(g, 760, 40, 70, '#0b1222', 0, 9, 0, 1900); });
  // ---------- 破败的高楼，月亮从后面飘过 ----------
  scene('ruins', g => { sky(g, [[0, '#04060f'], [.6, '#152340'], [1, '#2b3a5a']], 900); stars(g, 400, .8, 800, 7); },
   (g, t, u) => { moon(g, 400 + 1100 * u, 330 - 60 * Math.sin(u * 3.14), 120, { i: 128, sa: .35, es: .1 }); },
   g => { const cols = ['#0b0f1a', '#070a12']; [[60, 210, 620, .5], [300, 160, 760, .7], [520, 240, 540, .4], [820, 180, 700, .8], [1050, 260, 480, .3], [1340, 190, 820, .6], [1560, 230, 600, .5], [1780, 200, 680, .7]].forEach(([x, w, h, b], i) => tower(g, x, 940, w, h, cols[i % 2], .02, 300 + i, b, 'rgba(255,190,120,'));
     g.fillStyle = '#0b1424'; g.fillRect(0, 930, W, 150); rs(12); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(160,190,240,${.08 + .15 * rn()})`; g.fillRect(rn() * W, 940 + rn() * 130, 20 + rn() * 90, 2); }
     });
  // ---------- 近日点的白天 ----------
  scene('heat', g => { sky(g, [[0, '#ffd9a0'], [.5, '#ffb066'], [1, '#d9733a']], 900); glow(g, 1200, 300, 700, 'rgba(255,250,230,A)', .9); g.fillStyle = '#fffbe9'; g.beginPath(); g.arc(1200, 300, 210, 0, 7); g.fill(); },
   (g, t) => { g.globalAlpha = .12; for (let i = 0; i < 30; i++) { const y = 560 + i * 16; g.fillStyle = '#fff3d6'; g.fillRect(0, y + 4 * Math.sin(t * 3 + i), W, 3); } g.globalAlpha = 1; },
   g => { [[0, 420, 560], [400, 300, 420], [1480, 440, 600], [1300, 200, 380]].forEach(([x, w, h], i) => { g.fillStyle = i % 2 ? '#7a3d22' : '#5c2d19'; g.fillRect(x, 940 - h, w, h); g.fillStyle = 'rgba(40,20,12,.85)'; for (let k = 0; k < Math.floor(h / 70); k++) for (let j = 0; j < Math.floor(w / 70); j++) { g.fillRect(x + 18 + j * 70, 940 - h + 30 + k * 70, 44, 40); g.fillStyle = 'rgba(120,70,40,.9)'; for (let s = 0; s < 4; s++) g.fillRect(x + 18 + j * 70, 940 - h + 34 + k * 70 + s * 9, 44, 3); g.fillStyle = 'rgba(40,20,12,.85)'; } });
     g.fillStyle = '#4a2414'; g.fillRect(0, 930, W, 150); g.fillStyle = '#2a120a'; g.beginPath(); g.moveTo(820, 930); g.lineTo(1100, 930); g.lineTo(1080, 1000); g.lineTo(840, 1000); g.fill();
     g.fillStyle = '#e8dcc0'; g.fillRect(860, 740, 200, 60); g.fillStyle = '#2a120a'; g.font = '700 30px "Noto Sans CJK SC",sans-serif'; g.fillText('地下入口 ↓', 878, 782);
     person(g, 1180, 930, 230, { suit: 1, col: '#3a1a0e', visor: 'rgba(255,220,160,.7)', dir: -1 }); person(g, 1300, 935, 160, { suit: 1, col: '#3a1a0e', visor: 'rgba(255,220,160,.7)', dir: -1 }); });
  // ---------- 地下城 ----------
  scene('under', g => { sky(g, [[0, '#120c08'], [1, '#2a1a10']]); g.fillStyle = '#1b120c'; for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse(i * 330, 80, 260, 260, 0, 0, Math.PI); g.fill(); }
     g.fillStyle = '#0d0a14'; g.fillRect(860, 0, 200, 230); moon(g, 960, 112, 34, { i: 95, sa: Math.PI - .4, eng: .9, ray: 2.2 });
     g.strokeStyle = 'rgba(160,200,255,.12)'; g.lineWidth = 120; g.beginPath(); g.moveTo(960, 200); g.lineTo(960, 900); g.stroke();
     for (let L = 0; L < 3; L++) for (let i = 0; i < 12; i++) { const x = i * 170 + (L % 2) * 80, y = 360 + L * 170, w = 140, h = 130; g.fillStyle = ['#3a2616', '#33200f', '#2c1b0e'][L]; g.fillRect(x, y, w, h); for (let k = 0; k < 2; k++) { g.fillStyle = 'rgba(255,190,110,.85)'; g.fillRect(x + 20 + k * 60, y + 30, 34, 40); glow(g, x + 37 + k * 60, y + 50, 60, 'rgba(255,180,90,A)', .18); } }
     for (let s = 0; s < 3; s++) { g.strokeStyle = 'rgba(80,50,30,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 300 + s * 170); g.quadraticCurveTo(960, 360 + s * 170, W, 300 + s * 170); g.stroke(); rs(30 + s); for (let i = 0; i < 40; i++) { const x = i * 48, y = 300 + s * 170 + 60 * (1 - ((x - 960) / 960) ** 2); glow(g, x, y + 4, 18, 'rgba(255,210,140,A)', .7); g.fillStyle = '#ffe0a8'; g.beginPath(); g.arc(x, y + 4, 3, 0, 7); g.fill(); } } },
   null,
   g => { g.fillStyle = '#100a06'; g.fillRect(0, 880, W, 200); for (let i = 0; i < 5; i++) { const x = 140 + i * 360; g.fillStyle = '#2a1608'; g.fillRect(x, 800, 220, 90); g.fillStyle = '#6a3a1a'; g.beginPath(); g.moveTo(x - 20, 800); g.lineTo(x + 110, 750); g.lineTo(x + 240, 800); g.fill(); glow(g, x + 110, 810, 120, 'rgba(255,190,110,A)', .3); }
     [[300, 160, {}], [360, 100, { child: 1, arm: 'up' }], [700, 165, { arm: 'hold' }], [760, 105, { child: 1 }], [1100, 95, { child: 1, walk: 1 }], [1180, 92, { child: 1, walk: 1, dir: -1, arm: 'up' }], [1500, 170, { coat: 1 }], [1620, 150, { bag: 1, dir: -1 }]].forEach(([x, h, o]) => person(g, x, 915, h * 1.45, { col: '#0a0604', ...o })); });
  // ---------- 冰封的海与船 ----------
  scene('ship', g => { sky(g, [[0, '#02040a'], [1, '#0f1a2c']], 700); stars(g, 700, 1, 680, 8); glow(g, 1600, 230, 60, 'rgba(255,245,225,A)', .9); g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(1600, 230, 5, 0, 7); g.fill(); },
   (g, t) => moon(g, 420, 230, 70, { i: 112, sa: 0, dim: .5, es: 0 }),
   g => { const ig = g.createLinearGradient(0, 640, 0, H); ig.addColorStop(0, '#b9bec6'); ig.addColorStop(1, '#4a4f58'); g.fillStyle = ig; g.fillRect(0, 640, W, H - 640);
     rs(14); for (let i = 0; i < 26; i++) { const x = rn() * W, y = 660 + rn() * 260, w = 60 + rn() * 200, h = 20 + rn() * 60; const v = 200 + 50 * rn() | 0; g.fillStyle = `rgba(${v},${v + 3},${v + 8},${.5 + .4 * rn()})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * .3, y - h); g.lineTo(x + w * .6, y - h * .4); g.lineTo(x + w, y); g.fill(); }
     g.save(); g.translate(1060, 690); g.rotate(-.08); g.fillStyle = '#1a1f2a'; g.beginPath(); g.moveTo(-420, 0); g.lineTo(380, 0); g.lineTo(440, -90); g.lineTo(-460, -90); g.fill(); g.fillStyle = '#2a3140'; g.fillRect(-380, -150, 600, 60); g.fillStyle = '#7a2a22'; for (let i = 0; i < 6; i++) g.fillRect(-370 + i * 100, -140, 80, 40);
     g.fillStyle = '#1a1f2a'; g.fillRect(230, -260, 140, 170); g.fillStyle = 'rgba(225,228,235,.85)'; g.fillRect(-470, -96, 920, 10); g.fillRect(-380, -156, 600, 8); g.fillRect(230, -266, 140, 8); g.restore();
     person(g, 560, 900, 240, { suit: 1, lamp: 1, col: '#0a0f18' }); g.strokeStyle = '#0a0f18'; g.lineWidth = 5; g.beginPath(); g.moveTo(530, 840); g.lineTo(380, 892); g.stroke(); g.fillStyle = '#0a0f18'; g.fillRect(270, 875, 120, 28); });
  // ---------- 冰中的城市 ----------
  scene('icecity', g => { sky(g, [[0, '#020409'], [1, '#0b1626']], 760); stars(g, 600, 1, 700, 9);
     for (let i = 0; i < 5; i++) { const gr = g.createLinearGradient(0, 120, 0, 560); gr.addColorStop(0, 'rgba(90,255,190,0)'); gr.addColorStop(.6, `rgba(90,255,190,${.05 + .02 * i})`); gr.addColorStop(1, 'rgba(90,255,190,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(100 + i * 160, 560); g.bezierCurveTo(400 + i * 170, 300, 700 + i * 160, 220, 1100 + i * 150, 120); g.lineTo(1150 + i * 150, 150); g.bezierCurveTo(740 + i * 160, 260, 450 + i * 170, 340, 160 + i * 160, 590); g.fill(); } },
   (g, t) => moon(g, 1500, 240, 64, { i: 80, sa: Math.PI - .2, dim: .45, es: 0 }),
   g => { [[80, 200, 560], [330, 160, 700], [540, 220, 480], [1180, 180, 620], [1400, 240, 520], [1700, 180, 660]].forEach(([x, w, h], i) => { tower(g, x, 900, w, h, '#0e1828', .04, 400 + i, 0, 'rgba(255,200,130,'); g.fillStyle = 'rgba(215,220,228,.28)'; g.fillRect(x - 14, 900 - h * .75, w + 28, h * .75); g.fillStyle = 'rgba(232,235,240,.9)'; g.fillRect(x - 14, 900 - h, w + 28, 10); g.strokeStyle = 'rgba(230,235,242,.55)'; g.lineWidth = 2; g.strokeRect(x - 14, 900 - h * .75, w + 28, h * .75);
       g.fillStyle = 'rgba(230,234,240,.7)'; for (let k = 0; k < w / 16; k++) { g.beginPath(); g.moveTo(x - 10 + k * 16, 900 - h * .75); g.lineTo(x - 4 + k * 16, 900 - h * .75 + 18 + (k % 3) * 10); g.lineTo(x + 2 + k * 16, 900 - h * .75); g.fill(); } });
     g.strokeStyle = '#0e1828'; g.lineWidth = 8; g.beginPath(); g.arc(900, 640, 200, 0, 7); g.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.beginPath(); g.moveTo(900, 640); g.lineTo(900 + 200 * Math.cos(a), 640 + 200 * Math.sin(a)); g.stroke(); g.fillStyle = '#0e1828'; g.fillRect(900 + 200 * Math.cos(a) - 14, 640 + 200 * Math.sin(a), 28, 24); }
     g.fillStyle = '#0e1828'; g.beginPath(); g.moveTo(860, 900); g.lineTo(900, 640); g.lineTo(940, 900); g.fill();
     const ig = g.createLinearGradient(0, 880, 0, H); ig.addColorStop(0, '#b3b8c0'); ig.addColorStop(1, '#4b5059'); g.fillStyle = ig; g.fillRect(0, 880, W, 200);
     person(g, 1020, 915, 170, { suit: 1, lamp: 1, col: '#0a1220' }); person(g, 1110, 918, 120, { suit: 1, col: '#0a1220' }); });
  // ---------- 地下的壁画 ----------
  scene('mural', g => { g.fillStyle = '#2a1d14'; g.fillRect(0, 0, W, H); g.fillStyle = '#3b2a1d'; g.fillRect(140, 140, 1640, 640);
     const sk = g.createLinearGradient(0, 160, 0, 620); sk.addColorStop(0, '#4c9be8'); sk.addColorStop(1, '#a6d8ff'); g.fillStyle = sk; g.fillRect(170, 170, 1580, 470);
     g.fillStyle = '#ffd34d'; g.beginPath(); g.arc(1460, 300, 80, 0, 7); g.fill(); g.strokeStyle = '#ffd34d'; g.lineWidth = 10; g.lineCap = 'round'; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.beginPath(); g.moveTo(1460 + 100 * Math.cos(a), 300 + 100 * Math.sin(a)); g.lineTo(1460 + 140 * Math.cos(a), 300 + 140 * Math.sin(a)); g.stroke(); }
     g.fillStyle = '#fff'; [[420, 280], [700, 230], [980, 300]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 40, 0, 7); g.arc(x + 45, y - 15, 50, 0, 7); g.arc(x + 95, y, 38, 0, 7); g.fill(); });
     g.fillStyle = '#5bbf5a'; g.beginPath(); g.moveTo(170, 640); g.quadraticCurveTo(600, 480, 1000, 600); g.quadraticCurveTo(1400, 500, 1750, 610); g.lineTo(1750, 760); g.lineTo(170, 760); g.fill();
     g.fillStyle = '#3d8f3c'; for (let i = 0; i < 6; i++) { const x = 300 + i * 230; g.fillRect(x, 560, 14, 60); g.beginPath(); g.arc(x + 7, 545, 40, 0, 7); g.fill(); }
     g.fillStyle = '#e04a3c'; g.fillRect(820, 540, 120, 80); g.beginPath(); g.moveTo(800, 545); g.lineTo(880, 490); g.lineTo(960, 545); g.fill();
     g.fillStyle = 'rgba(42,29,20,.5)'; rs(3); for (let i = 0; i < 400; i++) g.fillRect(170 + rn() * 1580, 170 + rn() * 590, 2 + rn() * 8, 2); },
   null,
   g => { glow(g, 960, 300, 900, 'rgba(255,190,110,A)', .18); g.fillStyle = '#120c08'; g.fillRect(0, 870, W, 210);
     [[480, 120, { child: 1, arm: 'up' }], [620, 115, { child: 1, arm: 'point' }], [1180, 125, { child: 1, arm: 'up', dir: -1 }], [1360, 175, { coat: 1, arm: 'hold' }]].forEach(([x, h, o]) => person(g, x, 915, h * 1.5, { col: '#0a0604', ...o }));
     g.fillStyle = '#0a0604'; g.fillRect(780, 880, 50, 40); g.fillRect(870, 886, 44, 34); g.fillStyle = '#4c9be8'; g.fillRect(782, 876, 46, 7); g.fillStyle = '#ffd34d'; g.fillRect(872, 882, 40, 7); });
  // ---------- 冰原上的天文台 ----------
  scene('obs', g => { sky(g, [[0, '#01030a'], [1, '#0c1626']], 760); stars(g, 900, 1, 740, 10); [[1240, 250, 1], [1262, 242, .7]].forEach(([x, y, s]) => { glow(g, x, y, 70 * s, 'rgba(255,235,205,A)', .9); g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(x, y, 4 * s + 1, 0, 7); g.fill(); }); },
   (g, t) => moon(g, 380, 260, 58, { i: 155, sa: 0, dim: .25, es: 0, rim: .18 }),
   g => { const ig = g.createLinearGradient(0, 760, 0, H); ig.addColorStop(0, '#8e939c'); ig.addColorStop(1, '#2e3138'); g.fillStyle = ig; g.beginPath(); g.moveTo(0, 790); g.quadraticCurveTo(700, 730, 1300, 770); g.quadraticCurveTo(1600, 790, W, 760); g.lineTo(W, H); g.lineTo(0, H); g.fill();
     g.fillStyle = '#121a26'; g.fillRect(540, 640, 300, 140); g.beginPath(); g.arc(690, 640, 150, Math.PI, 0); g.fill(); g.fillStyle = 'rgba(255,200,130,.85)'; g.fillRect(676, 500, 28, 120); g.strokeStyle = '#121a26'; g.lineWidth = 16; g.beginPath(); g.moveTo(690, 600); g.lineTo(760, 520); g.stroke(); glow(g, 690, 560, 120, 'rgba(255,190,110,A)', .25);
     g.fillStyle = 'rgba(255,200,130,.85)'; g.fillRect(620, 720, 40, 50);
     person(g, 1060, 840, 240, { suit: 1, col: '#0a121e' }); person(g, 1170, 846, 160, { suit: 1, col: '#0a121e' }); g.strokeStyle = '#0a121e'; g.lineWidth = 11; g.beginPath(); g.moveTo(1078, 680); g.lineTo(1140, 590); g.stroke(); });
  // ---------- 第 57,000 年：两代人与两颗星 ----------
  scene('elders', g => { sky(g, [[0, '#04040c'], [.7, '#1a1530'], [1, '#3a2a3c']], 780); stars(g, 900, 1, 760, 11);
     [[1180, 300, 1], [1235, 285, .75]].forEach(([x, y, s]) => { glow(g, x, y, 200 * s, 'rgba(255,225,185,A)', .55); g.fillStyle = '#fff6e6'; g.beginPath(); g.arc(x, y, 16 * s, 0, 7); g.fill(); }); },
   (g, t) => moon(g, 560, 220, 52, { i: 100, sa: .13, dim: .85, es: 0 }),
   g => { const ig = g.createLinearGradient(0, 760, 0, H); ig.addColorStop(0, '#d8cdbf'); ig.addColorStop(1, '#4a4440'); g.fillStyle = ig; g.beginPath(); g.moveTo(0, 820); g.quadraticCurveTo(500, 770, 960, 800); g.quadraticCurveTo(1400, 830, W, 790); g.lineTo(W, H); g.lineTo(0, H); g.fill();
     g.fillStyle = '#0d0c16'; g.beginPath(); g.moveTo(740, 820); g.quadraticCurveTo(900, 770, 1080, 812); g.lineTo(1080, 880); g.lineTo(740, 880); g.fill();
     person(g, 860, 812, 260, { suit: 1, col: '#0d0c16', visor: 'rgba(255,225,190,.7)' }); person(g, 975, 808, 175, { suit: 1, col: '#0d0c16', visor: 'rgba(255,225,190,.7)' }); g.strokeStyle = '#0d0c16'; g.lineWidth = 12; g.beginPath(); g.moveTo(992, 660); g.lineTo(1050, 570); g.stroke(); });

  // ---------- 月球上的建设者：朝向地球那一面的发动机工地 ----------
  const regolith = (g, y0, seed, tone = 1) => { const gr = g.createLinearGradient(0, y0, 0, H); gr.addColorStop(0, `rgb(${120 * tone | 0},${118 * tone | 0},${114 * tone | 0})`); gr.addColorStop(1, `rgb(${40 * tone | 0},${39 * tone | 0},${38 * tone | 0})`); g.fillStyle = gr; g.fillRect(0, y0, W, H - y0);
    rs(seed); for (let i = 0; i < 70; i++) { const x = rn() * W, y = y0 + 10 + Math.pow(rn(), 1.4) * (H - y0), rr = (4 + rn() * 40) * (.3 + (y - y0) / 300); g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x, y, rr, rr * .32, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,250,.12)'; g.beginPath(); g.ellipse(x + rr * .25, y + rr * .06, rr * .8, rr * .22, 0, 0, Math.PI); g.fill(); } };
  const earthDisc = (g, x, y, r, sa = Math.PI) => { glow(g, x, y, r * 1.5, 'rgba(120,170,255,A)', .25); g.save(); g.translate(x, y); g.fillStyle = '#0d1a33'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.clip(); g.rotate(sa);
    const eg = g.createLinearGradient(-r, 0, r, 0); eg.addColorStop(0, '#000'); eg.addColorStop(.48, '#000'); eg.addColorStop(.52, '#2b5fa8'); eg.addColorStop(1, '#5d9be0'); g.fillStyle = eg; g.fillRect(-r, -r, 2 * r, 2 * r);
    rs(77); for (let i = 0; i < 14; i++) { const a = rn() * 6.28, d = rn() * r * .8; g.fillStyle = `rgba(${rn() < .5 ? '120,150,80' : '250,250,255'},${.35 * (Math.cos(a) * d > 0 ? 1 : .08)})`; g.beginPath(); g.ellipse(d * Math.cos(a), d * Math.sin(a), r * (.1 + .2 * rn()), r * (.05 + .1 * rn()), rn() * 3, 0, 7); g.fill(); }
    rs(78); for (let i = 0; i < 40; i++) { const a = rn() * 6.28, d = rn() * r * .9; if (Math.cos(a) * d < -r * .05) { g.fillStyle = 'rgba(255,200,120,.7)'; g.fillRect(d * Math.cos(a), d * Math.sin(a), 1.5, 1.5); } }
    g.restore(); g.strokeStyle = 'rgba(140,190,255,.6)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r + 1, sa - 1.6, sa + 1.6); g.stroke(); };
  scene('build', g => { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); stars(g, 900, .9, H, 21); earthDisc(g, 1560, 300, 130, 0);
     g.fillStyle = '#6d6b67'; g.beginPath(); g.moveTo(0, 700); g.quadraticCurveTo(500, 660, 900, 690); g.quadraticCurveTo(1400, 720, W, 680); g.lineTo(W, H); g.lineTo(0, H); g.fill(); },
   null,
   g => { regolith(g, 700, 23);
     // 喷口外壁：直径近百公里的钟形结构，只看到左侧的一段，顶部出画
     g.fillStyle = '#26262b'; g.beginPath(); g.moveTo(-10, 900); g.lineTo(-10, -20); g.lineTo(620, -20); g.bezierCurveTo(600, 300, 760, 560, 900, 880); g.closePath(); g.fill();
     g.fillStyle = '#34353b'; g.beginPath(); g.moveTo(560, -20); g.lineTo(620, -20); g.bezierCurveTo(600, 300, 760, 560, 900, 880); g.lineTo(840, 880); g.bezierCurveTo(700, 560, 540, 300, 560, -20); g.fill();
     g.strokeStyle = 'rgba(200,200,190,.35)'; g.lineWidth = 2; for (let k = 0; k < 24; k++) { const y = -10 + k * 38; g.beginPath(); g.moveTo(-10, y); g.lineTo(560 + 120 * Math.pow(Math.max(0, (y + 20) / 900), 1.6) + (y > 300 ? (y - 300) * .9 : 0) * .35, y); g.stroke(); }
     for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(40 + k * 62, -10); g.lineTo(40 + k * 62 + (k > 5 ? 60 : 0), 880); g.stroke(); }
     for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(255,220,160,${.5 + .4 * ((k * 7) % 3) / 2})`; g.fillRect(30 + k * 60, 820 - (k % 4) * 60, 6, 3); glow(g, 33 + k * 60, 821 - (k % 4) * 60, 30, 'rgba(255,210,150,A)', .35); }
     glow(g, 300, 400, 500, 'rgba(255,120,60,A)', .08);
     // 远处同一圈上的另一座喷口：露出地平线的一段弧
     g.fillStyle = '#1e1e22'; g.beginPath(); g.ellipse(1240, 700, 170, 40, 0, Math.PI, 0); g.fill(); g.fillStyle = '#2a2a2f'; g.fillRect(1070, 700, 340, 8);
     g.strokeStyle = '#3a3a3e'; g.lineWidth = 10; g.beginPath(); g.moveTo(1400, 900); g.lineTo(1400, 420); g.lineTo(1000, 400); g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(1080, 404); g.lineTo(1080, 600); g.stroke(); g.fillStyle = '#3a3a3e'; g.fillRect(1040, 600, 80, 40);
     g.fillStyle = '#26262a'; g.fillRect(960, 870, 180, 60); g.beginPath(); g.arc(990, 935, 22, 0, 7); g.arc(1110, 935, 22, 0, 7); g.fill(); g.fillStyle = 'rgba(255,220,160,.8)'; g.fillRect(1130, 882, 12, 10);
     [[920, 950, 110, 'up'], [1250, 955, 120, 'up'], [1500, 945, 100], [1660, 950, 105]].forEach(([x, y, h, a]) => robot(g, x, y, h, { arm: a, tool: a !== 'up', lamp: 1 }));
     g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(900, 880); g.lineTo(1700, 940); g.lineTo(900, 940); g.fill(); });
  // ---------- 月面观测站：看着喷流从地平线外升起 ----------
  // 观测站在离月面正中心约 35° 处：地球在仰角约 55° 的高空；发动机在 400–700 公里外的地平线以下，喷流柱向上、并朝地球旁边约 12° 的方向汇聚
  scene('lunarobs', g => { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); },
   (g, t) => { if (!window.MOON3 || !window.MOON3_READY) return; const a = 35 * Math.PI / 180, up = [Math.sin(a), 0, Math.cos(a)], h = 1.0006;
     const pos = up.map(v => v * h), td = [-Math.cos(a), 0, Math.sin(a)];            // 地面上朝地球方向、抬头约 38°
     const look = pos.map((v, k) => v + up[k] * .78 + td[k]);
     const k0 = i => Math.min(1, Math.max(0, (t - .3 - ((i * 5) % 12) * .12) / .6));
     const cv = MOON3.render({ i: 92, sa: 2.6, eng: k0, t, earthA: .09, view: { pos, look, up, fov: 80 } });
     stars(g, 700, .9, H, 31); g.drawImage(cv, 0, 0);
     const e = MOON3.project([0, 0, 400]); if (e[2] < 1) earthDisc(g, e[0], e[1], 80, Math.PI * .1); },
   g => { g.fillStyle = '#3a3936'; g.beginPath(); g.moveTo(0, 820); g.quadraticCurveTo(700, 790, 1200, 808); g.quadraticCurveTo(1600, 820, W, 800); g.lineTo(W, H); g.lineTo(0, H); g.fill(); regolith(g, 840, 33, .7);
     g.fillStyle = '#2a2a2e'; g.beginPath(); g.ellipse(560, 900, 230, 110, 0, Math.PI, 0); g.fill(); g.fillRect(330, 890, 460, 40); g.fillStyle = 'rgba(255,200,130,.85)'; for (let k = 0; k < 6; k++) g.fillRect(420 + k * 50, 850, 22, 18); glow(g, 560, 860, 260, 'rgba(255,190,110,A)', .18);
     [[1060, 930, 190, 'up'], [1200, 935, 160], [1330, 934, 170, 'up']].forEach(([x, y, h, a]) => robot(g, x, y, h, { arm: a }));
     g.strokeStyle = '#18181c'; g.lineWidth = 9; g.beginPath(); g.moveTo(1500, 820); g.lineTo(1500, 620); g.stroke(); g.beginPath(); g.ellipse(1500, 620, 60, 22, -.3, 0, 7); g.stroke(); });
  // ---------- 航天飞机：人类在离月球约 1.5 万公里的轨道上看点火 ----------
  scene('shuttle', g => { g.fillStyle = '#070809'; g.fillRect(0, 0, W, H); },
   (g, t) => { const k0 = Math.max(0, Math.min(1, (t - 1.0) / 1.3)); if (!window.MOON3 || !window.MOON3_READY) return;
     const cv = MOON3.render({ i: 92, sa: -.4, eng: i => k0 * Math.min(1, Math.max(0, (t - .9 - i * .09) / .5)), t, view: { pos: [6.2, 2.4, 6.6], look: [-.2, .3, 1.6], fov: 34 } });
     g.save(); g.beginPath(); g.roundRect(330, 150, 1260, 620, 60); g.clip(); g.fillStyle = '#000'; g.fillRect(330, 150, 1260, 620); stars(g, 500, .8, H, 41); g.drawImage(cv, 0, 0); g.restore(); },
   g => { g.fillStyle = '#1a1c22'; g.beginPath(); g.rect(0, 0, W, H); g.roundRect(330, 150, 1260, 620, 60); g.fill('evenodd');
     g.strokeStyle = '#3a3d47'; g.lineWidth = 26; g.beginPath(); g.roundRect(330, 150, 1260, 620, 60); g.stroke(); g.strokeStyle = '#0c0d10'; g.lineWidth = 4; g.stroke();
     g.fillStyle = '#101216'; g.fillRect(0, 800, W, 280); for (let k = 0; k < 9; k++) { g.fillStyle = ['#2e8bd8', '#ffb347', '#4bd49a'][k % 3]; glow(g, 200 + k * 190, 860, 30, 'rgba(120,200,255,A)', .25); g.fillRect(190 + k * 190, 855, 22, 6); g.fillStyle = '#1e2128'; g.fillRect(170 + k * 190, 870, 120, 70); }
     g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(360, 180, 500, 60);
     [[560, 870, 250, { arm: 'hold' }], [760, 860, 180, { child: 1, arm: 'up' }], [1240, 880, 260, { arm: 'point' }], [1420, 880, 230, {}]].forEach(([x, y, h, o]) => person(g, x, y, h, { col: '#06070a', ...o }));
     g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(330, 150, 1260, 4); });
  function draw(name, g, t, u, push = .05) {
    const s = S[name]; if (!s.c) { s.c = [mk(), mk(), mk()]; s.bg(s.c[0].getContext('2d')); if (s.fg) s.fg(s.c[1].getContext('2d')); if (s.bg2) s.bg2(s.c[2].getContext('2d')); }
    const k1 = 1 + push * .5 * u, k2 = 1 + push * u, cx = W / 2, cy = H * .55;
    g.save(); g.translate(cx, cy); g.scale(k1, k1); g.translate(-cx, -cy); g.drawImage(s.c[0], 0, 0); if (s.mid) s.mid(g, t, u); if (s.bg2) g.drawImage(s.c[2], 0, 0); if (s.mid2) s.mid2(g, t, u); g.restore();
    g.save(); g.translate(cx, cy); g.scale(k2, k2); g.translate(-cx, -cy - 6 * u); g.drawImage(s.c[1], 0, 0); g.restore();
  }
  return { draw, moon, aurora, names: Object.keys(S) };
})();
window.ST = ST;
