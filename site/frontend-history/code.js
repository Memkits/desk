// 代码卡。cols: [[标题, 源码, 颜色]]；行首 !! = 高亮
CODE.alllayers = { fn: '1997 年前后：同一个效果，两套代码', src: `// 找到 id 为 menu 的元素，把它显示出来
!!if (document.all) {                 // IE4
  document.all.menu.style.visibility = 'visible'
!!} else if (document.layers) {       // Netscape 4
  document.layers.menu.visibility = 'show'
}`, fs: 30, note: '后来的写法：先检测功能是否存在，而不是判断是哪个浏览器。' };
CODE.tablelayout = { fn: '1998 年风格的页面布局', src: `<table width="760" border="0" cellpadding="0">
  <tr>
    <td width="160" bgcolor="#003366">
!!      <font face="Arial" color="white" size="2">导航</font>
    </td>
!!    <td><img src="spacer.gif" width="20" height="1"></td>
    <td valign="top">正文……</td>
  </tr>
</table>`, fs: 26, note: '表格负责布局，font 负责字体，透明的 spacer.gif 负责留白。' };
CODE.jq = { fn: 'jQuery（2006）与今天的原生写法', cols: [['jQuery', `$('.item').addClass('on')

$.ajax({ url: '/api/list' })
  .done(data => render(data))

$(document).ready(init)`, '#5CB4FF'], ['原生 DOM / fetch', `document.querySelectorAll('.item')
  .forEach(el => el.classList.add('on'))

fetch('/api/list')
  .then(r => r.json()).then(render)

document.addEventListener('DOMContentLoaded', init)`, '#5FE0A0']], fs: 21, note: '库先解决问题，平台再把答案收编。' };
CODE.smoosh = { fn: 'SmooshGate（2018）', src: `// MooTools 早年给所有数组加了一个方法
Array.prototype.flatten = function () { /* … */ }

// 标准想加同名方法，会让依赖 MooTools 的老网站出错
!![[1, 2], [3]].flat()     // → [1, 2, 3]  最后改名为 flat
!![1, [2]].includes(2)     // includes 也曾因 MooTools 放弃 contains`, fs: 27 };
CODE.iife = { fn: '全局变量、命名空间与 IIFE', src: `<script src="jquery.js"></script>
<script src="plugin.js"></script>   <!-- 顺序错了就报错 -->
<script src="app.js"></script>

// 命名空间：YAHOO.util.Dom、YAHOO.widget.Calendar …
var MyApp = window.MyApp || {}

!!MyApp.cart = (function () {          // 立即执行函数，私有变量
  var items = []
  return { add: function (x) { items.push(x) } }
})()`, fs: 25 };
CODE.counter = { fn: '同一个计数器：jQuery · React · Vue', cols: [['jQuery：手动同步', `let n = 0
$('#btn').on('click', () => {
  n++
!!  $('#out').text(n)  // 要记得改界面
})`, '#FF7A93'], ['React：界面 = f(状态)', `function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>
!!    {n}
  </button>
}`, '#5CB4FF']], fs: 23, note: 'Vue：&lt;button @click="n++"&gt;{{ n }}&lt;/button&gt;，n 是响应式数据，改了界面自动更新。' };
CODE.async = { fn: '同一段异步逻辑的三代写法', cols: [['回调（~2010）', `getUser(id, function (err, u) {
  if (err) return fail(err)
  getOrders(u, function (err, os) {
    if (err) return fail(err)
    show(os)
  })
})`, '#FF7A93'], ['Promise → async/await', `getUser(id)
  .then(getOrders).then(show)
  .catch(fail)

!!const u = await getUser(id)   // ES2017
!!show(await getOrders(u))`, '#5FE0A0']], fs: 23 };
