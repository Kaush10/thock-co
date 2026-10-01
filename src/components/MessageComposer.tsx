import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { emailUrl, instagramUrl, siteConfig } from '../config/siteConfig';
import { Kbd, Keyboard, Keycap, Lamp, LedText, Panel } from '../system';

const MAX = 280;
const NARROW = '(max-width: 639px)';

/** Fewer, larger LED characters on phones. */
function useLedCols() {
  const narrow = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(NARROW);
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia(NARROW).matches,
  );
  return narrow ? 48 : 96;
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

function mailto(message: string) {
  const params = new URLSearchParams({ subject: 'hi from thockco.com', body: message });
  // URLSearchParams encodes spaces as "+", which mail apps show literally.
  return `${emailUrl}?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * "Type to say hi": a message box shown as an LED display, with an optional
 * keyboard whose keys light up as the visitor types. Enter sends it as an email.
 */
export function MessageComposer({ withKeyboard = true }: { withKeyboard?: boolean }) {
  const ledCols = useLedCols();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [lit, setLit] = useState<Set<string>>(() => new Set());
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
      setTimeout(() => setLit((current) => { const nextLit = new Set(current); nextLit.delete(id); return nextLit; }), 180),
    );
  }, []);

  useEffect(() => {
    const clear = () => setLit(new Set());
    window.addEventListener('blur', clear);
    return () => window.removeEventListener('blur', clear);
  }, []);

  const send = () => {
    window.location.href = mailto(text.trim());
  };

  // Start typing anywhere while this section is on screen and the text goes here.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.5 });
    observer.observe(section);
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
      window.removeEventListener('keydown', onKey);
    };
  }, [flash]);

  useEffect(() => () => unlightTimers.current.forEach(clearTimeout), []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    flash(keyIdFor(event));
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  // On-screen keys type too (and are how phones without a hardware keyboard play with it).
  const onScreenKey = (id: string) => {
    flash(id);
    if (id === 'enter') return send();
    if (id === 'backspace') setText((current) => current.slice(0, -1));
    else if (id.length === 1) setText((current) => (current + id).slice(0, MAX));
    inputRef.current?.focus({ preventScroll: true });
  };

  const typing = focused || text.length > 0;
  const benchOpen = siteConfig.bench === 'open';

  return (
    <div ref={sectionRef} className="flex w-full flex-col items-center">
      <Panel className="w-full max-w-[46rem] !p-5 md:!p-6">
        <label className="relative block cursor-text rounded-md p-1 transition-shadow focus-within:shadow-[0_0_0_1px_rgba(255,0,170,0.35)]">
          <span className="sr-only">a message to kaush</span>
          <LedText text={typing ? text : ledCols < 96 ? 'say hi' : 'type to say hi'} cols={ledCols} cursor={focused} tone={typing ? 'lit' : 'idle'} />
          <textarea
            ref={inputRef}
            value={text}
            maxLength={MAX}
            rows={1}
            onChange={(event) => setText(event.target.value.replace(/\n/g, ' '))}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="absolute inset-0 h-full w-full resize-none cursor-text bg-transparent text-transparent caret-transparent outline-none focus-visible:outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </label>
        <div className="t-caption mt-3 flex justify-between">
          <span>
            type anything, then press <Kbd>enter</Kbd> to send it to my inbox.
          </span>
          <span aria-hidden className="hidden shrink-0 pl-4 sm:inline">{text.length} / {MAX}</span>
        </div>

        <div className="mt-5 grid gap-5 border-t border-line pt-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-6">
              <Lamp on>inbox open</Lamp>
              <Lamp on={benchOpen}>{benchOpen ? 'bench open' : 'bench full'}</Lamp>
            </div>
            <p className="t-small max-w-[46ch] text-ash">
              {benchOpen
                ? "i'm taking a build or two right now. tell me what you have in mind and i'll quote it."
                : "i'm not taking builds right now, but i read every message. if your idea is one i'd want to build, i'll tell you."}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <Keycap variant="signal" align="label" legend="send as email" onClick={send} aria-describedby="send-hint" />
            <Keycap
              align="label"
              legend={`dm @${siteConfig.contact.instagram}`}
              onClick={() => window.open(instagramUrl, '_blank', 'noreferrer')}
            />
          </div>
        </div>
        <p id="send-hint" className="sr-only">
          or press enter
        </p>
      </Panel>

      {withKeyboard && (
        <Keyboard
          angled
          finish="graphite"
          unit="clamp(1.1rem, 3.2vw, 2.75rem)"
          lit={lit}
          live={typing}
          onKey={onScreenKey}
          className="relative z-10 mt-16"
        />
      )}
    </div>
  );
}
