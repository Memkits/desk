// 生成三种比例的封面：16:9、4:3、9:16（竖屏）
import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const S = { '169': [1920, 1080, '16x9'], '43': [1440, 1080, '4x3'], '916': [1080, 1920, '9x16竖屏'] };
for (const ep of [1, 2]) for (const [ar, [w, h, n]] of Object.entries(S)) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file://' + process.cwd() + `/cover.html?ep=${ep}&ar=${ar}`); await p.waitForTimeout(300);
  await p.screenshot({ path: `封面_${['', '上集', '下集'][ep]}_${n}.png` }); await p.close();
}
await b.close();
