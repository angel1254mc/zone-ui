import { BottomBar, FilterIcon, IconButton } from '@angel1254mc/zone-ui';

export default function KeyHints() {
  return (
    <div style={{ paddingTop: 48 }}>
      <BottomBar
        separator
        left={<IconButton icon={<FilterIcon />} label="Filter" />}
        hints={[
          { keyCap: 'R', label: 'Discard' },
          { keyCap: 'T', label: 'Lock' },
        ]}
      />
    </div>
  );
}
