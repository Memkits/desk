// 卫星时间地图核心：底图（Blue Marble）+ 东部高清层 + 末次冰期陆架 + 遗址近景（Sentinel-2）+ 文化范围 + 交流弧线 + 遗址点。
// 视频与互动页共用。坐标：X = 经度 − 110，Z = −(纬度 − 35)·KY，单位“度”。
(function (G) {
  const KY = 1.22, LON0 = 110, LAT0 = 35;
  const X = lon => lon - LON0, Z = lat => -(lat - LAT0) * KY;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  // 时间轴刻度：距今年数取对数，近处拉开
  const AGE = y => 2030 - y;
  const tPos = y => { const a = Math.log10(AGE(y)), a0 = Math.log10(AGE(220)), a1 = Math.log10(AGE(-2200000)); return (a0 - a) / (a0 - a1); };   // 0 = 公元 220（右端）... 反过来用
  function yearStr(y) {
    y = Math.round(y);
    if (y <= -20000) { const a = -y; return `${+(a / 1e4).toFixed(a >= 1e6 ? 0 : 1)} 万年前`; }
    if (y <= -6000) return `距今约 ${Math.round((1950 - y) / 100) * 100} 年`;
    if (y < 0) return `公元前 ${-Math.round(y / 10) * 10} 年`;
    return `公元 ${y} 年`;
  }
  function merc2ll(x, y, z) { const n = 2 ** z; return [x / n * 360 - 180, Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI]; }

  function create(THREE, canvas, o = {}) {
    const base = o.base || '';
    const r = new THREE.WebGLRenderer({ canvas, antialias: o.aa ?? true, alpha: false, preserveDrawingBuffer: !!o.preserve });
    r.setPixelRatio(o.dpr || 1); r.setClearColor(0x03050b);
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(34, 16 / 9, .001, 400);
    const loader = new THREE.TextureLoader(), texs = {};
    const ld = (k, url) => new Promise(res => loader.load(base + url, t => { t.anisotropy = o.aniso ?? 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; texs[k] = t; res(t); }, undefined, () => res(null)));
    const U = { uLGM: { value: 0 }, uDim: { value: 0 } };
    const M = { r, sc, cam, U, KY, X, Z, ll: (lon, lat, h = 0) => new THREE.Vector3(X(lon), h, Z(lat)) };
    // ---------- 底图 ----------
    const plane = (lon0, lon1, lat0, lat1, mat, y = 0) => { const g = new THREE.PlaneGeometry(lon1 - lon0, (lat1 - lat0) * KY, 1, 1), m = new THREE.Mesh(g, mat); m.rotation.x = -Math.PI / 2; m.position.set(X((lon0 + lon1) / 2), y, Z((lat0 + lat1) / 2)); sc.add(m); return m; };
    // 底图一次画完：中国图 + 东部高清图（在其范围内混合）+ 冰期陆架
    const baseMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { tA: { value: null }, tM: { value: null }, tE: { value: null }, tC: { value: null }, ...U }, vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform sampler2D tA; uniform sampler2D tM; uniform sampler2D tE; uniform float uLGM; uniform float uDim; uniform sampler2D tC; varying vec2 vU;
        void main(){ vec3 c = texture2D(tA, vU).rgb; float m = texture2D(tM, vU).r;
          float lon = 67.5 + vU.x * 72.0, lat = 13.5 + vU.y * 40.5; vec2 eu = vec2((lon - 101.25) / 22.5, (lat - 22.5) / 20.25);
          float ee = min(min(eu.x, 1.-eu.x), min(eu.y, 1.-eu.y));
          if (ee > 0.) c = mix(c, texture2D(tE, eu).rgb, smoothstep(0., .06, ee) * (1. - uLGM));
          vec3 land = vec3(.34,.35,.235);
          c = mix(c, land, m * uLGM * .92);
          float edge = smoothstep(.35,.5,m) * (1. - smoothstep(.5,.65,m)); c += vec3(.9,.8,.5) * edge * uLGM * .35;
          c *= 1. - uDim * .55;
          vec4 cu = texture2D(tC, vU); c = mix(c, cu.rgb, cu.a);
          float e = min(min(vU.x, 1.-vU.x), min(vU.y, 1.-vU.y)); gl_FragColor = vec4(c, smoothstep(0., .025, e)); }` });
    const CPD = 8, cultCv = document.createElement('canvas'); cultCv.width = 72 * CPD; cultCv.height = 40.5 * CPD + .5 | 0; const cultTex = new THREE.CanvasTexture(cultCv); cultTex.minFilter = THREE.LinearFilter; cultTex.generateMipmaps = false; baseMat.uniforms.tC.value = cultTex;
    const world = new THREE.MeshBasicMaterial({ color: 0x555555 });
    // ---------- 遗址近景 ----------
    const closeMat = () => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { tA: { value: null }, uA: { value: 0 }, ...U }, vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform sampler2D tA; uniform float uA; uniform float uDim; varying vec2 vU; void main(){ vec3 c = texture2D(tA, vU).rgb * (1. - uDim * .55); c = pow(c, vec3(.92)) * 1.08; float e = min(min(vU.x, 1.-vU.x), min(vU.y, 1.-vU.y)); gl_FragColor = vec4(c, smoothstep(0.,.12,e) * uA); }` });
    M.close = {};
    // ---------- 文化范围（柔边椭圆） ----------
    const cultG = new THREE.Group(); sc.add(cultG);
    const cultMat = c => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uA: { value: 0 }, uC: { value: new THREE.Color(c) } }, vertexShader: 'varying vec2 vU; void main(){ vU = uv * 2. - 1.; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform float uA; uniform vec3 uC; varying vec2 vU; void main(){ float r = length(vU); if (r > 1.) discard; float fill = (1. - smoothstep(.55, 1., r)) * .28; float rim = smoothstep(.86, .95, r) * (1. - smoothstep(.95, 1., r)) * .7; gl_FragColor = vec4(uC, (fill + rim) * uA); }' });
    M.cults = (G.ARCH.C).map(c => { c = { ...c, a_: c.a || 0 }; const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), cultMat(c.c)); m.rotation.x = -Math.PI / 2; m.rotation.z = (c.a || 0) * Math.PI / 180; m.scale.set(c.rx, c.ry * KY, 1); m.position.set(X(c.lon), .004, Z(c.lat)); cultG.add(m); m.visible = false; return { ...c, m }; });
    // ---------- 交流弧线 ----------
    const linkG = new THREE.Group(); sc.add(linkG);
    M.links = G.ARCH.L.map(l => {
      const P = l.pts.map(([lo, la]) => new THREE.Vector3(X(lo), 0, Z(la))); let len = 0; for (let i = 1; i < P.length; i++) len += P[i].distanceTo(P[i - 1]);
      const curve = new THREE.CatmullRomCurve3(P.map((p, i) => { const u = i / (P.length - 1); return p.clone().setY(.02 + Math.sin(u * Math.PI) * len * .07); }), false, 'centripetal');
      const g = new THREE.TubeGeometry(curve, Math.max(32, Math.round(len * 12)), .065, 6, false);
      const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uA: { value: 0 }, uP: { value: 0 }, uT: { value: 0 }, uC: { value: new THREE.Color(G.ARCH.LK[l.k]) }, uL: { value: len } },
        vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform float uA; uniform float uP; uniform float uT; uniform vec3 uC; uniform float uL; varying vec2 vU; void main(){ if (vU.x > uP) discard; float d = fract(vU.x * uL * .6 - uT * .8); float head = smoothstep(uP - .04, uP, vU.x); float k = .45 + .55 * smoothstep(.0,.25,d) * (1. - smoothstep(.45,.7,d)); gl_FragColor = vec4(uC * (.55 + .45 * k) + head * .5, uA * (.8 + .2 * k)); }' });
      const m = new THREE.Mesh(g, mat); m.renderOrder = 5; linkG.add(m);
      // 箭头：终点小锥
      const tip = new THREE.Mesh(new THREE.ConeGeometry(.12, .34, 12), new THREE.MeshBasicMaterial({ color: G.ARCH.LK[l.k], transparent: true, opacity: 0 })); tip.renderOrder = 6; linkG.add(tip);
      return { ...l, m, mat, curve, tip, len };
    });
    // ---------- 遗址点 ----------
    const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.28, 'rgba(255,255,255,1)'); gr.addColorStop(.36, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
    const KC = { pal: '#ff9fb2', neo: '#8ff0b4', city: '#ffd27a' };
    M.sites = G.ARCH.S.map(s => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: KC[s.k], transparent: true, depthWrite: false, depthTest: false, sizeAttenuation: false, opacity: 0 })); m.position.set(X(s.lon), .002, Z(s.lat)); m.renderOrder = 10; sc.add(m); return { ...s, m, a: 0 }; });
    M.KC = KC;

    M.load = async (sel) => {
      const tasks = [ld('cn', 'img/cn_L6.jpg'), ld('east', 'img/east_L7.jpg'), ld('mask', 'img/lgm_mask.png'), ld('world', 'img/world_L3.jpg')];
      await Promise.all(tasks);
      world.map = texs.world; world.color.set(0xd8d8d8); world.needsUpdate = true;
      M.worldMesh = plane(-180, 180, -90, 90, world, -.02); M.worldMesh.renderOrder = -20;
      baseMat.uniforms.tA.value = texs.cn; baseMat.uniforms.tM.value = texs.mask; baseMat.uniforms.tE.value = texs.east; plane(67.5, 139.5, 13.5, 54, baseMat, 0).renderOrder = -10;
      const sj = await fetch(base + 'sites/sites.json').then(r => r.json());
      const want = sel || G.ARCH.S.filter(s => s.cl).map(s => s.cl);
      await Promise.all(sj.sites.filter(q => want.includes(q.nm)).map(async q => {
        const file = (G.ARCH.IMG && G.ARCH.IMG[q.nm]) || q.nm; const t = await ld('cl_' + q.nm, 'sites/' + file + '.jpg'); if (!t) return;
        const [lo0, la0] = merc2ll(q.x0, q.y0, q.z), [lo1, la1] = merc2ll(q.x0 + q.N, q.y0 + q.N, q.z);
        // 墨卡托小窗口：纬度方向近似线性
        const mat = closeMat(); mat.uniforms.tA.value = t; const m = plane(lo0, lo1, la1, la0, mat, .002); m.renderOrder = 2; m.visible = false;
        M.close[q.nm] = { m, mat, lon: (lo0 + lo1) / 2, lat: (la0 + la1) / 2, w: lo1 - lo0 };
      }));
    };
    // ---------- 相机 ----------
    M.view = { lon: 108, lat: 34, d: 40, tilt: 38, head: 0 };
    M.setView = v => { Object.assign(M.view, v); const { lon, lat, d, tilt, head } = M.view, t = tilt * Math.PI / 180, h = head * Math.PI / 180, tg = new THREE.Vector3(X(lon), 0, Z(lat));
      cam.position.set(tg.x + d * Math.sin(t) * Math.sin(h), d * Math.cos(t), tg.z + d * Math.sin(t) * Math.cos(h)); cam.up.set(0, 1, 0); cam.lookAt(tg); cam.near = d * .01; cam.far = d * 20; cam.updateProjectionMatrix(); };
    M.resize = (w, h) => { r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); M.W = w; M.H = h; };
    M.project = (lon, lat, h = .002) => { const v = M.ll(lon, lat, h).project(cam); return [(v.x + 1) / 2 * M.W, (1 - v.y) / 2 * M.H, v.z < 1 && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.2]; };
    // ---------- 按年份更新 ----------
    // st: { year, t(秒), sites: 'auto' | Set(ids) | null, cults: true/false/Set(names), links: true/false/Set(kinds), close: {nm: a}, focus: id }
    M.update = st => {
      const y = st.year, tm = st.t || 0;
      U.uLGM.value = st.lgm || 0; U.uDim.value = st.dim || 0; if (M.worldMesh) M.worldMesh.visible = M.view.d > 42 || Math.abs(M.view.lon - 103.5) > 30 || Math.abs(M.view.lat - 33.7) > 16;
      M.cults.forEach(c => { const on = st.cults === true || (st.cults instanceof Set && st.cults.has(c.n)); const span = c.t1 - c.t0, fade = Math.max(150, span * .12);
        const a = on ? ss((y - c.t0 + fade) / fade) * ss((c.t1 + fade - y) / fade) : 0; c.m.visible = false; c.a = a; });
      { const key = M.cults.map(c => c.a > .003 ? Math.round(c.a * 16) : 0).join(); if (key !== M._ck) { M._ck = key; const g = cultCv.getContext('2d'); g.clearRect(0, 0, cultCv.width, cultCv.height);
        M.cults.forEach(c => { if (c.a <= .003) return; const col = new THREE.Color(c.c), rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`, A = c.a;
          g.save(); g.translate((c.lon - 67.5) * CPD, (54 - c.lat) * CPD); g.rotate(-(c.a_ || 0) * Math.PI / 180); g.scale(c.rx * CPD, c.ry * CPD);
          const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1); [[0, .28], [.55, .28], [.84, .04], [.9, .7], [.95, .7], [1, 0]].forEach(([o, v]) => gr.addColorStop(o, `rgba(${rgb},${v * A})`));
          g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore(); });
        cultTex.needsUpdate = true; } }
      const near = ss((M.view.d - .8) / 2.5);
      M.links.forEach(l => { const on = st.links === true || (st.links instanceof Set && (st.links.has(l.k) || st.links.has(l.n))); const span = l.t1 - l.t0, force = st.force && st.force.has(l.k);
        let p = on ? clamp((y - l.t0) / (span * .45 + 1)) : 0, a = on ? ss((y - l.t0 + 30) / 60) * ss((l.t1 + span * .25 - y) / (span * .25 + 30)) : 0;
        if (force) { p = 1; a = st.forceA ?? 1; } a *= near;
        l.mat.uniforms.uP.value = p; l.mat.uniforms.uA.value = a; l.mat.uniforms.uT.value = tm; l.m.visible = a > .003 && p > 0; l.a = a * (p > 0 ? 1 : 0);
        const q = l.curve.getPointAt(Math.min(.999, p)), q2 = l.curve.getPointAt(Math.min(1, p + .001)); l.tip.position.copy(q); l.tip.lookAt(q2); l.tip.rotateX(Math.PI / 2); l.tip.material.opacity = a * (p > 0 && p < 1 ? 1 : p >= 1 ? .9 : 0); l.tip.visible = l.m.visible; });
      const ps = (st.dot || 1) * .028;
      M.sites.forEach(s => { let a = 0;
        if (st.sites === 'auto') { const span = Math.max(1, s.t1 - s.t0), fade = Math.max(40, Math.min(3000, AGE(s.t0) * .06)); a = ss((y - s.t0 + fade) / fade); const after = ss((y - s.t1 - fade * 2) / (fade * 3)); a = a * (1 - after * .65); }
        else if (st.sites instanceof Set) a = st.sites.has(s.id) ? 1 : 0;
        if (st.focus && st.focus !== s.id) a *= .55;
        s.a = a; s.m.material.opacity = a; s.m.visible = a > .01; const k = st.focus === s.id ? 1.6 : 1; s.m.scale.set(ps * k, ps * k, 1); });
      Object.entries(M.close).forEach(([nm, c]) => { const a = (st.close && st.close[nm]) || 0; c.mat.uniforms.uA.value = a; c.m.visible = a > .003; });
      r.render(sc, cam);
    };
    return M;
  }
  G.GEO = { create, tPos, yearStr, AGE, KY, ss, clamp };
})(window);
