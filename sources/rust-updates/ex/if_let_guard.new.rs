enum Cmd { Set(String), Quit }
//>
fn run(cmd: Cmd) -> i32 {
    match cmd {
        Cmd::Set(s) if let Ok(n) = s.parse::<i32>() => n,
        Cmd::Set(_) => -1,
        Cmd::Quit => 0,
    }
}
//<
fn main() { run(Cmd::Quit); let _ = Cmd::Set(String::new()); }
