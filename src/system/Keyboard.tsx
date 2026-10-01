import { Keycap, type KeycapVariant } from './Keycap';

// A 65% layout. Each key: [legend, units?, shift?, options?]. `id` is what a
// physical key reports (KeyboardEvent.key, lowercased) so keys can light up as
// the visitor types.

type KeySpec = {
  legend: string;
  id: string;
  units?: number;
  shift?: string;
  variant?: KeycapVariant;
  align?: 'corner' | 'center';
};

const k = (legend: string, id = legend.toLowerCase(), extra: Partial<KeySpec> = {}): KeySpec => ({ legend, id, ...extra });
const pair = (shift: string, legend: string): KeySpec => ({ legend, shift, id: legend });

export const LAYOUT_65: KeySpec[][] = [
  [k('Esc', 'escape'), pair('!', '1'), pair('@', '2'), pair('#', '3'), pair('$', '4'), pair('%', '5'), pair('^', '6'), pair('&', '7'), pair('*', '8'), pair('(', '9'), pair(')', '0'), pair('_', '-'), pair('+', '='), k('Backspace', 'backspace', { units: 2 }), k('Del', 'delete')],
  [k('Tab', 'tab', { units: 1.5 }), ...'QWERTYUIOP'.split('').map((c) => k(c)), pair('{', '['), pair('}', ']'), pair('|', '\\'), k('PgUp', 'pageup')].map((key, i, row) => (i === row.length - 2 ? { ...key, units: 1.5 } : key)),
  [k('Caps Lock', 'capslock', { units: 1.75 }), ...'ASDFGHJKL'.split('').map((c) => k(c)), pair(':', ';'), pair('"', "'"), k('Enter', 'enter', { units: 2.25, variant: 'signal' }), k('PgDn', 'pagedown')],
  [k('Shift', 'shift', { units: 2.25 }), ...'ZXCVBNM'.split('').map((c) => k(c)), pair('<', ','), pair('>', '.'), pair('?', '/'), k('Shift', 'shift', { units: 1.75 }), k('↑', 'arrowup', { align: 'center' }), k('End', 'end')],
  [k('Control', 'control', { units: 1.25 }), k('Alt', 'alt', { units: 1.25 }), k('Cmd', 'meta', { units: 1.25 }), k('', ' ', { units: 6.25, align: 'center' }), k('Alt', 'alt'), k('Fn', 'fn', { align: 'center' }), k('Ctrl', 'control'), k('←', 'arrowleft', { align: 'center' }), k('↓', 'arrowdown', { align: 'center' }), k('→', 'arrowright', { align: 'center' })],
];

/**
 * A keyboard in a silver case with pink underglow. `lit` keys glow as if
 * pressed; `live` turns the underglow up (e.g. while someone is typing).
 */
export function Keyboard({
  lit = new Set<string>(),
  live = false,
  onKey,
  unit,
  angled = false,
  finish = 'silver',
  className = '',
}: {
  lit?: Set<string>;
  live?: boolean;
  /** Called with a key's id when it's clicked or tapped. */
  onKey?: (id: string) => void;
  /** One key unit, e.g. "3.25rem". */
  unit?: string;
  /** Tip the board back in perspective and let it float, for showpiece moments. */
  angled?: boolean;
  finish?: 'silver' | 'graphite';
  className?: string;
}) {
  const unitStyle = unit ? ({ '--u': unit } as React.CSSProperties) : undefined;
  const board = (
    <div
      className={`board ${angled ? '' : className}`}
      data-live={live || undefined}
      data-angled={angled || undefined}
      data-finish={finish === 'silver' ? undefined : finish}
      style={unitStyle}
    >
      <div className="board-plate">
        {LAYOUT_65.map((row, r) => (
          <div key={r} className="board-row">
            {row.map((key, i) => (
              <Keycap
                key={`${r}-${i}`}
                legend={key.legend}
                shift={key.shift}
                units={key.units}
                variant={key.variant}
                align={key.align}
                lit={lit.has(key.id)}
                tabIndex={onKey ? 0 : -1}
                aria-label={key.id === ' ' ? 'space' : key.shift ? `${key.legend} ${key.shift}` : key.legend}
                onClick={onKey ? () => onKey(key.id) : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  return angled ? (
    <div className={`board-stage ${className}`} style={unitStyle}>
      {board}
    </div>
  ) : (
    board
  );
}
