import React from 'react';
import './hamburger-toggle.css';

interface HamburgerToggleProps {
  open: boolean;
  onClick: () => void;
  color?: string;
}

export const HamburgerToggle: React.FC<HamburgerToggleProps> = ({ open, onClick, color }) => (
  <button
    className={`wrapper-menu${open ? ' open' : ''}`}
    aria-label={open ? 'Close menu' : 'Open menu'}
    type="button"
    onClick={onClick}
    style={color ? { '--hamburger-color': color } as React.CSSProperties : {}}
  >
    <div className="line-menu half start"></div>
    <div className="line-menu"></div>
    <div className="line-menu half end"></div>
  </button>
);
