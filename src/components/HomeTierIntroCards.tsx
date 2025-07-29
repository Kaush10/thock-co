import { useGlassCardEffect } from '../hooks/useGlassCardEffect';

interface HomeTierIntroCardsProps {
  isDark: boolean;
}

export const HomeTierIntroCards: React.FC<HomeTierIntroCardsProps> = ({ isDark }) => {
  const { handleCardClick } = useGlassCardEffect();

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
      {[0, 1, 2].map(idx => (
        <div
          key={idx}
          className="k-card-container nearly-sharp fade-in-up cursor-pointer"
          data-tilt
          style={{ minHeight: 320 }}
          onClick={handleCardClick}
        >
          <div className="k-card-content-area flex flex-col items-center justify-center h-full">
            {/* Placeholder for tier content */}
            <span className="text-2xl font-bold text-interactive">Tier {idx + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
