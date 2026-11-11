#!/bin/bash
# 容器重启后：起服务 + 续渲染（已完成的场景有 .done 会跳过）
cd /home/user && (curl -s -o /dev/null http://127.0.0.1:8194/mmv/page.html || (setsid nohup python3 -m http.server 8194 >/dev/null 2>&1 < /dev/null &)); sleep 1
cd /home/user/mmv && rm -f tmp_*
for ep in ${EPS:-1 2 3 4}; do for w in 0 1; do pgrep -f "render.mjs $ep $w 2" >/dev/null || (setsid nohup node render.mjs $ep $w 2 >> logs/r${ep}_$w.log 2>&1 < /dev/null &); done; done
