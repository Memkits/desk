"""把 ex/ 下的 旧写法/新写法 代码对生成 diffs.js（行级对照，供 diff:名 画面使用）。"""
import json, difflib, re, os
# 名: (新版本, 发布日期, 文件名标签, 旧写法标签, 新写法标签)
META = {
 'edition':        ('1.85', '2025-02-20', 'Cargo.toml', '2021 版次', '2024 版次'),
 'async_closure':  ('1.85', '2025-02-20', 'retry.rs · 异步闭包', 'Rust 1.84', 'Rust 1.85+'),
 'unsafe_extern':  ('1.85', '2025-02-20', 'ffi.rs · unsafe extern', '2021 版次', '2024 版次'),
 'let_chains':     ('1.88', '2025-06-26', 'greet.rs · let 链', 'Rust 1.84', 'Rust 1.88+ · 2024 版次'),
 'if_let_guard':   ('1.95', '2026-04-16', 'cmd.rs · if let 守卫', 'Rust 1.84', 'Rust 1.95+'),
 'assert_matches': ('1.96', '2026-05-28', 'tests.rs · assert_matches!', 'Rust 1.84', 'Rust 1.96+'),
 'upcast':         ('1.86', '2025-04-03', 'shape.rs · 向上转换', 'Rust 1.84', 'Rust 1.86+'),
 'infer_const':    ('1.89', '2025-08-07', 'arr.rs · 推断常量参数', 'Rust 1.84', 'Rust 1.89+'),
 'never':          ('1.100', '2026-11-12', 'name.rs · 从未类型 !', 'Rust 1.84', 'Rust 1.100'),
 'disjoint':       ('1.86', '2025-04-03', 'hp.rs · get_disjoint_mut', 'Rust 1.84', 'Rust 1.86+'),
 'extract_if':     ('1.87', '2025-05-15', 'tasks.rs · extract_if', 'Rust 1.84', 'Rust 1.87+'),
 'chunks':         ('1.88', '2025-06-26', 'pixels.rs · as_chunks', 'Rust 1.84', 'Rust 1.88+'),
 'windows':        ('1.94', '2026-03-05', 'rises.rs · array_windows', 'Rust 1.84', 'Rust 1.94+'),
 'push_mut':       ('1.95', '2026-04-16', 'tree.rs · push_mut', 'Rust 1.84', 'Rust 1.95+'),
 'boolok':         ('1.98', '2026-08-20', 'check.rs · ok_or / map_or_default', 'Rust 1.84', 'Rust 1.98+'),
 'trim':           ('1.100', '2026-11-12', 'url.rs · trim_prefix', 'Rust 1.84', 'Rust 1.100'),
 'atomic':         ('1.95', '2026-04-16', 'level.rs · 原子 update', 'Rust 1.84', 'Rust 1.95+'),
 'cfg_select':     ('1.95', '2026-04-16', 'dirs.rs · cfg_select!', 'Rust 1.84', 'Rust 1.95+'),
 'lock':           ('1.89', '2025-08-07', 'main.rs · 文件锁', '第三方库 fs2', 'Rust 1.89+ 标准库'),
 'alloc':          ('1.100', '2026-11-12', 'main.rs · 自定义分配器', '只能用 nightly', 'Rust 1.100 稳定版'),
 'warnings':       ('1.97', '2026-07-09', 'CI 配置 · 警告即错误', '旧做法', 'Cargo 1.97+'),
 'udeps':          ('1.100', '2026-11-12', '未使用依赖检查', '旧做法', 'Cargo 1.100'),
 'cooldown':       ('1.100', '2026-11-12', '依赖冷却期', '旧配置', 'Cargo 1.100'),
 'workspace':      ('1.99', '2026-10-01', '工作区依赖 · default-features', 'Cargo 1.98 及以前', 'Cargo 1.99+'),
}
def snip(p):
    s = open(p).read()
    if '//>' in s: s = s.split('//>\n', 1)[1].split('//<', 1)[0]
    return s.rstrip('\n').split('\n')
out = {}
for name, (ver, date, fn, lo, ln) in META.items():
    ext = 'rs' if os.path.exists(f'ex/{name}.old.rs') else 'sh'
    a, b = snip(f'ex/{name}.old.{ext}'), snip(f'ex/{name}.new.{ext}')
    rows = []  # [text, oldIdx, newIdx]
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'equal':
            rows += [[a[i1 + k], i1 + k, j1 + k] for k in range(i2 - i1)]
        else:
            rows += [[a[i], i, -1] for i in range(i1, i2)] + [[b[j], -1, j] for j in range(j1, j2)]
    w = lambda s: sum(1.75 if ord(ch) > 0x2e80 else 1 for ch in s)
    out[name] = dict(ver=ver, date=date, fn=fn, lo=lo, ln=ln, lang=ext, rows=rows, na=len(a), nb=len(b), wmax=max(w(r[0]) for r in rows))
open('diffs.js', 'w').write('window.DIFF = ' + json.dumps(out, ensure_ascii=False) + ';\n')
for k, v in out.items(): print(f"{k:15s} {v['na']:2d}→{v['nb']:2d} 行  最宽 {v['wmax']:.0f}")
