import { StarRating } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three of five stars in the large size on a grey pill. */
function Thumbnail() {
  return (
    <div
      style={{
        padding: 'calc(12 * var(--zzz-px)) calc(22 * var(--zzz-px))',
        borderRadius: 999,
        background: 'var(--zzz-color-surface-level-pill)',
      }}
    >
      <StarRating value={3} size="large" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 1,
  usage: (
    <>
      <p>
        A star rating shows a level out of five as filled and grey stars. In the game it marks how far a weapon has been
        refined, which goes up when you merge duplicate copies into it. It is display only, with an accessible name like
        "3 of 5 stars".
      </p>
      <p>
        Pick the <code>size</code> for where it sits. For stars with an enhance button next to them, use Stars Pill. It
        is not an input, so don't use it to collect ratings.
      </p>
    </>
  ),
  usageCode: `import { StarRating } from '@angel1254mc/zone-ui';

<StarRating value={3} size="pill" />`,
  examples: [
    {
      demo: 'sizes',
      title: 'Sizes and surfaces',
      description:
        'Each size matches a place in the interface: tile, side panel, equipment bar, large panel, lime bar.',
    },
    {
      demo: 'in-a-stat-row',
      title: 'In a stat row',
      description: 'As the value of a stat row, with a label that names what the stars count.',
    },
  ],
  notes: [
    {
      title: 'Values',
      items: [
        <>
          <code>value</code> is clamped between 0 and <code>max</code> and rounded down, so there are no half stars.
        </>,
        <>
          Each star has a thin black outline that shows on colour, lime and grey fills and blends into black. Turn it
          off with <code>outline=&#123;false&#125;</code>.
        </>,
      ],
    },
  ],
  related: ['stars-pill', 'item-card', 'level-pill'],
};

export default doc;
