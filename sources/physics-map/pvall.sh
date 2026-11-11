#!/bin/bash
# 每个 beat 末尾截图：bash pvall.sh EP FRAC
ep=$1; fr=${2:-.92}
items=$(python3 -c "
import json;S=json.load(open('script.json'))
print(' '.join(f\"{s['id']}:{i}:$fr\" for s in S if s['ep']==$ep for i in range(len(s['beats']))))")
node pv.mjs $ep $items
