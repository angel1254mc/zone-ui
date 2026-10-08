import { StarsPill } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a large pill with three of five refinement stars. */
function Thumbnail() {
  return <StarsPill size="large" value={3} />;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.7,
  usage: (
    <>
      <p>
        A stars pill shows how far an item has been refined, as filled and empty stars in a capsule. Add{' '}
        <code>onEnhance</code> to end the pill with an Enhance button that spends materials to add the next star. Use
        the panel size beside a detail view, and the large size in a full item panel.
      </p>
      <p>
        For a level and its cap, use Level Pill. For experience toward the next level, use the XP bar from Progress. For
        a row of plain stats, use Stat Row.
      </p>
    </>
  ),
  usageCode: `import { StarsPill } from '@angel1254mc/zone-ui';

<StarsPill value={3} onEnhance={() => enhance()} />`,
  examples: [
    {
      demo: 'panel-size',
      title: 'Panel size',
      description: 'The smaller size fits a side detail panel, with the Enhance button at the right end.',
    },
    {
      demo: 'empty-state',
      title: 'Empty state',
      description: 'Some items, such as drive discs, cannot be refined. Set empty to show a dim EMPTY label instead.',
    },
    {
      demo: 'custom-action',
      title: 'Custom action',
      description: 'Pass any node as action to replace the built-in Enhance button.',
    },
  ],
  notes: [
    {
      title: 'Stars',
      items: [
        <>
          <code>value</code> is the number of filled stars, and <code>max</code> is the total (default 5). Set{' '}
          <code>starsLabel</code> to name the stars for screen readers.
        </>,
      ],
    },
    {
      title: 'Enhance',
      items: [
        <>
          <code>enhanceLabel</code> names the button, and the default is &ldquo;Enhance&rdquo;. Pass{' '}
          <code>enhanceProps</code> for <code>disabled</code> or other button attributes, for example when the player
          cannot afford the next star.
        </>,
      ],
    },
  ],
  related: ['level-pill', 'progress', 'stat-row'],
};

export default doc;
