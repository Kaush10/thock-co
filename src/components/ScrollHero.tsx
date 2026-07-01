import { useEffect, useRef, useState } from 'react';
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

const BUILD_IMAGES = [
  '/article-images/azoth-cover.webp',
  '/article-images/Bauer™ Lite-cover.webp',
  '/article-images/neo-ergo-cover.webp',
  '/article-images/nuphy65-cover.webp',
  '/article-images/azoth-gmk-cover.webp',
  '/article-images/azoth-dev-cover.webp',
];

export const ScrollHero: React.FC<ScrollHeroProps> = ({ bodyText, isDark }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const componentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const slideCardRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const { handleCardClick } = useGlassCardEffect();

  useEffect(() => {
    // Page-level VanillaTilt init: covers all [data-tilt] elements on the home page,
    // including GlassCard instances in ScrollHeroTiers (which have no init of their own).
    // Note: the slideshow card intentionally has no data-tilt — it's driven by GSAP instead.
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (typeof VanillaTilt !== 'undefined') {
      if (isTouchDevice) {
        // On mobile: disable tilt and clickback
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: 0, // disables tilt and clickback
          speed: 500,
          perspective: 1800,
          glare: false,
          scale: 1,
          reset: true,
          reverse: true
        });
        // TODO: Add custom mobile tap/click animation here if desired
      } else {
        // On desktop: normal settings
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
    }
  }, []);

  useEffect(() => {
    let st: ScrollTrigger | undefined;
    let scrollTimeout: NodeJS.Timeout;

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

    const slowDuration = 3.5;  // edge sweep while image shows (tune this)
    const fastDuration = 0.9;  // edge sweep during image transition (tune this)

    let edgeIdx = 0;
    let isSlow = false; // top/bottom are short edges (fast), left/right are long edges (slow)
    let alive = true;
    let tween: gsap.core.Tween | null = null;
    let hoverTween: gsap.core.Tween | null = null;

    // Start at TL corner
    const obj = { rx: -max, ry: -max };
    applyTransform(obj.rx, obj.ry);

    function runEdge() {
      if (!alive) return;
      const [ex, ey] = edges[edgeIdx];

      // Image changes at the START of each fast (transition) sweep
      if (!isSlow) {
        setSlideIdx(prev => (prev + 1) % BUILD_IMAGES.length);
      }

      tween = gsap.to(obj, {
        rx: ex,
        ry: ey,
        duration: isSlow ? slowDuration : fastDuration,
        ease: isSlow ? 'power2.out' : 'power2.in',
        onUpdate: () => applyTransform(obj.rx, obj.ry),
        onComplete: () => {
          edgeIdx = (edgeIdx + 1) % edges.length;
          isSlow = !isSlow;
          runEdge();
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

    // Trail: single solid pink bar tracing the card border via lineDash on a roundRect path.
    // Corners handled automatically. Glow clipped to border band via destination-out.
    const canvas = trailCanvasRef.current;
    const ctx = canvas?.getContext('2d') ?? null;
    const PINK      = '#ff00cc';
    const THICKNESS = 14;  // bar width in px
    const BAR_LEN   = 50;  // length of the solid bar along the perimeter
    const CARD_R    = 24;  // must match CSS border-radius

    // Maps current GSAP animation state → distance along the card perimeter (px).
    function perimDist(w: number, h: number, perim: number): number {
      const hw = THICKNESS / 2;
      const r  = Math.max(0, CARD_R - hw);
      const sw = (w - 2*hw) - 2*r;
      const sh = (h - 2*hw) - 2*r;
      const ca = (Math.PI * r) / 2;
      const segs  = [sw + ca, sh + ca, sw + ca, sh + ca];
      const cumul = [0, segs[0], segs[0]+segs[1], segs[0]+segs[1]+segs[2]];
      const norm  = (v: number) => Math.max(0, Math.min(1, (v + max) / (2 * max)));
      const e  = edgeIdx % 4;
      const ep = (e < 2) ? norm(e === 0 ? obj.ry : obj.rx)
                         : 1 - norm(e === 2 ? obj.ry : obj.rx);
      return (cumul[e] + ep * segs[e]) % perim;
    }

    // TRAIL DISABLED — canvas hidden in JSX, rAF never starts. Re-enable by removing the early return and unhiding the canvas.
    let rafId = 0;
    function drawTrail() {
      if (true) return; // disabled
      if (!alive || !canvas || !ctx) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const hw    = THICKNESS / 2;
      const r     = Math.max(0, CARD_R - hw);
      const pw    = w - 2 * hw;
      const ph    = h - 2 * hw;
      const perim = 2 * (pw + ph - 4 * r) + 2 * Math.PI * r;
      const dist  = perimDist(w, h, perim);

      const borderPath = new Path2D();
      borderPath.roundRect(hw, hw, pw, ph, r);

      ctx.save();
      ctx.strokeStyle = PINK;
      ctx.lineWidth   = THICKNESS;
      ctx.lineCap     = 'butt';
      ctx.shadowBlur  = 0;
      ctx.setLineDash([BAR_LEN, Math.max(1, perim - BAR_LEN)]);
      ctx.lineDashOffset = BAR_LEN - dist;
      ctx.stroke(borderPath);
      ctx.restore();

      // Clip from bleeding into the image interior
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      const innerPath = new Path2D();
      innerPath.roundRect(THICKNESS, THICKNESS, w - 2*THICKNESS, h - 2*THICKNESS, Math.max(0, CARD_R - THICKNESS));
      ctx.fill(innerPath);
      ctx.restore();

      rafId = requestAnimationFrame(drawTrail);
    }
    rafId = requestAnimationFrame(drawTrail);

    const startTimer = setTimeout(runEdge, 100);

    return () => {
      alive = false;
      clearTimeout(startTimer);
      cancelAnimationFrame(rafId);
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
                    {/* Trail canvas — disabled until border animation is finalised */}
                    <canvas ref={trailCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20, display: 'none' }} />
                    {BUILD_IMAGES.map((src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          opacity: i === slideIdx ? 1 : 0,
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
