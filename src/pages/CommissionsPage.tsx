import { useState } from 'react';
import { MessageComposer } from '../components/MessageComposer';
import { GlobeBanner } from '../components/GlobeBanner';
import { VerticalGallery } from '../components/VerticalGallery';

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

export const CommissionsPage: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-[82.5rem] px-5 pb-28 pt-12 md:px-9 md:pt-16">
      <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] font-normal leading-[0.92] text-bone">commissions</h1>
          <p className="mt-7 max-w-[42ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.7] text-bone/85">
            thock&co. isn't a shop. i build for other people now and then, when the idea is one i'd
            want to build anyway.
          </p>
          <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ash">
            have something in mind? message me below for a quote.
          </p>
        </div>
        <figure className="hidden flex-col items-center md:flex">
          <GlobeBanner containerHeight={380} containerWidth={380} glowMarker={{ lat: 40.1106, lng: -88.2073 }} />
          <figcaption className="mt-2 font-mono text-label text-ash">champaign, illinois</figcaption>
        </figure>
      </section>

      <section aria-label="say hi" className="mt-16 md:mt-20">
        <MessageComposer withKeyboard={false} />
      </section>

      <section aria-labelledby="questions-title" className="mt-24 grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
        <div className="hidden lg:block">
          <VerticalGallery />
        </div>
        <div>
          <h2 id="questions-title" className="font-display text-display-md font-normal text-bone">questions</h2>
          <ul className="mt-8 border-t border-line">
            {QUESTIONS.map((item, i) => (
              <li key={item.q} className="border-b border-line">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-mono text-[0.9375rem] text-bone transition-colors hover:text-white"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {item.q}
                  <span
                    aria-hidden
                    className="inline-block size-2 shrink-0 rounded-full transition-colors"
                    style={open === i ? { background: 'var(--signal)', boxShadow: '0 0 10px var(--signal)' } : { background: '#333336' }}
                  />
                </button>
                {open === i && <p className="max-w-[62ch] pb-6 text-[1.0625rem] leading-relaxed text-ash">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
