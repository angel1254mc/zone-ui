import { SectionLabel, StatRow } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: two labels, each above a stat row, on a black panel. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        borderRadius: 'calc(16 * var(--zzz-px))',
        border: 'calc(4 * var(--zzz-px)) solid #1f1f1f',
        background: '#000',
      }}
    >
      <SectionLabel as="div">Base Stat</SectionLabel>
      <StatRow label="Base ATK" value="684" style={{ marginTop: 'calc(7 * var(--zzz-px))' }} />
      <SectionLabel as="div" style={{ marginTop: 'calc(10 * var(--zzz-px))' }}>
        Advanced Stat
      </SectionLabel>
      <StatRow label="ATK" value="30%" style={{ marginTop: 'calc(7 * var(--zzz-px))' }} />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.55,
  usage: (
    <>
      <p>
        A section label is the small grey heading above a group of stat rows: "Base Stat", "Advanced Stat". It renders
        an <code>h3</code> by default and is indented to line up with the text inside the rows.
      </p>
      <p>
        Pass <code>flush</code> to drop the indent when the label sits above anything else. For the title of a whole
        screen, use Page Title. For the band that heads a storage section, use the section strip on that page.
      </p>
    </>
  ),
  usageCode: `import { SectionLabel, StatRow } from '@angel1254mc/zone-ui';

<SectionLabel>Base Stat</SectionLabel>
<StatRow label="Base ATK" value="684" />`,
  examples: [
    {
      demo: 'item-detail',
      title: 'Item details',
      description: 'Labels split a detail panel into stats and an effect, with a small gap above each row.',
    },
    {
      demo: 'flush',
      title: 'Flush',
      description: 'Above content that is not a stat row, flush lines the label up with its left edge.',
    },
  ],
  notes: [
    {
      title: 'Headings',
      items: [
        <>
          The default <code>h3</code> fits under a panel title. Use <code>as</code> to pick another level, or{' '}
          <code>div</code> and <code>p</code> when the label shouldn't be a heading.
        </>,
      ],
    },
  ],
  related: ['stat-row', 'effect-text', 'page-title'],
};

export default doc;
