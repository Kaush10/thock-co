import { useEffect, useRef } from 'react';
import './ScrollHero.css';
import './KeyboardPageCard.css';
import { articles } from '../data/articles';
import { photoProps } from '../lib/photo';
import { prefersReducedMotion } from '../lib/motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);


interface ScrollHeroProps {
  bodyText: string;
  isDark: boolean;
}

const BUILD_IMAGES = articles.map((article) => article.image);

export const ScrollHero: React.FC<ScrollHeroProps> = ({ bodyText, isDark }) => {
  const slideIdxRef = useRef(0);
  const slideImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const slideCardRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    let st: ScrollTrigger | undefined;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    if (prefersReducedMotion()) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    if (componentRef.current && textContainerRef.current && cursorRef.current) {
      // Set the container's height to be the animation scroll distance + 1 screen height
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

      // Start with blinking cursor
      cursorRef.current.classList.add('is-blinking');

      let lastCharIndex = 0;

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

          // Only touch the spans whose state actually changed this frame
          if (charIndex > lastCharIndex) {
            for (let i = lastCharIndex; i < charIndex; i++) {
              charSpans[i].style.color = textColor;
            }
          } else if (charIndex < lastCharIndex) {
            for (let i = charIndex; i < lastCharIndex; i++) {
              charSpans[i].style.color = 'transparent';
            }
          }
          lastCharIndex = charIndex;

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

  useEffect(() => {
    const card = slideCardRef.current;
    if (!card) return;

    // Disable the CSS `transition: transform` from k-card-container so it doesn't
    // fight GSAP's per-frame transform updates (which caused flickering).
    card.style.transition = 'none';

    const perspective = 1800;
    const scale = 1.03;
    const max = 10;      // auto-animation tilt range
    const hoverMax = 7; // hover adds up to this on top of the animation

    // hover offset is added on top of the GSAP base values every frame
    const hover = { rx: 0, ry: 0 };

    const applyTransform = (rx: number, ry: number) => {
      card.style.transform = `perspective(${perspective}px) rotateX(${rx + hover.rx}deg) rotateY(${ry + hover.ry}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    // Corners of the rectangle traced continuously: TL → TR → BR → BL → TL
    // Each edge: [endRX, endRY] — we tween from wherever the last edge ended
    const edges: [number, number][] = [
      [-max,  max],  // top edge end:    TR
      [ max,  max],  // right edge end:  BR
      [ max, -max],  // bottom edge end: BL
      [-max, -max],  // left edge end:   TL
    ];

    // ── Tune these to change the feel of the animation ───────────────────────
    const edgeDuration = 2.5;  // seconds per edge sweep (same for all edges)
    // Each edge is split into two chained tweens: a short exponential ramp-up
    // from rest, then a longer power3 deceleration into the corner (the snappy
    // settle from before). Tune the fractions to shift how much of the edge is
    // spent ramping up vs. settling down.
    const rampFrac = 0.25;   // portion of edgeDuration spent ramping up
    const rampDistFrac = 0.12; // portion of the edge's distance covered during the ramp
    const rampEase = 'power2.in';
    const decelEase = 'power3.out';
    // ─────────────────────────────────────────────────────────────────────────

    // Two-stage (fast/slow) animation commented out — see git history to restore.
    // const slowDuration = 3.5; const fastDuration = 0.9;
    // const fastEase = 'circ.in'; const slowEase = 'circ.out';

    let edgeIdx = 0;
    let alive = true;
    let tween: gsap.core.Tween | null = null;
    let hoverTween: gsap.core.Tween | null = null;

    // Start at TL corner
    const obj = { rx: -max, ry: -max };
    applyTransform(obj.rx, obj.ry);

    function runEdge() {
      if (!alive) return;
      const [ex, ey] = edges[edgeIdx];

      // Advance image directly via DOM refs — avoids React re-render mid-animation
      const imgs = slideImgRefs.current;
      if (imgs[slideIdxRef.current]) imgs[slideIdxRef.current]!.style.opacity = '0';
      slideIdxRef.current = (slideIdxRef.current + 1) % BUILD_IMAGES.length;
      if (imgs[slideIdxRef.current]) imgs[slideIdxRef.current]!.style.opacity = '1';

      const startRx = obj.rx;
      const startRy = obj.ry;
      const rampRx = startRx + (ex - startRx) * rampDistFrac;
      const rampRy = startRy + (ey - startRy) * rampDistFrac;

      tween = gsap.to(obj, {
        rx: rampRx,
        ry: rampRy,
        duration: edgeDuration * rampFrac,
        ease: rampEase,
        onUpdate: () => applyTransform(obj.rx, obj.ry),
        onComplete: () => {
          tween = gsap.to(obj, {
            rx: ex,
            ry: ey,
            duration: edgeDuration * (1 - rampFrac),
            ease: decelEase,
            onUpdate: () => applyTransform(obj.rx, obj.ry),
            onComplete: () => {
              edgeIdx = (edgeIdx + 1) % edges.length;
              runEdge();
            },
          });
        },
      });
    }

    // Hover: add mouse-position offset on top of the running animation
    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const normX =  (e.clientX - rect.left)  / rect.width  - 0.5; // -0.5 → 0.5
      const normY =  (e.clientY - rect.top)    / rect.height - 0.5;
      hoverTween?.kill();
      hover.rx = -normY * hoverMax * 2;
      hover.ry =  normX * hoverMax * 2;
      applyTransform(obj.rx, obj.ry); // immediate feedback
    };

    const onMouseLeave = () => {
      hoverTween?.kill();
      hoverTween = gsap.to(hover, {
        rx: 0, ry: 0,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => applyTransform(obj.rx, obj.ry),
      });
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    const startTimer = setTimeout(runEdge, 100);

    return () => {
      alive = false;
      clearTimeout(startTimer);
      tween?.kill();
      hoverTween?.kill();
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

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
            <div className="hidden lg:flex justify-center lg:justify-end">
              <div className="w-full max-w-sm h-[28rem] transform rotate-3">
                <div ref={slideCardRef} className="k-card-container w-full h-full overflow-hidden">
                  <div className="k-card-content-area p-0 h-full relative">
                    {BUILD_IMAGES.map((src, i) => (
                      <img
                        key={src}
                        ref={el => { slideImgRefs.current[i] = el; }}
                        {...photoProps(src, '24rem')}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          opacity: i === 0 ? 1 : 0,
                          transition: 'opacity 0.8s ease-in-out',
                        }}
                      />
                    ))}
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
