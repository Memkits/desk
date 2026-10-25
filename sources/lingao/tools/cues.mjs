import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ep = process.argv[2] || '1';
const b = await chromium.launch({ executablePath: process.env.CHROME });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + process.cwd() + '/index.html?ep=' + ep); await p.waitForFunction('window.ready');
writeFileSync(`cues_e${ep}.json`, JSON.stringify(await p.evaluate('allCues()')));
await b.close();
