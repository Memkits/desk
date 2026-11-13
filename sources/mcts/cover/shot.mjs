import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [n, w, h] of [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['3x4', 1080, 1440]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto('http://127.0.0.1:8201/cover/cover.html'); await p.waitForFunction('window.ready');
  await p.screenshot({ path: `/home/user/mc/final/封面_${n}.png` }); await p.close(); }
await b.close();
