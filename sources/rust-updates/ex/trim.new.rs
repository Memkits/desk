//>
fn clean(url: &str) -> &str {
    url.trim_prefix("https://").trim_suffix('/')
}
//<
fn main() { assert_eq!(clean("https://a/"), "a"); assert_eq!(clean("a"), "a"); }
