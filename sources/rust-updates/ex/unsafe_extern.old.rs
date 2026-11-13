//>
extern "C" {
    fn abs(x: i32) -> i32;
}

#[no_mangle]
pub extern "C" fn plugin_init() -> i32 {
    unsafe { abs(-7) }
}
//<
fn main() { plugin_init(); }
