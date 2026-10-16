import { useState } from 'react';
import { DropdownMenu, IconButton, MailIcon, MoreIcon, NoticesIcon, OptionsIcon } from '@angel1254mc/zone-ui';

export default function IconTrigger() {
  const [opened, setOpened] = useState('nothing yet');
  return (
    <div style={{ minHeight: 190 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <output style={{ color: 'var(--zzz-color-text-muted)' }}>Opened: {opened}</output>
        <DropdownMenu
          trigger={<IconButton label="More" icon={<MoreIcon />} />}
          placement="bottom-end"
          topBar={false}
          width={220}
          onSelect={setOpened}
          items={[
            { id: 'mail', label: 'Mail', icon: <MailIcon /> },
            { id: 'notices', label: 'Notices', icon: <NoticesIcon /> },
            { id: 'options', label: 'Options', icon: <OptionsIcon /> },
          ]}
        />
      </div>
    </div>
  );
}
