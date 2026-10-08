import { FilterIcon, IconButton, LockIcon, SearchIcon, Tooltip, TrashIcon } from '@angel1254mc/zone-ui';

const actions = [
  { icon: <FilterIcon />, label: 'Filter' },
  { icon: <SearchIcon />, label: 'Search' },
  { icon: <LockIcon />, label: 'Lock' },
  { icon: <TrashIcon />, label: 'Discard' },
];

export default function IconButtons() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '72px 40px 28px',
        borderRadius: 12,
        background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
      }}
    >
      {actions.map((action) => (
        <Tooltip key={action.label} content={action.label}>
          <IconButton icon={action.icon} label={action.label} />
        </Tooltip>
      ))}
    </div>
  );
}
