// The single source of page names, tiers, blurbs and docgen component lists. Content modules read it;
// they never edit it. A page exists for every entry, with or without a content module.
import type { CatalogEntry, Section, Tier } from './types';

export const TIERS: { id: Tier; label: string; blurb: string }[] = [
  { id: 'start', label: 'Getting started', blurb: '' },
  { id: 'foundations', label: 'Foundations', blurb: 'Tokens, type, icons and surfaces every component is made of.' },
  { id: 'atoms', label: 'Atoms', blurb: 'Single controls and indicators. They render no other component.' },
  { id: 'molecules', label: 'Molecules', blurb: 'Small groups of atoms that do one job together.' },
  { id: 'organisms', label: 'Organisms', blurb: 'Page sections and overlays built from molecules.' },
  { id: 'templates', label: 'Templates', blurb: 'Full-screen frames, scaling and screen transitions.' },
  { id: 'examples', label: 'Examples', blurb: 'Complete apps built only from the kit.' },
];

const e = (
  tier: Tier,
  name: string,
  blurb: string,
  components: string[] = [name.replace(/[^A-Za-z]/g, '')],
  slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
): CatalogEntry => ({ slug, name, tier, blurb, components });

export const CATALOG: CatalogEntry[] = [
  e('start', 'Introduction', 'What Zone is and how the docs are organised.', []),
  e('start', 'Installation', 'Install the package and load its styles.', []),
  e('start', 'Theming', 'The theme root, density scale and the pulsing accent.', ['ZzzTheme']),

  e('foundations', 'Tokens', 'Colours, spacing, radii and the design-unit scale.', []),
  e('foundations', 'Typography', 'Text roles, tones and the Mona Sans fallback.', [
    'Text',
    'Keyword',
    'Value',
    'Zeros',
  ]),
  e('foundations', 'Icons', 'The glyph set, drawn on a 32-unit grid.', []),
  e('foundations', 'Materials', 'Pill, panel, dot mesh and textured surfaces.', []),
  e('foundations', 'Backgrounds', 'Hatch, dots, film strips and mural layers.', [
    'HatchBackground',
    'DotTexture',
    'GraffitiLayer',
    'FilmStripBackground',
    'StorageMuralBackground',
  ]),

  e('atoms', 'Badges', 'Small markers on card corners: New, plus, rank, combat and status.', [
    'NewBadge',
    'PlusBadge',
    'RankCoin',
    'RankBadge',
    'CombatBadge',
    'SlotHexBadge',
    'StatusCheck',
    'RecommendBadge',
  ]),
  e('atoms', 'Button', 'The dark pill for actions, with an optional icon cap.'),
  e('atoms', 'Capsule', 'A black pill for a level, count or EMPTY under a card.'),
  e('atoms', 'Category Tag', 'A small label for a news or content category.'),
  e('atoms', 'Checkbox', 'A checkbox for web forms.'),
  e('atoms', 'Chip', 'A toggle chip for filters, alone or in a group.', ['Chip', 'ChipGroup']),
  e('atoms', 'Choice Button', 'A large selectable answer with optional media.'),
  e('atoms', 'Countdown Bar', 'A shrinking timer bar for short countdowns, with the useCountdown hook.'),
  e('atoms', 'Effect Text', 'Body text with highlighted keywords and values.', ['EffectText', 'EffectNameBar']),
  e('atoms', 'Event CTA Button', 'The large call to action on an event page.', ['EventCtaButton']),
  e('atoms', 'Event Description', 'The description block under an event title.'),
  e('atoms', 'Event Ribbon', 'A subtitle ribbon for an event header.'),
  e('atoms', 'Event Title', 'A display title for an event page.'),
  e('atoms', 'Icon Button', 'A round button that holds one glyph.'),
  e('atoms', 'Info Pill', 'A pill for a timer or a short detail.'),
  e('atoms', 'Inline Error', 'A red line that explains a failed or unavailable action, and a notice pill.', [
    'InlineError',
    'Notice',
  ]),
  e('atoms', 'Key Hint', 'A key cap and label that names a shortcut.', ['KeyHint', 'KeyHints']),
  e('atoms', 'Page Title', 'A screen title, and the strip that heads a section.', ['PageTitle', 'SectionTitleStrip']),
  e('atoms', 'Quantity Bar', 'Reads out the amount chosen with a slider.'),
  e('atoms', 'Radio', 'A radio group for web forms.', ['RadioGroup', 'Radio']),
  e('atoms', 'Scroll Hint', 'An arrow that shows a container has more content.'),
  e('atoms', 'Section Label', 'A grey heading above a group of rows.'),
  e('atoms', 'Select', 'A dropdown select for sorting and forms.'),
  e('atoms', 'Slider', 'A slider with minus and plus steppers.'),
  e('atoms', 'Sort Toggle', 'Switches a list between ascending and descending.'),
  e('atoms', 'Spinner', 'A loading indicator.'),
  e('atoms', 'Split Pill', "A two-part pill, like a character's element and specialty."),
  e('atoms', 'Star Rating', 'Display-only stars for a level out of five.'),
  e('atoms', 'Stat Row', 'A label and value capsule, in rows or a grid.', ['StatRow', 'StatGrid', 'EmptyStatRow']),
  e('atoms', 'Switch', 'An on/off toggle switch.'),
  e('atoms', 'Tag Button', 'The tag-shaped Back and Close buttons.'),
  e('atoms', 'Text Field', 'A text input for web forms.'),
  e('atoms', 'Tooltip', 'A hint that appears on hover or focus.'),
  e('atoms', 'Voice Pill', 'A play button for a voice line or audio clip.'),

  e('molecules', 'Accordion', 'A list of sections that expand and collapse.', ['Accordion', 'AccordionItem']),
  e('molecules', 'Bar Chart', 'Vertical bars for scores, polls and stats.'),
  e('molecules', 'Bottom Bar', 'The black band at the foot of a screen, with key hints.', [
    'BottomBar',
    'UidFooter',
    'SignalBars',
  ]),
  e('molecules', 'Check-in Calendar', 'A grid of daily reward tiles.', ['CheckInCalendar', 'CheckInTile']),
  e('molecules', 'Choice Group', 'A set of choice buttons for quizzes, polls and settings.'),
  e('molecules', 'Content Card', 'A general card with media, a heading and a footer.'),
  e('molecules', 'Copy Button', 'A button that copies text and confirms it.'),
  e('molecules', 'Countdown', 'A live countdown to a date, in a pill.'),
  e('molecules', 'Currency Pill', 'A currency amount with an add button.', ['CurrencyPill', 'ResourceBar']),
  e('molecules', 'Dropdown Menu', 'A button that opens a list of links or actions.'),
  e('molecules', 'Icon Tabs', 'Tabs drawn as icons, for switching categories.'),
  e('molecules', 'Item Card', 'An inventory tile with rarity, level and badges.'),
  e('molecules', 'Level Pill', 'A level readout with a rank coin and an action.'),
  e('molecules', 'Mission Card', 'An event task with progress and a claim button.'),
  e('molecules', 'Modifier Row', 'A buff or debuff row with an action.'),
  e('molecules', 'News Card', 'An article card with a category tag.'),
  e('molecules', 'Pagination', 'Page controls for long web lists.'),
  e('molecules', 'Panel', 'A framed container with header and body slots.'),
  e('molecules', 'Progress', 'Experience and upgrade bars.', ['XpBar', 'OverclockBar', 'ProgressPill']),
  e('molecules', 'Reward Tile', 'A reward item with its name, alone or in a group.', ['RewardTile', 'RewardTileGroup']),
  e('molecules', 'Scroll Area', 'A scroll container with the kit scrollbar.'),
  e('molecules', 'Segmented Tabs', 'Switches between a few views of the same thing.', ['SegmentedTabs', 'TabPanel']),
  e('molecules', 'Sound Toggle', 'Mutes sound, with an optional volume slider.'),
  e('molecules', 'Stars Pill', 'Refinement stars with an enhance action.'),
  e('molecules', 'Stat Tiles', 'A responsive grid of big-number tiles.', ['StatTiles', 'StatTile']),
  e('molecules', 'Status Grid', 'Small status cells, like a streak calendar.'),
  e('molecules', 'Step Progress', 'Shows where you are in a quiz, wizard or checkout.'),
  e('molecules', 'Toast', 'Short messages that appear and dismiss themselves.', ['ToastProvider', 'Toast']),
  e('molecules', 'Web Tabs', 'Section tabs for websites.'),

  e('organisms', 'Confirm Dialog', 'The full-width band that asks to confirm, or shows rewards.', [
    'ConfirmDialog',
    'RewardDialog',
    'DialogBand',
  ]),
  e('organisms', 'Drawer', 'A side panel, including the filter drawer.', ['Drawer', 'FilterDrawer']),
  e('organisms', 'Hero', 'A landing section with a title, actions and art.'),
  e('organisms', 'Item Grid', 'A grid of selectable item cards.'),
  e('organisms', 'Modal', 'A centred dialog for websites.'),
  e('organisms', 'Nav Bar', 'The header of a website.', ['NavBar'], 'navbar'),
  e('organisms', 'Reward Preview', 'A row of reward cards for an event.'),
  e('organisms', 'Site Footer', 'The footer of a website.'),
  e('organisms', 'Splash', 'A full-screen "press to enter" gate.'),
  e('organisms', 'Sweep Transition', 'A full-screen sweep between steps or routes.'),
  e('organisms', 'Table', 'A sortable data table.'),
  e('organisms', 'Top Bar', 'The header bar of a game-style screen.'),

  e('templates', 'Screen', 'A full-screen frame: background, top bar, content and bottom bar.'),
  e('templates', 'Stage', 'Scales a fixed 1920 × 1080 canvas to fit its box.'),
  e('templates', 'Screen Transition', 'Cuts, fades and staggered entries between screens.', [
    'ScreenTransition',
    'ScreenFade',
  ]),

  e('examples', 'Daily Trivia', 'A five-question daily quiz with streaks and sharing.', []),
  e('examples', 'Inter-Knot Dispatch', 'A news website with tabs, cards and a newsletter.', []),
];

export const tierOf = (id: Tier) => TIERS.find((t) => t.id === id)!;

/** The component tiers, in sidebar and gallery order. */
export const COMPONENT_TIERS: Tier[] = ['atoms', 'molecules', 'organisms', 'templates'];

export const sectionOfTier = (tier: Tier): Section =>
  tier === 'examples' ? 'examples' : COMPONENT_TIERS.includes(tier) ? 'components' : 'docs';

export const entriesOf = (section: Section) => CATALOG.filter((c) => sectionOfTier(c.tier) === section);

const index = new Map(CATALOG.map((c) => [`${sectionOfTier(c.tier)}/${c.slug}`, c]));

/** The catalog entry for a URL slug inside one section, if there is one. */
export const findEntry = (section: Section, slug: string | undefined) =>
  slug === undefined ? undefined : index.get(`${section}/${slug}`);

/** Path of an entry's page. The Introduction is the site's landing page. */
export function entryHref(entry: CatalogEntry, tab: 'overview' | 'properties' = 'overview'): string {
  const section = sectionOfTier(entry.tier);
  if (section === 'components') return `/components/${entry.slug}${tab === 'properties' ? '/properties' : ''}`;
  if (section === 'examples') return `/examples/${entry.slug}`;
  return entry.slug === 'introduction' ? '/' : `/docs/${entry.slug}`;
}
