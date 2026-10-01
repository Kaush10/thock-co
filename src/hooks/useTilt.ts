import { useEffect, type RefObject } from 'react';
import VanillaTilt, { type HTMLVanillaTiltElement, type TiltOptions } from 'vanilla-tilt';

/** How far a card leans toward the pointer. */
export type TiltStrength = 'faint' | 'subtle' | 'soft' | 'normal' | 'strong';

const BASE: TiltOptions = {
  speed: 500,
  perspective: 1800,
  glare: true,
  'max-glare': 0.1,
  reset: true,
  reverse: true,
};

const PRESETS: Record<TiltStrength, TiltOptions> = {
  faint: { max: 1.75, scale: 1.0075 },
  subtle: { max: 3.25, scale: 1.00125, 'max-glare': 0.05 },
  soft: { max: 3.5, scale: 1.015 },
  normal: { max: 7, scale: 1.03 },
  strong: { max: 14, speed: 350, perspective: 1200, scale: 1.06 },
};

const canTilt = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Tilts the element in `ref` toward the pointer, or every element matching
 * `selector` inside it. Does nothing on touch screens or with reduced motion.
 */
export function useTilt(
  ref: RefObject<HTMLElement | null>,
  strength: TiltStrength | null = 'normal',
  selector?: string,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !strength || !canTilt()) return;

    const targets = selector
      ? Array.from(root.querySelectorAll<HTMLElement>(selector))
      : [root];
    for (const target of targets) {
      VanillaTilt.init(target, { ...BASE, ...PRESETS[strength] });
    }

    return () => {
      for (const target of targets) {
        (target as HTMLVanillaTiltElement).vanillaTilt?.destroy();
      }
    };
  }, [ref, strength, selector]);
}
