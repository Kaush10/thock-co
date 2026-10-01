import { GlobeBanner } from '../components/GlobeBanner';
import { RequestBuilder } from '../components/RequestBuilder';
import { siteConfig } from '../config/siteConfig';
import { LedText } from '../system';

const STEPS = [
  { title: "tell me what you're after", body: 'press a few keys below, add anything else, and send it.' },
  { title: 'we talk it through', body: "if it's one i'd want to build, we work out the parts, mods and timing together." },
  { title: 'i quote it, then build it', body: "you get a price before anything is ordered, and a sound test of the finished board." },
];

const QUESTIONS = [
  {
    q: 'do you take commissions?',
    a: "not on a schedule, and there's no order form. if you have a board in mind, send a request with what you've got and the sound you're after. if it's something i can take on, i'll quote it.",
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
        {benchOpen
          ? "i'm taking a build or two right now."
          : "the bench is full, so new builds wait. messages don't: i read every one."}
      </figcaption>
    </figure>
  );
}

export const CommissionsPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[75rem] px-5 pb-24 pt-12 md:px-8 md:pt-16">
    <header className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-20">
      <div className="scrim">
        <h1 className="t-title">commissions</h1>
        <p className="t-lead mt-6 max-w-[36rem]">
          thock&co. isn't a shop. i build for other people now and then, when it's a board i'd want to
          build anyway. there's no order form: tell me what you're after and i'll quote it.
        </p>
      </div>
      <StatusSign />
    </header>

    <section aria-labelledby="steps-title" className="mt-16 md:mt-24">
      <h2 id="steps-title" className="sr-only">how it works</h2>
      <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="scrim">
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className={`grid size-10 shrink-0 place-items-center rounded-full bg-panel font-display text-lg text-bone ${
                  i === 0 ? 'shadow-[0_0_0_1.5px_var(--signal),0_0_18px_rgba(255,0,170,0.35)]' : 'shadow-[0_0_0_1px_rgba(255,255,255,0.14)]'
                }`}
              >
                {i + 1}
              </span>
              {i < STEPS.length - 1 && <span aria-hidden className="leader hidden !transform-none md:block" />}
            </div>
            <h3 className="t-body mt-4 text-bone">{step.title}</h3>
            <p className="t-small mt-1 max-w-[34ch] text-ash">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>

    <section id="request" aria-labelledby="request-title" className="mt-16 scroll-mt-24 md:mt-20">
      <div className="scrim mb-7">
        <h2 id="request-title" className="t-heading">start a request</h2>
        <p className="t-body mt-3 max-w-[52ch] text-ash">
          pick what fits; skip what doesn't. it writes the message for you.
        </p>
      </div>
      <RequestBuilder />
    </section>

    <section aria-labelledby="questions-title" className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
      <div className="scrim self-start">
        <h2 id="questions-title" className="t-heading">questions</h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {QUESTIONS.map((item) => (
            <div key={item.q} className="grid gap-2 py-5 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8">
              <dt className="t-body text-bone">{item.q}</dt>
              <dd className="t-small max-w-[52ch] text-ash md:pt-0.5">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className="hidden flex-col items-center self-center lg:flex">
        <GlobeBanner containerHeight={280} containerWidth={280} glowMarker={{ lat: 40.1106, lng: -88.2073 }} />
        <figcaption className="t-caption mt-1">based in champaign, illinois</figcaption>
      </figure>
    </section>
  </div>
);
