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

    <section id="boards" aria-labelledby="boards-title" className="mx-auto max-w-[75rem] scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="scrim">
          <h2 id="boards-title" className="t-heading">
            the boards
          </h2>
          <p className="t-body mt-3 max-w-[46ch] text-ash">
            every keyboard i've built, with its photos, its parts and how it sounds.
          </p>
        </div>
        <Link to="/builds" className="t-small text-ash underline decoration-white/20 underline-offset-4 transition-colors hover:text-bone">
          all {builds.length} builds
        </Link>
      </div>
      <BuildWall builds={builds} />
    </section>

    <section aria-labelledby="say-hi-title" className="relative px-5 pt-16 md:px-8 md:pt-24">
      <div className="scrim relative z-10 mx-auto mb-10 max-w-[36rem] text-center md:mb-12">
        <h2 id="say-hi-title" className="t-heading">
          say hi
        </h2>
        <p className="t-body mt-3 text-ash">
          anything you type shows up on the display, and goes to me as an email or a dm. after a
          commission?{' '}
          <Link to="/commissions" className="text-bone underline decoration-white/25 underline-offset-4 hover:decoration-signal">
            start a request
          </Link>
          .
        </p>
      </div>
      <div className="relative z-10 mx-auto max-w-[75rem]">
        <MessageComposer />
      </div>
      {/* The board floats over the hole; the hole tucks up under it. */}
      <div className="relative z-0 -mx-5 -mt-[16vw] md:-mx-8">
        <AnimatedHole />
      </div>
    </section>
  </div>
);
