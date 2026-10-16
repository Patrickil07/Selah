"""Render whole chapters of the KJV with the open Kokoro voice model, for streaming.

Each chapter becomes one MP3, with a small JSON of verse start times so the app can follow along.
Chapters are split into shards balanced by length, so many runners can share the work.

Output, in OUT:
  {b}_{c}.mp3          book and chapter, both counted from 0
  timings-{shard}.json {"b_c": [start of each verse in seconds, ..., end]}

Usage: python3 scripts/narration/chapters.py MODEL.onnx VOICES.bin VOICE --shard i/n [--books 0-65] [--out DIR]
"""
import argparse, json, os, re, subprocess, tempfile, time
import numpy as np
import soundfile as sf

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'web')
SPEED, GAP = 0.95, 0.45


def shards(text, books, n):
    """Greedy split of chapters into n shards of similar length, keeping canonical order inside each."""
    chs = [(b, c, sum(len(v) for v in text[b][c])) for b in books for c in range(len(text[b]))]
    loads, out = [0] * n, [[] for _ in range(n)]
    for b, c, size in sorted(chs, key=lambda x: -x[2]):
        i = loads.index(min(loads)); loads[i] += size; out[i].append((b, c))
    return [sorted(s) for s in out]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('model'); ap.add_argument('voices'); ap.add_argument('voice')
    ap.add_argument('--shard', default='0/1'); ap.add_argument('--books', default='0-65'); ap.add_argument('--out', default='out')
    a = ap.parse_args()
    from kokoro_onnx import Kokoro
    k = Kokoro(a.model, a.voices)
    lang = 'en-gb' if a.voice.startswith('b') else 'en-us'
    text = json.load(open(os.path.join(ROOT, 'bible.json')))['text']
    b0, b1 = map(int, a.books.split('-'))
    i, n = map(int, a.shard.split('/'))
    mine = shards(text, range(b0, b1 + 1), n)[i]
    os.makedirs(a.out, exist_ok=True)
    tpath = os.path.join(a.out, f'timings-{i}.json')
    timings = json.load(open(tpath)) if os.path.exists(tpath) else {}
    t0 = time.time()
    for b, c in mine:
        key, mp3 = f'{b}_{c}', os.path.join(a.out, f'{b}_{c}.mp3')
        if key in timings and os.path.exists(mp3):
            continue
        parts, starts, t, sr = [], [], 0.0, 24000
        for v in text[b][c]:
            v = re.sub(r'\s+([,;:.?!)])', r'\1', v)
            audio, sr = k.create(v, voice=a.voice, speed=SPEED, lang=lang)
            audio = np.concatenate([audio, np.zeros(int(GAP * sr), np.float32)])
            starts.append(round(t, 2)); parts.append(audio); t += len(audio) / sr
        starts.append(round(t, 2))
        with tempfile.NamedTemporaryFile(suffix='.wav') as wav:
            sf.write(wav.name, np.concatenate(parts), sr)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav.name, '-ac', '1', '-b:a', '40k', mp3], check=True)
        timings[key] = starts
        json.dump(timings, open(tpath, 'w'), separators=(',', ':'))
        print(f'{key} {round(t)}s audio, {round(time.time() - t0)}s elapsed', flush=True)


if __name__ == '__main__':
    main()
