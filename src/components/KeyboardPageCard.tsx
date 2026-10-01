import React from 'react';
import { useTilt } from '../hooks/useTilt';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';
import './KeyboardPageCard.css';
import type { Build } from '../data/builds';
import { photoProps } from '../lib/photo';

interface KeyboardPageCardProps {
  review: Build;
  onReadMore?: () => void;
}


export const KeyboardPageCard: React.FC<KeyboardPageCardProps> = ({ review, onReadMore }) => {

  const cardRef = React.useRef<HTMLDivElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useTilt(cardRef, 'normal');

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleCardClick(e);
  };

  return (
    <div
      ref={cardRef}
      className="k-card-container"

      onClick={handleClick}
    >
      <div className="k-card-content-area">
        {review.image && (
          <img {...photoProps(review.image, '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw')} alt={review.title} loading="lazy" className="k-card-image" />
        )}
        <div className="k-card-text-block">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl sm:text-2xl font-bold">
              {review.title}
            </h3>
            <span className="text-xs text-secondary">built {review.built}</span>
          </div>
          <p className="text-sm sm:text-base font-light mb-4">
            {review.summary}
          </p>
          {onReadMore && (
            <button
              className="mt-2 text-sm font-medium hover:underline flex items-center gap-1 group bg-transparent p-0 border-0 focus:underline secondary-highlight"
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
