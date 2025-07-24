import React, { useState, useMemo } from 'react';
import { LiquidButton } from '../components/LiquidButton';
import { KeyboardPageCard } from '../components/KeyboardPageCard';
import { articles } from '../data/articles'; // Import articles from the new data file
import { Link } from 'react-router-dom';

export const KeyboardsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  // Sort articles by date, newest first
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, sortedArticles.length));
  };

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold accent-text mb-12 text-center fade-in-up page-header">
          keyboard gallery & reviews
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sortedArticles.slice(0, visibleCount).map((article) => (
            <Link to={`/keyboards/${article.slug}`} key={article.id} className="block">
              <KeyboardPageCard review={article} />
            </Link>
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