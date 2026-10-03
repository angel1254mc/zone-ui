import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { Text, Zeros, Keyword, Value, TEXT_TONES } from '../components/Text'
import type { TextRole, TextTone } from '../components/Text'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
  title: 'Foundations/Typography',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'One `Text` component for every text role. Sizes are in **design units**',
          '(rendered as N × `--zzz-px`, 0.7 CSS px each at the default scale and a 16 px root; Inpin Hongmeng cap/em 0.84). The shipped face is Mona Sans 900 at `font-stretch: 110%` with',
          '`font-size-adjust: cap-height 0.84`, so a role renders at its intended cap height; condensed roles use Impact',
          '(Mona Sans 75 % fallback, `cap-height 0.79`). There is one weight (900) and no italic font: `italic` wraps',
          'the content in `.zzz-italic` (`skewX(-10deg)`, origin on the baseline).',
          '',
          '```tsx',
          '<Text as="h2" role="title">The Brimstone</Text>',
          '<Text role="button" italic>Craft</Text>',
          '<Text role="titlePill" italic outline="md">Lv. 60</Text>',
          '<Text role="condensedXl" deboss>Events</Text>',
          '<Zeros value={76418} digits={8} />  <Keyword>Attack</Keyword>  <Value>3.5%</Value>',
          '```',
          '',
          '`role` is the **text** role, not the ARIA attribute (use `ariaRole`).',
        ].join('\n'),
      },
    },
  },
  args: { children: 'The Brimstone', role: 'title' },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

interface RoleRow {
  role: TextRole
  px: number
  family: 'ui' | 'condensed'
  sample: ReactNode
  tone?: TextTone
  italic?: boolean
  outline?: 'sm' | 'md' | 'event' | 'new'
  deboss?: boolean
  plate?: string
  use: string
}

const ROLES: RoleRow[] = [
  { role: 'nano', px: 9, family: 'ui', sample: 'LEVEL', tone: 'subtle', use: 'HUD "LEVEL" caption' },
  { role: 'tiny', px: 12, family: 'ui', sample: 'UID: 1000000001', tone: 'subtle', use: 'UID footer, DRIVER label' },
  { role: 'micro', px: 13.5, family: 'ui', sample: 'DETAIL', tone: 'faint', use: '"DETAIL" header' },
  { role: 'caption', px: 15, family: 'ui', sample: 'AGENT INFO', deboss: true, tone: 'engraved', plate: '#252525', use: 'debossed caption' },
  { role: 'label', px: 17.5, family: 'ui', sample: 'Base Stat', tone: 'muted', use: 'section labels, dock, chips' },
  { role: 'body', px: 20, family: 'ui', sample: 'Base ATK 684', use: 'stat rows, effect text' },
  { role: 'bodyLg', px: 22, family: 'ui', sample: 'Krampus Compliance Authority', tone: 'tertiary', use: 'agent stats, faction' },
  { role: 'bodyXl', px: 23.5, family: 'ui', sample: 'Active Modifier Count', tone: 'secondary', use: 'currency, element tags' },
  { role: 'button', px: 26, family: 'ui', sample: 'Dismantle', italic: true, use: 'every button and tab (italic)' },
  { role: 'title', px: 30, family: 'ui', sample: 'The Brimstone', use: 'panel / modal titles' },
  { role: 'titlePill', px: 31, family: 'ui', sample: 'Lv. 60', italic: true, outline: 'md', plate: '#1D1D1D', use: 'agent level pill' },
  { role: 'eventTitle', px: 38, family: 'ui', sample: 'Angels Support Operation', outline: 'event', plate: '#3FA7A9', use: 'outlined event title' },
  { role: 'displayName', px: 51, family: 'ui', sample: 'Banyue', use: 'agent name' },
  { role: 'ghostLevel', px: 66, family: 'ui', sample: '60', italic: true, tone: 'engraved', plate: '#1D1D1D', use: 'ghost max level' },
  { role: 'badgeNew', px: 22, family: 'ui', sample: 'NEW!', italic: true, outline: 'new', tone: 'soft', use: 'NEW! badge' },
  { role: 'condensedSm', px: 17, family: 'condensed', sample: 'Empty', tone: 'faint', use: '"EMPTY" under a grid slot' },
  { role: 'condensedMd', px: 24, family: 'condensed', sample: 'Empty', tone: 'ghost', plate: '#0C0C0C', use: '"EMPTY" in a stat row' },
  { role: 'condensedInterstitial', px: 30.5, family: 'condensed', sample: 'Agent Select', italic: true, use: 'AGENT SELECT (tracked)' },
  { role: 'condensedLg', px: 34, family: 'condensed', sample: 'Max', tone: 'disabled', use: '"MAX" in the level pill' },
  { role: 'condensedXlHud', px: 45, family: 'condensed', sample: 'Events', deboss: true, plate: '#1F1F1F', use: 'HUD EVENTS cap' },
  { role: 'condensedXl', px: 45.5, family: 'condensed', sample: 'Events', deboss: true, plate: '#272727', use: 'Events screen cap (token 48; Text renders it at 45.5)' },
]

const cellStyle: CSSProperties = {
  padding: `${gpx(8)} ${gpx(12)}`,
  borderBottom: `${gpx(1)} solid #1A1A1A`,
  verticalAlign: 'middle',
}
const metaText: CSSProperties = { fontSize: gpx(15), lineHeight: 1.2, color: 'var(--zzz-color-text-muted)' }

/** Every role at its size, with family, colour and typical use. */
export const Specimen: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <table style={{ borderCollapse: 'collapse', background: '#000' }}>
      <thead>
        <tr>
          {['role', 'design units', 'family', 'tone', 'sample', 'used for'].map((h) => (
            <th key={h} style={{ ...cellStyle, ...metaText, textAlign: 'left' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROLES.map((r) => (
          <tr key={r.role}>
            <td style={{ ...cellStyle, ...metaText, color: 'var(--zzz-color-text-soft)' }}>{r.role}</td>
            <td style={{ ...cellStyle, ...metaText }}>{r.px}</td>
            <td style={{ ...cellStyle, ...metaText }}>{r.family === 'ui' ? 'Inpin → Mona Sans 110' : 'Impact → Mona Sans 75'}</td>
            <td style={{ ...cellStyle, ...metaText }}>{r.tone ?? 'primary'}</td>
            <td style={{ ...cellStyle, background: r.plate, whiteSpace: 'nowrap' }}>
              <Text
                role={r.role}
                tone={r.tone}
                italic={r.italic}
                outline={r.outline}
                deboss={r.deboss}
                tracked={r.role === 'condensedInterstitial' ? 'interstitial' : 'none'}
              >
                {r.sample}
              </Text>
            </td>
            <td style={{ ...cellStyle, ...metaText }}>{r.use}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

/** Every tone on black (`body` role). */
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: `${gpx(14)} ${gpx(40)}`, background: '#000', padding: gpx(24) }}>
      {TEXT_TONES.map((t) => (
        <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: gpx(4), background: t === 'onAccent' ? 'var(--zzz-accent)' : undefined, padding: gpx(4) }}>
          <Text role="bodyLg" tone={t}>
            Base ATK 684
          </Text>
          <span style={metaText}>{t}</span>
        </div>
      ))}
    </div>
  ),
}

/** italic, outline, deboss, tracked, tabular and fit. */
export const Modifiers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24), background: '#000', padding: gpx(24) }}>
      <div style={{ display: 'flex', gap: gpx(40), alignItems: 'center' }}>
        <Text role="button">Craft</Text>
        <Text role="button" italic>
          Craft
        </Text>
        <span style={metaText}>upright / italic (skewX −10°)</span>
      </div>
      <div style={{ display: 'flex', gap: gpx(40), alignItems: 'center', background: '#3A5F7A', padding: gpx(16) }}>
        <Text role="bodyXl" outline="sm">
          Next stop: sm
        </Text>
        <Text role="titlePill" italic outline="md">
          Lv. 60
        </Text>
        <Text role="eventTitle" outline="event">
          Event
        </Text>
        <Text role="badgeNew" italic outline="new" tone="soft">
          NEW!
        </Text>
      </div>
      <div style={{ display: 'flex', gap: gpx(40), alignItems: 'center' }}>
        <span style={{ background: '#252525', padding: gpx(8) }}>
          <Text role="caption" deboss>
            AGENT INFO
          </Text>
        </span>
        <span style={{ background: '#050505', padding: gpx(8) }}>
          <Text role="label" tracked="name">
            Banyue
          </Text>
        </span>
        <Text role="condensedInterstitial" tracked="interstitial" italic>
          Agent Select
        </Text>
      </div>
      <div style={{ display: 'flex', gap: gpx(40), alignItems: 'center' }}>
        <Text role="bodyXl">1111 / 8888 (tabular)</Text>
        <Text role="bodyXl" tabular={false}>
          1111 / 8888 (proportional)
        </Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(6) }}>
        <span style={metaText}>fit: 20 px body text in a 230 px box shrinks to fit (never below 16; the last one clips at 16)</span>
        {['Anomaly Mastery', 'Anomaly Proficiency', 'Automatic Adrenaline Accumulation'].map((s) => (
          <div key={s} style={{ width: gpx(230), background: '#1A1A1A', padding: `${gpx(4)} ${gpx(8)}` }}>
            <Text role="body" fit>
              {s}
            </Text>
          </div>
        ))}
      </div>
    </div>
  ),
}

/** Zeros, Keyword and Value helpers. */
export const Helpers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(20), background: '#000', padding: gpx(24) }}>
      <Text role="bodyXl">
        <Zeros value={76418} digits={8} />
      </Text>
      <Text role="bodyXl">
        <Zeros value={20} digits={3} />
        /240
      </Text>
      <Text as="p" role="body" style={{ margin: 0, maxWidth: gpx(560), lineHeight: 'var(--zzz-line-height-paragraph)' }}>
        Upon hitting an enemy with a Basic Attack, Dash Attack or <Keyword>Attack</Keyword>, the equipper&apos;s ATK
        increases by <Value>3.5%</Value> for 8s.
      </Text>
    </div>
  ),
}
