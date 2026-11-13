//>
fn config_dir() -> &'static str {
    cfg_select! {
        windows => { "%APPDATA%" }
        target_os = "macos" => { "~/Library/Application Support" }
        _ => { "~/.config" }
    }
}
//<
fn main() { config_dir(); }
