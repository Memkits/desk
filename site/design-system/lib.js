// 公共部件
window.SCENES = {};
const S = (id, build) => (window.SCENES[id] = { build });
const C5 = { 看见: 'var(--see)', 读懂: 'var(--read)', 决定: 'var(--decide)', 动手: 'var(--act)', 确认: 'var(--confirm)' };
const STAGES = ['看见', '读懂', '决定', '动手', '确认'];
const BADGE = { law: 'b-law', meta: 'b-law', exp: 'b-exp', std: 'b-std', conv: 'b-conv' };
const badge = (k, t) => `<span class="badge ${BADGE[k]}">${t}</span>`;
const box = (x, y, w, h, cls = 'card', st = '') => `<div class="abs ${cls}" style="left:${x}px;top:${y}px;width:${w}px;${h ? `height:${h}px;` : ''}${st}">`;
// 规则卡（推出的方法）
const rule = (c, t, d) => `<div class="rule" style="--c:${c}"><b>${t}</b><span>${d}</span></div>`;
// 图表 / 素材上的“示意”标注
const note = t => `<div class="note">${t}</div>`;

// ---------- 会议室预约：改造前 / 改造后 ----------
const phoneBad = (x, y) => `<div class="phone" style="left:${x}px;top:${y}px"><div class="scr"><div class="notch"></div><div class="sb"></div>
  <div class="bad"><div class="t">会议室预约申请表</div><div class="in">请输入日期</div>
  <div class="row"><div class="in">开始时间</div><div class="in">结束时间</div></div><div class="in">参会人数</div><div class="in">选择会议室</div>
  <div class="chk"><span><em></em>投影</span><span><em></em>白板</span><span><em></em>视频会议</span><span><em></em>茶歇</span></div>
  <div class="in" style="height:90px">备注</div>
  <div class="note">注意：预约需提前24小时，超过4小时需审批，取消请提前2小时，否则将记录违约一次，累计三次将暂停预约权限一个月。</div>
  <div class="btns"><span>重置</span><span>取消</span><span>提交</span></div></div></div></div>`;
const phoneGood = (x, y) => `<div class="phone" style="left:${x}px;top:${y}px"><div class="scr"><div class="notch"></div><div class="sb"></div>
  <div class="good"><div class="nav"><span>‹ 返回</span><span></span></div><h3>预约会议室</h3><div class="sum">10 月 28 日 周二 · 6 人</div>
  <div class="grp g1"><div class="lab">时间</div><div class="chips"><span>09:00</span><span class="on">10:00 – 11:00</span><span>14:00</span><span>更多</span></div></div>
  <div class="grp g2"><div class="lab">会议室</div><div class="fld">三楼 · 青松厅 <small>可坐 8 人 ›</small></div></div>
  <div class="grp g3"><div class="lab">设备</div><div class="chips"><span class="on">投影</span><span>白板</span><span class="on">视频会议</span></div></div>
  <div class="bar"><div class="s">超过 4 小时需要审批</div><div class="p">预约 10:00 – 11:00</div></div></div></div></div>`;

// ---------- 规范矩阵 ----------
const MROWS = ['人的规律', '设计原则', '可执行规则', '令牌与组件'];
const MCELLS = [
  ['特征越独特<br>越先被看到', '工作记忆<br>约四个组块', '选项难比较<br>才会过载', '又小又远<br>就难点中', '0.1 秒内<br>才算即时'],
  ['一处只用<br>一个特征突出', '认出来<br>比想起来容易', '一屏一个<br>主操作', '常用的<br>够大、够近', '状态<br>始终可见'],
  ['明度色阶<br>间距阶梯', '标签常驻<br>渐进披露', '推荐与<br>默认值', '可点区域<br>≥ 44 pt', '时长与缓动<br>全部状态'],
  ['color · space<br>type', '表单字段', '按钮层级', '尺寸令牌', 'motion<br>状态组件'],
];
function matrix(x, y, w, rowsOn = 1) {
  let h = `<div class="mx abs" style="left:${x}px;top:${y}px;width:${w}px"><div></div>${STAGES.map(s => `<div class="mh" style="--c:${C5[s]}">${s}</div>`).join('')}`;
  MROWS.forEach((r, i) => { h += `<div class="rh r${i}">${r}</div>` + MCELLS[i].map((c, j) => `<div class="mc r${i} c${j} ${i < rowsOn ? 'on' : 'dim'}">${c}</div>`).join(''); });
  return h + '</div>';
}

// ---------- 小图形 ----------
const dotsField = (id, w, h) => `<svg id="${id}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"></svg>`;
let _seed = 11; const rnd = () => (_seed = (_seed * 16807) % 2147483647) / 2147483647;
const reseed = s => (_seed = s);
const svgText = (x, y, t, o = '') => `<text x="${x}" y="${y}" font-family="Inter,Noto Sans CJK SC" ${o}>${t}</text>`;
