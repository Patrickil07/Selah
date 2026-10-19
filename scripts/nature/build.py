"""Build the nature sound loops in web/nature/ from free recordings.

Usage: python3 scripts/nature/build.py <blanket-sounds-dir>
where <blanket-sounds-dir> is data/resources/sounds from a clone of
https://github.com/rafaelmardojai/blanket (credits in web/nature/CREDITS.md).

Each loop is levelled to the same loudness, then its tail is crossfaded into its
head so the file repeats with no seam. The waterfall is our own: a synthesized
roar laid over the stream recording. Needs numpy and ffmpeg.
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parents[2] / 'web' / 'nature'
# id: (source file, seconds kept, crossfade seconds)
SOURCES = {
    'waves': ('waves.ogg', 90, 6),
    'rain': ('rain.ogg', 90, 4),
    'birds': ('birds.ogg', 100, 4),
    'stream': ('stream.ogg', 90, 4),
    'wind': ('wind.ogg', 15, 3),
    'crickets': ('summer-night.ogg', 49, 4),
    'fire': ('fireplace.ogg', 25, 3),
}


def load(path, seconds):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-t', str(seconds), '-ac', '2', '-ar', str(SR),
                          '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def seamless(x, fade):
    """Fold the last `fade` seconds over the first ones with an equal-power curve."""
    n = int(fade * SR)
    t = np.linspace(0, np.pi / 2, n)[:, None]
    head, tail = x[:n], x[-n:]
    return np.concatenate([tail * np.cos(t) + head * np.sin(t), x[n:-n]])


def shaped_noise(n, rng, tilt, lo, hi):
    """Stereo noise with a 1/f^tilt slope, band-limited to lo..hi Hz (periodic, so it loops by itself)."""
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.zeros_like(f)
    band = (f > 0)
    g[band] = f[band] ** (-tilt / 2)
    g *= 1 / (1 + (lo / np.maximum(f, 1e-9)) ** 4) / (1 + (f / hi) ** 4)
    out = []
    for _ in range(2):
        spec = (rng.standard_normal(len(f)) + 1j * rng.standard_normal(len(f))) * g
        out.append(np.fft.irfft(spec, n))
    y = np.stack(out, 1)
    return y / np.sqrt(np.mean(y ** 2))


def waterfall(stream, seconds=60):
    rng = np.random.default_rng(7)
    n = seconds * SR
    roar = shaped_noise(n, rng, 1.0, 60, 6000) + 0.35 * shaped_noise(n, rng, 0.2, 1500, 12000)
    # slow surges in the falling water, periodic over the loop
    t = np.arange(n) / SR
    surge = 1 + 0.12 * np.sin(2 * np.pi * 3 * t / seconds) + 0.07 * np.sin(2 * np.pi * 7 * t / seconds + 1.3) \
        + 0.05 * np.sin(2 * np.pi * 17 * t / seconds + 0.4)
    roar *= surge[:, None]
    roar /= np.sqrt(np.mean(roar ** 2))
    water = stream[:n] / np.sqrt(np.mean(stream[:n] ** 2))
    return roar + 0.6 * water


def loudness(x):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                         input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stderr.decode()
    return float(log.rsplit('I:', 1)[1].split('LUFS')[0])


def encode(x, name, target=-27.0):
    """Same integrated loudness for every loop (a plain gain, so nothing pumps), peaks kept below -3 dBFS."""
    x = x * 10 ** ((target - loudness(x)) / 20)
    x = x * min(1.0, 0.7 / np.abs(x).max())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-',
                    '-c:a', 'libmp3lame', '-b:a', '96k',
                    str(OUT / f'{name}.mp3')], input=x.astype(np.float32).tobytes(), check=True)


def main(src):
    OUT.mkdir(parents=True, exist_ok=True)
    loops = {}
    for name, (file, secs, fade) in SOURCES.items():
        x = load(Path(src) / file, secs)
        loops[name] = x
        encode(seamless(x, fade), name)
    encode(seamless(waterfall(loops['stream']), 4), 'waterfall')
    lengths = {p.stem: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)],
                                            capture_output=True, text=True).stdout) for p in sorted(OUT.glob('*.mp3'))}
    print(json.dumps(lengths, indent=1))


if __name__ == '__main__':
    main(sys.argv[1])
