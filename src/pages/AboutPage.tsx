import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { instagramUrl, siteConfig } from '../config/siteConfig';
import { builds } from '../data/builds';
import { Ledger, Panel } from '../system';

const LINKS = [
  { label: 'instagram', href: instagramUrl, icon: Instagram },
  { label: 'youtube', href: 'https://youtube.com/@kaushme', icon: Youtube },
  { label: 'linkedin', href: 'https://linkedin.com/in/kaushrajesh', icon: Linkedin },
];

export const AboutPage: React.FC = () => (
  <div className="mx-auto grid w-full max-w-[75rem] gap-12 px-5 pb-24 pt-12 md:px-8 md:pt-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
    <div>
      <h1 className="t-title">about</h1>
      <div className="t-lead mt-7 max-w-[36rem] space-y-5">
        <p>hey there, i'm kaush.</p>
        <p>
          i started building custom mechanical keyboards when i was 17. at the time, the difference in
          sound and feel from a prebuilt was mind-blowing, and i was completely captivated by the
          tinkering. i've since fallen for the sensory side of every switch, from the deep thock of a
          heavy linear to the crisp bump of a tactile. to me, a keyboard isn't just a tool; it's a
          personal extension of your craft.
        </p>
        <p>
          thock&co. is where that lives. every board here is one i built for myself: a new combination
          of parts, and a new puzzle in how to make it sound a certain way, whether that's foam, tape,
          or carefully tuned stabilizers. once in a while, i build one for someone else too.
        </p>
      </div>
    </div>

    <aside className="lg:pt-3">
      <Panel className="!p-6">
        <Ledger
          rows={[
            ['started', 'at 17'],
            ['boards built', String(builds.length)],
            ['based in', 'champaign, il'],
            ['bench', siteConfig.bench === 'open' ? 'open' : 'full'],
          ]}
        />
      </Panel>
      <ul className="mt-5 flex flex-wrap gap-3">
        {LINKS.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noreferrer" className="keycap" data-variant="dark" data-align="label" style={{ '--u': '2.75rem' } as React.CSSProperties}>
              <span className="inline-flex items-center gap-2">
                <Icon size={15} aria-hidden /> {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  </div>
);
