// C 版本：同一份代码走三条路——clang AOT、lli（LLVM JIT）、wasm 跑在 V8 里
#ifdef WASM
void *memset(void *d, int c, unsigned long n) { volatile unsigned char *p = d; while (n--) *p++ = (unsigned char)c; return d; }
#endif
typedef unsigned int u32; typedef unsigned long long u64;
static u64 SEED = 42;
static u64 rnd(void) { SEED = (SEED * 48271ULL) % 2147483647ULL; return SEED; }

typedef struct { double x, y, z, vx, vy, vz, m; } Body;
double nbody(void) {
  double pi = 3.141592653589793, sm = 4 * pi * pi, dp = 365.24;
  Body b[5] = {{0,0,0,0,0,0,sm},
    {4.84143144246472090e+00,-1.16032004402742839e+00,-1.03622044471123109e-01,1.66007664274403694e-03*dp,7.69901118419740425e-03*dp,-6.90460016972063023e-05*dp,9.54791938424326609e-04*sm},
    {8.34336671824457987e+00,4.12479856412430479e+00,-4.03523417114321381e-01,-2.76742510726862411e-03*dp,4.99852801234917238e-03*dp,2.30417297573763929e-05*dp,2.85885980666130812e-04*sm},
    {1.28943695621391310e+01,-1.51111514016986312e+01,-2.23307578892655734e-01,2.96460137564761618e-03*dp,2.37847173959480950e-03*dp,-2.96589568540237556e-05*dp,4.36624404335156298e-05*sm},
    {1.53796971148509165e+01,-2.59193146099879641e+01,1.79258772950371181e-01,2.68067772490389322e-03*dp,1.62824170038242295e-03*dp,-9.51592254519715870e-05*dp,5.15138902046611451e-05*sm}};
  for (int s = 0; s < 1000000; s++) {
    for (int i = 0; i < 5; i++) for (int j = i + 1; j < 5; j++) {
      double dx = b[i].x - b[j].x, dy = b[i].y - b[j].y, dz = b[i].z - b[j].z;
      double d2 = dx*dx + dy*dy + dz*dz, mag = 0.01 / (d2 * __builtin_sqrt(d2));
      b[i].vx -= dx*b[j].m*mag; b[i].vy -= dy*b[j].m*mag; b[i].vz -= dz*b[j].m*mag;
      b[j].vx += dx*b[i].m*mag; b[j].vy += dy*b[i].m*mag; b[j].vz += dz*b[i].m*mag;
    }
    for (int i = 0; i < 5; i++) { b[i].x += 0.01*b[i].vx; b[i].y += 0.01*b[i].vy; b[i].z += 0.01*b[i].vz; }
  }
  return b[0].x + b[1].y;
}
static u64 fibr(u32 n) { return n < 2 ? n : fibr(n - 1) + fibr(n - 2); }
double fib(void) { return (double)fibr(32); }
double branchy(void) {
  SEED = 1; u32 x = 0;
  for (u32 i = 0; i < 5000000; i++) {
    switch (rnd() & 7) { case 0: x += i; break; case 1: x ^= i; break; case 2: x *= 3; break; case 3: x -= i >> 1; break;
      case 4: x += 7; break; case 5: x ^= x >> 3; break; case 6: x = x * 5 + 1; break; default: x -= 3; }
  }
  return x;
}
static volatile int CODE[] = {0, 0, 4, 3, 1, 4, 5, 6, 7, 0, 8};
double interp(void) {
  int pc = 0, sp = 0, i = 0, acc = 0, st[16];
  for (;;) {
    int op = CODE[pc++];
    switch (op) {
      case 0: st[sp++] = i; break;
      case 1: st[sp++] = acc; break;
      case 2: sp--; st[sp-1] = (int)((u32)st[sp-1] * (u32)st[sp]); break;
      case 3: st[sp-1] %= 7; break;
      case 4: sp--; st[sp-1] = (int)((u32)st[sp-1] + (u32)st[sp]); break;
      case 5: acc = st[--sp]; break;
      case 6: i++; break;
      case 7: { int t = CODE[pc++]; if (i < 1000000) pc = t; break; }
      default: return acc;
    }
  }
}
typedef struct Sh { double (*area)(const struct Sh*); double r; } Sh;
static double a0(const Sh*s){return 3.14159*s->r*s->r;} static double a1(const Sh*s){return s->r*s->r;}
static double a2(const Sh*s){return 0.5*s->r*s->r;} static double a3(const Sh*s){return 2.598*s->r*s->r;} static double a4(const Sh*s){return 2*s->r*s->r;}
static double (*const AF[5])(const Sh*) = {a0,a1,a2,a3,a4};
static Sh SH[1000000];
static double shapes(int k){ for(int i=0;i<1000000;i++){SH[i].area=AF[i%k];SH[i].r=(i%100)*0.01;} double s=0; for(int p=0;p<10;p++) for(int i=0;i<1000000;i++) s+=SH[i].area(&SH[i]); return s; }
double mono(void){return shapes(1);} double poly(void){return shapes(5);}
#define N 256
static double MA[N*N], MB[N*N], MC[N*N];
double matmul(void) {
  for (int i = 0; i < N*N; i++) { MA[i] = (i % 13) * 0.5; MB[i] = (i % 7) * 0.25; MC[i] = 0; }
  for (int i = 0; i < N; i++) for (int k = 0; k < N; k++) { double a = MA[i*N+k]; for (int j = 0; j < N; j++) MC[i*N+j] += a * MB[k*N+j]; }
  return MC[N*N-1] + MC[1234];
}

#ifndef WASM
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }
int main(int argc, char **argv) {
  const char *n = argv[1]; int R = argc > 2 ? atoi(argv[2]) : 10; double res = 0;
  double (*f)(void) = !strcmp(n, "nbody") ? nbody : !strcmp(n, "fib") ? fib : !strcmp(n, "branchy") ? branchy : !strcmp(n, "interp") ? interp : !strcmp(n, "matmul") ? matmul : !strcmp(n, "mono") ? mono : !strcmp(n, "poly") ? poly : 0;
  if (!f) { printf("ck 0\n"); return 0; }
  for (int r = 0; r < R; r++) { double t0 = now(); res = f(); printf("%.2f ", now() - t0); }
  printf("\nck %.6g\n", res); return 0;
}
#endif
