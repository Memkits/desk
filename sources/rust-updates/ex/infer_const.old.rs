//>
fn zeros<const N: usize>() -> [f32; N] {
    [0.0; N]
}

fn main() {
    let a: [f32; 4] = zeros::<4>();
    let b: [u8; 3] = [7; 3];
}
//<
