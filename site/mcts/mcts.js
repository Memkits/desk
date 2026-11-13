// 真实的蒙特卡洛树搜索（井字棋、迷宫、老虎机）。视频和互动网页共用；随机数可复现。
(function (root) {
  function rng(s) { s = s >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  // ---------- 井字棋 ----------
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  function winner(b) { for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]; return b.includes(0) ? 0 : 3; } // 1/2 胜，3 平，0 未完
  function moves(b) { const m = []; for (let i = 0; i < 9; i++) if (!b[i]) m.push(i); return m; }
  function toMove(b) { let x = 0, o = 0; for (const v of b) { if (v === 1) x++; else if (v === 2) o++; } return x === o ? 1 : 2; }
  function playout(b, R) { b = b.slice(); const seq = []; let w = winner(b); while (!w) { const m = moves(b), mv = m[Math.floor(R() * m.length)]; b[mv] = toMove(b); seq.push(mv); w = winner(b); } return { w, seq }; }
  // 节点：mv = 走到这里的那一步，pl = 走这一步的一方；w/n 站在 pl 的角度（胜 1，平 0.5）
  function TTT(board, o = {}) {
    const R = rng(o.seed || 7), c = o.c ?? Math.SQRT2;
    const nodes = [{ id: 0, par: -1, mv: -1, pl: 3 - toMove(board), b: board.slice(), kids: [], untried: moves(board), w: 0, n: 0, d: 0, born: 0 }];
    const log = [];
    function step() {
      const it = log.length + 1; let nd = nodes[0]; const path = [0];
      while (!nd.untried.length && nd.kids.length) { // 选择
        let best = -1, bv = -1e9; for (const k of nd.kids) { const ch = nodes[k], v = ch.w / ch.n + c * Math.sqrt(Math.log(nd.n) / ch.n); if (v > bv) { bv = v; best = k; } }
        nd = nodes[best]; path.push(best); }
      let exp = -1;
      if (nd.untried.length && !winner(nd.b)) { // 扩展
        const i = Math.floor(R() * nd.untried.length), mv = nd.untried.splice(i, 1)[0], b = nd.b.slice(), pl = toMove(nd.b); b[mv] = pl;
        const ch = { id: nodes.length, par: nd.id, mv, pl, b, kids: [], untried: winner(b) ? [] : moves(b), w: 0, n: 0, d: nd.d + 1, born: it };
        nodes.push(ch); nd.kids.push(ch.id); nd = ch; path.push(ch.id); exp = ch.id; }
      const { w, seq } = playout(nd.b, R); // 模拟
      for (const id of path) { const x = nodes[id]; x.n++; x.w += w === 3 ? .5 : w === x.pl ? 1 : 0; } // 回溯
      log.push({ path, exp, seq, w });
    }
    return { nodes, log, step, run(k) { for (let i = 0; i < k; i++) step(); return this; } };
  }
  // 某一时刻（前 k 轮）的统计：由日志重算
  function statsAt(T, k) { const n = new Float64Array(T.nodes.length), w = new Float64Array(T.nodes.length);
    for (let i = 0; i < k && i < T.log.length; i++) { const L = T.log[i]; for (const id of L.path) { n[id]++; const pl = T.nodes[id].pl; w[id] += L.w === 3 ? .5 : L.w === pl ? 1 : 0; } } return { n, w }; }
  // 完整的极小化极大（井字棋可以算完）
  const MM = new Map();
  function minimax(b) { const k = b.join(''); if (MM.has(k)) return MM.get(k); const w = winner(b); let v;
    if (w) v = w === 3 ? 0 : w === 1 ? 1 : -1; else { const p = toMove(b); v = p === 1 ? -2 : 2; for (const m of moves(b)) { b[m] = p; const x = minimax(b); b[m] = 0; v = p === 1 ? Math.max(v, x) : Math.min(v, x); } }
    MM.set(k, v); return v; }
  function countGames(b) { const w = winner(b); if (w) return 1; let s = 0; const p = toMove(b); for (const m of moves(b)) { b[m] = p; s += countGames(b); b[m] = 0; } return s; }
  // ---------- 老虎机 ----------
  function bandit(P, T, algo, seed, eps = .1) { const R = rng(seed), K = P.length, n = new Array(K).fill(0), s = new Array(K).fill(0), hist = [], best = Math.max(...P); let reg = 0;
    for (let t = 1; t <= T; t++) { let a;
      if (t <= K) a = t - 1;
      else if (algo === 'greedy') a = argmax(n.map((x, i) => s[i] / x));
      else if (algo === 'eps') a = R() < eps ? Math.floor(R() * K) : argmax(n.map((x, i) => s[i] / x));
      else a = argmax(n.map((x, i) => s[i] / x + Math.sqrt(2 * Math.log(t) / x)));
      const r = R() < P[a] ? 1 : 0; n[a]++; s[a] += r; reg += best - P[a]; hist.push({ a, r, reg, n: n.slice(), s: s.slice() }); }
    return hist; }
  function argmax(v) { let b = 0; for (let i = 1; i < v.length; i++) if (v[i] > v[b]) b = i; return b; }
  // ---------- 迷宫（一个人的规划）----------
  // grid: 字符串数组，'#' 墙，'S' 起点，'G' 终点。奖励：H 步内到终点得 1 - 0.5·步数/H，否则 0。
  function Maze(grid, o = {}) { const H = grid.length, W = grid[0].length; let S, G; const wall = [];
    grid.forEach((r, y) => [...r].forEach((ch, x) => { wall.push(ch === '#'); if (ch === 'S') S = y * W + x; if (ch === 'G') G = y * W + x; }));
    const D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const nb = p => { const x = p % W, y = (p / W) | 0, r = []; for (const [dx, dy] of D) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && !wall[Y * W + X]) r.push(Y * W + X); } return r; };
    return { W, H, S, G, wall, nb }; }
  function MazeMCTS(M, start, o = {}) { const R = rng(o.seed || 3), Hz = o.h || 40, c = o.c ?? .7;
    const nodes = [{ id: 0, par: -1, p: start, d: 0, kids: [], untried: M.nb(start), w: 0, n: 0 }], log = [];
    function reward(steps) { return 1 - .5 * steps / Hz; }
    function step() { let nd = nodes[0]; const path = [0];
      while (nd.p !== M.G && !nd.untried.length && nd.kids.length) { let b = -1, bv = -1e9; for (const k of nd.kids) { const ch = nodes[k], v = ch.w / ch.n + c * Math.sqrt(Math.log(nd.n) / ch.n); if (v > bv) { bv = v; b = k; } } nd = nodes[b]; path.push(b); }
      if (nd.p !== M.G && nd.untried.length && nd.d < Hz) { const i = Math.floor(R() * nd.untried.length), p = nd.untried.splice(i, 1)[0]; const ch = { id: nodes.length, par: nd.id, p, d: nd.d + 1, kids: [], untried: M.nb(p), w: 0, n: 0 }; nodes.push(ch); nd.kids.push(ch.id); nd = ch; path.push(ch.id); }
      let p = nd.p, d = nd.d; const walk = [p]; while (p !== M.G && d < Hz) { const nn = M.nb(p); p = nn[Math.floor(R() * nn.length)]; d++; walk.push(p); }
      const r = p === M.G ? reward(d) : 0; for (const id of path) { nodes[id].n++; nodes[id].w += r; } log.push({ path, walk, r }); }
    return { nodes, log, step, run(k) { for (let i = 0; i < k; i++) step(); return this; } }; }
  const API = { rng, LINES, winner, moves, toMove, playout, TTT, statsAt, minimax, countGames, bandit, Maze, MazeMCTS };
  if (typeof module !== 'undefined') module.exports = API; else Object.assign(root, { MC: API });
})(this);
