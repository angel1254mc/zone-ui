import { BatteryIcon, DennyIcon, PolychromeIcon, RewardTile, RewardTileGroup } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three reward tiles in a row, with a count on each. */
function Thumbnail() {
  return (
    <RewardTileGroup>
      <RewardTile name="Boopon" count="300" rarity="s" art={<PolychromeIcon />} />
      <RewardTile name="Battery" count="60" rarity="a" art={<BatteryIcon />} />
      <RewardTile name="Denny" count="1,200" rarity="b" art={<DennyIcon />} />
    </RewardTileGroup>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.45,
  usage: (
    <>
      <p>
        Use a reward tile to show what someone received: an item with its art, its rarity band, a count and a name. A
        group lays out several tiles in one centred row, for a reward dialog or a claim screen.
      </p>
      <p>
        For the inventory item a player already owns, use Item Card. For a row of rewards on an event page, use Reward
        Preview. For a list of stats, use Stat Row.
      </p>
    </>
  ),
  usageCode: `import { RewardTile, RewardTileGroup } from '@angel1254mc/zone-ui';

<RewardTileGroup>
  <RewardTile name="Boopon" count="300" rarity="s" art={<img src={boopon} alt="" />} />
  <RewardTile name="Battery" count="60" rarity="a" art={<img src={battery} alt="" />} />
</RewardTileGroup>`,
  examples: [
    {
      demo: 'long-name',
      title: 'Long name',
      description: 'The name wraps to two lines and is cut short with an ellipsis after that.',
    },
    {
      demo: 'no-count',
      title: 'Without counts',
      description: 'Leave out count and the strip under the tile is hidden.',
    },
  ],
  notes: [
    {
      title: 'Rarity',
      items: [
        <>
          <code>rarity</code> sets the colour of the band on the tile. It takes <code>s</code>, <code>a</code>,{' '}
          <code>b</code> or <code>c</code>, and the default is <code>b</code>.
        </>,
      ],
    },
    {
      title: 'Group',
      items: [
        <>
          <code>RewardTileGroup</code> renders a list. Each child becomes one list item, and empty children are skipped.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          Tiles are not interactive. The name and count are the text, and the art is hidden from screen readers, so give
          the art an empty <code>alt</code>.
        </>,
      ],
    },
  ],
  related: ['item-card', 'reward-preview', 'stat-row'],
};

export default doc;
