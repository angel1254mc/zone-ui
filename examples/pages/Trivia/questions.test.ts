import type { GameArtManifest } from '../../art'
import artManifest from '../../art/art-manifest.json'
import {
    cleanRichText,
    defaultFacts,
    generateDailySet,
    loadRecord,
    nextRecord,
    previousDateKey,
    rankFor,
    saveRecord,
    sameKey,
    shareText,
    STORAGE_KEY,
    EMPTY_RECORD,
    TIMED_OUT,
    PUZZLE_START,
    betterThanPercent,
    formatDuration,
    nextMidnight,
    puzzleNumber,
    resumeDay,
    scoreOf,
    agentClue,
    wEngineClue,
    type TriviaArt,
    type TriviaQuestion,
} from './questions'
import { FALLBACK_HOSTS, FALLBACK_QUESTIONS } from './fallback'
import { fixtureManifest } from './fixture'

/** The committed manifest (examples/art/art-manifest.json): real data, always present. */
const realManifest = artManifest as unknown as GameArtManifest

const DATES = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(2026, 0, 1 + i * 7)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

function expectWellFormed(q: TriviaQuestion) {
    expect(q.options).toHaveLength(4)
    const labels = q.options.map((o) => sameKey(o.label))
    expect(new Set(labels).size).toBe(4)
    expect(new Set(q.options.map((o) => o.id)).size).toBe(4)
    expect(q.answer).toBeGreaterThanOrEqual(0)
    expect(q.answer).toBeLessThan(4)
    expect(q.prompt.length).toBeGreaterThan(5)
}

/** Re-derive the truth of every generated question from the data: exactly one option is correct. */
function correctOptions(q: TriviaQuestion, m: GameArtManifest): number[] {
    const agentByName = new Map(m.agents.map((a) => [a.name, a]))
    const engineByName = new Map(m.wEngines.map((w) => [w.name, w]))
    const subjectAgent =
        q.media?.kind === 'agent'
            ? m.agents.find((a) => a.id === (q.media as { id?: string }).id)
            : undefined
    const facts = defaultFacts.agents
    const truth = (label: string): boolean => {
        switch (q.kind) {
            case 'agentElement':
                return subjectAgent!.element === label
            case 'agentSpecialty':
                return subjectAgent!.specialty === label
            case 'sRank':
                return agentByName.get(label)!.rank === 'S'
            case 'wEngineStat': {
                const stat = /"(.+)"/.exec(q.prompt)![1]
                return engineByName.get(label)!.advancedStat === stat
            }
            case 'wEngineSpecialty': {
                const w = m.wEngines.find(
                    (x) => x.id === (q.media as { id: string }).id
                )!
                return w.specialty === label
            }
            case 'discTwoPiece': {
                const d = m.driveDiscSets.find(
                    (x) => x.id === (q.media as { id: string }).id
                )!
                return sameKey(d.twoPiece) === sameKey(label)
            }
            case 'whoIsAgent':
                return subjectAgent!.name === label
            case 'whichWEngine':
                return (
                    (q.media as { id: string }).id ===
                    engineByName.get(label)!.id
                )
            case 'agentFaction':
                return facts[subjectAgent!.id].faction === label
            case 'agentFullName': {
                const full = /"(.+)"/.exec(q.prompt)![1]
                return facts[agentByName.get(label)!.id].fullName === full
            }
            case 'agentBirthday': {
                const day = /on (.+)\?$/.exec(q.prompt)![1].toUpperCase()
                return facts[agentByName.get(label)!.id].birthday === day
            }
            default:
                throw new Error(`unexpected kind ${q.kind}`)
        }
    }
    return q.options.flatMap((o, i) => (truth(o.label) ? [i] : []))
}

describe('generateDailySet', () => {
    it('is deterministic for a date and differs between dates', () => {
        const a = generateDailySet(fixtureManifest, '2026-09-30')
        const b = generateDailySet(fixtureManifest, '2026-09-30')
        expect(b).toEqual(a)
        const c = generateDailySet(fixtureManifest, '2026-10-01')
        expect(c.questions.map((q) => q.prompt)).not.toEqual(
            a.questions.map((q) => q.prompt)
        )
    })

    it('builds 5 well-formed questions from a manifest, with a host agent', () => {
        const set = generateDailySet(fixtureManifest, '2026-09-30')
        expect(set.source).toBe('game')
        expect(set.questions).toHaveLength(5)
        set.questions.forEach(expectWellFormed)
        expect(fixtureManifest.agents.some((a) => a.id === set.host.id)).toBe(
            true
        )
    })

    it('every fixture question has exactly one correct option (re-derived from the data)', () => {
        for (const date of DATES.slice(0, 20)) {
            for (const q of generateDailySet(fixtureManifest, date).questions) {
                expect(
                    correctOptions(q, fixtureManifest),
                    `${date} ${q.prompt}`
                ).toEqual([q.answer])
            }
        }
    })

    it('with the committed manifest: 60 days of correct, well-formed questions', () => {
        const kinds = new Set<string>()
        for (const date of DATES) {
            const set = generateDailySet(realManifest, date)
            expect(set.questions).toHaveLength(5)
            for (const q of set.questions) {
                expectWellFormed(q)
                expect(
                    correctOptions(q, realManifest),
                    `${date} ${q.prompt} ${q.options.map((o) => o.label)}`
                ).toEqual([q.answer])
                kinds.add(q.kind)
            }
        }
        expect(kinds.size).toBeGreaterThanOrEqual(10)
    })

    it('picture-only questions carry a text clue that matches exactly the correct option (CDN down: still answerable)', () => {
        let seen = 0
        for (const m of [realManifest, fixtureManifest]) {
            for (const date of DATES) {
                for (const q of generateDailySet(m, date).questions) {
                    // Every other kind names its subject (or its options carry labels) in the text.
                    if (q.kind !== 'whoIsAgent' && q.kind !== 'whichWEngine') {
                        expect(q.clue, `${date} ${q.kind}`).toBeUndefined()
                        continue
                    }
                    seen++
                    expect(q.clue, `${date} ${q.kind}`).toBeTruthy()
                    const clueOf = (optionId: string) => {
                        const [kind, id] = optionId.split(/-(.+)/)
                        if (kind === 'agent')
                            return agentClue(
                                m.agents.find((a) => a.id === id)!,
                                defaultFacts
                            )
                        return wEngineClue(m.wEngines.find((w) => w.id === id)!)
                    }
                    const matching = q.options.flatMap((o, i) =>
                        clueOf(o.id) === q.clue ? [i] : []
                    )
                    expect(matching, `${date} ${q.prompt} ${q.clue}`).toEqual([
                        q.answer,
                    ])
                }
            }
        }
        expect(seen).toBeGreaterThan(10)
    })

    it('falls back to the static set without a manifest', () => {
        const set = generateDailySet(null, '2026-09-30')
        expect(set.source).toBe('fallback')
        expect(set.questions).toHaveLength(5)
        set.questions.forEach(expectWellFormed)
        for (const q of set.questions) {
            const original = FALLBACK_QUESTIONS.find(
                (f) => f.prompt === q.prompt
            )!
            expect(q.options[q.answer].label).toBe(
                original.options[original.answer].label
            )
        }
        expect(generateDailySet(null, '2026-09-30')).toEqual(set)
        // A real agent hosts the fallback day too (its art is an empty frame without a manifest).
        expect(FALLBACK_HOSTS).toContainEqual(set.host)
    })

    it('the fallback set references art by real id only (never by seed), so it never changes when art loads', () => {
        const arts = FALLBACK_QUESTIONS.flatMap((q) => [
            q.media,
            ...q.options.map((o) => o.art),
        ]).filter((a) => a != null)
        expect(arts.length).toBeGreaterThan(0)
        for (const art of arts) {
            expect(art).not.toHaveProperty('seed')
            if (art.kind === 'agent')
                expect(
                    realManifest.agents.some((a) => a.id === art.id),
                    art.id
                ).toBe(true)
            if (art.kind === 'wengine')
                expect(
                    realManifest.wEngines.some((w) => w.id === art.id),
                    art.id
                ).toBe(true)
            if (art.kind === 'disc')
                expect(
                    realManifest.driveDiscSets.some((d) => d.id === art.id),
                    art.id
                ).toBe(true)
        }
        for (const h of FALLBACK_HOSTS)
            expect(realManifest.agents.find((a) => a.id === h.id)?.name).toBe(
                h.name
            )
    })

    it('the fallback facts agree with the committed manifest', () => {
        const byName = (n: string) =>
            realManifest.agents.find((a) => a.name === n)!
        const idOf = (art: TriviaArt | undefined) =>
            art && 'id' in art ? art.id : undefined
        for (const q of FALLBACK_QUESTIONS) {
            const mediaId = idOf(q.media)
            const subject =
                q.media?.kind === 'agent'
                    ? realManifest.agents.find((a) => a.id === mediaId)
                    : undefined
            // The pictured agent is the one the prompt names.
            if (subject) expect(q.prompt).toContain(subject.name)
            const right = q.options[q.answer].label
            if (/Attribute\?$/.test(q.prompt))
                expect(subject!.element).toBe(right)
            if (/Specialty\?$/.test(q.prompt) && subject)
                expect(subject.specialty).toBe(right)
            if (/S-Rank/.test(q.prompt)) {
                expect(byName(right).rank).toBe('S')
                q.options
                    .filter((o) => o.label !== right)
                    .forEach((o) => expect(byName(o.label).rank).not.toBe('S'))
            }
            // Option art shows the agent / W-Engine the label names.
            for (const o of q.options) {
                const id = idOf(o.art)
                if (o.art?.kind === 'agent')
                    expect(
                        realManifest.agents.find((a) => a.id === id)?.name
                    ).toBe(o.label)
                if (o.art?.kind === 'wengine')
                    expect(
                        realManifest.wEngines.find((w) => w.id === id)?.name
                    ).toBe(o.label)
            }
            if (q.media?.kind === 'disc')
                expect(q.prompt).toContain(
                    realManifest.driveDiscSets.find((d) => d.id === mediaId)!
                        .name
                )
            if (q.media?.kind === 'wengine')
                expect(q.prompt).toContain(
                    realManifest.wEngines.find((w) => w.id === mediaId)!.name
                )
        }
    })

    it('every static fallback question is well-formed', () => {
        FALLBACK_QUESTIONS.forEach((q) => expectWellFormed({ ...q, id: 'x' }))
    })
})

describe('helpers', () => {
    it('strips rich text', () => {
        expect(cleanRichText('<color=#FF5521>Fire DMG</color> +10%.')).toBe(
            'Fire DMG +10%'
        )
    })
    it('ranks scores', () => {
        expect(rankFor(5)).toBe('S')
        expect(rankFor(4)).toBe('A')
        expect(rankFor(9, 10)).toBe('S')
        expect(rankFor(6, 10)).toBe('A')
        expect(rankFor(5, 10)).toBe('B')
    })
    it('previousDateKey crosses months and years', () => {
        expect(previousDateKey('2026-03-01')).toBe('2026-02-28')
        expect(previousDateKey('2026-01-01')).toBe('2025-12-31')
    })
    it('share text: title + puzzle number, emoji grid, score, url', () => {
        const set = generateDailySet(null, '2026-09-30')
        const answers = set.questions.map((q, i) =>
            i === 1 ? (q.answer + 1) % 4 : i === 3 ? TIMED_OUT : q.answer
        )
        expect(scoreOf(set, answers)).toBe(3)
        expect(shareText(set, answers, 'https://trivia.test')).toBe(
            [
                'ZZZ Daily Trivia #30',
                '🟩🟥🟩🟥🟩',
                '3/5',
                'https://trivia.test',
            ].join(String.fromCharCode(10))
        )
        // Unanswered questions are black squares.
        expect(
            shareText(set, [set.questions[0].answer]).split(
                String.fromCharCode(10)
            )[1]
        ).toBe('🟩⬛⬛⬛⬛')
    })
    it('puzzle numbers count days from the start date (DST-safe)', () => {
        expect(puzzleNumber(PUZZLE_START)).toBe(1)
        expect(puzzleNumber('2026-09-30')).toBe(30)
        expect(puzzleNumber('2026-11-02')).toBe(63)
        expect(puzzleNumber('2020-01-01')).toBe(1)
    })
    it('next midnight, durations and "better than" percent', () => {
        expect(nextMidnight(new Date(2026, 8, 30, 12)).getTime()).toBe(
            new Date(2026, 9, 1).getTime()
        )
        expect(formatDuration(42_400)).toBe('0:42')
        expect(formatDuration(67_000)).toBe('1:07')
        expect(betterThanPercent([10, 10, 20, 30, 20, 10], 3)).toBe(40)
        expect(betterThanPercent([10, 10, 20, 30, 20, 10], 0)).toBe(0)
        expect(betterThanPercent([], 3)).toBe(0)
    })
})

describe('streak record', () => {
    it('counts consecutive days, keeps the streak on a replay and resets after a gap', () => {
        let r = nextRecord(EMPTY_RECORD, '2026-09-29', 3)
        expect(r).toMatchObject({
            lastDate: '2026-09-29',
            streak: 1,
            best: 3,
            played: 1,
        })
        r = nextRecord(r, '2026-09-30', 2)
        expect(r).toMatchObject({
            lastDate: '2026-09-30',
            streak: 2,
            best: 3,
            played: 2,
        })
        r = nextRecord(r, '2026-09-30', 5)
        expect(r).toMatchObject({
            lastDate: '2026-09-30',
            streak: 2,
            best: 5,
            played: 2,
        })
        r = nextRecord(r, '2026-10-05', 1)
        expect(r).toMatchObject({ streak: 1, played: 3 })
    })

    it('never throws when storage fails or holds garbage', () => {
        const throwing = {
            getItem: () => {
                throw new Error('SecurityError')
            },
            setItem: () => {
                throw new Error('QuotaExceeded')
            },
        }
        expect(loadRecord(throwing)).toEqual(EMPTY_RECORD)
        expect(
            saveRecord(throwing, {
                ...EMPTY_RECORD,
                lastDate: '2026-09-30',
                streak: 1,
                best: 5,
            })
        ).toBe(false)
        expect(loadRecord(null)).toEqual(EMPTY_RECORD)
        expect(loadRecord({ getItem: () => '{nope' })).toEqual(EMPTY_RECORD)
        expect(loadRecord({ getItem: () => 'null' })).toEqual(EMPTY_RECORD)
        // An old payload (before played / day existed) still loads.
        expect(
            loadRecord({
                getItem: () => '{"lastDate":"2026-09-29","streak":2,"best":4}',
            })
        ).toEqual({
            ...EMPTY_RECORD,
            lastDate: '2026-09-29',
            streak: 2,
            best: 4,
        })
        // Garbage answers are dropped.
        expect(
            loadRecord({
                getItem: () =>
                    '{"day":{"date":"2026-09-30","answers":[1,"x",9,-1],"elapsedMs":-5}}',
            }).day
        ).toEqual({
            date: '2026-09-30',
            answers: [1, -1],
            elapsedMs: 0,
            started: null,
        })
    })

    it('round-trips through storage', () => {
        const map = new Map<string, string>()
        const storage = {
            getItem: (k: string) => map.get(k) ?? null,
            setItem: (k: string, v: string) => void map.set(k, v),
        }
        const rec = {
            lastDate: '2026-09-30',
            streak: 4,
            best: 5,
            played: 9,
            day: {
                date: '2026-09-30',
                answers: [0, 1, -1, 2, 3],
                elapsedMs: 61_000,
                started: null,
            },
        }
        expect(saveRecord(storage, rec)).toBe(true)
        expect(map.has(STORAGE_KEY)).toBe(true)
        expect(loadRecord(storage)).toEqual(rec)
    })

    it('resumes only the same day, counting a started-but-unanswered question as timed out', () => {
        const day = {
            date: '2026-09-30',
            answers: [2, 1],
            elapsedMs: 9000,
            started: 2,
        }
        const rec = { ...EMPTY_RECORD, day }
        expect(resumeDay(rec, '2026-10-01')).toBeNull()
        expect(resumeDay(rec, '2026-09-30')).toEqual({
            ...day,
            answers: [2, 1, TIMED_OUT],
            started: null,
        })
        expect(
            resumeDay(
                { ...EMPTY_RECORD, day: { ...day, started: null } },
                '2026-09-30'
            )!.answers
        ).toEqual([2, 1])
    })
})
