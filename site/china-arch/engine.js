// 逐帧渲染引擎：场景在进入时搭好 DOM、登记好所有动画（暂停），seek(t) 把一切拨到时刻 t。
(() => {
  const TL = window.TL, SC = window.SCENES || {};
  const stage = document.getElementById('stage'), topEl = document.getElementById('top'), subEl = document.getElementById('sub'), veil = document.getElementById('veil');
  const EASE = { std: 'cubic-bezier(.2,0,0,1)', in: 'cubic-bezier(0,0,.2,1)', out: 'cubic-bezier(.4,0,1,1)', lin: 'linear', io: 'cubic-bezier(.45,0,.2,1)' };
  const NAV = {"1": ["测年", "最早的人", "北京猿人", "丹尼索瓦人", "现代人", "冰期", "陶器", "小结"], "2": ["稻", "粟", "仰韶", "玉", "满天星斗", "小结"], "3": ["良渚", "陶寺", "石峁", "长江", "衰落"], "4": ["小麦", "牛羊", "基因", "二里头", "小结"], "5": ["商", "三星堆", "周", "秦汉", "尾声"]};
  const PARTNAME = { 1: "第一集 · 远古的人", 2: "第二集 · 稻与粟", 3: "第三集 · 城", 4: "第四集 · 从西边来的东西", 5: "第五集 · 青铜王朝到秦汉" };
  let cur = null;   // { sc, anims, ticks, root }

  function splitCues(text) {
    const out = [];
    text.split(/(?<=[。！？；])/).forEach(sn => {
      sn = sn.trim(); if (!sn) return;
      if (sn.length <= 26) { out.push(sn); return; }
      let c = ''; sn.split(/(?<=[，、：])/).forEach(p => { if ((c + p).length > 26 && c) { out.push(c); c = p; } else c += p; }); if (c) out.push(c);
    });
    const tot = out.reduce((a, s) => a + s.replace(/[，。；：、！？“”]/g, '').length, 0) || 1; let acc = 0;
    return out.map(s => { const n = s.replace(/[，。；：、！？“”]/g, '').length, c = { s: s.replace(/[，。；：、]$/, ''), a: acc / tot }; acc += n; c.b = acc / tot; return c; });
  }

  function renderTop(sc) {
    if (!sc.chapter) { topEl.style.visibility = 'hidden'; return; }
    topEl.style.visibility = 'visible';
    topEl.className = 'top ep' + sc.ep;
    const items = NAV[sc.ep];
    topEl.innerHTML = `<div class="ep"><b>${sc.title.split(' ')[0]}</b>${PARTNAME[sc.ep]} · ${sc.title.split(' ').slice(1).join(' ')}</div>
      <div class="map">${items.map(n => `<span class="${n === sc.chapter ? 'on' : ''}">${n}</span>`).join('<i></i>')}</div>`;
  }

  function enter(sc) {
    if (cur) cur.cleanup.forEach(f => { try { f(); } catch (e) {} });
    stage.innerHTML = ''; const root = document.createElement('div'); root.className = 'scene'; stage.appendChild(root);
    const anims = [], ticks = [], cleanup = [];
    const ctx = {
      root, sc, T: sc.T, EASE, cleanup,
      b: i => (sc.beats[Math.min(i, sc.beats.length - 1)] || { s: 0 }).s,
      be: i => { const b = sc.beats[Math.min(i, sc.beats.length - 1)]; return b.s + b.d; },
      el(html, parent) { const t = document.createElement('template'); t.innerHTML = html.trim(); const e = t.content.firstElementChild; (parent || root).appendChild(e); return e; },
      anim(el, kf, start, dur, easing = 'std', fill = 'both') {
        if (typeof el === 'string') el = root.querySelector(el);
        const a = el.animate(kf, { delay: Math.max(0, start) * 1000, duration: Math.max(.001, dur) * 1000, easing: EASE[easing] || easing, fill }); a.pause(); anims.push(a); return a;
      },
      in(el, start, o = {}) {
        const d = o.d ?? .55, dy = o.dy ?? 18, dx = o.dx ?? 0, s0 = o.scale ?? 1;
        if (el._op === undefined) el._op = parseFloat(el.getAttribute && el.getAttribute('opacity') || getComputedStyle(el).opacity) || 1;
        return ctx.anim(el, [{ opacity: 0, transform: `translate(${dx}px,${dy}px) scale(${s0})` }, { opacity: el._op, transform: 'none' }], start, d, o.e || 'std');
      },
      out(el, start, o = {}) { if (typeof el === 'string') el = root.querySelector(el); if (el._op === undefined) el._op = parseFloat(el.getAttribute && el.getAttribute('opacity') || getComputedStyle(el).opacity) || 1; return ctx.anim(el, [{ opacity: el._op }, { opacity: o.to ?? 0 }], start, o.d ?? .35, 'out', 'forwards'); },
      stagger(els, start, gap = .08, o = {}) { [...els].forEach((e, i) => ctx.in(e, start + i * gap, o)); },
      tick(fn) { ticks.push(fn); },
      head(no, text, q, at = 0) {
        const h = ctx.el(`<div class="hd"><span class="no">${no}</span><h1>${text}</h1>${q ? `<span class="q">${q}</span>` : ''}</div>`);
        ctx.in(h, at + .1, { dy: 12 }); return h;
      },
      // 换标题：旧的淡出、新的淡入
      swapHead(h, text, at) { const t = h.querySelector('h1'); const n = t.cloneNode(); n.innerHTML = text; n.style.position = 'absolute'; n.style.left = t.offsetLeft + 'px'; n.style.top = t.offsetTop + 'px'; n.style.whiteSpace = 'nowrap'; h.appendChild(n); ctx.out(t, at, { d: .25 }); ctx.in(n, at + .15, { dy: 10 }); return n; },
    };
    renderTop(sc);
    (SC[sc.id] ? SC[sc.id].build : defaultBuild)(ctx);
    cur = { sc, anims, ticks, root, cleanup, cues: sc.beats.map(b => splitCues(b.text)) };
  }
  function defaultBuild(ctx) { ctx.head(ctx.sc.title.split(' ')[0], ctx.sc.title.split(' ').slice(1).join(' ') + '（待做）'); }

  const ease = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  function seek(t) {
    let i = TL.scenes.findIndex(s => t >= s.start && t < s.start + s.T); if (i < 0) i = t < TL.scenes[0].start ? 0 : TL.scenes.length - 1;
    const sc = TL.scenes[i]; if (!cur || cur.sc !== sc) enter(sc);
    const lt = t - sc.start;
    cur.anims.forEach(a => a.currentTime = lt * 1000);
    cur.ticks.forEach(f => f(lt));
    // 场景之间：黑场很短，内容淡入淡出
    const fin = ease(lt / .35), fout = ease((sc.T - lt) / .3);
    cur.root.style.opacity = Math.min(fin, fout);
    // 片头片尾
    const v = Math.max(t < TL.lead ? 1 - (t - TL.lead + .6) / .6 : 0, t > TL.total - TL.tail ? (t - (TL.total - TL.tail)) / 1.2 : 0);
    veil.style.opacity = Math.max(0, Math.min(1, v));
    // 字幕
    let s = '', op = 0;
    sc.beats.forEach((b, k) => {
      if (lt >= b.s && lt < b.s + b.d + .25) {
        const u = Math.min(.9999, (lt - b.s) / b.d), c = cur.cues[k].find(c => u >= c.a && u < c.b) || cur.cues[k][cur.cues[k].length - 1];
        s = c.s; op = Math.min(ease((lt - b.s) / .2), ease((b.s + b.d + .25 - lt) / .2));
      }
    });
    if (subEl._s !== s) { subEl._s = s; subEl.textContent = s; }
    subEl.style.opacity = s ? op : 0;
    return i;
  }
  window.seek = seek;
  window.allCues = () => TL.scenes.flatMap(sc => sc.beats.flatMap(b => splitCues(b.text).map(c => ({ s: sc.start + b.s + c.a * b.d, e: sc.start + b.s + c.b * b.d, t: c.s })))); 
  window.TOTAL = TL.total;
  window.sceneAt = (id, frac = .5, beat = -1) => { const sc = TL.scenes.find(s => s.id === id); const b = beat >= 0 ? sc.beats[beat] : null; return sc.start + (b ? b.s + b.d * frac : sc.T * frac); };
  Promise.all([document.fonts.ready, window.MAPREADY || Promise.resolve()]).then(() => window.ready = true);
})();
