import React, { useEffect, useRef } from 'react';

// Utility to detect phone
function isPhone() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile =
    /iphone|ipod|android.*mobile|windows phone|blackberry|bb10|mini|mobile|mobi|phone/i.test(ua) ||
    (window.innerWidth < 600 && 'ontouchstart' in window);
  return isMobile;
}

interface VolumeTogglePhoneProps {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}

const DOT_POSITIONS = [
  { left: 0, top: 0 }, { left: 12, top: 0 }, { left: 24, top: 0 },
  { left: 0, top: 12 }, { left: 12, top: 12 }, { left: 24, top: 12 },
  { left: 0, top: 24 }, { left: 12, top: 24 }, { left: 24, top: 24 },
];

export const VolumeTogglePhone: React.FC<VolumeTogglePhoneProps> = ({ muted, onToggle, className = '' }) => {
  const animationRef = useRef<number>();
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const isDark = !document.documentElement.classList.contains('light');
  const onColor = isDark ? '#FF00AA' : '#b89c70';
  const offColor = isDark ? '#333' : '#ccc';

  useEffect(() => {
    let running = true;
    const animate = (t: number) => {
      const time = t / 1000;
      spanRefs.current.forEach((span, i) => {
        if (!span) return;
        const { top } = DOT_POSITIONS[i];
        const phaseOffset = i * 0.2;
        const vibrationY = !mutedRef.current ? Math.sin(time * 2.5 + phaseOffset) * 2.0 : 0;
        span.style.top = (top + vibrationY) + 'px';
      });
      if (running) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Update dot colors when muted state changes (not in RAF — only on toggle)
  useEffect(() => {
    spanRefs.current.forEach(span => {
      if (!span) return;
      span.style.background = muted ? offColor : onColor;
      span.style.transition = muted ? 'all 0.4s cubic-bezier(.8,.5,.2,1.4)' : 'none';
    });
  }, [muted, onColor, offColor]);

  return (
    <button
      aria-label={muted ? 'Unmute' : 'Mute'}
      className={`volume-toggle-phone ${className}`}
      style={{ width: 30, height: 30, position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-block' }}
      onClick={onToggle}
    >
      {DOT_POSITIONS.map(({ left }, i) => (
        <span
          key={i}
          ref={el => { spanRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            left,
            top: DOT_POSITIONS[i].top,
            width: 5,
            height: 5,
            borderRadius: '50%',
            display: 'block',
            background: muted ? offColor : onColor,
          }}
        />
      ))}
    </button>
  );
};

export { isPhone };
