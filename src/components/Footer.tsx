import React from 'react';
import { Instagram, MessageCircle, Mail, Heart } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const handleLinkClick = (page: string) => {
    // Simulate click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
    
    onPageChange(page);
  };

  return (
    <footer className="glass-card mx-6 mb-6 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleLinkClick('about')}
            className="text-sm hover:text-interactive transition-colors"
          >
            about me
          </button>
          <button
            onClick={() => handleLinkClick('build-service')}
            className="text-sm hover:text-interactive transition-colors"
          >
            build services
          </button>
          <button
            onClick={() => handleLinkClick('contact')}
            className="text-sm hover:text-interactive transition-colors"
          >
            questions? say hi
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>© 2025 thock & co.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>made with</span>
            <Heart size={14} className="text-red-400" />
            <span>by thock & co.</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-interactive transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-interactive transition-colors">
              <MessageCircle size={18} />
            </a>
            <a href="#" className="hover:text-interactive transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};