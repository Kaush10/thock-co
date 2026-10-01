import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { builds } from '../data/builds';
import { photoProps } from '../lib/photo';
import { prefersReducedMotion } from '../lib/motion';
import { LedText } from '../system';

const INTRO = `to touch and to feel is deeply human. it's something i've always believed defines our connection to the world.

to me, a keyboard is the most personal interface we have with the digital world, and beyond that a sensory experience: a fusion of sound and feel.

thock&co. is where i keep the boards i've built: what went into each one, and what it sounds like.`;

const TYPE_MS = 2200; // the whole intro types out in about this long
const SLIDE_MS = 2500; // one edge of the card's tilt loop, one photo

/** Types `text` out once, in steps, the way an LED panel fills. */
function useTyped(text: string) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text.length : 0));
  useEffect(() => {
    if (shown >= text.length) return;
    const perStep = Math.max(1, Math.round(text.length / (TYPE_MS / 16)));
    const id = setInterval(() => setShown((n) => Math.min(text.length, n + perStep)), 16);
    return () => clearInterval(id);
    // Only start once; `shown` advancing shouldn't restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return shown;
}

/**
 * The tilting photo card: it traces the corners of a rectangle on a loop,
 * leans toward the pointer on hover, and swaps to the next board on each edge.
 */
function SlideCard({ onSlide }: { onSlide: (index: number) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const onSlideRef = useRef(onSlide);
  onSlideRef.current = onSlide;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (prefersReducedMotion()) {
      const id = setInterval(() => setIndex((i) => (i + 1) % builds.length), SLIDE_MS * 2);
      return () => clearInterval(id);
    }

    const perspective = 1800;
    const max = 9;
    const hoverMax = 7;
    const hover = { rx: 0, ry: 0 };
    const obj = { rx: -max, ry: -max };
    const edges: [number, number][] = [[-max, max], [max, max], [max, -max], [-max, -max]];
    const apply = () => {
      card.style.transform = `perspective(${perspective}px) rotateX(${obj.rx + hover.rx}deg) rotateY(${obj.ry + hover.ry}deg)`;
    };
    apply();

    let edge = 0;
    let alive = true;
    let tween: gsap.core.Tween | null = null;
    let hoverTween: gsap.core.Tween | null = null;

    const runEdge = () => {
      if (!alive) return;
      setIndex((i) => (i + 1) % builds.length);
      const [ex, ey] = edges[edge];
      const rampRx = obj.rx + (ex - obj.rx) * 0.12;
      const rampRy = obj.ry + (ey - obj.ry) * 0.12;
      tween = gsap.to(obj, {
        rx: rampRx, ry: rampRy, duration: (SLIDE_MS / 1000) * 0.25, ease: 'power2.in', onUpdate: apply,
        onComplete: () => {
          tween = gsap.to(obj, {
            rx: ex, ry: ey, duration: (SLIDE_MS / 1000) * 0.75, ease: 'power3.out', onUpdate: apply,
            onComplete: () => { edge = (edge + 1) % edges.length; runEdge(); },
          });
        },
      });
    };

    const onMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      hoverTween?.kill();
      hover.rx = -((event.clientY - rect.top) / rect.height - 0.5) * hoverMax * 2;
      hover.ry = ((event.clientX - rect.left) / rect.width - 0.5) * hoverMax * 2;
      apply();
    };
    const onLeave = () => {
      hoverTween?.kill();
      hoverTween = gsap.to(hover, { rx: 0, ry: 0, duration: 0.6, ease: 'power2.out', onUpdate: apply });
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    const start = setTimeout(runEdge, SLIDE_MS);

    return () => {
      alive = false;
      clearTimeout(start);
      tween?.kill();
      hoverTween?.kill();
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => onSlideRef.current(index), [index]);

  const build = builds[index];
  return (
    <Link to={`/builds/${build.slug}`} aria-label={`see ${build.title}`} className="block rounded-stage">
      <div
        ref={cardRef}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-stage bg-surface shadow-[0_0_0_1px_var(--line),0_40px_90px_rgba(0,0,0,0.6)] will-change-transform"
      >
        {builds.map((b, i) => (
          <img
            key={b.slug}
            {...photoProps(b.image, '(min-width: 1024px) 20rem, 90vw')}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
    </Link>
  );
}

export function HomeHero() {
  const shown = useTyped(INTRO);
  const [slide, setSlide] = useState(0);
  const done = shown >= INTRO.length;
  const paragraphs = INTRO.split('\n\n');

  // Split the reveal across paragraphs, keeping the unrevealed text in place
  // (transparent) so nothing reflows as it types.
  let offset = 0;
  const rendered = paragraphs.map((paragraph, p) => {
    const start = offset;
    offset += paragraph.length + 2;
    const visible = Math.max(0, Math.min(paragraph.length, shown - start));
    const typingHere = !done && shown >= start && shown < start + paragraph.length + 2;
    return (
      <p key={p}>
        {paragraph.slice(0, visible)}
        {(typingHere || (done && p === paragraphs.length - 1)) && (
          <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-signal shadow-[0_0_10px_var(--signal)] led-blink" />
        )}
        <span className="text-transparent">{paragraph.slice(visible)}</span>
      </p>
    );
  });

  const current = builds[slide];
  return (
    <section className="mx-auto grid max-w-[75rem] items-center gap-12 px-5 py-12 md:py-16 lg:min-h-[calc(100svh-4rem)] md:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-24">
      <div>
        <h1 className="t-display">thock&co.</h1>
        <div aria-hidden className="t-lead mt-7 max-w-[34rem] space-y-4">
          {rendered}
        </div>
        <p className="sr-only">{INTRO}</p>
        <a href="#boards" className="t-small mt-9 inline-flex items-center gap-3 text-ash transition-colors hover:text-bone">
          <span aria-hidden className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="led-chase block size-1 rounded-full bg-current" style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </span>
          see the boards
        </a>
      </div>

      <div className="mx-auto w-full max-w-[20rem] lg:mx-0 lg:justify-self-end">
        <SlideCard onSlide={setSlide} />
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1 rounded-md bg-panel p-2 shadow-[0_0_0_1px_var(--line)]">
            <LedText text={current.title} cols={60} />
          </div>
          <span className="t-caption tabular-nums">
            {String(slide + 1).padStart(2, '0')} / {String(builds.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
