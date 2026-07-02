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
  const pinRef = useRef<HTMLDivElement>(null);
  const easeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let st: ScrollTrigger | undefined;
    let tl: gsap.core.Timeline | undefined;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    // Shorter lock on mobile — long pins feel worse when fast-flicked.
    const scrollDistance = isMobile ? 1800 : 2800;
    const pinEl = pinRef.current;
    const easeEl = easeRef.current;
    if (componentRef.current && pinEl && easeEl) {
      componentRef.current.style.height = `calc(100vh + ${scrollDistance}px)`;

      // Ease-in/out cushion on a separate inner wrapper (opacity + scale
      // only, so it never fights the pinned element's own transform):
      // content settles in over the first ~8% of the pin and eases out
      // over the last ~8%, instead of snapping instantly to/from the
      // fully-locked state. scrub with a numeric lag smooths fast-scroll
      // deltas (esp. mobile momentum flings) so it doesn't just jump
      // straight to the scroll position every frame.
      tl = gsap.timeline()
        .fromTo(easeEl, { opacity: 0.6, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.08, ease: 'power1.out' })
        .to(easeEl, { opacity: 1, scale: 1, duration: 0.84 })
        .to(easeEl, { opacity: 0.6, scale: 0.97, duration: 0.08, ease: 'power1.in' });

      st = ScrollTrigger.create({
        trigger: componentRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 0.6,
        pin: pinEl,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        animation: tl,
      });
    }
    return () => {
      st?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div ref={componentRef} className="scroll-hero-container">
      <div ref={pinRef} className="scroll-hero-tiers-sticky-content">
        <div ref={easeRef} className="max-w-7xl mx-auto w-full">
          {/* Tier cards and rotating headline section */}
          <HomeTierIntroCards isDark={isDark} />
        </div>
      </div>
    </div>
  );
};
