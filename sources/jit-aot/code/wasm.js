// 在 V8 里跑 C 编译出的 wasm：node wasm.js <case> <rounds>
const fs = require('fs');
const [name, R = '10'] = process.argv.slice(2);
const inst = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(__dirname + '/b.wasm')), {});
const f = inst.exports[name]; const out = []; let res = 0;
for (let r = 0; r < +R; r++) { const t0 = performance.now(); res = f(); out.push((performance.now() - t0).toFixed(2)); }
console.log(out.join(' ')); console.log('ck', res);
