import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { RotatingHeadline } from './RotatingHeadline';
import { PencilRuler, PocketKnife, Eye } from 'lucide-react';

interface HomeTierIntroCardsProps {
  isDark: boolean;
}

const TIERS = [
  {
    key: 'essentials',
    title: 'the essentials.',
    icon: () => (
      <PencilRuler className="mb-4" size={48} />
    ),
    keywords: ['tuned.', 'to.', 'perfection.'],
    description: 'my dedication to the individual components that define your typing experience. this tier is for perfecting your existing keyboard with mods, tuning, and expert craftsmanship, one detail at a time.'
  },
  {
    key: 'craft',
    title: 'the craft.',
    icon: () => (
      <PocketKnife className="mb-4" size={48} />
    ),
    keywords: ['crafted.', 'for.', 'precision.'],
    description: 'my hands-on approach to assembly, bringing your chosen components together with meticulous care and technical precision. this tier is for turning a pile of parts into a cohesive, perfectly built keyboard.'
  },
  {
    key: 'vision',
    title: 'the vision.',
    icon: () => (
      <Eye className="mb-4" size={48} />
    ),
    keywords: ['your.', 'curated.', 'dream.'],
    description: 'the ultimate personalized experience. from initial concept to a fully optimized keyboard, i handle everything. this tier is for clients who have a dream but not the time, ensuring a one-of-a-kind creation delivered to your desk.'
  }
];

export const HomeTierIntroCards: React.FC<HomeTierIntroCardsProps> = ({ isDark }) => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Always horizontal row, custom mobile layout */}
  <div className="flex flex-row gap-2 md:gap-8 py-12 w-full home-tier-row">
          {TIERS.map((tier, idx) => {
            const isSelected = selected === idx;
            return (
              <div
                key={tier.key}
                className={`k-card-container nearly-sharp fade-in-up cursor-pointer transition-all duration-300 home-tier-card ${!isDark ? 'light' : ''}`}
                style={{
                  height: 340, // fixed height for all cards
                  flex: isSelected ? '1 1 70%' : '0 1 56px',
                  maxWidth: isSelected ? '100%' : '56px',
                  background: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'flex 0.4s cubic-bezier(0.22, 1, 0.36, 1), max-width 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s, border 0.3s',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(idx)}
              >
                <div className={`k-card-content-area flex flex-col items-center justify-center h-full relative ${isSelected ? '' : 'mobile-collapsed'}`}>
                  {isSelected ? (
                    <>
                      {tier.icon()}
                      <span
                        className="text-2xl text-interactive mb-2"
                        style={{
                          fontFamily: 'Reddit Mono, monospace',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFeatureSettings: '"kern" 1, "liga" 1',
                        }}
                      >
                        {tier.title}
                      </span>
                      <span
                        className="block mt-6 text-center opacity-80 mx-auto"
                        style={{
                          minHeight: 48,
                          width: '100%',
                          maxWidth: '100%',
                          fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.65rem' : '1rem',
                          ...(typeof window !== 'undefined' && window.innerWidth >= 768
                            ? { width: '80%', maxWidth: '80%' }
                            : {}),
                        }}
                      >
                        {tier.description}
                      </span>
                    </>
                  ) : (
                    <span className="tier-title-rotated font-bold text-interactive" style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      fontFamily: 'Reddit Mono, monospace',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontFeatureSettings: '"kern" 1, "liga" 1',
                      fontSize: '1.5rem',
                      minWidth: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      opacity: 0.85,
                      transition: 'opacity 0.4s, font-size 0.4s, color 0.4s',
                    }}>{tier.title}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Rotating headline below the cards, changes with selected card */}
        <div className="flex justify-center items-center mt-2 md:mt-8">
          <RotatingHeadline keywords={TIERS[selected].keywords} />
        </div>
      </div>
    </div>
  );
};
