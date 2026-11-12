import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'node:fs';
const [key, it, n] = process.argv.slice(2);
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
const p = await br.newPage(); await p.goto('http://127.0.0.1:8198/hyperbolic-go/games.html');
const r = await p.evaluate(([k, it, n]) => { const game = G[k], out = []; for (let gi = 0; gi < n; gi++) { const s = game.init(), mv = [], sc = []; while (!game.over(s)) { const m = bestN(game, s, it); game.play(s, m); mv.push(m); const q = game.score(s); sc.push([q[0], q[1]]); } out.push({ mv, sc, res: game.result(s) }); } return out; }, [key, +it, +n]);
writeFileSync(`rec_${key}.json`, JSON.stringify(r));
r.forEach((q, i) => { let big = 0, at = -1, leads = 0, pl = 0; q.sc.forEach(([a, b], j) => { if (j) { const drop = (q.sc[j - 1][0] + q.sc[j - 1][1]) - (a + b); if (drop > big) { big = drop; at = j; } } const l = Math.sign(a - b); if (l && pl && l !== pl) leads++; if (l) pl = l; }); console.log(key, i, 'len', q.mv.length, 'final', q.sc.at(-1).join(':'), 'res', q.res, 'bigdrop', big, '@', at, 'leadchg', leads); });
await br.close();
