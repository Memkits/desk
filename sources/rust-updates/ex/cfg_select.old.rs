//>
#[cfg(windows)]
fn config_dir() -> &'static str {
    "%APPDATA%"
}
#[cfg(target_os = "macos")]
fn config_dir() -> &'static str {
    "~/Library/Application Support"
}
#[cfg(not(any(windows, target_os = "macos")))]
fn config_dir() -> &'static str {
    "~/.config"
}
//<
fn main() { config_dir(); }
