//>
fn swap_hp(v: &mut [i32], i: usize, j: usize) {
    assert!(i < j && j < v.len());
    let (left, right) = v.split_at_mut(j);
    let a = &mut left[i];
    let b = &mut right[0];
    std::mem::swap(a, b);
}
//<
fn main() { swap_hp(&mut [1,2,3], 0, 2); }
