# Zone

A general-purpose, **Zenless Zone Zero–inspired** React UI kit for game-flavoured web apps and sites.

> Fan project, not affiliated with HoYoverse. Zenless Zone Zero and its art are © HoYoverse.

## Install & use

```bash
npm install @angel1254mc/zone-ui
```

```tsx
import '@angel1254mc/zone-ui/styles.css'; // tokens + base + every component style
import '@angel1254mc/zone-ui/fonts.css'; // optional: loads Mona Sans from Google Fonts
import { Button, SegmentedTabs, ZzzTheme } from '@angel1254mc/zone-ui';

export function App() {
  return (
    <ZzzTheme>
      <SegmentedTabs
        items={[
          { value: 'daily', label: 'Daily' },
          { value: 'archive', label: 'Archive' },
        ]}
        defaultValue="daily"
      />
      <Button>Start</Button>
    </ZzzTheme>
  );
}
```

React **19+** is required (components use ref-as-prop).

### Fonts

The kit's intended typefaces are **Inpin Hongmeng** (commercial, inpin.cn) and Impact. The default
substitute is **Mona Sans 900** (Google Fonts, SIL OFL) with `font-size-adjust` matching Inpin Hongmeng's
cap height.

## Example: building a daily trivia app

| Screen     | Pieces                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Start      | `Hero` / `Splash` for the title screen, `StatTiles` for streak / best / played, `Countdown` to the next daily set, `SoundToggle` in the corner, a `Button` to start                                                            |
| Transition | `SweepTransition` with "Question 1" / "Results" between phases                                                                                                                                                                 |
| Question   | `StepProgress` (question 3 of 10), `ContentCard` for the prompt (optionally with art), `ChoiceGroup` for the answers (select → confirm → reveal correct / incorrect), `CountdownBar` + `useCountdown` for a per-question timer |
| Results    | `StatTiles` (score, streak), `StatusGrid` of right/wrong cells, `BarChart` of the score distribution, `CopyButton` to copy the share text, `Countdown` to tomorrow's set                                                       |
| Anywhere   | `Toast` for "copied!", `DialogBand` / `ConfirmDialog` for "quit today's run?", `ZzzTheme` + `HatchBackground` as the page frame                                                                                                |

```tsx
import { useState } from 'react';
import {
  ZzzTheme,
  HatchBackground,
  Button,
  StepProgress,
  ContentCard,
  ChoiceGroup,
  CountdownBar,
  SweepTransition,
  StatTiles,
  StatTile,
  StatusGrid,
  BarChart,
  CopyButton,
  Countdown,
} from '@angel1254mc/zone-ui';
// Your app logic: date-seeded questions, scoring, share text, score distribution.
import { todaysQuestions, shareText, tomorrowAtMidnight, scoreDistribution } from './my-trivia-logic';

export function DailyTrivia() {
  const questions = todaysQuestions(new Date());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [sweep, setSweep] = useState(true);
  const done = answers.length === questions.length;
  const q = questions[index];

  const confirm = () => {
    setRevealed(true);
    setAnswers([...answers, picked === q.answer]);
  };
  const next = () => {
    setPicked(null);
    setRevealed(false);
    setIndex(index + 1);
    setSweep(true);
  };

  return (
    <ZzzTheme scale={0.6}>
      <HatchBackground />
      <SweepTransition
        active={sweep}
        label={done ? 'Results' : `Question ${index + 1}`}
        onDone={() => setSweep(false)}
      />
      {!done ? (
        <main>
          <StepProgress steps={questions.length} current={index} />
          {/* Per-question timer; key restarts it on every question. */}
          <CountdownBar key={index} durationMs={20_000} running={!revealed} onExpire={confirm} label="Time left" />
          <ContentCard eyebrow={`Question ${index + 1}`} title={q.prompt} media={q.art} />
          <ChoiceGroup
            label={q.prompt}
            items={q.options.map((text, i) => ({
              value: String(i),
              label: text,
            }))}
            value={picked}
            onValueChange={setPicked}
            locked={revealed}
            results={
              revealed
                ? {
                    [q.answer]: 'correct',
                    ...(picked !== q.answer && picked ? { [picked]: 'incorrect' } : {}),
                  }
                : undefined
            }
          />
          {revealed ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button disabled={picked === null} onClick={confirm}>
              Confirm
            </Button>
          )}
        </main>
      ) : (
        <main>
          <StatTiles>
            <StatTile label="Score" value={`${answers.filter(Boolean).length}/${questions.length}`} highlight />
            <StatTile label="Streak" value={3} delta={1} />
          </StatTiles>
          <StatusGrid
            items={answers.map((ok) => ({
              status: ok ? 'success' : 'error',
            }))}
          />
          <BarChart data={scoreDistribution()} highlight={answers.filter(Boolean).length} />
          <CopyButton text={shareText(answers)}>Share</CopyButton>
          <Countdown target={tomorrowAtMidnight()} prefix="Next set in" />
        </main>
      )}
    </ZzzTheme>
  );
}
```

## Development

| Command                                     | What it does                                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run site:dev`                          | Docs site on :5180                                                                                       |
| `npm run dev`                               | Demo app (launcher for the example pages) on :5173                                                       |
| `npm test` / `npm run typecheck`            | Vitest suite / TypeScript                                                                                |
| `npm run build`                             | Library → `dist/` (ESM, CJS, `.d.ts`, `zone-ui.css`, `tokens.css`, `fonts.css`)                          |
| `npm run site:build` / `npm run build:demo` | Static docs site (`site/build/client`) / demo site                                                       |
| `npm run site:docgen`                       | Regenerate the docs site's props tables from the component sources                                       |
| `npm run tokens`                            | Regenerate `src/styles/tokens.{css,ts}` from `src/styles/tokens.json`                                    |
| `npm run barrel`                            | Regenerate `src/index.ts` from the component folders (run after adding a component)                      |
| `npm run art-manifest`                      | Regenerate `examples/art/art-manifest.json`, the game-art URL list for the docs and examples (see below) |

### Game art in the docs and examples

The docs site, the example pages and the demo show real Zenless Zone Zero art
from two community sources:

- [static.nanoka.cc](https://static.nanoka.cc)
- [Enka.Network](https://enka.network): Inter-Knot namecards (`ImgCardRoleS####`, `ImgCardEvent##`), used as
  banner, hero and news art.

- `npm run art-manifest` regenerates the manifest from the sources' indexes (`scripts/build-art-manifest.mjs`).
  It downloads no images: it only reads the first bytes of each one to confirm it exists and record its size.
- `configureArt({ nanokaBase, enkaBase })` (from `examples/art`, typically called once at boot; slots update when it changes) points each
  source at another base URL, e.g. a self-hosted mirror that keeps the same file names; `null` restores the
  default. In the demo, `?artBase=<url>` does the same for both sources.

**Credits:** game data and art from [static.nanoka.cc](https://static.nanoka.cc) (community datamine) and
[Enka.Network](https://enka.network). Zenless Zone Zero © HoYoverse. The art is not licensed to this
project; it is linked by URL for the examples and is not redistributed.

## Project layout

```
src/components/<Name>/   component, CSS, tests (one folder per component)
src/icons/               original SVG icon set
src/styles/              tokens.json (source), tokens.css / tokens.ts (generated), base.css (accent clock, materials, text roles), fonts.css
src/index.ts             package entry (generated by `npm run barrel`)
examples/pages/          example pages: Trivia (ZZZ Daily Trivia), InterKnotDispatch (news site)
examples/art/            game-art URL manifest + resolver and image slot (docs/examples/demo only)
demo/                    standalone demo app (launcher for the example pages)
site/                    docs site (Vite + React Router): pages, live examples, generated props tables
```

## Known gaps

- A few full-screen pieces (`Screen`, `TopBar`, `BottomBar`) are designed for a `<Stage>` rather than a
  responsive page.
- Glyph shapes differ slightly from Inpin Hongmeng because of the font substitute.
- The docs and examples depend on two third-party art hosts at runtime (see "Game art in the docs and
  examples"); when they are unreachable the image slots render as empty frames.
- S-rank badge symbol kinda sucks
