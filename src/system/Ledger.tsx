/** A spec sheet: each label joined to its value by a dotted leader. */
export function Ledger({ rows, className = '' }: { rows: [label: string, value: string][]; className?: string }) {
  return (
    <dl className={`grid gap-3 font-mono text-[0.9375rem] ${className}`}>
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-2.5">
          <dt className="text-ash">{label}</dt>
          <span aria-hidden className="leader" />
          <dd className="text-right text-bone">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
