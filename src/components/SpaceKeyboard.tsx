import React from 'react';

// Isolated keyboard component from ScrollHero
export const ScrollHeroKeyboard: React.FC<{ onSpace?: () => void }> = ({ onSpace }) => {
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'rotate(8deg)'}}>
      <article className="keyboard-pen flex items-center justify-center" style={{minHeight: '7em', marginTop: '20em'}}>
        {/* SVG wire: straight then curved off screen */}
        <svg
          style={{
            position: 'absolute',
            top: '-14em',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20em',
            height: '40em',
            pointerEvents: 'none',
            zIndex: 2
          }}
          viewBox="0 -200 400 1060"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wire-gradient" x1="0" y1="0" x2="400" y2="560" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ccc" />
              <stop offset="30%" stopColor="#eee" />
              <stop offset="60%" stopColor="#ddd" />
              <stop offset="100%" stopColor="#ccc" />
            </linearGradient>
            <filter id="wire-shadow" x="-20" y="-20" width="440" height="600">
              <feDropShadow dx="-2" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
            </filter>
          </defs>
          {/* Straight wire: vertical line above keyboard */}
          <path
            d="M200 0 L200 400"
            stroke="url(#wire-gradient)"
            strokeWidth="10"
            fill="none"
            filter="url(#wire-shadow)"
            strokeLinecap="round"
          />
        </svg>
        <button
          style={{width: '18em', height: '4em', fontSize: '1.3em', textTransform: 'uppercase'}}
          onClick={onSpace}
          aria-label="Scroll down by space"
        >
          space
        </button>
      </article>
    </div>
  );
};
