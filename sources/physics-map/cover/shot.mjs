import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
const S = [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['3x4', 1080, 1440]];
for (let ep = 0; ep <= 5; ep++) for (const [n, w, h] of (ep ? S : [S[0]])) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(`http://127.0.0.1:8194/pmv/cover/cover.html?ep=${ep}`); await p.waitForFunction('window.ready');
  await p.screenshot({ path: `/home/user/pmv/cover/封面_${ep ? '第' + ep + '集' : '系列'}_${n}.png` }); await p.close(); }
await b.close();
