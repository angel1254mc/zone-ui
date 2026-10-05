

export type NewsCategory = 'news' | 'notices' | 'events'

export interface NewsPost {
  id: string
  category: NewsCategory
  date: string
  title: string
  description: string
  /**
   * Banner art (real art only): an agent bust (`crop`, cover-cropped on the face), or an in-game
   * Inter-Knot event namecard by id (`ImgCardEvent##`, cover-cropped; `position` = object-position).
   */
  art: { kind: 'agent'; agentId: string } | { kind: 'namecard'; id: string; position?: string }
  isNew?: boolean
}

export const CATEGORY_LABEL: Record<NewsCategory, string> = {
  news: 'News',
  notices: 'Notices',
  events: 'Events',
}

export const NEWS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'notices', label: 'Notices' },
  { value: 'events', label: 'Events' },
] as const

export type NewsTab = (typeof NEWS_TABS)[number]['value']

/** Cards per page of the grid. */
export const PAGE_SIZE = 6

/** Newest first. */
export const NEWS_POSTS: readonly NewsPost[] = [
  {
    id: 'n01',
    category: 'events',
    date: '2026/09/28',
    title: 'Hollow Zero Night Shift: double Dennies weekend',
    description: 'Clock in after midnight and every commission pays out twice. Bring snacks for the Bangboo.',
    art: { kind: 'namecard', id: 'ImgCardEvent09' },
    isNew: true,
  },
  {
    id: 'n02',
    category: 'news',
    date: '2026/09/26',
    title: 'Victoria Housekeeping takes on a new contract',
    description: 'Word on the Inter-Knot is that Ellen was spotted near Lumina Square with a very large shark-shaped umbrella.',
    art: { kind: 'agent', agentId: '1191' },
    isNew: true,
  },
  {
    id: 'n03',
    category: 'notices',
    date: '2026/09/25',
    title: 'Scheduled maintenance for the Inter-Knot relay',
    description: 'The relay goes quiet for about five hours while the HDD gets dusted. Compensation is waiting in your mail.',
    art: { kind: 'namecard', id: 'ImgCardEvent04' },
    isNew: true,
  },
  {
    id: 'n04',
    category: 'news',
    date: '2026/09/22',
    title: 'Section 6 field report: a quiet week, allegedly',
    description: 'Miyabi files a two-line report. Harumasa files a forty-page complaint about the two-line report.',
    art: { kind: 'agent', agentId: '1091' },
  },
  {
    id: 'n05',
    category: 'events',
    date: '2026/09/20',
    title: 'Random Play movie marathon: vote for the lineup',
    description: 'Pick three tapes, win a stack of film rolls. Ties are settled by whoever brings the best popcorn.',
    art: { kind: 'namecard', id: 'ImgCardEvent06' },
  },
  {
    id: 'n06',
    category: 'notices',
    date: '2026/09/18',
    title: 'Known issue: Bangboo keep stealing the remote',
    description: 'We are aware of the issue and have assigned our best Proxy to negotiate with the Bangboo union.',
    art: { kind: 'namecard', id: 'ImgCardEvent02' },
  },
  {
    id: 'n07',
    category: 'news',
    date: '2026/09/15',
    title: 'Cunning Hares open a second-hand weapons stall',
    description: 'Nicole promises fair prices. Billy promises nothing, but he does hand out free stickers.',
    art: { kind: 'agent', agentId: '1031' },
  },
  {
    id: 'n08',
    category: 'events',
    date: '2026/09/12',
    title: 'Belobog Heavy Industries open house',
    description: 'Hard hats are mandatory. Koleda will personally demolish one (1) wall for the closing ceremony.',
    art: { kind: 'agent', agentId: '1101' },
  },
  {
    id: 'n09',
    category: 'notices',
    date: '2026/09/10',
    title: 'Updated community guidelines for the Inter-Knot',
    description: 'Be kind, keep spoilers tagged, and do not post photos of other people’s Bangboo without consent.',
    art: { kind: 'namecard', id: 'ImgCardEvent03' },
  },
  {
    id: 'n10',
    category: 'news',
    date: '2026/09/07',
    title: 'New Eridu Public Security names a new deputy chief',
    description: 'Zhu Yuan declined to comment, citing paperwork. Qingyi commented at length, citing poetry.',
    art: { kind: 'agent', agentId: '1241' },
  },
  {
    id: 'n11',
    category: 'events',
    date: '2026/09/04',
    title: 'Sixth Street ramen eating challenge returns',
    description: 'Finish the Hollow-sized bowl in under ten minutes and your name goes on the wall forever.',
    art: { kind: 'namecard', id: 'ImgCardEvent23' },
  },
  {
    id: 'n12',
    category: 'news',
    date: '2026/09/01',
    title: 'Jane Doe sighted at the Ballet Twins, again',
    description: 'The Criminal Investigation Special Response Team would like everyone to stop asking about it.',
    art: { kind: 'agent', agentId: '1261' },
  },
  {
    id: 'n13',
    category: 'notices',
    date: '2026/08/29',
    title: 'Proxy licence renewals now open',
    description: 'Renew before the end of the month to keep your Inter-Knot level badge and your dignity.',
    art: { kind: 'namecard', id: 'ImgCardEvent05' },
  },
  {
    id: 'n14',
    category: 'events',
    date: '2026/08/25',
    title: 'Stars of Lyra rooftop concert',
    description: 'Astra Yao headlines a one-night-only show. Tickets are free, the queue is not.',
    art: { kind: 'agent', agentId: '1311' },
  },
]

export function filterPosts(tab: NewsTab): NewsPost[] {
  return tab === 'all' ? [...NEWS_POSTS] : NEWS_POSTS.filter((p) => p.category === tab)
}

export interface DispatchAgent {
  id: string
  name: string
  faction: string
  element: string
  specialty: string
  /** One original line of flavour text. */
  blurb: string
}

/** Featured agents (ids from the committed art manifest; names used when the manifest is unavailable). */
export const FEATURED_AGENTS: readonly DispatchAgent[] = [
  { id: '1191', name: 'Ellen', faction: 'Victoria Housekeeping', element: 'Ice', specialty: 'Attack', blurb: 'Off the clock at 5 p.m. sharp. Do not make her work overtime.' },
  { id: '1091', name: 'Miyabi', faction: 'Section 6', element: 'Frost', specialty: 'Anomaly', blurb: 'The youngest Void Hunter on record, and the calmest person in any room.' },
  { id: '1241', name: 'Zhu Yuan', faction: 'Public Security', element: 'Ether', specialty: 'Attack', blurb: 'By the book, every page of it, with a very large gun.' },
  { id: '1261', name: 'Jane', faction: 'Criminal Investigation', element: 'Physical', specialty: 'Anomaly', blurb: 'Undercover, under suspicion and always one step ahead.' },
  { id: '1031', name: 'Nicole', faction: 'Cunning Hares', element: 'Ether', specialty: 'Support', blurb: 'Runs the Hares, the books and occasionally from creditors.' },
  { id: '1011', name: 'Anby', faction: 'Cunning Hares', element: 'Electric', specialty: 'Stun', blurb: 'Learns everything from movies. It works more often than it should.' },
  { id: '1311', name: 'Astra Yao', faction: 'Stars of Lyra', element: 'Ether', specialty: 'Support', blurb: 'Headliner, diva and the best-kept secret of the night shift.' },
  { id: '1101', name: 'Koleda', faction: 'Belobog Heavy Industries', element: 'Fire', specialty: 'Stun', blurb: 'Small president, big hammer, bigger plans.' },
  { id: '1141', name: 'Lycaon', faction: 'Victoria Housekeeping', element: 'Ice', specialty: 'Stun', blurb: 'Impeccable manners, impeccable suit, impeccable kick.' },
]

/** The agent drawn in the hero (full-body art). */
export const HERO_AGENT_ID = '1191'

export interface FaqItem {
  value: string
  question: string
  answer: string
}

export const FAQ: readonly FaqItem[] = [
  {
    value: 'what',
    question: 'What is the Inter-Knot Dispatch?',
    answer:
      'A fan-made news board for Proxies: patch notes, event schedules and gossip from New Eridu, collected in one place. It is not affiliated with the game’s publisher.',
  },
  {
    value: 'often',
    question: 'How often is the dispatch updated?',
    answer: 'Usually every couple of days, and right after maintenance. Subscribe below to get a weekly digest by email.',
  },
  {
    value: 'submit',
    question: 'Can I submit a story or a tip?',
    answer: 'Yes. Reply to any newsletter email with your tip. We read everything, even the ones written entirely in Bangboo.',
  },
  {
    value: 'unsubscribe',
    question: 'How do I unsubscribe?',
    answer: 'Every email has a one-click unsubscribe link at the bottom. No hard feelings, Proxy.',
  },
]

/** Loose email check for the newsletter form (the server would validate for real). */
export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
