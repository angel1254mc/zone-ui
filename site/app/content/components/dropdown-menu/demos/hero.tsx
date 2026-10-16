import { useState } from 'react';
import { Button, DropdownMenu } from '@angel1254mc/zone-ui';

export default function DropdownMenuHero() {
  const [section, setSection] = useState('none yet');
  return (
    <div style={{ minHeight: 270 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <DropdownMenu
          trigger={<Button width="compact">More</Button>}
          onSelect={setSection}
          items={[
            { id: 'news', label: 'News' },
            { id: 'notices', label: 'Notices' },
            { id: 'events', label: 'Events' },
            { id: 'agents', label: 'Agents' },
            { id: 'archive', label: 'Archive', disabled: true },
          ]}
        />
        <output style={{ color: 'var(--zzz-color-text-muted)' }}>Chosen: {section}</output>
      </div>
    </div>
  );
}
