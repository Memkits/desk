import { chromium } from '/home/claude/mx/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.goto('http://127.0.0.1:8194/nk/mv.html'); await p.waitForFunction('window.ready', null, { timeout: 180000 });
for (const [name, W, H] of [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['3x4', 1080, 1440]]) {
  const url = await p.evaluate(([W, H]) => {
    const V = H > W, R43 = !V && W / H < 1.5;
    // 背景：第 1 场末尾的那一帧——层剥落后的夜桥 + 锚点灯 + 守夜人
    window.NOCAP = true; seek(23.5); window.NOCAP = false;
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const s = Math.max(W / 1920, H / 1080) * (V ? 1.15 : 1), dw = 1920 * s, dh = 1080 * s; g.drawImage(document.getElementById('out'), (W - dw) / 2 + (V ? -dw * .08 : 0), (H - dh) / 2, dw, dh);
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(0,0,0,.25)'); gr.addColorStop(.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const fs = V ? 170 : R43 ? 140 : 160, tx = V ? W * .16 : W * .11, ty = V ? H * .14 : H * .2, gap = fs * 1.14;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 28;
    const gold = g.createLinearGradient(tx, ty, tx, ty + gap * 3); gold.addColorStop(0, '#fff8ea'); gold.addColorStop(.6, '#efe3c5'); gold.addColorStop(1, '#cfb67a');
    g.font = `700 ${fs}px "Noto Serif CJK SC"`; g.fillStyle = gold; g.lineWidth = fs * .03; g.strokeStyle = 'rgba(20,30,40,.9)';
    [...'守夜人'].forEach((ch, i) => { g.strokeText(ch, tx, ty + i * gap); g.fillText(ch, tx, ty + i * gap); });
    g.shadowBlur = 0; const lx = tx + fs * .7; g.fillStyle = 'rgba(240,230,205,.75)'; g.fillRect(lx, ty - fs * .5, 2, gap * 2 + fs);
    g.save(); g.translate(lx + 28, ty - fs * .5); g.font = `500 ${fs * .17}px "Noto Sans CJK SC"`; g.fillStyle = 'rgba(240,232,215,.92)'; g.textAlign = 'left'; g.textBaseline = 'top'; g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 10;
    [...'夜里的西湖 · 一副全时镜'].forEach((ch, i) => g.fillText(ch, 0, i * fs * .2)); g.restore();
    g.font = `500 ${fs * .16}px "Noto Sans CJK SC"`; g.fillStyle = 'rgba(240,232,215,.9)'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.letterSpacing = '.3em'; g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 10;
    g.fillText('THE NIGHT KEEPER', tx - fs * .5, ty + gap * 2 + fs * 1.15); g.letterSpacing = '0px';
    g.textAlign = 'right'; g.font = `400 ${fs * .15}px "Noto Sans CJK SC"`; g.fillStyle = 'rgba(235,228,210,.75)'; g.letterSpacing = '.15em'; g.fillText('西湖 · 2049 · 一个科幻音乐短片', W - 50, H - 40); g.letterSpacing = '0px';
    return c.toDataURL('image/png'); }, [W, H]);
  writeFileSync(`cover/封面_${name}.png`, Buffer.from(url.split(',')[1], 'base64')); console.log(name); }
await b.close();
