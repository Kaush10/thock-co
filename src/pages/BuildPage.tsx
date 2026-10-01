import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { builds } from '../data/builds';
import { photoProps, photoUrl, soundUrl } from '../lib/photo';
import { Kbd, Ledger, SoundTest } from '../system';
import { NotFoundPage } from './NotFoundPage';

/** One board: its photos, its sound test, what it's made of, and notes. */
export const BuildPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const index = builds.findIndex((b) => b.slug === slug);
  const build = builds[index];
  const [photo, setPhoto] = useState(0);

  // New board, first photo.
  useEffect(() => setPhoto(0), [slug]);

  const previous = builds[(index - 1 + builds.length) % builds.length];
  const next = builds[(index + 1) % builds.length];

  // ← and → move between boards, unless the visitor is typing or on a control.
  useEffect(() => {
    if (!build) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"], [role="slider"]')) return;
      if (event.key === 'ArrowLeft') navigate(`/builds/${previous.slug}`);
      if (event.key === 'ArrowRight') navigate(`/builds/${next.slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [build, previous, next, navigate]);

  if (!build) return <NotFoundPage />;

  const photos = build.images.length ? build.images : [build.image];

  return (
    <div className="mx-auto w-full max-w-[82.5rem] px-5 pb-28 pt-28 font-body text-bone md:px-9">
      <nav aria-label="other builds" className="mb-7 flex justify-between font-mono text-sm">
        <Link to={`/builds/${previous.slug}`} className="inline-flex items-center gap-2.5 text-ash hover:text-bone">
          <Kbd>←</Kbd> {previous.title}
        </Link>
        <Link to={`/builds/${next.slug}`} className="inline-flex items-center gap-2.5 text-ash hover:text-bone">
          {next.title} <Kbd>→</Kbd>
        </Link>
      </nav>

      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_32.5rem] lg:gap-12">
        <div className="overflow-hidden rounded-stage bg-surface">
          <img
            key={photos[photo]}
            {...photoProps(photos[photo], '(min-width: 1024px) 55vw, 100vw')}
            alt={`${build.title}, photo ${photo + 1} of ${photos.length}`}
            className="aspect-[4/5] w-full object-cover lg:max-h-[54rem]"
          />
        </div>

        <aside className="flex flex-col gap-9 lg:sticky lg:top-24">
          <div>
            <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] font-normal leading-[0.92] tracking-normal normal-case">
              {build.title}
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ash">{build.summary}</p>
            <p className="mt-2 font-mono text-label text-ash">built {build.built}</p>
          </div>

          <SoundTest key={build.slug} src={soundUrl(build.slug)} />

          <Ledger rows={build.parts} />
        </aside>
      </section>

      {photos.length > 1 && (
        <ul className="mt-12 grid grid-cols-4 gap-3 md:gap-4">
          {photos.map((ref, i) => (
            <li key={ref}>
              <button
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`show photo ${i + 1} of ${photos.length}`}
                aria-pressed={i === photo}
                className={`block w-full overflow-hidden rounded-panel transition duration-200 ${
                  i === photo ? 'opacity-100 shadow-[0_0_0_2px_var(--signal)]' : 'opacity-50 hover:-translate-y-1 hover:opacity-100'
                }`}
              >
                <img src={photoUrl(ref, 640)} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-20 grid gap-6 lg:grid-cols-[minmax(0,1fr)_32.5rem] lg:gap-12">
        <h2 className="font-display text-display-md font-normal normal-case tracking-normal">notes</h2>
        <div className="space-y-4 text-[1.0625rem] leading-[1.75] text-[#c9c9cc]">
          {build.notes.map((paragraph) => (
            <p key={paragraph} className="max-w-[62ch]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
};
