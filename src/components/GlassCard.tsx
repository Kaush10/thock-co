import { useRef } from 'react';
import { useTilt } from '../hooks/useTilt';


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
  useTilt(cardRef, staticEffect ? null : exaggerated ? 'strong' : reducedParallax ? 'soft' : 'normal');

  // Brief press-in on click/tap.
  const handlePointerDown = () => {
    const card = cardRef.current;
    if (!card || staticEffect) return;
    card.classList.add('glass-card-shrink');
    setTimeout(() => card.classList.remove('glass-card-shrink'), 120);
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${exaggerated ? 'glass-card-exaggerated' : ''} relative overflow-hidden ${staticEffect ? '' : 'cursor-pointer'} ${className}`}
      onClick={onClick}
      onPointerDown={handlePointerDown}
    >
      <div className="relative z-10" style={exaggerated ? { transform: 'translateZ(20px)' } : {}}>
        {children}
      </div>
    </div>
  );
};
