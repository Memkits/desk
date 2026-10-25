// ======================= 上集 · 原理 =======================

S('a_hook', c => {
  const L = c.el(`<div class="abs" style="left:120px;top:150px;width:660px">
    <div class="cap" style="margin-bottom:22px">设计规范 · 上集：原理</div>
    <h1 style="font-size:84px;line-height:1.12;margin:0;font-weight:800">同样的信息<br>为什么右边<br>更好用？</h1></div>`);
  c.in(L, .2);
  const pb = c.el(phoneBad(800, 110)), pg = c.el(phoneGood(1330, 110));
  c.in(pb, .5, { dy: 30 }); c.in(pg, .8, { dy: 30 });
  // 第二拍：五处改动各有来历
  const M = [[1752, 260, '看见'], [1752, 529, '读懂'], [1752, 379, '决定'], [1752, 836, '动手'], [1752, 768, '确认']];
  M.forEach(([x, y, s], i) => {
    const m = c.el(`<div class="abs mk" style="left:${x - 22}px;top:${y - 22}px;--c:${C5[s]}">${i + 1}</div>`);
    c.in(m, c.b(1) + .3 + i * .18, { scale: .4, dy: 0 });
  });
  const ch = c.el(`<div class="abs" style="left:120px;top:560px;width:660px">
    <div class="lg5">${STAGES.map((s, i) => `<span style="--c:${C5[s]}"><i>${i + 1}</i>${s}</span>`).join('')}</div>
    <div class="chain"><b>人的规律</b><em>→</em><b>方法</b><em>→</em><b>设计规范</b></div>
    <div style="display:flex;gap:14px;margin-top:26px"><span class="ep1">上集 · 原理</span><span class="ep2">下集 · 搭建</span></div></div>`);
  c.stagger(ch.children, c.b(1) + .6, .5);
});

S('a_frame', c => {
  const h = c.head('01', '一次交互，五个环节');
  // 循环图
  const lp = c.el(`<svg class="abs" style="left:110px;top:250px" width="700" height="640" viewBox="-10 0 720 640">
    <circle cx="350" cy="310" r="215" fill="none" stroke="#D8D3C9" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>
    <path id="gE" d="M 560 250 A 222 222 0 0 1 470 492" fill="none" stroke="#D1492E" stroke-width="12" stroke-linecap="round" opacity=".22"/>
    <path id="gV" d="M 225 492 A 222 222 0 0 1 140 250" fill="none" stroke="#7445D6" stroke-width="12" stroke-linecap="round" opacity=".22"/>
    <g id="gl" font-family="Inter,Noto Sans CJK SC" font-size="23" fill="#454A55">
      <g id="gl1"><text x="588" y="388" font-weight="600">执行的鸿沟</text><text x="588" y="418" font-size="19" fill="#7C818C">做得到吗</text></g>
      <g id="gl2"><text x="112" y="388" text-anchor="end" font-weight="600">评估的鸿沟</text><text x="112" y="418" font-size="19" fill="#7C818C" text-anchor="end">做成了吗</text></g></g>
    <g id="ctr"><text x="350" y="300" text-anchor="middle" font-family="Inter,Noto Sans CJK SC" font-size="27" font-weight="600" fill="#16181D">用户的目标</text>
    <text x="350" y="336" text-anchor="middle" font-family="Inter,Noto Sans CJK SC" font-size="19" fill="#7C818C">诺曼 · 行动的七个阶段（简化为五步）</text></g>
    ${[[350, 95], [555, 244], [476, 484], [224, 484], [145, 244]].map(([x, y], i) => `<g class="nd" id="nd${i}"><circle cx="${x}" cy="${y}" r="60" fill="${['#2F5BEA', '#0E8A7E', '#B7791F', '#D1492E', '#7445D6'][i]}"/><text x="${x}" y="${y + 10}" text-anchor="middle" font-family="Inter,Noto Sans CJK SC" font-size="29" font-weight="700" fill="#fff">${STAGES[i]}</text></g>`).join('')}
  </svg>`);
  c.in(lp.querySelector('#ctr'), .4);
  for (let i = 0; i < 5; i++) c.in(lp.querySelector('#nd' + i), c.b(0) + 1.2 + i * (c.sc.beats[0].d * .6 / 5), { scale: .6, dy: 0 });
  ['#gE', '#gV', '#gl1', '#gl2'].forEach((s, i) => c.in(lp.querySelector(s), c.b(1) + (i % 2 ? 2.2 : .5) + (i > 1 ? .3 : 0), { dy: 0 }));
  // 第三拍：循环缩到左侧，矩阵出现
  c.anim(lp, [{ transform: 'none' }, { transform: 'translate(-40px,30px) scale(.62)' }], c.b(2), .7, 'std');
  lp.style.transformOrigin = '0 0';
  const mx = c.el(matrix(560, 250, 1240, 0));
  c.stagger(mx.querySelectorAll('.mh'), c.b(2) + .4, .08);
  c.stagger(mx.querySelectorAll('.rh'), c.b(2) + 1.6, .25);
  c.stagger(mx.querySelectorAll('.mc'), c.b(2) + 2.0, .02, { dy: 8, d: .4 });
  const tags = c.el(`<div class="abs" style="left:560px;top:250px;width:1240px;height:500px;pointer-events:none">
    <div class="rowtag" style="top:46px">上集</div><div class="rowtag b" style="top:286px">下集</div></div>`);
  c.stagger(tags.children, c.b(2) + c.sc.beats[2].d * .75, .4);
  // 第四拍：证据分级
  const ev = c.el(`<div class="abs" style="left:560px;top:800px;width:1240px;display:flex;gap:14px;align-items:center">
    <span class="cap" style="margin-right:8px">证据</span>${badge('law', '单项实验')}${badge('meta', '元分析')}${badge('exp', '经验原则')}${badge('conv', '平台与行业约定')}
    <span class="p" style="margin-left:16px;font-size:21px">越靠左，越难被推翻</span></div>`);
  c.stagger(ev.children, c.b(3) + .3, .35);
});

S('a_percept', c => {
  const h = c.head('02', '有的东西一眼跳出，有的要逐个找');
  // ---- 视觉搜索 ----
  const A = c.el(box(120, 250, 1080, 0) + `
    <div style="padding:28px 36px">${badge('law', '单项实验 · 特征整合理论')}<span class="cite" style="margin-left:14px;font-size:19px;color:var(--ink3)">Treisman & Gelade, 1980</span>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;margin-top:22px">
      <div class="vs1"><div class="ttl" style="font-size:22px;margin-bottom:10px">单一特征：颜色不同</div>${dotsField('s1', 300, 250)}</div>
      <div class="vs2"><div class="ttl" style="font-size:22px;margin-bottom:10px">特征组合：红色 + 圆形</div>${dotsField('s2', 300, 250)}</div>
      <div><div class="ttl" style="font-size:22px;margin-bottom:10px">找到所需时间</div>
        <svg width="300" height="250" viewBox="0 0 300 250" font-family="Inter,Noto Sans CJK SC">
          <line x1="40" y1="210" x2="290" y2="210" stroke="#CBC6BB"/><line x1="40" y1="20" x2="40" y2="210" stroke="#CBC6BB"/>
          <g class="ln1"><path d="M50 165 L270 158" stroke="#2F5BEA" stroke-width="4" fill="none"/><text x="270" y="148" text-anchor="end" font-size="17" fill="#2F5BEA">单一特征：几乎不变</text></g>
          <g class="ln2"><path d="M50 160 L270 40" stroke="#D1492E" stroke-width="4" fill="none"/><text x="262" y="30" text-anchor="end" font-size="17" fill="#D1492E">组合：随数量增加</text></g>
          <text x="165" y="238" text-anchor="middle" font-size="17" fill="#7C818C">干扰项数量 →</text></svg>${note('走势示意，非原始数据')}</div>
    </div>
    <div class="cv p" style="margin-top:24px;padding-top:18px;border-top:1px solid var(--line);font-size:22px">后来的研究（如“引导搜索”模型）修正了“并行 / 串行”的二分，<b>但“单一特征最快被找到”的推论依然成立</b>。</div></div></div>`);
  c.in(A, .3);
  reseed(7); const P = () => { const p = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) p.push([30 + i * 48 + rnd() * 14 - 7, 28 + j * 48 + rnd() * 14 - 7]); return p; };
  const field = (s, items) => { s.innerHTML = '<rect width="300" height="250" rx="12" fill="#F6F5F1"/>' + items.map(([x, y, sh, col, t]) => (sh === 'c' ? `<circle cx="${x}" cy="${y}" r="11" fill="${col}"/>` : `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="2" fill="${col}"/>`) + (t ? `<circle class="hit" cx="${x}" cy="${y}" r="20" fill="none" stroke="#16181D" stroke-width="3"/>` : '')).join(''); };
  const B = '#2F5BEA', R = '#D1492E';
  field(A.querySelector('#s1'), P().map((q, i) => [q[0], q[1], 'c', i === 17 ? R : B, i === 17]));
  field(A.querySelector('#s2'), P().map((q, i) => [q[0], q[1], i === 22 ? 'c' : (i % 2 ? 'c' : 's'), i === 22 ? R : (i % 2 ? B : R), i === 22]));
  c.in(A.querySelector('.vs1'), c.b(0) + .3); c.in(A.querySelector('.ln1'), c.b(0) + c.sc.beats[0].d * .6, { dy: 0 });
  c.in(A.querySelector('#s1 .hit'), c.b(0) + 2.2, { scale: 1.8, dy: 0, d: .4 });
  c.in(A.querySelector('.vs2'), c.b(1) + .1); c.in(A.querySelector('.ln2'), c.b(1) + c.sc.beats[1].d * .45, { dy: 0 });
  c.in(A.querySelector('#s2 .hit'), c.b(1) + c.sc.beats[1].d * .35, { scale: 1.8, dy: 0, d: .4 });
  c.in(A.querySelector('.cv'), c.b(1) + c.sc.beats[1].d * .7);
  // 推出的方法 + 灰度测试
  const R1 = c.el(`<div class="abs" style="left:1240px;top:250px;width:560px"><div class="lk">推出的方法</div>
    ${rule('var(--see)', '一处只用一个特征突出', '主按钮靠颜色跳出来，其他元素就别再用这个颜色。')}
    ${rule('var(--see)', '状态色单独占色相', '错误、警告不与品牌色混用，扫一眼就能找到。')}
    <div class="gt card" style="padding:18px 22px;display:flex;gap:16px;align-items:center"><b style="font-size:22px;white-space:nowrap">灰度测试</b>
      <div class="gtw" style="flex:1;display:flex;gap:10px;align-items:center"><span style="flex:1;height:46px;border-radius:10px;background:#2F5BEA;color:#fff;font-size:19px;font-weight:600;display:grid;place-items:center">预约</span><span style="flex:1;height:46px;border-radius:10px;border:1.5px solid #C8D3FA;color:#2F5BEA;font-size:19px;display:grid;place-items:center">稍后</span><span style="font-size:18px;color:#D1492E">⚠ 冲突</span></div></div></div>`);
  c.stagger(R1.children, c.b(2) + .2, .9);
  c.anim(R1.querySelector('.gtw'), [{ filter: 'grayscale(0)' }, { filter: 'grayscale(1)' }], c.b(2) + c.sc.beats[2].d * .78, .8, 'io');
  c.out(A, c.be(2) + .1); c.out(R1, c.be(2) + .1);
  // ---- 格式塔分组 ----
  const G = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:24px">
    ${[['接近', 'exp', '离得近的成组', '经典格式塔'], ['相似', 'exp', '长得像的成组', '经典格式塔'], ['共同区域', 'law', '同一底色里的成组', 'Palmer, 1992'], ['连接', 'law', '连在一起的成组', 'Palmer & Rock, 1994']].map(([t, k, d, ci], i) => `
    <div class="card" style="padding:26px 28px;height:470px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:28px">${t}</b>${badge(k, i < 2 ? '经验原则' : '实验补充')}</div><div class="note" style="margin-top:6px">${ci}</div>
    <svg width="340" height="290" viewBox="0 0 340 300" style="margin-top:6px" id="gs${i}"></svg><div class="p" style="font-size:21px">${d}</div></div>`).join('')}</div>`);
  const dot = (x, y, col = '#454A55', sh = 'c') => sh === 'c' ? `<circle cx="${x}" cy="${y}" r="14" fill="${col}"/>` : `<rect x="${x - 13}" y="${y - 13}" width="26" height="26" rx="3" fill="${col}"/>`;
  const grid = (f) => { let s = ''; for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) s += f(r, k); return s; };
  G.querySelector('#gs0').innerHTML = grid((r, k) => dot(40 + k * 48 + (k >= 3 ? 34 : 0), 60 + r * 60));
  G.querySelector('#gs1').innerHTML = grid((r, k) => dot(50 + k * 50, 60 + r * 60, k % 2 ? '#D1492E' : '#454A55', k % 2 ? 's' : 'c'));
  G.querySelector('#gs2').innerHTML = `<rect x="22" y="26" width="140" height="248" rx="18" fill="#E4EAFD"/>` + grid((r, k) => dot(50 + k * 50, 60 + r * 60));
  G.querySelector('#gs3').innerHTML = [0, 1, 2, 3].map(r => `<line x1="100" y1="${60 + r * 60}" x2="150" y2="${60 + r * 60}" stroke="#454A55" stroke-width="5"/>`).join('') + grid((r, k) => dot(50 + k * 50, 60 + r * 60));
  const h2 = c.swapHead(h, '离得近、长得像、在一起的，被看成一组', c.b(3));
  [...G.children].forEach((e, i) => c.in(e, c.b(3) + .2 + i * (i < 2 ? .6 : 0) + (i >= 2 ? c.sc.beats[3].d * .45 + (i - 2) * .6 : 0)));
  const G2 = c.el(`<div class="abs p" style="left:120px;top:760px;width:1680px;font-size:24px">推论：<b>组内间距明显小于组间间距</b>；距离不够区分时，再用底色把一组框起来——共同区域的分组线索比接近更强。</div>`);
  c.in(G2, c.b(3) + c.sc.beats[3].d * .8);
  c.out(G, c.be(3) + .1); c.out(G2, c.be(3) + .1);
  // ---- 注意力：突然出现 / 变化盲视 ----
  const N = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
    <div class="card rs"><div style="display:flex;gap:12px;align-items:center">${badge('law', '单项实验')}<span class="note">Yantis & Jonides, 1984</span></div>
      <div class="ttl" style="margin:18px 0 6px">突然出现会抢注意力</div>
      <div class="onset" style="position:relative;height:330px;background:#F6F5F1;border-radius:14px;margin-top:14px">
        ${[0, 1, 2, 3, 4, 5].map(i => `<div style="position:absolute;left:${40 + (i % 3) * 230}px;top:${40 + Math.floor(i / 3) * 140}px;width:190px;height:100px;border-radius:12px;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.05)"></div>`).join('')}
        <div class="pop" style="position:absolute;left:520px;top:20px;padding:10px 18px;border-radius:12px;background:#16181D;color:#fff;font-size:20px">新消息</div></div></div>
    <div class="card rs"><div style="display:flex;gap:12px;align-items:center">${badge('law', '单项实验')}<span class="note">Rensink 等, 1997 · 闪烁范式</span></div>
      <div class="ttl" style="margin:18px 0 6px">变化盲视：闪一下，就看不见变化</div>
      <div class="cb" style="position:relative;height:330px;background:#F6F5F1;border-radius:14px;margin-top:14px;overflow:hidden">
        <div style="position:absolute;left:40px;top:36px;right:40px"><div style="font-size:24px;font-weight:700">三楼 · 青松厅</div><div style="font-size:20px;color:var(--ink3);margin-top:6px">10:00 – 11:00 · 6 人</div>
        <div style="margin-top:24px;display:flex;gap:12px"><span class="tag">投影</span><span class="tag">白板</span></div>
        <div style="margin-top:28px;font-size:22px">费用：<span class="fee">¥ 0</span></div></div>
        <div class="flash" style="position:absolute;inset:0;background:#F6F5F1;opacity:0"></div></div></div></div>`);
  const h3 = c.swapHead(h, '注意力会被抢走，也会漏看', c.b(4)); c.out(h2, c.b(4));
  c.in(N, c.b(4) + .1);
  c.in(N.querySelector('.pop'), c.b(4) + 1.6, { scale: .7, dy: 0, d: .3 });
  // 闪烁：在空白帧里把费用改掉
  const fee = N.querySelector('.fee'), fl = N.querySelector('.flash');
  for (let k = 0; k < 6; k++) { const t0 = c.b(4) + c.sc.beats[4].d * .45 + k * .7; c.anim(fl, [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], t0, .24, 'lin', 'none'); }
  c.tick(t => { const t0 = c.b(4) + c.sc.beats[4].d * .45; const k = Math.floor((t - t0) / .7 + .1); fee.textContent = t > t0 + .1 && k % 2 === 0 ? '¥ 120' : '¥ 0'; fee.style.color = 'inherit'; });
  const N2 = c.el(`<div class="abs p" style="left:120px;top:840px;width:1680px;font-size:24px">推论：<b>动效要省着用</b>；真正重要的变化（价格、状态、错误），<b>反而要用动效提示</b>，不能指望用户自己发现。</div>`);
  c.in(N2, c.b(4) + c.sc.beats[4].d * .75);
  c.out(N, c.be(4) + .1); c.out(N2, c.be(4) + .1);
  // ---- 阅读路径 ----
  const F = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:860px 1fr;gap:40px">
    <div class="card" style="height:620px;padding:30px 36px;position:relative;overflow:hidden">
      <div style="display:flex;gap:12px;align-items:center">${badge('exp', '眼动研究')}<span class="note">Nielsen Norman Group, 2006 / 2017</span></div>
      <div class="art" style="position:relative;margin-top:22px">
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<div style="height:${i % 3 === 0 ? 26 : 16}px;width:${i % 3 === 0 ? 70 : 92 - (i * 7) % 30}%;background:${i % 3 === 0 ? '#C9CDD5' : '#E4E6EA'};border-radius:4px;margin:${i % 3 === 0 ? 26 : 12}px 0 0"></div>`).join('')}
        <div class="ad" style="position:absolute;right:0;top:0;width:200px;height:240px;border-radius:10px;background:#F3E3C3;display:grid;place-items:center;color:#8F5E12;font-size:20px">广告位</div>
        <svg class="heat" width="790" height="460" style="position:absolute;left:0;top:-10px"><defs><radialGradient id="hg"><stop offset="0" stop-color="#D1492E" stop-opacity=".55"/><stop offset="1" stop-color="#D1492E" stop-opacity="0"/></radialGradient></defs>
          ${[[60, 30, 90], [200, 30, 80], [340, 34, 60], [60, 120, 70], [180, 120, 55], [50, 210, 60], [50, 300, 55], [60, 380, 50]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#hg)"/>`).join('')}</svg>
      </div></div>
    <div><div class="lk">推出的方法</div>${rule('var(--see)', '重要的放在开头和左侧', '每段第一句、每行开头最常被读到。')}${rule('var(--see)', '标题要能单独读懂', '扫视的人只读标题和小标题。')}${rule('var(--see)', '别把关键内容做得像广告', '横幅盲区：像广告的区域会被直接跳过。')}</div></div>`);
  c.swapHead(h, '人在页面上怎么读', c.b(5)); c.out(h3, c.b(5));
  c.in(F, c.b(5) + .1); c.in(F.querySelector('.heat'), c.b(5) + c.sc.beats[5].d * .25, { dy: 0, d: 1.2 });
  c.anim(F.querySelector('.ad'), [{ opacity: 1 }, { opacity: .35 }], c.b(5) + c.sc.beats[5].d * .5, .6);
  c.stagger(F.children[1].children, c.b(5) + c.sc.beats[5].d * .55, .5);
});

S('a_memory', c => {
  const h = c.head('03', '一次能记住的，比想象中少');
  // b0 工作记忆
  const W = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 480px;gap:40px">
    <div class="card rs" style="min-height:620px"><div class="ttl">记住这串字母</div>
      <div class="lt" style="display:flex;gap:8px;margin:40px 0 10px">${'FBICIAUSAMBA'.split('').map((ch, i) => `<span class="lc" data-i="${i}">${ch}</span>`).join('')}</div>
      <div class="lt2 p" style="margin-top:20px">十二个字母 → <b>四个组块</b>：FBI · CIA · USA · MBA</div>
      <div style="margin-top:40px;display:flex;gap:10px;align-items:center"><span class="note" style="width:150px">工作记忆容量</span>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<i class="slot${i < 4 ? ' on' : ''}"></i>`).join('')}</div>
      <div style="margin-top:12px;display:flex;gap:30px" class="note"><span>米勒 1956：七加减二</span><span style="color:var(--read)">考恩 2001：约四个组块</span></div></div>
    <div><div class="card rs" style="min-height:620px">${badge('law', '单项实验 + 综述')}<div class="p" style="margin-top:14px">数字本身仍有争议，组块怎么界定也有争议。</div><div class="p"><b>但方向一致：别让用户同时记住很多东西。</b></div><div class="p" style="margin-top:28px;padding-top:20px;border-top:1px solid var(--line)">界面上的推论：<br>· 跨页面要比对的信息，放在同一屏<br>· 上一步填过的内容，在下一步继续显示<br>· 验证码、订单号这类串，按位分组</div></div></div></div>`);
  c.in(W, .4);
  const lcs = W.querySelectorAll('.lc'); c.stagger(lcs, c.b(0) + .4, .06, { dy: 10, d: .3 });
  lcs.forEach((e, i) => c.anim(e, [{ marginRight: '0px' }, { marginRight: (i % 3 === 2 ? 34 : 0) + 'px' }], c.b(0) + c.sc.beats[0].d * .45, .6));
  c.in(W.querySelector('.lt2'), c.b(0) + c.sc.beats[0].d * .5);
  c.stagger(W.querySelectorAll('.slot'), c.b(0) + c.sc.beats[0].d * .6, .05, { dy: 0, scale: .5, d: .3 });
  c.in(W.children[1], c.b(0) + c.sc.beats[0].d * .75);
  // b1 认知负荷
  const L = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs">${badge('law', '理论 · 认知负荷')}<span class="note" style="margin-left:12px">Sweller, 1988 起</span>
      <div style="display:flex;gap:60px;align-items:flex-end;margin-top:30px;height:460px">
        ${[['改造前', 140, 220, 80], ['改造后', 140, 60, 130]].map(([n, a, b, g], k) => `<div style="width:170px;text-align:center"><div class="stk" style="display:flex;flex-direction:column-reverse;height:400px;justify-content:flex-start">
          <div style="height:${a}px;background:#9FB4F5;border-radius:0 0 10px 10px"></div><div class="ex${k}" style="height:${b}px;background:#F2B4A4"></div><div style="height:${g}px;background:#A7DCC7;border-radius:10px 10px 0 0"></div></div><div class="p" style="margin-top:10px">${n}</div></div>`).join('')}
        <div style="display:flex;flex-direction:column;gap:16px;padding-bottom:60px">
          <span class="lgd"><i style="background:#A7DCC7"></i>有益投入：理解、学会</span>
          <span class="lgd"><i style="background:#F2B4A4"></i>外在负荷：界面制造的麻烦</span>
          <span class="lgd"><i style="background:#9FB4F5"></i>内在负荷：任务本身的难度</span></div></div></div>
    <div><div class="lk">设计能动的是中间那一块</div>${rule('var(--read)', '内在负荷：改不了', '订会议室本来就要选时间、地点、人数。')}${rule('var(--read)', '外在负荷：尽量去掉', '多余的字段、看不懂的术语、来回跳转、找不到的按钮。')}${rule('var(--read)', '省下的注意力', '留给用户自己的目标。')}</div></div>`);
  c.in(L, c.b(1) + .1); c.stagger(L.children[1].children, c.b(1) + c.sc.beats[1].d * .35, .7);
  c.out(W, c.b(1)); 
  // b2 认出 vs 回想 + 常驻标签
  const R = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:620px"><div class="ttl">认出来，比想起来容易</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px">
      <div><div class="note" style="margin-bottom:10px">要回想</div><div class="fx">会议室名称<div class="inp">|</div></div></div>
      <div><div class="note" style="margin-bottom:10px">只要认出</div><div class="lst">${['三楼 · 青松厅', '三楼 · 竹影厅', '五楼 · 观澜厅'].map((x, i) => `<div class="${i === 0 ? 'on' : ''}">${x}</div>`).join('')}</div></div></div><div class="p" style="margin-top:60px;padding-top:20px;border-top:1px solid var(--line)">选择题比填空题容易：<b>系统负责记住选项，人只需要认出</b>。</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">标签要常驻</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px">
      <div><div class="note" style="margin-bottom:10px">只用占位文字</div><div class="ph1 fx2"><span class="phx">参会人数</span><span class="tv">6</span></div><div class="note" style="margin-top:10px;color:var(--act)">一输入，提示就没了</div></div>
      <div><div class="note" style="margin-bottom:10px">标签 + 输入</div><div style="font-size:18px;font-weight:600;color:var(--ink2);margin-bottom:6px">参会人数</div><div class="fx2"><span class="tv2">6</span></div></div></div><div class="p" style="margin-top:60px;padding-top:20px;border-top:1px solid var(--line)">占位文字一消失，用户回头检查时，<b>已经不知道这一格填的是什么</b>。</div></div></div>`);
  c.in(R, c.b(2) + .1); c.out(L, c.b(2));
  const phx = R.querySelector('.phx'), tv = R.querySelector('.tv'), tv2 = R.querySelector('.tv2');
  c.anim(phx, [{ opacity: 1 }, { opacity: 0 }], c.b(2) + c.sc.beats[2].d * .7, .01); c.anim(tv, [{ opacity: 0 }, { opacity: 1 }], c.b(2) + c.sc.beats[2].d * .7, .01);
  c.anim(tv2, [{ opacity: 0 }, { opacity: 1 }], c.b(2) + c.sc.beats[2].d * .7, .01);
  // b3 心智模型：约定的位置
  const J = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1000px 1fr;gap:40px">
    <div class="card" style="height:600px;padding:28px;position:relative">
      <div class="wf" style="position:relative;height:540px;border:2px solid #E4E6EA;border-radius:14px;overflow:hidden">
        <div style="height:70px;border-bottom:2px solid #E4E6EA;display:flex;align-items:center;padding:0 24px;gap:30px">
          <span class="cv1 cvx">标志 → 回首页</span><span style="flex:1"></span><span class="cv2 cvx">搜索</span><span class="cv3 cvx">头像 · 账户</span></div>
        <div style="padding:30px 24px"><div style="width:60%;height:24px;background:#E4E6EA;border-radius:4px"></div>
          ${[0, 1, 2].map(() => `<div style="width:90%;height:14px;background:#EEF0F2;border-radius:4px;margin-top:14px"></div>`).join('')}
          <div style="display:flex;gap:12px;margin-top:40px"><span class="cv4 cvx">蓝色带下划线 = 链接</span></div></div>
        <div style="position:absolute;right:24px;bottom:24px" class="cv5 cvx">主操作在右下</div></div></div>
    <div><div class="card rs">${badge('exp', '经验原则 · 雅各布定律')}<div class="p" style="margin-top:14px">用户大部分时间都花在<b>别人的网站</b>上，所以期待你的网站和那些网站用法一样。</div><div class="note" style="margin-top:8px">Jakob Nielsen, 2000</div></div>
      <div class="p" style="margin-top:22px">沿用约定，就是借用户已有的心智模型；<b>要打破约定，得有足够大的收益。</b></div></div></div>`);
  c.in(J, c.b(3) + .1); c.out(R, c.b(3)); c.stagger(J.querySelectorAll('.cvx'), c.b(3) + 1, .4, { scale: .8, dy: 0 });
  // b4 设计来分块
  const K = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    <div class="card rs" style="height:620px"><div class="ttl">按位分组</div><div class="ph" style="margin-top:110px;font-size:52px;font-family:var(--mono);letter-spacing:.02em"><span class="pn1">13812345678</span></div><div class="ph2" style="font-size:52px;font-family:var(--mono);margin-top:40px;color:var(--read)">138 1234 5678</div></div>
    <div class="card rs" style="height:620px"><div class="ttl">长表单拆成几步</div><div class="steps" style="display:flex;gap:10px;margin-top:40px">${['时间', '会议室', '设备', '确认'].map((x, i) => `<div class="stp${i === 1 ? ' on' : ''}"><i>${i + 1}</i>${x}</div>`).join('')}</div><div style="margin-top:30px">${[0, 1].map(() => `<div style="height:56px;border-radius:12px;background:#F2F3F5;margin-bottom:12px"></div>`).join('')}</div></div>
    <div class="card rs" style="height:620px"><div class="ttl">高级选项先收起</div><div style="margin-top:40px">${[0, 1].map(() => `<div style="height:56px;border-radius:12px;background:#F2F3F5;margin-bottom:12px"></div>`).join('')}<div class="adv">高级选项 <span class="ar">›</span></div><div class="advb">${['重复预约', '通知参会人', '外部访客'].map(x => `<div>${x}</div>`).join('')}</div></div><div class="note" style="margin-top:14px">渐进披露</div></div></div>`);
  c.stagger(K.children, c.b(4) + .1, .25); c.out(J, c.b(4));
  c.anim(K.querySelector('.ph2'), [{ opacity: 0 }, { opacity: 1 }], c.b(4) + 1.5, .5);
  c.anim(K.querySelector('.advb'), [{ height: '0px', opacity: 0 }, { height: '180px', opacity: 1 }], c.b(4) + c.sc.beats[4].d * .55, .4);
  c.anim(K.querySelector('.ar'), [{ transform: 'rotate(0)' }, { transform: 'rotate(90deg)' }], c.b(4) + c.sc.beats[4].d * .55, .3);
  // b5 极端内容压测
  const X = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    <div class="card rs" style="min-height:620px"><div class="ttl">超长名字</div><div class="pc"><b>李雷</b><span>产品部</span></div><div class="pc"><b class="ell">欧阳·穆罕默德·亚历山大·克里斯托弗森</b><span>国际业务与合作发展中心</span></div><div class="note">截断？换行？头像会不会被挤扁？</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">零条数据</div><div class="empty"><div style="font-size:40px">◌</div><div style="font-size:21px;margin-top:8px">今天还没有预约</div><div class="btnm">预约会议室</div></div><div class="note">空状态要告诉人下一步做什么</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">一千条数据</div><div class="many">${Array.from({ length: 9 }, (_, i) => `<div><span>${['青松厅', '竹影厅', '观澜厅'][i % 3]}</span><span>${9 + Math.floor(i / 2)}:00</span></div>`).join('')}</div><div class="note">分页、筛选、搜索，还是虚拟列表？</div></div></div>`);
  c.stagger(X.children, c.b(5) + .1, .5); c.out(K, c.b(5));
  // 标题
  const h2 = c.swapHead(h, '负荷分三类，只有一类该去掉', c.b(1));
  const h3 = c.swapHead(h, '认出来，比想起来容易', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '沿用约定，就是借用户的心智模型', c.b(3)); c.out(h3, c.b(3));
  const h5 = c.swapHead(h, '组块也可以由设计来完成', c.b(4)); c.out(h4, c.b(4));
  c.swapHead(h, '用极端内容压测界面', c.b(5)); c.out(h5, c.b(5));
});

S('a_decide', c => {
  const h = c.head('04', '选项越多越慢——但有前提');
  // b0 希克
  const H = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs">${badge('law', '单项实验 · 希克—海曼定律')}<span class="note" style="margin-left:12px">Hick 1952 · Hyman 1953</span>
      <div style="font-size:44px;margin:28px 0 8px;font-family:'Latin Modern Math','DejaVu Serif',serif">T = a + b · log<sub style="font-size:.6em">2</sub>(n + 1)</div>
      <div class="note">n：可能性相同的选项数</div>
      <svg width="700" height="300" style="margin-top:20px" font-family="Inter,Noto Sans CJK SC">
        <line x1="50" y1="260" x2="680" y2="260" stroke="#CBC6BB"/><line x1="50" y1="20" x2="50" y2="260" stroke="#CBC6BB"/>
        <path class="lg" d="${Array.from({ length: 60 }, (_, i) => { const n = 1 + i * .5; return `${i ? 'L' : 'M'}${50 + i * 10.5} ${240 - Math.log2(n + 1) * 40}`; }).join(' ')}" stroke="#B7791F" stroke-width="4" fill="none"/>
        <path class="li" d="M50 240 L680 40" stroke="#7C818C" stroke-width="3" stroke-dasharray="8 8" fill="none"/>
        <text x="670" y="90" text-anchor="end" font-size="20" fill="#B7791F">熟悉、等可能：对数增长</text>
        <text x="600" y="30" text-anchor="end" font-size="20" fill="#7C818C">陌生菜单逐项读：接近线性</text>
        <text x="365" y="290" text-anchor="middle" font-size="18" fill="#7C818C">选项数 →</text></svg>${note('曲线示意')}</div>
    <div><div class="lk">前提</div>${rule('var(--decide)', '选项可能性相同', '有明显首选时，人不会均匀地考虑每一项。')}${rule('var(--decide)', '刺激和反应已经熟悉', '像打字员找键位，而不是第一次看菜单。')}${rule('var(--decide)', '否则是在阅读和搜索', '用时随项数近似线性增长——这时要靠分组、排序和搜索。')}</div></div>`);
  c.in(H, .4); c.in(H.querySelector('.li'), c.b(0) + c.sc.beats[0].d * .7, { dy: 0 }); c.stagger(H.children[1].children, c.b(0) + c.sc.beats[0].d * .5, .7);
  // b1 果酱 b2 元分析
  const J = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:520px 540px 1fr;gap:28px">
    <div class="card rs" style="height:640px;position:relative">${badge('exp', '经典实验')}<span class="note" style="margin-left:10px">Iyengar & Lepper, 2000</span>
      <div class="p" style="margin:22px 0 18px">超市试吃台：24 种果酱 vs 6 种</div>
      <div class="jm"><span>停下来试吃</span><div><i style="--v:60;background:#B7791F"></i><em>60%</em></div><div><i style="--v:40;background:#E4C88F"></i><em>40%</em></div></div>
      <div class="jm"><span>最后购买</span><div><i style="--v:3;background:#B7791F"></i><em>3%</em></div><div><i style="--v:30;background:#E4C88F"></i><em>30%</em></div></div>
      <div style="display:flex;gap:20px;font-size:19px;color:var(--ink3)"><span><i class="lgs" style="background:#B7791F"></i>24 种</span><span><i class="lgs" style="background:#E4C88F"></i>6 种</span></div>
      <div class="p" style="position:absolute;left:34px;right:34px;bottom:26px;padding-top:16px;border-top:1px solid var(--line);font-size:21px">常被简化成：“选项越少越好”。</div></div>
    <div class="card rs meta" style="height:640px;position:relative">${badge('meta', '元分析')}<span class="note" style="margin-left:10px">Scheibehenne 等, 2010</span>
      <div class="p" style="margin:22px 0 6px">50 项实验 · 5036 人</div><svg id="fp" width="470" height="330"></svg>${note('每条横线代表一项研究，位置示意')}
      <div class="p" style="position:absolute;left:34px;right:34px;bottom:26px;padding-top:16px;border-top:1px solid var(--line);font-size:21px"><b>平均效应几乎为零</b>，研究之间差异很大。</div></div>
    <div class="cond"><div class="lk">过载在什么时候出现</div><div class="note" style="margin:-6px 0 12px">Chernev 等, 2015 · 元分析</div>
      ${rule('var(--decide)', '选项难以比较', '属性多、单位不统一、没有并排对比。')}${rule('var(--decide)', '任务本身难', '时间紧，或后果重要。')}${rule('var(--decide)', '偏好还不确定', '用户自己也没想好要什么。')}</div></div>`);
  c.out(H, c.b(1)); c.in(J.children[0], c.b(1) + .1);
  const fp = J.querySelector('#fp'); reseed(5); let fh = '<line x1="235" y1="10" x2="235" y2="300" stroke="#16181D" stroke-width="2"/><text x="235" y="322" text-anchor="middle" font-size="16" fill="#7C818C">0</text><text x="10" y="322" font-size="16" fill="#7C818C">多反而更好</text><text x="460" y="322" text-anchor="end" font-size="16" fill="#7C818C">多导致过载</text>';
  for (let i = 0; i < 26; i++) { const x = 235 + (rnd() + rnd() + rnd() - 1.5) * 150, y = 18 + i * 10.4, w = 10 + rnd() * 40; fh += `<g class="fr"><line x1="${x - w}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#CBC6BB" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="#454A55"/></g>`; }
  fh += '<path class="dm" d="M225 290 L235 280 L245 290 L235 300Z" fill="#1F7A4D"/>'; fp.innerHTML = fh;
  c.in(J.children[1], c.b(2) + .1); c.stagger(fp.querySelectorAll('.fr'), c.b(2) + .6, .06, { dy: 0, d: .2 }); c.in(fp.querySelector('.dm'), c.b(2) + c.sc.beats[2].d * .4, { dy: 0, scale: .3 });
  c.stagger(J.children[2].children, c.b(2) + c.sc.beats[2].d * .55, .6);
  // b3 降低比较难度 + 默认值
  const D = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div><div class="lk">所以：降低比较的难度，而不是砍选项</div>${rule('var(--ink)', '分组', '按楼层、按容量，把 30 间会议室分成几组。')}${rule('var(--ink)', '推荐与默认', '按人数和设备，先推荐一间。')}${rule('var(--ink)', '筛选与并排对比', '让差异一眼可见，而不是靠记忆比较。')}</div>
    <div class="card rs" style="min-height:560px">${badge('law', '实地数据 + 在线实验')}<span class="note" style="margin-left:10px">Johnson & Goldstein, 2003</span>
      <div class="ttl" style="margin:20px 0 20px">默认值：器官捐献同意率</div>
      <div class="dfb"><span>默认不同意<small>需要主动勾选</small></span><div><i style="--v:28" class="lo"></i><em>4% – 28%</em></div></div>
      <div class="dfb"><span>默认同意<small>需要主动退出</small></span><div><i style="--v:100"></i><em>86% – 99.98%</em></div></div>
      <div class="p" style="margin-top:20px">默认值本身就是一个设计决定。</div></div></div>`);
  c.out(J, c.b(3)); c.stagger(D.children[0].children, c.b(3) + .2, .6); c.in(D.children[1], c.b(3) + c.sc.beats[3].d * .5);
  c.anim(D.querySelector('.dfb i.lo'), [{ width: '0px' }, { width: 28 * 5 + 'px' }], c.b(3) + c.sc.beats[3].d * .6, .8);
  // b4 一个主操作
  const P = c.el(`<div class="abs" style="left:120px;top:260px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="height:420px"><div class="note">五个同样显眼的按钮</div><div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:40px">${['预约', '分享', '收藏', '重置', '复制链接'].map(x => `<span class="bx">${x}</span>`).join('')}</div></div>
    <div class="card rs" style="height:420px"><div class="note">一个主操作，其余降级</div><div style="margin-top:40px"><span class="bx pr">预约 10:00 – 11:00</span></div><div style="display:flex;gap:24px;margin-top:22px">${['分享', '收藏', '更多…'].map(x => `<span class="lnk">${x}</span>`).join('')}</div></div></div>`);
  const P2 = c.el(`<div class="abs p" style="left:120px;top:720px;width:1680px;font-size:24px">${badge('exp', '经验原则 · 满意即可')}<span style="margin-left:14px">西蒙：人做决定大多是“够好就行”，而不是找最优。</span></div>`);
  c.out(D, c.b(4)); c.in(P.children[0], c.b(4) + .1); c.in(P.children[1], c.b(4) + c.sc.beats[4].d * .4); c.in(P2, c.b(4) + .5);
  // b5 暗黑模式
  const Z = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    ${[['把取消藏得很深', '设置 › 账户 › 会员 › 管理 › 更多 › 取消'], ['默认勾选额外收费', '☑ 加购会议茶歇套餐（¥ 58）'], ['用愧疚的文案劝留', '“不了，我不在乎团队效率”']].map(([t, d]) => `<div class="card rs dk"><div class="ttl">${t}</div><div class="dkx">${d}</div><div class="stamp">✕</div></div>`).join('')}</div>`);
  const Z2 = c.el(`<div class="abs card rs" style="left:120px;top:720px;width:1680px;border-left:6px solid var(--ink)"><b style="font-size:26px">规范里写明边界：</b><span class="p" style="font-size:24px">默认值和引导，只能用来帮用户达成他自己的目标。</span></div>`);
  c.out(P, c.b(5)); c.out(P2, c.b(5)); c.stagger(Z.children, c.b(5) + .2, .7); c.stagger(Z.querySelectorAll('.stamp'), c.b(5) + c.sc.beats[5].d * .45, .2, { scale: 1.6, dy: 0, d: .3 }); c.in(Z2, c.b(5) + c.sc.beats[5].d * .65);
  const h2 = c.swapHead(h, '“选项越少越好”？证据没那么简单', c.b(1));
  const h3 = c.swapHead(h, '降低比较难度，认真对待默认值', c.b(3)); c.out(h2, c.b(3));
  const h4 = c.swapHead(h, '每一屏，一个主操作', c.b(4)); c.out(h3, c.b(4));
  c.swapHead(h, '同样的规律，也可能被反过来用', c.b(5)); c.out(h4, c.b(5));
});

S('a_motor', c => {
  const h = c.head('05', '越小、越远，越难点中');
  // b0 费茨
  const F = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1040px 1fr;gap:40px">
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验 · 费茨定律')}<span class="note" style="margin-left:12px">Fitts, 1954 · 香农形式 MacKenzie, 1992</span>
      <div style="font-size:46px;margin:28px 0 8px;font-family:'Latin Modern Math','DejaVu Serif',serif">T = a + b · log<sub style="font-size:.6em">2</sub>(D / W + 1)</div>
      <div class="note">T 用时 · D 距离 · W 目标宽度 · a、b 由实验拟合</div>
      <svg width="960" height="300" style="margin-top:24px" font-family="Inter,Noto Sans CJK SC">
        <circle cx="60" cy="150" r="14" fill="#16181D"/><text x="60" y="205" text-anchor="middle" font-size="20" fill="#7C818C">起点</text>
        <line x1="80" y1="150" x2="760" y2="150" stroke="#CBC6BB" stroke-width="2" stroke-dasharray="6 8"/>
        <g class="t1"><rect x="360" y="122" width="40" height="56" rx="8" fill="#F9D9CF" stroke="#D1492E" stroke-width="2"/><text x="380" y="225" text-anchor="middle" font-size="22" fill="#D1492E" font-weight="600">近 · 小</text><text x="380" y="100" text-anchor="middle" font-size="20" fill="#454A55" font-family="DejaVu Sans Mono">ID 3.2</text></g>
        <g class="t2"><rect x="690" y="70" width="140" height="160" rx="14" fill="#E3F1E9" stroke="#1F7A4D" stroke-width="2"/><text x="760" y="270" text-anchor="middle" font-size="22" fill="#1F7A4D" font-weight="600">远 · 大</text><text x="760" y="52" text-anchor="middle" font-size="20" fill="#454A55" font-family="DejaVu Sans Mono">ID 2.6</text></g>
        <rect x="900" y="0" width="60" height="300" fill="#E4EAFD"/><text x="930" y="160" text-anchor="middle" font-size="20" fill="#2F5BEA" writing-mode="tb">屏幕边缘</text></svg></div>
    <div><div class="lk">推论</div>${rule('var(--act)', '常用的放近、做大', '主按钮放在手指或光标最常停留的区域。')}${rule('var(--act)', '边缘和角落是“无限大”的目标', '光标冲过去会被屏幕边缘挡住——菜单栏放在顶边的理由。')}${rule('var(--act)', '危险操作反过来', '删除、退出这类操作，不要放在最顺手的地方。')}</div></div>`);
  c.in(F, .4); c.in(F.querySelector('.t1'), c.b(0) + 1.5, { dy: 0 }); c.in(F.querySelector('.t2'), c.b(0) + 2.5, { dy: 0 }); c.stagger(F.children[1].children, c.b(0) + c.sc.beats[0].d * .55, .6);
  // b1 转向定律
  const T = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1040px 1fr;gap:40px">
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验 · 转向定律')}<span class="note" style="margin-left:12px">Accot & Zhai, 1997</span>
      <svg width="960" height="420" style="margin-top:16px" font-family="Inter,Noto Sans CJK SC">
        <rect x="40" y="40" width="260" height="360" rx="12" fill="#fff" stroke="#E0DCD3" stroke-width="2"/>
        ${['会议室', '设备', '日程', '帮助'].map((x, i) => `<rect x="48" y="${50 + i * 64}" width="244" height="56" rx="8" fill="${i === 0 ? '#EEF2FE' : '#fff'}"/><text x="70" y="${86 + i * 64}" font-size="22" fill="#16181D">${x}</text><text x="270" y="${86 + i * 64}" font-size="22" fill="#7C818C">›</text>`).join('')}
        <rect x="300" y="50" width="280" height="300" rx="12" fill="#fff" stroke="#E0DCD3" stroke-width="2"/>
        ${['三楼 · 青松厅', '三楼 · 竹影厅', '五楼 · 观澜厅', '五楼 · 听雨厅'].map((x, i) => `<text x="324" y="${96 + i * 64}" font-size="22" fill="#16181D">${x}</text>`).join('')}
        <path class="tun" d="M 292 62 L 300 62 L 300 112 L 292 112 Z" fill="#D1492E" opacity=".25"/>
        <path class="crs" d="M 180 78 C 260 80, 300 140, 330 280" stroke="#16181D" stroke-width="3" fill="none" stroke-dasharray="6 6"/>
        <path class="tri" d="M 200 78 L 300 50 L 300 350 Z" fill="#1F7A4D" opacity=".18"/>
</svg>
      <div class="p tl1" style="font-size:22px;color:#D1492E">✕ 直线斜着过去：会划过“设备”，子菜单被关掉</div>
      <div class="p tl2" style="font-size:22px;color:#1F7A4D">✓ 安全三角：朝子菜单方向移动时，不收起</div></div>
    <div><div class="lk">推论</div>${rule('var(--act)', '通道越长越窄，越难走', '多级菜单、细长的滑块、狭窄的拖拽区。')}${rule('var(--act)', '给移动留容错', '安全三角区，或延迟两三百毫秒再收起。')}</div></div>`);
  c.out(F, c.b(1)); c.in(T, c.b(1) + .1); c.in(T.querySelector('.crs'), c.b(1) + 2, { dy: 0 }); c.in(T.querySelector('.tl1'), c.b(1) + 2.6, { dy: 0 });
  c.in(T.querySelector('.tri'), c.b(1) + c.sc.beats[1].d * .6, { dy: 0 }); c.in(T.querySelector('.tl2'), c.b(1) + c.sc.beats[1].d * .62, { dy: 0 }); c.stagger(T.children[1].children, c.b(1) + 1, .8);
  // b2 触控尺寸
  const G = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card" style="padding:16px 40px;min-height:620px">
      <div class="tg"><div class="sq" style="--s:44"></div><div><b>44 × 44 pt</b><p>Apple 人机界面指南</p></div>${badge('conv', '平台约定')}</div>
      <div class="tg"><div class="sq" style="--s:48"></div><div><b>48 × 48 dp</b><p>Material Design</p></div>${badge('conv', '平台约定')}</div>
      <div class="tg"><div class="sq" style="--s:24"></div><div><b>24 × 24 CSS px</b><p>WCAG 2.2 · 2.5.8（AA 底线）</p></div>${badge('std', '现行标准')}</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">图标可以小，可点区域要大</div>
      <div style="display:flex;gap:60px;margin-top:50px;justify-content:center">
        ${[0, 1, 2].map(i => `<div class="hit"><span class="ic">${['✎', '⤴', '✕'][i]}</span></div>`).join('')}</div>
      <div class="note" style="text-align:center;margin-top:20px">图标 20 · 可点区域 48 · 间隔 8 以上</div>
      <div class="p" style="margin-top:50px">相邻目标之间留出间隔，避免误触——尤其是“编辑”挨着“删除”。</div></div></div>`);
  c.out(T, c.b(2)); c.in(G, c.b(2) + .1); c.stagger(G.querySelectorAll('.tg'), c.b(2) + .5, .9);
  G.querySelectorAll('.hit').forEach((e, i) => c.anim(e, [{ boxShadow: 'inset 0 0 0 0 rgba(209,73,46,0)' }, { boxShadow: 'inset 0 0 0 2px rgba(209,73,46,.8)' }], c.b(2) + c.sc.beats[2].d * .55 + i * .2, .4));
  // b3 空间记忆
  const M = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px">
    <div class="card rs" style="min-height:620px"><div class="ttl">固定菜单</div><div class="mn mfix">${['预约', '我的预约', '会议室', '设备', '设置'].map(x => `<div>${x}</div>`).join('')}</div><div class="note">位置不变，靠记忆直接点</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">按使用频率自动重排</div><div class="mn mad">${['预约', '我的预约', '会议室', '设备', '设置'].map((x, i) => `<div class="m${i}">${x}</div>`).join('')}</div><div class="note">每次都要重新找</div></div>
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验')}<div class="note" style="margin-top:8px">Findlater & McGrenere, 2004</div><div class="p" style="margin-top:24px">比较固定、自适应、可自定义三种菜单：<b>固定菜单比自动重排的更快</b>，用户也更喜欢可以自己调整的。</div><div class="p" style="margin-top:24px">推论：常用位置要稳定，<b>不要让界面自作主张地挪动东西</b>。</div></div></div>`);
  c.out(G, c.b(3)); c.stagger(M.children, c.b(3) + .1, .5);
  const mv = [[0, 2], [1, 0], [2, 1]];
  c.anim(M.querySelector('.mad .m2'), [{ transform: 'none' }, { transform: 'translateY(-136px)' }], c.b(3) + 2.4, .5, 'io');
  c.anim(M.querySelector('.mad .m0'), [{ transform: 'none' }, { transform: 'translateY(68px)' }], c.b(3) + 2.4, .5, 'io');
  c.anim(M.querySelector('.mad .m1'), [{ transform: 'none' }, { transform: 'translateY(68px)' }], c.b(3) + 2.4, .5, 'io');
  // b4 响应时间
  const R = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px">
    <div class="card rs">${badge('exp', '经验阈值')}<span class="note" style="margin-left:12px">Miller 1968 · Card 等 1991 · Nielsen 1993</span>
      <div class="rt">${[['0.1 秒', '觉得是即时的', '按下、开关、输入回显', 10], ['1 秒', '思路不会被打断', '翻页、提交、筛选', 35], ['10 秒', '注意力开始离开', '超过就要有进度和可取消', 100]].map(([a, b, d, w], i) => `<div class="rr r${i}"><div class="bar" style="--w:${w}"></div><div><b>${a}</b><span>${b}</span><em>${d}</em></div></div>`).join('')}</div></div></div>`);
  c.out(M, c.b(4)); c.in(R, c.b(4) + .1); c.stagger(R.querySelectorAll('.rr'), c.b(4) + 1.2, c.sc.beats[4].d * .18);
  // b5 进度与等待
  const W = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验')}<span class="note" style="margin-left:12px">Harrison 等, 2007</span><div class="ttl" style="margin:20px 0 30px">时长相同的两种进度条</div>
      <div class="pb"><span>匀速</span><div><i class="p1"></i></div></div><div class="pb"><span>前慢后快</span><div><i class="p2"></i></div></div><div class="note" style="margin-top:18px">后者让人感觉更快</div></div>
    <div><div class="lk">缩短“感到的”等待</div>${rule('var(--confirm)', '乐观更新', '先显示成功，后台失败再回滚并说明。')}${rule('var(--confirm)', '骨架屏', '先给出页面结构，内容到了再填进去。')}${rule('var(--confirm)', '可撤销', '比“确定要删除吗？”更快，也更不容易误操作。')}</div></div>`);
  c.out(R, c.b(5)); c.in(W, c.b(5) + .1); c.stagger(W.children[1].children, c.b(5) + c.sc.beats[5].d * .5, .5);
  const P0 = c.b(5) + 1.5, PD = 4;
  c.anim(W.querySelector('.p1'), [{ width: '0%' }, { width: '100%' }], P0, PD, 'lin');
  c.anim(W.querySelector('.p2'), [{ width: '0%' }, { width: '100%' }], P0, PD, 'cubic-bezier(.6,0,.9,.6)');
  const h2 = c.swapHead(h, '通道越长越窄，越难走', c.b(1));
  const h3 = c.swapHead(h, '手指比光标粗得多', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '熟练的人，靠记住位置', c.b(3)); c.out(h3, c.b(3));
  const h5 = c.swapHead(h, '确认：响应时间的三档', c.b(4)); c.out(h4, c.b(4));
  c.swapHead(h, '等待的长短，也能被设计', c.b(5)); c.out(h5, c.b(5));
});

S('a_aesth', c => {
  const h = c.head('06', '好看，本身也影响好用');
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验 · 审美—可用性效应')}<div class="note" style="margin-top:8px">Kurosu & Kashimura, 1995 · Tractinsky, 1997</div>
      <div style="display:flex;gap:30px;margin-top:30px">
        <div class="atm a1">${Array.from({ length: 12 }, (_, i) => `<i style="width:${[40, 70, 55][i % 3]}%;margin-left:${(i * 37) % 30}%"></i>`).join('')}</div>
        <div class="atm a2">${Array.from({ length: 6 }, () => `<i></i>`).join('')}</div></div>
      <div class="p" style="margin-top:28px">取款机界面：<b>觉得越美观的，也觉得越好用</b>——在真正使用之前就是如此。</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">相关，不等于因果</div>
      <svg width="700" height="380" style="margin-top:18px" font-family="Inter,Noto Sans CJK SC" class="sc"></svg>${note('散点示意')}</div></div>`);
  c.in(A, .4); reseed(3);
  let sv = '<line x1="60" y1="330" x2="680" y2="330" stroke="#CBC6BB"/><line x1="60" y1="20" x2="60" y2="330" stroke="#CBC6BB"/><text x="370" y="368" text-anchor="middle" font-size="18" fill="#7C818C">觉得多美观 →</text><text x="20" y="175" font-size="18" fill="#7C818C" transform="rotate(-90 20 175)" text-anchor="middle">觉得多好用 →</text>';
  for (let i = 0; i < 60; i++) { const x = rnd(), y = Math.min(1, Math.max(0, x * .7 + rnd() * .35)); sv += `<circle class="sd" cx="${70 + x * 590}" cy="${320 - y * 290}" r="7" fill="#2F5BEA" opacity=".6"/>`; }
  A.querySelector('.sc').innerHTML = sv; c.stagger(A.querySelectorAll('.sd'), c.b(0) + 3, .03, { dy: 0, scale: .2, d: .25 });
  // b1 流畅性
  const B = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:500px"><div class="note">同一段话 · 难读的版本</div><div style="margin-top:30px;font-size:20px;line-height:1.3;color:#A3A8B1;letter-spacing:.1em;font-weight:300;text-align:justify">预约需提前二十四小时提交，超过四小时的会议需要部门负责人审批，取消预约请至少提前两小时操作，否则系统将记录违约一次，累计三次违约将暂停预约权限一个月。</div></div>
    <div class="card rs" style="min-height:500px"><div class="note">同一段话 · 好读的版本</div><div style="margin-top:30px;font-size:24px;line-height:1.75;color:var(--ink)"><b>提前 24 小时预约。</b><br>超过 4 小时需审批。<br>取消请提前 2 小时，否则记一次违约；<br>累计 3 次，暂停预约一个月。</div></div></div>`);
  const B2 = c.el(`<div class="abs" style="left:120px;top:800px;width:1680px;display:flex;gap:14px;align-items:center">${badge('law', '综述 · 加工流畅性')}<span class="note">Reber, Schwarz & Winkielman, 2004</span><span class="p" style="margin-left:10px">越容易加工，越被觉得美、可信——<b>清晰本身就是美感的来源</b>。</span></div>`);
  c.out(A, c.b(1)); c.stagger(B.children, c.b(1) + .1, .8); c.in(B2, c.b(1) + c.sc.beats[1].d * .5);
  // b2 50 毫秒
  const C = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验')}<span class="note" style="margin-left:12px">Lindgaard 等, 2006 · Tuch 等, 2012</span>
      <div style="display:flex;align-items:baseline;gap:16px;margin-top:40px"><span class="big" style="font-size:120px">17–50</span><span style="font-size:36px;font-weight:700">毫秒</span></div>
      <div class="p" style="margin-top:20px">网页只闪现这么短，人就已经形成了美丑判断。</div><div class="flash5"></div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">两个维度</div><div class="q2">
      <div class="qq best">简单 · 典型<b>评价最高</b></div><div class="qq">复杂 · 典型</div><div class="qq">简单 · 不典型</div><div class="qq worst">复杂 · 不典型</div></div>
      <div class="note" style="margin-top:12px">视觉复杂度越低、越像这一类网站的典型样子，第一印象越好</div></div></div>`);
  c.out(B, c.b(2)); c.out(B2, c.b(2)); c.in(C.children[0], c.b(2) + .1); c.in(C.children[1], c.b(2) + c.sc.beats[2].d * .5);
  // b3 峰终
  const D = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1040px 1fr;gap:40px">
    <div class="card rs" style="min-height:620px">${badge('law', '单项实验 · 峰终定律')}<span class="note" style="margin-left:12px">Kahneman 等, 1993</span>
      <svg width="960" height="420" style="margin-top:20px" font-family="Inter,Noto Sans CJK SC">
        <line x1="40" y1="210" x2="940" y2="210" stroke="#CBC6BB" stroke-dasharray="4 6"/>
        <path class="cv" d="M40 210 C120 200, 160 240, 220 230 S 330 120, 380 90 S 470 230, 540 250 S 650 300, 720 280 S 840 150, 920 120" stroke="#7445D6" stroke-width="5" fill="none"/>
        <circle class="pk" cx="380" cy="90" r="14" fill="#1F7A4D"/><text x="380" y="58" text-anchor="middle" font-size="22" fill="#1F7A4D" class="pk">峰：成功的那一刻</text>
        <circle class="en" cx="920" cy="120" r="14" fill="#2F5BEA"/><text x="910" y="88" text-anchor="end" font-size="22" fill="#2F5BEA" class="en">终：流程的最后一步</text>
        <circle class="lo" cx="660" cy="298" r="14" fill="#D1492E"/><text x="660" y="340" text-anchor="middle" font-size="22" fill="#D1492E" class="lo">谷：出错——恢复得好，也能变成好的记忆</text></svg>${note('体验曲线示意')}</div>
    <div><div class="lk">值得多花心思的时刻</div>${rule('var(--confirm)', '成功的那一刻', '预约成功：一句确定的话，一个清楚的结果。')}${rule('var(--confirm)', '出错后的恢复', '说清楚发生了什么、怎么办，并保住已填的内容。')}${rule('var(--confirm)', '最后一步', '结束页别只剩一个“返回首页”。')}</div></div>`);
  c.out(C, c.b(3)); c.in(D, c.b(3) + .1); c.in(D.querySelector('.cv'), c.b(3) + .8, { dy: 0, d: 1 });
  ['.pk', '.en', '.lo'].forEach((s, i) => D.querySelectorAll(s).forEach(e => c.in(e, c.b(3) + c.sc.beats[3].d * (.4 + i * .12), { dy: 0, scale: .6 })));
  c.stagger(D.children[1].children, c.b(3) + c.sc.beats[3].d * .55, .5);
  // b4 装饰的线
  const E = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card" style="min-height:620px;overflow:hidden;position:relative"><div class="deco1"></div><div class="dtx"><div style="font-size:20px;opacity:.8">青松 · 会议室</div><div style="font-size:44px;font-weight:700;line-height:1.2;margin:8px 0 18px">今天下午，<br>还有 3 间空着</div><span>立即预约</span></div><div class="lab2">克制：装饰在背景层，文字区留白</div></div>
    <div class="card" style="min-height:620px;overflow:hidden;position:relative"><div class="deco2"></div><div class="dtx dtx2"><div style="font-size:20px">青松 · 会议室</div><div style="font-size:44px;font-weight:700;line-height:1.2;margin:8px 0 18px">今天下午，<br>还有 3 间空着</div><span>立即预约</span></div><div class="lab2">过量：复杂度上去，流畅性下来</div></div></div>`);
  c.out(D, c.b(4)); c.stagger(E.children, c.b(4) + .2, .8);
  const h2 = c.swapHead(h, '清晰本身，就是美感的来源', c.b(1));
  const h3 = c.swapHead(h, '第一印象只要几十毫秒', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '体验被记住的，是峰值和结尾', c.b(3)); c.out(h3, c.b(3));
  c.swapHead(h, '给装饰划一条线', c.b(4)); c.out(h4, c.b(4));
});

S('a_principle', c => {
  const h = c.head('07', '先盘点，再写原则');
  const A = c.el(`<div class="abs card" style="left:120px;top:250px;width:1000px;height:640px;padding:30px 44px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:28px">现有 38 个页面里找到的</b><span class="note">截图墙 · 逐项计数</span></div>
    <div class="au"><div class="al">蓝色</div><div class="sw" id="blues"></div><div class="cnt"><span class="n" data-n="14">0</span> 种</div></div>
    <div class="au"><div class="al">圆角</div><div class="rd" id="radii"></div><div class="cnt"><span class="n" data-n="9">0</span> 种</div></div>
    <div class="au"><div class="al">按钮</div><div class="bt" id="btns"></div><div class="cnt"><span class="n" data-n="11">0</span> 种</div></div>
    <div class="au"><div class="al">字号</div><div class="fz" id="sizes"></div><div class="cnt"><span class="n" data-n="13">0</span> 种</div></div>
    <div class="goal" style="position:absolute;left:44px;right:44px;bottom:28px;padding-top:16px;border-top:1px solid var(--line);font-size:23px;color:var(--ink2)">收敛目标：<b style="color:var(--ink)">1 条蓝色色阶 · 3 种圆角 · 3 种按钮 · 6 级字号</b></div></div>`);
  const blues = ['#1E6FFF', '#2F5BEA', '#3478F6', '#1890FF', '#2B6DE5', '#4A7DFF', '#0A66C2', '#3366CC', '#2962FF', '#1A73E8', '#4F7CF7', '#2D5BD9', '#3D6EF2', '#0F62FE'];
  A.querySelector('#blues').innerHTML = blues.map(x => `<i style="background:${x}"></i>`).join('');
  A.querySelector('#radii').innerHTML = [0, 2, 3, 4, 6, 8, 10, 12, 16].map(r => `<i style="border-radius:${r}px"></i>`).join('');
  A.querySelector('#btns').innerHTML = [['#1E6FFF', '#fff', 2, ''], ['#2F5BEA', '#fff', 8, ''], ['#fff', '#1890FF', 4, '1px solid #1890FF'], ['#0A66C2', '#fff', 20, ''], ['#eee', '#333', 3, ''], ['#fff', '#2962FF', 0, '2px solid #2962FF'], ['#1A73E8', '#fff', 6, ''], ['#3366CC', '#fff', 12, ''], ['#f5f5f5', '#1E6FFF', 8, '1px dashed #1E6FFF'], ['#4A7DFF', '#fff', 16, ''], ['#fff', '#666', 4, '1px solid #ccc']].map(([b, cc, r, bd]) => `<i style="background:${b};color:${cc};border-radius:${r}px;border:${bd || '0'}">提交</i>`).join('');
  A.querySelector('#sizes').innerHTML = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30].map(s => `<span style="font-size:${s}px">字</span>`).join('');
  c.in(A, .4); A.querySelectorAll('.au').forEach((r, i) => c.stagger(r.children[1].children, c.b(0) + 2 + i * 1.1, .05, { dy: 0, scale: .6, d: .25 }));
  A.querySelectorAll('.n').forEach((e, i) => { const n = +e.dataset.n, t0 = c.b(0) + 2 + i * 1.1; c.tick(t => { e.textContent = Math.max(0, Math.min(n, Math.round((t - t0) / .05))); }); });
  c.in(A.querySelector('.goal'), c.b(1) + c.sc.beats[1].d * .5);
  // 右：原则
  const P = c.el(`<div class="abs" style="left:1170px;top:250px;width:630px"><div class="cap" style="margin-bottom:16px">设计原则：可判断、有取舍</div>
    ${[['任务先于装饰', '同一屏里，完成任务的元素永远最显眼。', '视觉搜索'], ['一屏一个主操作', '主按钮只有一个，其余降为次要。', '决策 · 满意即可'], ['动起来，是为了说明变化', '没有状态变化，就不加动效。', '注意力抢占']].map(([t, d, g], i) => `<div class="pr"><b>0${i + 1}</b><div><h4>${t}</h4><p>${d}</p><span class="tag pg">依据：${g}</span></div></div>`).join('')}
    <p class="anti note" style="margin:18px 4px 0;line-height:1.5;font-size:20px">反例：“简洁、美观、易用”——谁都同意，所以判断不了任何事。</p></div>`);
  c.stagger(P.querySelectorAll('.pr'), c.b(2) + 1.5, .9); c.in(P.querySelector('.cap'), c.b(2) + .5); c.in(P.querySelector('.anti'), c.b(2) + c.sc.beats[2].d * .78);
  P.querySelectorAll('.pg').forEach((e, i) => c.in(e, c.b(4) + .5 + i * .4, { dy: 0, scale: .8 }));
  // b3 优先级与决策记录（替换左侧）
  const L = c.el(`<div class="abs" style="left:120px;top:250px;width:1000px">
    <div class="card rs" style="margin-bottom:20px"><div class="ttl">原则冲突时，按顺序让步</div><div class="ord">${['任务先于装饰', '一屏一个主操作', '信息密度 · 让位于易读'].map((x, i) => `<div><i>${i + 1}</i>${x}</div>`).join('')}</div></div>
    <div class="card rs log"><div style="display:flex;justify-content:space-between"><b style="font-size:24px">决策记录 · 0007</b><span class="note">2026-03-12</span></div>
      <div class="p" style="margin-top:12px;font-size:21px">决定：预约页去掉“重置”按钮。<br>理由：误触率高，且与“提交”同等显眼（违背原则 02）。<br>放弃：一键清空——改为逐项清除。</div></div></div>`);
  c.out(A, c.b(3)); c.in(L.children[0], c.b(3) + .2); c.in(L.children[1], c.b(3) + c.sc.beats[3].d * .5);
  const N = c.el(`<div class="abs" style="left:120px;top:800px;width:1000px;display:flex;gap:12px;align-items:center"><span class="cap">下集：</span>${['颜色', '排版与空间', '动效', '装饰', '组件', '治理'].map(x => `<span class="tag" style="font-size:20px">${x}</span>`).join('')}</div>`);
  c.in(N, c.b(4) + c.sc.beats[4].d * .5);
  c.swapHead(h, '原则要能追溯到依据', c.b(4)); c.out(h.querySelector('h1'), c.b(4));
});

S('a_end', c => {
  const h = c.head('08', '上集小结');
  const mx = c.el(matrix(120, 250, 1680, 2));
  c.stagger(mx.querySelectorAll('.mh,.rh'), .4, .05);
  c.stagger(mx.querySelectorAll('.mc.r0'), 1, .12, { scale: .9, dy: 0 }); c.stagger(mx.querySelectorAll('.mc.r1'), 2, .12, { scale: .9, dy: 0 });
  c.stagger(mx.querySelectorAll('.mc.dim'), 3, .03, { dy: 0 });
  const nx = c.el(`<div class="abs" style="left:120px;top:830px;width:1680px;display:flex;justify-content:space-between;align-items:center"><span class="p" style="font-size:24px">下集：把后两行填满——令牌、组件、动效、装饰与治理</span><span class="ep2">下集 · 搭建</span></div>`);
  c.in(nx, c.b(0) + c.sc.beats[0].d * .5);
});
