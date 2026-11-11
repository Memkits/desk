#!/bin/bash
cd /home/user && (curl -s -o /dev/null http://127.0.0.1:8195/dlgo/page.html || (nohup python3 -m http.server 8195 >/dev/null 2>&1 &)); sleep 1
cd /home/user/dlgo && rm -f tmp_* out/e*/*.part
for ep in 1; do for w in 0 1 2 3; do node render.mjs $ep $w 4 >> logs/r${ep}_$w.log 2>&1 & done; done
wait
for e in 1; do echo e$e $(ls out/e$e | grep -c done); done
