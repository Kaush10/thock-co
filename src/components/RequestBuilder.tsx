import { useState, useSyncExternalStore } from 'react';
import { emailUrl, instagramUrl, siteConfig } from '../config/siteConfig';
import { Keycap, LedText } from '../system';

// A commission request, put together by pressing keys. Each group is a row of
// keycaps where one can be held down; the choices write the message, which
// goes out as an email (or is copied for a DM).

const GROUPS = [
  { id: 'need', label: 'what do you need?', options: ['a full build', 'a mod or tune', 'help picking parts'] },
  { id: 'size', label: 'size', options: ['60%', '65%', '75%', 'tkl', 'full size', 'not sure'] },
  { id: 'sound', label: 'sound', options: ['thocky', 'clacky', 'creamy', 'quiet', 'not sure'] },
  { id: 'parts', label: 'parts', options: ['i have them', 'some of them', 'none yet'] },
] as const;

type GroupId = (typeof GROUPS)[number]['id'];
type Choices = Partial<Record<GroupId, string>>;

const NEED_SHORT: Record<string, string> = { 'a full build': 'build', 'a mod or tune': 'mod', 'help picking parts': 'parts help' };
const NEED_PHRASE: Record<string, string> = {
  'a full build': 'a full build',
  'a mod or tune': 'a mod or tune on my board',
  'help picking parts': 'help picking parts',
};
const PARTS_PHRASE: Record<string, string> = {
  'i have them': 'i already have the parts.',
  'some of them': 'i have some of the parts.',
  'none yet': "i don't have any parts yet.",
};

const known = (value?: string) => (value && value !== 'not sure' ? value : undefined);

/** A short name for the request, e.g. "65% thocky build", used as the email subject. */
function summary(choices: Choices) {
  return [known(choices.size), known(choices.sound), choices.need && NEED_SHORT[choices.need]].filter(Boolean).join(' ');
}

/** What the LED shows: size and sound, which fit its 16 characters ("full size clacky"). */
function headline(choices: Choices) {
  return [known(choices.size), known(choices.sound)].filter(Boolean).join(' ') || (choices.need ? NEED_SHORT[choices.need] : '');
}

function compose(choices: Choices, notes: string) {
  const need = choices.need ? NEED_PHRASE[choices.need] : 'a board';
  const details = [known(choices.size) && `${known(choices.size)} size`, known(choices.sound) && `something ${known(choices.sound)}`]
    .filter(Boolean)
    .join(', ');
  const lines = [`hi kaush,`, '', `i'm after ${need}${details ? `: ${details}` : ''}.${choices.parts ? ` ${PARTS_PHRASE[choices.parts]}` : ''}`];
  if (notes.trim()) lines.push('', notes.trim());
  return lines.join('\n');
}

function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia('(max-width: 639px)');
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(max-width: 639px)').matches,
  );
}

const SMALL_CAP = { '--u': '2.75rem' } as React.CSSProperties;

export function RequestBuilder() {
  const narrow = useNarrow();
  const [choices, setChoices] = useState<Choices>({});
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const subject = summary(choices);
  const led = headline(choices);
  const message = compose(choices, notes);

  const toggle = (group: GroupId, option: string) =>
    setChoices((current) => ({ ...current, [group]: current[group] === option ? undefined : option }));

  const sendEmail = () => {
    const params = new URLSearchParams({ subject: subject ? `commission request: ${subject}` : 'commission request', body: message });
    window.location.href = `${emailUrl}?${params.toString().replace(/\+/g, '%20')}`;
  };

  const sendDm = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open(instagramUrl, '_blank', 'noreferrer');
  };

  return (
    <div className="overflow-hidden rounded-panel bg-panel shadow-[0_0_0_1px_var(--line)]">
      {/* what the request is, at a glance */}
      <div className="border-b border-line p-4 md:p-5">
        <div className="led-screen !p-3.5">
          <LedText text={led || (narrow ? 'pick keys' : 'pick a few keys')} cols={narrow ? 60 : 96} tone={led ? 'lit' : 'idle'} />
        </div>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* the keys */}
        <div className="space-y-6 p-5 md:p-7">
          {GROUPS.map((group) => (
            <fieldset key={group.id}>
              <legend className="t-small mb-2.5 text-ash">{group.label}</legend>
              <div role="radiogroup" aria-label={group.label} className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const on = choices[group.id] === option;
                  return (
                    <Keycap
                      key={option}
                      role="radio"
                      aria-checked={on}
                      align="label"
                      variant={on ? 'signal' : 'dark'}
                      down={on}
                      legend={option}
                      onClick={() => toggle(group.id, option)}
                      style={SMALL_CAP}
                    />
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/* the message it writes */}
        <div className="flex flex-col gap-5 border-t border-line bg-black/40 p-5 md:border-l md:border-t-0 md:p-7">
          <div>
            <p className="t-small mb-2 text-ash">your message</p>
            <p className="t-body whitespace-pre-line text-bone/85" aria-live="polite">
              {compose(choices, '')}
            </p>
          </div>

          <label className="block">
            <span className="t-small mb-2 block text-ash">anything else?</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              maxLength={1200}
              placeholder="the board you're picturing, parts you already have, links, a budget if you have one."
              className="t-body block w-full resize-y rounded-xl border border-line bg-black/60 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-signal/50 focus:outline-none focus-visible:outline-none"
            />
          </label>

          <div className="mt-auto space-y-3">
            <div className="flex flex-wrap gap-3">
              <Keycap variant="signal" align="label" legend="send as email" onClick={sendEmail} style={SMALL_CAP} />
              <Keycap variant="dark" align="label" legend={`dm @${siteConfig.contact.instagram}`} onClick={sendDm} style={SMALL_CAP} />
            </div>
            <p className="t-caption" aria-live="polite">
              {copied ? 'message copied. paste it into the dm.' : 'email opens with this filled in. dm copies it for you.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
