/**
 * Static fallback questions: the text-answerable set the page uses when the art state is `missing`
 * (or when `manifest={null}` is passed). Every fact below was checked against the committed art
 * manifest (examples/art/art-manifest.json, v3.2) or facts.json — nothing is invented.
 * Art is referenced by REAL ids (agents, W-Engines, Drive Disc sets), never by seed, so the set is
 * fixed per date and never depends on whether art has loaded; without art those slots render empty
 * frames and every question stays answerable from its text. The engine shuffles the options.
 */
import type { TriviaQuestion } from './questions'

type Q = Omit<TriviaQuestion, 'id'>

const opts = (prefix: string, labels: string[], art?: (label: string, i: number) => TriviaQuestion['options'][number]['art']) =>
  labels.map((label, i) => ({ id: `${prefix}-${i}`, label, art: art?.(label, i) }))
const el = (name: string) => ({ kind: 'element' as const, name })
const sp = (name: string) => ({ kind: 'specialty' as const, name })
const face = (id: string) => ({ kind: 'agent' as const, id, crop: 'circle' as const })
const bust = (id: string) => ({ kind: 'agent' as const, id, crop: 'crop' as const })

/** Real agent ids (art-manifest.json). */
const AGENT = {
  Anby: '1011',
  Nekomata: '1021',
  Nicole: '1031',
  Corin: '1061',
  Billy: '1081',
  Koleda: '1101',
  Ben: '1121',
  Soukaku: '1131',
  Lycaon: '1141',
  Grace: '1181',
  Ellen: '1191',
  ZhuYuan: '1241',
} as const
/** Real W-Engine ids. */
const ENGINE = { SliceOfTime: '13002', StreetSuperstar: '13001', SteamOven: '13005', BunnyBand: '13010' } as const
/** Real Drive Disc set ids. */
const DISC = { WoodpeckerElectro: '31000', ShockstarDisco: '31200', SwingJazz: '31600' } as const

/** Real-art fallback hosts (id + name), picked per date. */
export const FALLBACK_HOSTS: readonly { id: string; name: string }[] = [
  { id: AGENT.Anby, name: 'Anby' },
  { id: AGENT.Nicole, name: 'Nicole' },
  { id: AGENT.Ellen, name: 'Ellen' },
  { id: AGENT.ZhuYuan, name: 'Zhu Yuan' },
  { id: AGENT.Koleda, name: 'Koleda' },
  { id: AGENT.Lycaon, name: 'Lycaon' },
]

/** answer is always 0 here (the first label); the engine shuffles. */
export const FALLBACK_QUESTIONS: Q[] = [
  { kind: 'fallback', prompt: "What is Anby's Attribute?", media: bust(AGENT.Anby), options: opts('a', ['Electric', 'Fire', 'Ice', 'Ether'], el), answer: 0, fact: 'Anby is an Electric agent.' },
  { kind: 'fallback', prompt: "What is Nicole's Specialty?", media: bust(AGENT.Nicole), options: opts('b', ['Support', 'Attack', 'Stun', 'Defense'], sp), answer: 0, fact: 'Nicole is a Support agent.' },
  { kind: 'fallback', prompt: 'Which of these agents is S-Rank?', options: opts('c', ['Ellen', 'Billy', 'Anby', 'Corin'], (_, i) => face([AGENT.Ellen, AGENT.Billy, AGENT.Anby, AGENT.Corin][i])), answer: 0, fact: 'Ellen is S-Rank; Billy, Anby and Corin are A-Rank.' },
  { kind: 'fallback', prompt: 'What is the 2-Piece bonus of the Drive Disc set "Woodpecker Electro"?', media: { kind: 'disc', id: DISC.WoodpeckerElectro }, options: opts('d', ['CRIT Rate +8%', 'PEN Ratio +8%', 'Impact +6%', 'Energy Regen +20%']), answer: 0, fact: 'Woodpecker Electro (2-Pc): CRIT Rate +8%.' },
  { kind: 'fallback', prompt: 'What is the 2-Piece bonus of the Drive Disc set "Swing Jazz"?', media: { kind: 'disc', id: DISC.SwingJazz }, options: opts('e', ['Energy Regen +20%', 'DEF +16%', 'ATK +10%', 'CRIT DMG +16%']), answer: 0, fact: 'Swing Jazz (2-Pc): Energy Regen +20%.' },
  { kind: 'fallback', prompt: 'Which faction is Lycaon part of?', media: bust(AGENT.Lycaon), options: opts('f', ['Victoria Housekeeping Co.', 'Cunning Hares', 'Sons of Calydon', 'Belobog Heavy Industries']), answer: 0, fact: 'Lycaon belongs to Victoria Housekeeping Co.' },
  { kind: 'fallback', prompt: 'Which faction is Koleda part of?', media: bust(AGENT.Koleda), options: opts('g', ['Belobog Heavy Industries', 'Hollow Special Operations Section 6', 'Cunning Hares', 'Victoria Housekeeping Co.']), answer: 0, fact: 'Koleda belongs to Belobog Heavy Industries.' },
  { kind: 'fallback', prompt: 'Whose full name is "Nekomiya Mana"?', options: opts('h', ['Nekomata', 'Nicole', 'Corin', 'Soukaku'], (_, i) => face([AGENT.Nekomata, AGENT.Nicole, AGENT.Corin, AGENT.Soukaku][i])), answer: 0, fact: "Nekomiya Mana is Nekomata's full name." },
  { kind: 'fallback', prompt: "What is Grace's Specialty?", media: bust(AGENT.Grace), options: opts('i', ['Anomaly', 'Attack', 'Stun', 'Support'], sp), answer: 0, fact: 'Grace is an Anomaly agent.' },
  { kind: 'fallback', prompt: "What is Ben's Specialty?", media: bust(AGENT.Ben), options: opts('j', ['Defense', 'Attack', 'Anomaly', 'Support'], sp), answer: 0, fact: 'Ben is a Defense agent.' },
  { kind: 'fallback', prompt: "What is Zhu Yuan's Attribute?", media: bust(AGENT.ZhuYuan), options: opts('k', ['Ether', 'Physical', 'Fire', 'Electric'], el), answer: 0, fact: 'Zhu Yuan is an Ether agent.' },
  { kind: 'fallback', prompt: 'Which W-Engine has the Advanced Stat "PEN Ratio"?', options: opts('l', ['Slice of Time', 'Street Superstar', 'Steam Oven', 'Bunny Band'], (_, i) => ({ kind: 'wengine', id: [ENGINE.SliceOfTime, ENGINE.StreetSuperstar, ENGINE.SteamOven, ENGINE.BunnyBand][i] })), answer: 0, fact: "Slice of Time's Advanced Stat is PEN Ratio." },
  { kind: 'fallback', prompt: 'What is the 2-Piece bonus of the Drive Disc set "Shockstar Disco"?', media: { kind: 'disc', id: DISC.ShockstarDisco }, options: opts('m', ['Impact +6%', 'HP +10%', 'Anomaly Proficiency +30', 'DEF +16%']), answer: 0, fact: 'Shockstar Disco (2-Pc): Impact +6%.' },
  { kind: 'fallback', prompt: 'Whose birthday is on Feb 20?', options: opts('n', ['Anby', 'Nicole', 'Billy', 'Nekomata'], (_, i) => face([AGENT.Anby, AGENT.Nicole, AGENT.Billy, AGENT.Nekomata][i])), answer: 0, fact: "Anby's birthday is Feb 20." },
  { kind: 'fallback', prompt: "What is Lycaon's Attribute?", media: bust(AGENT.Lycaon), options: opts('o', ['Ice', 'Fire', 'Physical', 'Electric'], el), answer: 0, fact: 'Lycaon is an Ice agent.' },
  { kind: 'fallback', prompt: 'Which Specialty is the W-Engine "Steam Oven" made for?', media: { kind: 'wengine', id: ENGINE.SteamOven }, options: opts('p', ['Stun', 'Attack', 'Anomaly', 'Defense'], sp), answer: 0, fact: 'Steam Oven is a Stun W-Engine.' },
]
