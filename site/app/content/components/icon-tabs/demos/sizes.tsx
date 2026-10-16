import {
  ConsumablesCategoryIcon,
  DriveDiscCategoryIcon,
  IconTabs,
  MaterialsCategoryIcon,
  WEngineCategoryIcon,
} from '@angel1254mc/zone-ui';

const items = [
  { value: 'wengine', label: 'W-Engine', icon: <WEngineCategoryIcon /> },
  { value: 'disc', label: 'Drive Disc', icon: <DriveDiscCategoryIcon /> },
  { value: 'materials', label: 'Materials', icon: <MaterialsCategoryIcon /> },
  { value: 'consumables', label: 'Consumables', icon: <ConsumablesCategoryIcon />, disabled: true },
];

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 36, justifyItems: 'start' }}>
      <IconTabs aria-label="Storage, small" size="sm" items={items} defaultValue="disc" />
      <IconTabs aria-label="Storage, medium" size="md" items={items} defaultValue="disc" />
      <IconTabs aria-label="Storage, large" size="lg" items={items} defaultValue="disc" />
    </div>
  );
}
