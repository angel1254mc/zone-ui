import {
  ConsumablesCategoryIcon,
  DriveDiscCategoryIcon,
  IconTabs,
  MaterialsCategoryIcon,
  WEngineCategoryIcon,
} from '@angel1254mc/zone-ui';

export default function IconTabsHero() {
  return (
    <IconTabs
      aria-label="Storage category"
      defaultValue="wengine"
      items={[
        { value: 'wengine', label: 'W-Engine', icon: <WEngineCategoryIcon /> },
        { value: 'disc', label: 'Drive Disc', icon: <DriveDiscCategoryIcon /> },
        { value: 'materials', label: 'Materials', icon: <MaterialsCategoryIcon /> },
        { value: 'consumables', label: 'Consumables', icon: <ConsumablesCategoryIcon /> },
      ]}
    />
  );
}
