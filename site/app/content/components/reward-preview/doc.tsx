import { RewardPreview } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: four tiles without art (nothing loads) and the more arrow. */
function Thumbnail() {
  return (
    <RewardPreview
      visible={4}
      items={[
        { name: 'Polychrome', rarity: 's' },
        { name: 'Master Tape', rarity: 's' },
        { name: 'Ether Battery', rarity: 'a' },
        { name: 'Battery Charge', rarity: 'a' },
        { name: 'Denny', rarity: 'b' },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.5,
  usage: (
    <>
      <p>
        Use the reward preview on an event page to show what people can earn: an outlined label over a row of reward
        cards that clips at the right. The arrow scrolls the row one page at a time, or calls <code>onMore</code> when
        you show the full list somewhere else.
      </p>
      <p>
        To show rewards that were just obtained, use the <code>RewardDialog</code> from Confirm Dialog. For an inventory
        people pick from, use an Item Grid.
      </p>
    </>
  ),
  usageCode: `import { RewardPreview } from '@angel1254mc/zone-ui';

<RewardPreview
  items={[
    { name: 'Polychrome', rarity: 's', art: <img src="/polychrome.png" alt="" /> },
    { name: 'Denny', rarity: 'b', art: <img src="/denny.png" alt="" /> },
  ]}
/>`,
  examples: [
    {
      demo: 'with-notice',
      title: 'With a notice',
      description: 'A notice under the row confirms a milestone, and visible sets how many cards show before the clip.',
      frame: 'start',
    },
    {
      demo: 'reward-details',
      title: 'Open a reward',
      description: 'Give each item an onClick and the cards become buttons, here showing what the reward does.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          With static cards, the row itself is a tab stop and <kbd>←</kbd> <kbd>→</kbd> scroll it. With{' '}
          <code className="d-inline-code">onClick</code> on the items, each card is a button.
        </>,
        <>
          The arrow is a button named &quot;More rewards&quot;. Rename it with{' '}
          <code className="d-inline-code">moreLabel</code>.
        </>,
      ],
    },
    {
      title: 'Items',
      items: [
        <>
          Each item takes the Item Card props. Give every one a <code className="d-inline-code">name</code>: it is the
          card&apos;s accessible name.
        </>,
      ],
    },
  ],
  related: ['item-card', 'reward-tile', 'mission-card'],
};

export default doc;
