fn parse(s: &str) -> Result<u8, std::num::ParseIntError> { s.parse() }
//>
#[test]
fn parse_ok() {
    let r = parse("42");
    assert!(matches!(r, Ok(n) if n > 0));
    // 失败时只说 assertion failed，看不到 r 的值
}
//<
fn main() {}
