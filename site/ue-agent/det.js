// 金色细节卡：键 = 场景id_beat序号
const DET = {
  a_week_0: ['来源', 'Epic 开发者论坛公告', '“Unreal Engine 5.9 MegaJam Preview”', '2026-11-09', '原文：first Unreal Engine release built', 'primarily with agentic workflows'],
  a_week_1: ['Web 平台（实验）', '起点：UE4 的 HTML5 平台', '（4.24 版移除）', 'WebAssembly + WebGPU，移动端渲染器', '需源码构建 + C++ 项目，Chrome 最佳'],
  a_week_2: ['已知问题（节选）', 'Wasm 内存超过 2 GB 会崩溃', '新项目默认未启用 MCP 工具集插件', 'itch.io 限制：总 500 MB / 单文件 200 MB', '建议在项目副本上试用'],
  a_week_3: ['Epic AI MegaJam 2026', '11 月 12–15 日 · 虚幻引擎或 UEFN 二选一', '奖金共 6.5 万美元', '另有最高 5 万美元继续开发资助', '获奖名单：2027-01-29 前公布'],
  a_mcp_0: ['Unreal MCP（5.8 起，实验）', '编辑器内嵌 MCP 服务器', '默认地址 127.0.0.1:8000/mcp', '只监听本机'],
  a_mcp_1: ['可接入的智能体', 'Claude Code · Codex', 'Cursor · OpenCode', '5.9 预览版：编辑器内 Unreal Assistant 面板'],
  a_test_0: ['实测来源', 'Puget Systems 博客', '“Unreal Engine MCP Hands-On”', '2026-07-09 · UE 5.8', '模型：Claude Opus 4.8'],
  a_wall_1: ['工具太多挤占上下文', '第三方插件厂商的说法：', '约 370 个工具的完整清单 ≈ 6 万 token', '按需检索的目录模式 ≈ 3 千 token', '（厂商自述，未经独立验证）'],
  a_wall_3: ['5.8 实验插件', '本机回环地址、无身份验证', '实验功能，Epic 提示安全加固未完成', '截图用于自检：画面会发给模型'],
  a_ue6_0: ['来源', 'Unreal Fest Tokyo 2026（11-03）', 'Inven Global、GameBusiness.jp、Kotaku 报道', '幻灯片上写的是“Remove”', '虚幻引擎 6：2027 年底抢先体验'],
  a_ue6_2: ['原话（据报道，经翻译）', '“最高约 4 倍”（Kotaku 转述）', '“1.5～4 倍”（Inven 报道）', '“目前领先的模型训练中很少见到 Verse，', '到 1 月会改变。”——Sweeney 在 X 上'],
  a_ue6_3: ['Unity AI（2026-05-04 公测）', 'Ask / Agent / Plan 三种模式', 'MCP 服务器：外部智能体可建场景、', '放预制体、写脚本、跑运行模式'],
  a_future_2: ['GDC《游戏产业现状》2026', '调查 2,300 多名从业者', '认为生成式 AI 有害：52%', '（2025 年 30%，2024 年 18%）', '36% 在工作中使用生成式 AI 工具'],
};
