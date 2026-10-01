/** The housing for anything that lights up: the LED display, the sound test, the composer. */
export function Panel({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'aside' | 'form';
}) {
  return (
    <Tag className={`rounded-panel bg-panel p-5 shadow-[0_0_0_1px_var(--line)] ${className}`}>{children}</Tag>
  );
}
