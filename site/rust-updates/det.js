// 金色细节卡：键 = 场景id_beat序号
const DET = {
  a_ed_0: ['2024 版次的其他变化', 'impl Trait 返回值默认捕获全部生命周期', 'gen 保留为关键字', 'if let 的临时值提前释放', '依赖解析默认参考 rust-version', '!（从未类型）的回退规则调整'],
  a_flow_1: ['let 链', 'RFC 2497，2018 年接受', '2025-06-26 随 1.88 稳定', '仅 2024 版次可用', 'while 里也能用'],
  a_type_4: ['从未类型 ! 的历程', 'RFC 1216，2016 年接受', '2024 版次：回退规则改为 !', '1.92：相关警告升为默认报错', '2026-11-12：随 1.100 稳定'],
  a_coll_2: ['extract_if 家族', 'Vec / LinkedList · 1.87', 'HashMap / HashSet · 1.88', 'Vec 版本要给一个范围参数：', '写 .. 表示整个列表'],
  a_alloc_1: ['分配器接口 · 1.100', 'Allocator / Global / System', 'Vec::new_in、with_capacity_in', 'Box::new_in 等', '分配失败返回 AllocError'],
  a_cargo_2: ['依赖冷却期 · 1.100', 'registry.global-min-publish-age', '单个源：registries.&lt;名&gt;.min-publish-age', 'resolver.incompatible-publish-age', '默认 deny：只用满期的版本', 'Cargo.lock 里已有的不受影响'],
  a_cargo_3: ['缓存自动清理 · 1.88', '3 个月未用的下载文件', '1 个月未用的可再生文件', '只在 build / test / fetch 等命令时清理', '离线模式下不清理'],
};
