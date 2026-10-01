export interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  /** Cover photo, as "<build-slug>/<name>" (see src/lib/photo.ts). */
  image: string;
  images?: string[];
  snippet: string;
  testimonial: string;
  specs: string;
  fullContent: string;
}


export const articles: Article[] = [
  {
    id: 1,
    slug: 'bauer-lite',
    title: 'Bauer™ Lite',
    date: 'August 30, 2025',
    image: 'bauer-lite/cover',
    images: ['bauer-lite/cover','bauer-lite/1', 'bauer-lite/2', 'bauer-lite/3'],
    snippet: 'Placeholder snippet for Bauer™ Lite.',
    testimonial: 'Placeholder testimonial for Bauer™ Lite.',
    specs: 'Placeholder specs for Bauer™ Lite.',
    fullContent: '<p>Placeholder full content for Bauer™ Lite.</p>'
  },
  {
    id: 2,
    slug: 'azoth',
    title: 'Azoth',
    date: 'August 30, 2025',
    image: 'azoth/cover',
    images: ['azoth/cover', 'azoth/1'],
    snippet: 'Placeholder snippet for Azoth.',
    testimonial: 'Placeholder testimonial for Azoth.',
    specs: 'Placeholder specs for Azoth.',
    fullContent: '<p>Placeholder full content for Azoth.</p>'
  },
  {
    id: 3,
    slug: 'azoth-dev',
    title: 'Azoth Dev',
    date: 'August 30, 2025',
    image: 'azoth-dev/cover',
    images: ['azoth-dev/cover'],
    snippet: 'Placeholder snippet for Azoth Dev.',
    testimonial: 'Placeholder testimonial for Azoth Dev.',
    specs: 'Placeholder specs for Azoth Dev.',
    fullContent: '<p>Placeholder full content for Azoth Dev.</p>'
  },
  {
    id: 4,
    slug: 'azoth-gmk',
    title: 'Azoth GMK',
    date: 'August 30, 2025',
    image: 'azoth-gmk/cover',
    images: ['azoth-gmk/cover'],
    snippet: 'Placeholder snippet for Azoth GMK.',
    testimonial: 'Placeholder testimonial for Azoth GMK.',
    specs: 'Placeholder specs for Azoth GMK.',
    fullContent: '<p>Placeholder full content for Azoth GMK.</p>'
  },
  {
    id: 5,
    slug: 'neo-ergo',
    title: 'Neo Ergo',
    date: 'August 30, 2025',
    image: 'neo-ergo/cover',
    images: ['neo-ergo/cover', 'neo-ergo/1', 'neo-ergo/2'],
    snippet: 'Placeholder snippet for Neo Ergo.',
    testimonial: 'Placeholder testimonial for Neo Ergo.',
    specs: 'Placeholder specs for Neo Ergo.',
    fullContent: '<p>Placeholder full content for Neo Ergo.</p>'
  },
  {
    id: 6,
    slug: 'nuphy65',
    title: 'NuPhy 65',
    date: 'August 30, 2025',
    image: 'nuphy65/cover',
    images: ['nuphy65/cover', 'nuphy65/1', 'nuphy65/2'],
    snippet: 'Placeholder snippet for NuPhy 65.',
    testimonial: 'Placeholder testimonial for NuPhy 65.',
    specs: 'Placeholder specs for NuPhy 65.',
    fullContent: '<p>Placeholder full content for NuPhy 65.</p>'
  },
  
];
