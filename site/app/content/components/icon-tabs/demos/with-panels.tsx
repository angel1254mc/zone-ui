import { useState } from 'react';
import {
  ConsumablesCategoryIcon,
  DriveDiscCategoryIcon,
  IconTabs,
  MaterialsCategoryIcon,
  TabPanel,
  WEngineCategoryIcon,
} from '@angel1254mc/zone-ui';

const shelves = [
  { value: 'wengine', label: 'W-Engine', icon: <WEngineCategoryIcon />, count: 38 },
  { value: 'disc', label: 'Drive Disc', icon: <DriveDiscCategoryIcon />, count: 412 },
  { value: 'materials', label: 'Materials', icon: <MaterialsCategoryIcon />, count: 96 },
  { value: 'consumables', label: 'Consumables', icon: <ConsumablesCategoryIcon />, count: 17 },
];

export default function WithPanels() {
  const [shelf, setShelf] = useState('wengine');
  return (
    <div style={{ display: 'grid', gap: 28, justifyItems: 'start' }}>
      <IconTabs
        id="storage-tabs"
        aria-label="Storage category"
        items={shelves}
        value={shelf}
        onValueChange={setShelf}
      />
      {shelves.map((s) => (
        <TabPanel key={s.value} tabsId="storage-tabs" value={s.value} hidden={s.value !== shelf}>
          <strong>{s.label} storage</strong>
          <div style={{ color: 'var(--zzz-color-text-muted)' }}>{s.count} items</div>
        </TabPanel>
      ))}
    </div>
  );
}
