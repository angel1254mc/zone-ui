import { useState } from 'react';
import {
  ConsumablesCategoryIcon,
  DriveDiscCategoryIcon,
  IconTabs,
  MaterialsCategoryIcon,
  SectionTitleStrip,
  WEngineCategoryIcon,
} from '@angel1254mc/zone-ui';

const sections = [
  { value: 'w-engines', icon: <WEngineCategoryIcon />, label: 'W-Engines', title: 'W-Engine Storage', count: 113 },
  {
    value: 'drive-discs',
    icon: <DriveDiscCategoryIcon />,
    label: 'Drive Discs',
    title: 'Drive Disc Storage',
    count: 161,
  },
  { value: 'materials', icon: <MaterialsCategoryIcon />, label: 'Materials', title: 'Material Storage', count: 48 },
  { value: 'consumables', icon: <ConsumablesCategoryIcon />, label: 'Consumables', title: 'Consumables', count: 12 },
];

export default function StripWithTabs() {
  const [value, setValue] = useState('drive-discs');
  const current = sections.find((s) => s.value === value) ?? sections[0];
  return (
    <div style={{ minWidth: 'calc(1100 * var(--zzz-px))', paddingBottom: 24 }}>
      <SectionTitleStrip
        title={current.title}
        count={[current.count, 3000]}
        right={<IconTabs items={sections} value={value} onValueChange={setValue} aria-label="Storage category" />}
      />
    </div>
  );
}
