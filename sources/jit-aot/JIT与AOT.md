# JIT 与 AOT：性能上限与成本实测

2026-10-26 · AI 协作整理（Claude）· 云沙箱实测 + 公开资料

结论：在 10 个共同案例上，V8 和 Bun 的峰值大约是 Rust 的 2 倍耗时，LuaJIT 约 2.4 倍；但 JIT 在单态调用、分配密集、字符串表等场景里反超了 Rust。真正的差距在成本侧：Node 启动 27 ms、常驻 42 MB，Rust 和 LuaJIT 均约 2 ms、12 MB。同一份 LLVM IR 用 JIT 和 AOT 跑，峰值只差约 10%，说明拉开差距的主要是语言语义，不是编译发生的时机。

## 七条结论

1. **JIT 的峰值上限接近 AOT，但平均仍差一倍左右。** V8 和 Bun 的几何平均是 Rust 的 1.9–2.0 倍耗时，LuaJIT 2.4 倍。公开的 Benchmarks Game 数据里这个差距更大（3–6 倍），因为那里的 Rust 程序用了手写 SIMD 和多线程。
2. **JIT 能赢的地方很具体。** 单态虚调用（V8 是 Rust dyn Trait 的 0.4 倍耗时）、大量短命对象（V8 0.7 倍）、字符串为键的表（LuaJIT 0.2 倍）。三者的共同点：赢在运行时设计（内联缓存、分代 GC、字符串驻留），而不是赢在“编译发生在运行时”。
3. **JIT 输得最惨的是向量化。** 矩阵乘上 V8 和 LuaJIT 都是 Rust 的约 7 倍耗时，两者都不做自动 SIMD。
4. **同一份 LLVM IR，JIT 和 AOT 只差约 10%。** 代价是启动从 1.6 ms 变成 69 ms、内存从 12 MB 变成 77 MB。语言本身的动态性，才是 JS 和 Lua 跟 Rust 拉开差距的主因。
5. **成本侧差距远大于峰值差距。** Node 启动 27 ms、空转 42 MB；LuaJIT、Rust、C 都在 2 ms、12 MB 左右。第一轮运行时，V8 的平均倍数从 2.0 升到 4.8。
6. **LuaJIT 的价值一半来自解释器。** 关掉 JIT 后它比 Lua 5.4 仍快约 1.4 倍；开启 JIT 再快约 4 倍。内存和启动上，它和 C 并列。
7. **运行时生成代码是 JIT 唯一稳定的结构性优势。** 把启动后才读入的规则编成代码，V8 和 Bun 快了 3–12 倍，追平 Rust 解释同样规则的速度；但如果规则在编译时就已知、再开启本机指令集，Rust 还能快 3 倍。

这些数字来自共享的云端沙箱（2 核 x86-64），每组只跑了 3–10 轮，单个数字可能有 10–20% 的波动。适合看倍数级的差异和方向，不适合当作精确排名。

## 峰值总表

表里是稳定状态下的单轮耗时，换算成 Rust（默认 release）的倍数：**小于 1 表示比 Rust 快**。第一列是 Rust 的绝对耗时（毫秒）。

| 案例 | Rust ms | V8 | Bun | LuaJIT | V8 关 TurboFan | V8 纯解释 | LuaJIT 关 JIT | Lua 5.4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| n-body 浮点循环 | 46 | 1.8 | 2.5 | 3.1 | 80 | 87 | 31 | 48 |
| 递归 fib(32) | 6.3 | 3.3 | 2.2 | 2.8 | 13 | 32 | 19 | 23 |
| 单态虚调用 | 59 | **0.4** | **0.4** | 2.8 | 9.5 | 13 | 8.7 | 8.7 |
| 五种形状轮换 | 50 | 2.6 | **0.8** | 3.4 | 13 | 17 | 9.0 | 12 |
| binary-trees | 12.6 | **0.7** | **0.8** | 3.2 | 2.9 | 4.3 | 4.6 | 13 |
| 字符串词频 | 70 | 2.2 | 2.6 | **0.2** | 3.9 | 3.6 | **0.7** | 1.2 |
| 不规则分支 | 67 | 2.4 | 3.4 | 1.8 | 5.9 | 8.9 | 5.7 | 7.2 |
| 字节码解释器 | 12.3 | 2.4 | 1.6 | 4.2 | 26 | 48 | 14 | 22 |
| 矩阵乘 256³ | 3.6 | 6.9 | 4.2 | 6.7 | 215 | 298 | 89 | 125 |
| 规则过滤（解释规则） | 9.3 | 2.6 | 10 | 2.0 | 38 | 55 | 12 | 11 |
| **几何平均** |  | **2.0** | **1.9** | **2.4** | **17** | **24** | **10** | **14** |

几个读法：

- “五种形状轮换”里 V8 从 0.4 变成 2.6，慢了 5 倍：V8 的内联缓存最多记 4 种形状，第 5 种让它退化成“超多态”。Bun 的 JavaScriptCore 在这里没有退化。
- Rust 的字符串词频慢，是因为标准库 HashMap 默认用抗攻击的 SipHash。换成更快的哈希并不难，但这正好说明：默认值和运行时设计，往往比“JIT 还是 AOT”影响更大。
- 关掉 TurboFan 后，V8 的数值循环几乎退回解释器水平（n-body 80 倍、矩阵乘 215 倍）。中间层编译器在长时间热循环上帮助有限。
- Rust 开 target-cpu=native + LTO 的几何平均是 1.01，和默认打平。在这些案例上它的收益在噪声范围内，只有“规则写死”那一项提速明显（见结论 7）。

## 假设核对

实测前写下的 10 条假设：5 条成立，3 条部分成立，2 条不成立。不成立的两条都是对 JIT 的预判过于乐观或过于简单。

| 假设 | 结果 | 实测 |
| --- | --- | --- |
| H1 数值循环里 V8、LuaJIT 在 Rust 的 0.7–1.2 倍 | 不成立 | V8 1.8 倍，LuaJIT 3.1 倍。LuaJIT 版用带名字段的表存数据；改用 FFI 结构体可能会更快，但那就不是普通的 Lua 代码了 |
| H2 追踪 JIT 在递归和不规则分支上明显落后 V8 | 不成立 | fib：LuaJIT 2.8 倍、V8 3.3 倍；分支：LuaJIT 1.8 倍、V8 2.4 倍。LuaJIT 反而更好。公开资料里追踪 JIT 的弱点主要是 NYI 函数和 trace 中止，不是分支本身 |
| H3 单态调用 V8 可赢 Rust dyn；5 种形状时变慢；PGO 能追回 | 部分成立 | 前两点成立（0.4 倍 → 2.6 倍）。Rust 的 PGO 因为工具链版本不匹配未能在沙箱里跑；C 的函数指针版加 gcc PGO 后耗时不变（28.1 vs 27.9 ms） |
| H4 分配密集时 V8 的分代 GC 快于 Rust 逐个 Box | 成立 | V8 0.7 倍、Bun 0.8 倍。arena 写法未测 |
| H5 Rust 和 LuaJIT 启动在毫秒级，Node 几十毫秒 | 成立 | Rust 2.2 ms、LuaJIT 1.9 ms、Bun 6.1 ms、Node 27 ms |
| H6 Node 常驻内存显著更高，LuaJIT 极小 | 部分成立 | 空转时成立（42 MB vs 12 MB）。但 LuaJIT 存 100 万个小表时吃到 133 MB，和 V8 的 154 MB 相当，对象表示才是内存的大头 |
| H7 只给一个核时 V8 预热变慢 | 成立 | 解释器案例：2 核时第 1 轮就是 32 ms；1 核时前约 20 轮都卡在 48 ms，之后才降到 31 ms |
| H8 运行时生成代码是 JIT 的结构性优势 | 部分成立 | V8 快 3 倍、Bun 快 12 倍，追平 Rust 解释规则；LuaJIT 几乎不变（18.7 vs 18.4 ms），因为 trace 已经按实际路径特化过规则循环 |
| H9 矩阵乘拉开最大差距 | 成立 | V8 6.9 倍、LuaJIT 6.7 倍，全表最大 |
| H10 Wasm 比原生慢 1.2–2 倍，但比 JS 稳 | 成立 | 几何平均 1.28 倍，矩阵乘 2.9 倍；同算法下比 JS 快（矩阵乘 12 vs 25 ms） |

## 成本侧：启动、内存、预热、体积、编译

峰值上 JIT 只差一倍左右，成本上差距是一到两个数量级。启动和空转内存是跑一个空程序 10 次的中位数。

| 运行方式 | 启动 | 空转内存 | 需要分发的体积 | 构建时间 |
| --- | --- | --- | --- | --- |
| C（clang -O2） | 1.6 ms | 12 MB | 17 KB | 0.15 s |
| LuaJIT 2.1 | 1.9 ms | 12 MB | 运行时 0.6 MB + 源码 | 无 |
| Lua 5.4 | 1.9 ms | 12 MB | 运行时 0.3 MB + 源码 | 无 |
| Rust（默认 release） | 2.2 ms | 12 MB | 4.4 MB（未 strip） | 0.7 s |
| Rust（native + LTO） | 同上 | 同上 | 2.2 MB | 4.8 s |
| Bun | 6.1 ms | 15 MB | 运行时 80 MB + 源码 | 无 |
| Node 22 | 27 ms | 42 MB | 运行时 123 MB + 源码 | 无 |
| LLVM JIT（lli） | 69 ms | 75 MB | 字节码 14 KB + LLVM 库约 120 MB | 0.09 s（到 IR） |

**首轮罚款。** 按第一轮耗时算，几何平均倍数是：V8 4.8、LuaJIT 4.0、Bun 3.7、Rust 1.4。Rust 的 1.4 来自第一轮里要生成测试数据和起页，JIT 一侧的额外部分是解释执行和编译。对只跑一次的命令行工具，应该看的是这一列，而不是峰值。

**预热。**

- V8：给 2 核时，解释器案例第 1 轮就是 32 ms；只给 1 核时，前约 20 轮都在 48 ms，第 20 轮后才降到 31 ms。后台编译线程和业务抢同一个核时，优化版本要晚很久才到。容器里常见的 1 核限制，就是这个场景。
- V8 的多态案例里，轮次越往后反而越慢（115 ms → 190 ms），没有稳定在峰值。公开的预热研究也发现，只有不到一半的组合会稳定到达峰值（见下文参考）。
- LuaJIT 在第 2 轮就基本稳定；lli 和 clang 的 AOT 二进制从第 1 轮起就是平的。

**JIT 的隐性 CPU。** V8 跑单态案例时，CPU 时间比墙钟时间多 20%，多出来的是后台编译和 GC 线程；Bun 跑 binary-trees 时多 20–40%。LuaJIT 和 Rust 基本是 1:1。在按 CPU 计费的环境里，这部分也要算进成本。

## LLVM 对照：同一份 IR，四种跑法

同一份 C 代码由 clang 生成 LLVM IR，然后分别提前编译成可执行文件、交给 LLVM 的 JIT（lli）、编译成 Wasm 交给 V8。再加 gcc 以及 gcc 加 PGO 两档。表中是相对 clang AOT 的倍数。

| 案例 | clang AOT ms | LLVM JIT | Wasm in V8 | gcc native | gcc + PGO |
| --- | --- | --- | --- | --- | --- |
| n-body | 53 | 1.25 | 1.30 | 0.89 | 0.96 |
| fib(32) | 5.0 | 1.01 | 2.21 | 0.63 | 0.61 |
| 单态函数指针 | 50 | 1.11 | 0.70 | 0.56 | 0.57 |
| 五种函数指针 | 50 | 1.23 | 0.80 | 0.59 | 0.59 |
| 不规则分支 | 61 | 1.12 | 1.01 | 1.12 | 1.08 |
| 字节码解释器 | 11.4 | 1.12 | 1.18 | 1.28 | 1.39 |
| 矩阵乘 | 4.2 | 1.03 | 2.90 | 0.88 | 0.59 |
| **几何平均** |  | **1.12** | **1.28** | **0.81** | **0.78** |

读法：

- **编译发生在什么时候，影响很小。** LLVM JIT 和 AOT 用的是同一个优化器和代码生成器，峰值只差 12%（可能来自 JIT 代码的内存布局和调用方式，没有深入核实）。差距全部反映在启动 69 ms 和内存 75 MB 上。
- **换编译器的影响比开 PGO 大。** gcc 整体比 clang 快 19%，而 PGO 在 gcc 基础上只再快约 4%。其中矩阵乘快了 1/3，解释器反而慢了一点。函数指针案例开 PGO 后没有变快，这里的测量没有看到“PGO 去虚拟化”的收益。
- **Wasm 的损失集中在递归和向量化。** fib 慢 2.2 倍（每次调用都有栈溢出检查），矩阵乘慢 2.9 倍（默认没开 SIMD）；函数指针案例反而快 20–30%，因为 Wasm 是 32 位地址，每个对象从 16 字节变成 8 字节。几何平均 1.28 倍，和公开论文的 1.45–1.55 倍同一量级。

## 公开测试参考

沙箱数据只给方向，下面的公开测试给量级。每条都打开过原页核对。

**峰值：Benchmarks Game（Rust 1.84 vs Node 23）**。用的是各语言最快的程序，许多带手写 SIMD 或多线程，所以差距比本文大。

| 程序 | Rust | Node.js | 倍数 |
| --- | --- | --- | --- |
| n-body | 2.19 s（不用 SIMD 的最佳 3.46 s） | 8.55 s | 2.5–3.9 |
| mandelbrot | 0.95 s | 4.05 s | 4.3 |
| spectral-norm | 0.72 s | 5.40 s（单线程） | 7.5 |
| k-nucleotide | 2.57 s | 15.99 s | 6.2 |
| binary-trees | 1.07 s，139 MB | 8.61 s，1.28 GB | 8.0 |

来源：[Benchmarks Game: Node.js vs Rust](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/node-rust.html)

**LuaJIT。**

- 2009 年发布 2.0 时，SciMark 综合分：GCC 906、JVM Server 876、LuaJIT 580、Lua 5.1 仅 16.5。来源：[lua-l 邮件列表](http://lua-users.org/lists/lua-l/2009-11/msg00023.html)。
- 2026 年的一篇论文在 7 个 Benchmarks Game 程序上测得：LuaJIT 比 Lua 5.4 快约 7 倍，比 C 慢 7.9 倍。来源：[The Green Side of the Lua](https://arxiv.org/pdf/2601.16670)。
- 追踪 JIT 的真实弱点是 NYI（尚未实现编译的函数，如 pairs、string.gsub）和 trace 中止：一个 NYI 即可让无关的热循环慢 14 倍，循环里创建闭包慢 60 倍。来源：[Stream HPC, 2026](https://streamhpc.com/the-luajit-nyi-that-silently-poisoned-an-unrelated-hot-loop/)、[API7 / OpenResty](https://api7.ai/learning-center/openresty/avoid-lua-not-yet-implemented-features)。

**预热：Virtual Machine Warmup Blows Hot and Cold（OOPSLA 2017）。** 测了 V8、LuaJIT、HotSpot、PyPy 等 8 个虚拟机，每个进程跑 2000 轮：最多只有 43.5% 的组合会稳定到达峰值，近一半情况下同一组合在同一台机器上会出现不同的表现。来源：[arXiv 1602.00602](https://arxiv.org/abs/1602.00602v6)。Cloudflare 另有文章称 LuaJIT 是“见过最不确定的虚拟机”，原因之一是所有循环共用 64 个热度计数器。来源：[Cloudflare, 2018](https://blog.cloudflare.com/more-consistent-luajit-performance)。

**Wasm 对原生：Not So Fast（USENIX ATC 2019）。** SPEC CPU 上 Chrome 平均慢 55%、Firefox 慢 45%，最多 2.5 倍；主要原因是保留寄存器、每次函数调用的栈检查和间接调用检查。来源：[Jangda et al.](https://usenix.org/conference/atc19/presentation/jangda)。

**V8 的分层。**

- JetStream 上 TurboFan 比纯解释器快 4.35 倍；Maglev 的编译速度介于 Sparkplug 和 TurboFan 之间（各差约 10 倍）。来源：[V8 blog: Maglev](https://v8.dev/blog/maglev)。
- 关掉 JIT 后，Speedometer 慢约 40%，其中一半来自正则表达式解释执行。来源：[V8 blog: JIT-less V8](https://v8.dev/blog/jitless)。本文沙箱里的纯计算案例慢了 24 倍，说明网页负载和纯计算负载对 JIT 的依赖差别很大。

**PGO。** Go 官方给出的典型收益是 2–14%（[go.dev/doc/pgo](https://go.dev/doc/pgo)）；rustc 自身用 PGO 最多快 15%（[rustc-dev-guide](https://rustc-dev-guide.rust-lang.org/building/optimized-build.html)）；Android 的 Rust 工具链 LTO + PGO + BOLT 合计快 24.7%（[Android Developers Blog](https://android-developers.googleblog.com/2023/12/faster-rust-toolchains-for-android.html)）。和本文 gcc PGO 的 4% 是同一量级：一成左右的收益，不是倍数级。

**启动和内存：同一份代码的 JIT 与 AOT。**

| 测试 | 启动 | 内存 | 峰值吞吐 |
| --- | --- | --- | --- |
| Spring PetClinic，Oracle GraalVM 21（native image + PGO vs C2 JIT） | 7.09 s → 0.21 s | 1029 → 641 MB | 持平略高（11066 → 11902 req/s） |
| Quarkus 0.18（native vs JVM，无 PGO） | 1629 → 18 ms | 414 → 122 MB | 降到 58%（77118 → 44841 req/s） |
| ASP.NET Core 8 最小 API（NativeAOT vs JIT） | 156 → 48 ms | 96 → 41 MB | 未公布 |

来源：[Oracle GraalVM for JDK 21](https://blogs.oracle.com/graal/oracle-graalvm-for-jdk-21)、[Quarkus runtime performance](https://quarkus.io/blog/runtime-performance)、[ASP.NET Core in .NET 8](https://devblogs.microsoft.com/dotnet/announcing-asp-net-core-in-dotnet-8)。这一组最能说明问题：**AOT 在不带 PGO 时峰值会明显下降，带上 PGO 后可以持平；启动和内存则始终是 AOT 赢。**

## 什么场景选什么

把峰值、预热、启动、内存和工程成本放在一起看，选择大致如下：

| 场景 | 推荐 | 理由 |
| --- | --- | --- |
| 命令行工具、Serverless、短任务 | AOT（Rust / C / Go），或 LuaJIT | 进程活不到 JIT 预热完成；Node 启动 27 ms、空载 42 MB，Rust 2 ms、12 MB |
| 长期运行的服务端业务 | JIT 完全够用（Node / JVM） | 峰值约为 AOT 的一半到持平，开发效率更重要；GraalVM 数据显示 AOT 不带 PGO 时吞吐反而下降 |
| 数值计算、矩阵、SIMD | AOT + native + LTO，热点再上 PGO | matmul 上 JIT 慢 4–7 倍；向量化和内存布局是 AOT 的主场 |
| 对象多、分配多、动态派发 | JIT 不吃亏，甚至更快 | mono / trees 上 V8 比 Rust 快：内联缓存 + 分代 GC 胜过 `Box<dyn>` 和逐个 malloc |
| 嵌入式脚本、游戏逻辑、网关插件 | LuaJIT | 0.6 MB、2 ms 启动，峰值接近 V8；要避开 NYI 函数 |
| 规则、查询、DSL 在运行时才确定 | 运行时生成代码（`new Function` / `load` / LLVM ORC） | 生成代码比通用解释快 1.2–5 倍，接近写死在源码里的 AOT 版本 |
| 浏览器里跑重计算 | Wasm | 同一份 C 代码约慢 1.3 倍，远好于纯 JS 的最差情况，且性能稳定 |
| 延迟敏感、要求可预测 | AOT | JIT 的预热和去优化会带来抖动（V8 poly 从 115 ms 漂到 190 ms），公开研究也指出大量组合达不到稳定峰值 |
| 受限平台（iOS、禁止 W^X 的环境） | AOT，或 jitless 解释器 | 无法写可执行内存；此时 V8 jitless 慢 24 倍，需要接受或换方案 |

**一句话：** 跑得久、动态性强，选 JIT；启动快、内存小、要稳、算得密，选 AOT；规则运行时才知道，就在运行时生成代码——不管宿主是 JIT 还是 AOT。

## 要回答的问题

不问“谁更快”，而是拆成四个可以量的问题：

1. **峰值上限**：稳定状态下，成熟的 JIT 离同一算法的 C/Rust -O2 还差多少？哪些代码 JIT 能持平甚至反超？
2. **到达峰值的代价**：预热要多久、启动要多久、这段时间里编译器吃掉多少 CPU。
3. **常驻成本**：内存（代码缓存、剖析数据、编译线程）、分发体积、延迟抖动。
4. **构建成本**：AOT 的编译时间和内存，PGO 要多跑一轮，以及它能补回多少“运行时信息”。

最终要得到的是一张“什么场景选什么”的判断表，而不是一个总排名。

## 对比对象

主线是三方：**V8（分层方法 JIT）、LuaJIT（追踪 JIT）、Rust（AOT）**。两种 JIT 的思路正好相反：V8 按函数编译，LuaJIT 沿着热循环的实际执行路径编译。另加三组我认为重要的对照。

| 方案 | 类型 | 测哪几档 | 来源 |
| --- | --- | --- | --- |
| V8（Node 22） | 分层方法 JIT：解释器 → Sparkplug → Maglev → TurboFan | 全开；关掉 TurboFan；纯解释（--jitless） | 沙箱已有 |
| LuaJIT 2.1 | 追踪 JIT | 全开；关掉 JIT（-joff，只剩手写汇编解释器） | 从 GitHub 源码编译，约一分钟 |
| Rust 1.97 | AOT | 默认 release；+ target-cpu=native + LTO；+ PGO | 沙箱已有，PGO 工具已有 |
| 加：Lua 5.4 | 纯解释器 | 官方解释器 | 源码编译；用来衡量 LuaJIT 的 JIT 和解释器各自贡献多少 |
| 加：Rust → Wasm，跑在 V8 里 | AOT 产物再由 V8 编译（Liftoff / TurboFan） | 同一份 Rust 代码 | 沙箱已有；看“提前编译再进沙箱”损失多少，也是 JS 世界里最接近 AOT 的方案 |
| 加：Bun（JavaScriptCore） | 另一套分层 JIT | 同一份 JS | 沙箱已有；判断结论是 V8 特有，还是方法 JIT 共有 |

C（clang -O2）只用来校验 Rust 的基准是否正常。原先提到的 Java（HotSpot 对 native-image）、Python、Ruby、C# 移到可选补充，不在主线。

## 代码案例清单

12 个案例，每个用 JS、Lua、Rust 各写一份，算法和输入一致。只用各语言自带的能力，不引入第三方库，这样量到的是编译器，而不是库写得好不好。

| # | 案例 | 测的是什么 | 对谁是考验 |
| --- | --- | --- | --- |
| 1 | n-body 浮点循环 | 紧密数值循环、寄存器分配 | 定三方的“天花板”；LuaJIT 在这类代码上以接近 C 著称 |
| 2 | 递归 fib(38) | 函数调用与内联 | 追踪 JIT 处理递归的弱点；V8 内联能力 |
| 3 | 多态分派 | 同一个调用点，运行时只有 1 种 vs 5 种对象形状轮换 | V8 的内联缓存从单态变成超多态；Rust 的 dyn Trait 加不加 PGO |
| 4 | binary-trees | 大量短命对象分配与回收 | V8 分代 GC、LuaJIT 的 GC 与分配下沉、Rust Box 与 arena |
| 5 | 哈希表词频统计 | 字符串哈希、表增长 | 最常见的业务型负载；字符串驻留的影响 |
| 6 | 不规则分支 | 循环里由数据决定走哪一支，分支之间概率接近 | 追踪 JIT 的天然弱点：支线太多、trace 爆炸或中止 |
| 7 | 小型字节码解释器 | 各语言写同一个解释器，跑同一段程序 | 大 switch 分派循环。和自己做语言的人最相关 |
| 8 | 字符串处理 | 手写 JSON 分词与构建，字符串拼接 | 字符串不可变带来的分配；Rust 的零拷贝 |
| 9 | 矩阵乘 | 自动向量化（SIMD）、循环变换 | 两种 JIT 基本不做自动向量化，Rust 可以；看差距有多大 |
| 10 | 启动型任务 | hello world；读 1 MB CSV 求和一次就退出 | 命令行工具、冷启动 |
| 11 | 预热曲线 | 案例 3、7 连续跑 200 轮，记录每轮耗时 | 从解释到峰值要多久；有没有反优化和抖动 |
| 12 | 运行时特化 | 启动后才读入的过滤规则，由程序生成代码再执行（JS 用 new Function，Lua 用 load） | JIT 可以把规则编进机器码，Rust 只能解释规则。最可能看到 JIT 反超的地方 |

可选第 13 个：**FFI 调用 C 函数**。LuaJIT 的 FFI 可以被 JIT 直接编译进 trace，Node 调原生模块要过一层边界，可以量出这层边界的代价。

## 指标与方法

七个指标，每个都先写清楚怎么量，避免“拿 JIT 的冷启动比 AOT 的峰值”这类不公平对比。

| 指标 | 怎么量 |
| --- | --- |
| 峰值吞吐 | 进程内先预热，再量稳定后的单轮耗时；取中位数，报告最小和最大 |
| 首次结果时间 | 从启动进程到第一轮结果输出，包含启动和未优化阶段 |
| 预热曲线 | 每轮耗时随轮次变化；到达峰值 95% 所需轮数和时间 |
| 启动时间 | hello world 和单次任务，重复 20 次取中位数 |
| 内存 | 峰值 RSS（/usr/bin/time -v），同时记录堆配置，避免拿默认大堆和紧凑堆直接比 |
| 体积 | 可执行文件大小；JIT 一侧加上运行时本身的大小 |
| 构建成本 | 编译的墙钟时间和峰值内存；PGO 加上采集运行的时间。JIT 一侧记录运行中编译线程的 CPU 时间 |

公平性约定：

- 同一算法、同一输入、校验输出一致，防止编译器把工作整个优化掉。
- AOT 分两档：可移植的默认配置（x86-64 基线）和全开配置（-march=native + PGO + LTO）。JIT 天生用本机指令集，只拿基线比会偏向 JIT。
- 绑定单核运行，另一个核留给 JIT 编译线程和 GC，并单独报告“只给一个核”时的结果。
- 每组跑 5 次。云端沙箱有邻居干扰，只对比同一时段的数据，绝对数字仅供参考。
- 每个案例的代码、命令和原始数据都保留，可以在你自己的机器上复跑。

## 复现

前面“要回答的问题”到“指标与方法”是实测前定下的方法，保留作为附录；实测前的预判已并入“假设核对”。

代码共五个文件，每个案例在各语言中算法、数据和校验和完全一致（用 MINSTD 伪随机数，保证各语言结果逐位相同）：

- `b.js`：给 Node / Bun，`node b.js <案例> <轮数>`
- `b.lua`：给 LuaJIT 和 Lua 5.4，同一份代码
- `b.rs`：给 Rust，另有 `rules_fixed`（规则写死）
- `b.c`：给 clang / gcc / lli / wasm
- `wasm.js`：在 V8 里跑 `b.wasm`

关键构建命令：

```
rustc -C opt-level=3 -o r_def b.rs
rustc -C opt-level=3 -C target-cpu=native -C lto=fat -C codegen-units=1 -o r_nat b.rs
clang -O2 -march=native -o c_nat b.c
clang -O2 -emit-llvm -c -o b.bc b.c && lli -O2 b.bc nbody 10
clang --target=wasm32 -O2 -nostdlib -DWASM -Wl,--no-entry -Wl,--export-all -o b.wasm b.c
gcc -O2 -march=native -fprofile-generate ... && gcc -O2 -march=native -fprofile-use ...
node --no-turbofan b.js nbody 10    # 去掉优化编译器
node --jitless b.js nbody 10        # 纯解释
luajit -joff b.lua nbody 10         # 关闭 LuaJIT 的 JIT
```

环境：Node 22.22、Bun 1.4.2、LuaJIT 2.1、Lua 5.4、Rust 1.97（LLVM 22）、clang / lli 18.1、gcc 13.3，共享云沙箱。只跑到能得出结论为止，每个组合 10 轮左右；在自己的机器上重跑，绝对值会变，倍数和排序应大致保持。
