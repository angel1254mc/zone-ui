import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  BackIcon,
  BarChart,
  Button,
  ChevronRightIcon,
  ChoiceGroup,
  ContentCard,
  CopyButton,
  Countdown,
  CountdownBar,
  Hero,
  IconButton,
  Notice,
  SoundToggle,
  Spinner,
  StatTile,
  StatTiles,
  StatusGrid,
  StepProgress,
  SweepTransition,
  Text,
  ZzzTheme,
  cx,
  useCountdown,
  type ChoiceItem,
  type ChoiceResult,
  type StatusGridItem,
  type StepItem,
} from '@angel1254mc/zone-ui'
import { AgentImage, useGameArtState, type GameArtManifest } from '../../art'
import {
  DEFAULT_SHARE_URL,
  QUESTIONS_PER_DAY,
  SECONDS_PER_QUESTION,
  TIMED_OUT,
  betterThanPercent,
  formatDuration,
  generateDailySet,
  isDateKey,
  loadRecord,
  nextMidnight,
  nextRecord,
  outcomeOf,
  puzzleNumber,
  resumeDay,
  saveRecord,
  scoreOf,
  shareText,
  toDateKey,
  type DailySet,
  type TriviaFacts,
  type TriviaQuestion,
  type TriviaRecord,
} from './questions'
import { HOST_LINES, hostLine, resultLine } from './hostLines'
import { TriviaArtView } from './TriviaArt'
import './TriviaPage.css'

/* ── props ──────────────────────────────────────────────────────────────────────────────── */

type Store = Pick<Storage, 'getItem' | 'setItem'>

export interface TriviaPageProps {
  /** The day to play (YYYY-MM-DD). Default: today (local time). Same date = same questions for everyone. */
  date?: string
  /** "Now", for the next-puzzle countdown target. Default: the current time. */
  now?: Date
  /**
   * Manifest to generate questions from. Default: the art store (`useGameArtState()`): while it is
   * `loading` the start screen waits (Play disabled); `ready` → questions from the manifest; `missing`
   * → the static, text-answerable fallback set. The set is generated ONCE per date and then locked, so
   * art arriving (or failing) later never restarts a run. `null` forces the fallback set.
   */
  manifest?: GameArtManifest | null
  /** Extra facts (faction / full name / birthday). Default: facts.json. */
  facts?: TriviaFacts
  /**
   * Where today's attempt, streak, best and played live. Default `window.localStorage` (every failure is
   * ignored: the page still works, it just forgets). `null` = memory only.
   */
  storage?: Store | null
  /**
   * Score distribution of all players today: `distribution[s]` = players who got `s` right (0…5). A real
   * app feeds this from its backend (Supabase / Neon…); the default is MOCK data.
   */
  distribution?: number[]
  /** Link at the end of the share text. */
  shareUrl?: string
  /** Seconds per question. Default 30. */
  questionSeconds?: number
  /** UI density (--zzz-scale). Default: inherited, i.e. the web default 0.7 (1 = game density). */
  scale?: number
  /** Play the sweep transitions ("QUESTION 2", "RESULTS"). Default true. */
  transitions?: boolean
  /** Use the quick cross-fade instead of the sweep. Default: the OS reduced-motion setting. */
  reducedMotion?: boolean
  /** Story/test state: answers already given (option index, or -1 = timed out). Skips the start screen. */
  initialAnswers?: number[]
  /** With `initialAnswers`: show the last given answer revealed (instead of the next question). */
  initialRevealed?: boolean
  /** Story/test state: freeze the current question's timer at this many seconds. */
  timerSecondsLeft?: number
  /** Back button (top-left). Omitted = no back button. */
  onBack?: () => void
  className?: string
  style?: CSSProperties
}

/** MOCK distribution (players per score 0–5). Replace with real data. */
export const MOCK_DISTRIBUTION = [4, 9, 17, 28, 26, 16]

/* ── helpers ────────────────────────────────────────────────────────────────────────────── */

const LETTERS = ['A', 'B', 'C', 'D'] as const

function defaultStorage(): Store | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

function prettyDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]
  return `${month} ${d}, ${y}`
}

const isEditable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))

type Phase = 'start' | 'quiz' | 'results'

interface Sweep {
  key: string
  label: string
  /** Applied at the midpoint (screen covered). */
  then: () => void
}

/* ── page ───────────────────────────────────────────────────────────────────────────────── */

/**
 * "ZZZ Daily Trivia": a responsive daily-quiz web app built only from zone-ui general components and
 * examples/art. Start screen (Hero) → five 30-second questions (SweepTransition, ContentCard,
 * StepProgress, CountdownBar, ChoiceGroup) → results (StatusGrid, share text, next-puzzle Countdown)
 * and stats (StatTiles, BarChart). One attempt per day, kept in localStorage.
 */
export function TriviaPage(props: TriviaPageProps) {
  const art = useGameArtState()
  const [now] = useState(() => props.now ?? new Date())
  const date = props.date && isDateKey(props.date) ? props.date : toDateKey(now)
  const explicit = props.manifest !== undefined
  const settled = explicit || art.status !== 'loading'
  const manifest = explicit ? props.manifest ?? null : art.status === 'ready' ? art.manifest : null
  const set = useLockedDailySet(settled, manifest, date, props.facts, props.manifest)
  if (!set) return <TriviaLoading {...props} date={date} />
  // Only a new date starts a fresh run (never the art state: the set is locked once generated).
  return <TriviaRun key={set.date} {...props} set={set} now={now} />
}

/**
 * Today's set, generated once when the art state has settled and then LOCKED for the date (and the
 * facts / explicit `manifest` prop): a later art-state change (loading → ready, a re-pinned provider,
 * art failing) never regenerates it, so a run is never restarted under the player. `null` while the
 * art is still loading (nothing is generated yet).
 */
function useLockedDailySet(
  settled: boolean,
  manifest: GameArtManifest | null,
  date: string,
  facts: TriviaFacts | undefined,
  explicit: GameArtManifest | null | undefined,
): DailySet | null {
  const lock = useRef<{ date: string; facts?: TriviaFacts; explicit?: GameArtManifest | null; set: DailySet } | null>(null)
  if (!settled) return null
  const l = lock.current
  if (!l || l.date !== date || l.facts !== facts || l.explicit !== explicit) {
    lock.current = { date, facts, explicit, set: generateDailySet(manifest, date, facts) }
  }
  return lock.current!.set
}

/** Top bar (brand, puzzle number, sound). */
function Bar({ date, onBack, muted, onMutedChange }: { date: string; onBack?: () => void; muted: boolean; onMutedChange(m: boolean): void }) {
  return (
    <header className="zzz-trivia__bar">
      {onBack ? <IconButton icon={<BackIcon />} label="Back" onClick={onBack} /> : null}
      <Text role="condensedMd" className="zzz-trivia__brand">
        ZZZ Daily Trivia
      </Text>
      <Text role="label" tone="secondary" className="zzz-trivia__bar-meta">
        #{puzzleNumber(date)} · {prettyDate(date)}
      </Text>
      <SoundToggle className="zzz-trivia__sound" muted={muted} onMutedChange={onMutedChange} label="Mute sounds" />
    </header>
  )
}

const RULES = ['Answer with a click, 1–4 or A–D', 'A timeout counts as wrong', 'Share your result grid with friends']

/**
 * The start screen while the art state is still `loading`: the same Hero shell with Play disabled
 * and a spinner, and a neutral skeleton where the host stands. No question set exists yet.
 */
function TriviaLoading({ date, questionSeconds = SECONDS_PER_QUESTION, scale, reducedMotion, onBack, className, style }: TriviaPageProps & { date: string }) {
  const [muted, setMuted] = useState(false)
  const puzzle = puzzleNumber(date)
  return (
    <div className={cx('zzz-trivia', className)} style={style} data-reduced-motion={reducedMotion ? '' : undefined} aria-busy="true">
      <ZzzTheme className="zzz-trivia__app" scale={scale} reducedMotion={reducedMotion}>
        <Bar date={date} onBack={onBack} muted={muted} onMutedChange={setMuted} />
        <main className="zzz-trivia__main" data-phase="start">
          <Hero
            className="zzz-trivia__hero"
            eyebrow="Daily"
            title="ZZZ Daily Trivia"
            meta={[`Puzzle #${puzzle}`, prettyDate(date)]}
            description={`${QUESTIONS_PER_DAY} questions · ${questionSeconds} s each · one try per day.`}
            bullets={RULES}
            primaryAction={{
              label: 'Loading…',
              icon: <Spinner tone="current" label="Loading today's puzzle" />,
              disabled: true,
            }}
            art={<AgentImage crop="full" alt="" priority className="zzz-trivia__figure" />}
            background="hatch"
          />
        </main>
      </ZzzTheme>
    </div>
  )
}

function TriviaRun({
  set,
  now,
  storage: storageProp,
  distribution = MOCK_DISTRIBUTION,
  shareUrl = DEFAULT_SHARE_URL,
  questionSeconds = SECONDS_PER_QUESTION,
  scale,
  transitions = true,
  reducedMotion,
  initialAnswers,
  initialRevealed = false,
  timerSecondsLeft,
  onBack,
  className,
  style,
}: TriviaPageProps & { set: DailySet; now: Date }) {
  const date = set.date
  const total = set.questions.length || QUESTIONS_PER_DAY
  const puzzle = puzzleNumber(date)
  const storage = storageProp === undefined ? defaultStorage() : storageProp

  /* ── state ── */
  const [record, setRecord] = useState<TriviaRecord>(() => loadRecord(storage))
  const init = useMemo(() => {
    if (initialAnswers) {
      const answers = initialAnswers.slice(0, total)
      const done = answers.length >= total && !initialRevealed
      return { answers, elapsedMs: answers.length * 9_000, phase: (done ? 'results' : 'quiz') as Phase, revealed: initialRevealed && answers.length > 0, playedBefore: false }
    }
    const day = resumeDay(loadRecord(storage), date, total)
    if (!day) return { answers: [] as number[], elapsedMs: 0, phase: 'start' as Phase, revealed: false, playedBefore: false }
    const done = day.answers.length >= total
    return { answers: day.answers, elapsedMs: day.elapsedMs, phase: (done ? 'results' : 'start') as Phase, revealed: false, playedBefore: done }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [phase, setPhase] = useState<Phase>(init.phase)
  const [answers, setAnswers] = useState<number[]>(init.answers)
  const [revealed, setRevealed] = useState(init.revealed)
  const [elapsedMs, setElapsedMs] = useState(init.elapsedMs)
  const [muted, setMuted] = useState(false)
  // The timer runs only once the sweep has uncovered the question.
  const [ready, setReady] = useState(init.phase === 'quiz')
  const [sweep, setSweep] = useState<Sweep | null>(null)
  const [root, setRoot] = useState<HTMLDivElement | null>(null)

  const index = revealed ? answers.length - 1 : Math.min(answers.length, total - 1)
  const q: TriviaQuestion | undefined = set.questions[index]
  const score = scoreOf(set, answers)
  const isLast = index === total - 1

  /* ── persistence ── */
  const persist = useCallback(
    (next: TriviaRecord) => {
      saveRecord(storage, next)
      setRecord(next)
    },
    [storage],
  )

  // A day completed by resuming (a reload during the last question's timer) is saved here.
  useEffect(() => {
    if (!init.playedBefore || initialAnswers || record.lastDate === date) return
    persist({ ...nextRecord(record, date, score), day: { date, answers, elapsedMs, started: null } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Move through a sweep (or straight away without transitions). */
  const go = useCallback(
    (key: string, label: string, then: () => void) => {
      if (!transitions) {
        then()
        setReady(true)
        return
      }
      setReady(false)
      setSweep({ key, label, then })
    },
    [transitions],
  )

  const startQuestion = useCallback(
    (i: number) => {
      go(`q${i}`, `Question ${i + 1}`, () => {
        setPhase('quiz')
        setRevealed(false)
      })
    },
    [go],
  )

  // Mark the running question as started, so a reload counts it as timed out (no free retries).
  useEffect(() => {
    if (phase !== 'quiz' || !ready || revealed || initialAnswers) return
    const latest = loadRecord(storage)
    persist({ ...latest, day: { date, answers, elapsedMs, started: answers.length } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ready, revealed, answers.length])

  const answer = useCallback(
    (value: number, usedMs: number) => {
      if (phase !== 'quiz' || revealed || !ready || answers.length >= total) return
      const nextAnswers = [...answers, value]
      const nextElapsed = elapsedMs + Math.max(0, usedMs)
      setAnswers(nextAnswers)
      setElapsedMs(nextElapsed)
      setRevealed(true)
      if (initialAnswers) return
      let next: TriviaRecord = { ...loadRecord(storage), day: { date, answers: nextAnswers, elapsedMs: nextElapsed, started: null } }
      if (nextAnswers.length >= total) next = nextRecord(next, date, scoreOf(set, nextAnswers))
      persist(next)
    },
    [phase, revealed, ready, answers, total, elapsedMs, initialAnswers, storage, date, set, persist],
  )

  const advance = useCallback(() => {
    if (phase !== 'quiz' || !revealed) return
    if (!isLast) startQuestion(answers.length)
    else go('results', 'Results', () => setPhase('results'))
  }, [phase, revealed, isLast, answers.length, startQuestion, go])

  /* ── keyboard: 1–4 answer (A–D come from ChoiceGroup's hotkeys), Enter continues ── */
  const timeRef = useRef<() => number>(() => 0)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isEditable(e.target)) return
      if (phase !== 'quiz') return
      const digit = ['1', '2', '3', '4'].indexOf(e.key)
      if (digit >= 0 && !revealed && ready && q && digit < q.options.length) {
        e.preventDefault()
        answer(digit, timeRef.current())
        return
      }
      if (e.key === 'Enter' && revealed && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, revealed, ready, q, answer, advance])

  /* ── derived ── */
  const outcomes = set.questions.map((qq, i) => outcomeOf(qq, answers[i] ?? null))
  const hostId = set.host.id
  const hostName = set.host.name
  const chosen = revealed ? answers[index] : null

  const [hurry, setHurry] = useState(false)
  let line: string
  if (phase === 'results') line = init.playedBefore ? hostLine(HOST_LINES.played, date) : resultLine(score, total)
  else if (phase === 'start') line = hostLine(HOST_LINES.intro, date)
  else if (revealed && q) line = hostLine(chosen === TIMED_OUT ? HOST_LINES.timeout : chosen === q.answer ? HOST_LINES.correct : HOST_LINES.wrong, date, index)
  else if (hurry) line = hostLine(HOST_LINES.hurry, date, index)
  else line = hostLine(HOST_LINES.ask, date, index)

  const host = (
    <Host
      line={line}
      name={hostName}
      art={<AgentImage id={hostId} crop="full" alt="" priority className="zzz-trivia__host-img zzz-trivia__figure" />}
    />
  )

  return (
    <div ref={setRoot} className={cx('zzz-trivia', className)} style={style} data-reduced-motion={reducedMotion ? '' : undefined}>
      <ZzzTheme className="zzz-trivia__app" scale={scale} reducedMotion={reducedMotion}>
        <Bar date={date} onBack={onBack} muted={muted} onMutedChange={setMuted} />

        <main className="zzz-trivia__main" data-phase={phase}>
          {phase === 'start' ? (
            <Hero
              className="zzz-trivia__hero"
              eyebrow="Daily"
              title="ZZZ Daily Trivia"
              meta={[`Puzzle #${puzzle}`, prettyDate(date)]}
              description={`${total} questions · ${questionSeconds} s each · one try per day. Your host today: ${hostName}.`}
              bullets={RULES}
              primaryAction={{
                label: answers.length ? `Continue (question ${answers.length + 1})` : 'Play',
                icon: <ChevronRightIcon />,
                onClick: () => startQuestion(answers.length),
              }}
              art={<AgentImage id={hostId} crop="full" alt="" priority className="zzz-trivia__figure" />}
              background="hatch"
            />
          ) : (
            <div className="zzz-trivia__stage">
              {host}
              <div className="zzz-trivia__content">
                {phase === 'quiz' && q ? (
                  <QuestionCard
                    key={`${set.date}:${index}`}
                    q={q}
                    index={index}
                    total={total}
                    outcomes={outcomes}
                    revealed={revealed}
                    chosen={chosen}
                    ready={ready}
                    isLast={isLast}
                    seconds={questionSeconds}
                    frozenSeconds={timerSecondsLeft}
                    timeRef={timeRef}
                    onAnswer={answer}
                    onNext={advance}
                    onHurry={setHurry}
                  />
                ) : null}
                {phase === 'results' ? (
                  <Results
                    set={set}
                    answers={answers}
                    outcomes={outcomes}
                    score={score}
                    total={total}
                    elapsedMs={elapsedMs}
                    record={record}
                    distribution={distribution}
                    playedBefore={init.playedBefore}
                    nextAt={nextMidnight(now)}
                    shareUrl={shareUrl}
                  />
                ) : null}
              </div>
            </div>
          )}
        </main>

        <SweepTransition
          runKey={sweep?.key ?? null}
          label={sweep?.label}
          tone="accent"
          container={root}
          reducedMotion={reducedMotion}
          onMidpoint={() => sweep?.then()}
          onDone={() => {
            setSweep(null)
            setReady(true)
          }}
        />
      </ZzzTheme>
    </div>
  )
}

/* ── host ───────────────────────────────────────────────────────────────────────────────── */

function Host({ line, name, art }: { line: string; name: string; art: ReactNode }) {
  return (
    <aside className="zzz-trivia__host" aria-label={`Host: ${name}`}>
      <div className="zzz-trivia__host-art" aria-hidden="true">
        {art}
      </div>
      <div className="zzz-trivia__bubble zzz-mat-panel">
        <Text as="p" role="label" className="zzz-trivia__host-name">
          {name}
        </Text>
        <Text as="p" role="bodyLg" className="zzz-trivia__line" aria-live="polite">
          {line}
        </Text>
      </div>
    </aside>
  )
}

/* ── question ───────────────────────────────────────────────────────────────────────────── */

interface QuestionCardProps {
  q: TriviaQuestion
  index: number
  total: number
  outcomes: ReturnType<typeof outcomeOf>[]
  revealed: boolean
  chosen: number | null
  ready: boolean
  isLast: boolean
  seconds: number
  frozenSeconds?: number
  timeRef: { current: () => number }
  onAnswer(value: number, usedMs: number): void
  onNext(): void
  onHurry(hurry: boolean): void
}

function QuestionCard({ q, index, total, outcomes, revealed, chosen, ready, isLast, seconds, frozenSeconds, timeRef, onAnswer, onNext, onHurry }: QuestionCardProps) {
  const frozen = frozenSeconds != null
  const totalMs = seconds * 1000
  const clock = useCountdown({
    durationMs: totalMs,
    running: ready && !revealed && !frozen,
    intervalMs: 100,
    onExpire: () => onAnswer(TIMED_OUT, totalMs),
  })
  const secondsLeft = frozen ? frozenSeconds : clock.secondsLeft
  timeRef.current = () => totalMs - clock.msLeft
  const hurry = !revealed && secondsLeft <= 10
  useEffect(() => onHurry(hurry), [hurry, onHurry])

  const nextRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  useEffect(() => {
    if (revealed) nextRef.current?.focus({ preventScroll: true })
  }, [revealed])

  const steps: StepItem[] = outcomes.map((o, i) => ({
    status: i === index && !revealed ? 'current' : o === 'right' ? 'success' : o === 'wrong' ? 'error' : 'pending',
  }))

  const items: ChoiceItem[] = q.options.map((o, i) => ({
    value: String(i),
    label: o.label,
    media: o.art ? (
      <span className="zzz-trivia__option-art" data-kind={o.art.kind}>
        <TriviaArtView art={o.art} />
      </span>
    ) : undefined,
    textValue: o.label,
  }))

  let results: Record<string, ChoiceResult> | undefined
  if (revealed) {
    results = { [String(q.answer)]: chosen === q.answer ? 'correct' : 'revealed' }
    if (chosen != null && chosen >= 0 && chosen !== q.answer) results[String(chosen)] = 'incorrect'
  }

  const verdict = !revealed ? null : chosen === TIMED_OUT ? "Time's up!" : chosen === q.answer ? 'Correct!' : 'Not quite.'
  const promptId = `zzz-trivia-q-${index}`

  return (
    <ContentCard
      className="zzz-trivia__card"
      variant="accent"
      aria-labelledby={promptId}
      eyebrow={
        <span className="zzz-trivia__eyebrow">
          <span>
            Question {index + 1} / {total}
          </span>
          <StepProgress steps={steps} current={index} stepName="Question" statusLabels={{ success: 'correct', error: 'wrong' }} />
        </span>
      }
      media={q.media ? <QuestionMedia q={q} /> : undefined}
      footer={
        revealed ? (
          <Button ref={nextRef} icon={<ChevronRightIcon />} onClick={onNext}>
            {isLast ? 'See my score' : 'Next question'}
          </Button>
        ) : undefined
      }
    >
      <Text as="h2" id={promptId} role="title" className="zzz-trivia__prompt">
        {q.prompt}
      </Text>
      <CountdownBar
        className="zzz-trivia__timer"
        fraction={revealed && chosen === TIMED_OUT ? 0 : frozen ? frozenSeconds / seconds : clock.fraction}
        secondsLeft={revealed && chosen === TIMED_OUT ? 0 : secondsLeft}
        durationMs={totalMs}
        warnAt={10}
        size="sm"
        label="Time left for this question"
      />
      <ChoiceGroup
        className="zzz-trivia__choices"
        aria-labelledby={promptId}
        items={items}
        value={revealed && chosen != null && chosen >= 0 ? String(chosen) : null}
        onValueChange={(v) => onAnswer(Number(v), totalMs - clock.msLeft)}
        results={results}
        locked={revealed || !ready}
        hotkeys="global"
        mediaLayout="inline"
        correctTone="accent"
        announcement={revealed ? `${verdict} The answer is ${LETTERS[q.answer]}: ${q.options[q.answer].label}. ${q.fact}` : undefined}
      />
      {revealed ? (
        <div className="zzz-trivia__reveal" data-result={chosen === q.answer ? 'right' : 'wrong'}>
          <Text as="p" role="bodyXl" className="zzz-trivia__verdict">
            {verdict}
          </Text>
          <Text as="p" role="body" tone="secondary">
            {q.fact}
          </Text>
        </div>
      ) : (
        <Text as="p" role="caption" tone="muted" className="zzz-trivia__hint">
          Press 1–4 or A–D to answer
        </Text>
      )}
    </ContentCard>
  )
}

/**
 * The question's picture. When it cannot be shown (the art state is `missing`, or the image URL fails:
 * an unreachable / hotlink-blocked CDN while the manifest is `ready`), a picture-only question shows
 * its text `clue` over the empty frame, so it stays answerable. The set itself never changes.
 */
function QuestionMedia({ q }: { q: TriviaQuestion }) {
  const art = useGameArtState()
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // An entry without an image renders the empty frame straight away (no error event).
    if (el.querySelector('.zart[data-state="missing"]')) setFailed(true)
    // <img> error events do not bubble: listen in the capture phase.
    const onError = () => setFailed(true)
    el.addEventListener('error', onError, true)
    return () => el.removeEventListener('error', onError, true)
  }, [])
  const showClue = !!q.clue && (failed || art.status === 'missing')
  return (
    <div ref={ref} className="zzz-trivia__media" data-kind={q.media!.kind} data-clue={showClue || undefined}>
      <TriviaArtView art={q.media!} />
      {showClue ? (
        <div className="zzz-trivia__clue">
          <Text as="p" role="label" tone="secondary" className="zzz-trivia__clue-label">
            Picture unavailable · Clue
          </Text>
          <Text as="p" role="bodyXl" className="zzz-trivia__clue-text">
            {q.clue}
          </Text>
        </div>
      ) : null}
    </div>
  )
}

/* ── results + stats ────────────────────────────────────────────────────────────────────── */

interface ResultsProps {
  set: DailySet
  answers: number[]
  outcomes: ReturnType<typeof outcomeOf>[]
  score: number
  total: number
  elapsedMs: number
  record: TriviaRecord
  distribution: number[]
  playedBefore: boolean
  nextAt: Date
  shareUrl: string
}

function Results({ set, answers, outcomes, score, total, elapsedMs, record, distribution, playedBefore, nextAt, shareUrl }: ResultsProps) {
  const grid: StatusGridItem[] = outcomes.map((o, i) => ({
    status: o === 'right' ? 'success' : o === 'wrong' ? 'error' : 'empty',
    label: `Q${i + 1}`,
    tooltip: set.questions[i]?.prompt,
  }))
  const dist = Array.from({ length: total + 1 }, (_, s) => Math.max(0, distribution[s] ?? 0))
  const better = betterThanPercent(dist, score)
  // Story / memory-only runs never saved: show the record as it would be after today.
  const rec = record.lastDate === set.date ? record : nextRecord(record, set.date, score)
  return (
    <div className="zzz-trivia__results">
      <ContentCard
        className="zzz-trivia__card"
        variant="accent"
        eyebrow={`Puzzle #${puzzleNumber(set.date)}`}
        trailing={<span className="zzz-trivia__trailing">{prettyDate(set.date)}</span>}
        title={`You got ${score} out of ${total}`}
        footer={
          <CopyButton getText={() => shareText(set, answers, shareUrl)} copiedLabel="Copied!">
            Share result
          </CopyButton>
        }
      >
        {playedBefore ? <Notice>Already played today</Notice> : null}
        <StatusGrid aria-label="Your answers" items={grid} size="md" statusLabels={{ success: 'Correct', error: 'Wrong', empty: 'Not answered' }} className="zzz-trivia__grid" />
        <dl className="zzz-trivia__facts">
          <div>
            <Text as="dt" role="label" tone="secondary">
              Time taken
            </Text>
            <Text as="dd" role="condensedLg">
              {formatDuration(elapsedMs)}
            </Text>
          </div>
          <div>
            <Text as="dt" role="label" tone="secondary">
              Next puzzle
            </Text>
            <dd>
              <Countdown target={nextAt} format="hms" prefix="in" reachedLabel="Ready! Reload to play" />
            </dd>
          </div>
        </dl>
      </ContentCard>

      <ContentCard className="zzz-trivia__card" eyebrow="Stats" title="Your stats" titleAs="h3">
        <StatTiles columns={3} size="sm">
          <StatTile label="Played" value={rec.played} />
          <StatTile label="Streak" value={rec.streak} sub={rec.streak === 1 ? 'day' : 'days'} highlight />
          <StatTile label="Best" value={`${rec.best}/${total}`} />
        </StatTiles>
        <BarChart
          className="zzz-trivia__chart"
          label="Today's score distribution"
          data={dist.map((v, s) => ({ label: String(s), value: v }))}
          highlight={score}
          markerLabel="You"
          valueDisplay="percent"
          xAxisLabel="Correct answers"
          height={220}
        />
        <Text as="p" role="bodyLg" className="zzz-trivia__better">
          You did better than <span className="zzz-trivia__pct">{better}%</span> of players today.
        </Text>
      </ContentCard>
    </div>
  )
}
