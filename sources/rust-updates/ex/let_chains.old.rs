struct User { name: String, age: Option<u32> }
//>
fn greet(user: Option<&User>) {
    if let Some(u) = user {
        if let Some(age) = u.age {
            if age >= 18 {
                println!("欢迎，{}", u.name);
            }
        }
    }
}
//<
fn main() { greet(None); }
