import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.goto('http://127.0.0.1:8194/mt/mv6.html'); await p.waitForFunction('window.ready', null, { timeout: 180000 });
await p.evaluate(() => document.fonts.load('900 100px "Noto Serif CJK SC"'));
for (const [name, W, H] of [['16x9', 1920, 1080], ['4x3', 1440, 1080], ['3x4', 1080, 1440]]) {
  const url = await p.evaluate(([W, H, name]) => {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const V = H > W, R43 = !V && W / H < 1.5;
    // 天空
    const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#03050d'); sk.addColorStop(.55, '#0b1530'); sk.addColorStop(1, '#1d2d55'); g.fillStyle = sk; g.fillRect(0, 0, W, H);
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 900; i++) { const x = rnd() * W, y = rnd() * H * .85, b = rnd(); g.fillStyle = `rgba(${200 + 55 * b | 0},${215 + 30 * b | 0},255,${.25 + .7 * b * b})`; const sz = b > .95 ? 2.6 : b > .75 ? 1.8 : 1.1; g.fillRect(x, y, sz, sz); }
    ST.aurora(g, 0, H * .62, .10);
    // 月亮：正对地球的一面，半月，发动机环在中央偏下，喷流朝观众散开
    const mx = V ? W * .5 : R43 ? W * .6 : W * .63, my = V ? H * .36 : H * .42, mr = V ? W * .33 : H * .34;
    const cv = MOON3.render({ i: 92, sa: -.35, eng: .7, t: 3.1, sunI: 1, earthA: .1, hot: .5, rpx: 300 });
    const k = mr / 300; g.drawImage(cv, mx - 960 * k, my - 540 * k, 1920 * k, 1080 * k);
    // 光晕
    const gl = g.createRadialGradient(mx, my, mr * .9, mx, my, mr * 2.2); gl.addColorStop(0, 'rgba(120,200,170,.18)'); gl.addColorStop(1, 'rgba(120,200,170,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    // 城市与人群
    const base = H * .93, n1 = Math.ceil(W / 52) + 1, n2 = Math.ceil(W / 80) + 1;
    for (let i = 0; i < n1; i++) ST.tower(g, i * 52 - 20, base - 60, 46, 90 + ((i * 37) % 11) * 26, '#101830', .3, 150 + i);
    for (let i = 0; i < n2; i++) ST.tower(g, i * 80 - 40, base - 20, 70, 110 + ((i * 53) % 9) * 28, '#0a1022', .25, 190 + i);
    g.fillStyle = '#05070f'; g.fillRect(0, base - 20, W, H - base + 20);
    ST.crowdRows(g, [[base - 40, Math.round(W / 40), V ? 150 : 130, '#06080f', .3, 16, 0, W], [base + 10, Math.round(W / 70), V ? 220 : 190, '#030408', .3, 17, 0, W]]);
    // 标题：竖排
    const gold = (x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, '#fff3dc'); gr.addColorStop(.5, '#f2d9a4'); gr.addColorStop(1, '#c99a4a'); return gr; };
    const fs = V ? 150 : R43 ? 128 : 160, tx = V ? W * .12 : W * .09, ty = V ? H * .46 : R43 ? H * .15 : H * .2, gap = fs * 1.12;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = 30;
    g.font = `900 ${fs}px "Noto Serif CJK SC"`; g.fillStyle = gold(tx, ty, tx, ty + gap * 4);
    g.lineWidth = fs * .035; g.strokeStyle = 'rgba(60,35,10,.9)';
    [...'月球拖船'].forEach((ch, i) => { const y = ty + i * gap; g.strokeText(ch, tx, y); g.fillText(ch, tx, y); });
    g.shadowBlur = 0;
    // 竖线与小字
    const lx = tx + fs * .72; g.fillStyle = 'rgba(242,196,107,.7)'; g.fillRect(lx, ty - fs * .5, 2, gap * 3 + fs);
    g.save(); g.translate(lx + 30, ty - fs * .5); g.font = `500 ${fs * .17}px "Noto Sans CJK SC"`; g.fillStyle = 'rgba(230,215,185,.9)'; g.textAlign = 'left'; g.textBaseline = 'top';
    [...'音乐短片 · 第五版'].forEach((ch, i) => g.fillText(ch, 0, i * fs * .2)); g.restore();
    g.font = `500 ${fs * .17}px "Noto Sans CJK SC"`; g.fillStyle = 'rgba(230,215,185,.85)'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.letterSpacing = '.32em';
    g.fillText('THE MOON TUG', tx - fs * .5, ty + gap * 3 + fs * .95); g.letterSpacing = '0px';
    // 右下一行小字
    g.textAlign = 'right'; g.font = `400 ${fs * .15}px "Noto Sans CJK SC"`; g.fillStyle = 'rgba(220,210,190,.6)'; g.letterSpacing = '.15em';
    g.fillText('把地球拖出太阳系的 27 年', W - 50, H - 36); g.letterSpacing = '0px'; g.textAlign = 'left';
    return c.toDataURL('image/png'); }, [W, H, name]);
  writeFileSync(`cover/封面v5_${name}.png`, Buffer.from(url.split(',')[1], 'base64')); console.log(name); }
await b.close();
