import { useEffect, useState } from 'react';

/**
 * Reads an audio file and reduces it to `columns` peak values (0–1), for
 * drawing as a DotWave. Returns null until it's ready, or if it fails.
 */
export function useWaveform(src: string | undefined, columns: number) {
  const [peaks, setPeaks] = useState<number[] | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const context = new AudioContext();
    fetch(src)
      .then((response) => {
        // A board without a recording gets a 404 (or the dev server's HTML fallback); that's expected.
        const type = response.headers.get('content-type') ?? '';
        if (!response.ok || type.includes('text/html')) return null;
        return response.arrayBuffer();
      })
      .then((data) => (data ? context.decodeAudioData(data) : null))
      .then((buffer) => {
        if (!buffer) return;
        const samples = buffer.getChannelData(0);
        const size = Math.floor(samples.length / columns);
        const raw = Array.from({ length: columns }, (_, col) => {
          let peak = 0;
          for (let i = col * size; i < (col + 1) * size; i++) peak = Math.max(peak, Math.abs(samples[i]));
          return peak;
        });
        const loudest = Math.max(...raw, 1e-6);
        // Square root lifts quiet keystrokes so the meter isn't all spikes.
        if (!cancelled) setPeaks(raw.map((p) => Math.sqrt(p / loudest)));
      })
      .catch((error: unknown) => console.warn('waveform:', error))
      .finally(() => context.close());
    return () => {
      cancelled = true;
    };
  }, [src, columns]);

  return src ? peaks : null;
}
