import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Build } from '../data/builds';
import { useTilt } from '../hooks/useTilt';
import { photoProps } from '../lib/photo';

/** One board on the wall: its photo with a nameplate, leaning toward the pointer. */
function BuildTile({ build, feature, wide }: { build: Build; feature: boolean; wide: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useTilt(ref, 'subtle');
  return (
    <Link
      ref={ref}
      to={`/builds/${build.slug}`}
      className={`group relative block overflow-hidden rounded-stage bg-surface shadow-[0_0_0_1px_var(--line)] ${
        feature ? 'col-span-2 aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto' : `${wide ? 'col-span-2 aspect-[2/1]' : 'aspect-[4/5]'} md:col-span-2 md:aspect-[4/3]`
      }`}
    >
      <img
        {...photoProps(build.image, feature ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 30vw, 50vw')}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:p-5">
        <h3 className={`${feature ? 't-heading' : 't-subheading'} !text-white/60`}>
          {build.title}
        </h3>
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
    <div className="grid grid-cols-2 gap-3 md:gap-4 md:auto-rows-[minmax(11rem,1fr)] md:grid-cols-6">
      {builds.map((build, i) => (
        <BuildTile
          key={build.slug}
          build={build}
          feature={i === 0}
          // On phones an odd tile out takes the full row rather than leaving a hole.
          wide={i === builds.length - 1 && builds.length % 2 === 0}
        />
      ))}
    </div>
  );
}
