import React, { useState, useMemo, useRef } from 'react';
import { LiquidButton } from '../components/LiquidButton';
import { KeyboardPageCard } from '../components/KeyboardPageCard';
import { articles } from '../data/articles';
import { useNavigate } from 'react-router-dom';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';

export const KeyboardsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();
  const { handleCardClick: playCardAnimation } = useGlassCardEffect();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const handleCardClick = (slug: string, index: number) => {
    const cardElement = cardRefs.current[index];
    if (cardElement) {
      // The hook expects a MouseEvent, so we can create a partial one.
      playCardAnimation({ currentTarget: cardElement } as React.MouseEvent<HTMLDivElement>);
    }
    // Navigation disabled: do not open article page
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 9, sortedArticles.length));
  };

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold accent-text mb-12 text-center fade-in-up page-header">
          keyboard gallery & reviews
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sortedArticles.slice(0, visibleCount).map((article, index) => (
            <div 
              key={article.id} 
              onClick={() => handleCardClick(article.slug, index)}
              ref={el => cardRefs.current[index] = el}
            >
              <KeyboardPageCard review={article} />
            </div>
          ))}
        </div>

        {visibleCount < sortedArticles.length && (
          <div className="flex justify-center">
            <LiquidButton onClick={loadMore} className="px-8 py-3">
              load more
            </LiquidButton>
          </div>
        )}
      </div>
    </div>
  );
};
