# Desk

AI 协作制作的讲解视频与调研资料：网页代码、图片素材、稿子和制作工具。视频文件不入库。

## 内容

| 目录 | 内容 |
| --- | --- |
| `site/fiber-bundles/` | 《纤维丛》两集的场景代码（`?ep=1/2`，图片 + canvas 动画）与图解文档 `report.html`（22 张图）；稿子、字幕、绘图脚本与工具在 `sources/fiber-bundles/` |
| `site/standing-waves/` | 《驻波》两集的场景代码（`?ep=1/2`，图片 + canvas 动画）与图库 `gallery.html`；稿子、字幕、绘图脚本、Commons 署名与工具在 `sources/standing-waves/` |
| `site/langfuse-v4/` | 《Langfuse v4 数据链路》三集的场景代码（`index.html?ep=1/2/3`）与参考网页 `report.html`（格式转换表、六种对接、大体积关口、脱敏回调契约、环境变量、代码位置）；稿子、字幕、源码核对记录与工具在 `sources/langfuse-v4/` |
| `site/frontend/` | 《现代前端：桌面浏览器里的知识与优化体系》三集的场景代码（`?ep=1/2/3`，全部为 canvas 程序动画与代码卡）；稿子、字幕、时间线与合成脚本、标题与描述在 `sources/frontend/` |
| `site/xihu/nk/` | 《守夜人》科幻音乐短片的网页版 `mv.html`（23 张 Commons 公开授权实景照片缩小版、Gemini 生成的人物图层与非真实场景；层剥落、点云重落位、条带拼接）；分镜、提示词、旁白稿、配乐与混音脚本、照片署名在 `sources/xihu/nk/` |
| `site/xihu/` | 《无限西湖》科幻短片的网页版 `mv.html`（68 张 Gemini 生成的分镜图缩小版、Droste/庞加莱/时间片着色器）；提示词、图片与旁白生成脚本、配乐合成脚本在 `sources/xihu/` |
| `site/moon-tug/` | 《月球拖船：行星发动机可行性推演》的场景代码（three.js，复用太空电梯的模型）与音乐短片 `mv.html`（网页版无声）；稿子、字幕、轨道计算脚本 `calc/`、配乐合成脚本 `mv/` 与工具在 `sources/moon-tug/` |
| `site/space-elevator/` | 《如何建造一座太空电梯（设想篇）》的场景代码（three.js，`glb/` 是减面后按部件上色的 Tripo 模型）；稿子、字幕、减面与上色脚本在 `sources/space-elevator/` |
| `site/algebraic-effects/` | 《代数作用》两集的场景代码（`?ep=1/2`）与文档页 `report.html`；稿子、字幕、Markdown 原文与工具在 `sources/algebraic-effects/` |
| `site/type-annotations/` | 《类型标注》两集的场景代码（`?ep=1/2`）与文档页 `report.html`；稿子、字幕、Markdown 原文与工具在 `sources/type-annotations/` |
| `site/web-color/` | 《Web 的颜色》两集的场景代码（`?ep=1/2`）与文档页 `report.html`；稿子、字幕、Markdown 原文与工具在 `sources/web-color/` |
| `site/electron-cloud/` | 《电子云》四集 + 番外的场景代码（`?ep=1..5`，番外用琴弦、鼓面、振动球面推出轨道形状，three.js 点云 + 等值面 / 截面，原子模型 `ec.js`、反应模型 `mol.js`、等值面 `iso.js`）与互动页 `explorer.html`；稿子、字幕与工具在 `sources/electron-cloud/` |
| `site/china-arch/` | 《卫星上的中国考古》五集的场景代码（`?ep=1..5`，`geomap.js` 卫星时间地图）与互动地图 `explorer.html`；稿子、字幕与工具在 `sources/china-arch/` |
| `site/calcite/` | 《方解石》两集的场景代码（`?ep=1/2`，含 3D 绘图库 `g3.js`）与文档页 `report.html`；稿子、字幕、Markdown 原文与工具在 `sources/calcite/` |
| `site/jit-aot/` | 《JIT 与 AOT：性能上限与成本实测》报告页；案例代码（JS / Lua / Rust / C）、原始数据和 Markdown 原文在 `sources/jit-aot/` |
| `site/text-and-tree/` | 《文本与树》三集加番外的场景代码，`?ep=1/2/3/4`；稿子、字幕、工具在 `sources/text-and-tree/` |
| `site/structural-editing/` | 《文本与树》：代码结构化编辑与代码可视化的调研提纲（三集视频），配 Wikimedia Commons 图片与项目截图 |
| `site/lingao/` | 《临高启明 · 地图上的八年》视频的场景代码、卫星底图与照片素材，可在浏览器中播放 |
| `site/design-system/` | 《设计规范》两集视频的场景代码，`?ep=1` 上集、`?ep=2` 下集 |
| `site/_shared/player.js` | 浏览器播放控件（播放/暂停、拖动、倍速；空格、左右方向键）。无头浏览器渲染时自动关闭 |
| `sources/*/` | 稿子（`mkscript.py` / `script.json`）、字幕 `.srt`、标题与描述、调研原始资料、配音与渲染工具 |
| `scripts/build.mjs` | 构建脚本 |

视频页面就是逐帧渲染视频时用的同一套代码，浏览器中观看时没有配音，字幕按时间轴同步。

大文件不入库：视频、配音、高分辨率卫星图都不放进仓库。《卫星上的中国考古》的底图与遗址近景在浏览器里直接从 NASA GIBS 和 EOX 拉瓦片拼成。

## 本地查看

```bash
node scripts/build.mjs      # 生成 dist/
npx serve dist              # 或任意静态服务器
```

也可以直接打开 `site/` 下的 HTML。

## 发布

推送到 `main` 后由 GitHub Actions（`.github/workflows/upload.yaml`）完成：

1. `ASSET_BASE=https://cos-sh.tiye.me/<owner>/<repo>/ node scripts/build.mjs`：给每个 HTML 注入 `<base>`，图片、脚本、样式都从 COS 加载；页面之间的链接按当前页面地址解析。
2. 对比上一次推送（PR 对比目标分支），只把 `site/` 下有改动的项目目录（以及 `site/` 根目录下改动的文件）上传到 COS（`worktools/cos-upload-action`）；只有 `scripts/` 改动时才全量上传，只改了 `sources/` 等则跳过上传。
3. 只把 HTML 入口 rsync 到 `tiye.me:/web-assets/repo/<owner>/<repo>`。

PR 只上传到 COS 的 `pr/<编号>/...` 前缀，不同步服务器。需要的 secrets：`COS_BUCKET`、`COS_SECRET_ID`、`COS_SECRET_KEY`、`rsync_private_key`。

## 重新渲染视频

工具在 `sources/<项目>/tools/`，在对应的 `site/<项目>/` 目录下运行（需要 Playwright、ffmpeg；Chromium 路径用 `CHROME` 环境变量指定）：

```bash
cd site/lingao
python3 ../../sources/lingao/tools/import_audio.py <pcm 目录>   # 配音由 sources/lingao/tts/gen_tts_local.py 生成
python3 ../../sources/lingao/tools/build_tl.py
node ../../sources/lingao/tools/render.mjs 1 0 1
python3 ../../sources/lingao/tools/assemble.py 1
```

配音脚本从命令行参数指定的 env 文件读取 API Key，仓库中不保存任何密钥。

## 素材来源

- 卫星底图：© 高德地图 GS(2025)5996号，仅叠加自绘位置与线路
- 新闻照片：来源与原页面记录在 `site/lingao/A/news/credits.json`，画面中逐张标注
- Wikimedia Commons 图片：作者与授权见 `sources/structural-editing/commons-credits.json`、`site/lingao/A/photos/credits.json`、`sources/standing-waves/commons-credits.json`（《驻波》画面中逐张标注）
- 地球贴图：NASA Blue Marble；太空电梯三维模型：Tripo 生成
- 临高启明情节资料：临高启明灰机 wiki（CC BY-SA 3.0）
- Cirru / Calcit 编辑器截图：来自 calcit-lang/editor、Cirru/hovenia-editor 的 README
