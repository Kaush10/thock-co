
import { Sun, Moon } from 'lucide-react';
import './menu-drawer-card.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { VolumeControl } from './VolumeControl';
import { GlassCard } from './GlassCard';
import { HamburgerToggle } from './HamburgerToggle';
import { AmbienceStartCard } from './AmbienceStartCard';
import { isPhone } from './VolumeTogglePhone';

interface NavbarProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onThemeToggle
}) => {
  const location = useLocation();
  const navItems = [
    { id: 'about', path: '/about', label: 'about me' },
    { id: 'keyboards', path: '/keyboards', label: 'keyboards' },
    { id: 'build-service', path: '/build-service', label: 'build service' }
  ];
  const [menuOpen, setMenuOpen] = useState(false); // controls menu open state
  const [menuVisible, setMenuVisible] = useState(false); // controls mounting
  const [animateOpen, setAnimateOpen] = useState(false); // controls animation class
  const closeTimeout = useRef<number | undefined>();
  const menuCardRef = useRef<HTMLDivElement | null>(null);

  // Ambience notification card state
  const [showAmbienceCard, setShowAmbienceCard] = useState(false);
  useEffect(() => {
    // Only show on initial load
    if (typeof window !== 'undefined') {
      if (isPhone()) {
        // Mobile: show if not muted
        const muted = localStorage.getItem('thock-muted');
        if (muted !== 'true') setShowAmbienceCard(true);
      } else {
        // Desktop: show if volume > 0
        const vol = localStorage.getItem('thock-volume');
        if (vol && parseFloat(vol) > 0) setShowAmbienceCard(true);
      }
    }
  }, []);

  // Mount/unmount logic (two effects for correct animation)
  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
    } else {
      setAnimateOpen(false);
      closeTimeout.current = window.setTimeout(() => setMenuVisible(false), 220);
    }
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [menuOpen]);

  // When menuVisible becomes true, trigger the open animation
  useEffect(() => {
    if (menuVisible && menuOpen) {
      // Next tick after mount
      const id = setTimeout(() => {
        setAnimateOpen(true);
      }, 10);
      return () => clearTimeout(id);
    }
  }, [menuVisible, menuOpen]);

  const handleNavClick = () => {
    // Simulate click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
    setMenuOpen(false);
  };

  return (
    <nav className="navbar-glass px-6 py-4 sm:px-4 sm:py-2" style={{ height: '70px', minHeight: '70px', maxHeight: '70px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative h-full">
        {/* Ambience notification card (rendered in portal for stacking/blur) */}
        {showAmbienceCard && typeof window !== 'undefined' && createPortal(
          <AmbienceStartCard
            isMobile={isPhone()}
            onDismiss={() => setShowAmbienceCard(false)}
          />,
          document.body
        )}
        {/* Hamburger only visible on mobile (sm and below), left of logo */}
        <div className="sm:hidden mr-2 pl-5 flex items-center justify-center">
          <HamburgerToggle
            open={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            color={isDark ? '#fff' : 'var(--color-primary-accent, #bfa181)'}
          />
        </div>

        {/* Logo, shifts right when hamburger is present on desktop */}
        <Link
          to="/"
          onClick={handleNavClick}
          className="logo-text hover:opacity-80 transition-opacity text-xl sm:text-xl"
          style={{ marginLeft: '0.5rem' }}
        >
          thock&co.
        </Link>

        {/* Nav Links centered and visible on desktop, hidden on mobile */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 hidden sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleNavClick}
              className={`text-sm transition-all duration-300 hover:text-interactive ${
                location.pathname === item.path ? 'text-interactive' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Menu Drawer (opened by hamburger) */}
        {menuVisible && typeof window !== 'undefined' && createPortal(
          <div style={{ position: 'fixed', left: 0, top: '75px', minWidth: '16rem', zIndex: 9999 }}>
            <div
              ref={menuCardRef}
              className={`k-card-container glass-card menu-drawer-card rounded-b-xl p-4 ml-2 backdrop-blur-[16px] bg-white/10 menu-drawer-animate${animateOpen ? ' menu-drawer-animate-open' : ''}`}
              style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)'}}
            >
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`block py-2 pl-2 text-base transition-all duration-300 hover:text-interactive ${
                    location.pathname === item.path ? 'text-interactive' : ''
                  }`}
                  style={{ marginBottom: '0.25rem' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>,
          document.body
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-4 ml-auto">
          <VolumeControl />
          <GlassCard
            onClick={onThemeToggle}
            className="theme-toggle-card w-10 h-10 flex items-center justify-center"
            exaggerated={true}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </GlassCard>
        </div>
      </div>
    </nav>
  );
};