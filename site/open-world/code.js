// 代码卡。cols: [[标题, 源码, 颜色]]；行首 !! = 高亮。全部为简化示意。
CODE.cells = { fn: 'C++ · 示意：按加载半径算出要加载 / 卸载的格子', src: `// 每 0.25 秒算一次（World Partition 运行时网格的思路，简化）
TSet<FIntPoint> Wanted;
FIntPoint C = WorldToCell(Player.Pos);              // 玩家所在的格子
int R = ceil(LoadRadius / CellSize);
for (int y = -R; y <= R; y++) for (int x = -R; x <= R; x++)
  if (DistToCell(Player.Pos, C + FIntPoint(x, y)) < LoadRadius)
    Wanted.Add(C + FIntPoint(x, y));

for (FIntPoint P : Wanted)                           // 新进入半径：排队异步加载
!!  if (!Loaded.Contains(P)) Queue.Push({ P, Priority(P) });
for (FIntPoint P : Loaded)                           // 超出卸载半径（比加载半径大）才卸载
!!  if (DistToCell(Player.Pos, P) > UnloadRadius) Unload(P);

AsyncLoader.Pump(Queue, 2.0 /* 每帧最多占用的毫秒数 */);`, fs: 24, note: '两个半径之差就是“缓冲带”；Priority 通常按距离和视线方向排序，近的、正前方的先加载。' };

CODE.ulp = { fn: 'C++ · 示意：float 坐标的“最小步长”随距离变大', src: `#include <cmath>
// 一个 float 和“下一个能表示的 float”之间差多少
float ulp(float x) { return std::nextafter(x, INFINITY) - x; }

ulp(1.0f)          // 1.19e-07 米
ulp(1000.0f)       // 6.10e-05 米 ≈ 0.06 毫米   （1 公里）
ulp(10000.0f)      // 9.77e-04 米 ≈ 1 毫米      （10 公里）
!!ulp(100000.0f)     // 7.81e-03 米 ≈ 8 毫米      （100 公里）`, fs: 30, note: '指数每增大 1，步长翻一倍：距离每翻一倍，精度就损失一半。' };

CODE.rebase = { fn: 'C# · 示意：Unity 里常见的“浮动原点”脚本', src: `public class FloatingOrigin : MonoBehaviour {
  public Transform player;
  const float Threshold = 5000f;                  // 离原点 5 公里就重设
  public static Double3 WorldOffset;              // 自定义的 double 向量，记住累计偏移

  void LateUpdate() {
    Vector3 p = player.position;
    if (p.magnitude < Threshold) return;
!!    foreach (GameObject root in SceneRoots())    // 所有根物体一起平移回原点附近
!!      root.transform.position -= p;
    WorldOffset += p;                             // 存档、联网时换算回“真实坐标”
    // 粒子、刚体、导航网格、着色器里的世界坐标也要一起处理
  }
}`, fs: 25, note: '难点不在平移本身，而在“所有依赖世界坐标的系统”都要同步改。' };

CODE.sse = { fn: 'C++ · 示意：屏幕空间误差与 LOD 选择', src: `// 几何误差（世界单位）投影到屏幕上占几个像素
float ScreenError(float geomError, float dist, float fovY, float screenH) {
  float pixelsPerUnit = screenH / (2.0f * dist * tan(fovY * 0.5f));
  return geomError * pixelsPerUnit;
}

// 从最粗的一级开始试，误差小于 1 个像素就用它
int SelectLOD(const Mesh& m, float dist) {
  for (int i = m.NumLODs - 1; i > 0; i--)
!!    if (ScreenError(m.LOD[i].Error, dist, FovY, 1080) < 1.0f) return i;
  return 0;                                        // 实在不行就用最细的一级
}`, fs: 26, note: 'Nanite 用的是同一个判据，只是按“簇组”而不是整个模型来挑选。' };

CODE.hzb = { fn: 'HLSL · 示意：HZB 遮挡剔除（每个物体一个线程）', src: `StructuredBuffer<Bounds> Objects;   Texture2D<float> HZB;    // 上一帧深度金字塔（存最远深度）
RWStructuredBuffer<DrawArgs> Args;  RWStructuredBuffer<uint> Count;

[numthreads(64, 1, 1)]
void CullCS(uint id : SV_DispatchThreadID) {
  float4 rect; float nearZ;                               // 屏幕矩形（uv）与包围盒最近深度
  if (!ProjectBox(Objects[id], ViewProj, rect, nearZ)) return;   // 视锥外
  float2 size = (rect.zw - rect.xy) * HZBSize;
!!  float mip = ceil(log2(max(size.x, size.y)));           // 挑一层，让矩形只覆盖 2×2 个纹素
  float4 d = float4(HZB.SampleLevel(S, rect.xy, mip), HZB.SampleLevel(S, rect.zy, mip),
                    HZB.SampleLevel(S, rect.xw, mip), HZB.SampleLevel(S, rect.zw, mip));
  float farZ = max(max(d.x, d.y), max(d.z, d.w));
!!  if (nearZ > farZ) return;                              // 比挡板最远处还远：整个被挡住
  uint i; InterlockedAdd(Count[0], 1, i);
  Args[i] = MakeDrawArgs(id);                             // 留下的写成间接绘制参数
}`, fs: 21, note: '这里按标准 Z（数值越大越远）；用反向 Z 时把 max 换成 min、比较方向反过来。随后 CPU 只发一条 DrawIndirect。' };
CODE.vt = { fn: 'HLSL · 示意：虚拟纹理的一次采样', src: `Texture2D<uint> PageTable;   // 页表：每个虚拟页 → 物理缓存里的位置
Texture2D       Cache;       // 物理缓存：常驻显存的一批小页（比如 128×128）

float4 SampleVT(float2 uv, uint mip) {
  uint e = PageTable.Load(int3(uv * PagesAt(mip), mip));
  while (!IsResident(e)) {                              // 这一页还没加载
!!    mip++; e = PageTable.Load(int3(uv * PagesAt(mip), mip));   // 退回更粗的一级
  }
  float2 inPage = frac(uv * PagesAt(mip));              // 页内坐标
!!  float2 phys = (PagePos(e) + inPage) / CacheSizeInPages;
  WriteFeedback(uv, mip);                               // 记下需要的页，CPU 下一帧去加载
  return Cache.SampleLevel(LinearClamp, phys, 0);
}`, fs: 24, note: '真实实现还会给每页留边框、把页表做成多级 mip，并限制每帧上传的页数。' };
CODE.inst = { fn: 'C++（D3D12）+ HLSL · 示意：一次绘制调用画五万丛草', src: `// CPU：实例数据已经在显存里，一次调用画完
cmd->SetGraphicsRootShaderResourceView(1, instanceBuffer->GetGPUVirtualAddress());
!!cmd->DrawIndexedInstanced(grassIndexCount, 50000 /* 实例数 */, 0, 0, 0);

// GPU：顶点着色器按实例编号取出自己的变换
StructuredBuffer<float4x4> Instances;
VSOut VS(VSIn v, uint id : SV_InstanceID) {
!!  float4x4 world = Instances[id];
  float3 p = mul(world, float4(v.pos, 1)).xyz;
  p += Wind(p, v.color.r);          // 顶点颜色存“离根部多远”，越远摆得越多
  VSOut o; o.pos = mul(ViewProj, float4(p, 1)); return o;
}`, fs: 24 };
CODE.sdf = { fn: 'HLSL · 示意：在距离场里做光线步进', src: `float RayMarch(float3 ro, float3 rd, out float3 hit) {
  float t = 0;
  for (int i = 0; i < 64; i++) {
    float3 p = ro + rd * t;
!!    float d = SceneSDF(p);           // 到最近表面的距离：这段距离内一定没有东西
    if (d < 0.01 * t) { hit = p; return t; }   // 足够近就算命中（越远越宽松）
!!    t += d;                          // 放心地一步跨过去
    if (t > MaxDist) break;
  }
  return -1;                           // 没命中：取天空光
}
// Lumen：命中后去表面缓存（Surface Cache）读这一点的光照`, fs: 27 };
CODE.fbm = { fn: 'HLSL · 示意：体积云的密度函数', src: `float FBM(float3 p) {
  float sum = 0, amp = 0.5;
  for (int i = 0; i < 5; i++) {               // 5 层：频率 ×2，振幅 ×0.5
!!    sum += amp * Noise3D(p);
    p *= 2.02; amp *= 0.5;
  }
  return sum;
}
float CloudDensity(float3 p, float coverage) {
  float h = HeightInLayer(p);                      // 0 = 云底，1 = 云顶
  float shape = FBM(p * 0.0004 + Wind * Time);
!!  float d = saturate(shape - (1 - coverage));     // 阈值：coverage 越大云越多
  return d * smoothstep(0, 0.1, h) * smoothstep(1, 0.6, h);   // 底平、顶圆
}`, fs: 25 };
CODE.erode = { fn: 'C++ · 示意：一滴雨的一步（粒子法水力侵蚀）', src: `void Step(Drop& d, HeightMap& H) {
  float2 grad = H.Gradient(d.pos);                       // 当前位置的坡度
  d.dir = normalize(d.dir * Inertia - grad * (1 - Inertia));
  float2 next = d.pos + d.dir;
  float dh = H.At(next) - H.At(d.pos);                  // 往下走为负
  d.speed = sqrt(max(0.0f, d.speed * d.speed - dh * Gravity));
!!  float capacity = max(-dh, MinSlope) * d.speed * d.water * Capacity;
!!  if (d.sediment > capacity || dh > 0) {                // 带不动了：放下泥沙
    float drop = (dh > 0) ? min(dh, d.sediment) : (d.sediment - capacity) * Deposit;
    H.Add(d.pos, drop); d.sediment -= drop;
  } else {                                              // 还带得动：冲走一点
    float take = min((capacity - d.sediment) * Erode, -dh);
    H.Add(d.pos, -take); d.sediment += take;
  }
  d.pos = next; d.water *= (1 - Evaporate);             // 蒸发一点水
}`, fs: 23, note: '跑几十万滴，每滴几十步；真实工具还会把冲刷量分摊到附近几个格点，避免出现针孔。' };
CODE.scatter = { fn: 'C++ · 示意：一条“按坡度和高度种树”的规则', src: `TArray<FTransform> ScatterTrees(const FBox2D& Area, const FTerrain& T, uint32 Seed) {
  FRandomStream Rng(Seed);                               // 固定种子：每次结果一样
  TArray<FTransform> Out;
!!  for (FVector2D P : PoissonDisk(Area, /*最小间距*/ 4.0f, Rng)) {
    float Slope = T.SlopeAt(P), Height = T.HeightAt(P), Wet = T.MaskAt("flow", P);
    float Prob = SmoothStep(35, 20, Slope)              // 坡越陡越少
               * SmoothStep(1800, 1400, Height)         // 太高不长树
               * Lerp(0.6f, 1.0f, Wet);                 // 湿润处更密
!!    if (Rng.FRand() > Prob) continue;
    FRotator R(0, Rng.FRandRange(0, 360), 0);           // 随机朝向
    float S = Rng.FRandRange(0.8f, 1.25f);              // 随机大小
    Out.Add(FTransform(R, T.PointOnSurface(P), FVector(S)));
  }
  return Out;
}`, fs: 23 };
CODE.quest = { fn: '示意：数据驱动的任务（左：数据　右：通用执行逻辑）', cols: [['quest.json（设计师编辑）', `{
  "id": "lost_caravan",
  "trigger": { "enter_area": "east_road",
               "min_level": 5 },
  "objectives": [
    { "talk_to": "merchant_ada" },
!!    { "kill": "bandit", "count": 6 },
    { "return_to": "merchant_ada" }
  ],
  "reward": { "gold": 300,
              "item": "sturdy_cart" }
}`, '#FFD27A'], ['QuestRunner.cs（程序写一次）', `void OnEvent(GameEvent e) {
  foreach (var q in active) {
    var obj = q.Current;
!!    if (obj.Matches(e)) obj.progress++;
    if (obj.Done) q.Advance();
    if (q.Finished) Grant(q.reward);
  }
}
void OnEnterArea(string area) {
  foreach (var q in all)
    if (q.trigger.Satisfied(player, area))
      Activate(q);
}`, '#5CB4FF']], fs: 21, note: '新增一个任务只需要加一份数据，不用改代码，也不用重新编译。' };
CODE.bt = { fn: 'C++ · 示意：行为树的两种核心节点', src: `enum class EStatus { Success, Failure, Running };
struct Selector : Node {                       // 选择：挑第一个能成功的
  EStatus Tick(Agent& a) override {
    for (Node* c : Children) {
      EStatus s = c->Tick(a);
!!      if (s != EStatus::Failure) return s;     // 成功或进行中，就停在这里
    }
    return EStatus::Failure;
  }
};
struct Sequence : Node {                       // 序列：一步一步做完
  EStatus Tick(Agent& a) override {
    for (Node* c : Children) {
      EStatus s = c->Tick(a);
!!      if (s != EStatus::Success) return s;     // 失败或进行中，就停在这里
    }
    return EStatus::Success;
  }
};
// 根：Selector{ Sequence{看见敌人?, 战斗}, Sequence{饿了?, 找吃的}, 闲逛 }`, fs: 20, note: '真实实现会记住“进行中”的节点，下一帧从那里继续，而不是每次都从头判断。' };
CODE.ecs = { fn: 'C# · 示意：Unity Entities 的一个移动系统', src: `public struct Velocity : IComponentData { public float3 Value; }

[BurstCompile]
public partial struct MoveSystem : ISystem {
  [BurstCompile]
  public void OnUpdate(ref SystemState state) {
    float dt = SystemAPI.Time.DeltaTime;
    // 所有同时有“位置”和“速度”的实体，连续存放，顺序处理
!!    foreach (var (xf, vel) in
!!             SystemAPI.Query<RefRW<LocalTransform>, RefRO<Velocity>>())
      xf.ValueRW.Position += vel.ValueRO.Value * dt;
  }
}`, fs: 24, note: '换成 IJobEntity 就能自动分给多个线程；UE 的 Mass 用 Processor + Fragment 表达同样的思路。' };
CODE.fixed = { fn: 'C++ · 示意：固定步长的物理循环', src: `const double Dt = 1.0 / 60.0;          // 物理每步固定 1/60 秒
double accumulator = 0.0;

void Frame(double frameTime) {           // 渲染帧，时间不固定
  accumulator += std::min(frameTime, 0.25);   // 防止卡顿后“死亡螺旋”
!!  while (accumulator >= Dt) {
    prevState = state;
!!    state = Physics.Step(state, Dt);     // 每次只前进固定的一小步
    accumulator -= Dt;
  }
  double alpha = accumulator / Dt;       // 剩下不足一步的部分
  Render(Lerp(prevState, state, alpha)); // 在两步之间插值，画面顺滑
}`, fs: 24 };
CODE.save = { fn: 'C# · 示意：只存差异的存档', src: `[Serializable] class SaveFile {
  public int Version = 3;                          // 用于迁移旧存档
  public Dictionary<string, ObjDelta> Changed = new();
}
[Serializable] class ObjDelta {                    // 只记录和初始不同的部分
  public bool Opened, Destroyed;
  public Vector3? Position;
}
void Load(SaveFile s) {
  World.LoadPristine();                            // 先加载原始世界
!!  foreach (var (id, d) in s.Changed) {             // 再逐条套上差异
    var obj = World.FindByStableId(id);            // 稳定编号，不依赖加载顺序
    if (d.Destroyed) { obj.Remove(); continue; }
    if (d.Opened) obj.SetOpened();
    if (d.Position is Vector3 p) obj.Teleport(p);
  }
}`, fs: 23 };
CODE.relev = { fn: 'C++ · 示意：一个物体对某个玩家是否相关', src: `bool IsRelevant(const Actor& obj, const Player& viewer) {
  if (obj.AlwaysRelevant)            return true;   // 天气、比分
  if (obj.Owner == &viewer)          return true;   // 自己拿着的东西
  if (obj.Team && obj.Team == viewer.Team) return true; // 队友
  double d2 = DistSquared(obj.Location, viewer.ViewLocation);
!!  return d2 < obj.CullDistance * obj.CullDistance;     // 太远就不发
}

float Priority(const Actor& obj, const Player& viewer) {
  float p = obj.BasePriority;
  p *= 1.0f / (1.0f + Dist(obj, viewer) / 1000.0f);   // 越近越重要
  p *= viewer.IsLookingAt(obj) ? 2.0f : 1.0f;        // 看着的更重要
!!  return p * obj.TimeSinceLastSent;                   // 久没发的也要补上
}`, fs: 23 };
