// 预览：node pva.mjs ep scene:frac[,scene:frac...]  → pv/<scene>_<frac>.jpg
import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const [ep, list] = process.argv.slice(2); mkdirSync('pv', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CON', m.text().slice(0, 200)); });
await p.goto('http://127.0.0.1:8191/v/page.html?ep=' + ep); await p.waitForFunction('window.ready', null, { timeout: 60000 });
for (const it of list.split(',')) { const [id, fr, bt] = it.split(':'); const t0 = Date.now();
  const tt = await p.evaluate(([id, fr, bt]) => sceneAt(id, +(fr ?? .5), bt === undefined ? -1 : +bt), [id, fr, bt]);
  await p.evaluate(t => seek(t), tt); await p.screenshot({ path: `pv/${id}_${fr}${bt !== undefined ? '_b' + bt : ''}.jpg`, type: 'jpeg', quality: 80 }); console.log(id, fr, bt ?? '', tt.toFixed(1), Date.now() - t0, 'ms'); }
await b.close();
