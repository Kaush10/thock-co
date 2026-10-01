import { MessageComposer } from '../components/MessageComposer';
import { GlobeBanner } from '../components/GlobeBanner';
import { Panel } from '../system';

const STEPS = [
  {
    title: 'tell me what you have in mind',
    body: "the board, any parts you already have, and the sound you're after.",
  },
  {
    title: 'we talk it through',
    body: "if it's one i'd want to build, we work out the parts, mods and timing together.",
  },
  {
    title: 'i quote it, then build it',
    body: 'you get a price before anything is ordered, and a sound test of the finished board.',
  },
];

const QUESTIONS = [
  {
    q: 'do you take commissions?',
    a: "not on a schedule, and there's no order form. if you have a board in mind, message me with what you've got and the sound you're after. if it's something i can take on, i'll quote it.",
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

export const CommissionsPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[75rem] px-5 pb-24 pt-12 md:px-8 md:pt-16">
    <header className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-20">
      <div>
        <h1 className="t-title">commissions</h1>
        <p className="t-lead mt-6 max-w-[34rem]">
          thock&co. isn't a shop. i build for other people now and then, when the idea is one i'd want to
          build anyway.
        </p>
        <p className="t-body mt-3 max-w-[34rem] text-ash">have something in mind? message me below for a quote.</p>
      </div>
      <figure className="hidden flex-col items-center md:flex">
        <GlobeBanner containerHeight={280} containerWidth={280} glowMarker={{ lat: 40.1106, lng: -88.2073 }} />
        <figcaption className="t-caption mt-1">based in champaign, illinois</figcaption>
      </figure>
    </header>

    <section aria-labelledby="steps-title" className="mt-16 md:mt-20">
      <h2 id="steps-title" className="t-heading">how it usually goes</h2>
      <ol className="mt-7 grid gap-3 md:grid-cols-3 md:gap-4">
        {STEPS.map((step, i) => (
          <li key={step.title}>
            {/* On phones the number sits beside the step; from md up it heads the panel. */}
            <Panel className="grid h-full grid-cols-[2.25rem_minmax(0,1fr)] md:block">
              <span aria-hidden className="t-subheading row-span-2 !text-ash">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-body text-bone md:mt-4">{step.title}</h3>
              <p className="t-small mt-1.5 text-ash">{step.body}</p>
            </Panel>
          </li>
        ))}
      </ol>
    </section>

    <section aria-label="send a message" className="mt-16 md:mt-20">
      <MessageComposer withKeyboard={false} />
    </section>

    <section aria-labelledby="questions-title" className="mt-16 md:mt-24">
      <h2 id="questions-title" className="t-heading">questions</h2>
      <dl className="mt-7 grid gap-x-14 gap-y-8 border-t border-line pt-8 md:grid-cols-2">
        {QUESTIONS.map((item) => (
          <div key={item.q}>
            <dt className="t-body text-bone">{item.q}</dt>
            <dd className="t-small mt-2 max-w-[44ch] text-ash">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  </div>
);
