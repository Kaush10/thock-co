import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type KeycapVariant = 'light' | 'dark' | 'signal';

/**
 * The site's only button style: a keycap that presses down.
 * `light` for everyday actions, `signal` for the one live action on a screen
 * (play, send), `dark` for modifiers and secondary controls.
 */
export const Keycap = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: KeycapVariant;
    /** Held down, e.g. while its hotkey is pressed or its sound is playing. */
    down?: boolean;
    /** Lit from below, e.g. a key typed on the visitor's own keyboard. */
    lit?: boolean;
  }
>(function Keycap({ variant = 'light', down, lit, className = '', type = 'button', children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={`keycap ${className}`}
      data-variant={variant === 'light' ? undefined : variant}
      data-down={down || undefined}
      data-lit={lit || undefined}
      {...props}
    >
      {/* the legend sits on the cap face, which is drawn by ::before */}
      <span className="relative">{children}</span>
    </button>
  );
});

/** A key named inside running text, e.g. "press <Kbd>space</Kbd>". */
export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
