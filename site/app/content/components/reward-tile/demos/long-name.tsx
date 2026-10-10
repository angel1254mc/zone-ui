import { RewardTile } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function LongName() {
  return (
    <div style={{ width: 160 }}>
      <RewardTile
        name="Senior Investigator Log, Volume Seven"
        count="1"
        rarity="a"
        art={<ItemImage id="300003" alt="" />}
      />
    </div>
  );
}
