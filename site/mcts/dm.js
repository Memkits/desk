// 预先跑好的真实数据（页面加载时由 mcts.js 计算，固定随机种子，每次结果相同）。
const DM = (() => {
  const D = {};
  // 1) 被随机模拟骗的局面：蓝叉在 3，橙圈在 8，轮到蓝方。真正能赢的是 6，随机模拟推荐 4。
  D.A = [0, 0, 0, 1, 0, 0, 0, 0, 2];
  D.Amoves = MC.moves(D.A);
  D.Amm = D.Amoves.map(m => { const b = D.A.slice(); b[m] = 1; return MC.minimax(b); });
  // 每个空格各随机下 1000 盘：记录前 k 盘的平均分
  D.Arand = D.Amoves.map((m, j) => { const b = D.A.slice(); b[m] = 1; const R = MC.rng(101 + j), cum = [0]; const games = []; let s = 0;
    for (let i = 0; i < 1000; i++) { const p = MC.playout(b, R); s += p.w === 1 ? 1 : p.w === 3 ? .5 : 0; cum.push(s); if (i < 6) games.push(p); }
    return { m, cum, games, avg: s / 1000 }; });
  // 树搜索：前 10000 轮，按对数间隔记录每个第一步的盘数和平均分
  const TA = MC.TTT(D.A, { seed: 1 }); D.Achk = []; const CK = []; for (let e = 1; e <= 4.0001; e += .05) CK.push(Math.round(10 ** e));
  CK.forEach(k => { TA.run(k - TA.log.length); const kids = TA.nodes[0].kids.map(i => TA.nodes[i]); const row = {}; kids.forEach(c => row[c.mv] = [c.n, c.w / c.n]); D.Achk.push({ k, row }); });
  D.TA = TA;
  // 左下角(6)下面橙方的应对：100 轮和 10000 轮时
  const n6 = TA.nodes[0].kids.map(i => TA.nodes[i]).find(c => c.mv === 6);
  const n60 = n6.kids.map(i => TA.nodes[i]).find(c => c.mv === 0);
  D.A6 = [100, 1000].map(k => { const s = MC.statsAt(TA, k), f = id => ({ mv: TA.nodes[id].mv, n: s.n[id] }); return { k, kids: n6.kids.map(f), x: n60.kids.map(f) }; });
  // 2) 四步循环的演示局面：蓝 0、2，橙 1、4，轮到蓝方（必须堵 7）
  D.B = [1, 2, 1, 0, 2, 0, 0, 0, 0];
  const TB = MC.TTT(D.B, { seed: 1 }); TB.run(400); D.TB = TB;
  // 慢动作那一轮：第一次出现“根→孩子→孙子→新节点”且模拟不止一步的轮
  D.slow = TB.log.findIndex((L, i) => i >= 9 && L.path.length === 4 && L.seq.length >= 2); // 下标 = 已完成的轮数
  // 3) 空棋盘 10000 轮：树的形状
  const TE = MC.TTT(new Array(9).fill(0), { seed: 11 }); TE.run(10000); D.TE = TE;
  D.Eck = [50, 100, 200, 400, 700, 1000, 2000, 4000, 7000, 10000].map(k => ({ k, ...MC.statsAt(TE, k) }));
  // 4) 极小化极大的小树：三个空格
  D.M = [1, 2, 1, 2, 2, 1, 0, 0, 0];
  // 5) 老虎机
  D.P = [.2, .5, .35, .7];
  D.run = { greedy: MC.bandit(D.P, 400, 'greedy', 5), eps: MC.bandit(D.P, 400, 'eps', 5), ucb: MC.bandit(D.P, 400, 'ucb', 5) };
  D.reg = {}; for (const a of ['greedy', 'eps', 'ucb']) { const acc = new Float64Array(201); for (let s = 0; s < 100; s++) MC.bandit(D.P, 10000, a, 1000 + s).forEach((h, i) => { if ((i + 1) % 50 === 0) acc[(i + 1) / 50] += h.reg; }); D.reg[a] = Array.from(acc, x => x / 100); } // 每 50 次一个点，共 10000 次
  // 6) 迷宫：每走一步前搜 1500 轮
  D.grid = ['#############', '#...........#', '#.....S.....#', '#...........#', '#..#######..#', '#..#.....#..#', '#..#..G..#..#', '#..##...##..#', '#...........#', '#############'];
  const Z = MC.Maze(D.grid); D.Z = Z; D.mz = []; let p = Z.S;
  for (let st = 0; st < 60 && p !== Z.G; st++) { const T = MC.MazeMCTS(Z, p, { seed: 400 + st, h: 60 }).run(1500); const heat = new Float64Array(Z.W * Z.H); T.nodes.forEach(n => heat[n.p] += n.n);
    const best = T.nodes[0].kids.map(i => T.nodes[i]).sort((a, b) => b.n - a.n)[0]; const walks = T.log.slice(0, 400).map(L => [...L.path.map(i => T.nodes[i].p), ...L.walk.slice(1)]);
    D.mz.push({ p, next: best.p, heat, walks: st === 0 ? walks : walks.slice(0, 40), T: st === 0 ? T : null, hits: T.log.filter(L => L.r > 0).length }); p = best.p; }
  D.mzEnd = p;
  return D;
})();
