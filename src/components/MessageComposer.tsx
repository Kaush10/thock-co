import { lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { emailUrl, instagramUrl, siteConfig } from '../config/siteConfig';
import { Kbd, Keyboard, Keycap, LAYOUT_65, LedText } from '../system';

// three.js only loads once the section is close to the screen.
const Keyboard3D = lazy(() => import('../system/Keyboard3D'));

const MAX = 280;
const NARROW = '(max-width: 639px)';

function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(NARROW);
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia(NARROW).matches,
  );
}

// Which keycap a physical key belongs to, from KeyboardEvent.code (layout-independent).
const CODE_TO_KEY: Record<string, string> = {
  Space: ' ', Enter: 'enter', Backspace: 'backspace', Tab: 'tab', Escape: 'escape', CapsLock: 'capslock',
  ShiftLeft: 'shift', ShiftRight: 'shift', ControlLeft: 'control', ControlRight: 'control',
  AltLeft: 'alt', AltRight: 'alt', MetaLeft: 'meta', MetaRight: 'meta',
  Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\', Semicolon: ';', Quote: "'",
  Comma: ',', Period: '.', Slash: '/', ArrowUp: 'arrowup', ArrowDown: 'arrowdown', ArrowLeft: 'arrowleft',
  ArrowRight: 'arrowright', Delete: 'delete', PageUp: 'pageup', PageDown: 'pagedown', End: 'end',
};
function keyIdFor(event: KeyboardEvent | React.KeyboardEvent) {
  const { code } = event;
  if (code.startsWith('Key')) return code.slice(3).toLowerCase();
  if (code.startsWith('Digit')) return code.slice(5);
  return CODE_TO_KEY[code];
}

// Phone keyboards don't report key codes, so typed characters are matched to caps too.
const SHIFTED = new Map(LAYOUT_65.flat().flatMap((key) => (key.shift ? [[key.shift, key.id] as const] : [])));
function keyIdForChar(char: string) {
  return SHIFTED.get(char) ?? char.toLowerCase();
}

function mailto(message: string) {
  const params = new URLSearchParams({ subject: 'hi from thockco.com', body: message });
  // URLSearchParams encodes spaces as "+", which mail apps show literally.
  return `${emailUrl}?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * "Say hi": an LED display over a keyboard. Whatever the visitor types, on
 * their own keyboard or the one on screen, shows on the display and the keys
 * light up. Enter opens it as an email.
 */
export function MessageComposer() {
  const narrow = useNarrow();
  const ledCols = narrow ? 48 : 96;
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);
  const [lit, setLit] = useState<Set<string>>(() => new Set());
  const [near, setNear] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const unlightTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  // Keys light briefly and go out on their own. Waiting for keyup leaves keys
  // stuck lit when the browser never sees it (e.g. after cmd-tab).
  const flash = useCallback((id: string | undefined) => {
    if (!id) return;
    setLit((current) => new Set(current).add(id));
    clearTimeout(unlightTimers.current.get(id));
    unlightTimers.current.set(
      id,
      setTimeout(() => setLit((current) => { const next = new Set(current); next.delete(id); return next; }), 170),
    );
  }, []);

  useEffect(() => {
    const clear = () => setLit(new Set());
    window.addEventListener('blur', clear);
    return () => window.removeEventListener('blur', clear);
  }, []);

  useEffect(() => () => unlightTimers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => setSent(false), 2600);
    return () => clearTimeout(timer);
  }, [sent]);

  const send = () => {
    setSent(true);
    window.location.href = mailto(text.trim());
  };

  // Start typing anywhere while this section is on screen and the text goes here.
  // Also start loading the 3D board a screen ahead.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.4 });
    observer.observe(section);
    const preload = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    preload.observe(section);
    const onKey = (event: KeyboardEvent) => {
      if (!visible || event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.activeElement && document.activeElement !== document.body) return;
      if (event.key.length !== 1 || event.key === ' ') return;
      event.preventDefault();
      setText((current) => (current + event.key).slice(0, MAX));
      flash(keyIdFor(event));
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      observer.disconnect();
      preload.disconnect();
      window.removeEventListener('keydown', onKey);
    };
  }, [flash]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    flash(keyIdFor(event));
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const onChange = (value: string) => {
    const next = value.replace(/\n/g, ' ');
    if (next.length > text.length) flash(keyIdForChar(next[next.length - 1]));
    setText(next);
  };

  // On-screen keys type too.
  const onScreenKey = (id: string) => {
    flash(id);
    if (id === 'enter') return send();
    if (id === 'backspace') setText((current) => current.slice(0, -1));
    else if (id.length === 1) setText((current) => (current + id).slice(0, MAX));
    if (!narrow) inputRef.current?.focus({ preventScroll: true });
  };

  const typing = focused || text.length > 0;
  const prompt = narrow ? 'tap here' : 'type to say hi';
  const display = sent ? 'opening mail' : typing ? text : prompt;

  return (
    <div ref={sectionRef} className="flex w-full flex-col items-center">
      <div className="w-full max-w-[52rem]">
        <label className="led-screen block cursor-text" data-live={typing || undefined}>
          <span className="sr-only">a message to kaush</span>
          <LedText text={display} cols={ledCols} cursor={focused && !sent} tone={typing || sent ? 'lit' : 'idle'} />
          <textarea
            ref={inputRef}
            value={text}
            maxLength={MAX}
            rows={1}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-describedby="say-hi-hint"
            className="absolute inset-0 h-full w-full resize-none cursor-text bg-transparent text-transparent caret-transparent outline-none focus-visible:outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <p id="say-hi-hint" className="t-small text-ash">
            {text.length > 0 ? (
              <>
                press <Kbd>enter</Kbd> to send it.{' '}
                <span className="tabular-nums text-ash/70">{text.length} / {MAX}</span>
              </>
            ) : (
              'type on your keyboard or tap the keys.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Keycap
              align="label"
              variant="dark"
              legend={`dm @${siteConfig.contact.instagram}`}
              onClick={() => window.open(instagramUrl, '_blank', 'noreferrer')}
              style={{ '--u': '2.75rem' } as React.CSSProperties}
            />
            <Keycap variant="signal" align="label" legend="send as email" onClick={send} style={{ '--u': '2.75rem' } as React.CSSProperties} />
          </div>
        </div>
      </div>

      <div className="relative z-10 -mx-5 mt-6 aspect-[2.1/1] w-[calc(100%+2.5rem)] max-w-[68rem] sm:mx-0 sm:aspect-[2.3/1] sm:w-full md:mt-2">
        {webgl ? (
          near && (
            <Suspense fallback={null}>
              <Keyboard3D lit={lit} live={typing} onKey={onScreenKey} onUnavailable={() => setWebgl(false)} className="absolute inset-0" />
            </Suspense>
          )
        ) : (
          <Keyboard angled finish="graphite" unit="clamp(1.1rem, 3.2vw, 2.75rem)" lit={lit} live={typing} onKey={onScreenKey} className="mt-10 flex justify-center" />
        )}
      </div>
    </div>
  );
}
