import { useState } from 'react';
import {
  AchievementsIcon,
  AgentsIcon,
  BottomBar,
  IconButton,
  MailIcon,
  NoticesIcon,
  StorageIcon,
  StoreIcon,
} from '@angel1254mc/zone-ui';

const dock = [
  { id: 'mail', label: 'Mail', icon: <MailIcon /> },
  { id: 'notices', label: 'Notices', icon: <NoticesIcon /> },
  { id: 'achievements', label: 'Achievements', icon: <AchievementsIcon /> },
  { id: 'storage', label: 'Storage', icon: <StorageIcon /> },
  { id: 'agents', label: 'Agents', icon: <AgentsIcon /> },
  { id: 'store', label: 'Store', icon: <StoreIcon /> },
];

export default function IconDock() {
  const [opened, setOpened] = useState('Nothing opened yet');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <output style={{ padding: '24px 24px 0', color: 'var(--zzz-color-text-muted)' }}>{opened}</output>
      <BottomBar
        right={dock.map((item) => (
          <IconButton key={item.id} icon={item.icon} label={item.label} onClick={() => setOpened(item.label)} />
        ))}
      />
    </div>
  );
}
