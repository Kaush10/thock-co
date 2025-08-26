import React, { useEffect, useState } from 'react';
import './menu-drawer-card.css';

interface AmbienceStartCardProps {
  isMobile: boolean;
  onDismiss: () => void;
}

export const AmbienceStartCard: React.FC<AmbienceStartCardProps> = ({ isMobile, onDismiss }) => {
  const [animateOpen, setAnimateOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateOpen(true), 10);
  }, []);

  // Dismiss on first click/tap
  useEffect(() => {
    const handle = () => {
      setAnimateOpen(false);
      setTimeout(onDismiss, 220); // match drawer close animation
    };
    window.addEventListener(isMobile ? 'touchstart' : 'mousedown', handle, { once: true });
    return () => {
      window.removeEventListener(isMobile ? 'touchstart' : 'mousedown', handle);
    };
  }, [isMobile, onDismiss]);

  // z-index 9999 ensures card is above bg grid and matches drawer
  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: '75px',
        minWidth: '16rem',
        zIndex: 9999
      }}
    >
      <div
        className={`k-card-container glass-card menu-drawer-card rounded-b-xl p-4 mr-2 backdrop-blur-[16px] bg-white/10 menu-drawer-animate${animateOpen ? ' menu-drawer-animate-open' : ''}`}
        style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(2px)', textAlign: 'center' }}
      >
        <span className="block py-2 text-base">
          {isMobile ? 'tap anywhere to start ambience' : 'click anywhere to start ambience'}
        </span>
      </div>
    </div>
  );
}
