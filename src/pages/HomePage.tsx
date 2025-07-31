
import { LiquidButton } from '../components/LiquidButton';
import { ScrollHero } from '../components/ScrollHero';
import { HomeTierIntroCards } from '../components/HomeTierIntroCards';
import { AnimatedHole } from '../components/AnimatedHole';
import { useNavigate } from 'react-router-dom';


interface HomePageProps {
  isDark: boolean;
  overflowXHiddenClass?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ isDark, overflowXHiddenClass }) => {
  const bodyText = `crafting the perfect keystroke experience through meticulous attention to detail and premium materials. every build is a testament to the art of mechanical keyboards. from sound dampening to switch lubing, we transform your vision into a typing masterpiece that delivers years of exceptional performance. based in urbana-champaign, il, we serve enthusiasts worldwide who demand nothing but the finest in custom keyboard craftsmanship.`;

  return (
    <div className="px-6 pt-0">
      {/* Remove top padding so ScrollHero is flush with top */}
      <ScrollHero bodyText={bodyText} isDark={isDark} />
      <div className={`${overflowXHiddenClass || ''} overflow-x-hidden w-full`}>
        {/* Patch: Ensure all child containers use w-full, not w-screen or w-[100vw] */}
        <HomeTierIntroCards isDark={isDark} />
        <div className="w-full" style={{ height: '100vh' }}></div>
        <div className="w-full" style={{ position: 'relative', height: 400 }}>
          {/* @ts-ignore: custom element is injected at runtime */}
          <AnimatedHole />
        </div>
      </div>
    </div>
  );
};
