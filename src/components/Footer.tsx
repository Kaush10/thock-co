
import { Instagram, MessageCircle, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const handleLinkClick = () => {
    // Simulate click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  return (
    <footer className="glass-card mx-6 mb-6 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
          <div className="flex items-center gap-6 mb-2 md:mb-0 whitespace-nowrap">
            <Link
              to="/about"
              onClick={handleLinkClick}
              className="text-sm hover:text-interactive transition-colors"
            >
              about me
            </Link>
            <Link
              to="/build-service"
              onClick={handleLinkClick}
              className="text-sm hover:text-interactive transition-colors"
            >
              build services
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="text-sm hover:text-interactive transition-colors"
            >
              questions? say hi
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm mb-2 md:mb-0 whitespace-nowrap">
            <span>© 2025 thock & co.</span>
          </div>
          <div className="flex items-center gap-2 text-sm mb-2 md:mb-0 whitespace-nowrap">
            <span>made with</span>
            <Heart size={14} className="text-red-400" />
            <span>by thock & co.</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full justify-center md:justify-end">
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
    </footer>
  );
};