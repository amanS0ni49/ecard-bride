"""
Original royalty-free instrumental for the bride's card.

A soothing North-Indian wedding cue: a tanpura-like drone under a santoor
pluck, a soft harmonium pad and a slow bansuri-style lead, in a Khamaj-ish
mode (natural scale with a flat seventh) at a walking 70 BPM.

The melody, harmony and arrangement here are written for this project. It is
NOT a transcription of any existing song — popular film and folk recordings
are copyrighted in both the recording and the underlying tune, so none of one
could be reproduced here. Pure-Python synthesis, so the result carries no
third-party rights.

    python3 scripts/generate-music.py

writes public/audio/wedding-theme.wav.
"""
import math
import random
import struct
import wave

SR = 22050
BPM = 70.0
BEAT = 60.0 / BPM
BARS = 8
LOOP = BARS * 4 * BEAT          # 8 bars of 4/4 ≈ 27.4s
TAIL = 2.6                      # rendered past the loop, folded back over the head
TOTAL = LOOP + TAIL
N = int(TOTAL * SR)

random.seed(20261120)           # the wedding date — keeps renders reproducible
buf = [0.0] * N

# --- the mode -------------------------------------------------------------
# D Khamaj: D E F# G A B C. Soothing, and the flat 7th is what gives it the
# folk colour rather than a western major.
D3 = 146.83
SCALE = {                       # scale degree -> ratio above the tonic
    1: 1.0,
    2: 9 / 8,
    3: 5 / 4,
    4: 4 / 3,
    5: 3 / 2,
    6: 5 / 3,
    7: 16 / 9,                  # flat seventh
}


def note(degree, octave=0):
    """Frequency of a scale degree, `octave` octaves above D3."""
    deg = degree
    oct_shift = octave
    while deg > 7:
        deg -= 7
        oct_shift += 1
    while deg < 1:
        deg += 7
        oct_shift -= 1
    return D3 * SCALE[deg] * (2.0 ** oct_shift)


def add(samples, start, gain=1.0):
    i = int(start * SR)
    for s in samples:
        if 0 <= i < N:
            buf[i] += s * gain
        i += 1


def envelope(out, attack, release):
    """In-place attack/release so nothing ever clicks."""
    n = len(out)
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    for k in range(min(a, n)):
        out[k] *= k / a
    for k in range(min(r, n)):
        out[n - 1 - k] *= k / r
    return out


def pluck(freq, dur, gain=1.0, damp=0.496):
    """Karplus-Strong — santoor / sitar-ish struck string."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf_ks = [random.uniform(-1, 1) for _ in range(p)]
    # soften the noise burst so the attack is a hammer, not a snap
    for _ in range(3):
        buf_ks = [(buf_ks[i] + buf_ks[(i + 1) % p]) * 0.5 for i in range(p)]
    out = [0.0] * n
    idx = 0
    for k in range(n):
        v = buf_ks[idx]
        out[k] = v
        buf_ks[idx] = (v + buf_ks[(idx + 1) % p]) * damp
        idx = (idx + 1) % p
    return [s * gain for s in envelope(out, 0.002, min(0.25, dur * 0.3))]


def reed(freq, dur, gain=1.0):
    """Harmonium pad: a few odd partials, slow swell, gentle vibrato."""
    n = int(dur * SR)
    out = [0.0] * n
    partials = ((1.0, 1.0), (2.0, 0.28), (3.0, 0.20), (4.0, 0.08), (5.0, 0.06))
    for mult, amp in partials:
        w = 2 * math.pi * freq * mult / SR
        for k in range(n):
            vib = 1.0 + 0.0016 * math.sin(2 * math.pi * 4.6 * k / SR)
            out[k] += amp * math.sin(w * k * vib)
    return [s * gain for s in envelope(out, dur * 0.35, dur * 0.45)]


def flute(freq, dur, gain=1.0):
    """Bansuri-ish: near-sine with breath noise and a slow, late vibrato."""
    n = int(dur * SR)
    out = [0.0] * n
    w = 2 * math.pi * freq / SR
    breath = 0.0
    for k in range(n):
        t = k / SR
        # vibrato fades in, the way a player leans into a held note
        depth = 0.004 * min(1.0, t / 0.9)
        vib = 1.0 + depth * math.sin(2 * math.pi * 5.2 * t)
        s = math.sin(w * k * vib) + 0.12 * math.sin(2 * w * k * vib)
        breath = breath * 0.995 + random.uniform(-1, 1) * 0.005
        out[k] = s + breath * 0.5
    return [s * gain for s in envelope(out, 0.14, dur * 0.4)]


def drone(freq, dur, gain=1.0):
    """Tanpura-like bed: two slightly detuned voices, very slow beating."""
    n = int(dur * SR)
    out = [0.0] * n
    for detune, amp in ((0.999, 1.0), (1.001, 0.9), (2.0, 0.18), (3.0, 0.07)):
        w = 2 * math.pi * freq * detune / SR
        for k in range(n):
            out[k] += amp * math.sin(w * k)
    return [s * gain for s in envelope(out, 1.6, 1.6)]


# --- the arrangement ------------------------------------------------------
# Two bars per chord: I - IV - vi - V, stated once over eight bars.
BAR = 4 * BEAT
CHORDS = [
    (1, (1, 3, 5)),             # D
    (4, (4, 6, 8)),             # G
    (6, (6, 8, 10)),            # Bm
    (5, (5, 7, 9)),             # A
]

# the drone runs the whole loop and a little past it
add(drone(note(1, -1), TOTAL, 1.0), 0.0, 0.075)
add(drone(note(5, -1), TOTAL, 1.0), 0.0, 0.045)

for c, (root, tones) in enumerate(CHORDS):
    start = c * 2 * BAR

    # harmonium pad holds under each chord
    for deg in tones:
        add(reed(note(deg), 2 * BAR * 0.96), start, 0.030)

    # santoor figure: a slow rolled arpeggio, then an answer on the offbeat
    pattern = [
        (0.0, tones[0], 1.00),
        (1.0, tones[1], 0.80),
        (2.0, tones[2], 0.85),
        (2.5, tones[1], 0.55),
        (3.0, tones[0] + 7, 0.70),
        (4.0, tones[1], 0.72),
        (5.0, tones[2], 0.62),
        (6.0, tones[0] + 7, 0.80),
        (7.0, tones[1], 0.45),
    ]
    for beat, deg, amp in pattern:
        add(pluck(note(deg), 1.9), start + beat * BEAT, 0.085 * amp)

# Bansuri line — an original phrase, entering once the bed is established.
# `at` and `dur` are in SECONDS, not beats.
PHRASE = [
    (8.0, 5, 1.8), (10.0, 6, 1.0), (11.2, 5, 1.6),
    (13.2, 4, 1.4), (15.0, 3, 2.2),
    (18.0, 5, 1.2), (19.4, 6, 1.0), (20.6, 8, 2.4),
    (24.0, 7, 1.2), (25.4, 5, 2.6),
]
for at, deg, dur in PHRASE:
    add(flute(note(deg), dur), at, 0.052)

# --- fold the tail back so the loop is seamless ---------------------------
loop_n = int(LOOP * SR)
for k in range(loop_n, N):
    buf[k - loop_n] += buf[k]
buf = buf[:loop_n]

# --- normalise and write --------------------------------------------------
peak = max(abs(s) for s in buf) or 1.0
target = 0.80
frames = bytearray()
for s in buf:
    v = s / peak * target
    # gentle soft-clip, so nothing ever sounds brittle
    v = math.tanh(v * 1.12) * 0.92
    frames += struct.pack("<h", int(max(-1.0, min(1.0, v)) * 32767))

out_path = "public/audio/wedding-theme.wav"
with wave.open(out_path, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(bytes(frames))

print(f"wrote {out_path}  {loop_n / SR:.1f}s  {len(frames) / 1024:.0f} KB")
