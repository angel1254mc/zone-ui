/**
 * The host's reaction lines. Deliberately generic (quiz-show flavour addressed to "Proxy"): no
 * character-specific dialogue or lore is attributed to the real agent shown as today's host.
 */
import { hashString } from './questions'

export const HOST_LINES = {
    intro: [
        'Five questions, thirty seconds each. Ready, Proxy?',
        "Daily Trivia time! Let's see what you know.",
        'Fresh questions, straight off the Inter-Knot.',
    ],
    ask: [
        'Think fast!',
        'Take your time… but not too much.',
        'Which one will it be?',
        'Trust your gut, Proxy.',
    ],
    hurry: ['Clock’s ticking!', 'Ten seconds, Proxy!', 'Hurry, hurry!'],
    correct: [
        'Nice one, Proxy!',
        'Spot on!',
        'Sharp as ever!',
        "That's the one!",
        'Textbook!',
    ],
    wrong: [
        'Not quite…',
        'Ooh, so close!',
        'Not this time…',
        'Hmm, not that one.',
    ],
    timeout: ["Time's up!", 'Too slow, Proxy!', 'The clock wins this one.'],
    /** By score out of 5 (index = score). */
    results: [
        "Rough day? Tomorrow's a brand-new set!",
        'One is better than none. See you tomorrow!',
        'Two down. Tomorrow we go higher!',
        'Solid run, Proxy!',
        'So close to perfect!',
        'Flawless work, Proxy! Same time tomorrow?',
    ],
    played: [
        "You've already played today. Come back tomorrow!",
        'One try a day, Proxy. New set at midnight!',
    ],
} as const

/** Deterministic pick so a given date/question always gets the same line (stable stories). */
export function hostLine(
    list: readonly string[],
    ...salt: (string | number)[]
): string {
    return list[hashString(salt.join(':')) % list.length]
}

/** The results line for `score` of `total` (scaled onto the 0–5 list). */
export function resultLine(score: number, total: number): string {
    const i =
        total > 0
            ? Math.round((score / total) * (HOST_LINES.results.length - 1))
            : 0
    return HOST_LINES.results[
        Math.max(0, Math.min(HOST_LINES.results.length - 1, i))
    ]
}
