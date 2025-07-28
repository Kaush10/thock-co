import { useState } from 'react';
import { useSpring, animated } from 'react-spring';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  showAnimation?: boolean;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({ 
  children, 
  onClick, 
  className = '',
  showAnimation = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHammerAnimation, setShowHammerAnimation] = useState(false);

  const [springProps, api] = useSpring(() => ({
    transform: 'scale(1) translateY(0px)',
    background: 'var(--glass-bg)',
  }));

  const [hammerSpring, hammerApi] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(20px) rotate(0deg)',
  }));

  const handleMouseEnter = () => {
    setIsHovered(true);
    api.start({
      transform: 'scale(1.05) translateY(-2px)',
      background: 'rgba(147, 112, 219, 0.1)',
    });

    if (showAnimation) {
      setShowHammerAnimation(true);
      hammerApi.start({
        opacity: 1,
        transform: 'translateY(-10px) rotate(-15deg)',
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    api.start({
      transform: 'scale(1) translateY(0px)',
      background: 'var(--glass-bg)',
    });

    if (showAnimation) {
      hammerApi.start({
        opacity: 0,
        transform: 'translateY(20px) rotate(0deg)',
      }).then(() => {
        setShowHammerAnimation(false);
      });
    }
  };

  const handleClick = () => {
    // Simulate click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
    
    if (onClick) onClick();
  };

  return (
    <animated.button
      style={springProps}
      className={`glass-button relative overflow-visible ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      
      {showHammerAnimation && (
        <animated.div
          style={hammerSpring}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl pointer-events-none"
        >
          🔨
        </animated.div>
      )}
    </animated.button>
  );
};