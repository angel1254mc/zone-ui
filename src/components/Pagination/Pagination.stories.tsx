import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Pagination } from './Pagination'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-label)',
  lineHeight: 'var(--zzz-line-height-dialog-item)',
  color: 'var(--zzz-color-text-muted)',
}
/** A light news-page background. */
const lightPage: CSSProperties = { background: '#EFEFEF', padding: `${gpx(11)} ${gpx(13)}`, width: 'fit-content' }

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  )
}

const meta = {
  title: 'Forms/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Pager for web lists.',
          '',
          '- Track 52 tall full pill `#222122`; 64 px page slots 12 apart; numbers `body` white; `…` for gaps (one sibling + one boundary page: `1 2 3 4 5 … 175`).',
          '- Current page: black number on a white parallelogram ~45×32, ~40° from vertical.',
          '- Prev / next: 64×40 white end chips (round outer end, slanted inner edge) with an original black arrow, 24 px further out. Disabled at the ends: arrow `color.text.disabled`, shape unchanged.',
          '- `skin="game"`: `.zzz-mat-pill` track, live `--zzz-accent` chips at `skew.tabEdge` 26.5°, no hover.',
          '- Hover (web skin): chip + `scale(1.12)`, 300 ms; dropped under `prefers-reduced-motion`.',
          '- A11y: `<nav aria-label="Pagination">` + list; `aria-current="page"`; `Page N` / `Previous page` / `Next page` names; `getPageHref` renders links.',
          '- **Sizes**: `size` sm / md / lg (default md) follows the library control scale (ratios 46 : 57 : 69); md is the original 52-unit track, so it is ≈ 29 / 36 / 44 CSS px tall at the default 0.7 scale; sm / lg scale every length by 46/57 and 69/57 (the `size.control.{sm,md,lg}` ratio), so the track, slots, chips and arrows keep their proportions. Text never drops below the `label` role (sm labels stay ≈ 12 CSS px at 0.7).',
        ].join('\n'),
      },
    },
  },
  args: { count: 175, defaultPage: 1 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** Page 1 of 175. */
export const Default: Story = {}

/** Web skin on a light page. */
export const OnLightPage: Story = {
  render: (args) => (
    <div style={lightPage}>
      <Pagination {...args} />
    </div>
  ),
}

/** Both ellipses, page 50. */
export const Middle: Story = { args: { defaultPage: 50 } }

/** Last page: next is disabled. */
export const LastPage: Story = { args: { defaultPage: 175 } }

/** Few pages: every page listed. */
export const FewPages: Story = { args: { count: 4, defaultPage: 2 } }

/** Game skin: mesh pill, accent chips, 26.5°. */
export const GameSkin: Story = { args: { skin: 'game', defaultPage: 3, count: 12 } }

/** Whole bar disabled: numbers and arrows `color.text.disabled`, shapes unchanged. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
      <Row label="web">
        <Pagination count={12} defaultPage={3} disabled />
      </Row>
      <Row label="game">
        <Pagination count={12} defaultPage={3} disabled skin="game" />
      </Row>
    </div>
  ),
}

/** Links (server-rendered lists): `getPageHref`. */
export const AsLinks: Story = {
  args: { count: 9, defaultPage: 4, getPageHref: (p: number) => `#page-${p}` },
}

/** Controlled. */
export const Controlled: Story = {
  render: () => {
    const [page, setPage] = useState(7)
    return (
      <Row label={`page ${page}`}>
        <Pagination count={30} page={page} onPageChange={setPage} />
      </Row>
    )
  },
}

const SIZES = ['sm', 'md', 'lg'] as const

/** sm / md / lg at the default scale, both skins (skew angles do not change with size). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
      {SIZES.map((size) => (
        <Row key={size} label={`size="${size}" (web / game skin)`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: gpx(16) }}>
            <Pagination count={175} defaultPage={3} size={size} />
            <Pagination count={12} defaultPage={3} skin="game" size={size} />
          </div>
        </Row>
      ))}
    </div>
  ),
}
