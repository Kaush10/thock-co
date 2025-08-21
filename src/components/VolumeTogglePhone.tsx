import React, { useEffect, useRef, useState } from 'react';

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

export const VolumeTogglePhone: React.FC<VolumeTogglePhoneProps> = ({ muted, onToggle, className = '' }) => {
  // Vibration animation state (real time, like matrix)
  const [animationTime, setAnimationTime] = useState(0);
  const animationRef = useRef<number>();

  // Theme colors
  const isDark = !document.documentElement.classList.contains('light');
  const onColor = isDark ? '#FF00AA' : '#b89c70';
  const offColor = isDark ? '#333' : '#ccc';

  useEffect(() => {
    let running = true;
    const animate = () => {
      setAnimationTime(performance.now() / 1000); // use seconds for smoother animation
      if (running) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Dot positions for 3x3 grid
  const dotPositions = [
    { left: 0, top: 0 }, { left: 12, top: 0 }, { left: 24, top: 0 },
    { left: 0, top: 12 }, { left: 12, top: 12 }, { left: 24, top: 12 },
    { left: 0, top: 24 }, { left: 12, top: 24 }, { left: 24, top: 24 },
  ];

  // When muted: static 3x3 grid, no vibration, no X shape
  // When unmuted: all dots vibrate
  const getDotStyle = (i: number) => {
  let { left, top } = dotPositions[i];
  // Diagonal wave: offset each dot by its index for a true wave
  const phaseOffset = i * 0.2; // 0, 0.5, 1.0, ...
  const amplitude = 2.0; // px
  const speed = 2.5; // radians/sec
  const vibrationY = !muted ? Math.sin(animationTime * speed + phaseOffset) * amplitude : 0;
    return {
      left,
      top: top + vibrationY,
      background: muted ? offColor : onColor,
      transition: muted ? 'all 0.4s cubic-bezier(.8, .5, .2, 1.4)' : 'none',
      position: 'absolute' as const,
      width: 5,
      height: 5,
      borderRadius: '50%',
      display: 'block',
    };
  };

  return (
    <button
      aria-label={muted ? 'Unmute' : 'Mute'}
      className={`volume-toggle-phone ${className}`}
      style={{
        width: 30, height: 30, position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-block',
      }}
      onClick={onToggle}
    >
      {[...Array(9)].map((_, i) => (
        <span key={i} style={getDotStyle(i)} />
      ))}
    </button>
  );
};

// Export device check for use in VolumeControl
export { isPhone };
