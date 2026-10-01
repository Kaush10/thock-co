import { Instagram, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { emailUrl, instagramUrl, siteConfig } from '../config/siteConfig';
import { navigateWithWipe } from '../context/PageWipeContext';
import { Lamp } from '../system';

const LINKS = [
  { path: '/builds', label: 'builds' },
  { path: '/about', label: 'about' },
  { path: '/commissions', label: 'commissions' },
];

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (event: React.MouseEvent, path: string) => {
    if (path !== location.pathname) {
      event.preventDefault();
      navigateWithWipe(location.pathname, path, navigate);
    }
  };

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-[82.5rem] gap-10 px-5 py-12 md:grid-cols-[1fr_auto_auto] md:items-end md:px-9">
        <div>
          <p className="font-display text-[1.75rem] leading-none text-bone">thock&co.</p>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-ash">
            keyboards built by kaush in champaign, illinois.
          </p>
          <div className="mt-4 flex flex-wrap gap-5">
            <Lamp on>inbox open</Lamp>
            <Lamp on={siteConfig.bench === 'open'}>{siteConfig.bench === 'open' ? 'bench open' : 'bench full'}</Lamp>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-sm">
          {LINKS.map((link) => (
            <li key={link.path}>
              <Link to={link.path} onClick={(event) => go(event, link.path)} className="text-ash transition-colors hover:text-bone">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="keycap" data-variant="dark" data-align="center" style={{ '--u': '2.75rem' } as React.CSSProperties}>
            <Instagram size={18} />
          </a>
          <a href={emailUrl} aria-label="Email" className="keycap" data-variant="dark" data-align="center" style={{ '--u': '2.75rem' } as React.CSSProperties}>
            <Mail size={18} />
          </a>
          <span className="ml-2 font-mono text-label text-ash">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};
