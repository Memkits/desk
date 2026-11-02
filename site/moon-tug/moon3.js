// 真实感的月球 + 发动机喷流（three.js）。供两处使用：
//   MOON3.build(THREE, radius) → { group, set(o) }   放进主三维场景
//   MOON3.initSprite(renderer, texture) / MOON3.render(o) → 透明背景的离屏画面，给二维插画贴用
// 几何来自 feasibility.py：发动机在朝向地球的一面、离正中心 12.4° 的一圈；喷流沿当地竖直方向，扩散半角 5°；
// 发光 ∝ 密度²，可见部分约 20,000 km（11.5 个月球半径）。
window.MOON3 = (() => {
  const CANT = 12.4 * Math.PI / 180, PLUME = 5 * Math.PI / 180, NJ = 12, LEN_R = 11.5;
  const VS = `varying vec3 vN; varying vec3 vP; varying vec2 vUv; void main(){ vUv = uv; vN = normalize((modelMatrix * vec4(normal, 0.)).xyz); vec4 w = modelMatrix * vec4(position, 1.); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
  const MOON_FS = `uniform sampler2D map; uniform vec3 sun, earthDir, center; uniform float sunI, earthA, eng, hot, R; uniform vec3 spots[${NJ}]; varying vec3 vN; varying vec3 vP; varying vec2 vUv;
    void main(){ vec3 c = pow(texture2D(map, vUv).rgb, vec3(2.2)); vec3 n = normalize(vN);
      float mu = max(0., dot(n, sun)); vec3 col = c * (mu * 1.35 + .35 * mu / (mu + .6)) * sunI;           // 太阳：朗伯 + 一点 Lommel-Seeliger
      col += c * vec3(.6, .75, 1.) * max(0., dot(n, earthDir)) * earthA;                                        // 地照
      vec3 pl = vec3(0.); for (int k = 0; k < ${NJ}; k++) { vec3 d = spots[k] - vP; float dd = dot(d, d) / (R * R); pl += max(0., dot(n, normalize(d))) / (dd * 5. + .25); }
      col += c * vec3(.7, .95, .9) * pl * eng * .22;                                                           // 喷流照亮月面
      float nz = max(0., dot(n, earthDir)); col += vec3(.9, .22, .04) * pow(nz, 7.) * hot * .1 + vec3(.6, .12, .02) * pl * hot * .04;                 // 发动机一侧烧红的月面
      gl_FragColor = vec4(col, 1.); }`;
  const PLUME_VS = `attribute float s; varying float vS; varying vec3 vN; varying vec3 vV; void main(){ vS = s; vec4 w = modelMatrix * vec4(position, 1.); vN = normalize((modelMatrix * vec4(normal, 0.)).xyz); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`;
  const PLUME_FS = `uniform float k, t, seed; varying float vS; varying vec3 vN; varying vec3 vV;
    void main(){ float d = vS * ${LEN_R.toFixed(1)};                                    // 离喷口的距离，单位：月球半径
      float dens = exp(-d / 2.2) / pow(1. + d / .35, 2.);                                       // 沿视线的发光 ∝ n²·弦长 ≈ 1/d³
      float e = mix(1., 2.6, pow(1. - abs(dot(normalize(vN), normalize(vV))), 2.));  // 掠射时弦更长
      float fl = .97 + .03 * sin(t * 7. + seed + d * 9.);
      vec3 col = mix(vec3(.9, .95, 1.), vec3(.45, 1., .62), smoothstep(.25, 1.2, d)); col = mix(col, vec3(1., .42, .4), smoothstep(2.5, 7., d));
      float I = clamp(dens * e * k, 0., 1.);
      gl_FragColor = vec4(col * I, I); }`;
  const SPOT_FS = `uniform float k; varying vec2 vUv; varying vec3 vN; varying vec3 vP; void main(){ float r = length(vUv - .5) * 2.; float a = (pow(max(0., 1. - r), 3.5) + .35 * pow(max(0., 1. - r), 1.2)) * k; gl_FragColor = vec4(mix(vec3(.75, 1., .85), vec3(1., .98, .95), pow(max(0., 1. - r), 2.)) * a * 1.0, a); }`;
  function engines() { const out = []; for (let i = 0; i < NJ; i++) { const ph = i / NJ * Math.PI * 2 + .13; out.push(new THREE.Vector3(Math.sin(CANT) * Math.cos(ph), Math.sin(CANT) * Math.sin(ph), Math.cos(CANT))); } return out; }
  // 在 group 里搭月球：+z 朝向地球
  function build(THREE, R, tex) {
    const g = new THREE.Group(), dirs = engines();
    const mat = new THREE.ShaderMaterial({ uniforms: { map: { value: tex }, sun: { value: new THREE.Vector3(1, 0, 0) }, earthDir: { value: new THREE.Vector3(0, 0, 1) }, center: { value: new THREE.Vector3() }, sunI: { value: 1 }, earthA: { value: .05 }, eng: { value: 0 }, hot: { value: 0 }, R: { value: R }, spots: { value: dirs.map(d => d.clone().multiplyScalar(R * 1.2)) } }, vertexShader: VS, fragmentShader: MOON_FS });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(R, 160, 120), mat); moon.rotation.y = -Math.PI / 2; g.add(moon);
    const plumes = [], spots = [], bells = [];
    dirs.forEach((d, i) => {
      const L = LEN_R * R, r0 = R * .05, geo = new THREE.CylinderGeometry(r0 + L * Math.tan(PLUME), r0, L, 36, 24, true); geo.translate(0, L / 2, 0);
      const pos = geo.attributes.position, sArr = new Float32Array(pos.count); for (let v = 0; v < pos.count; v++) sArr[v] = pos.getY(v) / L; geo.setAttribute('s', new THREE.BufferAttribute(sArr, 1));
      // 喷流是一团体积：用三层嵌套的圆锥壳近似（外、中、内），这样顺着轴线看过去中心也是亮的，而不是一个空心的环
      let m = null;
      [[1, .55], [.55, .5], [.22, .45]].forEach(([rs, ks]) => {
        const gg = rs === 1 ? geo : (() => { const g2 = new THREE.CylinderGeometry((r0 + L * Math.tan(PLUME)) * rs, r0 * rs, L, 36, 24, true); g2.translate(0, L / 2, 0); const pp = g2.attributes.position, sa = new Float32Array(pp.count); for (let v = 0; v < pp.count; v++) sa[v] = pp.getY(v) / L; g2.setAttribute('s', new THREE.BufferAttribute(sa, 1)); return g2; })();
        const pm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, side: THREE.DoubleSide, uniforms: { k: { value: 0 }, t: { value: 0 }, seed: { value: i * 1.7 } }, vertexShader: PLUME_VS, fragmentShader: PLUME_FS });
        pm.userData.ks = ks; const mm = new THREE.Mesh(gg, pm); mm.position.copy(d).multiplyScalar(R * 1.06); mm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); g.add(mm); plumes.push(pm); if (!m) m = mm; });
      // 喷口：一个小碗 + 发光片
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(R * .05, R * .028, R * .06, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xdfffea, side: THREE.DoubleSide })); bell.position.copy(d).multiplyScalar(R * 1.0); bell.quaternion.copy(m.quaternion); g.add(bell); bells.push(bell);
      const sm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, uniforms: { k: { value: 0 } }, vertexShader: VS, fragmentShader: SPOT_FS });   // 喷口上方最密的一段等离子体：顺着轴线看是整幅画面里最亮的点
      const sp = new THREE.Mesh(new THREE.PlaneGeometry(R * .36, R * .36), sm); sp.renderOrder = 5; sp.position.copy(d).multiplyScalar(R * 1.06); sp.quaternion.copy(m.quaternion); sp.rotateX(-Math.PI / 2); g.add(sp); spots.push(sm); });
    const HAZE_FS = `uniform float k; varying vec2 vUv; varying vec3 vN; varying vec3 vP; void main(){ float r = length(vUv - .5) * 2.; float ring = exp(-pow((r - .42) / .3, 2.)); float a = (ring * .9 + .35 * pow(max(0., 1. - r), 1.5)) * k; gl_FragColor = vec4(vec3(.8, 1., .9) * a * .4, a * .4); }`;
    const hm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, uniforms: { k: { value: 0 } }, vertexShader: VS, fragmentShader: HAZE_FS });
    const haze = new THREE.Mesh(new THREE.PlaneGeometry(R * 1.1, R * 1.1), hm); haze.position.set(0, 0, R * 1.1); haze.renderOrder = 4; g.add(haze);
    const inv = new THREE.Quaternion(), tmp = new THREE.Vector3();
    const set = o => {
      if (o.sunWorld) { inv.copy(g.quaternion).invert(); mat.uniforms.sun.value.copy(o.sunWorld).normalize(); }
      if (o.sunI !== undefined) mat.uniforms.sunI.value = o.sunI;
      if (o.earthA !== undefined) mat.uniforms.earthA.value = o.earthA;
      if (o.hot !== undefined) mat.uniforms.hot.value = o.hot;
      if (o.eng !== undefined) { mat.uniforms.eng.value = typeof o.eng === 'function' ? 1 : o.eng; plumes.forEach((p, j) => { const i = Math.floor(j / 3), k = typeof o.eng === 'function' ? o.eng(i) : o.eng; p.uniforms.k.value = k * p.userData.ks; }); spots.forEach((sm, i) => sm.uniforms.k.value = Math.min(1, typeof o.eng === 'function' ? o.eng(i) : o.eng)); bells.forEach((b, i) => { const k = Math.min(1, typeof o.eng === 'function' ? o.eng(i) : o.eng); b.material.color.setRGB(.1 + .77 * k, .1 + .9 * k, .11 + .81 * k); }); hm.uniforms.k.value = Math.min(1, typeof o.eng === 'function' ? (o.eng(0) + o.eng(6)) / 2 : o.eng); }
      if (o.t !== undefined) plumes.forEach(p => p.uniforms.t.value = o.t);
      // 世界坐标下的喷口位置与地球方向
      g.updateMatrixWorld(true); mat.uniforms.earthDir.value.set(0, 0, 1).applyQuaternion(g.getWorldQuaternion(new THREE.Quaternion())); mat.uniforms.center.value.copy(g.getWorldPosition(tmp));
      dirs.forEach((d, i) => mat.uniforms.spots.value[i].copy(d).multiplyScalar(R * 1.2).applyMatrix4(g.matrixWorld));
    };
    return { group: g, set, moon };
  }
  // ---------- 离屏精灵 ----------
  let SR = null, S = null, M = null, cam = null;
  function initSprite(THREE, renderer, tex) {
    SR = renderer; S = new THREE.Scene(); M = build(THREE, 1, tex); S.add(M.group);
    S.add(new THREE.AmbientLight(0x404050, .5)); const dl = new THREE.DirectionalLight(0xffffff, 1.2); S.add(dl); S.userData.dl = dl;
    cam = new THREE.PerspectiveCamera(1, 16 / 9, .1, 2000); return M;
  }
  // o: i 相位角(°, 0 满月)；sa 屏幕上太阳方向的角度(rad, 0 = 右)；eng 发动机；sunI；earthA；hot；t；
  //    view: 可选 { pos:[x,y,z], look:[0,0,0], fov }（月面观测以外的视角）；rpx: 月球半径在 1080 高画布里的像素数（默认 180）
  function render(o = {}) {
    const i = (o.i ?? 90) * Math.PI / 180, sa = o.sa ?? 0, rpx = o.rpx ?? 180;
    const sun = new THREE.Vector3(Math.sin(i) * Math.cos(sa), -Math.sin(i) * Math.sin(sa), Math.cos(i));
    M.set({ sunWorld: sun, sunI: o.sunI ?? 1, earthA: o.earthA ?? .05, hot: o.hot ?? 0, eng: o.eng ?? 0, t: o.t ?? 0 });
    S.userData.dl.position.copy(sun).multiplyScalar(10);
    if (o.view) { cam.near = .1; cam.far = 2000; cam.position.set(...o.view.pos); cam.fov = o.view.fov || 40; cam.up.set(...(o.view.up || [0, 1, 0])); cam.lookAt(...(o.view.look || [0, 0, 0])); }
    else { cam.up.set(0, 1, 0); const D = 400; cam.position.set(0, 0, D); cam.fov = 2 * Math.atan(540 / rpx / D) * 180 / Math.PI; cam.lookAt(0, 0, 0); cam.near = D - 20; cam.far = D + 20; }   // 近远裁剪面收紧，否则喷口附近的贴片和月面会深度打架
    cam.updateProjectionMatrix();
    SR.setClearColor(0x000000, 0); SR.render(S, cam); SR.setClearColor(0x000000, 1);
    return SR.domElement;
  }
  // 把方向/点投影到最近一次渲染的画面上（像素，1920×1080）
  function project(p) { const v = new THREE.Vector3(...p).project(cam); return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080, v.z]; }
  return { build, initSprite, render, project, engines, CANT, PLUME, NJ, LEN_R, get _M() { return M; } };
})();
