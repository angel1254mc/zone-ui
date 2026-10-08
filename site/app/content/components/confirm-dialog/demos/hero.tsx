import { useState } from 'react';
import { Button, ConfirmDialog, RewardTile, RewardTileGroup } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function ConfirmDialogHero() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('Nothing crafted yet');
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Craft</Button>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{result}</output>
      <ConfirmDialog
        title="Craft 5 Ether Battery?"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setResult('Crafted 5 Ether Battery')}
        onCancel={() => setResult('Cancelled')}
      >
        <RewardTileGroup aria-label="Materials">
          <RewardTile name="Battery Charge" count={300} rarity="a" art={<ItemImage id="501" alt="" />} />
          <RewardTile name="Prepaid Power Card" count={5} rarity="a" art={<ItemImage id="511" alt="" />} />
          <RewardTile name="Denny" count={500} rarity="b" art={<ItemImage id="10" alt="" />} />
        </RewardTileGroup>
      </ConfirmDialog>
    </div>
  );
}
