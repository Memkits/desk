//>
fn clean(url: &str) -> &str {
    let s = url.strip_prefix("https://").unwrap_or(url);
    s.strip_suffix('/').unwrap_or(s)
}
//<
fn main() { clean("https://a/"); }
