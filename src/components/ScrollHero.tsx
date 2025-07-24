import React, { useEffect, useRef } from 'react';
import './ScrollHero.css';
import './KeyboardPageCard.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';

gsap.registerPlugin(ScrollTrigger);

// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;

interface ScrollHeroProps {
  bodyText: string;
  isDark: boolean;
}

export const ScrollHero: React.FC<ScrollHeroProps> = ({ bodyText, isDark }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    // Initialize VanillaTilt on elements with data-tilt.
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 7,
            speed: 500,
            perspective: 1800,
            glare: true,
            "max-glare": 0.1,
            scale: 1.03,
            reset: true,
            reverse: true
        });
    }
  }, []);

  useEffect(() => {
    let st: ScrollTrigger | undefined;
    let scrollTimeout: NodeJS.Timeout;

    if (componentRef.current && textContainerRef.current && cursorRef.current) {
      // Set the container's height to be the animation scroll distance + 1 screen height
      const scrollDistance = 3500;
      componentRef.current.style.height = `calc(100vh + ${scrollDistance}px)`;

      const textColor = isDark ? 'white' : 'black';
      const cursorColor = isDark ? 'hsl(320 100% 50%)' : 'black';
      componentRef.current.style.setProperty('--cursor-color', cursorColor);

      const charSpans = Array.from(textContainerRef.current.querySelectorAll('span'));
      if (charSpans.length === 0) return;

      const textLength = charSpans.length;
      
      charSpans.forEach(span => {
        span.style.color = 'transparent';
      });
      
      // Start with blinking cursor
      cursorRef.current.classList.add('is-blinking');

      st = ScrollTrigger.create({
        trigger: componentRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: true,
        onUpdate: (self) => {
          // Pause blinking while scrolling
          cursorRef.current?.classList.remove('is-blinking');
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            cursorRef.current?.classList.add('is-blinking');
          }, 150); // Resume blinking after 150ms of no scrolling

          const charIndex = Math.floor(self.progress * textLength);
          
          charSpans.forEach((span, i) => {
            span.style.color = i < charIndex ? textColor : 'transparent';
          });

          const safeIndex = Math.min(charIndex, textLength - 1);
          const currentChr = charSpans[safeIndex];
          
          if (currentChr && textContainerRef.current && cursorRef.current) {
            const rect = currentChr.getBoundingClientRect();
            const containerRect = textContainerRef.current.getBoundingClientRect();
            
            cursorRef.current.style.left = `${(rect.right - containerRect.left) - 7}px`;
            cursorRef.current.style.top = `${(rect.top - containerRect.top) - 20}px`;
          }
        },
        onLeave: () => {
          charSpans.forEach(span => {
            span.style.color = textColor;
          });
        },
        onEnterBack: () => {
          charSpans.forEach(span => {
            span.style.color = textColor;
          });
        },
        onLeaveBack: () => {
          charSpans.forEach(span => {
            span.style.color = 'transparent';
          });
        }
      });
    }

    return () => {
      st?.kill();
      clearTimeout(scrollTimeout);
    };
  }, [bodyText, isDark]);

  return (
    <div ref={componentRef} className="scroll-hero-container">
      <div className="scroll-hero-sticky-content">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold accent-text leading-tight page-header">
                thock&co.
              </h1>
              <div className="relative space-y-4 text-lg opacity-80 leading-relaxed">
                <p ref={textContainerRef} className="scroll-text-reveal">
                  {bodyText.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </p>
                <span ref={cursorRef} className="cursor"></span>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm h-[28rem] transform rotate-3">
                <div className="k-card-container w-full h-full" data-tilt onClick={handleCardClick}>
                  <div className="k-card-content-area flex items-center justify-center">
                    {/* Content removed as requested */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
