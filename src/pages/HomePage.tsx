import { LiquidButton } from '../components/LiquidButton';
import { ScrollHero } from '../components/ScrollHero';
import { HomeTierIntroCards } from '../components/HomeTierIntroCards';
import { AnimatedHole } from '../components/AnimatedHole';
import { useNavigate } from 'react-router-dom';
import { ScrollHeroTiers } from '../components/ScrollHeroTiers';
import { GlassCard } from '../components/GlassCard';


interface HomePageProps {
  isDark: boolean;
  overflowXHiddenClass?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ isDark, overflowXHiddenClass }) => {
  const navigate = useNavigate();
  const bodyText = `to touch and to feel is deeply human. 
it's something i've always believed defines our connection to the world. 

to me, a keyboard is the most personal interface for interacting with our digital world... and even beyond that, it's a sensory experience—a beautiful fusion of sound and feel. 

at thock & co., my mission is to transform your vision into a typing masterpiece that delivers unparalleled aesthetics and intensely gratifying feel.  `;

  return (
    <div className="px-6 pt-0">
      {/* Remove top padding so ScrollHero is flush with top */}
      <ScrollHero bodyText={bodyText} isDark={isDark} />
      <ScrollHeroTiers isDark={isDark} topPadding="2.5rem" topOffset="12rem" />
      {/* Remove extra vertical space between heroes */}
      <div className={`${overflowXHiddenClass || ''} overflow-x-hidden w-full`}>
        {/* <HomeTierIntroCards isDark={isDark} /> -- now handled by ScrollHeroTiers */}
        <div className="w-full" style={{ height: '50vh' }}></div>
        {/* Insert button directly above the AnimatedHole, below the grid */}
        <div className="w-full flex justify-center items-center mb-0" style={{ position: 'relative', zIndex: 2 }}>
          <GlassCard
            onClick={() => navigate('/build-service')}
            reducedParallax={true}
            className="theme-toggle-card homepage-rounded homepage-shimmer flex items-center justify-center transition-all duration-300 cursor-pointer w-full max-w-2xl h-20 md:w-3/4 sm:w-full bg-transparent"
          >
            <h2
              className={`text-lg font-subheading m-0 p-0 ${isDark ? 'text-white' : 'text-black'}`}
              style={{ fontFamily: 'Reddit Mono, monospace', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              build your dream keyboard
            </h2>
          </GlassCard>
        </div>
        <div className="w-full" style={{ position: 'relative', zIndex: 1 }}>
          {/* @ts-ignore: custom element is injected at runtime */}
          <AnimatedHole />
        </div>
      </div>
    </div>
  );
};
