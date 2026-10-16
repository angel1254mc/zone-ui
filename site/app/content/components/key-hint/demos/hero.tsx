import { KeyHints } from '@angel1254mc/zone-ui';

export default function KeyHintHero() {
  return (
    <KeyHints
      hints={[
        { keyCap: 'R', label: 'Discard' },
        { keyCap: 'T', label: 'Lock' },
        { keyCap: 'F', label: 'Filter' },
      ]}
    />
  );
}
