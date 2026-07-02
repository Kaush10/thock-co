import React, { useRef, useEffect, useState } from 'react'; // useState kept for theme/bgColor
// Returns 'dark' or 'light' based on current system or browser theme
function getCurrentTheme() {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}
import { articles } from '../data/articles';

// Gallery config (match pen and stuff spec)
const ITEM_COUNT = 10;
const ITEM_SIZE = 155;
const GAP = 0.20; // percent of item size
const RADIUS = Math.round((ITEM_SIZE + ITEM_SIZE * GAP) / (2 * Math.sin(Math.PI / ITEM_COUNT)));
const CONTAINER_WIDTH = 240;
const CONTAINER_HEIGHT = 680;
const BORDER_RADIUS = 12;

export const VerticalGallery: React.FC = () => {
  // Theme-aware background (self-contained, no external CSS)
  const [theme, setTheme] = useState(getCurrentTheme());
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const carouselRef = useRef<HTMLUListElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    let running = true;
    const animate = () => {
      angleRef.current = (angleRef.current + 0.08) % 360;
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateX(${angleRef.current}deg)`;
      }
      if (running) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, []);


  // Dynamically get parent or body background color
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState('#fff');
  useEffect(() => {
    const getBg = () => {
      let el = containerRef.current?.parentElement || document.body;
      let bg = getComputedStyle(el).getPropertyValue('background-color');
      setBgColor(bg || '#fff');
    };
    getBg();
    const observer = new MutationObserver(getBg);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    return () => observer.disconnect();
  }, []);


  // Shadow overlay (theme-aware)
  const shadowOverlay = (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        borderRadius: BORDER_RADIUS,
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.65) 100%)',
        zIndex: 2,
      }}
    />
  );

  // Shine is now applied per-item (see inside the <li>) so it only
  // lights the image tiles and never bleeds into the gaps between them.

  // Carousel items — cycle through available articles to fill the wheel.
  // Once enough real builds exist this naturally becomes a straight slice.
  const filledImages = articles.length > 0
    ? Array.from({ length: ITEM_COUNT }, (_, i) => articles[i % articles.length])
    : Array.from({ length: ITEM_COUNT }, (_, i) => ({
        image: null, title: null, isPlaceholder: true, key: `placeholder-${i}`
      }));
  const itemAngle = 360 / ITEM_COUNT;

  return (
    <div className="w-full flex justify-center items-center pb-6">
      <div className="relative w-fit h-fit flex items-center justify-center">
        {/* Background shape */}
        <div
          className="rounded-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 280, height: 760 }}
        />
        {/* Main gallery container */}
        <div
          ref={containerRef}
          className="relative z-40 flex items-center justify-center"
          style={{
            width: '100%',
            minWidth: 340,
            maxWidth: 480,
            height: CONTAINER_HEIGHT,
            overflow: 'hidden',
            borderRadius: BORDER_RADIUS,
            background: bgColor,
            maskImage: `linear-gradient(to bottom, transparent 0%, ${bgColor === 'rgb(24, 28, 36)' ? 'black' : 'white'} 14%, ${bgColor === 'rgb(24, 28, 36)' ? 'black' : 'white'} 86%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, ${bgColor === 'rgb(24, 28, 36)' ? 'black' : 'white'} 14%, ${bgColor === 'rgb(24, 28, 36)' ? 'black' : 'white'} 86%, transparent 100%)`,
          }}
        >
          {/* Carousel */}
          <div className="carousel-container" style={{ position: 'absolute', inset: 0, perspective: 1200, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <ul
              className="carousel"
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'block',
                transform: 'none',
                transformStyle: 'preserve-3d',
                margin: 0,
                padding: 0,
                listStyle: 'none',
                pointerEvents: 'auto',
              }}
            >
              {filledImages.map((img, i) => {
                // Add +90° offset so images are fully visible at the vertical center
                const relAngle = ((i * itemAngle - angle + 90 + 540) % 360) - 180;
                const transform = `translate(-50%, -50%) rotateX(${relAngle}deg) translateZ(${RADIUS}px)`;
                // Only show images within ±90° of the front (viewer)
                const fadeZone = 30; // degrees to start fading
                let opacity = 0;
                let pointerEvents = 'none';
                if (Math.abs(relAngle) <= 90) {
                  pointerEvents = 'auto';
                  if (Math.abs(relAngle) > 90 - fadeZone) {
                    opacity = Math.max(0, (90 - Math.abs(relAngle)) / fadeZone);
                  } else {
                    opacity = 1;
                  }
                }
                return (
                  <li
                    key={`item-${i}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '65%',
                      height: '65%',
                      minWidth: 100,
                      minHeight: 130,
                      maxWidth: 220,
                      maxHeight: 180,
                      borderRadius: BORDER_RADIUS,
                      overflow: 'hidden',
                      background: img.isPlaceholder ? '#23272f' : 'var(--c-bg, #fff)',
                      filter: img.isPlaceholder ? 'none' : 'brightness(0.95) saturate(0.9)',
                      transform,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                      transition: 'opacity 0.3s, box-shadow 0.3s',
                      opacity,
                      pointerEvents: pointerEvents as React.CSSProperties['pointerEvents'],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {img.isPlaceholder ? (
                      <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 500, textAlign: 'center' }}>your build here</h2>
                    ) : (
                      <img
                        src={img.image}
                        alt={img.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    {/* Per-item spotlight — stays on the tile, never bleeds into gaps */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.21) 0%, transparent 70%)',
                      mixBlendMode: 'screen',
                      zIndex: 2,
                    }} />
                  </li>
                );
              })}
            </ul>
          </div>
          {/* overlays removed for debug */}
        </div>
      </div>
    </div>
  );
};

export default VerticalGallery;
