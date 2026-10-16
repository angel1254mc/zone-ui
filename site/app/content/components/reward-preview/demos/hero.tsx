import { RewardPreview } from '@angel1254mc/zone-ui';
import { DriveDiscImage, ItemImage, WEngineImage } from 'examples/art';

export default function RewardPreviewHero() {
  return (
    <RewardPreview
      items={[
        { name: 'Master Tape', rarity: 's', art: <ItemImage id="110" alt="" /> },
        { name: 'Street Superstar', rarity: 'a', art: <WEngineImage id="13001" alt="" /> },
        { name: 'Puffer Electro', rarity: 'a', art: <DriveDiscImage id="31100" alt="" /> },
        { name: 'Battery Charge', rarity: 'a', art: <ItemImage id="501" alt="" /> },
        { name: 'Senior Investigator Log', rarity: 'a', art: <ItemImage id="300003" alt="" /> },
        { name: 'Bangboo Algorithm Module', rarity: 'b', art: <ItemImage id="303002" alt="" /> },
        { name: 'Denny', rarity: 'b', art: <ItemImage id="10" alt="" /> },
        { name: 'Lost Supply Box', rarity: 'a', art: <ItemImage id="404" alt="" /> },
      ]}
    />
  );
}
