// Build photos are referenced as "<build-slug>/<name>" (e.g. "azoth/cover").
// scripts/photos.mjs generates each one at these widths.

const WIDTHS = [640, 1600] as const;
type Width = (typeof WIDTHS)[number];

export const photoUrl = (ref: string, width: Width = 1600) =>
  `${import.meta.env.BASE_URL}builds/${ref}-${width}.webp`;

/** src, srcSet and sizes for an <img>, so the browser picks the smallest copy that looks sharp. */
export const photoProps = (ref: string, sizes: string) => ({
  src: photoUrl(ref, 1600),
  srcSet: WIDTHS.map((w) => `${photoUrl(ref, w)} ${w}w`).join(', '),
  sizes,
});

/** Where a build's sound test lives once it's been recorded (photos/<slug>/sound.mp3). */
export const soundUrl = (slug: string) => `${import.meta.env.BASE_URL}builds/${slug}/sound.mp3`;
