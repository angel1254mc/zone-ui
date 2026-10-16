import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Link } from 'react-router';
import {
  Button,
  ChoiceGroup,
  ContentCard,
  CountdownBar,
  ResetIcon,
  SegmentedTabs,
  StepProgress,
  Text,
} from '@angel1254mc/zone-ui';
import { TriviaPage } from '../../../../../examples/pages/Trivia';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { Related } from '../../../ui/Related';
import './example.css';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const WIDTHS = [
  { value: 'full', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'phone', label: 'Phone' },
];

const BUILT_FROM = [
  'hero',
  'content-card',
  'step-progress',
  'countdown-bar',
  'choice-group',
  'sweep-transition',
  'status-grid',
  'copy-button',
  'countdown',
  'stat-tiles',
  'bar-chart',
  'sound-toggle',
  'inline-error',
  'button',
  'spinner',
];

/**
 * The preview sits inside a docs page that already has its h1: demote the app's headings one level
 * (aria-level) so the page keeps a single top-level heading. Re-applied as the app renders new screens.
 */
function useEmbeddedHeadings(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const demote = () => {
      for (const h of root.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')) {
        if (!h.hasAttribute('aria-level')) h.setAttribute('aria-level', String(Math.min(6, Number(h.tagName[1]) + 1)));
      }
    };
    demote();
    const observer = new MutationObserver(demote);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [ref]);
}

/** The live app in a bounded, scrollable viewport, with a width switch and a restart. */
function Preview() {
  const [width, setWidth] = useState('full');
  const [run, setRun] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  useEmbeddedHeadings(viewport);
  return (
    <div className="ex-preview">
      <div className="ex-preview__bar">
        <div className="ex-preview__widths">
          <SegmentedTabs size="sm" items={WIDTHS} value={width} onValueChange={setWidth} aria-label="Preview width" />
        </div>
        <Button size="sm" width="auto" icon={<ResetIcon />} onClick={() => setRun((r) => r + 1)}>
          Restart
        </Button>
      </div>
      <div className="ex-preview__stage">
        <div
          ref={viewport}
          className="ex-preview__viewport zzz-scrollbar"
          data-width={width}
          role="region"
          aria-label="Daily Trivia, live preview"
        >
          <TriviaPage key={run} storage={null} />
        </div>
      </div>
    </div>
  );
}

function DailyTrivia() {
  return (
    <>
      <Preview />

      <section className="d-section d-prose" id="what-it-shows">
        <h2 className="d-h2">What it shows</h2>
        <p>
          A daily quiz web app: everyone gets the same five questions for the date, with one attempt per day. It is a
          responsive page, not a full-screen scene. The density stays the same at every width and only the layout
          changes with the container.
        </p>
        <ul className="d-note__list ex-points">
          <li>
            <b>Start.</b> A hero with the puzzle number, the rules, the day&apos;s host and a Play button.
          </li>
          <li>
            <b>Questions.</b> A sweep transition introduces each question. A step progress tracks the run, a countdown
            bar gives 30 seconds, and a choice group takes the answer by click, 1–4 or A–D. A timeout counts as wrong.
          </li>
          <li>
            <b>Reveal.</b> The right answer lights up with the accent, a wrong pick turns red, and a short fact follows.
            Enter moves on.
          </li>
          <li>
            <b>Results.</b> A status grid of the run, a share button that copies the result, a countdown to the next
            puzzle, stat tiles for played, streak and best, and a bar chart of today&apos;s scores.
          </li>
          <li>
            <b>Memory.</b> By default today&apos;s run and the streak are kept in <code>localStorage</code>, so a reload
            goes straight to the results. This preview keeps them in memory and starts fresh on every visit.
          </li>
        </ul>
      </section>

      <section className="d-section" id="built-from">
        <h2 className="d-h2">Built from</h2>
        <div className="d-prose">
          <p>
            Only kit components, plus <Link to="/docs/typography">Text</Link>, the <Link to="/docs/icons">icons</Link>{' '}
            and <Link to="/docs/theming">ZzzTheme</Link>.
          </p>
        </div>
        <Related slugs={BUILT_FROM} />
      </section>

      <section className="d-section d-prose" id="source">
        <h2 className="d-h2">Source</h2>
        <p>
          The app lives in <code>examples/pages/Trivia</code> in the repository. <code>TriviaPage</code> takes the date,
          where to keep the record, today&apos;s score distribution and a share link as props, so a real app can feed it
          from a backend.
        </p>
        <CodeBlock
          code={`<TriviaPage
  date="2026-10-07"                      // same date, same questions
  storage={null}                         // memory only; default localStorage
  distribution={[4, 9, 17, 28, 26, 16]}  // players per score, 0 to 5
  shareUrl="https://example.com/trivia"
/>`}
        />
      </section>
    </>
  );
}

/** Gallery card: a question card mid-quiz, built from the same components. */
function Thumbnail() {
  return (
    <div style={{ width: u(1000) }}>
      <ContentCard
        as="div"
        variant="accent"
        eyebrow={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: u(18) }}>
            Question 3 / 5
            <StepProgress
              steps={[{ status: 'success' }, { status: 'error' }, { status: 'current' }, {}, {}]}
              current={2}
              size="sm"
            />
          </span>
        }
      >
        <Text as="p" role="title" style={{ margin: 0 }}>
          Which element deals Ice damage?
        </Text>
        <CountdownBar fraction={0.6} secondsLeft={18} size="sm" label="Time left" />
        <ChoiceGroup
          aria-label="Answers"
          size="sm"
          items={[
            { value: 'fire', label: 'Fire' },
            { value: 'ice', label: 'Ice' },
            { value: 'electric', label: 'Electric' },
            { value: 'ether', label: 'Ether' },
          ]}
          value="ice"
          results={{ ice: 'correct' }}
          correctTone="accent"
          locked
        />
      </ContentCard>
    </div>
  );
}

const page: PageDoc = {
  Body: DailyTrivia,
  wide: true,
  thumbnail: Thumbnail,
  thumbnailScale: 0.34,
};

export default page;
