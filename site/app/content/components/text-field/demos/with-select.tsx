import { SearchIcon, Select, TextField } from '@angel1254mc/zone-ui';

export default function WithSelect() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, width: '100%', maxWidth: 640 }}>
      <Select
        aria-label="Search in"
        width={260}
        defaultValue="agents"
        options={[
          { value: 'agents', label: 'Agents' },
          { value: 'w-engines', label: 'W-Engines' },
          { value: 'bangboo', label: 'Bangboo' },
        ]}
      />
      <TextField
        type="search"
        aria-label="Search"
        icon={<SearchIcon />}
        placeholder="Search"
        style={{ flex: '1 1 220px' }}
      />
    </div>
  );
}
