import { KeyHints } from '@angel1254mc/zone-ui';

const hints = [
  { keyCap: 'R', label: 'Discard' },
  { keyCap: 'T', label: 'Lock' },
  { keyCap: 'F', label: 'Filter' },
];

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <KeyHints size="sm" align="start" hints={hints} />
      <KeyHints size="md" align="start" hints={hints} />
      <KeyHints size="lg" align="start" hints={hints} />
    </div>
  );
}
