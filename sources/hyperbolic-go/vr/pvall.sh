# sh pvall.sh scene beats...  → pv 各 beat 的 .5 和 .97，再拼 sheet
sc=$1; shift; items=""; files=""
for b in "$@"; do for f in ${FR:-.5 .97}; do items="$items $sc:$b:$f"; files="$files pv/${sc}_${b}_$f.jpg"; done; done
node pv.mjs 1 $items && python3 sheet.py pv/sheet_$sc.jpg $files
