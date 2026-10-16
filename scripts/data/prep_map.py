"""Build web/map.json: Natural Earth 1:50m land (public domain, via the world-atlas npm package),
clipped to the lands of the Bible and simplified. Rings are flat [lon*20, lat*20, ...] integer arrays.
Usage: python3 scripts/data/prep_map.py LAND_GEOJSON
"""
import json, os, sys
BOX = (8.0, 22.0, 56.0, 44.0)  # west, south, east, north: Rome to Persia, Egypt to Asia Minor
root = os.path.join(os.path.dirname(__file__), '..', '..')
g = json.load(open(sys.argv[1]))['geometry']
polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]

def clip(ring):
    W, S, E, N = BOX
    edges = [(lambda p: p[0] >= W, lambda a, b: (W, a[1] + (b[1] - a[1]) * (W - a[0]) / (b[0] - a[0]))),
             (lambda p: p[0] <= E, lambda a, b: (E, a[1] + (b[1] - a[1]) * (E - a[0]) / (b[0] - a[0]))),
             (lambda p: p[1] >= S, lambda a, b: (a[0] + (b[0] - a[0]) * (S - a[1]) / (b[1] - a[1]), S)),
             (lambda p: p[1] <= N, lambda a, b: (a[0] + (b[0] - a[0]) * (N - a[1]) / (b[1] - a[1]), N))]
    pts = ring
    for inside, cut in edges:
        if not pts:
            break
        out, prev = [], pts[-1]
        for cur in pts:
            if inside(cur):
                if not inside(prev):
                    out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cut(prev, cur))
            prev = cur
        pts = out
    return pts

rings = []
for poly in polys:
    for ring in poly[:1]:  # outer rings only
        c = clip([tuple(p) for p in ring])
        q = []
        for x, y in c:
            p = (round(x * 20), round(y * 20))
            if not q or p != q[-1]:
                q.append(p)
        if len(q) >= 4:
            rings.append([v for p in q for v in p])
json.dump({'source': 'Natural Earth (public domain)', 'box': BOX, 'scale': 20, 'rings': rings},
          open(os.path.join(root, 'web', 'map.json'), 'w'), separators=(',', ':'))
print(len(rings), 'rings,', sum(len(r) // 2 for r in rings), 'points')
