use std::future::Future;
//>
async fn retry<F, Fut>(mut job: F) -> u32
where
    F: FnMut() -> Fut,
    Fut: Future<Output = Option<u32>>,
{
    loop {
        if let Some(v) = job().await { return v; }
    }
}

async fn demo(token: String) -> u32 {
    retry(|| {
        let token = token.clone();
        async move { fetch(&token).await }
    }).await
}
//<
async fn fetch(_t: &str) -> Option<u32> { Some(1) }
fn main() { let _ = demo(String::new()); }
