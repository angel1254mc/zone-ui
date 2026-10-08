import { Button, FilterIcon, IconButton, KeyHint, LockIcon, RecycleIcon, TopBar } from '@angel1254mc/zone-ui';

export default function Actions() {
  return (
    <TopBar
      onBack={() => {}}
      left={
        <Button size="md" width="compact" icon={<FilterIcon />}>
          Filter
        </Button>
      }
      right={
        <>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <KeyHint keyCap="T" />
            <IconButton icon={<LockIcon />} label="Lock" toggle />
          </span>
          <Button width="compact" icon={<RecycleIcon />} iconTone="recycle">
            Recycle
          </Button>
        </>
      }
    />
  );
}
