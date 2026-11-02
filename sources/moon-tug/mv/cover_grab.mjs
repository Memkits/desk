import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.goto('http://127.0.0.1:8194/mt/mv.html'); await p.waitForFunction('window.ready', null, { timeout: 180000 });
await p.evaluate(() => { window.NOCAP = 1; window.NOLB = 1; });
for (const [n, bar] of [['tug', 11.8], ['ocean', 15.5], ['lead', 43], ['gal', 48.9]]) { await p.evaluate(x => seek(x * BAR), bar); await p.screenshot({ path: `cover/bg_${n}.png` }); }
await b.close();
