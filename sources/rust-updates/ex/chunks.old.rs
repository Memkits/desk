//>
fn read_pixels(bytes: &[u8]) -> Vec<u32> {
    let mut it = bytes.chunks_exact(4);
    let px = it.by_ref()
        .map(|c| u32::from_le_bytes(c.try_into().unwrap()))
        .collect();
    let _rest = it.remainder();
    px
}
//<
fn main() { read_pixels(&[0;9]); }
