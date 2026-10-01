/** A status light with its label: lit pink when on, a dark dot when off. */
export function Lamp({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className={`t-small inline-flex items-center gap-2 ${on ? 'text-bone' : 'text-ash'}`}>
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={on ? { background: 'var(--signal)', boxShadow: '0 0 12px var(--signal)' } : { background: '#333336' }}
      />
      {children}
      <span className="sr-only">{on ? '(on)' : '(off)'}</span>
    </span>
  );
}
