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
      <div className="mx-auto grid max-w-[75rem] gap-8 px-5 py-10 md:grid-cols-[1fr_auto_auto] md:items-end md:px-8">
        <div>
          <p className="font-display text-xl leading-none text-bone">thock&co.</p>
          <p className="t-small mt-3 max-w-[40ch] text-ash">
            keyboards built by kaush in champaign, illinois.
          </p>
          <div className="mt-4 flex flex-wrap gap-5">
            <Lamp on>inbox open</Lamp>
            <Lamp on={siteConfig.bench === 'open'}>{siteConfig.bench === 'open' ? 'bench open' : 'bench full'}</Lamp>
          </div>
        </div>

        <ul className="t-small flex flex-wrap gap-x-7 gap-y-3">
          {LINKS.map((link) => (
            <li key={link.path}>
              <Link to={link.path} onClick={(event) => go(event, link.path)} className="text-ash transition-colors hover:text-bone">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="keycap" data-variant="dark" data-align="center" style={{ '--u': '2.5rem' } as React.CSSProperties}>
            <Instagram size={16} />
          </a>
          <a href={emailUrl} aria-label="Email" className="keycap" data-variant="dark" data-align="center" style={{ '--u': '2.5rem' } as React.CSSProperties}>
            <Mail size={16} />
          </a>
          <span className="t-caption ml-2">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};
