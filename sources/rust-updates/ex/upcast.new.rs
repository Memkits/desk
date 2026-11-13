use std::any::Any;
//>
trait Shape: Any {
    fn area(&self) -> f64;
}

impl Shape for Circle {
    fn area(&self) -> f64 { 3.14 * self.r * self.r }
}

fn is_circle(s: &dyn Shape) -> bool {
    let any: &dyn Any = s;          // 直接向上转换
    any.is::<Circle>()
}
//<
struct Circle { r: f64 }
fn main() { is_circle(&Circle { r: 1.0 }); }
