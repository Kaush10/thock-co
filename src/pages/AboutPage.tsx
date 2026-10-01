import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { instagramUrl, siteConfig } from '../config/siteConfig';
import { builds } from '../data/builds';
import { Ledger, Panel } from '../system';

const LINKS = [
  { label: 'instagram', href: instagramUrl, icon: Instagram },
  { label: 'youtube', href: 'https://youtube.com/@kaushme', icon: Youtube },
  { label: 'linkedin', href: 'https://linkedin.com/in/kaushrajesh', icon: Linkedin },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto grid w-full max-w-[82.5rem] gap-14 px-5 pb-28 pt-12 md:px-9 md:pt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
      <div>
        <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] font-normal leading-[0.92] text-bone">about</h1>
        <div className="mt-9 max-w-[62ch] space-y-6 text-[clamp(1.05rem,1.3vw,1.1875rem)] leading-[1.75] text-bone/85">
          <p>hey there, i'm kaush.</p>
          <p>
            i started building custom mechanical keyboards when i was 17. at the time, the difference in
            sound and feel from a prebuilt was mind-blowing, and i was completely captivated by the
            tinkering. i've since fallen for the sensory side of every switch, from the deep thock of a
            heavy linear to the crisp bump of a tactile. to me, a keyboard isn't just a tool; it's a
            personal extension of your craft.
          </p>
          <p>
            thock&co. is where that lives. every board here is one i built for myself: a new
            combination of parts, and a new puzzle in how to make it sound a certain way, whether that's
            foam, tape, or carefully tuned stabilizers. once in a while, i build one for someone else
            too.
          </p>
        </div>
      </div>

      <aside className="lg:pt-6">
        <Panel className="!p-7">
          <Ledger
            rows={[
              ['started', 'at 17'],
              ['boards built', String(builds.length)],
              ['based in', 'champaign, il'],
              ['bench', siteConfig.bench === 'open' ? 'open' : 'full'],
            ]}
          />
        </Panel>
        <div className="mt-6 flex flex-wrap gap-4">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="keycap"
              data-variant="dark"
              data-align="label"
              style={{ '--u': '3.5rem' } as React.CSSProperties}
            >
              <span className="inline-flex items-center gap-2.5">
                <Icon size={18} aria-hidden /> {label}
              </span>
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
};
