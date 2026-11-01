// 预览：node pv.mjs scene:frac[:beat] ...  → pv/<scene>_<n>.jpg
import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs'; mkdirSync('pv', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-compositing'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERR', String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text().slice(0, 200)); });
await p.goto('http://127.0.0.1:8194/se/v/page.html'); await p.waitForFunction('window.ready', null, { timeout: 120000 });
for (const a of process.argv.slice(2)) { const [id, fr, bt] = a.split(':'); const t = await p.evaluate(([id, fr, bt]) => sceneAt(id, +fr, bt === undefined ? -1 : +bt), [id, fr, bt]);
  const t0 = Date.now(); await p.evaluate(t => seek(t), t); await p.evaluate(t => seek(t), t); const ms = Date.now() - t0; await p.screenshot({ path: `pv/${id}_${bt ?? 'x'}_${fr}.jpg`, type: 'jpeg', quality: 70 }); console.log(a, t.toFixed(1), ms + 'ms'); }
await b.close();
