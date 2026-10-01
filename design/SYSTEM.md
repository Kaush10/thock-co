# thock&co. design system

thock&co. is an instrument panel. Every lit element is an LED dot on one shared
grid, pink means something is live, and the only physical object is the keycap.

Live reference: run `npm run dev` and open `/system`.
Code: tokens in `src/styles/system.css` and `tailwind.config.js`; components in `src/system/`.

## Rules

1. **One dot grid.** Everything that lights up (LED text, waveforms, lamps,
   dividers, spec-sheet leaders) uses dots 8px apart with a 2.5px radius. Use
   `DotGrid`, `LedText`, `DotWave`, `DotRule`; never draw a one-off dot pattern.
2. **LEDs switch, they don't fade.** Dot animation steps on a ~70ms beat.
   Smooth easing is only for physical things: keys pressing, the board floating.
3. **Signal pink means live.** Playing, lit, open, pressed. Static decoration,
   headings and borders are never pink.
4. **The keycap is the only button.** `light` for everyday actions, `signal` for
   the one live action on a screen (play, send), `dark` for modifiers. Secondary
   actions are plain mono text links. No pills, no ghost buttons, no glass.
5. **Three surfaces.** `void` (page), `panel` (housing for anything lit),
   `surface` (photo stages). Panels get a 1px `line` hairline, not a shadow.

## Tokens

| token | value | role |
|---|---|---|
| void | #000000 | the page |
| panel | #070708 | housings for anything lit |
| surface | #1c1c1e | photo stages |
| line | white 7% | hairlines around panels |
| bone | #ededed | primary text |
| ash | #8a8a8e | secondary text, labels |
| signal | #ff00aa | live only |
| ember | #8f0d63 | signal at rest (page wipe) |

Radii: `stage` 28px (photos), `panel` 20px, `cap` 12px.

## Type

- **Matrix Sans Print** (`font-display`): names and page titles only, large
  (`text-display-xl` 84px, `-lg` 56px, `-md` 34px). Never for sentences.
- **Reddit Mono** (`font-mono`): specs, data, controls, labels. Lowercase, no
  tracking, no all-caps.
- **Varela Round** (`font-body`): sentences. Lines under 70 characters.
- LED text uses the 5×7 font in `src/system/glyphs.ts`, rendered by `LedText`.

## Components

| component | use |
|---|---|
| `Keycap` | every button; `down` while held or playing, `lit` when typed |
| `Kbd` | a key named inside a sentence |
| `LedText` | text on an LED display; long text shows its end |
| `DotWave` | an audio waveform as an LED meter |
| `SoundTest` | a board's recording: waveform, play keycap, space to toggle |
| `Lamp` | a status light: `inbox open`, `bench full` |
| `Ledger` | a spec sheet with dotted leaders |
| `Panel` | the housing for anything lit |

## Voice

Lowercase, first person, plain verbs. The site is a hobby, not a shop: say
"i built", "i'm not taking builds right now", "message me", never "our
service", "order" or "clients". Commission status is two lamps: the inbox is
always open; the bench is full or free.
