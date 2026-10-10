import { useState } from 'react';
import { Button, FilterIcon, TagButton, Text } from '@angel1254mc/zone-ui';

export default function DrawerHeader() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button icon={<FilterIcon />} width="compact" onClick={() => setOpen(true)}>
        Filter
      </Button>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 480,
        padding: '12px 12px 12px 24px',
        borderRadius: 16,
        background: 'var(--zzz-color-surface-raised)',
      }}
    >
      <Text role="bodyXl" italic>
        Filter
      </Text>
      <TagButton kind="close" label="Close filters" onClick={() => setOpen(false)} />
    </div>
  );
}
