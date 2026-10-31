import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'node:fs';
const ep = process.argv[2] || '1';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('http://127.0.0.1:8192/v/page.html?ep=' + ep); await p.waitForFunction('window.ready', null, { timeout: 120000 });
writeFileSync(`cues_e${ep}.json`, JSON.stringify(await p.evaluate('allCues()')));
await b.close();
