import { chromium } from '/home/claude/mx/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) console.log('CERR', m.text().slice(0, 300)); });
await p.goto('http://127.0.0.1:8194/nk/' + (process.env.PAGE || 'mv.html')); await p.waitForFunction('window.ready', null, { timeout: 180000 });
for (const sec of process.argv.slice(2)) { const t0 = Date.now(); await p.evaluate(x => seek(x), +sec); console.log(sec, Date.now() - t0, 'ms'); await p.screenshot({ path: `pv/s${sec}.jpg`, type: 'jpeg', quality: 70 }); }
await b.close();
