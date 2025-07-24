import React from 'react';
import { LiquidButton } from '../components/LiquidButton';
import { ScrollHero } from '../components/ScrollHero';
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

      {/* CTA Button */}
      <div className="flex justify-center fade-in-up my-16">
        <LiquidButton
          onClick={() => navigate('/build-service')}
        >
          custom keyboard build service
        </LiquidButton>
      </div>

      {/* Temporary content for scrolling */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="text-3xl font-bold text-center">More Content Below</h2>
      </div>
    </div>
  );
};