import React, { useEffect, useRef } from 'react';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';

declare const VanillaTilt: any;

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  exaggerated?: boolean; // For small elements that need more noticeable effects
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  exaggerated = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    // Initialize VanillaTilt with 2x exaggerated settings for small elements
    if (typeof VanillaTilt !== 'undefined' && cardRef.current) {
      const settings = exaggerated ? {
        max: 14, // 2x more tilt (7 * 2 = 14)
        speed: 350, // Faster response but not too fast
        perspective: 1200, // Closer perspective for more effect
        glare: true,
        "max-glare": 0.1, // 50% of previous 0.2 glare
        scale: 1.06, // Bigger scale on hover (double the normal 3%)
        reset: true,
        reverse: true
      } : {
        max: 7,
        speed: 500,
        perspective: 1800,
        glare: true,
        "max-glare": 0.1,
        scale: 1.03,
        reset: true,
        reverse: true
      };
      
      VanillaTilt.init(cardRef.current, settings);
    }

    // Cleanup function to destroy VanillaTilt instance
    return () => {
      if (cardRef.current && (cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // For exaggerated cards, add visual shrink bounce effect (always triggers)
    if (exaggerated && cardRef.current) {
      const card = cardRef.current;
      card.classList.add('glass-card-shrink');
      setTimeout(() => {
        card.classList.remove('glass-card-shrink');
      }, 320); // Duration matches new CSS animation
    }
    // Play the enhanced click animation (tilt effect)
    handleCardClick(e);
    // Execute the provided onClick callback
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${exaggerated ? 'glass-card-exaggerated' : ''} relative overflow-hidden cursor-pointer ${className}`}
      onClick={handleClick}
      data-tilt
    >
      <div className="relative z-10" style={exaggerated ? { transform: 'translateZ(20px)' } : {}}>
        {children}
      </div>
    </div>
  );
};
