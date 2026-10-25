import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const ep of [1, 2, 3]) { await p.goto('file://' + process.cwd() + '/cover.html?ep=' + ep); await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: `封面_${['', '上集', '中集', '下集'][ep]}.png` }); }
await b.close();
