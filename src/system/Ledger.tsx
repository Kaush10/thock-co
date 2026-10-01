/** A spec sheet: each label joined to its value by a dotted leader. */
export function Ledger({ rows, className = '' }: { rows: [label: string, value: string][]; className?: string }) {
  return (
    <dl className={`t-small grid gap-3 ${className}`}>
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
