"""Build web/timeline.json from the Theographic Bible Metadata (CC BY-SA 4.0,
github.com/robertrouse/theographic-bible-metadata): events, people lanes and places.

Usage: python3 scripts/data/prep_timeline.py SRC_DIR   (SRC_DIR holds events/people/places/verses.json)

Output, compact arrays keyed by position:
  events: [title, year, firstVerse, verseCount, [personIdx], [placeIdx], durationText]
  people: [name, from, to, verseCount, firstVerse, spanKind]   spanKind: 'life' (birth to death) or 'active' (dated events)
  places: [name, lat, lon, verseCount, type, firstVerse]
Verse indices count from Genesis 1:1 = 0 in KJV order, as in web/bible.json.
"""
import json, os, sys

src = sys.argv[1]
root = os.path.join(os.path.dirname(__file__), '..', '..')
L = lambda f: json.load(open(os.path.join(src, f + '.json')))
events, people, places, verses = L('events'), L('people'), L('places'), L('verses')

kjv = json.load(open(os.path.join(root, 'web', 'bible.json')))['text']
start, k = {}, 0
for b, chs in enumerate(kjv):
    for c, vs in enumerate(chs):
        for v in range(len(vs)):
            start[(b + 1, c + 1, v + 1)] = k
            k += 1

vidx = {}
for v in verses:
    vid = v['fields'].get('verseID')
    if vid:
        key = (int(vid[:2]), int(vid[2:5]), int(vid[5:]))
        if key in start:
            vidx[v['id']] = start[key]

def year(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None

def vlist(ids):
    return sorted(vidx[i] for i in (ids or []) if i in vidx)

# People: lifespan from birth and death, otherwise the span of dated events they take part in
pid = {p['id']: p for p in people}
ev_years = {}
for e in events:
    y = e['fields'].get('sortKey')
    for pp in e['fields'].get('participants', []):
        ev_years.setdefault(pp, []).append(y)
SKIP = {'God', 'Holy Spirit'}
cands = []
for p in people:
    f = p['fields']
    if f.get('name') in SKIP or not f.get('isProperName', True):
        continue
    by, dy = year(f.get('birthYear')), year(f.get('deathYear'))
    ys = ev_years.get(p['id'], [])
    if by is not None and dy is not None and dy > by:
        span = (by, dy, 'life')
    elif len(ys) >= 2 and max(ys) - min(ys) >= 1:
        span = (min(ys), max(ys), 'active')
    else:
        continue
    vs = vlist(f.get('verses'))
    cands.append((f.get('verseCount') or 0, p['id'], f.get('displayTitle') or f['name'], span, vs[0] if vs else -1))
cands.sort(key=lambda r: -r[0])
lane_people = cands[:90]
p_index = {r[1]: i for i, r in enumerate(lane_people)}
out_people = [[r[2], round(r[3][0]), round(r[3][1]), r[0], r[4], r[3][2]] for r in lane_people]

# Places with coordinates that an event uses or that the text names at least twice
ev_places = {pl for e in events for pl in e['fields'].get('locations', [])}
plist = []
for pl in places:
    f = pl['fields']
    lat, lon = year(f.get('latitude')), year(f.get('longitude'))
    if lat is None or lon is None:
        continue
    if pl['id'] not in ev_places and (f.get('verseCount') or 0) < 2:
        continue
    vs = vlist(f.get('verses'))
    plist.append((pl['id'], f.get('displayTitle') or f.get('kjvName'), round(lat, 3), round(lon, 3), f.get('verseCount') or 0, f.get('featureType') or 'Place', vs[0] if vs else -1))
pl_index = {r[0]: i for i, r in enumerate(plist)}
out_places = [list(r[1:]) for r in plist]

def dur(d):
    if not d:
        return ''
    n, u = d[:-1], d[-1]
    names = {'D': 'day', 'Y': 'year', 'M': 'month', 'W': 'week', 'H': 'hour'}
    try:
        n = int(float(n))
    except ValueError:
        return ''
    return f"{n} {names.get(u, u)}{'' if n == 1 else 's'}" if u in names else ''

out_events = []
for e in sorted(events, key=lambda e: e['fields'].get('sortKey', 0)):
    f = e['fields']
    vs = vlist(f.get('verses'))
    out_events.append([f['title'], round(f.get('sortKey', 0), 2), vs[0] if vs else -1, len(vs),
                       [p_index[x] for x in f.get('participants', []) if x in p_index],
                       [pl_index[x] for x in f.get('locations', []) if x in pl_index], dur(f.get('duration'))])

json.dump({'source': 'Theographic Bible Metadata, CC BY-SA 4.0', 'events': out_events, 'people': out_people, 'places': out_places},
          open(os.path.join(root, 'web', 'timeline.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out_events), 'events,', len(out_people), 'people,', len(out_places), 'places')
