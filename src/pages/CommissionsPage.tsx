import { useState } from 'react';
import { Instagram, Mail, ChevronDown } from 'lucide-react';
import { GlobeBanner } from '../components/GlobeBanner';
import { VerticalGallery } from '../components/VerticalGallery';
import { emailUrl, instagramUrl, siteConfig } from '../config/siteConfig';
import '../components/KeyboardPageCard.css';

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
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
      <section className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold accent-text page-header">commissions</h1>
          <p className="text-lg leading-relaxed opacity-90 max-w-xl">
            thock&co. isn't a shop. i build for other people now and then, when the idea is one i'd
            want to build anyway.
          </p>
          <p className="flex items-center gap-3 text-base">
            <span aria-hidden className="inline-block size-2.5 rounded-full bg-[var(--interactive-highlight)] shadow-[0_0_10px_var(--interactive-highlight)]" />
            not taking orders. ideas are always welcome.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="glass-card inline-flex items-center gap-2 rounded-full px-5 py-3 hover:text-interactive transition-colors">
              <Instagram size={18} /> @{siteConfig.contact.instagram}
            </a>
            <a href={emailUrl} className="glass-card inline-flex items-center gap-2 rounded-full px-5 py-3 hover:text-interactive transition-colors">
              <Mail size={18} /> {siteConfig.contact.email}
            </a>
          </div>
          <p className="text-sm opacity-60">message me for a quote.</p>
        </div>
        <div className="hidden md:flex justify-center">
          <GlobeBanner containerHeight={360} containerWidth={360} glowMarker={{ lat: 40.1106, lng: -88.2073 }} />
        </div>
      </section>

      <section className="mt-24 grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="hidden lg:block">
          <VerticalGallery />
        </div>
        <div>
          <h2 className="mb-6 text-xl">questions</h2>
          <ul className="space-y-3">
            {QUESTIONS.map((item, i) => (
              <li key={item.q} className="glass-card rounded-2xl">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-semibold">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <p className="px-5 pb-5 opacity-85 leading-relaxed">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
