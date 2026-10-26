import subprocess, os, time, statistics, json
J='/home/claude/jit'; LJ=f'{J}/luajit-src/src/luajit'; L54=f'{J}/lua-src/lua'
env=dict(os.environ); env.pop('BUN_OPTIONS',None)
C={'node':['node',f'{J}/b.js','hello','1'],'bun':['bun',f'{J}/b.js','hello','1'],'luajit':[LJ,f'{J}/b.lua','hello','1'],'lua54':[L54,f'{J}/b.lua','hello','1'],
 'rust':[f'{J}/bin/r_def','hello','1'],'clang_aot':[f'{J}/bin/c_o2','hello','1'],'llvm_jit (lli)':['lli','-O2',f'{J}/bin/b.bc','hello','1']}
out={}
for k,cmd in C.items():
    ws=[];rs=[]
    for i in range(12):
        t0=time.perf_counter(); p=subprocess.Popen(cmd,stdout=subprocess.DEVNULL,env=env); _,_,ru=os.wait4(p.pid,0); ws.append((time.perf_counter()-t0)*1000); rs.append(ru.ru_maxrss/1024)
    out[k]={'ms':statistics.median(ws[2:]),'rss':statistics.median(rs)}; print(k,out[k],flush=True)
json.dump(out,open('startup.json','w'))
