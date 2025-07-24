import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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

  const handleNavClick = () => {
    // Simulate click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  return (
    <nav className="navbar-glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <Link 
          to="/"
          onClick={handleNavClick}
          className="logo-text hover:opacity-80 transition-opacity"
        >
          thock&co.
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
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
        
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg glass-button"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
};