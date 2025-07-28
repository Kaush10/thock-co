import React, { useRef, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import '../components/KeyboardPageCard.css';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';
import { LiquidButton } from '../components/LiquidButton';
import { ExternalLink } from 'lucide-react';

// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;


// Duplicated VanillaTilt config for About card (can be tuned independently)
const ABOUT_CARD_TILT_CONFIG = {
  max: 7,
  speed: 500,
  perspective: 1800,
  glare: true,
  "max-glare": 0.1,
  scale: 1.03,
  reset: true,
  reverse: true
};

export const AboutPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    if (typeof VanillaTilt !== 'undefined' && cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 1.75, // 25% of original
        speed: 500,
        perspective: 1800,
        glare: true,
        "max-glare": 0.1,
        scale: 1.0075, // 25% of original scale
        reset: true,
        reverse: true
      });
    }
    return () => {
      if (cardRef.current && (cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Custom clickback: reduce pushback intensity by 50%
    const card = cardRef.current;
    if (card) {
      // Read current transform
      const currentTransform = card.style.transform;
      const rotateXMatch = currentTransform.match(/rotateX\(([^d]+)deg\)/);
      const rotateYMatch = currentTransform.match(/rotateY\(([^d]+)deg\)/);
      const rotateX = rotateXMatch ? parseFloat(rotateXMatch[1]) : 0;
      const rotateY = rotateYMatch ? parseFloat(rotateYMatch[1]) : 0;
      const tiltInstance = (card as any).vanillaTilt;
      const perspective = tiltInstance?.settings?.perspective || 1800;
      const scale = tiltInstance?.settings?.scale || 1.015;
      // 50% of the normal exaggeration
      const pushbackX = rotateX * 0.9;
      const pushbackY = rotateY * 0.9;
      card.style.transform = `perspective(${perspective}px) rotateX(${pushbackX}deg) rotateY(${pushbackY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      card.style.transition = `transform 0.1s ease-out`;
      setTimeout(() => {
        card.style.transition = `transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        setTimeout(() => {
          card.style.transition = '';
        }, 50);
      }, 100);
    }
    // Play click sound and allow any other effect
    handleCardClick(e);
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div ref={cardRef} className="k-card-container" data-tilt onClick={handleClick}>
          <div className="k-card-content-area p-12 fade-in-up">
            <h1 className="text-4xl font-bold accent-text mb-8 text-center page-header">
              about thock & co.
            </h1>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                thock & co. is founded on a passion for the perfect keystroke. what started as 
                a personal obsession with mechanical keyboards has evolved into a dedicated service 
                for fellow enthusiasts who understand that typing is more than just input—it's an experience.
              </p>
              <p>
                every build begins with understanding your unique needs. whether you're a programmer 
                seeking the perfect tactile feedback, a writer craving smooth linear switches, or a 
                gamer demanding lightning-fast response times, we craft each keyboard to match your 
                exact specifications.
              </p>
              <p>
                our process combines traditional craftsmanship with modern techniques. from hand-lubing 
                switches to precision foam modding, every detail is carefully considered. we source only 
                premium materials and work with trusted vendors to ensure your keyboard not only sounds 
                amazing but will provide years of reliable service.
              </p>
              <p>
                based in urbana-champaign, illinois, we serve keyboard enthusiasts worldwide. each build 
                is documented with detailed photos, and we maintain open communication throughout the 
                entire process. your satisfaction is our priority, and we stand behind every keyboard 
                that leaves our workshop.
              </p>
              <p className="text-center italic opacity-80">
                my personal portfolio is coming soon at{' '}
                <a 
                  href="https://kaush.me" 
                  className="text-interactive hover:underline inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kaush.me
                  <ExternalLink size={16} />
                </a>
              </p>
            </div>
            <div className="flex justify-center mt-12">
              <LiquidButton className="px-8 py-3">
                start your build journey
              </LiquidButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};