// 浏览器中观看用的播放控件：渲染脚本（无头浏览器）下不启用。
(() => {
  if (navigator.webdriver && !/[?&]player=1/.test(location.search)) return;
  const W = 1920, H = 1080, root = document.documentElement, body = document.body;
  root.style.cssText += ';width:100%;height:100%;overflow:hidden;background:#000';
  body.style.transformOrigin = '0 0'; body.style.position = 'absolute';
  const fit = () => { const s = Math.min(innerWidth / W, (innerHeight - 48) / H); body.style.transform = `translate(${(innerWidth - W * s) / 2}px,${(innerHeight - 48 - H * s) / 2}px) scale(${s})`; };
  addEventListener('resize', fit); fit();
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:48px;display:flex;gap:12px;align-items:center;padding:0 16px;background:#111;color:#ddd;font:14px system-ui,sans-serif;z-index:99';
  bar.innerHTML = '<button id="pp" style="width:72px;height:30px">播放</button><input id="sk" type="range" min="0" step="0.05" style="flex:1"><span id="tm" style="font-variant-numeric:tabular-nums;min-width:110px;text-align:right"></span><select id="sp"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select><span style="opacity:.6">无配音 · 字幕同步</span>';
  root.appendChild(bar);
  const $ = id => bar.querySelector('#' + id), fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  let t = +(new URLSearchParams(location.search).get('t') || 0), playing = false, last = 0;
  const go = () => { const total = window.TOTAL || window.TL.total; t = Math.max(0, Math.min(total, t)); window.seek(t); $('sk').max = total; $('sk').value = t; $('tm').textContent = fmt(t) + ' / ' + fmt(total); };
  const loop = now => { if (playing) { t += (now - last) / 1000 * +$('sp').value; last = now; if (t >= (window.TOTAL || window.TL.total)) playing = false, $('pp').textContent = '播放'; go(); } requestAnimationFrame(loop); };
  $('pp').onclick = () => { playing = !playing; last = performance.now(); $('pp').textContent = playing ? '暂停' : '播放'; };
  $('sk').oninput = () => { t = +$('sk').value; go(); };
  addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); $('pp').click(); } if (e.code === 'ArrowRight') { t += 5; go(); } if (e.code === 'ArrowLeft') { t -= 5; go(); } });
  const start = () => window.ready ? (go(), requestAnimationFrame(loop)) : setTimeout(start, 100);
  start();
})();
