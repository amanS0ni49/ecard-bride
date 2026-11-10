/**
 * One shared <audio> element for the whole page, so the latch tap on the
 * doors and the floating toggle button drive the same track.
 *
 * Currently playing "Kudmayi" (Sachet Tandon), supplied by the family for
 * their own invitation. Full track rather than a clip, so the loop point is
 * far enough out that most guests will never reach it.
 *
 * The earlier clip is still at /audio/gulaab.mp3, and the original
 * royalty-free instrumental written for this card at /audio/wedding-theme.wav
 * (see scripts/generate-music.py). Swapping tracks is this one line.
 */
const SRC = "/audio/kudmayi.mp3";
const VOLUME = 0.32;
const FADE_MS = 900;

let el: HTMLAudioElement | null = null;
let fade: ReturnType<typeof setInterval> | null = null;
let playing = false;

const listeners = new Set<(p: boolean) => void>();
const emit = () => listeners.forEach((l) => l(playing));

export function subscribe(listener: (p: boolean) => void) {
  listeners.add(listener);
  listener(playing);
  return () => void listeners.delete(listener);
}

function element() {
  if (!el) {
    el = new Audio(SRC);
    el.loop = true;
    el.preload = "none";
    el.volume = 0;
  }
  return el;
}

/** Ramps volume so the music never slams in or cuts out. */
function rampTo(target: number, onDone?: () => void) {
  if (fade) clearInterval(fade);
  const a = element();
  const step = 40;
  const delta = ((target - a.volume) * step) / FADE_MS;
  fade = setInterval(() => {
    const next = a.volume + delta;
    const done = delta >= 0 ? next >= target : next <= target;
    a.volume = Math.max(0, Math.min(1, done ? target : next));
    if (done) {
      if (fade) clearInterval(fade);
      fade = null;
      onDone?.();
    }
  }, step);
}

/**
 * Must be called from a user gesture (the envelope tap, or the toggle) —
 * browsers block audio that starts on its own.
 */
export async function play() {
  const a = element();
  a.preload = "auto";
  try {
    await a.play();
    playing = true;
    rampTo(VOLUME);
  } catch {
    // autoplay refused, or the file is missing — leave the toggle showing "off"
    playing = false;
  }
  emit();
}

export function pause() {
  const a = element();
  playing = false;
  emit();
  rampTo(0, () => a.pause());
}

export function toggle() {
  return playing ? pause() : play();
}
