// Rust 版本：./b <case> <rounds>
use std::collections::HashMap;
use std::hint::black_box;
use std::time::Instant;

static mut SEED: u64 = 42;
fn rnd() -> u64 { unsafe { SEED = (SEED * 48271) % 2147483647; SEED } }
fn set_seed(s: u64) { unsafe { SEED = s } }

#[derive(Clone, Copy)]
struct Body { x: f64, y: f64, z: f64, vx: f64, vy: f64, vz: f64, m: f64 }
fn nbody() -> f64 {
    let pi = std::f64::consts::PI; let sm = 4.0 * pi * pi; let dp = 365.24;
    let mut b = [
        Body { x: 0., y: 0., z: 0., vx: 0., vy: 0., vz: 0., m: sm },
        Body { x: 4.84143144246472090e+00, y: -1.16032004402742839e+00, z: -1.03622044471123109e-01, vx: 1.66007664274403694e-03 * dp, vy: 7.69901118419740425e-03 * dp, vz: -6.90460016972063023e-05 * dp, m: 9.54791938424326609e-04 * sm },
        Body { x: 8.34336671824457987e+00, y: 4.12479856412430479e+00, z: -4.03523417114321381e-01, vx: -2.76742510726862411e-03 * dp, vy: 4.99852801234917238e-03 * dp, vz: 2.30417297573763929e-05 * dp, m: 2.85885980666130812e-04 * sm },
        Body { x: 1.28943695621391310e+01, y: -1.51111514016986312e+01, z: -2.23307578892655734e-01, vx: 2.96460137564761618e-03 * dp, vy: 2.37847173959480950e-03 * dp, vz: -2.96589568540237556e-05 * dp, m: 4.36624404335156298e-05 * sm },
        Body { x: 1.53796971148509165e+01, y: -2.59193146099879641e+01, z: 1.79258772950371181e-01, vx: 2.68067772490389322e-03 * dp, vy: 1.62824170038242295e-03 * dp, vz: -9.51592254519715870e-05 * dp, m: 5.15138902046611451e-05 * sm },
    ];
    let n = b.len(); let dt = 0.01;
    for _ in 0..1_000_000 {
        for i in 0..n { for j in i + 1..n {
            let (dx, dy, dz) = (b[i].x - b[j].x, b[i].y - b[j].y, b[i].z - b[j].z);
            let d2 = dx * dx + dy * dy + dz * dz; let mag = dt / (d2 * d2.sqrt());
            let (mi, mj) = (b[i].m, b[j].m);
            b[i].vx -= dx * mj * mag; b[i].vy -= dy * mj * mag; b[i].vz -= dz * mj * mag;
            b[j].vx += dx * mi * mag; b[j].vy += dy * mi * mag; b[j].vz += dz * mi * mag;
        } }
        for p in b.iter_mut() { p.x += dt * p.vx; p.y += dt * p.vy; p.z += dt * p.vz; }
    }
    b[0].x + b[1].y
}
fn fib(n: u32) -> u64 { if n < 2 { n as u64 } else { fib(n - 1) + fib(n - 2) } }

trait Shape { fn area(&self) -> f64; }
struct Circle(f64); struct Square(f64); struct Tri(f64); struct Hex(f64); struct Rect(f64);
impl Shape for Circle { fn area(&self) -> f64 { 3.14159 * self.0 * self.0 } }
impl Shape for Square { fn area(&self) -> f64 { self.0 * self.0 } }
impl Shape for Tri { fn area(&self) -> f64 { 0.5 * self.0 * self.0 } }
impl Shape for Hex { fn area(&self) -> f64 { 2.598 * self.0 * self.0 } }
impl Shape for Rect { fn area(&self) -> f64 { 2.0 * self.0 * self.0 } }
fn mk_shapes(k: usize) -> Vec<Box<dyn Shape>> {
    (0..1_000_000).map(|i| { let r = (i % 100) as f64 * 0.01; let s: Box<dyn Shape> = match i % k { 0 => Box::new(Circle(r)), 1 => Box::new(Square(r)), 2 => Box::new(Tri(r)), 3 => Box::new(Hex(r)), _ => Box::new(Rect(r)) }; s }).collect()
}
fn sum_area(a: &[Box<dyn Shape>]) -> f64 { let mut s = 0.0; for _ in 0..10 { for x in a { s += x.area(); } } s }

struct Node { l: Option<Box<Node>>, r: Option<Box<Node>> }
fn mk(d: u32) -> Box<Node> { if d == 0 { Box::new(Node { l: None, r: None }) } else { Box::new(Node { l: Some(mk(d - 1)), r: Some(mk(d - 1)) }) } }
fn chk(t: &Node) -> u64 { match (&t.l, &t.r) { (Some(l), Some(r)) => 1 + chk(l) + chk(r), _ => 1 } }

fn branchy() -> u32 {
    set_seed(1); let mut x: u32 = 0;
    for i in 0..5_000_000u32 {
        match rnd() & 7 { 0 => x = x.wrapping_add(i), 1 => x ^= i, 2 => x = x.wrapping_mul(3), 3 => x = x.wrapping_sub(i >> 1), 4 => x = x.wrapping_add(7), 5 => x ^= x >> 3, 6 => x = x.wrapping_mul(5).wrapping_add(1), _ => x = x.wrapping_sub(3) }
    }
    x
}
fn interp(code: &[i32]) -> i32 {
    let (mut pc, mut sp, mut i, mut acc) = (0usize, 0usize, 0i32, 0i32); let n = 1_000_000; let mut st = [0i32; 16];
    loop {
        let op = code[pc]; pc += 1;
        match op {
            0 => { st[sp] = i; sp += 1 }
            1 => { st[sp] = acc; sp += 1 }
            2 => { sp -= 1; st[sp - 1] = st[sp - 1].wrapping_mul(st[sp]) }
            3 => { st[sp - 1] %= 7 }
            4 => { sp -= 1; st[sp - 1] = st[sp - 1].wrapping_add(st[sp]) }
            5 => { sp -= 1; acc = st[sp] }
            6 => { i += 1 }
            7 => { let t = code[pc] as usize; pc += 1; if i < n { pc = t } }
            _ => return acc,
        }
    }
}
fn matmul(a: &[f64], b: &[f64], n: usize) -> f64 {
    let mut c = vec![0.0; n * n];
    for i in 0..n { for k in 0..n { let x = a[i * n + k]; let (ro, rb) = (i * n, k * n); for j in 0..n { c[ro + j] += x * b[rb + j]; } } }
    c[n * n - 1] + c[1234]
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let name = args[1].clone(); let rounds: usize = args.get(2).map(|s| s.parse().unwrap()).unwrap_or(10);
    let rules: Vec<(i32, i32, i32)> = std::env::var("RULES").unwrap_or("7,3,100;11,5,2000;13,0,50".into()).split(';')
        .map(|r| { let v: Vec<i32> = r.split(',').map(|x| x.parse().unwrap()).collect(); (v[0], v[1], v[2]) }).collect();
    let (mut mono, mut poly, mut words, mut data) = (None, None, None, None);
    let n = 256; let ma: Vec<f64> = (0..n * n).map(|i| (i % 13) as f64 * 0.5).collect(); let mb: Vec<f64> = (0..n * n).map(|i| (i % 7) as f64 * 0.25).collect();
    let code = black_box(vec![0, 0, 4, 3, 1, 4, 5, 6, 7, 0, 8]);
    let mut out = vec![]; let mut res = String::new();
    for _ in 0..rounds {
        let t0 = Instant::now();
        res = match name.as_str() {
            "nbody" => format!("{:.6}", nbody()),
            "fib" => fib(black_box(32)).to_string(),
            "mono" => format!("{:.6}", sum_area(mono.get_or_insert_with(|| mk_shapes(black_box(1))))),
            "poly" => format!("{:.6}", sum_area(poly.get_or_insert_with(|| mk_shapes(black_box(5))))),
            "trees" => { let mut s = 0; for _ in 0..20 { s += chk(&mk(black_box(14))); } s.to_string() }
            "words" => {
                let w: &Vec<String> = words.get_or_insert_with(|| { set_seed(7); (0..1_000_000).map(|_| format!("w{}", rnd() % 50000)).collect() });
                let mut m: HashMap<&str, u32> = HashMap::new(); for x in w { *m.entry(x.as_str()).or_insert(0) += 1; }
                (m.len() as u32 + m[w[0].as_str()]).to_string()
            }
            "branchy" => branchy().to_string(),
            "interp" => interp(&code).to_string(),
            "matmul" => format!("{:.6}", matmul(&ma, &mb, n)),
            "rules_interp" => {
                let d: &Vec<i32> = data.get_or_insert_with(|| { set_seed(3); (0..2_000_000).map(|_| (rnd() % 100000) as i32).collect() });
                d.iter().filter(|&&x| rules.iter().all(|&(a, b, t)| x % a == b || x < t)).count().to_string()
            }
            "rules_fixed" => { // 规则写死在源码里：AOT 能做到的上限
                let d: &Vec<i32> = data.get_or_insert_with(|| { set_seed(3); (0..2_000_000).map(|_| (rnd() % 100000) as i32).collect() });
                d.iter().filter(|&&x| (x % 7 == 3 || x < 100) && (x % 11 == 5 || x < 2000) && (x % 13 == 0 || x < 50)).count().to_string()
            }
            "hello" => "0".into(),
            _ => panic!("unknown"),
        };
        out.push(format!("{:.2}", t0.elapsed().as_secs_f64() * 1000.0));
    }
    if name != "hello" { println!("{}", out.join(" ")); }
    println!("ck {}", res);
}
