import { FilterIcon, IconButton, InfoAlertIcon, LockIcon, SearchIcon, StarIcon, TrashIcon } from '@angel1254mc/zone-ui';

export default function IconButtonHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <IconButton icon={<FilterIcon />} label="Filter" />
      <IconButton icon={<SearchIcon />} label="Search" />
      <IconButton icon={<LockIcon />} label="Unlock" tone="lockOn" />
      <IconButton icon={<StarIcon />} label="Favourite" />
      <IconButton icon={<TrashIcon />} label="Discard" />
      <IconButton icon={<InfoAlertIcon />} label="Details" />
    </div>
  );
}
