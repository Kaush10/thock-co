import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Build } from '../data/builds';
import { useTilt } from '../hooks/useTilt';
import { photoProps } from '../lib/photo';

/** One board on the wall: its photo with a nameplate, leaning toward the pointer. */
function BuildTile({ build, large, layout, sizes }: { build: Build; large: boolean; layout: string; sizes: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useTilt(ref, 'subtle');
  return (
    <Link
      ref={ref}
      to={`/builds/${build.slug}`}
      className={`group relative block overflow-hidden rounded-stage bg-surface shadow-[0_0_0_1px_var(--line)] ${layout}`}
    >
      <img
        {...photoProps(build.image, sizes)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:p-5">
        <h3 className={`${large ? 't-heading' : 't-subheading'} !text-white/60`}>{build.title}</h3>
        <span className="t-caption shrink-0 !text-bone/70">{build.built}</span>
      </div>
    </Link>
  );
}

/**
 * The boards as a photo wall: the first is large, the rest fill around it.
 * Two columns on phones, with the first spanning both.
 */
export function BuildWall({ builds }: { builds: Build[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:auto-rows-[minmax(11rem,1fr)] md:grid-cols-6 md:gap-4">
      {builds.map((build, i) => {
        const feature = i === 0;
        // On phones an odd tile out takes the full row rather than leaving a hole.
        const wide = i === builds.length - 1 && builds.length % 2 === 0;
        return (
          <BuildTile
            key={build.slug}
            build={build}
            large={feature}
            sizes={feature ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 30vw, 50vw'}
            layout={
              feature
                ? 'col-span-2 aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto'
                : `${wide ? 'col-span-2 aspect-[2/1]' : 'aspect-[4/5]'} md:col-span-2 md:aspect-[4/3]`
            }
          />
        );
      })}
    </div>
  );
}

/**
 * The home page's wall, sized to fit on one screen. On desktop: five columns
 * by two short rows, the first board large and the last one tall. On phones:
 * a row you swipe through.
 */
export function BuildWallCompact({ builds }: { builds: Build[] }) {
  const last = builds.length - 1;
  return (
    <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-flow-dense md:grid-cols-5 md:grid-rows-[repeat(2,clamp(8.5rem,25vh,14rem))] md:gap-4 md:overflow-visible md:p-0">
      {builds.map((build, i) => (
        <BuildTile
          key={build.slug}
          build={build}
          large={i === 0}
          sizes={i === 0 ? '(min-width: 768px) 40vw, 75vw' : '(min-width: 768px) 20vw, 75vw'}
          layout={`aspect-[4/5] w-[72%] shrink-0 snap-start md:aspect-auto md:w-auto ${
            i === 0 ? 'md:col-span-2 md:row-span-2' : i === last ? 'md:col-start-5 md:row-span-2 md:row-start-1' : ''
          }`}
        />
      ))}
    </div>
  );
}
