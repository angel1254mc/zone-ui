import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { GameArtProvider, type GameArtState } from '../../art';
import { TriviaPage } from './TriviaPage';
import { STORAGE_KEY, TIMED_OUT, generateDailySet, loadRecord, shareText } from './questions';
import { FALLBACK_HOSTS } from './fallback';
import { fixtureManifest } from './fixture';

// Spy on the generator (calls through) to prove a run's question set is generated exactly once.
vi.mock('./questions', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./questions')>();
  return { ...mod, generateDailySet: vi.fn(mod.generateDailySet) };
});

const DATE = '2026-09-30';
const NOW = new Date(2026, 8, 30, 12, 0, 0);
const set = generateDailySet(fixtureManifest, DATE);

function memoryStorage(initial?: Record<string, string>) {
  const map = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    map,
  };
}

const READY: GameArtState = { status: 'ready', manifest: fixtureManifest };
const LOADING: GameArtState = { status: 'loading', manifest: null };
const MISSING: GameArtState = { status: 'missing', manifest: null };
const Art = ({ state, children }: { state: GameArtState; children: ReactNode }) => (
  <GameArtProvider state={state}>{children}</GameArtProvider>
);

type Props = Partial<Parameters<typeof TriviaPage>[0]>;
/** The page as an app uses it: no `manifest` prop; the art state comes from the store (pinned to the fixture). */
const page = (props: Props = {}, state: GameArtState = READY) => (
  <Art state={state}>
    <TriviaPage date={DATE} now={NOW} transitions={false} storage={memoryStorage()} {...props} />
  </Art>
);
const renderPage = (props: Props = {}, state: GameArtState = READY) => render(page(props, state));

const options = () => within(screen.getByRole('radiogroup')).getAllByRole('radio');
const start = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: /^play/i }));

async function answerAll(user: ReturnType<typeof userEvent.setup>, wrongAt: number[] = []) {
  for (let i = 0; i < set.questions.length; i++) {
    const q = set.questions[i];
    await user.click(options()[wrongAt.includes(i) ? (q.answer + 1) % 4 : q.answer]);
    await user.click(
      screen.getByRole('button', {
        name: i === set.questions.length - 1 ? /see my score/i : /next question/i,
      })
    );
  }
}

describe('TriviaPage', () => {
  it('starts on the hero: puzzle number, rules and Play', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'ZZZ Daily Trivia' })).toBeInTheDocument();
    expect(screen.getAllByText(/Puzzle #30/).length).toBeGreaterThan(0);
    expect(screen.getByText(/5 questions · 30 s each · one try per day/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mute sounds/i })).toBeInTheDocument();
  });

  it('plays a question: step progress, timer, four A–D options; a pick reveals and locks', async () => {
    const user = userEvent.setup();
    renderPage();
    await start(user);
    const q = set.questions[0];
    expect(screen.getByRole('heading', { level: 2, name: q.prompt })).toBeInTheDocument();
    expect(screen.getByText('Question 1 / 5')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', {
        name: 'Time left for this question',
      })
    ).toBeInTheDocument();
    expect(options()).toHaveLength(4);
    options().forEach((o, i) => {
      expect(o.textContent?.startsWith('ABCD'[i])).toBe(true);
      expect(o).toHaveTextContent(q.options[i].label);
    });
    const wrong = (q.answer + 1) % 4;
    await user.click(options()[wrong]);
    expect(options()[wrong]).toHaveAttribute('data-state', 'incorrect');
    expect(options()[q.answer]).toHaveAttribute('data-state', 'revealed');
    expect(screen.getByText('Not quite.')).toBeInTheDocument();
    // Locked: another pick changes nothing.
    await user.click(options()[q.answer]);
    expect(options()[q.answer]).toHaveAttribute('data-state', 'revealed');
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('answers with 1–4 and A–D hotkeys; Enter moves on', async () => {
    const user = userEvent.setup();
    renderPage();
    await start(user);
    const q0 = set.questions[0];
    await user.keyboard(String(q0.answer + 1));
    expect(options()[q0.answer]).toHaveAttribute('data-state', 'correct');
    fireEvent.keyDown(document.body, { key: 'Enter' });
    expect(screen.getByText('Question 2 / 5')).toBeInTheDocument();
    const q1 = set.questions[1];
    await user.keyboard('ABCD'[q1.answer].toLowerCase());
    expect(options()[q1.answer]).toHaveAttribute('data-state', 'correct');
  });

  it('a timeout counts as wrong and reveals the answer', () => {
    vi.useFakeTimers();
    try {
      const storage = memoryStorage();
      renderPage({ storage });
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /^play/i }));
      });
      act(() => {
        vi.advanceTimersByTime(31_000);
      });
      const q = set.questions[0];
      expect(
        screen.getByText("Time's up!", {
          selector: '.zzz-trivia__verdict',
        })
      ).toBeInTheDocument();
      expect(options()[q.answer]).toHaveAttribute('data-state', 'revealed');
      expect(options().filter((o) => o.getAttribute('data-state') === 'incorrect')).toHaveLength(0);
      expect(loadRecord(storage).day?.answers).toEqual([TIMED_OUT]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows results: score, status grid, time, share text, stats and percentile', async () => {
    const user = userEvent.setup();
    const copied: string[] = [];
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async (t: string) => void copied.push(t) },
      configurable: true,
    });
    renderPage({
      shareUrl: 'https://trivia.test',
      distribution: [10, 10, 20, 30, 20, 10],
    });
    await start(user);
    await answerAll(user, [1]);
    expect(screen.getByRole('heading', { name: 'You got 4 out of 5' })).toBeInTheDocument();
    expect(screen.getByText('Time taken')).toBeInTheDocument();
    const cells = within(screen.getByRole('list', { name: 'Your answers' })).getAllByRole('img');
    expect(cells.map((c) => c.getAttribute('aria-label'))).toEqual([
      'Q1: Correct',
      'Q2: Wrong',
      'Q3: Correct',
      'Q4: Correct',
      'Q5: Correct',
    ]);
    expect(screen.getByText(/did better than/)).toHaveTextContent('You did better than 70% of players today.');
    expect(screen.getByText('Played')).toBeInTheDocument();
    expect(screen.getByText(/Next puzzle/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /share result/i }));
    const answers = set.questions.map((q, i) => (i === 1 ? (q.answer + 1) % 4 : q.answer));
    expect(copied).toEqual([shareText(set, answers, 'https://trivia.test')]);
    expect(copied[0]).toContain('ZZZ Daily Trivia #30');
    expect(copied[0]).toContain('🟩🟥🟩🟩🟩');
    expect(copied[0]).toContain('4/5');
  });

  it('allows one attempt per day: a reload shows the results', async () => {
    const user = userEvent.setup();
    const storage = memoryStorage();
    const first = renderPage({ storage });
    await start(user);
    await answerAll(user);
    const saved = loadRecord(storage);
    expect(saved).toMatchObject({
      lastDate: DATE,
      streak: 1,
      best: 5,
      played: 1,
    });
    first.unmount();

    renderPage({ storage });
    expect(screen.queryByRole('button', { name: /^play/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'You got 5 out of 5' })).toBeInTheDocument();
    expect(screen.getByText(/already played today/i)).toBeInTheDocument();
    // Next day: a fresh start.
    render(page({ storage, date: '2026-10-01', now: new Date(2026, 9, 1, 9) }));
    expect(screen.getByRole('button', { name: /^play/i })).toBeInTheDocument();
  });

  it('a reload mid-question counts that question as timed out', async () => {
    const user = userEvent.setup();
    const storage = memoryStorage();
    const first = renderPage({ storage });
    await start(user);
    await user.click(options()[set.questions[0].answer]);
    await user.click(screen.getByRole('button', { name: /next question/i }));
    first.unmount();
    renderPage({ storage });
    await user.click(screen.getByRole('button', { name: /continue \(question 3\)/i }));
    expect(screen.getByText('Question 3 / 5')).toBeInTheDocument();
    expect(loadRecord(storage).day?.answers.slice(0, 2)).toEqual([set.questions[0].answer, TIMED_OUT]);
  });

  it('a reload during the last question completes and saves the day', () => {
    const answers = set.questions.slice(0, 4).map((q) => q.answer);
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify({
        day: { date: DATE, answers, elapsedMs: 50_000, started: 4 },
      }),
    });
    renderPage({ storage });
    expect(screen.getByRole('heading', { name: 'You got 4 out of 5' })).toBeInTheDocument();
    const saved = loadRecord(storage);
    expect(saved).toMatchObject({
      lastDate: DATE,
      played: 1,
      streak: 1,
      best: 4,
    });
    expect(saved.day?.answers).toEqual([...answers, TIMED_OUT]);
  });

  it('works when localStorage throws', async () => {
    const user = userEvent.setup();
    const throwing = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceeded');
      },
    };
    renderPage({ storage: throwing });
    await start(user);
    await answerAll(user, [0, 2]);
    expect(screen.getByRole('heading', { name: 'You got 3 out of 5' })).toBeInTheDocument();
  });

  it('reads the real localStorage by default and ignores garbage', () => {
    window.localStorage.setItem(STORAGE_KEY, '{garbage');
    render(page({ storage: undefined }));
    expect(screen.getByRole('button', { name: /^play/i })).toBeInTheDocument();
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it('story states: mid-quiz and finished from initialAnswers', () => {
    const { unmount } = renderPage({
      initialAnswers: [set.questions[0].answer, 0],
    });
    expect(screen.getByText('Question 3 / 5')).toBeInTheDocument();
    unmount();
    renderPage({ initialAnswers: set.questions.map((q) => q.answer) });
    expect(screen.getByRole('heading', { name: 'You got 5 out of 5' })).toBeInTheDocument();
  });

  it('an explicit manifest prop wins over the art state', () => {
    renderPage({ manifest: fixtureManifest }, MISSING);
    expect(screen.getByText(new RegExp(`Your host today: ${set.host.name}`))).toBeInTheDocument();
  });

  it('shows the host (a real agent) from the art store: hero figure loaded eagerly', () => {
    const { container } = renderPage();
    const host = fixtureManifest.agents.find((a) => a.id === set.host.id)!;
    const img = container.querySelector<HTMLImageElement>('.zzz-hero .zart img')!;
    expect(img.getAttribute('src')).toMatch(new RegExp(`${host.images.full}$`));
    expect(img).toHaveAttribute('loading', 'eager');
    expect(screen.getByText(new RegExp(`Your host today: ${host.name}`))).toBeInTheDocument();
  });

  describe('art loading states', () => {
    const gen = vi.mocked(generateDailySet);
    beforeEach(() => gen.mockClear());

    it('while art is loading: start shell with a disabled Play + spinner, no question set generated', () => {
      const { container } = renderPage({}, LOADING);
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'ZZZ Daily Trivia',
        })
      ).toBeInTheDocument();
      const play = screen.getByRole('button', { name: /loading/i });
      expect(play).toBeDisabled();
      expect(play.querySelector('.zzz-spinner')).not.toBeNull();
      expect(container.querySelector('.zzz-trivia')).toHaveAttribute('aria-busy', 'true');
      expect(screen.queryByRole('button', { name: /^play/i })).not.toBeInTheDocument();
      expect(gen).not.toHaveBeenCalled();
      // Neutral skeletons only: no imitation art.
      const slots = container.querySelectorAll('.zart');
      expect(slots.length).toBeGreaterThan(0);
      slots.forEach((s) => {
        expect(s).toHaveAttribute('data-state', 'loading');
        expect(s.querySelector('svg')).toBeNull();
      });
    });

    it('generates the set once when the art settles, and never restarts the run afterwards', async () => {
      const user = userEvent.setup();
      const storage = memoryStorage();
      const view = renderPage({ storage }, LOADING);
      expect(gen).not.toHaveBeenCalled();
      view.rerender(page({ storage }, READY));
      expect(gen).toHaveBeenCalledTimes(1);
      await start(user);
      const prompt = set.questions[0].prompt;
      expect(screen.getByRole('heading', { level: 2, name: prompt })).toBeInTheDocument();
      await user.click(options()[set.questions[0].answer]);
      // The art state changes again (e.g. a provider re-pins it): same set, same run, same reveal.
      view.rerender(page({ storage }, MISSING));
      view.rerender(page({ storage }, { status: 'ready', manifest: { ...fixtureManifest } }));
      expect(screen.getByRole('heading', { level: 2, name: prompt })).toBeInTheDocument();
      expect(screen.getByText('Correct!')).toBeInTheDocument();
      expect(gen).toHaveBeenCalledTimes(1);
    });

    it('a new date starts a new set', () => {
      const storage = memoryStorage();
      const view = renderPage({ storage }, READY);
      expect(gen).toHaveBeenCalledTimes(1);
      view.rerender(
        page(
          {
            storage,
            date: '2026-10-01',
            now: new Date(2026, 9, 1, 9),
          },
          READY
        )
      );
      expect(gen).toHaveBeenCalledTimes(2);
      expect(screen.getAllByText(/Puzzle #31/).length).toBeGreaterThan(0);
    });

    it('missing art: the deterministic fallback set with a real host and empty frames (no svg in any slot)', async () => {
      const user = userEvent.setup();
      const fallback = generateDailySet(null, DATE);
      gen.mockClear();
      const { container } = renderPage({}, MISSING);
      expect(gen).toHaveBeenCalledTimes(1);
      expect(FALLBACK_HOSTS).toContainEqual(fallback.host);
      expect(screen.getByText(new RegExp(`Your host today: ${fallback.host.name}`))).toBeInTheDocument();
      await start(user);
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: fallback.questions[0].prompt,
        })
      ).toBeInTheDocument();
      const slots = container.querySelectorAll('.zart');
      expect(slots.length).toBeGreaterThan(0);
      slots.forEach((s) => {
        expect(s).toHaveAttribute('data-state', 'missing');
        expect(s.querySelector('svg, img')).toBeNull();
      });
      // Still answerable from its text.
      await user.click(options()[fallback.questions[0].answer]);
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });

    describe('unreachable image CDN (manifest ready, image URLs fail)', () => {
      // The first fixture date whose set has a picture-only question (it carries a text clue).
      const found = Array.from({ length: 60 }, (_, i) => {
        const d = new Date(2026, 8, 1 + i);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
        .map((date) => ({
          date,
          s: generateDailySet(fixtureManifest, date),
        }))
        .map(({ date, s }) => ({
          date,
          s,
          index: s.questions.findIndex((q) => q.clue),
        }))
        .find((x) => x.index >= 0)!;
      const pictureQ = found.s.questions[found.index];
      const at = (props: Props = {}, state: GameArtState = READY) =>
        renderPage(
          {
            date: found.date,
            initialAnswers: found.s.questions.slice(0, found.index).map((q) => q.answer),
            ...props,
          },
          state
        );

      it('a picture-only question shows its text clue once its image fails, and stays the same question', async () => {
        const user = userEvent.setup();
        expect(pictureQ.kind).toMatch(/^(whoIsAgent|whichWEngine)$/);
        const { container } = at();
        gen.mockClear();
        expect(
          screen.getByRole('heading', {
            level: 2,
            name: pictureQ.prompt,
          })
        ).toBeInTheDocument();
        expect(screen.queryByText(pictureQ.clue!)).not.toBeInTheDocument();
        const img = container.querySelector<HTMLImageElement>('.zzz-trivia__media .zart img')!;
        expect(img).not.toBeNull();
        fireEvent.error(img);
        expect(container.querySelector('.zzz-trivia__media .zart')).toHaveAttribute('data-state', 'missing');
        expect(screen.getByText(pictureQ.clue!)).toBeInTheDocument();
        expect(screen.getByText(/picture unavailable/i)).toBeInTheDocument();
        // Same set, same prompt and options; nothing regenerated.
        expect(
          screen.getByRole('heading', {
            level: 2,
            name: pictureQ.prompt,
          })
        ).toBeInTheDocument();
        options().forEach((o, i) => expect(o).toHaveTextContent(pictureQ.options[i].label));
        expect(gen).not.toHaveBeenCalled();
        await user.click(options()[pictureQ.answer]);
        expect(screen.getByText('Correct!')).toBeInTheDocument();
      });

      it('the clue also shows when the slot has no art at all (explicit manifest, art state missing)', () => {
        at({ manifest: fixtureManifest }, MISSING);
        expect(screen.getByText(pictureQ.clue!)).toBeInTheDocument();
      });

      it('questions that name their subject never show a clue when their picture fails', () => {
        const other = found.s.questions.findIndex((q) => q.media && !q.clue);
        if (other < 0) return;
        const { container } = renderPage({
          date: found.date,
          initialAnswers: found.s.questions.slice(0, other).map((q) => q.answer),
        });
        const img = container.querySelector<HTMLImageElement>('.zzz-trivia__media .zart img');
        if (img) fireEvent.error(img);
        expect(container.querySelector('.zzz-trivia__clue')).toBeNull();
      });
    });
  });
});
