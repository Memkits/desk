// node pv.mjs <ep> scene:beat:frac ...   → pv/<scene>_<beat>_<frac>.jpg
import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const [ep, ...items] = process.argv.slice(2); mkdirSync('pv', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERR', String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error' && !/Failed to load/.test(m.text())) console.log('ERR', m.text().slice(0, 200)); });
await p.goto('http://127.0.0.1:8192/v/page.html?ep=' + ep); await p.waitForFunction('window.ready', null, { timeout: 180000 });
for (const it of items) { const [id, bt, fr] = it.split(':'); const t = await p.evaluate(([id, bt, fr]) => sceneAt(id, +fr, +bt), [id, bt, fr]);
  await p.evaluate(t => seek(t), t); await p.evaluate(t => seek(t), t + 1 / 24);
  await p.screenshot({ path: `pv/${id}_${bt}_${fr}.jpg`, type: 'jpeg', quality: 80 }); }
await b.close();
