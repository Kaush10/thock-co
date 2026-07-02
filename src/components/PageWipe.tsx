import { useEffect, useRef, useState } from 'react';

interface PageWipeProps {
  isDark: boolean;
}

export const PageWipe: React.FC<PageWipeProps> = ({ isDark }) => {
  const [wipeKey, setWipeKey] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const dir = (e as CustomEvent<{ direction: 'forward' | 'backward' }>).detail.direction;
      if (timerRef.current) clearTimeout(timerRef.current);
      setDirection(dir);
      setWipeKey(k => k + 1);
      document.documentElement.classList.add('page-wiping');
      // 900ms animation + 2 × 90ms stagger + buffer
      timerRef.current = setTimeout(() => {
        setWipeKey(0);
        document.documentElement.classList.remove('page-wiping');
      }, 1200);
    };
    window.addEventListener('page-wipe', handler);
    return () => {
      window.removeEventListener('page-wipe', handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (wipeKey === 0) return null;

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--interactive-highlight').trim() || (isDark ? '#FF00AA' : '#b89c70');
  const panels = isDark
    ? [accent, '#2a2a2a', '#000000']
    : [accent, '#c8c8c8', '#eef2f4'];

  const animName = direction === 'forward' ? 'page-wipe' : 'page-wipe-reverse';

  return (
    <div key={wipeKey} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}>
      {panels.map((color, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            background: color,
            animationName: animName,
            animationDuration: '900ms',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            animationDelay: `${i * 90}ms`,
            animationFillMode: 'both',
          }}
        />
      ))}
    </div>
  );
};
