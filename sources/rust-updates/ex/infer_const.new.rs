//>
fn zeros<const N: usize>() -> [f32; N] {
    [0.0; _]
}

fn main() {
    let a: [f32; 4] = zeros::<_>();
    let b: [u8; 3] = [7; _];
}
//<
