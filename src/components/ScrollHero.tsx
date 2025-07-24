import React, { useEffect, useRef } from 'react';
import './ScrollHero.css';
import { GlassCard } from './GlassCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollHeroProps {
  bodyText: string;
  isDark: boolean;
}

export const ScrollHero: React.FC<ScrollHeroProps> = ({ bodyText, isDark }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (componentRef.current) {
      const textColor = isDark ? 'white' : 'black';
      const cursorColor = isDark ? 'hsl(320 100% 50%)' : 'black';
      componentRef.current.style.setProperty('--cursor-color', cursorColor);

      if (textContainerRef.current && cursorRef.current) {
        const charSpans = Array.from(textContainerRef.current.querySelectorAll('span'));
        if (charSpans.length === 0) return;

        const textLength = charSpans.length;
        
        // Set initial state
        charSpans.forEach(span => {
          span.style.color = 'transparent';
        });
        
        // Make cursor visible from the start
        cursorRef.current.classList.add('is-active');

        ScrollTrigger.create({
          trigger: componentRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
          onUpdate: (self) => {
            const charIndex = Math.floor(self.progress * textLength);
            
            // Reveal characters up to the current index
            charSpans.forEach((span, i) => {
              span.style.color = i < charIndex ? textColor : 'transparent';
            });

            // Update cursor position based on the current character
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
            // Ensure all text is visible when scrolling past
            charSpans.forEach(span => {
              span.style.color = textColor;
            });
          },
          onEnterBack: () => {
            // When re-entering from the bottom, ensure text is fully visible before scrubbing back
            charSpans.forEach(span => {
              span.style.color = textColor;
            });
          },
          onLeaveBack: () => {
            // When scrolling back past the top, ensure text is fully transparent
            charSpans.forEach(span => {
              span.style.color = 'transparent';
            });
          }
        });
      }
    }
  }, [bodyText, isDark]);

  return (
    <div ref={componentRef} className="scroll-hero-container">
      <div className="scroll-hero-sticky-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold accent-text leading-tight page-header">
              thock & co.
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
            <GlassCard className="p-8 transform rotate-3">
              <img
                src="https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="custom keyboard artwork"
                className="w-full h-80 object-cover rounded-lg"
              />
              <p className="text-center mt-4 text-sm opacity-70">
                keyboard art by gf
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
