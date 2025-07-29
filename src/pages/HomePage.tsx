
import { LiquidButton } from '../components/LiquidButton';
import { ScrollHero } from '../components/ScrollHero';
import { HomeTierIntroCards } from '../components/HomeTierIntroCards';
import { AnimatedHole } from '../components/AnimatedHole';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  isDark: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  const navigate = useNavigate();
  const bodyText = `crafting the perfect keystroke experience through meticulous attention to detail and premium materials. every build is a testament to the art of mechanical keyboards. from sound dampening to switch lubing, we transform your vision into a typing masterpiece that delivers years of exceptional performance. based in urbana-champaign, il, we serve enthusiasts worldwide who demand nothing but the finest in custom keyboard craftsmanship.`;

  return (
    <div className="px-6 py-12">
      <ScrollHero bodyText={bodyText} isDark={isDark} />

      {/* 3-column tier intro cards below hero */}
      <HomeTierIntroCards isDark={isDark} />

      {/* Temporary content for scrolling */}
      <div style={{ height: '100vh' }}></div>

      {/* Animated pen effect at the very bottom */}
      <div className="w-full" style={{ position: 'relative', height: 400 }}>
        {/* @ts-ignore: custom element is injected at runtime */}
        <AnimatedHole />
      </div>
    </div>
  );
};
