# 给 Tripo 素模按部件规则上色 + 凹处暗化（近似环境光遮蔽）+ 面板明暗噪声，写入 COLOR_0。
import json, struct, sys, numpy as np, scipy.sparse as sp
from decimate import read_glb
def hexc(h): return np.array([(h >> 16) & 255, (h >> 8) & 255, h & 255], float) / 255
def vnormals(P, F):
    n = np.cross(P[F[:, 1]] - P[F[:, 0]], P[F[:, 2]] - P[F[:, 0]]); N = np.zeros_like(P)
    for k in range(3): np.add.at(N, F[:, k], n)
    return N / (np.linalg.norm(N, axis=1, keepdims=True) + 1e-12)
def cavity(P, F, N):
    n = len(P); i = np.concatenate([F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]]); j = np.concatenate([F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]])
    A = sp.coo_matrix((np.ones(len(i)), (i, j)), (n, n)).tocsr(); A.data[:] = 1; deg = np.asarray(A.sum(1)).ravel() + 1e-9
    c = np.zeros(n)
    for r in (1, 3, 8):   # 多尺度：一步、三步、八步邻域
        M = P.copy()
        for _ in range(r): M = (A @ M) / deg[:, None]
        L = M - P; c += ((L * N).sum(1)) / (np.linalg.norm(L, axis=1) + 1e-6) * (r ** .3)
    return c / 3
def noise(P, s):
    q = np.floor(P * s).astype(np.int64); h = (q[:, 0] * 73856093) ^ (q[:, 1] * 19349663) ^ (q[:, 2] * 83492791)
    return ((h % 1000) / 1000.0) - .5
def rules(name, P, N):
    H = P[:, 1].max(); x, y, z = P[:, 0] / H, P[:, 1] / H, P[:, 2] / H; n = len(P)
    C = np.tile(hexc(0xd9dde4), (n, 1))
    def put(mask, col): C[mask] = hexc(col)
    if name == 'climber':
        put(np.ones(n, bool), 0xcdd2da)
        put((y < .33) & (N[:, 1] > .3) & (z > -.08) & (np.abs(x) < .29), 0x213a74)             # 底部光伏板
        put((y > .86), 0x34383f)                                       # 顶部滚轮组
        put((y > .86) & (np.abs(N[:, 0]) > .85), 0x9aa3b0)             # 轮毂端面
        put((x < -.17) & (y > .58) & (y < .9), 0xd9a441)               # 侧挂货舱（金箔）
        put((np.abs(x) < .035) & (z > .05) & (y > .34), 0x7a6334)                  # 正面的带子
        put((y < .36) & (z < -.1), 0x34383f)                # 下部滚轮
    elif name == 'sea_platform':
        put(np.ones(n, bool), 0xd8dadf)
        put(y < .36, 0xe0a52a)                                         # 浮筒立柱：安全黄
        put((y < .36) & (((y * 30).astype(int)) % 6 == 0), 0x2b2e33)   # 立柱上的深色环带
        put((y < .1), 0x7a3a22)                                        # 吃水线以下：防污红
        put((y >= .33) & (y < .43), 0x7f858d)                          # 甲板桁架
        der = (y > .5) & (np.abs(x) < .13) & (np.abs(z) < .13)
        put(der, 0xe7e9ec); put(der & (((y * 24).astype(int)) % 2 == 0), 0xc8452f)   # 井架红白相间
        put((y > .43) & (y < .62) & (x > .28), 0xe08a2a)               # 右侧舱室：橙
        put((y > .43) & (y < .62) & (x < -.25), 0x5d7a9c)               # 左侧设备：灰蓝
    elif name == 'geo_station':
        put(np.ones(n, bool), 0xe6e8ec)
        pan = (np.abs(N[:, 0]) > .9) & (np.abs(x) > .1) & ((y > .62) | (y < .52)) & (np.abs(z) < .33)
        put(pan, 0x1c2f6e)                                             # 太阳能板
        put(pan & (noise(P, 60) > .38), 0x2a4590)
        put((np.abs(y - .54) < .035) & (np.abs(x) < .06) & (np.abs(z) < .06), 0xc9a24a)   # 中央节点金箔
        put((y < .08), 0x8f949c)
    elif name == 'laser_station':
        put(np.ones(n, bool), 0xdde0e5)
        ax = np.array([0, .5, .87]); dish = y > .6
        put(dish, 0x50555e)                                            # 镜筒与背面
        put(dish & ((N @ ax) > .5), 0x4a63a0)                         # 主镜（六边形镜片）
        put((y > .3) & (y < .45), 0xb8bdc6)
        put((y < .16), 0x8d9096)                                       # 基座平台：混凝土
        put((y > .16) & (y < .22), 0xd8a23a)                           # 黄色警示带
    return C
def write(path, P, F, C):
    V = P.astype(np.float32); col = (np.clip(C, 0, 1) * 255 + .5).astype(np.uint8); col4 = np.concatenate([col, np.full((len(col), 1), 255, np.uint8)], 1)
    pb, cb, ib = V.tobytes(), col4.tobytes(), F.astype(np.uint32).tobytes(); blob = pb + cb + ib
    j = {"asset": {"version": "2.0", "generator": "colorize.py"}, "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0}],
         "meshes": [{"primitives": [{"attributes": {"POSITION": 0, "COLOR_0": 1}, "indices": 2, "material": 0}]}], "materials": [{"pbrMetallicRoughness": {"baseColorFactor": [1, 1, 1, 1], "metallicFactor": .2, "roughnessFactor": .6}}],
         "buffers": [{"byteLength": len(blob)}], "bufferViews": [{"buffer": 0, "byteOffset": 0, "byteLength": len(pb)}, {"buffer": 0, "byteOffset": len(pb), "byteLength": len(cb)}, {"buffer": 0, "byteOffset": len(pb) + len(cb), "byteLength": len(ib)}],
         "accessors": [{"bufferView": 0, "componentType": 5126, "count": len(V), "type": "VEC3", "min": V.min(0).tolist(), "max": V.max(0).tolist()}, {"bufferView": 1, "componentType": 5121, "normalized": True, "count": len(V), "type": "VEC4"}, {"bufferView": 2, "componentType": 5125, "count": F.size, "type": "SCALAR"}]}
    js = json.dumps(j).encode(); js += b' ' * (-len(js) % 4)
    open(path, 'wb').write(struct.pack('<III', 0x46546C67, 2, 28 + len(js) + len(blob)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(blob), 0x004E4942) + blob)
for name in sys.argv[1:]:
    P, F = read_glb(f'glb/{name}.glb'); N = vnormals(P, F); C = rules(name, P, N)
    cav = cavity(P, F, N); cav = (cav - np.median(cav)) / (np.percentile(np.abs(cav), 95) + 1e-9)
    shade = np.clip(1 - .45 * np.clip(cav, 0, 1.5) + .08 * np.clip(-cav, 0, 1), .45, 1.1)
    shade *= 1 + .07 * noise(P / P[:, 1].max(), 45)
    write(f'glb/c_{name}.glb', P, F, C * shade[:, None]); print(name, 'ok')
