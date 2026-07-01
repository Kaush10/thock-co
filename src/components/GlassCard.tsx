import { useTiltCard } from '../hooks/useTiltCard';


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
  // Robust touch detection
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const cardRef = useTiltCard<HTMLDivElement>(
    isTouchDevice
      ? {
          max: 0, // disables tilt and clickback
          speed: 500,
          perspective: 1200,
          glare: false,
          scale: 1,
          reset: true,
          reverse: true
          // TODO: Add custom mobile tap/click animation here if desired
        }
      : exaggerated
      ? {
          max: 14,
          speed: 350,
          perspective: 1200,
          glare: true,
          'max-glare': 0.1,
          scale: 1.06,
          reset: true,
          reverse: true
        }
      : reducedParallax
      ? {
          max: 3.5,
          speed: 500,
          perspective: 1800,
          glare: true,
          'max-glare': 0.1,
          scale: 1.015,
          reset: true,
          reverse: true
        }
      : staticEffect
      ? undefined
      : {
          max: 7,
          speed: 500,
          perspective: 1800,
          glare: true,
          'max-glare': 0.1,
          scale: 1.03,
          reset: true,
          reverse: true
        }
  );



  return (
    <div
      ref={cardRef}
      className={`glass-card ${exaggerated ? 'glass-card-exaggerated' : ''} relative overflow-hidden ${staticEffect ? '' : 'cursor-pointer'} ${className}`}
      onClick={onClick}
      {...(!staticEffect && { 'data-tilt': true })}
    >
      <div className="relative z-10" style={exaggerated ? { transform: 'translateZ(20px)' } : {}}>
        {children}
      </div>
    </div>
  );
};
