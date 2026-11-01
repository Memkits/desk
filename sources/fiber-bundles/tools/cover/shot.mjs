import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const ep of ['1', '2']) for (const [r, w, h] of [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['9x16', 1080, 1920]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`http://127.0.0.1:8194/fbv/cover/cover.html?ep=${ep}`); await p.waitForFunction('window.ready', null, { timeout: 60000 }); await p.waitForTimeout(300);
  await p.screenshot({ path: `封面_第${ep}集_${r}.png` }); await p.close(); }
await b.close();
