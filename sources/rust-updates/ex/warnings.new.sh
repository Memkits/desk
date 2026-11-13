//>
# .github/workflows/ci.yml
- run: cargo build
  env:
    CARGO_BUILD_WARNINGS: deny  # 只管本地包

# 或者写进 .cargo/config.toml
[build]
warnings = "deny"
//<
