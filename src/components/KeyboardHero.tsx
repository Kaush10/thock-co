import { useEffect, useRef } from 'react';
import './ScrollHero.css';
import './KeyboardPageCard.css';
import './KeyboardPen.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';

gsap.registerPlugin(ScrollTrigger);

declare const VanillaTilt: any;

interface KeyboardHeroProps {
  bodyText: string;
  isDark: boolean;
}

export const KeyboardHero: React.FC<KeyboardHeroProps> = ({ bodyText, isDark }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  const scrollBySpace = () => {
    window.scrollBy({
      top: 900,
      left: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (typeof VanillaTilt !== 'undefined') {
      if (isTouchDevice) {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
          max: 0,
          speed: 500,
          perspective: 1800,
          glare: false,
          scale: 1,
          reset: true,
          reverse: true
        });
      } else {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
          max: 7,
          speed: 500,
          perspective: 1800,
          glare: true,
          'max-glare': 0.1,
          scale: 1.03,
          reset: true,
          reverse: true
        });
      }
    }
  }, []);

  useEffect(() => {
    let st: ScrollTrigger | undefined;
    let scrollTimeout: NodeJS.Timeout;

    if (componentRef.current && textContainerRef.current && cursorRef.current) {
      const scrollDistance = 3700;
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
      cursorRef.current.classList.add('is-blinking');

      st = ScrollTrigger.create({
        trigger: componentRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: true,
        onUpdate: (self) => {
          cursorRef.current?.classList.remove('is-blinking');
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            cursorRef.current?.classList.add('is-blinking');
          }, 150);

          const endBuffer = 0.09;
          const charIndex = Math.floor(Math.min(1, self.progress / (1 - endBuffer)) * textLength);

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

            {/* Right Column - Keyboard Element from CodePen */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'rotate(8deg)'}}>
                <article className="keyboard-pen flex items-center justify-center" style={{minHeight: '7em', marginTop: '20em'}}>
                  {/* SVG wire: straight then curved off screen */}
                  <svg
                    style={{
                      position: 'absolute',
                      top: '-14em',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20em',
                      height: '40em',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}
                    viewBox="0 -200 400 1060"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="wire-gradient" x1="0" y1="0" x2="400" y2="560" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ccc" />
                        <stop offset="30%" stopColor="#eee" />
                        <stop offset="60%" stopColor="#ddd" />
                        <stop offset="100%" stopColor="#ccc" />
                      </linearGradient>
                      <filter id="wire-shadow" x="-20" y="-20" width="440" height="600">
                        <feDropShadow dx="-2" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
                      </filter>
                    </defs>
                    {/* Straight wire: vertical line above keyboard */}
                    <path
                      d="M200 0 L200 400"
                      stroke="url(#wire-gradient)"
                      strokeWidth="10"
                      fill="none"
                      filter="url(#wire-shadow)"
                      strokeLinecap="round"
                    />
                  </svg>
                  <button
                    style={{width: '18em', height: '4em', fontSize: '1.3em', textTransform: 'uppercase'}}
                    onClick={scrollBySpace}
                    aria-label="Scroll down by space"
                  >
                    space
                  </button>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
