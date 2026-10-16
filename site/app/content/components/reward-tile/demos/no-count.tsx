import { RewardTileGroup, RewardTile } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function NoCount() {
  return (
    <RewardTileGroup>
      <RewardTile name="Bangboo Algorithm Module" rarity="b" art={<ItemImage id="303002" alt="" />} />
      <RewardTile name="W-Engine Chip" rarity="a" art={<ItemImage id="301" alt="" />} />
    </RewardTileGroup>
  );
}
