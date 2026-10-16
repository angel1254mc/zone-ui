import { BottomBar, FilterIcon, IconButton } from '@angel1254mc/zone-ui';

export default function InABottomBar() {
  return (
    <BottomBar
      left={<IconButton icon={<FilterIcon />} label="Filter" />}
      hints={[
        { keyCap: 'R', label: 'Discard' },
        { keyCap: 'T', label: 'Lock' },
      ]}
    />
  );
}
