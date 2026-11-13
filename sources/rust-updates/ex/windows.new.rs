//>
fn rises(xs: &[i32]) -> usize {
    xs.array_windows()
        .filter(|[a, b]| b > a)    // 长度 2 写进了类型
        .count()
}
//<
fn main() { rises(&[1,2,3]); }
