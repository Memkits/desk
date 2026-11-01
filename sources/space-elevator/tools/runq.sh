# 用 N 个进程逐个渲染队列中的场景
Q=$1; N=$2
cat $Q | xargs -P $N -I{} sh -c 'node render.mjs {} >> logs/render_{}.log 2>&1'
echo ALLDONE >> logs/done.txt
