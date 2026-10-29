import { chromium } from '/home/claude/immortality-skills/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const J = [[1, 'a_multi', .66, { x: 460, y: 190, width: 1000, height: 780 }, -1], [2, 'b_d', .55, { x: 160, y: 190, width: 980, height: 760 }, -1], [3, 'c_bf3', .97, { x: 240, y: 200, width: 900, height: 700 }, -1], [4, 'c_benz', .97, { x: 190, y: 160, width: 1000, height: 780 }, -1]];
for (const [ep, id, fr, clip, bt] of J) {
  await p.goto('http://127.0.0.1:8191/v/page.html?ep=' + ep); await p.waitForFunction('window.ready', null, { timeout: 120000 });
  await p.evaluate(([id, fr]) => { seek(sceneAt(id, fr)); seek(sceneAt(id, fr) + .01); document.querySelectorAll('.lab3,.mode,.vlab,.legend,.rx,.det,.card,.cap,.hd,.top,.sub').forEach(e => e.style.visibility = 'hidden'); }, [id, fr]);
  await p.screenshot({ path: `cover/c${ep}.png`, clip }); console.log(ep);
}
await b.close();
