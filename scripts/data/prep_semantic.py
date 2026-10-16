"""Build the on-device "search by meaning" index.

Uses the potion-base-8M static embedding model (MinishLab, MIT licence), taken from the
npm package counterparts-model-potion (model.safetensors + vocab.txt).

Each verse vector is the mean of its KJV, WEB and BSB embeddings, so that modern-language
questions find archaic wording. Vectors are centred, reduced with PCA and stored as int8.

Writes web/sem/tokens.bin  token table, int8 [vocab, 256] with a float32 scale per row
       web/sem/proj.bin    float32 centre [256] then projection [256, DIM]
       web/sem/verses.bin  int8 [verses, DIM], rows unit length * 127
       web/sem/vocab.txt   WordPiece vocabulary

Usage: python3 -I scripts/data/prep_semantic.py <dir with model.safetensors and vocab.txt>
"""
import json, os, struct, sys, unicodedata
import numpy as np

DIM = int(os.environ.get("SEM_DIM", "128"))
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'web')
OUT = os.environ.get('SEM_OUT') or os.path.join(ROOT, 'sem')


def load_safetensors(path):
    with open(path, 'rb') as f:
        n = struct.unpack('<Q', f.read(8))[0]
        head = json.loads(f.read(n))
        data = f.read()
    meta = head['embeddings']
    a, b = meta['data_offsets']
    return np.frombuffer(data[a:b], dtype=np.float32).reshape(meta['shape'])


def is_punct(ch):
    cp = ord(ch)
    if 33 <= cp <= 47 or 58 <= cp <= 64 or 91 <= cp <= 96 or 123 <= cp <= 126:
        return True
    return unicodedata.category(ch).startswith('P')


def basic_tokens(text):
    # BertNormalizer: lowercase and strip accents; BertPreTokenizer: split on spaces and punctuation
    text = unicodedata.normalize('NFD', text.lower())
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    out, cur = [], ''
    for ch in text:
        if ch.isspace():
            if cur: out.append(cur); cur = ''
        elif is_punct(ch):
            if cur: out.append(cur); cur = ''
            out.append(ch)
        else:
            cur += ch
    if cur: out.append(cur)
    return out


def wordpiece(word, vocab):
    if len(word) > 100:
        return []
    ids, start = [], 0
    while start < len(word):
        end, hit = len(word), None
        while start < end:
            sub = word[start:end] if start == 0 else '##' + word[start:end]
            if sub in vocab:
                hit = vocab[sub]; break
            end -= 1
        if hit is None:
            return []  # model2vec drops unknown words
        ids.append(hit); start = end
    return ids


def main(src):
    emb = load_safetensors(os.path.join(src, 'model.safetensors'))
    if os.path.exists(os.path.join(src, 'vocab.txt')):
        words = open(os.path.join(src, 'vocab.txt'), encoding='utf-8').read().split('\n')
        if words and words[-1] == '':
            words.pop()
    else:
        tv = json.load(open(os.path.join(src, 'tokenizer.json')))['model']['vocab']
        words = sorted(tv, key=tv.get)
    vocab = {w: i for i, w in enumerate(words)}
    assert len(vocab) == emb.shape[0], (len(vocab), emb.shape)

    def embed(text):
        ids = [i for w in basic_tokens(text) for i in wordpiece(w, vocab)]
        if not ids:
            return np.zeros(emb.shape[1], np.float32)
        v = emb[ids].mean(0)
        return v / (np.linalg.norm(v) + 1e-9)

    kjv = json.load(open(os.path.join(ROOT, 'bible.json')))['text']
    trs = [json.load(open(os.path.join(ROOT, 'tr', f'{t}.json')))['text'] for t in ('web', 'bsb')]
    vecs = []
    for b, chs in enumerate(kjv):
        for c, vs in enumerate(chs):
            for v, t in enumerate(vs):
                parts = [embed(t)]
                for tr in trs:
                    try:
                        s = tr[b][c][v]
                    except IndexError:
                        s = ''
                    if s:
                        parts.append(embed(s))
                m = np.mean(parts, 0)
                vecs.append(m / (np.linalg.norm(m) + 1e-9))
    V = np.array(vecs, np.float32)
    mu = V.mean(0)
    _, _, vt = np.linalg.svd(V - mu, full_matrices=False)
    W = vt[:DIM].T.astype(np.float32)  # [256, DIM]
    P = (V - mu) @ W
    P /= np.linalg.norm(P, axis=1, keepdims=True) + 1e-9
    out = OUT
    os.makedirs(out, exist_ok=True)
    np.round(P * 127).clip(-127, 127).astype(np.int8).tofile(os.path.join(out, 'verses.bin'))
    scale = np.abs(emb).max(1).astype(np.float32) / 127
    q = np.round(emb / scale[:, None]).clip(-127, 127).astype(np.int8)
    with open(os.path.join(out, 'tokens.bin'), 'wb') as f:
        f.write(scale.tobytes()); f.write(q.tobytes())
    with open(os.path.join(out, 'proj.bin'), 'wb') as f:
        f.write(mu.astype(np.float32).tobytes()); f.write(W.tobytes())
    with open(os.path.join(out, 'vocab.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(words))
    print(len(V), 'verses;', emb.shape, 'tokens; dim', DIM)


if __name__ == '__main__':
    main(sys.argv[1])
