"""Render spoken Hebrew and Greek dictionary words with the open Kokoro voice model.

Pronunciation comes from espeak-ng (modern Israeli Hebrew, and its reconstructed ancient Greek),
fed to Kokoro as phonemes so the voice matches the English narration.

Output, in OUT (default web/words):
  p{pack}.mp3   words for one block of 250 Strong's numbers, one after another with short gaps
  index.json    {"pack": [...], "voice": "...", "w": {strong: [pack, start, duration]}}
Existing index entries are kept, so the work can be split across runs (see --shard).

Usage: python3 scripts/narration/words.py MODEL.onnx VOICES.bin [--only list.txt] [--shard i/n] [--out DIR]
"""
import argparse, json, os, re, subprocess, sys, tempfile
import numpy as np
import soundfile as sf

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'web')
VOICE, SPEED, GAP, PACK = 'af_heart', 0.85, 0.35, 250
ORDER = {'ּ': 0, 'ׁ': 1, 'ׂ': 1}


def prep_hebrew(w):
    """Clean pointed Hebrew into the form espeak-ng reads reliably."""
    w = w.split(',')[0].strip()
    w = re.sub('[֑-ֽֿ֯׀׃-ׇ־͏]', '', w)
    out, marks = [], []
    def flush():
        out.extend(sorted(marks, key=lambda m: ORDER.get(m, 5))); marks.clear()
    for c in w:  # espeak wants dagesh, then the shin or sin dot, then the vowel
        if 'ְ' <= c <= 'ׇ': marks.append(c)
        else: flush(); out.append(c)
    flush(); w = ''.join(out)
    # dagesh only changes the sound of bet, kaf, pe (and marks shuruk)
    w = re.sub('([א-ת])ּ', lambda m: m.group(0) if m.group(1) in 'בגדכפתוש' else m.group(1), w)
    w = re.sub('ֵי(?![ְ-ּ])', 'ֵ', w)  # tsere with a silent yod
    # defective holam and qubuts become their full spellings, which read the same
    w = re.sub('([א-ת][ּׁׂ]*)ֹ', lambda m: m.group(0) if m.group(1)[0] == 'ו' else m.group(1) + 'וֹ', w)
    w = re.sub('([א-ת][ּׁׂ]*)ֻ', lambda m: m.group(1) + 'וּ', w)
    return w


def phonemes(tk, strong, lemma):
    if strong[0] == 'H':
        p = tk.phonemize(prep_hebrew(lemma), 'he')
    else:
        p = tk.phonemize(lemma.split(',')[0].strip(), 'grc')
    p = p.strip()
    return None if not p or '(' in p else p  # "(en)" means espeak gave up and spelled it out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('model'); ap.add_argument('voices')
    ap.add_argument('--only'); ap.add_argument('--shard', default='0/1'); ap.add_argument('--out', default=os.path.join(ROOT, 'words'))
    a = ap.parse_args()
    from kokoro_onnx import Kokoro
    k = Kokoro(a.model, a.voices)
    lex = json.load(open(os.path.join(ROOT, 'lexicon.json')))
    keys = sorted(lex)
    if a.only:
        want = set(open(a.only).read().split()); keys = [s for s in keys if s in want]
    num = lambda s: int(re.sub(r'\D', '', s) or 0)
    packof = lambda s: f'{s[0]}{num(s) // PACK:02d}'
    packs = sorted({packof(s) for s in keys})
    i, n = map(int, a.shard.split('/'))
    packs = packs[i::n]
    os.makedirs(a.out, exist_ok=True)
    ipath = os.path.join(a.out, 'index.json')
    index = json.load(open(ipath)) if os.path.exists(ipath) else {'voice': VOICE, 'w': {}}
    for pack in packs:
        clips, t, sr = [], 0.0, 24000
        for s in [s for s in keys if packof(s) == pack]:
            p = phonemes(k.tokenizer, s, lex[s][0])
            if not p: continue
            audio, sr = k.create(p, voice=VOICE, speed=SPEED, is_phonemes=True)
            audio = np.concatenate([audio, np.zeros(int(GAP * sr), np.float32)])
            index['w'][s] = [pack, round(t, 3), round(len(audio) / sr - GAP, 3)]
            clips.append(audio); t += len(audio) / sr
        if not clips: continue
        with tempfile.NamedTemporaryFile(suffix='.wav') as wav:
            sf.write(wav.name, np.concatenate(clips), sr)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav.name, '-ac', '1', '-b:a', '32k', os.path.join(a.out, f'p{pack}.mp3')], check=True)
        json.dump(index, open(ipath, 'w'), ensure_ascii=False, separators=(',', ':'))
        print(pack, len(clips), 'words', round(t), 's', flush=True)


if __name__ == '__main__':
    main()
