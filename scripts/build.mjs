// 把 site/ 复制到 dist/。设置 ASSET_BASE 时，给每个 HTML 注入 <base>，让图片、脚本、样式从 COS 加载；
// 同时把页面内的相对链接改成相对于“当前页面地址”解析，这样 HTML 放在哪台服务器，页面间跳转就留在哪台服务器。
import { cpSync, rmSync, readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const SRC = 'site', OUT = 'dist', BASE = (process.env.ASSET_BASE || '').replace(/\/?$/, process.env.ASSET_BASE ? '/' : '');
rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });

const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const LINKS = `<script>addEventListener('DOMContentLoaded',()=>{for(const a of document.querySelectorAll('a[href]')){const h=a.getAttribute('href');if(/^([a-z]+:|\\/\\/)/i.test(h))continue;a.href=new URL(h,location.href).href}})</script>`;
let n = 0;
for (const f of walk(OUT).filter(f => f.endsWith('.html'))) {
  let html = readFileSync(f, 'utf8');
  if (!/^\s*<!doctype/i.test(html)) html = '<!doctype html>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' + html;
  if (BASE) {
    const dir = relative(OUT, dirname(f)).split('\\').join('/');
    const tag = `<base href="${BASE}${dir ? dir + '/' : ''}">${LINKS}`;
    html = html.replace(/<meta charset="utf-8">/i, m => m + '\n' + tag);
  }
  writeFileSync(f, html); n++;
}
console.log(`built ${n} html pages${BASE ? ' with asset base ' + BASE : ''}`);
