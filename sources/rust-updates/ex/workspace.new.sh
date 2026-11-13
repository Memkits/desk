//>
# 工作区 Cargo.toml
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }

# 成员 Cargo.toml（2024 版次：关掉默认特性）
[dependencies]
serde = { workspace = true, default-features = false }
//<
