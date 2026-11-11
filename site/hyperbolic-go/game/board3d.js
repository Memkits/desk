// 视频用的双层围棋 3D 棋盘：按棋谱第 k 手的局面渲染，可在“两层玻璃板”和“一张棋盘大小子”两种棋具之间连续变换。
// B3.setGame({n, moves:[{c,p}]})；B3.draw(g, {x,y,w,h}, {k, morph, yaw, tilt, zoom, fx, fy, gap, hi:[点], badges})
window.B3 = (() => {
  const T = THREE, BLACK = 1, WHITE = 2, MR = { big: 0.47, small: 0.27 }, R0 = 0.43, FOOT = 0.6, THICK = 0.14;
  const lerp = (a, b, u) => a + (b - a) * u, cl = x => Math.max(0, Math.min(1, x)), ss = x => { x = cl(x); return x * x * (3 - 2 * x); };
  let n, nn, N, half, nb, snaps = [], G = {}, proj = [];
  function group(b, i) { const c = b[i], stones = [i], seen = new Uint8Array(N), libs = new Set(); seen[i] = 1;
    for (let k = 0; k < stones.length; k++) for (const j of nb[stones[k]]) { if (!b[j]) libs.add(j); else if (b[j] === c && !seen[j]) { seen[j] = 1; stones.push(j); } }
    return { stones, libs }; }
  function setGame(game) {
    n = game.n; nn = n * n; N = 2 * nn; half = (n - 1) / 2; nb = [];
    for (let l = 0; l < 2; l++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const a = [];
      if (x > 0) a.push(l * nn + y * n + x - 1); if (x < n - 1) a.push(l * nn + y * n + x + 1); if (y > 0) a.push(l * nn + (y - 1) * n + x); if (y < n - 1) a.push(l * nn + (y + 1) * n + x); a.push((1 - l) * nn + y * n + x); nb.push(a); }
    snaps = [{ b: new Int8Array(N), last: -1, caps: [0, 0, 0], cap: [], c: 0, p: -1 }];
    for (const m of game.moves) { const pv = snaps[snaps.length - 1], b = pv.b.slice(), cap = [], caps = pv.caps.slice();
      if (m.p >= 0) { b[m.p] = m.c; for (const j of nb[m.p]) if (b[j] === 3 - m.c) { const gr = group(b, j); if (!gr.libs.size) for (const s of gr.stones) { b[s] = 0; cap.push(s); } } caps[m.c] += cap.length; }
      snaps.push({ b, last: m.p, caps, cap, c: m.c, p: m.p }); }
    if (G.r) build();
  }
  function wood(base, rep) {
    const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d'); x.fillStyle = base; x.fillRect(0, 0, 1024, 1024);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let k = 0; k < 420; k++) { const y = rnd() * 1024, a = 0.03 + rnd() * 0.09, w = 0.6 + rnd() * 2.4, ph = rnd() * 6.28, amp = 2 + rnd() * 7, f = 0.004 + rnd() * 0.006;
      x.strokeStyle = rnd() < 0.75 ? `rgba(92,58,24,${a})` : `rgba(236,200,140,${a})`; x.lineWidth = w; x.beginPath();
      for (let px = 0; px <= 1024; px += 16) { const yy = y + Math.sin(px * f + ph) * amp; px ? x.lineTo(px, yy) : x.moveTo(px, yy); } x.stroke(); }
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); return t;
  }
  function init() {
    const r = new T.WebGLRenderer({ antialias: !(window.B3OPT && window.B3OPT.noaa), preserveDrawingBuffer: true }); r.setPixelRatio(1);
    r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 0.82; r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, 0.5, 600);
    const es = new T.Scene(); es.add(new T.Mesh(new T.BoxGeometry(40, 24, 40), new T.MeshBasicMaterial({ color: 0x3c3d42, side: T.BackSide })));
    const panel = (w, h, x, y, z, rx, ry, i, tint = 1) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(i, i * 0.98, i * 0.94 * tint), side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); es.add(m); };
    panel(18, 12, 0, 11.8, 0, Math.PI / 2, 0, 9); panel(12, 9, -19.5, 2, -3, 0, Math.PI / 2, 5); panel(9, 7, 8, 1, 19.5, 0, 0, 2.5); panel(40, 40, 0, -11.8, 0, Math.PI / 2, 0, 0.5, 0.7);
    const pm = new T.PMREMGenerator(r); scene.environment = pm.fromScene(es, 0.035).texture; pm.dispose();
    const key = new T.DirectionalLight(0xfff4e2, 1.9); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 5; key.shadow.blurSamples = 16; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key, key.target);
    scene.add(new T.HemisphereLight(0xffffff, 0x8a6a40, 0.2)); scene.background = new T.Color(0x0b0f1a);
    const sm = (col, o) => new T.MeshPhysicalMaterial({ color: col, transparent: true, ...o });
    const mk = c => c === BLACK ? sm(0x0b0c0f, { roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.4, envMapIntensity: 0.3 }) : sm(0xf1eee4, { roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.9 });
    const mats = {}; for (const c of [BLACK, WHITE]) { mats[c] = mk(c); mats[c + 'f'] = mk(c); mats[c + 'i'] = mk(c); }
    G = { r, scene, cam, key, mats, geo: new T.SphereGeometry(1, 48, 28) }; build();
  }
  function build() {
    if (G.root) G.scene.remove(G.root);
    const root = new T.Group(), Sz = n - 1 + 1.7; G.root = root; G.Sz = Sz; G.st = []; G.scene.add(root);
    G.tableMat = G.tableMat || new T.MeshStandardMaterial({ map: wood('#9c6c3c', 5), roughness: 0.7, envMapIntensity: 0.45 });
    G.table = new T.Mesh(new T.PlaneGeometry(Sz * 14, Sz * 14), G.tableMat); G.table.rotation.x = -Math.PI / 2; G.table.receiveShadow = true; root.add(G.table);
    G.boardMat = G.boardMat || new T.MeshStandardMaterial({ map: wood('#d2a55e', 1.3), roughness: 0.6, envMapIntensity: 0.5, transparent: true });
    G.board = new T.Mesh(new T.BoxGeometry(Sz, 0.5, Sz), G.boardMat); G.board.receiveShadow = true; root.add(G.board);
    G.plate = []; G.lineMat = []; G.face = []; G.edge = []; G.glass = [];
    for (const l of [0, 1]) { const p = new T.Group();
      const face = new T.MeshPhysicalMaterial({ color: 0xeef8f4, transparent: true, opacity: 0.13, roughness: 0.03, envMapIntensity: 1.8, depthWrite: false });
      const edge = new T.MeshPhysicalMaterial({ color: 0x5fbf9f, transparent: true, opacity: 0.55, roughness: 0.12, envMapIntensity: 1.4, depthWrite: false });
      const glass = new T.Mesh(new T.BoxGeometry(Sz, THICK, Sz), [edge, edge, face, face, edge, edge]); glass.position.y = -THICK / 2; glass.renderOrder = 1; p.add(glass); G.face[l] = face; G.edge[l] = edge; G.glass[l] = glass;
      const lm = new T.MeshBasicMaterial({ color: 0x14110d, transparent: true, opacity: 0.8, depthWrite: false }); G.lineMat[l] = lm;
      for (let k = 0; k < n; k++) { const w = (k === 0 || k === n - 1) ? 0.05 : 0.028;
        const a = new T.Mesh(new T.BoxGeometry(n - 1 + w, 0.004, w), lm); a.position.set(0, 0.003, k - half); const b2 = new T.Mesh(new T.BoxGeometry(w, 0.004, n - 1 + w), lm); b2.position.set(k - half, 0.003, 0); a.renderOrder = b2.renderOrder = 2; p.add(a, b2); }
      const stars = n === 13 ? [3, 6, 9] : n === 9 ? [2, 4, 6] : n === 7 ? [3] : [];
      for (const a of stars) for (const c of stars) { if (n === 9 && (a === 4) !== (c === 4)) continue; const d = new T.Mesh(new T.CircleGeometry(0.09, 20), lm); d.rotation.x = -Math.PI / 2; d.position.set(a - half, 0.006, c - half); d.renderOrder = 2; p.add(d); }
      root.add(p); G.plate[l] = p; }
    G.pegMat = new T.MeshStandardMaterial({ color: 0xd9dde2, metalness: 1, roughness: 0.18, transparent: true }); G.pegs = [];
    for (const s of [0, 1]) for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const m = new T.Mesh(new T.CylinderGeometry(0.16, 0.16, 1, 24), G.pegMat); m.castShadow = true; m.userData = { s, x: sx * (Sz / 2 - 0.42), z: sz * (Sz / 2 - 0.42) }; root.add(m); G.pegs.push(m); }
    G.rods = []; G.rodMat = { [BLACK]: new T.MeshStandardMaterial({ color: 0x15161a, roughness: 0.3, transparent: true }), [WHITE]: new T.MeshStandardMaterial({ color: 0xe9e6dc, roughness: 0.3, transparent: true }) };
    G.peds = []; G.pedMat = new T.MeshPhysicalMaterial({ color: 0xe8f6f1, transparent: true, opacity: 0.38, roughness: 0.05, envMapIntensity: 1.6, depthWrite: false });
    G.inc = new T.Mesh(G.geo, G.mats[BLACK + 'i']); G.inc.castShadow = true; G.inc.renderOrder = 3; root.add(G.inc);
  }
  let lastKey = '';
  function draw(g, R, st) {
    if (!G.r) init();
    const q = st.q ?? 1, rw = Math.round(R.w * q), rh = Math.round(R.h * q);
    if (G.w !== rw || G.h !== rh) { G.r.setSize(rw, rh, false); G.w = rw; G.h = rh; lastKey = ''; }
    const key = JSON.stringify([st.k, st.morph, st.yaw, st.tilt, st.zoom, st.fx, st.fy, st.gap, q, R.w, R.h]);
    const k0 = Math.max(0, Math.min(snaps.length - 1, Math.floor(st.k))), u = st.k - k0, cur = snaps[k0], nx = u > 0 && k0 + 1 < snaps.length ? snaps[k0 + 1] : null, b = cur.b;
    const m = st.morph ?? 1, gapW = (st.gap ?? 0.5) * 4, RL = [lerp(R0, MR.small, m), lerp(R0, MR.big, m)], HL = [RL[0] * 0.42, RL[1] * 0.42], ly = [lerp(gapW, MR.big * 0.84, m), 0];
    const Sz = G.Sz, tableY = lerp(-FOOT, -0.5, m);
    if (key !== lastKey) {
      lastKey = key;
      G.table.position.y = tableY; G.board.position.y = -0.25; G.boardMat.opacity = ss((m - 0.25) / 0.5); G.board.visible = m > 0.25; G.board.castShadow = m > 0.9;
      for (const l of [0, 1]) { G.plate[l].position.y = ly[l]; G.face[l].opacity = 0.13 * (1 - ss(m * 1.6)); G.edge[l].opacity = 0.55 * (1 - ss(m * 1.6)); G.glass[l].visible = m < 0.62; }
      G.lineMat[0].opacity = 0.8 * (1 - ss(m * 1.4)); G.lineMat[1].opacity = lerp(0.5, 0.85, m);
      G.pegMat.opacity = 1 - ss(m * 4); for (const p of G.pegs) { const d = p.userData, h = d.s ? gapW - THICK : FOOT - THICK, y0 = d.s ? 0 : -FOOT; p.visible = m < 0.25; p.scale.set(1, h, 1); p.position.set(d.x, y0 + h / 2, d.z); }
      const fade = nx ? 1 - ss((u - 0.45) / 0.45) : 1; for (const c of [BLACK, WHITE]) { G.mats[c].opacity = lerp(0.93, 1, m); G.mats[c + 'f'].opacity = fade * 0.95; G.mats[c + 'i'].opacity = nx ? ss(u / 0.18) : 0; }
      for (let i = 0; i < N; i++) { const c = b[i]; let me = G.st[i];
        if (!c) { if (me) me.visible = false; continue; }
        const l = i < nn ? 0 : 1, p = i % nn;
        if (!me) { me = G.st[i] = new T.Mesh(G.geo, G.mats[c]); me.castShadow = me.receiveShadow = true; me.renderOrder = 3; G.plate[l].add(me); }
        const dying = nx && nx.cap.includes(i); me.material = G.mats[c + (dying ? 'f' : '')]; me.visible = !dying || fade > 0.02; me.castShadow = !dying;
        me.scale.set(RL[l], HL[l], RL[l]); me.position.set(p % n - half, HL[l], Math.floor(p / n) - half); }
      const inc = G.inc; inc.visible = !!(nx && nx.p >= 0);
      if (inc.visible) { const i = nx.p, l = i < nn ? 0 : 1, p = i % nn, e = ss(u / 0.5); inc.material = G.mats[nx.c + 'i']; inc.scale.set(RL[l], HL[l], RL[l]); inc.position.set(p % n - half, ly[l] + HL[l] + (1 - e) * 1.4, Math.floor(p / n) - half); }
      const disp = nx && u >= 0.5 ? nx.b : b;
      let ri = 0; const ro = 1 - ss(m * 2.5); if (ro > 0.02) for (let k = 0; k < nn; k++) { const a = disp[k]; if (!a || a !== disp[k + nn]) continue; let me = G.rods[ri]; if (!me) { me = G.rods[ri] = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 1, 12), G.rodMat[a]); G.root.add(me); } ri++;
        me.material = G.rodMat[a]; me.visible = true; const h = Math.max(0.01, ly[0] - HL[1] * 2 - THICK); me.scale.set(1, h, 1); me.position.set(k % n - half, HL[1] * 2 + h / 2, Math.floor(k / n) - half); }
      for (; ri < G.rods.length; ri++) G.rods[ri].visible = false; G.rodMat[BLACK].opacity = G.rodMat[WHITE].opacity = 0.85 * ro;
      let pi = 0; const po = ss((m - 0.7) / 0.3); G.pedMat.opacity = 0.38 * po; if (po > 0.02) for (let k = 0; k < nn; k++) { const up = b[k] || (nx && nx.p === k && u > 0.35); if (!up || b[k + nn] || (nx && nx.p === k + nn && u > 0.3)) continue; let me = G.peds[pi]; if (!me) { me = G.peds[pi] = new T.Mesh(new T.CylinderGeometry(0.12, 0.16, 1, 20), G.pedMat); me.renderOrder = 2; G.root.add(me); } pi++;
        me.visible = true; me.scale.set(1, ly[0], 1); me.position.set(k % n - half, ly[0] / 2, Math.floor(k / n) - half); }
      for (; pi < G.peds.length; pi++) G.peds[pi].visible = false;
      const cam = G.cam, az = (st.yaw ?? 0) * Math.PI / 180, pol = Math.max(2, st.tilt ?? 30) * Math.PI / 180, zoom = st.zoom ?? 1; cam.aspect = R.w / R.h;
      const dir = new T.Vector3(Math.sin(pol) * Math.sin(az), Math.cos(pol), Math.sin(pol) * Math.cos(az)); let D = Sz * 3;
      const top = ly[0] + HL[0] * 2 + 0.2, cy = (top + tableY) / 2, cn = []; for (const y of [top, tableY]) for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) cn.push(new T.Vector3(x * Sz / 2, y, z * Sz / 2));
      const ctr = new T.Vector3(0, cy, 0);
      for (let it = 0; it < 4; it++) { cam.position.copy(dir).multiplyScalar(D).add(ctr); cam.lookAt(ctr); cam.updateProjectionMatrix(); cam.updateMatrixWorld(); let mx = 0; for (const v of cn) { const q = v.clone().project(cam); mx = Math.max(mx, Math.abs(q.x), Math.abs(q.y)); } D *= mx / 0.95; }
      const w = 1 - 1 / zoom, tg = new T.Vector3(((st.fx ?? half) - half) * w, cy, ((st.fy ?? half) - half) * w);
      cam.position.copy(dir).multiplyScalar(D / zoom).add(tg); cam.lookAt(tg); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
      const kl = G.key; kl.position.set(-Sz * 0.35, Sz * 2.2, -Sz * 0.28); kl.target.position.set(0, 0, 0); const sc = kl.shadow.camera; sc.left = sc.bottom = -Sz * 0.75; sc.right = sc.top = Sz * 0.75; sc.near = 1; sc.far = Sz * 4; sc.updateProjectionMatrix();
      G.r.render(G.scene, cam);
      const right = new T.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), v = new T.Vector3(), v2 = new T.Vector3(); proj = new Array(N);
      for (let i = 0; i < N; i++) { const l = i < nn ? 0 : 1, p = i % nn; v.set(p % n - half, ly[l] + HL[l], Math.floor(p / n) - half); v2.copy(v).add(right); v.project(cam); v2.project(cam);
        proj[i] = { x: (v.x * .5 + .5) * R.w, y: (-v.y * .5 + .5) * R.h, s: Math.abs(v2.x - v.x) * .5 * R.w, r: RL[l] }; }
      G.disp = disp; G.ryK = Math.max(0.3, Math.cos(pol)); G.m = m;
    }
    g.imageSmoothingQuality = 'high'; g.drawImage(G.r.domElement, R.x, R.y, R.w, R.h);
    overlay(g, R, st, cur, nx, u);
  }
  function overlay(g, R, st, cur, nx, u) {
    const b = G.disp, m = G.m, ryK = G.ryK, MG = m > 0.5, P = i => ({ ...proj[i], x: proj[i].x + R.x, y: proj[i].y + R.y });
    const ell = (p, k) => { const r = p.s * p.r * k; g.beginPath(); g.ellipse(p.x, p.y, r, Math.max(r * ryK, r * 0.42), 0, 0, 7); };
    g.save(); g.beginPath(); g.rect(R.x, R.y, R.w, R.h); g.clip(); g.textAlign = 'center'; g.textBaseline = 'middle';
    // 棋块：气数
    const done = new Uint8Array(N), groups = [];
    for (let i = 0; i < N; i++) if (b[i] && !done[i]) { const gr = group(b, i); gr.stones.forEach(s => done[s] = 1); gr.c = b[i]; groups.push(gr); }
    for (const gr of groups) if (gr.libs.size === 1) for (const i of gr.stones) { g.strokeStyle = '#ff5a4d'; g.lineWidth = 3; ell(P(i), 1.12); g.stroke(); }
    const last = nx && u >= 0.5 ? nx.p : (nx ? -1 : cur.last);
    if (last >= 0 && b[last]) { const p = P(last); g.strokeStyle = '#ffd27a'; g.lineWidth = 3.5; ell(p, 1.22); g.stroke(); }
    if (st.badges !== false) for (const gr of groups) {
      const pick = l => { let best = -1; for (const s of gr.stones) { if ((s < nn ? 0 : 1) !== l) continue; if (MG && l === 1 && b[s - nn]) continue; if (best < 0 || proj[s].y > proj[best].y) best = s; } return best; };
      const list = MG ? [pick(0) >= 0 && pick(1) < 0 ? pick(0) : (pick(1) >= 0 ? pick(1) : pick(0))] : [pick(0), pick(1)];
      for (let i of list) { let cov = false; if (i < 0) { if (!MG) continue; i = gr.stones.find(s => s >= nn); if (i === undefined) continue; cov = true; }
        const p = P(i), r = p.s * p.r * (cov ? 0.5 : 1); g.font = `700 ${Math.max(15, r * (p.r < 0.3 ? 1.15 : 0.9))}px "DejaVu Sans Mono",monospace`;
        g.fillStyle = gr.libs.size === 1 ? '#ff5a4d' : gr.libs.size === 2 ? '#ffa23a' : (gr.c === BLACK ? 'rgba(255,255,255,.9)' : 'rgba(20,20,20,.85)');
        if (cov) { const bx = p.x + p.s * 0.4, by = p.y + p.s * 0.4 * ryK, br = Math.max(13, p.s * 0.17); g.font = `700 ${br * 1.25}px "DejaVu Sans Mono",monospace`; const fc = g.fillStyle; g.fillStyle = gr.c === BLACK ? 'rgba(15,16,20,.92)' : 'rgba(245,242,232,.95)'; g.beginPath(); g.arc(bx, by, br, 0, 7); g.fill(); g.strokeStyle = gr.c === BLACK ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.5)'; g.lineWidth = 1.5; g.stroke(); g.fillStyle = fc; g.fillText(gr.libs.size, bx, by + 1); }
        else g.fillText(gr.libs.size, p.x, p.y + 1); } }
    // 终局归属
    if (st.terr && st.terrA > 0) { g.globalAlpha = st.terrA; for (let i = 0; i < N; i++) { if (b[i] || !st.terr[i]) continue; const p = P(i), r = p.s * (i < nn ? 0.1 : 0.16); g.fillStyle = st.terr[i] === BLACK ? '#111' : '#f4f1e6'; g.strokeStyle = st.terr[i] === BLACK ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)'; g.lineWidth = 1.5; g.beginPath(); g.rect(p.x - r, p.y - r * ryK, 2 * r, 2 * r * ryK); g.fill(); g.stroke(); } g.globalAlpha = 1; }
    // 重点棋块：描边 + 给每口气编号
    const ha = st.hiA ?? 1;
    if (st.hi && ha > 0) { g.globalAlpha = ha; const seen = new Set();
      for (const h of st.hi) { if (!b[h] || seen.has(h)) continue; const gr = group(b, h); gr.stones.forEach(s => seen.add(s));
        for (const i of gr.stones) { g.strokeStyle = '#5cb4ff'; g.lineWidth = 3.5; ell(P(i), 1.1); g.stroke(); }
        const col = gr.libs.size === 1 ? '#ff5a4d' : '#2fae6b';
        [...gr.libs].sort((a, c) => a - c).forEach((j, k) => { let p = P(j); const r = Math.max(14, p.s * 0.2);
          if (MG && j >= nn) { g.strokeStyle = col; g.lineWidth = 3; ell(p, 0.97); g.stroke(); p = { x: p.x + p.s * 0.36, y: p.y + p.s * 0.36 * ryK }; } else if (MG && b[j + nn]) p = { x: p.x - p.s * 0.3, y: p.y - p.s * 0.3 * ryK };
          g.fillStyle = col; g.beginPath(); g.arc(p.x, p.y, r, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.5; g.stroke();
          g.fillStyle = '#fff'; g.font = `700 ${r * 1.15}px "DejaVu Sans Mono",monospace`; g.fillText(k + 1, p.x, p.y + 1); }); }
      g.globalAlpha = 1; }
    g.restore();
  }
  // 平面小图：某一层在第 k 手后的局面
  function mini(g, x, y, sz, l, k, o = {}) {
    const k0 = Math.max(0, Math.min(snaps.length - 1, Math.round(k))), b = snaps[k0].b, c = sz / (n + 0.4), ox = x + c * 0.7, oy = y + c * 0.7;
    g.save(); g.fillStyle = l ? '#d9b676' : '#cfe3da'; g.beginPath(); g.roundRect(x, y, sz, sz, 8); g.fill();
    g.strokeStyle = 'rgba(20,16,10,.75)'; g.lineWidth = 1.2; g.beginPath(); for (let i = 0; i < n; i++) { g.moveTo(ox + i * c, oy); g.lineTo(ox + i * c, oy + (n - 1) * c); g.moveTo(ox, oy + i * c); g.lineTo(ox + (n - 1) * c, oy + i * c); } g.stroke();
    for (let p = 0; p < nn; p++) { const i = l * nn + p, px = ox + (p % n) * c, py = oy + Math.floor(p / n) * c, v = b[i];
      if (v) { g.fillStyle = v === BLACK ? '#101114' : '#f6f3ea'; g.beginPath(); g.arc(px, py, c * 0.45, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1; g.stroke();
        if (o.hi && o.hi.has(i)) { g.strokeStyle = '#2f8fff'; g.lineWidth = 3; g.beginPath(); g.arc(px, py, c * 0.5, 0, 7); g.stroke(); }
        if (i === snaps[k0].last) { g.fillStyle = '#ff9a2e'; g.beginPath(); g.arc(px, py, c * 0.17, 0, 7); g.fill(); } }
      else { if (o.terr && o.terr[i]) { g.fillStyle = o.terr[i] === BLACK ? '#101114' : '#f6f3ea'; g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 1; g.beginPath(); g.rect(px - c * .17, py - c * .17, c * .34, c * .34); g.fill(); g.stroke(); }
        if (o.lib && o.lib.has(i)) { g.fillStyle = o.libCol || '#2fae6b'; g.beginPath(); g.arc(px, py, c * 0.2, 0, 7); g.fill(); } } }
    g.restore();
  }
  return { _G: () => G, setGame, draw, mini, group: (k, i) => group(snaps[k].b, i), snap: k => snaps[Math.max(0, Math.min(snaps.length - 1, k))], get len() { return snaps.length - 1; }, pt: i => proj[i] };
})();
