import { Link } from 'react-router-dom';
import { AnimatedHole } from '../components/AnimatedHole';
import { BuildWall } from '../components/BuildWall';
import { HomeHero } from '../components/HomeHero';
import { MessageComposer } from '../components/MessageComposer';
import { builds } from '../data/builds';

interface HomePageProps {
  isDark: boolean;
  overflowXHiddenClass?: string;
}

export const HomePage: React.FC<HomePageProps> = () => (
  <div className="overflow-x-clip">
    <HomeHero />

    <section id="boards" aria-labelledby="boards-title" className="mx-auto max-w-[82.5rem] scroll-mt-20 px-5 py-20 md:px-9 md:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="boards-title" className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-none text-bone">
            the boards
          </h2>
          <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ash">
            every keyboard i've built, with its photos, its parts and how it sounds.
          </p>
        </div>
        <Link to="/builds" className="font-mono text-sm text-ash underline decoration-line underline-offset-4 transition-colors hover:text-bone">
          all {builds.length} builds
        </Link>
      </div>
      <BuildWall builds={builds} />
    </section>

    <section aria-label="say hi" className="relative px-5 pt-16 md:px-9 md:pt-24">
      <div className="relative z-10 mx-auto max-w-[82.5rem]">
        <MessageComposer />
      </div>
      {/* The board floats over the hole; the hole tucks up under it. */}
      <div className="relative z-0 -mx-5 -mt-[14vw] md:-mx-9">
        <AnimatedHole />
      </div>
    </section>
  </div>
);
