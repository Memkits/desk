use std::sync::atomic::{AtomicU32, Ordering::*};
//>
fn double(level: &AtomicU32) {
    level.update(SeqCst, Relaxed, |x| x * 2);
}
//<
fn main() { double(&AtomicU32::new(1)); }
