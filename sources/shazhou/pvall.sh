# 预览每个 beat 的中间与结尾：bash pvall.sh EP scene...
EP=$1; shift; A=""
for s in "$@"; do n=$(python3 -c "import json;print([len(x['beats']) for x in json.load(open('script.json')) if x['id']=='$s'][0])"); for i in $(seq 0 $((n-1))); do A="$A $s:$i:.5 $s:$i:.97"; done; done
node pv.mjs $EP $A
