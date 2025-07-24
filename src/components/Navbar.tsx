import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onPageChange, 
  isDark, 
  onThemeToggle 
}) => {
  const navItems = [
    { id: 'about', label: 'about me' },
    { id: 'keyboards', label: 'keyboards' },
    { id: 'build-service', label: 'build service' }
  ];

  const handleNavClick = (pageId: string) => {
    // Simulate click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
    
    onPageChange(pageId);
  };

  return (
    <nav className="navbar-glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <button 
          onClick={() => handleNavClick('home')}
          className="logo-text hover:opacity-80 transition-opacity"
        >
          thock & co.
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm transition-all duration-300 hover:text-interactive ${
                currentPage === item.id ? 'text-interactive' : ''
              }`}
            >
              {item.label}
            </button>
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