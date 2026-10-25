import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + process.cwd() + '/index.html?ep=1'); await p.waitForFunction('window.ready');
await p.evaluate(() => seek(sceneAt('s9', .66, 0)));
await p.evaluate(() => {
  for (const s of ['#sub', '#top', '.src', '.chip', '.ai']) document.querySelectorAll(s).forEach(e => e.style.display = 'none');
  const d = document.createElement('div');
  d.innerHTML = `<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,8,11,.92) 0%,rgba(6,8,11,.75) 38%,rgba(6,8,11,.1) 65%);z-index:20"></div>
  <div style="position:absolute;left:250px;top:250px;z-index:21;width:900px">
   <div style="font:700 34px var(--sans);letter-spacing:.3em;color:#d9a441">临高启明 · 地理工程篇</div>
   <div style="font:900 132px/1.12 var(--serif);margin-top:24px;text-shadow:0 4px 30px #000">地图上的<br>八年</div>
   <div style="font:700 46px var(--sans);margin-top:26px;letter-spacing:.12em;color:#efe6d4">1628—1636 · 卫星图今昔</div>
   <div style="display:inline-block;margin-top:40px;font:700 30px var(--sans);color:#1d1a16;background:#d9a441;padding:10px 22px;border-radius:8px">AI 整理 · 未经核实</div></div>`;
  document.body.appendChild(d);
});
await p.waitForTimeout(300);
await p.screenshot({ path: 'cover/封面.png' });
await b.close();
