import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Build } from '../data/builds';
import { useTilt } from '../hooks/useTilt';
import { photoProps } from '../lib/photo';

/** One board on the wall: its photo with a nameplate, leaning toward the pointer. */
function BuildTile({ build, feature }: { build: Build; feature: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useTilt(ref, 'subtle');
  return (
    <Link
      ref={ref}
      to={`/builds/${build.slug}`}
      className={`group relative block overflow-hidden rounded-stage bg-surface shadow-[0_0_0_1px_var(--line)] ${
        feature ? 'aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto' : 'aspect-[4/3] md:col-span-2'
      }`}
    >
      <img
        {...photoProps(build.image, feature ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 30vw, 100vw')}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
        <h3 className={`font-display font-normal leading-[0.95] text-bone ${feature ? 'text-[clamp(2rem,4vw,3.5rem)]' : 'text-[clamp(1.5rem,2.2vw,2rem)]'}`}>
          {build.title}
        </h3>
        <span className="shrink-0 font-mono text-label text-bone/70">built {build.built}</span>
      </div>
    </Link>
  );
}

/**
 * The boards as a photo wall: the first is large, the rest fill around it.
 * One column on phones.
 */
export function BuildWall({ builds }: { builds: Build[] }) {
  return (
    <div className="grid gap-4 md:auto-rows-[minmax(13rem,1fr)] md:grid-cols-6 md:gap-5">
      {builds.map((build, i) => (
        <BuildTile key={build.slug} build={build} feature={i === 0} />
      ))}
    </div>
  );
}
