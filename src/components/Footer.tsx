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
      <div className="mx-auto max-w-[75rem] px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-10">
          <div>
            <p className="font-display text-xl leading-none text-bone">thock&co.</p>
            <p className="t-small mt-2.5 text-ash">keyboards built by kaush.</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
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
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-5">
          <div className="flex flex-wrap gap-5">
            <Lamp on>inbox open</Lamp>
            <Lamp on={siteConfig.bench === 'open'}>{siteConfig.bench === 'open' ? 'bench open' : 'bench full'}</Lamp>
          </div>
          <span className="t-caption">© {new Date().getFullYear()} thock&co.</span>
        </div>
      </div>
    </footer>
  );
};
