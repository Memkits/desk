// 三维世界：一个常驻 WebGL 画布，每个场景往里加一组物体；seek 之后统一渲染一次。
const GM = 3.986004e14, RE = 6.378137e6, W = 2 * Math.PI / 86164.1, RG = Math.cbrt(GM / W / W), KM = 1e-6;
const phi = (r, w = W) => GM * (1 / RE - 1 / r) - w * w * (r * r - RE * RE) / 2;
const fmt = (x, d = 0) => x.toLocaleString('zh-CN', { maximumFractionDigits: d, minimumFractionDigits: d });
const sci = x => { if (x < 1e4) return fmt(x, x < 10 ? 1 : 0); const e = Math.floor(Math.log10(x)); return (x / 10 ** e).toFixed(1) + ' × 10<sup>' + e + '</sup>'; };
const ss = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a, b, u) => a + (b - a) * u;
function kv(keys, t) { if (!Array.isArray(keys)) return keys; if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const [t0, a] = keys[i - 1], [t1, b] = keys[i], u = ss((t - t0) / (t1 - t0)); return Array.isArray(a) ? a.map((v, k) => v + (b[k] - v) * u) : typeof a === 'number' ? a + (b - a) * u : a; }
  return keys[keys.length - 1][1]; }
const W3 = (() => {
  const cv = document.getElementById('gl');
  const r = new THREE.WebGLRenderer({ canvas: cv, antialias: false, preserveDrawingBuffer: true });
  r.setPixelRatio(.8); r.setSize(1920, 1080, false); r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = .95;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 16 / 9, .01, 6000);
  scene.add(new THREE.AmbientLight(0x6a7590, .8)); const sun = new THREE.DirectionalLight(0xfff4e6, 2.0); sun.position.set(40, 18, 25); scene.add(sun);
  const fill = new THREE.DirectionalLight(0x6080ff, .35); fill.position.set(-30, -5, -20); scene.add(fill);
  // 简单环境贴图：上亮下暗的天空 + 一个“太阳”，让金属有反光
  { const es = new THREE.Scene(), sg = new THREE.SphereGeometry(10, 32, 16), cols = [], pa = sg.attributes.position;
    for (let i = 0; i < pa.count; i++) { const yy = pa.getY(i) / 10, c = new THREE.Color(0x0a0f1c).lerp(new THREE.Color(0x8fa6c8), Math.pow(Math.max(0, yy), .6)); if (yy < 0) c.setRGB(.04, .05, .07); cols.push(c.r, c.g, c.b); }
    sg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); es.add(new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    const s = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); s.material.color.setScalar(6); s.position.set(5, 6, 4); es.add(s);
    scene.environment = new THREE.PMREMGenerator(r).fromScene(es, .02).texture; }
  // 星空（固定随机数，逐帧一致）
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  { const n = 3000, P = new Float32Array(n * 3), C = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, t = rnd() * 6.283, R = 3000; P[i * 3] = R * Math.sqrt(1 - u * u) * Math.cos(t); P[i * 3 + 1] = R * u; P[i * 3 + 2] = R * Math.sqrt(1 - u * u) * Math.sin(t); const b = .35 + rnd() * .65; C[i * 3] = C[i * 3 + 1] = C[i * 3 + 2] = b; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(C, 3));
    var stars = new THREE.Points(g, new THREE.PointsMaterial({ vertexColors: true, size: 2.2, sizeAttenuation: false })); scene.add(stars); }
  const earthTex = new THREE.TextureLoader().load('earth.jpg'); earthTex.encoding = THREE.sRGBEncoding; earthTex.anisotropy = 4;
  const earthGeo = new THREE.SphereGeometry(RE * KM, 128, 96);
  const earth = () => { const m = new THREE.Mesh(earthGeo, new THREE.MeshPhongMaterial({ map: earthTex, shininess: 20, specular: 0x05070a }));
    const atm = new THREE.Mesh(new THREE.SphereGeometry(RE * KM * 1.018, 96, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 3.); gl_FragColor = vec4(vec3(.35,.6,1.)*f*1.4, f); }' }));
    m.add(atm); m.userData.keep = true; return m; };
  // 模型（已上色的 GLB）
  const MODELS = {};
  const loadModel = name => fetch('../space-elevator/glb/c_' + name + '.glb').then(r => r.arrayBuffer()).then(b => {
    const dv = new DataView(b), n = dv.getUint32(12, true), j = JSON.parse(new TextDecoder().decode(new Uint8Array(b, 20, n))), bin = 20 + n + 8;
    const acc = i => { const a = j.accessors[i], v = j.bufferViews[a.bufferView], o = bin + (v.byteOffset || 0), k = { SCALAR: 1, VEC3: 3, VEC4: 4 }[a.type];
      return a.componentType === 5126 ? new Float32Array(b.slice(o, o + a.count * 4 * k)) : a.componentType === 5121 ? new Uint8Array(b.slice(o, o + a.count * k)) : new Uint32Array(b.slice(o, o + a.count * 4)); };
    const pr = j.meshes[0].primitives[0], g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(acc(pr.attributes.POSITION), 3)); g.setIndex(new THREE.BufferAttribute(acc(pr.indices), 1));
    const u = acc(pr.attributes.COLOR_0), nv = u.length / 4, f = new Float32Array(nv * 3); for (let i = 0; i < nv; i++) for (let k = 0; k < 3; k++) f[i * 3 + k] = Math.pow(u[i * 4 + k] / 255, 2.2);
    g.setAttribute('color', new THREE.BufferAttribute(f, 3)); g.computeVertexNormals(); g.computeBoundingBox(); g.userData.keep = true; MODELS[name] = g; });
  const modelMat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: .35, roughness: .5, envMapIntensity: .9 });
  // 放一个模型：按高度 h 或宽度 w 缩放，水平居中，底部在 y
  const model = (name, o = {}) => { const g = MODELS[name], bb = g.boundingBox, sz = new THREE.Vector3(); bb.getSize(sz);
    const s = o.h ? o.h / sz.y : o.w / Math.max(sz.x, sz.z), m = new THREE.Mesh(g, modelMat); m.scale.setScalar(s);
    m.position.set(-(bb.min.x + bb.max.x) / 2 * s, -bb.min.y * s, -(bb.min.z + bb.max.z) / 2 * s);
    const piv = new THREE.Group(); piv.add(m); piv.position.set(o.x || 0, o.y || 0, o.z || 0); if (o.ry) piv.rotation.y = o.ry; piv.userData.size = sz.clone().multiplyScalar(s); return piv; };
  const ready = Promise.all(['climber', 'sea_platform', 'geo_station', 'laser_station'].map(loadModel)).then(() => new Promise(res => { if (earthTex.image && earthTex.image.complete) res(); else earthTex.onUpdate = res; setTimeout(res, 3000); }));
  // 标签：三维点投影到屏幕
  let LABS = [], ov = document.getElementById('labs');
  const v3 = new THREE.Vector3();
  const label = (html, pos, cls = '') => { const d = document.createElement('div'); d.className = 'lab3 ' + cls; d.innerHTML = html; ov.appendChild(d); const L = { d, pos, a: 1 }; LABS.push(L); return L; };
  const clearLabels = () => { LABS.forEach(L => L.d.remove()); LABS = []; };
  const placeLabels = () => LABS.forEach(L => { const p = typeof L.pos === 'function' ? L.pos() : L.pos.isObject3D ? L.pos.getWorldPosition(v3) : L.pos; if (!p) { L.d.style.display = 'none'; return; }
    v3.copy(p).project(cam); const on = L.a > .01 && v3.z < 1 && Math.abs(v3.x) < 1.1 && Math.abs(v3.y) < 1.1; L.d.style.display = on ? '' : 'none';
    if (on) { L.d.style.transform = `translate(${((v3.x + 1) / 2 * 1920).toFixed(1)}px,${((1 - v3.y) / 2 * 1080).toFixed(1)}px) translate(${L.dx ?? -50}%,-50%)`; L.d.style.opacity = L.a; } });
  let groups = [];
  const group = () => { const g = new THREE.Group(); scene.add(g); groups.push(g); return g; };
  const reset = () => { groups.forEach(g => { scene.remove(g); g.traverse(o => { if (o.geometry && !o.geometry.userData.keep && o.geometry !== earthGeo) o.geometry.dispose(); }); }); groups = []; clearLabels(); stars.visible = true; scene.fog = null; };
  const setCam = a => { cam.position.set(a[0], a[1], a[2]); cam.lookAt(a[3], a[4], a[5]); if (a[6]) { cam.fov = a[6]; cam.updateProjectionMatrix(); } else if (cam.fov !== 40) { cam.fov = 40; cam.updateProjectionMatrix(); } };
  const render = () => { r.render(scene, cam); placeLabels(); };
  return { r, scene, cam, sun, stars, earth, earthTex, model, MODELS, ready, label, group, reset, setCam, render };
})();
// 小工具
const tube = (a, b, rad, mat, seg = 6) => { const d = new THREE.Vector3().subVectors(b, a), m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 1, seg, 1, true), mat); m.scale.y = d.length(); m.position.copy(a).addScaledVector(d, .5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
const setTube = (m, a, b) => { const d = new THREE.Vector3().subVectors(b, a); m.scale.y = Math.max(1e-4, d.length()); m.position.copy(a).addScaledVector(d, .5); if (d.lengthSq() > 0) m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); };
const basic = (c, op = 1) => new THREE.MeshBasicMaterial({ color: c, transparent: op < 1, opacity: op, depthWrite: op >= 1 });
const ringLine = (r, col, op = .7, dash = 0, y = 0) => { const p = []; for (let i = 0; i <= 360; i++) { const a = i / 360 * Math.PI * 2; p.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a))); }
  const g = new THREE.BufferGeometry().setFromPoints(p), l = dash ? new THREE.Line(g, new THREE.LineDashedMaterial({ color: col, transparent: true, opacity: op, dashSize: dash, gapSize: dash * .7 })) : new THREE.Line(g, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op })); if (dash) l.computeLineDistances(); return l; };
const UP = 0xffd27a, DOWN = 0x8fc8ff;
const RIB = [[-1, -1, 'up'], [1, -1, 'down'], [1, 1, 'up'], [-1, 1, 'down']];
// 赤道上带子底端所在的经度（东太平洋，厄瓜多尔以西）
const LON0 = -95 * Math.PI / 180, DIR0 = new THREE.Vector3(Math.cos(LON0), 0, -Math.sin(LON0));
