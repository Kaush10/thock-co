import { useEffect, useRef, useState } from 'react';
import { duckAmbient } from '../lib/ambient';
import { DotWave } from './DotMatrix';
import { Keycap, Kbd } from './Keycap';
import { Panel } from './Panel';
import { useWaveform } from './useWaveform';

const COLUMNS = 60;
const LED_STEP_MS = 70;

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

// A flat, quiet line for boards that haven't been recorded yet.
const SILENCE = Array.from({ length: COLUMNS }, (_, i) => (i % 9 === 0 ? 0.18 : 0.08));

/**
 * A board's typing test: the recording drawn as an LED meter that lights up as
 * it plays. Space plays and pauses it anywhere on the page.
 */
export function SoundTest({ src, note, title = 'sound test' }: { src?: string; note?: string; title?: string }) {
  const peaks = useWaveform(src, COLUMNS);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = 'metadata';
    audioRef.current = audio;
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setPlaying(false);
      setProgress(1);
      duckAmbient(false);
    };
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.pause();
      duckAmbient(false);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audioRef.current = null;
    };
  }, [src]);

  // LEDs step rather than glide: sample the playhead on a fixed beat.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const audio = audioRef.current;
      if (audio?.duration) setProgress(audio.currentTime / audio.duration);
    }, LED_STEP_MS);
    return () => clearInterval(id);
  }, [playing]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      duckAmbient(false);
      return;
    }
    if (audio.ended || progress >= 1) audio.currentTime = 0;
    audio.play().then(
      () => {
        setPlaying(true);
        duckAmbient(true);
      },
      (error: unknown) => console.warn('sound test:', error),
    );
  };

  // Space anywhere on the page, unless the visitor is typing or on another control.
  const toggleRef = useRef(toggle);
  toggleRef.current = toggle;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, button, a, [contenteditable="true"], [role="slider"]')) return;
      event.preventDefault();
      toggleRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const recorded = Boolean(src);
  return (
    <Panel as="section" className="shadow-[0_0_0_1px_var(--line),0_30px_80px_rgba(255,0,170,0.07)]">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-[0.9375rem] font-normal normal-case tracking-normal text-bone">{title}</h2>
        {recorded && (
          <span className="font-mono text-label text-ash">
            <span className={playing ? 'text-signal' : ''}>{clock(progress * duration)}</span> / {clock(duration)}
          </span>
        )}
      </div>
      <DotWave
        peaks={peaks ?? SILENCE}
        progress={recorded ? progress : 0}
        rows={15}
        label={recorded ? `${title} waveform` : undefined}
        className="my-4"
      />
      <div className="flex items-center gap-5">
        <Keycap
          variant={recorded ? 'signal' : 'dark'}
          align="label"
          down={playing}
          onClick={toggle}
          disabled={!recorded}
          aria-label={playing ? 'pause the sound test' : 'play the sound test'}
          legend={playing ? '❚❚  space' : '▶  space'}
          className="min-w-40"
        />
        <p className="font-mono text-label text-ash">
          {recorded ? (note ?? <>press <Kbd>space</Kbd> to play or pause.</>) : 'no recording yet.'}
        </p>
      </div>
    </Panel>
  );
}
