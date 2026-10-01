import { useSyncExternalStore } from 'react';

// Ambient music. Off on every visit until the visitor turns it on; only the
// volume they chose is remembered. The track isn't downloaded until it first plays.

const SRC = `${import.meta.env.BASE_URL}audio/Spaces.mp3`;
const VOLUME_KEY = 'thock-volume';
const DEFAULT_VOLUME = 51;
const MAX_GAIN = 0.75; // full slider = 75% of the track's level
const FADE_MS = 1500;

export type AmbientState = {
  on: boolean;
  /** 0–100, as shown on the slider. Kept while off so it can be restored. */
  volume: number;
};

const savedVolume = Number(localStorage.getItem(VOLUME_KEY));
let state: AmbientState = {
  on: false,
  volume: savedVolume > 0 && savedVolume <= 100 ? savedVolume : DEFAULT_VOLUME,
};

const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;
let fadeFrame = 0;

function emit(next: Partial<AmbientState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function fadeTo(target: number, then?: () => void) {
  if (!audio) return;
  cancelAnimationFrame(fadeFrame);
  const el = audio;
  const from = el.volume;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / FADE_MS);
    el.volume = from + (target - from) * (1 - Math.pow(1 - t, 3));
    if (t < 1) fadeFrame = requestAnimationFrame(step);
    else then?.();
  };
  fadeFrame = requestAnimationFrame(step);
}

const gain = (volume: number) => (volume / 100) * MAX_GAIN;

export function setAmbientOn(on: boolean) {
  if (on === state.on) return;
  emit({ on });
  if (on) {
    audio ??= Object.assign(new Audio(SRC), { loop: true, volume: 0 });
    audio.play().then(
      () => fadeTo(gain(state.volume)),
      // Autoplay rules or a missing file: show it as off rather than lie.
      () => emit({ on: false }),
    );
  } else {
    fadeTo(0, () => audio?.pause());
  }
}

export function toggleAmbient() {
  setAmbientOn(!state.on);
}

/** Sets the slider volume. Dragging to 0 turns the music off; above 0 turns it on. */
export function setAmbientVolume(volume: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(volume)));
  if (clamped === 0) {
    setAmbientOn(false);
    return;
  }
  emit({ volume: clamped });
  localStorage.setItem(VOLUME_KEY, String(clamped));
  if (!state.on) setAmbientOn(true);
  else if (audio) {
    cancelAnimationFrame(fadeFrame);
    audio.volume = gain(clamped);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAmbient() {
  return useSyncExternalStore(subscribe, () => state);
}
