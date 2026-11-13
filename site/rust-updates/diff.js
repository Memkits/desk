// 代码改写动画：旧写法 → 新写法。删去的行先标红、淡出；保留的行滑到新位置；新增的行带绿底淡入。
const RS_KW = /\b(fn|let|mut|if|else|match|loop|while|for|in|return|impl|trait|struct|enum|type|use|mod|pub|unsafe|extern|safe|where|async|await|move|const|static|dyn|as|self|Self|crate|true|false|break|continue)\b/g;
function hlRust(src) {
  const keep = []; const put = (cls, s) => { keep.push(`<span class="${cls}">${s}</span>`); return String.fromCharCode(0xE000 + keep.length - 1); };
  src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  src = src.replace(/"[^"]*"/g, m => put('s', m)).replace(/'(?:\\.|[^'\\])'/g, m => put('s', m));
  src = src.replace(/\/\/.*$/, m => put('c', m));
  src = src.replace(/#!?\[[^\]]*\]/g, m => put('a', m));
  src = src.replace(/\b([a-z_][a-z0-9_]*)!/g, (m, n) => put('f', n + '!'));
  src = src.replace(RS_KW, m => put('k', m));
  src = src.replace(/\b([A-Z][A-Za-z0-9]*)\b/g, m => put('t', m));
  src = src.replace(/\b(\d[\d_]*(?:u8|u32|u64|i32|usize|f32|f64)?)\b/g, m => put('n', m));
  for (let i = 0; i < 4; i++) src = src.replace(/[\uE000-\uE8FF]/g, ch => keep[ch.charCodeAt(0) - 0xE000]);
  return src;
}
function hlSh(src) {
  src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let cm = ''; const m = src.match(/(^|\s)(#\s.*)$/); if (m) { cm = `<span class="c">${m[2]}</span>`; src = src.slice(0, m.index + m[1].length); }
  src = src.replace(/("[^"]*")/g, '<span class="s">$1</span>')
    .replace(/^(\s*)(\[[^\]]+\])/, '$1<span class="t">$2</span>')
    .replace(/^(\s*-?\s*)([A-Za-z_][\w.-]*)(\s*[=:])/, '$1<span class="k">$2</span>$3')
    .replace(/^(\$ )(\S+)/, '<span class="c">$1</span><span class="f">$2</span>');
  return src + cm;
}
const DIFFFOOT = {
  lock: ['✓ rustc 1.84.0 + fs2 0.4 实测编译', '✓ rustc 1.100.0 实测编译'],
  alloc: ['✗ rustc 1.84 稳定版：不允许使用 #![feature]', '✓ rustc 1.100.0 稳定版实测编译'],
};
function diffLayer(c, lay, name, det, seg) {
  const D = DIFF[name], sc = c.sc;
  const W = det ? 1290 : 1500, X = det ? 100 : 210;
  const nmax = Math.max(D.na, D.nb);
  const fs = Math.round(Math.min(32, (W - 150) / (D.wmax * .603), 640 / (nmax * 1.5))), lh = Math.round(fs * 1.5);
  const hl = D.lang === 'rs' ? hlRust : hlSh;
  const foot = DIFFFOOT[name] || (D.lang === 'rs' ? ['✓ rustc 1.84.0 实测编译（2021 版次）', '✓ rustc 1.100.0 实测编译（2024 版次）'] : ['', '依据 Cargo 1.100 自带文档']);
  const top = Math.round(Math.max(150, 150 + (790 - (nmax * lh + 170)) / 2 * .8));
  const el = c.el(`<div class="dcard" style="left:${X}px;top:${top}px;width:${W}px">
    <div class="dh"><i></i><i></i><i></i><span class="fn">${D.fn}</span><span class="vb"><b class="vo">旧写法 · ${D.lo}</b><b class="vn">新写法 · ${D.ln}</b></span></div>
    <div class="db" style="height:${D.na * lh}px;font-size:${fs}px"></div>
    <div class="df"><span class="fo">${foot[0]}</span><span class="fnw">${foot[1]}</span><span class="ver">${D.ver}<small>${D.date}</small></span></div></div>`, lay);
  const body = el.querySelector('.db');
  const rows = D.rows.map(([s, a, b]) => { const r = c.el(`<div class="dl ${a < 0 ? 'add' : b < 0 ? 'del' : ''}" style="height:${lh}px;line-height:${lh}px"><span class="g">${a < 0 ? '+' : b < 0 ? '−' : ''}</span><code>${hl(s) || ' '}</code></div>`, body); return { r, a, b }; });
  const vo = el.querySelector('.vo'), vn = el.querySelector('.vn'), fo = el.querySelector('.fo'), fnw = el.querySelector('.fnw'), ver = el.querySelector('.ver');
  // 改写时刻：两段以上 → 第二段开始后；只有一段 → 段内 45% 处
  const b0 = sc.beats[seg.beats[0].i];
  const tm = seg.beats.length > 1 ? seg.beats[1].s - seg.a + .7 : (b0.s - seg.a) + b0.d * .42;
  const MD = 2.6;
  return { draw: (lt) => {
    const u = CL((lt - tm) / MD), pre = SS((lt - (tm - 1.4)) / .8);
    rows.forEach(({ r, a, b }) => {
      let y, op = 1, dx = 0, bg = 0;
      const yo = a * lh, yn = b * lh, mv = SS((u - .15) / .42);
      if (a >= 0 && b >= 0) { y = LERP(yo, yn, mv); }
      else if (b < 0) { y = yo; op = 1 - SS(u / .28); dx = -30 * SS(u / .28); bg = pre; }
      else { y = yn; op = SS((u - .3) / .35); dx = 24 * (1 - op); bg = 1 - .55 * SS((lt - tm - MD - 2) / 2); }
      r.style.transform = `translate(${dx}px,${y}px)`; r.style.opacity = op; r.style.setProperty('--bg', bg);
      r.style.visibility = op <= .001 ? 'hidden' : 'visible';
    });
    body.style.height = LERP(D.na, D.nb, SS((u - .15) / .42)) * lh + 'px';
    const s = SS((u - .4) / .25);
    vo.style.opacity = 1 - s; vn.style.opacity = s; fo.style.opacity = 1 - s; fnw.style.opacity = s;
    ver.style.opacity = s; ver.style.transform = `scale(${.8 + .2 * s})`;
  } };
}
