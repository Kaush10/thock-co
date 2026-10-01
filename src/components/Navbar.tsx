import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigateWithWipe } from '../context/PageWipeContext';
import { emailUrl, instagramUrl, siteConfig } from '../config/siteConfig';
import { HamburgerToggle } from './HamburgerToggle';
import { VolumeControl } from './VolumeControl';

const NAV_ITEMS = [
  { path: '/builds', label: 'builds' },
  { path: '/about', label: 'about' },
  { path: '/commissions', label: 'commissions' },
];
const WIPED_PAGES = ['/', ...NAV_ITEMS.map((item) => item.path)];

interface NavbarProps {
  isDark: boolean;
}

/** The current page is marked with a lit LED, like a selector switch. */
function Led({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-block size-1.5 rounded-full transition-colors"
      style={on ? { background: 'var(--signal)', boxShadow: '0 0 8px var(--signal)' } : { background: 'transparent' }}
    />
  );
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu on navigation and on Escape.
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const go = (event: React.MouseEvent, path: string) => {
    setMenuOpen(false);
    if (WIPED_PAGES.includes(path) && path !== location.pathname) {
      event.preventDefault();
      navigateWithWipe(location.pathname, path, navigate);
    }
  };

  return (
    <nav className="navbar-glass sticky top-0 z-[10000] border-b border-line bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[82.5rem] items-center gap-6 px-5 md:px-9">
        <Link to="/" onClick={(event) => go(event, '/')} className="font-display text-[1.375rem] leading-none text-bone hover:opacity-80">
          thock&co.
        </Link>

        <ul className="mx-auto hidden items-center gap-8 font-mono text-sm md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={(event) => go(event, item.path)}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`inline-flex items-center gap-2 transition-colors ${isActive(item.path) ? 'text-bone' : 'text-ash hover:text-bone'}`}
              >
                <Led on={isActive(item.path)} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <VolumeControl />
          <div className="md:hidden">
            <HamburgerToggle open={menuOpen} onClick={() => setMenuOpen((open) => !open)} color="#ededed" />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-black/95 md:hidden">
          <ul className="mx-auto max-w-[82.5rem] px-5 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} className="border-b border-line last:border-0">
                <Link
                  to={item.path}
                  onClick={(event) => go(event, item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className="flex items-center justify-between py-4 font-display text-3xl text-bone"
                >
                  {item.label}
                  <Led on={isActive(item.path)} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-[82.5rem] gap-6 px-5 pb-6 font-mono text-sm text-ash">
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-bone">
              @{siteConfig.contact.instagram}
            </a>
            <a href={emailUrl} className="hover:text-bone">
              email
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
