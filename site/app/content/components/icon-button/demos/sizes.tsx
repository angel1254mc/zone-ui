import { Button, FilterIcon, IconButton, SearchIcon, TrashIcon } from '@angel1254mc/zone-ui';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <IconButton size={size} icon={<FilterIcon />} label="Filter" />
          <IconButton size={size} icon={<TrashIcon />} label="Discard" pressed />
          <IconButton size={size} icon={<SearchIcon />} label="Search" disabled />
          <Button size={size}>Apply</Button>
        </div>
      ))}
    </div>
  );
}
