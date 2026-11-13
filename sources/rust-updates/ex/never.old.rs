use std::str::FromStr;
//>
use std::convert::Infallible;

struct Name(String);

impl FromStr for Name {
    type Err = Infallible;          // “不会失败”的错误类型
    fn from_str(s: &str) -> Result<Self, Infallible> {
        Ok(Name(s.trim().to_string()))
    }
}
//<
fn main() { let Ok(_n) = "x".parse::<Name>(); }
