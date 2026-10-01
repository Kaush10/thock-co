import { useEffect, useRef } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

// Renders the "hole" — a funnel of rings with particles rising out of it.
// Styling for the wrapper, aura and overlay lives under `a-hole` in globals.css.

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-hole': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

type Disc = { x: number; y: number; w: number; h: number; p: number };
type Point = { x: number; y: number };
type Particle = { x: number; sx: number; dx: number; y: number; vy: number; r: number; c: string };

type Palette = {
  line: string;
  particle: (opacity: number) => string;
  gradient: [string, string];
};

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    line: '#444',
    particle: (o) => `rgba(255,255,255,${o})`,
    gradient: ['#000', '#1a002a'],
  },
  light: {
    line: '#7C4B2A',
    particle: (o) => `rgba(124,75,42,${o})`,
    gradient: ['#fff', '#f5e9e2'],
  },
};

const TOTAL_DISCS = 100;
const TOTAL_LINES = 100;
const TOTAL_PARTICLES = 100;

const lerp = (start: number, end: number, p: number) => start + (end - start) * p;
const easeInExpo = (p: number) => (p === 0 ? 0 : Math.pow(2, 10 * p - 10));

function createHole(host: HTMLElement, canvas: HTMLCanvasElement, palette: Palette) {
  const ctx = canvas.getContext('2d')!;
  let width = 0;
  let height = 0;
  let dpi = 1;
  let startDisc: Disc;
  let endDisc: Disc;
  let discs: Disc[] = [];
  let clipDisc: Disc;
  let clipPath = new Path2D();
  let linesCanvas: OffscreenCanvas;
  let particles: Particle[] = [];
  let area = { sx: 0, sw: 0, ex: 0, ew: 0, h: 0 };

  const tweenDisc = (disc: Disc) => {
    disc.x = lerp(startDisc.x, endDisc.x, disc.p);
    disc.y = lerp(startDisc.y, endDisc.y, easeInExpo(disc.p));
    disc.w = lerp(startDisc.w, endDisc.w, disc.p);
    disc.h = lerp(startDisc.h, endDisc.h, disc.p);
    return disc;
  };

  const initParticle = (start: boolean): Particle => {
    const sx = area.sx + area.sw * Math.random();
    const ex = area.ex + area.ew * Math.random();
    return {
      x: sx,
      sx,
      dx: ex - sx,
      y: start ? area.h * Math.random() : area.h,
      vy: 0.5 + Math.random(),
      r: 0.5 + Math.random() * 4,
      c: palette.particle(Math.random()),
    };
  };

  const layout = () => {
    const rect = host.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpi = window.devicePixelRatio;
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    startDisc = { x: width * 0.5, y: height * 0.45, w: width * 0.75, h: height * 0.7, p: 0 };
    endDisc = { x: width * 0.5, y: height * 0.95, w: 0, h: 0, p: 1 };

    // The clip disc is the last ring whose bottom edge still moves upward;
    // everything inside it reads as "down the hole".
    discs = [];
    let prevBottom = height;
    clipDisc = tweenDisc({ x: 0, y: 0, w: 0, h: 0, p: 0 });
    for (let i = 0; i < TOTAL_DISCS; i++) {
      const disc = tweenDisc({ x: 0, y: 0, w: 0, h: 0, p: i / TOTAL_DISCS });
      const bottom = disc.y + disc.h;
      if (bottom <= prevBottom) clipDisc = { ...disc };
      prevBottom = bottom;
      discs.push(disc);
    }
    clipPath = new Path2D();
    clipPath.ellipse(clipDisc.x, clipDisc.y, clipDisc.w, clipDisc.h, 0, 0, Math.PI * 2);
    clipPath.rect(clipDisc.x - clipDisc.w, 0, clipDisc.w * 2, clipDisc.y);

    // Radial lines are static, so draw them once to an offscreen canvas.
    const lines: Point[][] = Array.from({ length: TOTAL_LINES }, () => []);
    const step = (Math.PI * 2) / TOTAL_LINES;
    for (const disc of discs) {
      for (let i = 0; i < TOTAL_LINES; i++) {
        lines[i].push({
          x: disc.x + Math.cos(i * step) * disc.w,
          y: disc.y + Math.sin(i * step) * disc.h,
        });
      }
    }
    linesCanvas = new OffscreenCanvas(Math.max(1, width), Math.max(1, height));
    const lctx = linesCanvas.getContext('2d')!;
    lctx.strokeStyle = palette.line;
    lctx.lineWidth = 2;
    for (const line of lines) {
      lctx.save();
      let inside = false;
      for (let j = 1; j < line.length; j++) {
        const p0 = line[j - 1];
        const p1 = line[j];
        if (!inside && (lctx.isPointInPath(clipPath, p1.x, p1.y) || lctx.isPointInStroke(clipPath, p1.x, p1.y))) {
          inside = true;
        } else if (inside) {
          lctx.clip(clipPath);
        }
        lctx.beginPath();
        lctx.moveTo(p0.x, p0.y);
        lctx.lineTo(p1.x, p1.y);
        lctx.stroke();
      }
      lctx.restore();
    }

    area = { sw: clipDisc.w * 0.5, ew: clipDisc.w * 2, h: height * 0.85, sx: 0, ex: 0 };
    area.sx = (width - area.sw) / 2;
    area.ex = (width - area.ew) / 2;
    particles = Array.from({ length: TOTAL_PARTICLES }, () => initParticle(true));
  };

  const step = () => {
    for (const disc of discs) {
      disc.p = (disc.p + 0.001) % 1;
      tweenDisc(disc);
    }
    for (const particle of particles) {
      particle.x = particle.sx + particle.dx * (1 - particle.y / area.h);
      particle.y -= particle.vy;
      if (particle.y < 0) particle.y = area.h;
    }
  };

  const draw = () => {
    const w = canvas.width;
    const h = canvas.height;
    const gradient = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.1, w / 2, h / 2, Math.max(w, h) * 0.7);
    gradient.addColorStop(0, palette.gradient[0]);
    gradient.addColorStop(1, palette.gradient[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.scale(dpi, dpi);
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(startDisc.x, startDisc.y, startDisc.w, startDisc.h, 0, 0, Math.PI * 2);
    ctx.stroke();
    discs.forEach((disc, i) => {
      if (i % 5 !== 0) return;
      const clipped = disc.w < clipDisc.w - 5;
      if (clipped) {
        ctx.save();
        ctx.clip(clipPath);
      }
      ctx.beginPath();
      ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (clipped) ctx.restore();
    });
    ctx.drawImage(linesCanvas, 0, 0);
    ctx.save();
    ctx.clip(clipPath);
    for (const particle of particles) {
      ctx.fillStyle = particle.c;
      ctx.fillRect(particle.x, particle.y, particle.r, particle.r);
    }
    ctx.restore();
    ctx.restore();
  };

  return { layout, step, draw };
}

export const AnimatedHole: React.FC = () => {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useSiteConfig();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const hole = createHole(host, canvas, PALETTES[isDark ? 'dark' : 'light']);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = true;

    const loop = () => {
      hole.step();
      hole.draw();
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion) hole.draw();
      else if (visible) frame = requestAnimationFrame(loop);
    };

    hole.layout();
    hole.draw();
    play();

    const resizeObserver = new ResizeObserver(() => {
      hole.layout();
      hole.draw();
    });
    resizeObserver.observe(host);

    // No point animating while it's scrolled out of view.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    intersectionObserver.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [isDark]);

  return (
    <div className="relative w-full" style={{ aspectRatio: '4 / 1', height: 'auto', minHeight: '200px', maxHeight: '600px' }}>
      <a-hole ref={hostRef}>
        <canvas ref={canvasRef} className="js-canvas" />
        <div className="aura" />
        <div className="overlay" />
      </a-hole>
    </div>
  );
};
