import { useState } from 'react';
import { Button, FilterDrawer, FilterIcon } from '@angel1254mc/zone-ui';

export default function DrawerHero() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={<FilterIcon />} width="compact" onClick={() => setOpen(true)}>
        Filter
      </Button>
      <FilterDrawer
        open={open}
        onOpenChange={setOpen}
        sort={{
          defaultValue: 'rarity',
          options: [
            { value: 'rarity', label: 'Rarity' },
            { value: 'level', label: 'Level' },
            { value: 'atk', label: 'Base ATK' },
          ],
        }}
        groups={[
          {
            label: 'Rarity',
            options: [
              { value: 's', label: 'S' },
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ],
          },
          {
            label: 'Agent Specialties',
            options: [
              { value: 'attack', label: 'Attack' },
              { value: 'stun', label: 'Stun' },
              { value: 'anomaly', label: 'Anomaly' },
              { value: 'support', label: 'Support' },
              { value: 'defense', label: 'Defense' },
              { value: 'rupture', label: 'Rupture' },
            ],
          },
        ]}
      />
    </>
  );
}
