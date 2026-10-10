import { RewardTile, RewardTileGroup } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function RewardTileHero() {
  return (
    <RewardTileGroup>
      <RewardTile name="Boopon" count="300" rarity="s" art={<ItemImage id="112" alt="" />} />
      <RewardTile name="Master Tape" count="5" rarity="s" art={<ItemImage id="110" alt="" />} />
      <RewardTile name="Ether Battery" count="7" rarity="a" art={<ItemImage id="502" alt="" />} />
      <RewardTile name="Denny" count="1,200" rarity="b" art={<ItemImage id="10" alt="" />} />
    </RewardTileGroup>
  );
}
