import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const ep of ['1', '2']) { await p.goto('file://' + process.cwd() + '/cover.html?ep=' + ep); await p.waitForFunction('window.done'); await p.screenshot({ path: `封面_${ep === '1' ? '上集' : '下集'}.png` }); }
await b.close();
