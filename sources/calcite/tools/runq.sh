# 用 N 个进程逐个渲染队列中的场景
Q=$1; N=$2
cat $Q | xargs -P $N -L 1 sh -c 'node render.mjs $0 0 1 $1 >> logs/render_$0_$1.log 2>&1'
echo ALLDONE >> logs/done.txt
