import { GLYPH_ROWS, textToColumns } from './glyphs';

// Every lit element on the site is drawn on the same grid: 8px between dot
// centres, 2.5px radius. These components only decide which dots are on.

const PITCH = 8;
const RADIUS = 2.5;

type DotState = 'off' | 'idle' | 'lit';

const FILL: Record<DotState, string> = {
  off: 'var(--dot-off)',
  idle: 'var(--dot-idle)',
  lit: 'var(--signal)',
};

/** A grid of dots. `state(col, row)` decides each one. Scales to its container's width. */
export function DotGrid({
  cols,
  rows,
  state,
  label,
  className,
}: {
  cols: number;
  rows: number;
  state: (col: number, row: number) => DotState;
  label?: string;
  className?: string;
}) {
  const dots = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const s = state(col, row);
      dots.push(
        <circle
          key={`${col}-${row}`}
          cx={col * PITCH + PITCH / 2}
          cy={row * PITCH + PITCH / 2}
          r={RADIUS}
          fill={FILL[s]}
          style={s === 'lit' ? { filter: 'var(--dot-glow)' } : undefined}
        />,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols * PITCH} ${rows * PITCH}`}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      {dots}
    </svg>
  );
}

/**
 * Text on an LED display. When the text is longer than the display it shows
 * the end, the way a sign scrolls as you type into it.
 */
export function LedText({
  text,
  cols,
  cursor = false,
  className,
}: {
  text: string;
  /** Display width in dots. Each character takes 6. */
  cols: number;
  /** Show a blinking-free underscore cursor after the text. */
  cursor?: boolean;
  className?: string;
}) {
  const columns = textToColumns(cursor ? `${text}_` : text);
  const offset = Math.max(0, columns.length - cols);
  // One empty row above and below the 7-row glyphs, like a real panel.
  return (
    <DotGrid
      cols={cols}
      rows={GLYPH_ROWS + 2}
      label={text}
      className={className}
      state={(col, row) => (row > 0 && row <= GLYPH_ROWS && columns[col + offset]?.[row - 1] ? 'lit' : 'off')}
    />
  );
}

/**
 * An audio waveform as an LED meter: each column is one slice of the clip,
 * mirrored around the centre. Columns already played light up.
 */
export function DotWave({
  peaks,
  rows = 13,
  progress = 0,
  label,
  className,
}: {
  /** One value per column, 0–1. */
  peaks: number[];
  rows?: number;
  /** 0–1, how much has played. */
  progress?: number;
  label?: string;
  className?: string;
}) {
  const mid = (rows - 1) / 2;
  const playedCols = Math.floor(progress * peaks.length);
  return (
    <DotGrid
      cols={peaks.length}
      rows={rows}
      label={label}
      className={className}
      state={(col, row) => {
        const reach = Math.round(peaks[col] * mid);
        if (Math.abs(row - mid) > reach) return 'off';
        return col < playedCols ? 'lit' : 'idle';
      }}
    />
  );
}

/** A row of dots used as a divider. */
export function DotRule({ cols = 120, className }: { cols?: number; className?: string }) {
  return <DotGrid cols={cols} rows={1} state={() => 'off'} className={className} />;
}
