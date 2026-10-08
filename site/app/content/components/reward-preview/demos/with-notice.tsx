import { Notice, RewardPreview } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function WithNotice() {
  return (
    <RewardPreview
      label="Unlock Early rewards"
      visible={4}
      notice={<Notice>"Unlock Early" has been unlocked</Notice>}
      items={[
        { name: 'Polychrome', rarity: 's', art: <ItemImage id="100" alt="" /> },
        { name: 'Master Tape', rarity: 's', art: <ItemImage id="110" alt="" /> },
        { name: 'Ether Battery', rarity: 'a', art: <ItemImage id="502" alt="" /> },
        { name: 'Denny', rarity: 'b', art: <ItemImage id="10" alt="" /> },
      ]}
    />
  );
}
