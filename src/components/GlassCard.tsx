import React, { useEffect, useRef } from 'react';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';

declare const VanillaTilt: any;



interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  exaggerated?: boolean; // For small elements that need more noticeable effects
  staticEffect?: boolean; // Disable tilt/parallax/scale for this card
  reducedParallax?: boolean; // Reduce tilt/parallax/scale for this card
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  exaggerated = false,
  staticEffect = false,
  reducedParallax = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    if (staticEffect) return;
    if (typeof VanillaTilt !== 'undefined' && cardRef.current) {
      let settings;
      if (exaggerated) {
        settings = {
          max: 14,
          speed: 350,
          perspective: 1200,
          glare: true,
          "max-glare": 0.1,
          scale: 1.06,
          reset: true,
          reverse: true
        };
      } else if (reducedParallax) {
        settings = {
          max: 3.5, // 50% of normal
          speed: 500,
          perspective: 1800,
          glare: true,
          "max-glare": 0.1,
          scale: 1.015, // 50% of normal scale
          reset: true,
          reverse: true
        };
      } else {
        settings = {
          max: 7,
          speed: 500,
          perspective: 1800,
          glare: true,
          "max-glare": 0.1,
          scale: 1.03,
          reset: true,
          reverse: true
        };
      }
      VanillaTilt.init(cardRef.current, settings);
    }

    // Cleanup function to destroy VanillaTilt instance
    return () => {
      if (cardRef.current && (cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
    };
  }, [staticEffect]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!staticEffect) {
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
    }
    // Execute the provided onClick callback
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${exaggerated ? 'glass-card-exaggerated' : ''} relative overflow-hidden ${staticEffect ? '' : 'cursor-pointer'} ${className}`}
      onClick={handleClick}
      {...(!staticEffect && { 'data-tilt': true })}
    >
      <div className="relative z-10" style={exaggerated ? { transform: 'translateZ(20px)' } : {}}>
        {children}
      </div>
    </div>
  );
};
