import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const EPS = (process.env.EPS || '1,2,3,4,5').split(',');
for (const ep of EPS) for (const [r, w, h] of (ep === '0' ? [['16x9', 1920, 1080], ['4x3', 1200, 900]] : [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['9x16', 1080, 1920]])) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`http://127.0.0.1:8192/v/cover/cover.html?ep=${ep}`); await p.waitForFunction('window.ready', null, { timeout: 120000 }); await p.waitForTimeout(300);
  await p.screenshot({ path: ep === '0' ? `封面_合集_${r}.png` : `封面_第${ep}集_${r}.png` }); await p.close(); }
await b.close();
