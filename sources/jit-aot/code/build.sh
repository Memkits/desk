set -e
cd /home/claude/jit; mkdir -p bin prof
T() { local s=$(date +%s.%N); "$@"; echo "BUILD $(basename $1) $(echo "$(date +%s.%N) - $s" | bc)" >&2; }
T clang -O2 -o bin/c_o2 b.c
T clang -O2 -march=native -o bin/c_nat b.c
rm -rf prof; mkdir prof
T gcc -O2 -march=native -o bin/g_nat b.c
T gcc -O2 -march=native -fprofile-generate -fprofile-dir=$PWD/prof -o bin/g_gen b.c
for c in nbody fib mono poly branchy interp matmul; do bin/g_gen $c 1 >/dev/null; done
T gcc -O2 -march=native -fprofile-use -fprofile-dir=$PWD/prof -Wno-missing-profile -o bin/g_pgo b.c
T clang -O2 -emit-llvm -c -o bin/b.bc b.c
T clang --target=wasm32 -O2 -DWASM -nostdlib -Wl,--no-entry -Wl,--export=nbody -Wl,--export=fib -Wl,--export=branchy -Wl,--export=interp -Wl,--export=matmul -Wl,--export=mono -Wl,--export=poly -o b.wasm b.c
ls -la bin b.wasm
