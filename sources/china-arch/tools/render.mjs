// 逐帧渲染：node render.mjs <ep> [worker] [workers] [only-scene-id]
import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync, copyFileSync, unlinkSync, renameSync } from 'node:fs';
const [ep = '1', w = '0', W = '1', only = ''] = process.argv.slice(2);
const FPS = 30; mkdirSync(`out/e${ep}`, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-compositing'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('页面错误', String(e).slice(0, 200)));
await p.goto('http://127.0.0.1:8192/v/page.html?ep=' + ep); await p.waitForFunction('window.ready', null, { timeout: 120000 });
const TL = await p.evaluate('TL'); const cdp = await p.context().newCDPSession(p);
for (let i = 0; i < TL.scenes.length; i++) {
  const sc = TL.scenes[i]; if (only ? sc.id !== only : i % +W !== +w) continue;
  const f0 = i === 0 ? 0 : Math.round(sc.start * FPS), f1 = i === TL.scenes.length - 1 ? Math.round(TL.total * FPS) : Math.round((sc.start + sc.T) * FPS);
  const out = `out/e${ep}/${String(i).padStart(2, '0')}_${sc.id}.mp4`, sig = JSON.stringify([f0, f1, sc.beats.map(x => [x.s, x.d])]);
  if (!process.env.FORCE && existsSync(out + '.done') && readFileSync(out + '.done', 'utf8') === sig) continue;
  const tmp = `tmp_${ep}_${sc.id}.mp4`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+frag_keyframe+empty_moov', '-f', 'mp4', out + '.part'], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await p.evaluate(t => seek(t), f / FPS);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92, optimizeForSpeed: true });
    if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); renameSync(out + '.part', out);
  writeFileSync(out + '.done', sig);
  console.log(`${sc.id} ${f1 - f0} 帧 ${((f1 - f0) / ((Date.now() - t0) / 1000)).toFixed(1)} 帧/秒`);
}
await b.close();
