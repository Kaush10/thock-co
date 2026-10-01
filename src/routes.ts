import { articles } from './data/articles';

// Every page's title and description, in one place. The app sets them as you
// navigate, and the build writes them into a real HTML file per route so
// direct links, refreshes and link previews work on GitHub Pages.

export const SITE_URL = 'https://thockco.com';
const SITE_NAME = 'thock&co.';

export type PageMeta = { title: string; description: string };

const DEFAULT: PageMeta = {
  title: `${SITE_NAME} | kaush's keyboard builds`,
  description: "Custom mechanical keyboards built by Kaush in Champaign, IL: the parts, the photos, and how each one sounds.",
};

const STATIC_PAGES: Record<string, PageMeta> = {
  '/': DEFAULT,
  '/about': { title: `about | ${SITE_NAME}`, description: DEFAULT.description },
  '/builds': { title: `builds | ${SITE_NAME}`, description: DEFAULT.description },
  '/commissions': {
    title: `commissions | ${SITE_NAME}`,
    description: "Kaush isn't taking orders, but ideas are always welcome. Message him for a quote.",
  },
};

export const NOT_FOUND: PageMeta = {
  title: `page not found | ${SITE_NAME}`,
  description: DEFAULT.description,
};

/** Every path that should exist as a real file in the build. */
export function allPaths(): string[] {
  return [...Object.keys(STATIC_PAGES), ...articles.map((a) => `/builds/${a.slug}`)];
}

/** Addresses from when the site was a build service, and where they live now. */
export function redirects(): Record<string, string> {
  return {
    '/keyboards': '/builds',
    '/build-service': '/commissions',
    ...Object.fromEntries(articles.map((a) => [`/keyboards/${a.slug}`, `/builds/${a.slug}`])),
  };
}

export function metaFor(path: string): PageMeta {
  const clean = path !== '/' ? path.replace(/\/+$/, '') : path;
  if (STATIC_PAGES[clean]) return STATIC_PAGES[clean];
  if (clean === '/system') return { title: `system | ${SITE_NAME}`, description: 'design system reference' };
  const build = articles.find((a) => `/builds/${a.slug}` === clean);
  if (build) return { title: `${build.title} | ${SITE_NAME}`, description: build.snippet };
  return NOT_FOUND;
}
