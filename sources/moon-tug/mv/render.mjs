// node render.mjs <worker> <workers>
import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, renameSync } from 'node:fs';
const [w = '0', Wn = '1'] = process.argv.slice(2), FPS = 24; mkdirSync('out', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-compositing'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('http://127.0.0.1:8194/mt/mv.html'); await p.waitForFunction('window.ready', null, { timeout: 180000 });
const total = Math.round(await p.evaluate('TOTAL') * FPS), n = Math.ceil(total / +Wn), f0 = +w * n, f1 = Math.min(total, f0 + n);
const out = `out/chunk_${w}.mp4`, cdp = await p.context().newCDPSession(p);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), out + '.part.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = f0; f < f1; f++) { await p.evaluate(t => seek(t), f / FPS); const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93, optimizeForSpeed: true });
  if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if ((f - f0) % 240 === 0) console.log(w, f - f0, '/', f1 - f0, ((f - f0) / ((Date.now() - t0) / 1000 + 1e-3)).toFixed(1), 'fps'); }
ff.stdin.end(); await new Promise(r => ff.on('close', r)); renameSync(out + '.part.mp4', out); console.log('DONE', w); await b.close();
