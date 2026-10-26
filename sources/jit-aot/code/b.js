// JS 版本：node b.js <case> <rounds>
// 每轮输出耗时（毫秒），最后一行输出校验和
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
let seed = 42; const rnd = () => (seed = (seed * 48271) % 2147483647);

const C = {};
C.nbody = () => {
  const PI = Math.PI, SM = 4 * PI * PI, DP = 365.24;
  const B = [[0, 0, 0, 0, 0, 0, SM],
    [4.84143144246472090e+00, -1.16032004402742839e+00, -1.03622044471123109e-01, 1.66007664274403694e-03 * DP, 7.69901118419740425e-03 * DP, -6.90460016972063023e-05 * DP, 9.54791938424326609e-04 * SM],
    [8.34336671824457987e+00, 4.12479856412430479e+00, -4.03523417114321381e-01, -2.76742510726862411e-03 * DP, 4.99852801234917238e-03 * DP, 2.30417297573763929e-05 * DP, 2.85885980666130812e-04 * SM],
    [1.28943695621391310e+01, -1.51111514016986312e+01, -2.23307578892655734e-01, 2.96460137564761618e-03 * DP, 2.37847173959480950e-03 * DP, -2.96589568540237556e-05 * DP, 4.36624404335156298e-05 * SM],
    [1.53796971148509165e+01, -2.59193146099879641e+01, 1.79258772950371181e-01, 2.68067772490389322e-03 * DP, 1.62824170038242295e-03 * DP, -9.51592254519715870e-05 * DP, 5.15138902046611451e-05 * SM]].map(b => ({ x: b[0], y: b[1], z: b[2], vx: b[3], vy: b[4], vz: b[5], m: b[6] }));
  const n = B.length, dt = 0.01;
  for (let s = 0; s < 1000000; s++) {
    for (let i = 0; i < n; i++) { const a = B[i]; for (let j = i + 1; j < n; j++) { const b = B[j]; const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z; const d2 = dx * dx + dy * dy + dz * dz; const mag = dt / (d2 * Math.sqrt(d2)); a.vx -= dx * b.m * mag; a.vy -= dy * b.m * mag; a.vz -= dz * b.m * mag; b.vx += dx * a.m * mag; b.vy += dy * a.m * mag; b.vz += dz * a.m * mag; } }
    for (const b of B) { b.x += dt * b.vx; b.y += dt * b.vy; b.z += dt * b.vz; }
  }
  return B[0].x + B[1].y;
};
const fib = n => (n < 2 ? n : fib(n - 1) + fib(n - 2));
C.fib = () => fib(32);
class Circle { constructor(r) { this.r = r; } area() { return 3.14159 * this.r * this.r; } }
class Square { constructor(r) { this.r = r; } area() { return this.r * this.r; } }
class Tri { constructor(r) { this.r = r; } area() { return 0.5 * this.r * this.r; } }
class Hex { constructor(r) { this.r = r; } area() { return 2.598 * this.r * this.r; } }
class Rect { constructor(r) { this.r = r; } area() { return 2 * this.r * this.r; } }
const mkShapes = k => { const K = [Circle, Square, Tri, Hex, Rect]; const a = []; for (let i = 0; i < 1000000; i++) a.push(new K[i % k]((i % 100) * 0.01)); return a; };
let MONO, POLY;
const sumArea = a => { let s = 0; for (let p = 0; p < 10; p++) for (let i = 0; i < a.length; i++) s += a[i].area(); return s; };
C.mono = () => sumArea(MONO || (MONO = mkShapes(1)));
C.poly = () => sumArea(POLY || (POLY = mkShapes(5)));
const mk = d => (d === 0 ? { l: null, r: null } : { l: mk(d - 1), r: mk(d - 1) });
const chk = t => (t.l === null ? 1 : 1 + chk(t.l) + chk(t.r));
C.trees = () => { let s = 0; for (let i = 0; i < 20; i++) s += chk(mk(14)); return s; };
let WORDS;
C.words = () => {
  if (!WORDS) { seed = 7; WORDS = []; for (let i = 0; i < 1000000; i++) WORDS.push('w' + (rnd() % 50000)); }
  const m = new Map(); for (const w of WORDS) m.set(w, (m.get(w) || 0) + 1);
  return m.size + m.get(WORDS[0]);
};
C.branchy = () => {
  seed = 1; let x = 0;
  for (let i = 0; i < 5000000; i++) {
    switch (rnd() & 7) { case 0: x += i; break; case 1: x ^= i; break; case 2: x = (x * 3) | 0; break; case 3: x -= i >> 1; break; case 4: x = (x + 7) | 0; break; case 5: x ^= x >>> 3; break; case 6: x = (x * 5 + 1) | 0; break; default: x = (x - 3) | 0; }
  }
  return x;
};
// 小型字节码解释器：计算 sum(i*i % 7) for i < 1e6
const PROG = [0, 0, 1, // PUSH 0 ; STORE acc(1)
  0, 0, 1, 1, // PUSH 0 ; STORE i(1)? 简化见下
];
C.interp = () => {
  // 指令: 0 LOAD_I,1 LOAD_ACC,2 MUL,3 MOD7,4 ADD,5 STORE_ACC,6 INC_I,7 JLT(target),8 HALT
  const code = [0, 0, 4, 3, 1, 4, 5, 6, 7, 0, 8];
  let pc = 0, sp = 0, i = 0, acc = 0; const st = new Int32Array(16); const N = 1000000;
  for (;;) {
    const op = code[pc++];
    switch (op) {
      case 0: st[sp++] = i; break;
      case 1: st[sp++] = acc; break;
      case 2: { const b = st[--sp], a = st[--sp]; st[sp++] = Math.imul(a, b); break; }
      case 3: st[sp - 1] = st[sp - 1] % 7; break;
      case 4: { const b = st[--sp], a = st[--sp]; st[sp++] = a + b; break; }
      case 5: acc = st[--sp]; break;
      case 6: i++; break;
      case 7: { const t = code[pc++]; if (i < N) pc = t; break; }
      case 8: return acc;
    }
  }
};
let MA, MB;
C.matmul = () => {
  const n = 256;
  if (!MA) { MA = new Float64Array(n * n); MB = new Float64Array(n * n); for (let i = 0; i < n * n; i++) { MA[i] = (i % 13) * 0.5; MB[i] = (i % 7) * 0.25; } }
  const Cm = new Float64Array(n * n);
  for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const a = MA[i * n + k]; for (let j = 0; j < n; j++) Cm[i * n + j] += a * MB[k * n + j]; }
  return Cm[n * n - 1] + Cm[1234];
};
let DATA;
const RULES = (process.env.RULES || '7,3,100;11,5,2000;13,0,50').split(';').map(r => r.split(',').map(Number));
C.rules_interp = () => {
  if (!DATA) { seed = 3; DATA = new Int32Array(2000000); for (let i = 0; i < DATA.length; i++) DATA[i] = rnd() % 100000; }
  let c = 0;
  for (let i = 0; i < DATA.length; i++) { const x = DATA[i]; let ok = true; for (let k = 0; k < RULES.length; k++) { const [a, b, t] = RULES[k]; if (!(x % a === b || x < t)) { ok = false; break; } } if (ok) c++; }
  return c;
};
let GEN;
C.rules_jit = () => {
  if (!DATA) { seed = 3; DATA = new Int32Array(2000000); for (let i = 0; i < DATA.length; i++) DATA[i] = rnd() % 100000; }
  if (!GEN) GEN = new Function('D', `let c=0;for(let i=0;i<D.length;i++){const x=D[i];if(${RULES.map(([a, b, t]) => `(x%${a}===${b}||x<${t})`).join('&&')})c++;}return c;`);
  return GEN(DATA);
};
C.hello = () => 0;

const [name, R = '10'] = (typeof process !== 'undefined' ? process.argv.slice(2) : []);
const f = C[name]; let res = 0; const out = [];
for (let r = 0; r < +R; r++) { const t0 = now(); res = f(); out.push((now() - t0).toFixed(2)); }
if (name !== 'hello') console.log(out.join(' ')); console.log('ck', String(res));
