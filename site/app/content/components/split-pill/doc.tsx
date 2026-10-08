import { FireIcon, RuptureIcon, SplitPill } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: element and specialty halves with their glyphs. */
function Thumbnail() {
  return (
    <div
      style={{
        padding: 'calc(24 * var(--zzz-px))',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: 'var(--zzz-color-surface-agent-info)',
      }}
    >
      <SplitPill
        items={[
          { icon: <FireIcon />, label: 'Fire' },
          { icon: <RuptureIcon style={{ color: 'var(--zzz-color-icon-specialty)' }} />, label: 'Rupture' },
        ]}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        A split pill shows two related facts in one pill, split by a slanted divider. On a character sheet it pairs the
        element, the kind of damage the character deals (like Fire or Ice), with the specialty, their role in a fight
        (like Attack or Rupture).
      </p>
      <p>
        It always holds exactly two items and is read as a two-item list. For a single fact, use Info Pill. For a level
        readout, use Level Pill.
      </p>
    </>
  ),
  usageCode: `import { FireIcon, RuptureIcon, SplitPill } from '@angel1254mc/zone-ui';

<SplitPill
  items={[
    { icon: <FireIcon />, label: 'Fire' },
    { icon: <RuptureIcon />, label: 'Rupture' },
  ]}
/>`,
  examples: [
    {
      demo: 'agent-profile',
      title: 'On a character sheet',
      description: 'Under the name, above the level and the stat grid.',
      frame: 'start',
    },
    {
      demo: 'combinations',
      title: 'Other pairs',
      description: 'Element glyphs bring their own colour; tint specialty glyphs grey. Icons are optional.',
    },
  ],
  types: [
    {
      name: 'SplitPillItem',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Text of this half.' },
        { name: 'icon', type: 'ReactNode', description: 'Glyph before the label. Decorative.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Content',
      items: [
        <>
          The pill has a fixed width and both halves share it equally. Keep each label to one short word; longer ones
          are cut off with an ellipsis.
        </>,
        <>
          Icons are decorative. Name the pill with <code>aria-label</code> when the pair needs context, like "Element
          and specialty".
        </>,
      ],
    },
  ],
  related: ['level-pill', 'info-pill', 'stat-row'],
};

export default doc;
