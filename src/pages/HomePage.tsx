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
        {/* Replace button with commission status card style, including full glass styling and interactive effect */}
        <div className="w-full flex justify-center items-center" style={{ position: 'relative', zIndex: 2, marginBottom: 0 }}>
          <div
            className="homepage-cta-card fade-in-up px-8 py-6 rounded-[2.5rem] flex items-center justify-center w-[80%] lg:w-[45%] text-center gap-3 cursor-pointer"
            style={{
              background: 'color-mix(in srgb, var(--c-glass) 12%, transparent)',
              border: '1.5px solid color-mix(in srgb, var(--c-light) 60%, transparent)',
              backdropFilter: 'blur(8px) saturate(var(--saturation))',
              WebkitBackdropFilter: 'blur(8px) saturate(var(--saturation))',
              boxShadow:
                'inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent), ' +
                'inset 1.8px 3px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent), ' +
                'inset -2px -2px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent), ' +
                'inset -3px -8px 1px -6px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent), ' +
                'inset -0.3px -1px 4px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 12%), transparent), ' +
                'inset -1.5px 2.5px 0px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), ' +
                'inset 0px 3px 4px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), ' +
                'inset 2px -6.5px 1px -4px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), ' +
                '0px 1px 5px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), ' +
                '0px 6px 16px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent)',
              // width is now handled by Tailwind classes
            }}
            onClick={() => navigate('/build-service')}
          >
            <h2
              className={`text-lg font-subheading m-0 p-0 ${isDark ? 'text-white' : 'text-black'}`}
              style={{ fontFamily: 'Reddit Mono, monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              build your dream keyboard
            </h2>
          </div>
        </div>
        <div className="w-full" style={{ position: 'relative', zIndex: 1 }}>
          {/* @ts-ignore: custom element is injected at runtime */}
          <AnimatedHole />
        </div>
      </div>
    </div>
  );
};
