import { useRef, useEffect } from 'react';
import { HomeTierIntroCards } from './HomeTierIntroCards';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface ScrollHeroTiersProps {
  isDark: boolean;
  topPadding?: string;
  topOffset?: string;
}

export const ScrollHeroTiers: React.FC<ScrollHeroTiersProps> = ({ isDark, topPadding = '2.5rem', topOffset = '12rem' }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let st: ScrollTrigger | undefined;
    const scrollDistance = 2800; // Increased lock distance for longer stick
    if (componentRef.current) {
      componentRef.current.style.height = `calc(100vh + ${scrollDistance}px)`;
      st = ScrollTrigger.create({
        trigger: componentRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: true,
        pin: componentRef.current.querySelector('.scroll-hero-sticky-content'),
        pinSpacing: true,
      });
    }
    return () => {
      st?.kill();
    };
  }, []);

  return (
    <div ref={componentRef} className="scroll-hero-container">
      <div className="scroll-hero-sticky-content" style={{ paddingTop: topPadding, top: topOffset, position: 'sticky' }}>
        <div className="max-w-7xl mx-auto w-full">
          {/* Tier cards and rotating headline section */}
          <HomeTierIntroCards isDark={isDark} />
        </div>
      </div>
    </div>
  );
};
