//>
# .github/workflows/ci.yml
- run: cargo build
  env:
    RUSTFLAGS: "-D warnings"   # 依赖也跟着重编
//<
