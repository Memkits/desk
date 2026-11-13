use std::any::Any;
//>
trait Shape: Any {
    fn area(&self) -> f64;
    fn as_any(&self) -> &dyn Any;   // 每个类型都得写一遍
}

impl Shape for Circle {
    fn area(&self) -> f64 { 3.14 * self.r * self.r }
    fn as_any(&self) -> &dyn Any { self }
}

fn is_circle(s: &dyn Shape) -> bool {
    s.as_any().is::<Circle>()
}
//<
struct Circle { r: f64 }
fn main() { is_circle(&Circle { r: 1.0 }); }
