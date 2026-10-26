import subprocess, os, json
J='/home/claude/jit'; LJ=f'{J}/luajit-src/src/luajit'
env=dict(os.environ); env.pop('BUN_OPTIONS',None)
C={'v8 · 2 核':['node',f'{J}/b.js'],'v8 · 1 核':['taskset','-c','0','node',f'{J}/b.js'],'luajit · 1 核':['taskset','-c','0',LJ,f'{J}/b.lua'],'bun · 2 核':['bun',f'{J}/b.js'],'llvm_jit · 1 核':['taskset','-c','0','lli','-O2',f'{J}/bin/b.bc'],'clang_aot · 1 核':['taskset','-c','0',f'{J}/bin/c_o2']}
out={}
for case in ['poly','interp']:
    for k,cmd in C.items():
        r=subprocess.run(cmd+[case,'30'],capture_output=True,text=True,env=env).stdout.strip().split('\n')[0].split()
        out[f'{k}/{case}']=[float(x) for x in r]; print(k,case,r[:6],'...',r[-3:],flush=True)
json.dump(out,open('warm.json','w'))
