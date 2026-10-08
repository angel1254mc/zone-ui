/**
 * ZZZ Trivia question engine. Pure and deterministic: the same date (YYYY-MM-DD) and the same data
 * always produce the same 5 questions in the same order with the same option order.
 *
 * Every question is generated from data, never invented:
 *  - the committed art manifest (examples/art/art-manifest.json, `npm run art-manifest`: agents:
 *    rank / element / specialty; W-Engines: rank / specialty / advanced stat; Drive Disc sets:
 *    2-piece bonus);
 *  - facts.json (faction / full name / birthday per agent), fetched from the same CDN by
 *    `node scripts/fetch-trivia-data.mjs`.
 * Distractors come from the same category and are filtered so exactly one option is correct.
 * Without a manifest (art state `missing`, or `manifest={null}`) the hand-checked FALLBACK_QUESTIONS
 * are used. Art is always referenced by real id, so a set never changes when images load.
 * The two picture-only kinds ("Who is this agent?", "Which W-Engine is this?") also carry a text
 * `clue` built from the same data, with distractors filtered so the clue fits only the answer: when
 * the manifest is ready but the image CDN is unreachable, the page shows the clue instead of a guess.
 */
import type { GameArtManifest, GameAgent, GameWEngine, GameDriveDiscSet } from '../../art';
import factsJson from './facts.json';
import { FALLBACK_HOSTS, FALLBACK_QUESTIONS } from './fallback';

/* ── types ──────────────────────────────────────────────────────────────────────────────── */

/** Art attached to a question or an option, by real id. Rendered by the page through examples/art. */
export type TriviaArt =
  | { kind: 'agent'; id: string; crop?: 'circle' | 'crop' | 'select' }
  | { kind: 'wengine'; id: string }
  | { kind: 'disc'; id: string }
  | { kind: 'element'; name: string }
  | { kind: 'specialty'; name: string };

export type QuestionKind =
  | 'agentElement'
  | 'agentSpecialty'
  | 'sRank'
  | 'wEngineStat'
  | 'wEngineSpecialty'
  | 'discTwoPiece'
  | 'whoIsAgent'
  | 'whichWEngine'
  | 'agentFaction'
  | 'agentFullName'
  | 'agentBirthday'
  | 'fallback';

export interface TriviaOption {
  /** Stable id (unique within the question). */
  id: string;
  label: string;
  art?: TriviaArt;
}

export interface TriviaQuestion {
  id: string;
  kind: QuestionKind;
  prompt: string;
  /** Big picture shown with the question ("Who is this agent?"). */
  media?: TriviaArt;
  /**
   * Text clue for a question that is otherwise picture-only: it matches exactly the correct option.
   * The page shows it only when `media` cannot be shown (image unreachable), so the question stays
   * answerable without changing the set.
   */
  clue?: string;
  /** Exactly 4 options with unique labels. */
  options: TriviaOption[];
  /** Index of the single correct option. */
  answer: number;
  /** One-line fact shown after the reveal. */
  fact: string;
}

export interface AgentFacts {
  name: string;
  faction: string | null;
  fullName: string | null;
  birthday: string | null;
  attackType: string | null;
}
export interface TriviaFacts {
  agents: Record<string, AgentFacts>;
}

export interface DailySet {
  date: string;
  /** 'game' = generated from the manifest; 'fallback' = the static set. */
  source: 'game' | 'fallback';
  questions: TriviaQuestion[];
  /** Today's host: a real agent id (both sources) and its name. */
  host: { id: string; name: string };
}

export const QUESTIONS_PER_DAY = 5;
/** Seconds per question. */
export const SECONDS_PER_QUESTION = 30;
export const defaultFacts = factsJson as unknown as TriviaFacts;

/* ── seeded RNG ─────────────────────────────────────────────────────────────────────────── */

/** FNV-1a 32-bit. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface Rand {
  next(): number;
  int(n: number): number;
  pick<T>(list: readonly T[]): T;
  shuffle<T>(list: readonly T[]): T[];
}

/** mulberry32 seeded from a string. */
export function createRand(seed: string): Rand {
  let a = hashString(seed) || 1;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (n: number) => Math.floor(next() * n);
  return {
    next,
    int,
    pick: (list) => list[int(list.length)],
    shuffle: (list) => {
      const out = list.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(i + 1);
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}

/* ── dates ──────────────────────────────────────────────────────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, '0');
/** Local calendar date as YYYY-MM-DD. */
export const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const isDateKey = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
/** The day before a YYYY-MM-DD key. */
export function previousDateKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return toDateKey(new Date(y, m - 1, d - 1));
}

/* ── text helpers ───────────────────────────────────────────────────────────────────────── */

/** Strip the game's rich-text tags (`<color=#FF5521>Fire DMG</color>`) and tidy the end. */
export const cleanRichText = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '');
/** Key used to decide whether two labels mean the same thing. */
export const sameKey = (s: string) => cleanRichText(s).toLowerCase();

const uniqueBy = <T>(list: readonly T[], key: (t: T) => string) => {
  const seen = new Set<string>();
  return list.filter((t) => {
    const k = key(t);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/* ── builders ───────────────────────────────────────────────────────────────────────────── */

interface Ctx {
  r: Rand;
  m: GameArtManifest;
  facts: TriviaFacts;
  /** Subjects already used today (agent / W-Engine / set ids), so a day never repeats one. */
  used: Set<string>;
}

type Draft = Omit<TriviaQuestion, 'id' | 'answer' | 'options'> & {
  correct: TriviaOption;
  wrong: TriviaOption[];
};

function finish(r: Rand, d: Draft, id: string): TriviaQuestion {
  const options = r.shuffle([d.correct, ...d.wrong]);
  const q: TriviaQuestion = {
    id,
    kind: d.kind,
    prompt: d.prompt,
    media: d.media,
    fact: d.fact,
    options,
    answer: options.indexOf(d.correct),
  };
  if (d.clue) q.clue = d.clue;
  return q;
}

/** Pick an unused subject satisfying `ok`, mark it used. */
function subject<T extends { id: string }>(c: Ctx, list: readonly T[], ok: (t: T) => boolean): T | null {
  const pool = list.filter((t) => !c.used.has(t.id) && ok(t));
  if (!pool.length) return null;
  const t = c.r.pick(pool);
  c.used.add(t.id);
  return t;
}

/** Three distinct items from `pool` (after `ok`), distinct by `key` and from `taken` keys. */
function distractors<T>(
  c: Ctx,
  pool: readonly T[],
  key: (t: T) => string,
  taken: string[],
  ok: (t: T) => boolean = () => true
): T[] | null {
  const seen = new Set(taken.map((k) => k.toLowerCase()));
  const out: T[] = [];
  for (const t of c.r.shuffle(pool)) {
    const k = key(t).toLowerCase();
    if (seen.has(k) || !ok(t)) continue;
    seen.add(k);
    out.push(t);
    if (out.length === 3) return out;
  }
  return null;
}

const agentOpt = (a: GameAgent): TriviaOption => ({
  id: `agent-${a.id}`,
  label: a.name,
  art: { kind: 'agent', id: a.id, crop: 'circle' },
});
const engineOpt = (w: GameWEngine): TriviaOption => ({
  id: `wengine-${w.id}`,
  label: w.name,
  art: { kind: 'wengine', id: w.id },
});
const valueOpt = (prefix: string, label: string, art?: TriviaArt): TriviaOption => ({
  id: `${prefix}-${sameKey(label).replace(/\W+/g, '-')}`,
  label,
  art,
});

/** Text clue for an agent: rank, attribute, specialty and faction (when known). */
export function agentClue(a: GameAgent, facts: TriviaFacts = defaultFacts): string {
  const faction = facts.agents[a.id]?.faction;
  return [`${a.rank}-Rank`, a.element, a.specialty, faction].filter(Boolean).join(' · ');
}
/** Text clue for a W-Engine: rank, specialty and Advanced Stat. */
export function wEngineClue(w: GameWEngine): string {
  return [`${w.rank}-Rank`, w.specialty, `Advanced Stat: ${w.advancedStat}`].filter(Boolean).join(' · ');
}

const playable = (m: GameArtManifest) => m.agents.filter((a) => a.rank && a.element && a.specialty);

const builders: Record<Exclude<QuestionKind, 'fallback'>, (c: Ctx) => Draft | null> = {
  agentElement(c) {
    const agents = playable(c.m);
    const a = subject(c, agents, () => true);
    if (!a) return null;
    const base = a.baseElement ?? a.element!;
    // Never offer the agent's base element as a "wrong" answer for a variant (Frost is Ice).
    const elements = uniqueBy(
      agents.map((x) => ({
        e: x.element!,
        base: x.baseElement ?? x.element!,
      })),
      (x) => x.e
    );
    const wrong = distractors(
      c,
      elements,
      (x) => x.e,
      [a.element!],
      (x) => x.base !== base && x.e !== base
    );
    if (!wrong) return null;
    return {
      kind: 'agentElement',
      prompt: `What is ${a.name}'s Attribute?`,
      media: { kind: 'agent', id: a.id, crop: 'crop' },
      correct: valueOpt('element', a.element!, {
        kind: 'element',
        name: a.element!,
      }),
      wrong: wrong.map((x) => valueOpt('element', x.e, { kind: 'element', name: x.e })),
      fact: `${a.name} is a ${a.element} agent.`,
    };
  },
  agentSpecialty(c) {
    const agents = playable(c.m);
    const a = subject(c, agents, () => true);
    if (!a) return null;
    const specs = uniqueBy(
      agents.map((x) => x.specialty!),
      (s) => s
    );
    const wrong = distractors(c, specs, (s) => s, [a.specialty!]);
    if (!wrong) return null;
    return {
      kind: 'agentSpecialty',
      prompt: `What is ${a.name}'s Specialty?`,
      media: { kind: 'agent', id: a.id, crop: 'crop' },
      correct: valueOpt('specialty', a.specialty!, {
        kind: 'specialty',
        name: a.specialty!,
      }),
      wrong: wrong.map((s) => valueOpt('specialty', s, { kind: 'specialty', name: s })),
      fact: `${a.name} is a ${a.specialty} agent.`,
    };
  },
  sRank(c) {
    const agents = playable(c.m);
    const a = subject(c, agents, (x) => x.rank === 'S');
    if (!a) return null;
    const wrong = distractors(
      c,
      agents.filter((x) => x.rank === 'A' && !c.used.has(x.id)),
      (x) => x.name,
      [a.name]
    );
    if (!wrong) return null;
    return {
      kind: 'sRank',
      prompt: 'Which of these agents is S-Rank?',
      correct: agentOpt(a),
      wrong: wrong.map(agentOpt),
      fact: `${a.name} is S-Rank; ${wrong.map((x) => x.name).join(', ')} are A-Rank.`,
    };
  },
  wEngineStat(c) {
    const ws = c.m.wEngines;
    const w = subject(c, ws, () => true);
    if (!w) return null;
    const wrong = distractors(
      c,
      ws,
      (x) => x.name,
      [w.name],
      (x) => x.advancedStat !== w.advancedStat && !c.used.has(x.id)
    );
    if (!wrong) return null;
    return {
      kind: 'wEngineStat',
      prompt: `Which W-Engine has the Advanced Stat "${w.advancedStat}"?`,
      correct: engineOpt(w),
      wrong: wrong.map(engineOpt),
      fact: `${w.name}'s Advanced Stat is ${w.advancedStat}.`,
    };
  },
  wEngineSpecialty(c) {
    const ws = c.m.wEngines.filter((x) => x.specialty);
    const w = subject(c, ws, () => true);
    if (!w) return null;
    const specs = uniqueBy(
      ws.map((x) => x.specialty!),
      (s) => s
    );
    const wrong = distractors(c, specs, (s) => s, [w.specialty!]);
    if (!wrong) return null;
    return {
      kind: 'wEngineSpecialty',
      prompt: `Which Specialty is the W-Engine "${w.name}" made for?`,
      media: { kind: 'wengine', id: w.id },
      correct: valueOpt('specialty', w.specialty!, {
        kind: 'specialty',
        name: w.specialty!,
      }),
      wrong: wrong.map((s) => valueOpt('specialty', s, { kind: 'specialty', name: s })),
      fact: `${w.name} is a ${w.specialty} W-Engine.`,
    };
  },
  discTwoPiece(c) {
    const sets = c.m.driveDiscSets;
    const d = subject(c, sets, () => true);
    if (!d) return null;
    const wrong = distractors(c, sets, (x) => sameKey(x.twoPiece), [sameKey(d.twoPiece)]);
    if (!wrong) return null;
    const opt = (x: GameDriveDiscSet) => ({
      id: `disc-${x.id}`,
      label: cleanRichText(x.twoPiece),
    });
    return {
      kind: 'discTwoPiece',
      prompt: `What is the 2-Piece bonus of the Drive Disc set "${d.name}"?`,
      media: { kind: 'disc', id: d.id },
      correct: opt(d),
      wrong: wrong.map(opt),
      fact: `${d.name} (2-Pc): ${cleanRichText(d.twoPiece)}.`,
    };
  },
  whoIsAgent(c) {
    const agents = playable(c.m).filter((x) => x.images.crop);
    const a = subject(c, agents, () => true);
    if (!a) return null;
    // Distractors never share the answer's clue, so the text clue alone still identifies it.
    const clue = agentClue(a, c.facts);
    const wrong = distractors(
      c,
      agents,
      (x) => x.name,
      [a.name],
      (x) => !c.used.has(x.id) && agentClue(x, c.facts) !== clue
    );
    if (!wrong) return null;
    return {
      kind: 'whoIsAgent',
      prompt: 'Who is this agent?',
      media: { kind: 'agent', id: a.id, crop: 'crop' },
      clue,
      correct: { id: `agent-${a.id}`, label: a.name },
      wrong: wrong.map((x) => ({ id: `agent-${x.id}`, label: x.name })),
      fact: `That's ${a.name}!`,
    };
  },
  whichWEngine(c) {
    const ws = c.m.wEngines.filter((x) => x.image);
    const w = subject(c, ws, () => true);
    if (!w) return null;
    // Same-specialty distractors make it a real look-alike question when possible.
    // Distractors never share the answer's clue, so the text clue alone still identifies it.
    const clue = wEngineClue(w);
    const fair = (x: GameWEngine) => wEngineClue(x) !== clue;
    const same = ws.filter((x) => x.specialty === w.specialty && x.id !== w.id && fair(x));
    const wrong = distractors(c, same.length >= 3 ? same : ws, (x) => x.name, [w.name], fair);
    if (!wrong) return null;
    return {
      kind: 'whichWEngine',
      prompt: 'Which W-Engine is this?',
      media: { kind: 'wengine', id: w.id },
      clue,
      correct: { id: `wengine-${w.id}`, label: w.name },
      wrong: wrong.map((x) => ({ id: `wengine-${x.id}`, label: x.name })),
      fact: `That's ${w.name} (${w.rank}-Rank ${w.specialty}).`,
    };
  },
  agentFaction(c) {
    const f = c.facts.agents;
    const agents = playable(c.m).filter((x) => f[x.id]?.faction);
    const a = subject(c, agents, () => true);
    if (!a) return null;
    const factions = uniqueBy(
      Object.values(f)
        .map((x) => x.faction)
        .filter((x): x is string => !!x),
      (s) => s
    );
    const mine = f[a.id].faction!;
    const wrong = distractors(c, factions, (s) => s, [mine]);
    if (!wrong) return null;
    return {
      kind: 'agentFaction',
      prompt: `Which faction is ${a.name} part of?`,
      media: { kind: 'agent', id: a.id, crop: 'crop' },
      correct: valueOpt('faction', mine),
      wrong: wrong.map((s) => valueOpt('faction', s)),
      fact: `${a.name} belongs to ${mine}.`,
    };
  },
  agentFullName(c) {
    const f = c.facts.agents;
    const agents = playable(c.m);
    // Only full names that do not contain the display name ("Anby Demara"), so it is not a giveaway.
    const a = subject(c, agents, (x) => !!f[x.id]?.fullName && !sameKey(f[x.id].fullName!).includes(sameKey(x.name)));
    if (!a) return null;
    const wrong = distractors(
      c,
      agents,
      (x) => x.name,
      [a.name],
      (x) => !c.used.has(x.id)
    );
    if (!wrong) return null;
    return {
      kind: 'agentFullName',
      prompt: `Whose full name is "${f[a.id].fullName}"?`,
      correct: agentOpt(a),
      wrong: wrong.map(agentOpt),
      fact: `${f[a.id].fullName} is ${a.name}'s full name.`,
    };
  },
  agentBirthday(c) {
    const f = c.facts.agents;
    const agents = playable(c.m).filter((x) => f[x.id]?.birthday);
    const count = new Map<string, number>();
    for (const x of agents) count.set(f[x.id].birthday!, (count.get(f[x.id].birthday!) ?? 0) + 1);
    const a = subject(c, agents, (x) => count.get(f[x.id].birthday!) === 1);
    if (!a) return null;
    const day = f[a.id].birthday!;
    const wrong = distractors(
      c,
      agents,
      (x) => x.name,
      [a.name],
      (x) => f[x.id].birthday !== day && !c.used.has(x.id)
    );
    if (!wrong) return null;
    const pretty = day.charAt(0) + day.slice(1, 3).toLowerCase() + day.slice(3);
    return {
      kind: 'agentBirthday',
      prompt: `Whose birthday is on ${pretty}?`,
      correct: agentOpt(a),
      wrong: wrong.map(agentOpt),
      fact: `${a.name}'s birthday is ${pretty}.`,
    };
  },
};

/** The day's mix: every kind once, shuffled, then extra picks to reach `count`. */
const KINDS = Object.keys(builders) as (keyof typeof builders)[];

/* ── public API ─────────────────────────────────────────────────────────────────────────── */

export function generateDailySet(
  manifest: GameArtManifest | null | undefined,
  date: string,
  facts: TriviaFacts = defaultFacts,
  count = QUESTIONS_PER_DAY
): DailySet {
  const r = createRand(`zzz-trivia:${date}`);
  const hostSeed = hashString(`host:${date}`);
  if (!manifest || playable(manifest).length < 8 || manifest.wEngines.length < 8 || manifest.driveDiscSets.length < 4) {
    const questions = r
      .shuffle(FALLBACK_QUESTIONS)
      .slice(0, count)
      .map((q, i) => {
        const correct = q.options[q.answer];
        const options = r.shuffle(q.options);
        return {
          ...q,
          id: `${date}-${i}`,
          options,
          answer: options.indexOf(correct),
        };
      });
    return {
      date,
      source: 'fallback',
      questions,
      host: { ...FALLBACK_HOSTS[hostSeed % FALLBACK_HOSTS.length] },
    };
  }
  const c: Ctx = { r, m: manifest, facts, used: new Set() };
  const order = r.shuffle(KINDS);
  while (order.length < count + 6) order.push(r.pick(KINDS));
  const questions: TriviaQuestion[] = [];
  for (const kind of order) {
    if (questions.length === count) break;
    const d = builders[kind](c);
    if (d) questions.push(finish(r, d, `${date}-${questions.length}`));
  }
  // Host: an agent with full art, not the subject of any question today.
  const hosts = playable(manifest).filter((a) => a.images.full && !c.used.has(a.id));
  const host = hosts.length ? hosts[hostSeed % hosts.length] : playable(manifest)[0];
  return {
    date,
    source: 'game',
    questions,
    host: { id: host.id, name: host.name },
  };
}

/* ── puzzle number / dates ─────────────────────────────────────────────────────────────── */

/** Puzzle #1 is this local date; every later day adds one. */
export const PUZZLE_START = '2026-09-01';

const dayIndex = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  // UTC so DST changes never shift the count.
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
};
/** Puzzle number of a date (1 on PUZZLE_START). Never below 1. */
export const puzzleNumber = (date: string, start = PUZZLE_START) => Math.max(1, dayIndex(date) - dayIndex(start) + 1);

/** The next local midnight after `now` (when the next puzzle unlocks). */
export const nextMidnight = (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

/* ── scoring / share ────────────────────────────────────────────────────────────────────── */

/** Answer value of a question whose timer ran out (counts as wrong). `null` = not answered yet. */
export const TIMED_OUT = -1;
export type TriviaAnswer = number | null;

export type TriviaOutcome = 'right' | 'wrong' | 'pending';
export const outcomeOf = (q: TriviaQuestion | undefined, a: TriviaAnswer | undefined): TriviaOutcome =>
  a == null || !q ? 'pending' : a === q.answer ? 'right' : 'wrong';

export const scoreOf = (set: DailySet, answers: readonly TriviaAnswer[]) =>
  set.questions.filter((q, i) => answers[i] === q.answer).length;

export type TriviaRank = 'S' | 'A' | 'B';
export const rankFor = (score: number, total = QUESTIONS_PER_DAY): TriviaRank =>
  score >= total * 0.9 ? 'S' : score >= total * 0.6 ? 'A' : 'B';

export const SHARE_TITLE = 'ZZZ Daily Trivia';
export const DEFAULT_SHARE_URL = 'https://zzz-trivia.example';

/**
 * The share message (Chiikawa Daily Trivia style):
 *
 *     ZZZ Daily Trivia #30
 *     🟩🟥🟩🟩🟩
 *     4/5
 *     https://…
 */
export function shareText(
  set: DailySet,
  answers: readonly TriviaAnswer[],
  url: string = DEFAULT_SHARE_URL,
  title = SHARE_TITLE
): string {
  const total = set.questions.length;
  const glyph = { right: '🟩', wrong: '🟥', pending: '⬛' } as const;
  const grid = set.questions.map((q, i) => glyph[outcomeOf(q, answers[i])]).join('');
  return [`${title} #${puzzleNumber(set.date)}`, grid, `${scoreOf(set, answers)}/${total}`, url]
    .filter(Boolean)
    .join('\n');
}

/**
 * Share of players (0–100, rounded down) who scored LOWER than `score`, from a score distribution
 * (`distribution[s]` = number of players with score s). 0 when the distribution is empty.
 */
export function betterThanPercent(distribution: readonly number[], score: number): number {
  const total = distribution.reduce((a, b) => a + Math.max(0, b), 0);
  if (!total) return 0;
  const below = distribution.slice(0, Math.max(0, score)).reduce((a, b) => a + Math.max(0, b), 0);
  return Math.floor((100 * below) / total);
}

/** m:ss ("1:07", "0:42"). */
export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ── persistence (today's attempt, streak, best, played) ────────────────────────────────── */

/** Today's attempt. Saved after every answer, so a reload never grants a second try. */
export interface TriviaDay {
  date: string;
  /** Answers given so far (option index or TIMED_OUT). */
  answers: number[];
  /** Time spent answering (sum of per-question times), ms. */
  elapsedMs: number;
  /** Index of a question whose timer started but has no answer yet (a reload counts it as timed out). */
  started: number | null;
}

export interface TriviaRecord {
  /** Last date (YYYY-MM-DD) a full run was completed. */
  lastDate: string | null;
  streak: number;
  best: number;
  /** Days completed. */
  played: number;
  /** The latest attempt (finished or not). */
  day: TriviaDay | null;
}
export const STORAGE_KEY = 'zone-ui:trivia';
export const EMPTY_RECORD: TriviaRecord = {
  lastDate: null,
  streak: 0,
  best: 0,
  played: 0,
  day: null,
};

const toCount = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0);

function readDay(v: unknown): TriviaDay | null {
  if (!v || typeof v !== 'object') return null;
  const d = v as Partial<TriviaDay>;
  if (typeof d.date !== 'string' || !isDateKey(d.date) || !Array.isArray(d.answers)) return null;
  const answers = d.answers.filter((a): a is number => Number.isInteger(a) && a >= TIMED_OUT && a < 4);
  return {
    date: d.date,
    answers,
    elapsedMs: toCount(d.elapsedMs),
    started: Number.isInteger(d.started) ? (d.started as number) : null,
  };
}

/** Read the record; any storage failure (blocked, private mode, bad JSON) yields an empty record. */
export function loadRecord(storage: Pick<Storage, 'getItem'> | null | undefined): TriviaRecord {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_RECORD;
    const v = JSON.parse(raw) as Partial<TriviaRecord> | null;
    if (!v || typeof v !== 'object') return EMPTY_RECORD;
    return {
      lastDate: typeof v.lastDate === 'string' && isDateKey(v.lastDate) ? v.lastDate : null,
      streak: toCount(v.streak),
      best: toCount(v.best),
      played: toCount(v.played),
      day: readDay(v.day),
    };
  } catch {
    return EMPTY_RECORD;
  }
}

/** The record after finishing `date` with `score` (finishing the same day again only updates `best`). */
export function nextRecord(prev: TriviaRecord, date: string, score: number): TriviaRecord {
  const again = prev.lastDate === date;
  const streak = again ? prev.streak : prev.lastDate === previousDateKey(date) ? prev.streak + 1 : 1;
  return {
    ...prev,
    lastDate: date,
    streak,
    best: Math.max(prev.best, score),
    played: again ? prev.played : prev.played + 1,
  };
}

/**
 * The attempt to resume for `date`: answers so far, with a started-but-unanswered question counted as
 * timed out (reloading never resets a running timer). `null` when there is no attempt for that date.
 */
export function resumeDay(record: TriviaRecord, date: string, total = QUESTIONS_PER_DAY): TriviaDay | null {
  const d = record.day;
  if (!d || d.date !== date) return null;
  const answers = d.answers.slice(0, total);
  if (d.started != null && d.started === answers.length && answers.length < total) answers.push(TIMED_OUT);
  return { ...d, answers, started: null };
}

/** Write the record; returns false when storage is unavailable (never throws). */
export function saveRecord(storage: Pick<Storage, 'setItem'> | null | undefined, record: TriviaRecord): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}
