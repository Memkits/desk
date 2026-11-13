//>
// Cargo.toml: fs2 = "0.4"
use fs2::FileExt;
use std::fs::File;

fn main() -> std::io::Result<()> {
    let f = File::create("app.lock")?;
    f.try_lock_exclusive()?;        // 第三方库提供的扩展方法
    // …只允许一个进程运行的工作…
    f.unlock()
}
//<
