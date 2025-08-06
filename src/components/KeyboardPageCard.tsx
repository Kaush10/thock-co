import React from 'react';
import { useEffect } from 'react';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';
import './KeyboardPageCard.css';
import { Article } from '../data/articles';

interface KeyboardPageCardProps {
  review: Article;
  onReadMore?: () => void;
}

// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;

export const KeyboardPageCard: React.FC<KeyboardPageCardProps> = ({ review, onReadMore }) => {

  const cardRef = React.useRef<HTMLDivElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    // Robust touch detection
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (typeof VanillaTilt !== 'undefined' && cardRef.current) {
      if (isTouchDevice) {
        // On mobile: disable all tilt and clickback
        VanillaTilt.init(cardRef.current, {
          max: 0, // disables tilt and clickback
          speed: 500,
          perspective: 1800,
          glare: false,
          scale: 1,
          reset: true,
          reverse: true
        });
        // TODO: Add custom mobile tap/click animation here if desired
      } else {
        // On desktop: normal settings
        VanillaTilt.init(cardRef.current, {
          max: 7,
          speed: 500,
          perspective: 1800,
          glare: true,
          "max-glare": 0.1,
          scale: 1.03,
          reset: true,
          reverse: true
        });
      }
    }
    return () => {
      if (cardRef.current && (cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleCardClick(e);
  };

  return (
    <div
      ref={cardRef}
      className="k-card-container"
      data-tilt
      onClick={handleClick}
    >
      <div className="k-card-content-area">
        {review.image && (
          <img src={review.image} alt={review.title} className="k-card-image" />
        )}
        <div className="k-card-text-block">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl sm:text-2xl font-bold">
              {review.title}
            </h3>
            <span className="text-xs text-secondary">{review.date}</span>
          </div>
          <p className="text-sm sm:text-base font-light mb-4">
            {review.snippet}
          </p>
          <div className="mb-4">
            <span className="spec-tag">
              {review.specs}
            </span>
          </div>
          <blockquote className="testimonial-quote mb-4">
            "{review.testimonial}"
          </blockquote>
          {onReadMore && (
            <button
              className="mt-2 text-sm font-medium hover:underline flex items-center gap-1 group bg-transparent p-0 border-0 outline-none focus:underline secondary-highlight"
              style={{ background: 'none', boxShadow: 'none', cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation();
                onReadMore();
              }}
            >
              <span className="lowercase">read more</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
