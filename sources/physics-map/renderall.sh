#!/bin/bash
cd /home/user && (curl -s -o /dev/null http://127.0.0.1:8194/pmv/page.html || (nohup python3 -m http.server 8194 >/dev/null 2>&1 &)); sleep 1
cd /home/user/pmv && rm -f tmp_* out/e*/*.part
for ep in 1 2 3 4 5; do for w in 0 1; do node render.mjs $ep $w 2 >> logs/r${ep}_$w.log 2>&1 & done; done
wait
for e in 1 2 3 4 5; do echo e$e $(ls out/e$e | grep -c done); done
