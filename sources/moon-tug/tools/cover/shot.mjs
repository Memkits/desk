import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [r, w, h] of [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['9x16', 1080, 1920]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto('http://127.0.0.1:8194/we/v/cover/cover.html'); await p.waitForFunction('window.ready'); await p.waitForTimeout(300);
  await p.screenshot({ path: `封面_${r}.png` }); await p.close(); }
await b.close();
