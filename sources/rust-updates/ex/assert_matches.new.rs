fn parse(s: &str) -> Result<u8, std::num::ParseIntError> { s.parse() }
//>
use std::assert_matches;

#[test]
fn parse_ok() {
    let r = parse("42");
    assert_matches!(r, Ok(n) if n > 0);
    // 失败时打印 left: Err(..)，实际值一目了然
}
//<
fn main() {}
