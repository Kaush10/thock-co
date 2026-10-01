import { articles } from './data/articles';

// Every page's title and description, in one place. The app sets them as you
// navigate, and the build writes them into a real HTML file per route so
// direct links, refreshes and link previews work on GitHub Pages.

export const SITE_URL = 'https://thockco.com';
const SITE_NAME = 'thock&co.';

export type PageMeta = { title: string; description: string };

const DEFAULT: PageMeta = {
  title: `${SITE_NAME} | custom keeb build service`,
  description:
    'Premium custom keyboard build service based in Urbana-Champaign, IL. Crafting the perfect keystroke experience with meticulous attention to detail.',
};

const STATIC_PAGES: Record<string, PageMeta> = {
  '/': DEFAULT,
  '/about': { title: `about | ${SITE_NAME}`, description: DEFAULT.description },
  '/keyboards': { title: `keyboards | ${SITE_NAME}`, description: DEFAULT.description },
  '/build-service': { title: `build service | ${SITE_NAME}`, description: DEFAULT.description },
};

export const NOT_FOUND: PageMeta = {
  title: `page not found | ${SITE_NAME}`,
  description: DEFAULT.description,
};

/** Every path that should exist as a real file in the build. */
export function allPaths(): string[] {
  return [...Object.keys(STATIC_PAGES), ...articles.map((a) => `/keyboards/${a.slug}`)];
}

export function metaFor(path: string): PageMeta {
  const clean = path !== '/' ? path.replace(/\/+$/, '') : path;
  if (STATIC_PAGES[clean]) return STATIC_PAGES[clean];
  const build = articles.find((a) => `/keyboards/${a.slug}` === clean);
  if (build) return { title: `${build.title} | ${SITE_NAME}`, description: build.snippet };
  return NOT_FOUND;
}
