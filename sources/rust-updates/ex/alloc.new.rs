//>
use std::alloc::{AllocError, Allocator, Global, Layout};

struct Counting { bytes: AtomicUsize }

unsafe impl Allocator for &Counting {
    fn allocate(&self, l: Layout) -> Result<NonNull<[u8]>, AllocError> {
        self.bytes.fetch_add(l.size(), Relaxed);
        Global.allocate(l)
    }
    unsafe fn deallocate(&self, p: NonNull<u8>, l: Layout) {
        unsafe { Global.deallocate(p, l) }
    }
}

fn main() {
    let c = Counting { bytes: AtomicUsize::new(0) };
    let mut v = Vec::with_capacity_in(16, &c);
    v.push(1u64);
}
//<
use std::ptr::NonNull;
use std::sync::atomic::{AtomicUsize, Ordering::Relaxed};
