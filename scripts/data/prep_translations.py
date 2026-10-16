"""Build web/tr/{id}.json: public-domain translations aligned to the KJV verse structure in web/bible.json.

Sources (all public domain):
  BSB, ASV: scrollmapper/bible_databases formats/json/{BSB,ASV}.json
  WEB:      npm package world-english-bible (json/{book}.json)
Usage: python3 scripts/data/prep_translations.py SRC_DIR
  SRC_DIR holds BSB.json, ASV.json and web/package/json/*.json
"""
import json, os, re, sys

src = sys.argv[1]
root = os.path.join(os.path.dirname(__file__), '..', '..')
kjv = json.load(open(os.path.join(root, 'web', 'bible.json')))
shape = [[len(c) for c in b] for b in kjv['text']]
out_dir = os.path.join(root, 'web', 'tr')
os.makedirs(out_dir, exist_ok=True)

def clean(t):
    t = re.sub(r'\s+', ' ', t or '').strip()
    return t

def align(get, tid, name, year):
    text, missing, total = [], 0, 0
    for b, chs in enumerate(shape):
        bk = []
        for c, n in enumerate(chs):
            vs = []
            for v in range(n):
                t = clean(get(b, c + 1, v + 1))
                total += 1
                if not t:
                    missing += 1
                vs.append(t)
            bk.append(vs)
        text.append(bk)
    json.dump({'id': tid, 'name': name, 'year': year, 'text': text},
              open(os.path.join(out_dir, tid + '.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f'{tid}: {total - missing}/{total} verses filled, {missing} empty')

def scrollmapper(file):
    d = json.load(open(os.path.join(src, file)))
    idx = {}
    for b, book in enumerate(d['books']):
        for ch in book['chapters']:
            for v in ch['verses']:
                idx[(b, ch['chapter'], v['verse'])] = v['text']
    return lambda b, c, v: idx.get((b, c, v), '')

WEB_FILES = ['genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','ruth','1samuel','2samuel','1kings','2kings',
  '1chronicles','2chronicles','ezra','nehemiah','esther','job','psalms','proverbs','ecclesiastes','songofsolomon','isaiah','jeremiah',
  'lamentations','ezekiel','daniel','hosea','joel','amos','obadiah','jonah','micah','nahum','habakkuk','zephaniah','haggai','zechariah',
  'malachi','matthew','mark','luke','john','acts','romans','1corinthians','2corinthians','galatians','ephesians','philippians',
  'colossians','1thessalonians','2thessalonians','1timothy','2timothy','titus','philemon','hebrews','james','1peter','2peter',
  '1john','2john','3john','jude','revelation']

def web():
    idx = {}
    for b, f in enumerate(WEB_FILES):
        for e in json.load(open(os.path.join(src, 'web', 'package', 'json', f + '.json'))):
            if 'verseNumber' in e and 'value' in e:
                k = (b, e['chapterNumber'], e['verseNumber'])
                idx[k] = idx.get(k, '') + ' ' + e['value']
    return lambda b, c, v: idx.get((b, c, v), '')

align(web(), 'web', 'World English Bible', 2000)
align(scrollmapper('BSB.json'), 'bsb', 'Berean Standard Bible', 2023)
align(scrollmapper('ASV.json'), 'asv', 'American Standard Version', 1901)
