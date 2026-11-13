use std::sync::atomic::{AtomicU32, Ordering::*};
//>
fn double(level: &AtomicU32) {
    let mut cur = level.load(Relaxed);
    loop {
        match level.compare_exchange_weak(cur, cur * 2, SeqCst, Relaxed) {
            Ok(_) => break,
            Err(now) => cur = now,
        }
    }
}
//<
fn main() { double(&AtomicU32::new(1)); }
