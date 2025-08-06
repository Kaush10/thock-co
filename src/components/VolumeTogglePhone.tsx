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
  // Vibration animation state
  const [animationTime, setAnimationTime] = useState(Date.now());
  const animationRef = useRef<number>();

  // Theme colors
  const isDark = !document.documentElement.classList.contains('light');
  const onColor = isDark ? '#FF00AA' : '#b89c70';
  const offColor = isDark ? '#333' : '#ccc';

  // Vibration logic
  useEffect(() => {
    const animate = () => {
      setAnimationTime(Date.now());
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Dot positions for 3x3 grid
  const dotPositions = [
    { left: 0, top: 0 }, { left: 12, top: 0 }, { left: 24, top: 0 },
    { left: 0, top: 12 }, { left: 12, top: 12 }, { left: 24, top: 12 },
    { left: 0, top: 24 }, { left: 12, top: 24 }, { left: 24, top: 24 },
  ];

  // For the "X" shape, move 4 dots to the center
  const getDotStyle = (i: number) => {
    let { left, top } = dotPositions[i];
    // Animate to X shape if muted
    if (muted) {
      // Dots 1,3,7,9 move to center (12,12)
      if ([0,2,6,8].includes(i)) {
        left = 12;
        top = 12;
      }
    }
    // Vibration
    const vibration = Math.sin(animationTime / 120 + i) * 1.2;
    return {
      left: left + vibration,
      top: top + vibration,
      background: muted ? offColor : onColor,
      transition: 'all 0.4s cubic-bezier(.8, .5, .2, 1.4)',
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
