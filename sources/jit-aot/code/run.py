import subprocess, os, json, time, sys, statistics
J='/home/claude/jit'
LJ=f'{J}/luajit-src/src/luajit'; L54=f'{J}/lua-src/lua'; BUN='bun'
CFG={
 'v8':        (['node',f'{J}/b.js'],'js',10), 'v8_noTF':(['node','--no-turbofan',f'{J}/b.js'],'js',5), 'v8_jitless':(['node','--jitless',f'{J}/b.js'],'js',3),
 'bun':       ([BUN,f'{J}/b.js'],'js',10),
 'luajit':    ([LJ,f'{J}/b.lua'],'lua',10), 'luajit_joff':([LJ,'-joff',f'{J}/b.lua'],'lua',3), 'lua54':([L54,f'{J}/b.lua'],'lua',3),
 'rust':      ([f'{J}/bin/r_def'],'rs',10), 'rust_native':([f'{J}/bin/r_nat'],'rs',10),
 'clang_aot': ([f'{J}/bin/c_o2'],'c',10), 'llvm_jit':(['lli','-O2',f'{J}/bin/b.bc'],'c',10), 'wasm_v8':(['node',f'{J}/wasm.js'],'c',10),
 'gcc_native':([f'{J}/bin/g_nat'],'c',10), 'gcc_pgo':([f'{J}/bin/g_pgo'],'c',10),
}
CASES={'js':['nbody','fib','mono','poly','trees','words','branchy','interp','matmul','rules_interp','rules_jit'],
 'lua':['nbody','fib','mono','poly','trees','words','branchy','interp','matmul','rules_interp','rules_jit'],
 'rs':['nbody','fib','mono','poly','trees','words','branchy','interp','matmul','rules_interp','rules_fixed'],
 'c':['nbody','fib','mono','poly','branchy','interp','matmul']}
def run(cmd):
    t0=time.perf_counter(); env=dict(os.environ); env.pop('BUN_OPTIONS',None); p=subprocess.Popen(cmd,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    _,st,ru=os.wait4(p.pid,0); wall=time.perf_counter()-t0; out=p.stdout.read(); err=p.stderr.read()
    return out,err,wall,ru.ru_maxrss/1024, ru.ru_utime+ru.ru_stime
res=json.load(open('res.json')) if os.path.exists('res.json') else {}
only=sys.argv[1:]
for name,(cmd,lang,R) in CFG.items():
    if only and name not in only: continue
    for c in CASES[lang]:
        key=f'{name}/{c}'
        if key in res: continue
        out,err,wall,rss,cpu=run(cmd+[c,str(R)])
        lines=out.strip().split('\n')
        try:
            ts=[float(x) for x in lines[0].split()]; ck=lines[-1].split(None,1)[1]
        except Exception: print('FAIL',key,err[-300:]); continue
        tail=ts[len(ts)//2:]
        res[key]={'first':ts[0],'peak':statistics.median(tail),'min':min(ts),'rounds':ts,'wall':wall,'rss':rss,'cpu':cpu,'ck':ck}
        print(f'{key:28s} first {ts[0]:9.1f} peak {res[key]["peak"]:9.1f} rss {rss:6.0f}MB cpu/wall {cpu/wall:4.2f} ck {ck}',flush=True)
        json.dump(res,open('res.json','w'),indent=0)
