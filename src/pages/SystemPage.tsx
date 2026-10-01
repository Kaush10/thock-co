import { useEffect, useState } from 'react';
import { DotRule, Kbd, Keyboard, Keycap, Lamp, LedText, Ledger, Panel, SoundTest } from '../system';

// The design system on one page, for development only (it isn't routed in production builds).

const COLORS: [name: string, value: string, role: string][] = [
  ['void', '#000000', 'the page'],
  ['panel', '#070708', 'housings for anything lit'],
  ['surface', '#1c1c1e', 'photo stages'],
  ['line', 'white 7%', 'hairlines around panels'],
  ['bone', '#ededed', 'primary text'],
  ['ash', '#8a8a8e', 'secondary text, labels'],
  ['signal', '#ff00aa', 'live only: playing, lit, open, pressed'],
  ['ember', '#8f0d63', 'signal at rest'],
];

/** A stand-in typing recording, synthesised so the sound test can be tried before real ones exist. */
function useSynthTyping() {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const rate = 22050;
    const length = rate * 6;
    const data = new Float32Array(length);
    let t = 0.15;
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    while (t < 5.8) {
      const start = Math.floor(t * rate);
      const loud = rand() < 0.12 ? 0.9 : 0.35 + rand() * 0.35;
      for (let i = 0; i < rate * 0.06 && start + i < length; i++) {
        data[start + i] += (rand() * 2 - 1) * loud * Math.exp(-i / (rate * 0.008));
      }
      t += 0.09 + rand() * 0.12;
    }
    // 16-bit mono WAV
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    const write = (offset: number, text: string) => [...text].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    write(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); write(8, 'WAVE'); write(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    write(36, 'data'); view.setUint32(40, length * 2, true);
    data.forEach((v, i) => view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, v)) * 0x7fff, true));
    const objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, []);
  return url;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-line py-14 md:grid-cols-[14rem_1fr]">
      <h2 className="font-mono text-[0.9375rem] font-normal normal-case tracking-normal text-ash">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export const SystemPage: React.FC = () => {
  const synth = useSynthTyping();
  return (
    <div className="mx-auto max-w-6xl px-8 pb-32 pt-28 font-body text-bone">
      <h1 className="font-display text-display-xl">system</h1>
      <p className="mt-4 max-w-xl text-ash">
        thock&co. is an instrument panel: every lit element is a dot on one 8px grid, pink means
        something is live, and the only button is a keycap.
      </p>

      <Section title="colour">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COLORS.map(([name, value, role]) => (
            <div key={name}>
              <div className="h-20 rounded-panel shadow-[0_0_0_1px_var(--line)]" style={{ background: `var(--${name})` }} />
              <p className="mt-3 font-mono text-sm">{name}</p>
              <p className="font-mono text-label text-ash">{value}</p>
              <p className="mt-1 text-sm text-ash">{role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="type">
        <div className="space-y-6">
          <p className="font-display text-display-xl">bauer lite</p>
          <p className="font-display text-display-lg">display large</p>
          <p className="font-display text-display-md">display medium, for section titles</p>
          <p className="font-mono text-[0.9375rem]">mono: specs, data, controls. always lowercase.</p>
          <p className="font-mono text-label text-ash">mono label: secondary details and captions</p>
          <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed">
            body: varela round for sentences. a 65% aluminium board with a polycarbonate plate, built
            to sound soft and low. lines stay under 70 characters.
          </p>
        </div>
      </Section>

      <Section title="led display">
        <div className="space-y-6">
          <Panel>
            <LedText text="hi kaush, could you build me" cols={96} cursor />
          </Panel>
          <Panel>
            <LedText text="abcdefghijklmnopqrstuvwxyz 0123456789 .,'!?-:/@&()" cols={96} />
          </Panel>
          <DotRule cols={120} />
          <p className="font-mono text-label text-ash">
            one font, one grid: 5×7 glyphs on an 8px pitch. long text shows its end, like a sign
            scrolling as you type.
          </p>
        </div>
      </Section>

      <Section title="keycaps">
        <div className="flex flex-wrap items-start gap-5">
          <Keycap legend="Q" />
          <Keycap legend="1" shift="!" />
          <Keycap legend="Caps Lock" units={1.75} style={{ width: '7rem' }} />
          <Keycap legend="Fn" variant="dark" align="center" />
          <Keycap legend="Enter" variant="signal" style={{ width: '9rem' }} />
          <Keycap legend="Q" down />
          <Keycap legend="Q" lit />
        </div>
        <div className="mt-8 flex flex-wrap items-start gap-5">
          <Keycap align="label" variant="signal" legend="send as email" />
          <Keycap align="label" legend="dm @kaushrajesh" />
          <Keycap align="label" variant="dark" legend="◀ previous" />
        </div>
        <p className="mt-8 text-ash">
          printed legends in inter, top-left like cherry-profile caps. keys in sentences look like
          this: press <Kbd>space</Kbd> to play, <Kbd>←</Kbd> <Kbd>→</Kbd> to change boards.
        </p>
      </Section>

      <Section title="keyboard">
        <div className="space-y-10 overflow-x-auto pb-4">
          <Keyboard unit="2.9rem" lit={new Set(['h', 'i'])} />
          <Keyboard unit="2.9rem" lit={new Set(['enter'])} live />
          <p className="font-mono text-label text-ash">
            silver case, pink underglow: ember at rest, signal while someone types (second board).
          </p>
          <div className="grid gap-16 pt-10">
            <div>
              <p className="mb-6 font-mono text-sm text-ash">angled, graphite (as in mockup b)</p>
              <Keyboard angled finish="graphite" unit="2.9rem" lit={new Set(['h', 'i', ' '])} live />
            </div>
            <div>
              <p className="mb-6 font-mono text-sm text-ash">angled, silver</p>
              <Keyboard angled unit="2.9rem" lit={new Set(['h', 'i', ' '])} live />
            </div>
          </div>
        </div>
      </Section>

      <Section title="status">
        <div className="flex flex-wrap gap-8">
          <Lamp on>inbox open</Lamp>
          <Lamp on={false}>bench full</Lamp>
        </div>
      </Section>

      <Section title="spec sheet">
        <Ledger
          className="max-w-lg"
          rows={[
            ['case', 'bauer lite, e-white'],
            ['plate', 'polycarbonate'],
            ['switches', 'linear, 63.5g, lubed'],
            ['mods', 'pe foam, tape'],
          ]}
        />
      </Section>

      <Section title="sound test">
        <div className="grid max-w-xl gap-6">
          <SoundTest src={synth} note="a synthesised stand-in until real recordings exist." />
          <SoundTest />
        </div>
      </Section>
    </div>
  );
};
