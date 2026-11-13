//>
unsafe extern "C" {
    pub safe fn abs(x: i32) -> i32;
}

#[unsafe(no_mangle)]
pub extern "C" fn plugin_init() -> i32 {
    abs(-7)
}
//<
fn main() { plugin_init(); }
