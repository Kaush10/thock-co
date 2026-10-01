import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export type KeycapVariant = 'light' | 'dark' | 'signal';

type KeycapProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: KeycapVariant;
  /** Main legend, printed top-left: "Q", "Caps Lock", "send as email". */
  legend?: ReactNode;
  /** Shifted legend printed above the main one, as on number keys: "!" over "1". */
  shift?: string;
  /**
   * `corner` (default): top-left, like printed alphas and modifiers.
   * `center`: arrows, Fn, the space bar.
   * `label`: a word or phrase on a wide action key, vertically centred.
   */
  align?: 'corner' | 'center' | 'label';
  /** Width in keyboard units, for keys inside a `Keyboard`. */
  units?: number;
  /** Held down, e.g. while its hotkey is pressed or its sound is playing. */
  down?: boolean;
  /** Lit from below, e.g. typed on the visitor's own keyboard. */
  lit?: boolean;
};

/**
 * The site's only button: a Cherry-profile keycap with a printed legend.
 * `light` for everyday actions, `signal` for the one live action on a screen
 * (play, send), `dark` for modifiers and secondary controls.
 */
export const Keycap = forwardRef<HTMLButtonElement, KeycapProps>(function Keycap(
  { variant = 'light', legend, shift, align = 'corner', units, down, lit, className = '', style, type = 'button', children, ...props },
  ref,
) {
  const text = typeof legend === 'string' ? legend : '';
  // Multi-letter legends are modifiers ("Caps Lock"), printed smaller, unless it's an action label.
  const isModifier = align === 'corner' && text.length > 1 && !shift;
  return (
    <button
      ref={ref}
      type={type}
      className={`keycap ${className}`}
      data-variant={variant === 'light' ? undefined : variant}
      data-align={align === 'corner' ? undefined : align}
      data-down={down || undefined}
      data-lit={lit || undefined}
      style={units ? ({ ...style, '--w': units } as CSSProperties) : style}
      {...props}
    >
      {shift ? (
        <span className="legend-pair">
          <span>{shift}</span>
          <span>{legend}</span>
        </span>
      ) : legend !== undefined ? (
        <span className={isModifier ? 'legend-mod' : undefined}>{legend}</span>
      ) : null}
      {children}
    </button>
  );
});

/** A key named inside running text, e.g. "press <Kbd>space</Kbd>". */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
