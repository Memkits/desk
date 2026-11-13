//>
fn swap_hp(v: &mut [i32], i: usize, j: usize) {
    let [a, b] = v.get_disjoint_mut([i, j]).unwrap();
    std::mem::swap(a, b);
}
//<
fn main() { swap_hp(&mut [1,2,3], 0, 2); }
