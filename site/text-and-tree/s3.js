// 下集 · AI 与预测
const PRED = (n, t, lv, label, body, ind) => `<div class="abs card pad pred" style="left:120px;top:250px;width:1680px;padding:36px 44px"><div class="num">${n}</div><div><div style="display:flex;gap:24px;align-items:center;margin-bottom:6px">${conf(lv, label)}</div><h3>${t}</h3><p class="p" style="font-size:26px">${body}</p><div class="ind"><b>观察指标：</b>${ind}</div></div></div>`;
const MAP = (o, os, n, ns) => `<div class="map2"><div class="o"><small>旧想法</small><b>${o}</b><span>${os}</span></div><div class="ar">→</div><div class="n"><small>新方案</small><b>${n}</b><span>${ns}</span></div></div>`;

S('c_open', c => {
  const { b } = c;
  show(c, `<div class="abs" style="left:120px;top:170px"><div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">文本与树 · 下集</div><div style="font:900 96px/1.15 var(--serif);margin-top:12px">AI 与预测</div></div>`, .1);
  show(c, `<div class="abs" style="left:120px;top:470px;display:flex;gap:20px">${['已经发生的六件事', '新方案在重复谁', '八个判断', '风险与建议'].map(t => `<div class="card pad" style="font:700 30px var(--serif)">${t}</div>`).join('')}</div>`, b(0) + 4);
  show(c, `<div class="abs" style="left:120px;top:640px;display:flex;gap:30px;align-items:center"><span class="p" style="font-size:26px">每个判断都标上</span>${conf(3, '较高')}${conf(2, '中等')}${conf(1, '较低')}</div>`, b(0) + 9);
});

S('c_now', c => {
  const { b, be } = c;
  c.head('01', '已经发生的六件事', '2023–2026');
  const n = (k, t) => `<div class="abs" style="left:120px;top:240px;display:flex;gap:16px;align-items:center"><span class="pill t-both" style="font-size:24px">第${k}件</span><span class="ttl" style="font-size:34px">${t}</span></div>`;
  // 1
  show(c, n('一', '大模型巩固了文本'), b(0) + .1, be(0) + .3);
  show(c, `<div class="abs" style="left:120px;top:340px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:24px"><div class="card pad"><div class="ttl">以文本训练，以文本输出</div><p class="p">训练数据、提示、补全、补丁：全是字符序列</p></div><div class="card pad"><div class="ttl">Darklang（2024）</div><p class="p">把“代码生成的世界”列为放弃结构编辑器的理由之一</p></div></div>`, b(0) + 1.5, be(0) + .3);
  // 2 智能体与结构
  show(c, n('二', '智能体在后台大量使用结构'), b(1) + .1, be(1) + .3);
  const ag = show(c, `<div class="abs" style="left:120px;top:340px;width:1680px;height:520px">
    <svg class="abs" width="1680" height="520"><g stroke="#B9AEDD" stroke-width="3">${[[260, 90], [260, 260], [260, 430], [1420, 90], [1420, 260], [1420, 430]].map(([x, y]) => `<path d="M840 260 L${x} ${y}"/>`).join('')}</g></svg>
    <div class="node op" style="left:840px;top:260px;background:var(--both);border-color:var(--both);height:100px;font:700 36px var(--sans);padding:0 40px">智能体</div>
    ${[['tree-sitter 仓库地图', 260, 90], ['语言服务器：跳转 · 重命名', 260, 260], ['诊断 · 类型检查', 260, 430], ['测试反馈', 1420, 90], ['按符号读取', 1420, 260], ['结构化替换', 1420, 430]].map(([t, x, y]) => `<div class="node tl2" style="left:${x}px;top:${y}px;font:600 24px var(--sans);border-color:var(--edit)">${t}</div>`).join('')}</div>`, b(1) + 1, be(1) + .3);
  c.stagger(ag.querySelectorAll('.tl2'), b(1) + 2, .7, { dy: 0, scale: .6 });
  // 3 类型洞
  show(c, n('三', '类型洞成为 AI 的上下文'), b(2) + .1, be(2) + .3);
  show(c, box(120, 340, 1000, `<div class="cap">Hazel 团队 · OOPSLA 2024（示意）</div><div class="code" style="margin-top:14px;font-size:26px;line-height:1.7">view model = div [<span style="border:2px dashed #8EC5FF;padding:0 8px;border-radius:6px">?</span>]<br><span class="cm">-- 洞的类型: Html Msg</span><br><span class="cm">-- 上下文: type Model = {…}, type Msg = …</span></div>`), b(2) + 1, be(2) + .3);
  show(c, `<div class="abs" style="left:1170px;top:340px;width:630px;display:flex;flex-direction:column;gap:16px"><div class="card pad"><div class="ttl">语言服务器 → 模型</div><p class="p">告诉模型洞的类型与周围定义</p></div><div class="card pad"><div class="ttl">类型定义影响最大</div><p class="p">并提议给 LSP 加扩展（ChatLSP）</p></div></div>`, b(2) + 4, be(2) + .3);
  // 4 约束解码
  show(c, n('四', '约束解码进入代码生成'), b(3) + .1, be(4) + .3);
  const tok = ['let', 'x', '=', 'f', '(', 'a', ',', 'b', ')', ';'], bad = { 4: ['=', 'let'], 7: [')', '='] };
  const cd = show(c, box(120, 340, 1680, `<div class="cap">每一步只允许语法 / 类型上合法的候选（示意）</div><div class="tk" style="display:flex;gap:12px;margin-top:22px;flex-wrap:wrap">${tok.map((t, i) => `<div class="tok" style="display:flex;flex-direction:column;align-items:center;gap:8px"><span class="code" style="padding:10px 18px;font-size:32px">${t}</span>${bad[i] ? bad[i].map(x => `<span class="code k bd" style="padding:4px 12px;font-size:22px;background:#F8E3DE;color:var(--bad);text-decoration:line-through">${x}</span>`).join('') : ''}</div>`).join('')}</div>`), b(3) + 1, be(3) + .3);
  c.stagger(cd.querySelectorAll('.tok'), b(3) + 2, .5, { dy: 8 });
  show(c, `<div class="abs" style="left:120px;top:640px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:24px"><div class="card pad" style="border-left:6px solid var(--ink3)"><small class="cap">1970s 语法制导编辑器</small><div class="ttl" style="margin-top:6px">人为“随时合法”付出粘滞度</div></div><div class="card pad" style="border-left:6px solid var(--both)"><small class="cap">2025 约束解码</small><div class="ttl" style="margin-top:6px">约束放在生成器上，人不再承担</div></div></div>`, b(4) + .2, be(4) + .3);
  // 5 节点图
  show(c, n('五', '节点图在 AI 流程里复兴'), b(5) + .1, be(5) + .3);
  show(c, fig('nodered', 120, 340, 900, 300, '节点图编排（Node-RED 示例）'), b(5) + 1, be(5) + .3);
  show(c, box(1070, 340, 730, `<div class="ttl">ComfyUI · n8n</div><p class="p">用连线图编排模型与工具；已出现由 AI 生成和修改节点图的助手</p>`), b(5) + 3, be(5) + .3);
  // 6 两种退出
  show(c, n('六', '两种相反的退出方式'), b(6) + .1, be(6) + .3);
  show(c, `<div class="abs" style="left:120px;top:340px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
    <div class="card pad"><span class="pill t-bad">Darklang · 2024</span><div class="ttl" style="margin-top:12px">放弃了树</div><p class="p">移除结构编辑器 · 存储改回文本 · 接入语言服务器</p></div>
    <div class="card pad"><span class="pill t-edit">Calcit · 2025–26</span><div class="ttl" style="margin-top:12px">只放弃了“用手编辑树”</div><p class="p">弃用人用的树编辑器（文档理由：转向 LLM 生成代码的工作流）· 保留树存储 · 编辑改为给智能体的结构化命令，带试运行与版本校验</p></div></div>`, b(6) + 1, be(6) + .3);
  // 总结
  const S4 = [['文本', '交流层面', '加强', 't-ok'], ['结构', '工具层面', '加强', 't-ok'], ['图形', '流程层面', '加强', 't-ok'], ['人手编辑结构', '', '削弱', 't-bad']];
  const sm = show(c, `<div class="abs" style="left:120px;top:300px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px">${S4.map(([a, d, v, k]) => `<div class="card pad s4"><div class="cap">${d || '&nbsp;'}</div><div class="ttl" style="font-size:34px;margin:8px 0 14px">${a}</div><span class="pill ${k}" style="font-size:24px">${v}</span></div>`).join('')}</div>`, b(7) + .2);
  c.stagger(sm.querySelectorAll('.s4'), b(7) + .5, 1.2, { dy: 12 });
  src(c, 'Darklang 博客 · Blinn et al. OOPSLA 2024 · Mündler et al. PLDI 2025 · calcit-lang/calcit 文档');
});

S('c_new', c => {
  const { b, be } = c;
  c.head('02', '新方案在重复谁', '执行者从人换成了模型');
  show(c, box(120, 260, 1680, `<div class="p" style="font-size:30px">把新方案放回历史坐标：几乎每一个都能找到对应的旧想法。</div>`), b(0) + .3, be(0) + .3);
  show(c, `<div class="abs" style="left:120px;top:260px;width:1680px">${MAP('意图编程（1990s）', '人编辑意图，机器维护代码', '规格驱动开发（2025）', 'Kiro · GitHub Spec Kit · Tessl：先写需求、设计与任务清单，再由智能体生成和更新代码')}</div>`, b(1) + .3, be(1) + .3);
  const m3 = show(c, `<div class="abs" style="left:120px;top:250px;width:1680px;display:flex;flex-direction:column;gap:16px">${MAP('语法制导编辑器', '只允许合法的树', '约束解码', '生成时只允许合法语法或类型')}${MAP('paredit · IDE 重构', '结构化编辑命令', '智能体的结构化工具', '重命名、按符号读取、结构化替换')}${MAP('程序变换系统', '按规则改写程序', 'AI 写规则 + 语义树上确定执行', '例如 OpenRewrite 配合 LLM')}</div>`, b(2) + .2, be(2) + .3);
  c.stagger(m3.querySelectorAll('.map2'), b(2) + .5, 3, { dy: 10 });
  const m4 = show(c, `<div class="abs" style="left:120px;top:250px;width:1680px;display:flex;flex-direction:column;gap:16px">${MAP('Code Bubbles（2010）', '以函数为单位的工作区', '画布 IDE（Haystack，2024）', '函数摆在无限画布上，AI 辅助导航与编辑')}${MAP('Sketchpad · GRAIL', '画出来就能跑', '草图即程序（tldraw Make Real，2023）', '画界面草图，模型生成可运行网页')}</div>`, b(3) + .2, be(3) + .3);
  c.stagger(m4.querySelectorAll('.map2'), b(3) + .5, 4, { dy: 10 });
  const m5 = show(c, `<div class="abs" style="left:120px;top:250px;width:1680px;display:flex;flex-direction:column;gap:16px">${MAP('SeeSoft · CodeCity', '全景可视化', 'DeepWiki（2025）', '为代码库自动生成架构说明与图示，可追问')}${MAP('Smalltalk · HyperCard', '用户改造自己的工具', '可塑软件（Ink & Switch，2025）', '借助 AI 改造自己的工具')}</div>`, b(4) + .2);
  c.stagger(m5.querySelectorAll('.map2'), b(4) + .5, 4, { dy: 10 });
  show(c, `<div class="abs" style="left:120px;top:720px"><span class="pill t-mid" style="font-size:22px">多数还在早期，缺少独立评估：这里只说做了什么、对应什么</span></div>`, b(4) + 9);
});

S('c_p', c => {
  const { b, be } = c;
  c.head('03', '八个判断', '');
  show(c, `<div class="abs" style="left:120px;top:280px;display:flex;flex-direction:column;gap:24px">${[[3, '较高'], [2, '中等'], [1, '较低']].map(([n, l]) => `<div style="transform:scale(1.6);transform-origin:0 0;height:50px">${conf(n, l)}</div>`).join('')}<div class="p" style="margin-top:30px;font-size:28px">每个判断附一个可以观察的指标，几年后可以回来对照</div></div>`, b(0) + .3, be(0) + .3);
  const P = [
    [1, '1', '结构化编辑的使用者，从人变成 AI', 3, '较高', '历史上结构编辑失败的主因是人手编辑的粘滞度；修改由智能体发起后，这个代价消失，“只产出合法修改”的价值上升。', '智能体工具中基于语法树与语言服务器的操作占比'],
    [3, '2', '瓶颈从写转到读，可视化需求回升', 3, '较高', '生成变便宜，审核变稀缺。需要回答具体问题的视图：改动影响了哪些调用者？行为差异在哪？', '代码评审工具中语义 diff 与影响面视图的普及'],
    [5, '3', '按需生成、用完即弃的可视化变多', 2, '中等', '过去为每个问题专门做视图成本太高；模型可以在几秒内为当前问题写一个。', '智能体输出中内联图表被实际使用的频率'],
    [7, '4', '文本仍是交换格式，但越来越像投影', 3, '较高', '人和模型都读写文本，网络效应更强；文本越来越多由格式化、生成器和约束解码产出，依据是背后的树与类型。', '仓库中手写格式差异趋近于零'],
    [8, '5', '未完成的程序成为一等公民', 2, '中等', '智能体大量工作在半成品状态：留洞、占位、待实现。类型洞这类机制可能走向工业语言与工具协议。', '主流语言或 LSP 是否正式支持洞与占位'],
    [9, '6', '领域节点图扩张，混合形态成为主流', 3, '较高', '粗粒度流程用图，方便人审阅；细粒度逻辑用代码，方便 AI 生成。', 'AI 流程平台的用户规模；节点内嵌代码的比例'],
    [10, '7', '编辑对象上移到规格与意图', 2, '中等', '意图编程的回潮。文学化编程和 UML 都曾试图让文档与代码同步，最后输给了维护成本。', '规格文件在仓库中的比例；规格过期导致的返工'],
    [11, '8', '非文本存储的语言获得第二次机会', 1, '较低', 'Calcit 这类项目说明，个别项目里树存储可交给智能体维护；但训练数据与生态仍以文本为主，生态税依然存在。', '这类语言的生态增长；模型操作非文本代码库的熟练度'],
  ];
  P.forEach(([bi, n, t, lv, l, body, ind], k) => {
    const next = P[k + 1] ? b(P[k + 1][0]) - .2 : null;
    show(c, PRED(n, t, lv, l, body, ind), b(bi) + .2, next, { dy: 14 });
  });
  // 风险提示（判断一、二后各一拍）
  const R = [[2, '可能出错：模型直接整段改写已经足够好，结构化操作收益不明显。若几年后智能体仍主要靠整段替换与 diff 补丁，这个判断要打折扣。'], [4, '可能出错：团队更多依赖自动化测试与模型互审，可视化需求转向测试结果与风险提示，而不是代码结构本身。'], [6, '这正是可塑开发（Glamorous Toolkit）的主张：为每个问题现场造一个检视器——过去靠熟练开发者手写，现在可以交给模型。']];
  R.forEach(([bi, t]) => show(c, box(120, 760, 1680, `<div class="p" style="font-size:26px">${t}</div>`, 'card pad', 'border-left:6px solid var(--bad)'), b(bi) + .2, be(bi) + .3));
});

S('c_risk', c => {
  const { b } = c;
  c.head('04', '可能走偏的地方', '');
  const R = [['同质化', '模型偏好训练数据里最常见的写法：新语言、新范式、新的编辑方式更难获得机会'], ['审核疲劳', '改动越快，人越容易放松检查；只让改动“看起来清楚”的可视化会制造虚假的安全感'], ['理解的空洞', '结构完全由模型操作，人对代码库的理解可能越来越浅；帮人建立心智模型的工具反而更重要']];
  R.forEach(([t, d], i) => show(c, box(120 + i * 570, 280, 530, `<div class="k cap">0${i + 1}</div><div class="ttl" style="font-size:40px;margin:10px 0 14px">${t}</div><p class="p">${d}</p>`, 'card pad', 'min-height:420px;border-top:6px solid var(--bad)'), b(i) + .2));
});

S('c_do', c => {
  const { b } = c;
  c.head('05', '如果你在做工具', '来自历史的五条建议');
  const A = [['先想清楚改哪一件', '存储、编辑、呈现、运行可见，别一次全改'], ['要改存储，就认真造桥', '能 diff、能合并、能贴进聊天框、能让模型读写'], ['给智能体结构化接口', '可能比给人做一个新编辑器更容易产生价值'], ['可视化先找具体问题', '高频、零配置，数据自动来'], ['让未完成也能被理解', '人与模型协作时尤其重要']];
  const at = [0, 1, 1, 2, 2];
  A.forEach(([t, d], i) => show(c, `<div class="abs card pad" style="left:120px;top:${250 + i * 132}px;width:1680px;display:flex;gap:26px;align-items:center;padding:20px 30px"><span style="font:700 40px var(--serif);color:var(--ink3);width:50px">${i + 1}</span><div><div class="ttl" style="font-size:30px">${t}</div><div class="p" style="font-size:23px">${d}</div></div></div>`, b(at[i]) + .3 + (i === 2 || i === 4 ? 5 : 0)));
});

S('c_end', c => {
  const { b, be } = c;
  c.head('06', '回到文本与树', '');
  const A = [['① 存储', '文本', 'var(--edit)'], ['② 编辑', '悄悄用树 → 主体变成模型', 'var(--both)'], ['③ 呈现', '按领域选择', 'var(--vis)'], ['④ 运行可见', '小而专', 'var(--vis)']];
  const g = show(c, `<div class="abs ax" style="left:120px;top:270px;width:1680px">${A.map(([n, v, col]) => `<div class="qa" style="border-top:6px solid ${col}"><h3 style="font-size:34px">${n}</h3><div class="v" style="font-size:26px;color:${col}">${v}</div></div>`).join('')}</div>`, b(0) + .3, be(1) + .3);
  c.stagger(g.querySelectorAll('.qa'), b(0) + 3, .8, { dy: 12 });
  c.anim(g.children[1], [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], b(1) + 4, .6);
  show(c, `<div class="abs" style="left:120px;top:200px;width:1680px;text-align:center"><div style="font:900 110px/1.2 var(--serif);margin-top:80px">文本与树</div><div class="p" style="font-size:30px;margin-top:20px">判断可能出错 · 观察指标留在这里 · 资料来源见简介与配套网页</div><div class="cap" style="margin-top:60px;font-size:22px">脚本与画面：Claude · 配音：Gemini TTS · 图片：Wikimedia Commons 与各项目 README</div></div>`, b(2) + .3);
});
