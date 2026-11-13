//>
fn rises(xs: &[i32]) -> usize {
    xs.windows(2)
        .filter(|w| w[1] > w[0])   // w 是切片，长度靠约定
        .count()
}
//<
fn main() { rises(&[1,2,3]); }
