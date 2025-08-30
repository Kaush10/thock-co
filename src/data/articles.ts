export interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  image: string;
  images?: string[];
  snippet: string;
  testimonial: string;
  specs: string;
  fullContent: string;
}


// Pseudo entries generated from stuff folder image URLs

// Gallery entries generated from stuff folder image URLs
export const articles: Article[] = [
  {
    id: 1,
    slug: 'bauer-lite',
    title: 'Bauer™ Lite',
    date: 'August 30, 2025',
    image: '/article-images/Bauer™ Lite-cover.webp',
    images: ['/article-images/Bauer™ Lite-cover.webp','/article-images/Bauer™ Lite1.webp', '/article-images/Bauer™ Lite2.webp', '/article-images/Bauer™ Lite3.webp'],
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
    image: '/article-images/azoth-cover.webp',
    images: ['/article-images/azoth-cover.webp', '/article-images/azoth1.webp'],
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
    image: '/article-images/azoth-dev-cover.webp',
    images: ['/article-images/azoth-dev-cover.webp'],
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
    image: '/article-images/azoth-gmk-cover.webp',
    images: ['/article-images/azoth-gmk-cover.webp'],
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
    image: '/article-images/neo-ergo-cover.webp',
    images: ['/article-images/neo-ergo-cover.webp', '/article-images/neo-ergo1.webp', '/article-images/neo-ergo2.webp'],
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
    image: '/article-images/nuphy65-cover.webp',
    images: ['/article-images/nuphy65-cover.webp', '/article-images/nuphy651.webp', '/article-images/nuphy652.webp'],
    snippet: 'Placeholder snippet for NuPhy 65.',
    testimonial: 'Placeholder testimonial for NuPhy 65.',
    specs: 'Placeholder specs for NuPhy 65.',
    fullContent: '<p>Placeholder full content for NuPhy 65.</p>'
  },
  
];
