import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const ep of [1, 2]) { await p.goto('file://' + process.cwd() + '/cover.html?ep=' + ep); await p.waitForTimeout(300); await p.screenshot({ path: `封面_${['', '上集', '下集'][ep]}.png` }); }
await b.close();
