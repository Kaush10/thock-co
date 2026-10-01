import { GlobeBanner } from '../components/GlobeBanner';
import { RequestBuilder } from '../components/RequestBuilder';
import { siteConfig } from '../config/siteConfig';
import { LedText } from '../system';

const STEPS = [
  { title: "tell me what you're after", body: 'press a few keys, add anything else, and send it.' },
  { title: 'we talk it through', body: "if it's one i'd want to build, we work out parts, mods and timing." },
  { title: 'i quote it, then build it', body: 'a price before anything is ordered, and a sound test when it’s done.' },
];

const QUESTIONS = [
  {
    q: 'do you take commissions?',
    a: "not on a schedule, and there's no order form. send a request with what you've got and the sound you're after. if it's something i can take on, i'll quote it.",
  },
  {
    q: 'can you just mod or tune my board?',
    a: 'often, yes: lubing switches, tuning stabilizers, foam and tape mods. tell me what you have.',
  },
  {
    q: 'where are you?',
    a: "champaign, illinois. handing a board over in person is easiest. shipping works too, but you'd cover it both ways.",
  },
  {
    q: "i'm new to custom keyboards. should i still ask?",
    a: "yes. even if i can't build it, i'm happy to point you at parts.",
  },
];

/** The bench status as a two-line LED sign: the inbox is always lit, the bench only when it's open. */
function StatusSign() {
  const benchOpen = siteConfig.bench === 'open';
  return (
    <figure>
      <div className="led-screen space-y-1.5">
        <LedText text="inbox open" cols={60} tone="lit" />
        <LedText text={benchOpen ? 'bench open' : 'bench full'} cols={60} tone={benchOpen ? 'lit' : 'idle'} />
      </div>
      <figcaption className="t-small mt-3 text-ash">
        {benchOpen ? "i'm taking a build or two right now." : "new builds wait for a free bench. messages don't."}
      </figcaption>
    </figure>
  );
}

/** How a commission goes, as a vertical track: three stops joined by a dotted line. */
function Steps() {
  return (
    <ol className="space-y-6">
      {STEPS.map((step, i) => (
        <li key={step.title} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4">
          {i < STEPS.length - 1 && (
            <span aria-hidden className="absolute bottom-[-1.25rem] left-[1.0625rem] top-11 w-0.5 bg-[radial-gradient(circle,#46464b_1px,transparent_1.4px)] bg-[length:2px_6px]" />
          )}
          <span
            aria-hidden
            className={`grid size-9 place-items-center rounded-full bg-panel font-display text-base text-bone ${
              i === 0 ? 'shadow-[0_0_0_1.5px_var(--signal),0_0_16px_rgba(255,0,170,0.35)]' : 'shadow-[0_0_0_1px_rgba(255,255,255,0.14)]'
            }`}
          >
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="t-body text-bone">{step.title}</h3>
            <p className="t-small mt-1 text-ash">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export const CommissionsPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[75rem] px-5 pb-24 pt-12 md:px-8 md:pt-16">
    {/* what this is, and whether i'm building */}
    <header className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-20">
      <div className="scrim">
        <h1 className="t-title">commissions</h1>
        <p className="t-lead mt-5 max-w-[36rem]">
          thock&co. isn't a shop. i build for other people now and then, when it's a board i'd want to
          build anyway. there's no order form: tell me what you're after and i'll quote it.
        </p>
      </div>
      <StatusSign />
    </header>

    {/* the request, with how it works alongside */}
    <div className="mt-14 grid gap-12 border-t border-line pt-12 md:mt-20 md:pt-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
      <aside aria-labelledby="steps-title" className="lg:sticky lg:top-24 lg:self-start">
        <div className="scrim">
          <h2 id="steps-title" className="t-subheading">how it works</h2>
          <div className="mt-6">
            <Steps />
          </div>
        </div>
        <figure className="mt-10 hidden flex-col items-center lg:flex">
          <GlobeBanner containerHeight={220} containerWidth={220} glowMarker={{ lat: 40.1106, lng: -88.2073 }} />
          <figcaption className="t-caption mt-1">based in champaign, illinois</figcaption>
        </figure>
      </aside>

      <section id="request" aria-labelledby="request-title" className="scroll-mt-24">
        <div className="scrim mb-6">
          <h2 id="request-title" className="t-heading">start a request</h2>
          <p className="t-body mt-2 text-ash">pick what fits and skip what doesn't. it writes the message for you.</p>
        </div>
        <RequestBuilder />
      </section>
    </div>

    <section aria-labelledby="questions-title" className="mt-20 border-t border-line pt-12 md:mt-24 md:pt-16">
      <h2 id="questions-title" className="t-heading scrim">questions</h2>
      <dl className="mt-8 grid gap-x-14 md:grid-cols-2">
        {QUESTIONS.map((item) => (
          <div key={item.q} className="scrim border-t border-line py-5">
            <dt className="t-body text-bone">{item.q}</dt>
            <dd className="t-small mt-1.5 max-w-[52ch] text-ash">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  </div>
);
