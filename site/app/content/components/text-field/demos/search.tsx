import { useState } from 'react';
import { SearchIcon, Text, TextField } from '@angel1254mc/zone-ui';

const agents = ['Anby', 'Billy', 'Nicole', 'Nekomata', 'Ellen', 'Lycaon', 'Corin', 'Rina'];

export default function Search() {
  const [query, setQuery] = useState('');
  const matches = agents.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 400 }}>
      <TextField
        type="search"
        aria-label="Search agents"
        icon={<SearchIcon />}
        placeholder="Search agents"
        value={query}
        onValueChange={setQuery}
      />
      <Text role="body" tone="muted" aria-live="polite">
        {matches.length ? matches.join(', ') : 'No agents found'}
      </Text>
    </div>
  );
}
