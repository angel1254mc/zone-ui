import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttackIcon } from '../../icons'
import { GameIcon } from '../../../examples/art'
import { Keyword } from '../Text'
import { EffectNameBar } from './EffectNameBar'
import { EffectText } from './EffectText'
import { Specimen, Specimens } from '../StatRow/Specimens.story-helpers'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
// The specialty art is white on a 100 × 100 canvas with its glyph in an 80 × 71 box: scale it up so
// the visible glyph fills the 23 × 20 slot (EffectText.css tints <img> glyphs to text.muted).
const fill = { width: '100%', height: '100%', objectFit: 'contain' as const, scale: '1.4' }
const attack = <GameIcon kind="specialties" name="Attack" style={fill} fallback={<AttackIcon />} />

const meta = {
  title: 'Data Display/EffectText',
  component: EffectText,
  tags: ['autodocs'],
  args: {
    density: 'compact',
    markup: 'Upon hitting an enemy with a Basic Attack, the equipper\'s ATK increases by {val}3.5%{/val} for 8s.',
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'paragraph', 'loose'] },
    tone: { control: 'inline-radio', options: ['primary', 'muted'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Effect paragraph: white `fontSize.body`, line pitch `compact` 21.5 (side panel), `paragraph` 26 (big / Overclock ' +
          'panel) or `loose` 28 (equip). Inline `<Keyword icon>` = orange specialty with a 23 × 20 grey glyph and 6 px gap; `<Value>` = green ' +
          'number. `markup` accepts `{kw}…{/kw}`, `{val}…{/val}`, `{b}…{/b}`. `tone="muted"` is the grey "Next Phase" text (its `<strong>` ' +
          'words stay white). `EffectNameBar` is the 38 px effect-name capsule with an optional expand chevron (`button`, `aria-expanded`). ' +
          'The chevron overhangs the bar bottom by 13 px and takes no layout space, so ' +
          'content after an expandable bar must leave at least 13 px (22 px in a detail panel).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(20), background: '#000', width: gpx(452) }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EffectText>

export default meta
type Story = StoryObj<typeof meta>

export const Compact: Story = {}
export const Paragraph: Story = { args: { density: 'paragraph' } }
export const Loose: Story = { args: { density: 'loose' } }
export const KeywordWithIcon: Story = {
  args: { markup: undefined },
  render: (args) => (
    <EffectText {...args}>
      For characters with the <Keyword icon={attack}>Attack</Keyword> specialty, the following effects can be triggered:
    </EffectText>
  ),
}
export const NextPhase: Story = {
  args: { density: 'paragraph', tone: 'muted', markup: 'Upon hitting an enemy with a {b}Basic Attack{/b}, ATK increases by {val}4.4%{/val} for 8s.' },
}

export const NameBar: StoryObj<typeof EffectNameBar> = {
  render: () => (
    <Specimens column gap={36}>
      <Specimen label="panel (#161616)">
        <div style={{ width: gpx(412) }}>
          <EffectNameBar>Scorching Breath</EffectNameBar>
        </div>
      </Specimen>
      <Specimen label="expandable, collapsed">
        <div style={{ width: gpx(412), paddingBottom: gpx(13) }}>
          <EffectNameBar expandable>Scorching Breath</EffectNameBar>
        </div>
      </Specimen>
      <Specimen label="expanded">
        <div style={{ width: gpx(412), paddingBottom: gpx(13) }}>
          <EffectNameBar expandable defaultExpanded>
            Scorching Breath
          </EffectNameBar>
        </div>
      </Specimen>
      <Specimen label="chevron pressed">
        <div style={{ width: gpx(412), paddingBottom: gpx(13) }}>
          <EffectNameBar expandable chevronPressed>
            Scorching Breath
          </EffectNameBar>
        </div>
      </Specimen>
      <Specimen label="sunken (#0D0D0D, big panel)" bg="#1A1A1A">
        <div style={{ width: gpx(600) }}>
          <EffectNameBar surface="sunken">Scorching Breath</EffectNameBar>
        </div>
      </Specimen>
    </Specimens>
  ),
}
