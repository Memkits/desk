# Quadric vertex-clustering decimation (Lindstrom 2000) for single-mesh GLBs. numpy only.
import json, struct, sys, numpy as np
def read_glb(p):
    b = open(p, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
    bin0 = 20 + n + 8; blob = b[bin0:]
    def acc(i, dt, k):
        a = j['accessors'][i]; v = j['bufferViews'][a['bufferView']]; o = v.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(blob, dt, a['count'] * k, o).reshape(-1, k) if k > 1 else np.frombuffer(blob, dt, a['count'], o)
    pr = j['meshes'][0]['primitives'][0]
    return acc(pr['attributes']['POSITION'], np.float32, 3).astype(np.float64), acc(pr['indices'], np.uint32, 1).reshape(-1, 3)
def cluster(P, F, N):
    lo, hi = P.min(0), P.max(0); s = (hi - lo).max() / N
    c = np.floor((P - lo) / s).astype(np.int64); c = np.minimum(c, N)
    key = (c[:, 0] * (N + 2) + c[:, 1]) * (N + 2) + c[:, 2]
    uk, cid = np.unique(key, return_inverse=True); M = len(uk)
    a, b, d = P[F[:, 0]], P[F[:, 1]], P[F[:, 2]]
    n = np.cross(b - a, d - a); ar = np.linalg.norm(n, axis=1); ok = ar > 0
    nn = np.zeros_like(n); nn[ok] = n[ok] / ar[ok, None]; dd = -(nn * a).sum(1)
    pl = np.concatenate([nn, dd[:, None]], 1) * np.sqrt(ar)[:, None]        # area-weighted plane
    Q = np.einsum('fi,fj->fij', pl, pl).reshape(-1, 16)
    acc = np.zeros((M, 16))
    for k in range(3): np.add.at(acc, cid[F[:, k]], Q)
    acc = acc.reshape(M, 4, 4)
    mean = np.zeros((M, 3)); cnt = np.bincount(cid, minlength=M); np.add.at(mean, cid, P); mean /= cnt[:, None]
    A = acc[:, :3, :3] + np.eye(3) * 1e-9 * (s * s); rhs = -acc[:, :3, 3]
    x = np.linalg.solve(A, rhs[..., None])[..., 0]
    cell_lo = lo + (np.stack([uk // ((N + 2) ** 2), (uk // (N + 2)) % (N + 2), uk % (N + 2)], 1)) * s
    bad = np.any(x < cell_lo - s * .5, 1) | np.any(x > cell_lo + s * 1.5, 1) | ~np.isfinite(x).all(1)
    x[bad] = mean[bad]
    G = cid[F]; keep = (G[:, 0] != G[:, 1]) & (G[:, 1] != G[:, 2]) & (G[:, 0] != G[:, 2]); G = G[keep]
    G = np.unique(np.sort(G, 1) * 0 + G, axis=0) if False else G
    s2 = np.sort(G, 1); _, ui = np.unique(s2, axis=0, return_index=True); G = G[np.sort(ui)]
    used = np.unique(G); remap = -np.ones(M, np.int64); remap[used] = np.arange(len(used))
    return x[used].astype(np.float32), remap[G].astype(np.uint32)
def write_glb(p, V, F):
    lo, hi = V.min(0), V.max(0)
    pb, ib = V.tobytes(), F.tobytes()
    blob = pb + ib; blob += b'\0' * (-len(blob) % 4)
    j = {"asset": {"version": "2.0", "generator": "decimate.py"}, "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0}],
         "meshes": [{"primitives": [{"attributes": {"POSITION": 0}, "indices": 1, "material": 0}]}], "materials": [{"pbrMetallicRoughness": {"baseColorFactor": [.85, .87, .9, 1], "metallicFactor": .3, "roughnessFactor": .6}}],
         "buffers": [{"byteLength": len(blob)}], "bufferViews": [{"buffer": 0, "byteOffset": 0, "byteLength": len(pb), "target": 34962}, {"buffer": 0, "byteOffset": len(pb), "byteLength": len(ib), "target": 34963}],
         "accessors": [{"bufferView": 0, "componentType": 5126, "count": len(V), "type": "VEC3", "min": lo.tolist(), "max": hi.tolist()}, {"bufferView": 1, "componentType": 5125, "count": F.size, "type": "SCALAR"}]}
    js = json.dumps(j).encode(); js += b' ' * (-len(js) % 4)
    out = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(blob)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(blob), 0x004E4942) + blob
    open(p, 'wb').write(out)
if __name__ == '__main__':
    src, dst, target = sys.argv[1], sys.argv[2], int(sys.argv[3])
    P, F = read_glb(src); print(src, len(P), 'verts', len(F), 'faces')
    lo_n, hi_n = 20, 600
    best = None
    for _ in range(9):
        N = (lo_n + hi_n) // 2; V, G = cluster(P, F, N)
        if best is None or abs(len(G) - target) < abs(len(best[1]) - target): best = (V, G, N)
        if len(G) > target: hi_n = N
        else: lo_n = N
    V, G, N = best; write_glb(dst, V, G); print(' ->', dst, 'grid', N, len(V), 'verts', len(G), 'faces')
