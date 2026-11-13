use std::str::FromStr;
//>
struct Name(String);

impl FromStr for Name {
    type Err = !;                   // 直接写“永不发生”
    fn from_str(s: &str) -> Result<Self, !> {
        Ok(Name(s.trim().to_string()))
    }
}
//<
fn main() { let Ok(_n) = "x".parse::<Name>(); }
