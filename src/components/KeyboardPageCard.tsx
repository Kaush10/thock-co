import React, { useEffect } from 'react';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';
import './KeyboardPageCard.css';
import { Article } from '../data/articles';

interface KeyboardPageCardProps {
  review: Article;
}

// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;

export const KeyboardPageCard: React.FC<KeyboardPageCardProps> = ({ review }) => {

  const cardRef = React.useRef<HTMLDivElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    if (typeof VanillaTilt !== 'undefined' && cardRef.current) {
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
        <img src={review.image} alt={review.title} className="k-card-image" />
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
          <blockquote className="testimonial-quote">
            "{review.testimonial}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};
