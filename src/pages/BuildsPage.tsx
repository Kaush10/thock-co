import { BuildWall } from '../components/BuildWall';
import { builds } from '../data/builds';

export const BuildsPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[82.5rem] px-5 pb-28 pt-12 md:px-9 md:pt-16">
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] font-normal leading-[0.92] text-bone">builds</h1>
        <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ash">
          every keyboard i've built. open one for its photos, parts and sound test.
        </p>
      </div>
      <p className="font-mono text-sm text-ash">{builds.length} boards</p>
    </div>
    <BuildWall builds={builds} />
  </div>
);
