# 用法：bash pvall.sh EP [frac]  → 每个 beat 一张预览 + 拼图 sheet_eEP_*.jpg
EP=$1; FR=${2:-.9}
ITEMS=$(python3 -c "
import json;tl=json.load(open('tl_e$EP.json'))
print(' '.join(f\"{s['id']}:{i}:$FR\" for s in tl['scenes'] for i in range(len(s['beats']))))")
node pv.mjs $EP $ITEMS
python3 - <<PY
import json,subprocess
tl=json.load(open('tl_e$EP.json')); fs=[f"pv/{s['id']}_{i}_$FR.jpg" for s in tl['scenes'] for i in range(len(s['beats']))]
for k in range(0,len(fs),12): subprocess.run(['python3','sheet.py',f'sheet_e${EP}_{k//12}.jpg']+fs[k:k+12])
print(len(fs))
PY
