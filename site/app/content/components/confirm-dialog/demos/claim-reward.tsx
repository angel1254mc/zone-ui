import { useState } from 'react';
import { Button, GiftIcon, RewardDialog } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function ClaimReward() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={<GiftIcon />} onClick={() => setOpen(true)}>
        Claim
      </Button>
      <RewardDialog
        open={open}
        onOpenChange={setOpen}
        items={[
          { name: 'Ether Battery', count: 5, rarity: 'a', art: <ItemImage id="502" alt="" /> },
          { name: 'Polychrome', count: 60, rarity: 's', art: <ItemImage id="100" alt="" /> },
        ]}
      />
    </>
  );
}
