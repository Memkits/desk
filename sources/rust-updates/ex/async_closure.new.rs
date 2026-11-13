//>
async fn retry<F>(mut job: F) -> u32
where
    F: AsyncFnMut() -> Option<u32>,
{
    loop {
        if let Some(v) = job().await { return v; }
    }
}

async fn demo(token: String) -> u32 {
    retry(async || fetch(&token).await).await
}
//<
async fn fetch(_t: &str) -> Option<u32> { Some(1) }
fn main() { let _ = demo(String::new()); }
