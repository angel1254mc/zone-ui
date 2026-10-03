import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'
import { FireIcon, LockIcon, StarIcon } from '../../icons'
import { AgentImage, WEngineImage } from '../../../examples/art'
import { ChoiceButton } from './ChoiceButton'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = { font: '600 13px/1.3 system-ui, sans-serif', color: '#9a9a9a' }

const Stage = ({ children, width = 560, style }: { children: ReactNode; width?: number; style?: CSSProperties }) => (
  <div style={{ background: '#000', padding: gpx(28), width: gpx(width + 56), display: 'flex', flexDirection: 'column', gap: gpx(24), ...style }}>
    {children}
  </div>
)
const Labelled = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(8) }}>
    <span style={caption}>{label}</span>
    {children}
  </div>
)

const meta = {
  title: 'Forms/ChoiceButton',
  component: ChoiceButton,
  tags: ['autodocs'],
  args: { children: 'Ballet Twins Road', badge: 'A' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    result: { control: 'select', options: [undefined, 'correct', 'incorrect', 'revealed'] },
    correctTone: { control: 'inline-radio', options: ['green', 'accent'] },
    mediaLayout: { control: 'inline-radio', options: ['inline', 'cover'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A large selectable option on the dark pill material (lit 5 px ring, dot mesh, black keyline) with an optional badge cap ' +
          '(an icon cap: letter, number or icon), a heavy 10°-sheared label that wraps, an optional description and media slot. ' +
          'Selected = pulsing accent ring + accent cap; pressed = the shared accent-fill recipe; results `correct` / `incorrect` / `revealed` for quizzes, ' +
          'validation or "this was the answer" reveals. The visual state is mirrored on `data-state`. Use it alone as a toggle (`aria-pressed`) or through ChoiceGroup. ' +
          '**Sizes** `size="sm" | "md" | "lg"` (default `md`) follow the web control scale: min-height 63 / 78 / 94, badge cap 45 / 56 / 68 design units, ' +
          'label `fontSize.control.{sm,md,lg}` (21 / 26 / 30), description label / body / bodyLg; ring, radius, padding, media and press outset scale with it.',
      },
    },
  },
  decorators: [(S) => <Stage>{S()}</Stage>],
} satisfies Meta<typeof ChoiceButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Every state side by side (accent phase pinned for a stable render). */
export const States: Story = {
  decorators: [(S) => <div data-accent-phase="lime">{S()}</div>],
  render: () => (
    <>
      <Labelled label="idle">
        <ChoiceButton badge="A">Ballet Twins Road</ChoiceButton>
      </Labelled>
      <Labelled label="selected (accent ring + accent cap, pulses)">
        <ChoiceButton badge="B" selected>
          Lumina Square
        </ChoiceButton>
      </Labelled>
      <Labelled label="pressed (data-pressed / :active)">
        <ChoiceButton badge="C" pressed>
          Sixth Street
        </ChoiceButton>
      </Labelled>
      <Labelled label="disabled">
        <ChoiceButton badge="D" disabled>
          Blazewood
        </ChoiceButton>
      </Labelled>
      <Labelled label="correct (green)">
        <ChoiceButton badge="B" result="correct">
          Lumina Square
        </ChoiceButton>
      </Labelled>
      <Labelled label="correct (accent tone)">
        <ChoiceButton badge="B" result="correct" correctTone="accent">
          Lumina Square
        </ChoiceButton>
      </Labelled>
      <Labelled label="incorrect">
        <ChoiceButton badge="A" result="incorrect">
          Ballet Twins Road
        </ChoiceButton>
      </Labelled>
      <Labelled label="revealed (the right answer, not picked)">
        <ChoiceButton badge="B" result="revealed">
          Lumina Square
        </ChoiceButton>
      </Labelled>
      <Labelled label="result without a badge (trailing mark)">
        <ChoiceButton result="incorrect">Ballet Twins Road</ChoiceButton>
      </Labelled>
    </>
  ),
}

/** sm / md / lg: idle, selected and a result, each with a description (pinned accent phase). */
export const Sizes: Story = {
  decorators: [(S) => <div data-accent-phase="lime">{S()}</div>],
  render: () => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Labelled key={size} label={`${size} — min-height ${{ sm: 63, md: 78, lg: 94 }[size]}, cap ${{ sm: 45, md: 56, lg: 68 }[size]}, label ${{ sm: 21, md: 26, lg: 30 }[size]}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(16) }}>
            <ChoiceButton size={size} badge="A">
              Ballet Twins Road
            </ChoiceButton>
            <ChoiceButton size={size} badge="B" selected description="Home of Random Play">
              Sixth Street
            </ChoiceButton>
            <ChoiceButton size={size} badge="C" result="correct">
              Lumina Square
            </ChoiceButton>
          </div>
        </Labelled>
      ))}
    </>
  ),
}

/** Labels wrap to 2–3 lines; descriptions are upright and muted. */
export const LongLabelAndDescription: Story = {
  render: () => (
    <>
      <ChoiceButton badge="A">Which faction runs the noodle stand outside Random Play on Sixth Street?</ChoiceButton>
      <ChoiceButton badge="1" description="Ads, priority support and 2 extra save slots. Cancel any time.">
        Proxy Plus
      </ChoiceButton>
      <ChoiceButton badge={<StarIcon />} description="Everything in Plus, for the whole squad (up to 6 accounts)." selected>
        Squad bundle
      </ChoiceButton>
    </>
  ),
}

/** Badges can be letters, numbers or icons; or omitted entirely. */
export const Badges: Story = {
  render: () => (
    <>
      <ChoiceButton badge="A">Letter badge</ChoiceButton>
      <ChoiceButton badge="3">Number badge</ChoiceButton>
      <ChoiceButton badge={<FireIcon />}>Icon badge</ChoiceButton>
      <ChoiceButton badge={<LockIcon />} disabled description="Unlocks at Inter-Knot level 20">
        Locked option
      </ChoiceButton>
      <ChoiceButton>No badge</ChoiceButton>
    </>
  ),
}

/** `media` takes any node: `<img>`, `<picture>`, SVG. `inline` is a 64 px thumbnail; `cover` a wide image on top. */
export const Media: Story = {
  render: () => (
    <>
      <ChoiceButton badge="A" media={<AgentImage seed={3} crop="circle" />} description="Inline media (avatar)">
        Pick this agent
      </ChoiceButton>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: gpx(22) }}>
        <ChoiceButton badge="A" mediaLayout="cover" media={<WEngineImage seed={5} />}>
          Option with cover art
        </ChoiceButton>
        <ChoiceButton badge="B" mediaLayout="cover" media={<WEngineImage seed={9} />} selected>
          Selected cover option
        </ChoiceButton>
      </div>
    </>
  ),
}

/** Standalone toggle: `selected` + `aria-pressed`, driven by your own state. */
export const StandaloneToggle: Story = {
  render: function Render() {
    const [on, setOn] = useState(false)
    return (
      <ChoiceButton badge={<StarIcon />} selected={on} onClick={() => setOn((v) => !v)} description="Click to toggle (aria-pressed)">
        Subscribe to daily reminders
      </ChoiceButton>
    )
  },
}
