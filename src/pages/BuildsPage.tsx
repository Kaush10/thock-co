import { BuildWall } from '../components/BuildWall';
import { builds } from '../data/builds';

export const BuildsPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[75rem] px-5 pb-24 pt-12 md:px-8 md:pt-16">
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="scrim">
        <h1 className="t-title">builds</h1>
        <p className="t-lead mt-4 max-w-[38ch] !text-ash">
          every keyboard i've built. open one for its photos, parts and sound test.
        </p>
      </div>
      <p className="t-caption">{builds.length} boards</p>
    </header>
    <BuildWall builds={builds} />
  </div>
);
