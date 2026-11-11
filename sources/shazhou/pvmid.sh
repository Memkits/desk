# 每个 beat 只取 .85：bash pvmid.sh EP scene...
EP=$1; shift; A=""
for s in "$@"; do n=$(python3 -c "import json;print([len(x['beats']) for x in json.load(open('script.json')) if x['id']=='$s'][0])"); for i in $(seq 0 $((n-1))); do A="$A $s:$i:.85"; done; done
node pv.mjs $EP $A
