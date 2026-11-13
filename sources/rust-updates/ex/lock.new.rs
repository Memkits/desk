//>
use std::fs::File;

fn main() -> std::io::Result<()> {
    let f = File::create("app.lock")?;
    f.try_lock()?;                  // 标准库自带
    // …只允许一个进程运行的工作…
    f.unlock()
}
//<
