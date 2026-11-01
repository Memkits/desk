import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 2160, height: 2160 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('http://127.0.0.1:8194/we/v/cover/bg.html'); await p.waitForFunction('window.ready', null, { timeout: 180000 }); await p.waitForTimeout(500);
await p.screenshot({ path: 'bg.png' }); await b.close();
