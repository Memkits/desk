//>
fn read_pixels(bytes: &[u8]) -> Vec<u32> {
    let (chunks, _rest) = bytes.as_chunks::<4>();
    chunks.iter()
        .map(|c| u32::from_le_bytes(*c))
        .collect()
}
//<
fn main() { read_pixels(&[0;9]); }
