// Every board on the site. Photos live in photos/<slug>/ and a sound test,
// if there is one, at photos/<slug>/sound.mp3 (see scripts/photos.mjs).
// Placeholder text is marked "placeholder" until the write-ups are done.

export type Part = [label: string, value: string];

export interface Build {
  slug: string;
  title: string;
  /** Year it was built, e.g. "2025". */
  built: string;
  /** One line under the name, e.g. "a 65% aluminium board". */
  summary: string;
  /** Cover photo, as "<slug>/<name>" (see src/lib/photo.ts). */
  image: string;
  images: string[];
  parts: Part[];
  /** Paragraphs of notes about the build. */
  notes: string[];
}

const PLACEHOLDER_PARTS: Part[] = [
  ['case', '—'],
  ['plate', '—'],
  ['switches', '—'],
  ['keycaps', '—'],
  ['stabilizers', '—'],
  ['mods', '—'],
];

const PLACEHOLDER_NOTES = [
  "placeholder notes. this is where the story of the build goes: why these parts, what went wrong, and what i'd change next time.",
  'a second paragraph for tuning the sound, the stabilizers, or how it feels after a few months of use.',
];

export const builds: Build[] = [
  {
    slug: 'bauer-lite',
    title: 'Bauer Lite',
    built: '2025',
    summary: 'placeholder: one line about this board.',
    image: 'bauer-lite/cover',
    images: ['bauer-lite/cover', 'bauer-lite/1', 'bauer-lite/2', 'bauer-lite/3'],
    parts: PLACEHOLDER_PARTS,
    notes: PLACEHOLDER_NOTES,
  },
  {
    slug: 'azoth',
    title: 'Azoth',
    built: '2025',
    summary: 'placeholder: one line about this board.',
    image: 'azoth/cover',
    images: ['azoth/cover', 'azoth/1'],
    parts: PLACEHOLDER_PARTS,
    notes: PLACEHOLDER_NOTES,
  },
  {
    slug: 'azoth-dev',
    title: 'Azoth Dev',
    built: '2025',
    summary: 'placeholder: one line about this board.',
    image: 'azoth-dev/cover',
    images: ['azoth-dev/cover'],
    parts: PLACEHOLDER_PARTS,
    notes: PLACEHOLDER_NOTES,
  },
  {
    slug: 'azoth-gmk',
    title: 'Azoth GMK',
    built: '2025',
    summary: 'placeholder: one line about this board.',
    image: 'azoth-gmk/cover',
    images: ['azoth-gmk/cover'],
    parts: PLACEHOLDER_PARTS,
    notes: PLACEHOLDER_NOTES,
  },
  {
    slug: 'neo-ergo',
    title: 'Neo Ergo',
    built: '2025',
    summary: 'placeholder: one line about this board.',
    image: 'neo-ergo/cover',
    images: ['neo-ergo/cover', 'neo-ergo/1', 'neo-ergo/2'],
    parts: PLACEHOLDER_PARTS,
    notes: PLACEHOLDER_NOTES,
  },
  {
    slug: 'nuphy65',
    title: 'NuPhy 65',
    built: '2025',
    summary: 'placeholder: one line about this board.',
    image: 'nuphy65/cover',
    images: ['nuphy65/cover', 'nuphy65/1', 'nuphy65/2'],
    parts: PLACEHOLDER_PARTS,
    notes: PLACEHOLDER_NOTES,
  },
];
