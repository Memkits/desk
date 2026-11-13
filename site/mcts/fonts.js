// 画布文字不会自动触发按字拆分的字体加载：先把全片用到的字都点一遍。
(() => { const all = new Set('0123456789%·：，。（）第手黑白上下层共提子程序估计的方胜率小大数字红圈只剩一口气可被这块棋还几叠在同点开局先看结果ABCDEFGHJ停');
  TL.scenes.forEach(s => { for (const ch of s.title + s.chapter) all.add(ch); s.beats.forEach(b => { for (const ch of b.text) all.add(ch); }); });
  Object.values(window.BEATS || {}).forEach(b => { for (const ch of (b.note || '') + (b.cap || '') + (b.noteH || '')) all.add(ch); });
  const s = [...all].join('');
  window.ASSETS = Promise.all([500, 600, 700, 800].map(w => document.fonts.load(`${w} 20px "Noto Sans CJK SC"`, s))); })();
