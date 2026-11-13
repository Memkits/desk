//>
# 工作区 Cargo.toml
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }

# 成员 Cargo.toml（2021 版次：这一项被忽略）
[dependencies]
serde = { workspace = true, default-features = false }
//<
