// 预览：node pv.mjs <ep> <scene[:beat[:frac]]>,... [out]  → 每个时刻一张图，并拼成联系表 pv/sheet.jpg
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const [ep = '1', specs = '', name = 'sheet'] = process.argv.slice(2);
mkdirSync('pv', { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME, args: ['--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + process.cwd() + '/index.html?ep=' + ep); await p.waitForFunction('window.ready');
const files = [];
const list = specs ? specs.split(',') : await p.evaluate(() => TL.scenes.flatMap(s => s.beats.map((_, i) => `${s.id}:${i}:.97`)));
for (const sp of list) {
  const [id, bi = '-1', fr = '.6'] = sp.split(':');
  const t = await p.evaluate(([id, bi, fr]) => sceneAt(id, +fr, +bi), [id, bi, fr]);
  // 从场景起点逐步推进到 t，确保 tick 类效果状态正确
  await p.evaluate(t => seek(t), t);
  const f = `pv/${name}_${id}_${bi}_${fr}.png`; await p.screenshot({ path: f }); files.push(f);
}
await b.close();
if (errs.length) console.log('页面错误：\n' + [...new Set(errs)].slice(0, 8).join('\n'));
const cols = files.length > 4 ? 3 : 2;
execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[2:];c=${cols};W,H=640,360
im=Image.new('RGB',(W*c,H*((len(fs)+c-1)//c)),(255,255,255))
for i,f in enumerate(fs): im.paste(Image.open(f).convert('RGB').resize((W,H)),((i%c)*W,(i//c)*H))
im.save(sys.argv[1],quality=85)`, `pv/${name}.jpg`, ...files]);
console.log(`pv/${name}.jpg`, files.length);
